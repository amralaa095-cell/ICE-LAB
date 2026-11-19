/* ICE Lab simulation system.
   One engine runs every device. Each device is a configuration (lab/dev_*.js) written from the ICE Lab manual:
   its controls, instruments, experiments (the manual's procedure steps and results tables), equations and charts.
   The engine draws the control panel, checks each procedure step against the simulated machine, records readings
   into the manual's table, works out the calculated columns and plots the manual's charts. */
(function(){
'use strict';
const LAB={defs:{},cur:null,s:null,t:0,speed:1,exp:0,rows:{},done:{},cal:{},tab:'proc',d3:null,lastWarn:''};
window.LAB=LAB;
const $=id=>document.getElementById(id);
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fmt=(v,dp)=>v==null||v===''||Number.isNaN(v)?'—':typeof v==='number'?(isFinite(v)?v.toFixed(dp==null?3:dp).replace(/^-(0\.?0*)$/,'$1'):'—'):esc(v);
const PAL=['#2a78d6','#eb6834','#1baf7a','#eda100','#6250d6','#8a8f98'];
/* reading noise: a fixed small random walk per channel, so the display flickers like a real instrument */
const NZ={};function noise(k,amp){if(!amp)return 0;const n=NZ[k]||(NZ[k]={v:0});n.v+= (Math.random()-0.5)*amp*0.6;n.v*=0.85;return n.v;}
LAB.def=function(cfg){LAB.defs[cfg.id]=cfg;};
LAB.for3d=function(id){return Object.values(LAB.defs).find(c=>[].concat(c.on3d).includes(id)||c.id===id);};

/* ---------- state helpers used by device files ---------- */
LAB.util={
  clamp:(v,a,b)=>Math.min(b,Math.max(a,v)),
  lag:(s,k,target,dt,tau)=>{s[k]+=(target-s[k])*(1-Math.exp(-dt/Math.max(1e-3,tau)));},
  lin:(x,xs,ys)=>{if(x<=xs[0])return ys[0];for(let i=1;i<xs.length;i++)if(x<=xs[i])return ys[i-1]+(ys[i]-ys[i-1])*(x-xs[i-1])/(xs[i]-xs[i-1]);return ys[ys.length-1];},
  bisect:(f,a,b,n)=>{let fa=f(a);for(let i=0;i<(n||60);i++){const m=(a+b)/2,fm=f(m);if((fm<0)===(fa<0)){a=m;fa=fm;}else b=m;}return (a+b)/2;},
  fit:(xs,ys)=>{const n=xs.length;if(n<2)return null;let sx=0,sy=0,sxx=0,sxy=0;for(let i=0;i<n;i++){sx+=xs[i];sy+=ys[i];sxx+=xs[i]*xs[i];sxy+=xs[i]*ys[i];}const d=n*sxx-sx*sx;if(!d)return null;const m=(n*sxy-sx*sy)/d;return {m,c:(sy-m*sx)/n};}
};

/* ---------- bind a device ---------- */
LAB.open=function(cfg,d3){
  LAB.cur=cfg;LAB.d3=d3||null;LAB.exp=0;LAB.t=0;LAB.speed=1;
  LAB.s=cfg.init();LAB.s._t=0;
  const key='icelab.lab.'+cfg.id;
  try{const o=JSON.parse(localStorage.getItem(key)||'null');if(o){LAB.rows=o.rows||{};LAB.done=o.done||{};LAB.cal=o.cal||{};}else{LAB.rows={};LAB.done={};LAB.cal={};}}catch(e){LAB.rows={};LAB.done={};LAB.cal={};}
  LAB.save=()=>{try{localStorage.setItem(key,JSON.stringify({rows:LAB.rows,done:LAB.done,cal:LAB.cal}));}catch(e){}};
  const el=$('lab');el.hidden=false;
  $('labName').textContent=cfg.title;$('labSrc').textContent=cfg.manual;
  LAB.tab='proc';render();
};
LAB.close=function(){LAB.cur=null;const el=$('lab');if(el)el.hidden=true;};

function exp(){return LAB.cur.experiments[LAB.exp];}
function rowsOf(e){return LAB.rows[e.id]||(LAB.rows[e.id]=[]);}
/* readings with calibration (span and zero per channel, like the real instruments) */
function readAll(){const c=LAB.cur,s=LAB.s,o={};c.readings.forEach(r=>{let v=r.get(s);if(typeof v==='number'&&isFinite(v)){v+=noise(c.id+r.id,r.nz||0);const k=LAB.cal[r.id];if(k)v=v*(k.span==null?1:k.span)+(k.zero||0);if(r.res)v=Math.round(v/r.res)*r.res;}o[r.id]=v;});return o;}
LAB.readAll=readAll;

/* ---------- main loop: runs the physics, animates the 3D, checks the steps and warnings ---------- */
let last=performance.now();
function loop(now){const dt=Math.min(0.1,(now-last)/1000);last=now;
  if(LAB.cur){const c=LAB.cur,s=LAB.s;let left=dt*LAB.speed;while(left>1e-6){const h=Math.min(left,0.05);c.step(s,h);s._t+=h;left-=h;}
    if(LAB.d3&&c.sync)try{c.sync(s,LAB.d3.s,LAB.d3);}catch(e){}
    tick(dt);}
  requestAnimationFrame(loop);}
requestAnimationFrame(loop);
let acc=0;function tick(dt){acc+=dt;if(acc<0.2)return;acc=0;drawLive();}

/* ---------- drawing ---------- */
function render(){const c=LAB.cur;if(!c)return;
  $('labExp').innerHTML=c.experiments.map((e,i)=>`<option value="${i}" ${i===LAB.exp?'selected':''}>${esc(e.title)}</option>`).join('');
  document.querySelectorAll('#labTabs button').forEach(b=>b.setAttribute('aria-selected',b.dataset.t===LAB.tab));
  $('labSpeed').value=String(LAB.speed);
  const B=$('labBody');
  if(LAB.tab==='proc')B.innerHTML=procHTML();
  else if(LAB.tab==='ctl')B.innerHTML=ctlHTML();
  else if(LAB.tab==='inst')B.innerHTML=instHTML();
  else if(LAB.tab==='res')B.innerHTML=resHTML();
  else if(LAB.tab==='chart')B.innerHTML=chartHTML();
  else if(LAB.tab==='cal')B.innerHTML=calHTML();
  else B.innerHTML=manHTML();
  drawLive();}
LAB.render=render;

function stepState(e,i){const st=e.steps[i];const k=e.id+':'+i;if(LAB.done[k])return 'done';if(st.check){try{if(st.check(LAB.s,rowsOf(e),LAB))return 'ok';}catch(x){}}return st.check?'wait':'manual';}
function procHTML(){const e=exp();let cur=-1;e.steps.forEach((st,i)=>{const z=stepState(e,i);if(cur<0&&z!=='done'&&z!=='ok')cur=i;});
  return `<div class="lb-aim"><b>Aim.</b> ${esc(e.aim||'')}</div>
  <ol class="lb-steps">${e.steps.map((st,i)=>{const z=stepState(e,i);const on=i===cur;return `<li class="lb-st ${z==='done'||z==='ok'?'ok':''} ${on?'now':''}"><span class="lb-n">${z==='done'||z==='ok'?'✓':i+1}</span><div><div>${esc(st.t)}</div>${st.check?`<div class="lb-chk">${z==='ok'||z==='done'?'Done on the machine.':'Checked on the machine'+(st.hint?': '+esc(st.hint):'')+'.'}</div>`:on||z==='done'?`<button type="button" class="lb-mini" data-done="${i}">${z==='done'?'Undo':'Mark done'}</button>`:''}${st.rec&&on?'<button type="button" class="lb-rec lb-mini" data-x="rec">Record reading</button>':''}</div></li>`;}).join('')}</ol>
  <div id="labLiveMini"></div>`;}
function ctlHTML(){const c=LAB.cur;let g='';return `<div class="lb-ctl">${c.controls.map((k,i)=>{let h='';if(k.group&&k.group!==g){g=k.group;h+=`<div class="lb-grp">${esc(g)}</div>`;}const v=k.get?k.get(LAB.s):null;const dis=k.enabled&&!k.enabled(LAB.s)?'disabled':'';
  if(k.type==='toggle')h+=`<button type="button" class="lb-tg" data-ci="${i}" aria-pressed="${!!v}" ${dis}><span>${esc(k.label)}</span><b>${esc(v?(k.on||'On'):(k.off||'Off'))}</b></button>`;
  else if(k.type==='select')h+=`<label class="lb-sel"><span>${esc(k.label)}</span><select data-ci="${i}" ${dis}>${k.options.map(o=>`<option value="${esc(o[0])}" ${String(o[0])===String(v)?'selected':''}>${esc(o[1])}</option>`).join('')}</select></label>`;
  else if(k.type==='button')h+=`<button type="button" class="lb-btn" data-ci="${i}" ${dis}>${esc(k.label)}</button>`;
  else h+=`<label class="lb-rng"><span>${esc(k.label)} <b id="lbv${i}">${fmt(v,k.dp==null?0:k.dp)}${k.unit?' '+esc(k.unit):''}</b></span><input type="range" data-ci="${i}" min="${k.min}" max="${k.max}" step="${k.step}" value="${v}" ${dis}></label>`;
  return h;}).join('')}</div>${c.ctlPanel?`<div class="lb-panel">${c.ctlPanel(LAB.s,LAB)}</div>`:''}<div id="labLiveMini"></div>`;}
function instHTML(){const c=LAB.cur;LAB._pk=null;return `${c.instPanel?'<div id="labPanel" class="lb-panel"></div>':''}<div class="lb-inst" id="labInst"></div>`;}
function calHTML(){const c=LAB.cur;return `<p class="lb-note">Each instrument channel has a span (gain) and zero (offset), as on the real panel. Readings shown and recorded are: raw × span + zero. Settings stay in this browser for this device.</p><div class="lb-cal">${c.readings.filter(r=>r.cal!==false).map(r=>{const k=LAB.cal[r.id]||{};return `<div><b>${esc(r.label)}</b> <span>${esc(r.unit||'')}</span><label>Span <input type="number" step="0.001" data-cal="${r.id}|span" value="${k.span==null?1:k.span}"></label><label>Zero <input type="number" step="0.001" data-cal="${r.id}|zero" value="${k.zero||0}"></label></div>`;}).join('')}</div><p><button type="button" class="lb-mini" data-x="calreset">Reset all to span 1, zero 0</button></p>`;}
function manHTML(){const c=LAB.cur;return `<div class="lb-man"><p><b>Manual:</b> ${esc(c.manual)}</p>${c.about?`<p>${esc(c.about)}</p>`:''}
  <h4>Values used, from the manual</h4><ul>${(c.constants||[]).map(x=>`<li>${esc(x)}</li>`).join('')}</ul>
  ${c.assume&&c.assume.length?`<h4>Not in the manual (assumed for the simulation)</h4><ul>${c.assume.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:''}
  ${c.issues&&c.issues.length?`<h4>Points to check in the manual</h4><ul>${c.issues.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:''}</div>`;}
function resHTML(){const e=exp(),R=rowsOf(e),cols=e.table;
  const rows=R.map((r,i)=>{const full=calcRow(e,r,R);return `<tr><td>${i+1}</td>${cols.map(k=>`<td>${fmt(full[k.k],k.dp)}</td>`).join('')}<td><button type="button" class="lb-x" data-del="${i}" aria-label="Delete row ${i+1}">×</button></td></tr>`;}).join('');
  const sum=e.summary?e.summary(R.map(r=>calcRow(e,r,R)),LAB.s):null;
  return `<div class="lb-tw"><table><thead><tr><th>#</th>${cols.map(k=>`<th>${esc(k.label)}${k.unit?`<br><span>${esc(k.unit)}</span>`:''}</th>`).join('')}<th></th></tr></thead><tbody>${rows||`<tr><td colspan="${cols.length+2}" class="lb-empty">No readings yet. Follow the procedure and press Record reading.</td></tr>`}</tbody></table></div>
  ${sum?`<div class="lb-sum">${sum.map(([a,b])=>`<div><span>${esc(a)}</span><b>${esc(b)}</b></div>`).join('')}</div>`:''}
  <p class="lb-bar"><button type="button" class="lb-mini" data-x="rec">Record reading</button><button type="button" class="lb-mini" data-x="copy">Copy table</button><button type="button" class="lb-mini" data-x="clear">Clear this table</button></p>`;}
function calcRow(e,r,R){const o=Object.assign({},r);(e.calc||[]).forEach(f=>{try{Object.assign(o,f(o,R,LAB.s)||{});}catch(x){}});return o;}
LAB.calcRow=calcRow;

/* ---------- charts (SVG) ---------- */
function chartHTML(){const e=exp();const R=rowsOf(e).map(r=>calcRow(e,r,rowsOf(e)));if(!e.charts||!e.charts.length)return '<p class="lb-note">The manual asks for no chart in this experiment.</p>';
  return e.charts.map(ch=>svgChart(ch,R)).join('');}
function svgChart(ch,R){const W=720,H=340,L=64,Rr=16,T=34,Bm=52;const ser=(ch.series||[]).map((s,i)=>({...s,c:PAL[i%PAL.length],pts:(s.points?s.points(R,LAB.s):R.map(r=>[ch.x(r),s.y(r)])).filter(p=>isFinite(p[0])&&isFinite(p[1]))}));
  const all=ser.flatMap(s=>s.pts);if(!all.length)return `<div class="lb-chart"><h4>${esc(ch.title)}</h4><p class="lb-empty">Record readings to draw this chart.</p></div>`;
  let x0=Math.min(...all.map(p=>p[0])),x1=Math.max(...all.map(p=>p[0])),y0=Math.min(...all.map(p=>p[1])),y1=Math.max(...all.map(p=>p[1]));
  if(ch.zeroY!==false&&y0>0)y0=0;if(ch.zeroX&&x0>0)x0=0;if(x1===x0){x1+=1;x0-=1;}if(y1===y0){y1+=1;y0-=1;}const py=(y1-y0)*0.08;y1+=py;if(y0<0||ch.zeroY===false)y0-=py;
  const X=v=>L+(v-x0)/(x1-x0)*(W-L-Rr),Y=v=>H-Bm-(v-y0)/(y1-y0)*(H-T-Bm);
  const tk=(a,b)=>{const n=5,st=niceStep((b-a)/n);const o=[];for(let v=Math.ceil(a/st)*st;v<=b+1e-9;v+=st)o.push(+v.toPrecision(10));return o;};
  let g=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(ch.title)}">`;
  tk(y0,y1).forEach(v=>{g+=`<line x1="${L}" x2="${W-Rr}" y1="${Y(v)}" y2="${Y(v)}" stroke="#e4e7ec"/><text x="${L-8}" y="${Y(v)+4}" text-anchor="end" class="ax">${num(v)}</text>`;});
  tk(x0,x1).forEach(v=>{g+=`<text x="${X(v)}" y="${H-Bm+18}" text-anchor="middle" class="ax">${num(v)}</text>`;});
  g+=`<line x1="${L}" x2="${W-Rr}" y1="${H-Bm}" y2="${H-Bm}" stroke="#8a93a3"/><text x="${(L+W-Rr)/2}" y="${H-10}" text-anchor="middle" class="at">${esc(ch.xl)}</text><text x="14" y="${(T+H-Bm)/2}" transform="rotate(-90 14 ${(T+H-Bm)/2})" text-anchor="middle" class="at">${esc(ch.yl)}</text>`;
  ser.forEach(s=>{const P=s.pts.slice().sort((a,b)=>a[0]-b[0]);if(s.line!==false&&P.length>1)g+=`<polyline fill="none" stroke="${s.c}" stroke-width="2" ${s.dash?'stroke-dasharray="6 5"':''} points="${P.map(p=>X(p[0])+','+Y(p[1])).join(' ')}"/>`;if(s.dots!==false)P.forEach(p=>{g+=`<circle cx="${X(p[0])}" cy="${Y(p[1])}" r="4.5" fill="${s.c}" stroke="#fff" stroke-width="2"><title>${esc(s.name)}: ${num(p[0])}, ${num(p[1])}</title></circle>`;});});
  g+='</svg>';
  return `<div class="lb-chart"><h4>${esc(ch.title)}</h4>${g}<div class="lb-leg">${ser.map(s=>`<span><i style="background:${s.c}${s.dash?';height:2px':''}"></i>${esc(s.name)}</span>`).join('')}</div>${ch.note?`<p class="lb-note">${esc(ch.note(R,LAB.s)||'')}</p>`:''}</div>`;}
function niceStep(r){const p=Math.pow(10,Math.floor(Math.log10(Math.abs(r)||1)));const m=r/p;return (m<1.5?1:m<3?2:m<7?5:10)*p;}
function num(v){const a=Math.abs(v);return a>=1000||a===0?String(+v.toFixed(0)):a>=10?String(+v.toFixed(1)):a>=1?String(+v.toFixed(2)):String(+v.toPrecision(2));}

/* ---------- live parts: instruments, warnings, step checks ---------- */
function drawLive(){const c=LAB.cur;if(!c)return;const v=readAll();LAB.last=v;
  const inst=c.readings.filter(r=>!r.hide).map(r=>`<div class="lb-dsp ${r.big?'big':''}"><span>${esc(r.label)}</span><b>${fmt(v[r.id],r.dp)}</b><i>${esc(r.unit||'')}</i></div>`).join('');
  const i1=$('labInst');if(i1)i1.innerHTML=inst;
  const pn=$('labPanel');if(pn&&c.instPanel){const k=c.panelKey?c.panelKey(LAB.s):Math.random();if(k!==LAB._pk){LAB._pk=k;pn.innerHTML=c.instPanel(LAB.s,LAB);}}
  const m=$('labLiveMini');if(m)m.innerHTML=`<div class="lb-inst sm">${c.readings.filter(r=>!r.hide&&r.key!==false).slice(0,8).map(r=>`<div class="lb-dsp"><span>${esc(r.label)}</span><b>${fmt(v[r.id],r.dp)}</b><i>${esc(r.unit||'')}</i></div>`).join('')}</div>`;
  /* warnings from the manual's safety notes */
  const W=(c.warnings||[]).filter(w=>{try{return w.when(LAB.s);}catch(e){return false;}});const wb=$('labWarn');const txt=W.map(w=>w.msg).join(' ');if(wb&&txt!==LAB.lastWarn){LAB.lastWarn=txt;wb.hidden=!W.length;wb.innerHTML=W.map(w=>`<div class="${w.level||'warn'}">${esc(w.msg)}</div>`).join('');}
  if(LAB.tab==='proc'){const e=exp();let changed=false;e.steps.forEach((st,i)=>{const el=document.querySelector(`.lb-steps li:nth-child(${i+1})`);if(!el)return;const z=stepState(e,i);const ok=z==='ok'||z==='done';if(el.classList.contains('ok')!==ok)changed=true;});if(changed)render();}
  if(LAB.tab==='ctl'){c.controls.forEach((k,i)=>{if(!k.get)return;const b=$('lbv'+i);if(b)b.textContent=fmt(k.get(LAB.s),k.dp==null?0:k.dp)+(k.unit?' '+k.unit:'');const t=document.querySelector(`#labBody [data-ci="${i}"]`);if(t){if(k.enabled)t.disabled=!k.enabled(LAB.s);if(k.type==='toggle'){const on=!!k.get(LAB.s);if(t.getAttribute('aria-pressed')!==String(on)){t.setAttribute('aria-pressed',on);t.querySelector('b').textContent=on?(k.on||'On'):(k.off||'Off');}}else if(k.type==='range'&&document.activeElement!==t&&+t.value!==+k.get(LAB.s))t.value=k.get(LAB.s);}});}
  const clk=$('labClock');if(clk){const t=LAB.s._t;clk.textContent=`${Math.floor(t/60)}:${String(Math.floor(t%60)).padStart(2,'0')}`;}}

/* ---------- recording ---------- */
LAB.record=function(){const c=LAB.cur,e=exp();if(e.guard){const g=e.guard(LAB.s,rowsOf(e));if(g){LAB.msg(g);return;}}const v=readAll();const row={};e.table.forEach(k=>{if(k.from)row[k.k]=k.from(v,LAB.s,rowsOf(e));});rowsOf(e).push(row);LAB.save();LAB.msg('Reading '+rowsOf(e).length+' recorded.');if(LAB.tab==='res'||LAB.tab==='chart'||LAB.tab==='proc')render();};
LAB.msg=function(t){const el=$('labMsg');if(!el)return;el.textContent=t;el.hidden=false;clearTimeout(LAB._mt);LAB._mt=setTimeout(()=>{el.hidden=true;},4000);};

/* ---------- events ---------- */
document.addEventListener('click',ev=>{const b=ev.target.closest&&ev.target.closest('#lab button');if(!b||!LAB.cur)return;const c=LAB.cur;
  if(b.dataset.t){LAB.tab=b.dataset.t;render();return;}
  if(b.dataset.pe!=null){if(c.pe)c.pe(LAB.s,b.dataset.pe,b,LAB);if(!b.dataset.keep)render();return;}
  if(b.dataset.ci!=null){const k=c.controls[+b.dataset.ci];if(k.type==='toggle'){k.set(LAB.s,!k.get(LAB.s),LAB);}else if(k.type==='button'){k.act(LAB.s,LAB);}render();return;}
  if(b.dataset.done!=null){const key=exp().id+':'+b.dataset.done;LAB.done[key]=!LAB.done[key];LAB.save();render();return;}
  if(b.dataset.del!=null){rowsOf(exp()).splice(+b.dataset.del,1);LAB.save();render();return;}
  const x=b.dataset.x;
  if(x==='rec')LAB.record();
  else if(x==='clear'){LAB.rows[exp().id]=[];Object.keys(LAB.done).forEach(k=>{if(k.indexOf(exp().id+':')===0)delete LAB.done[k];});LAB.save();render();}
  else if(x==='copy'){const e=exp(),R=rowsOf(e);const lines=[['#'].concat(e.table.map(k=>k.label+(k.unit?' ('+k.unit+')':''))).join('\t')].concat(R.map((r,i)=>{const f=calcRow(e,r,R);return [i+1].concat(e.table.map(k=>typeof f[k.k]==='number'?f[k.k].toFixed(k.dp==null?3:k.dp):(f[k.k]||''))).join('\t');}));const t=lines.join('\n');(navigator.clipboard&&navigator.clipboard.writeText?navigator.clipboard.writeText(t):Promise.reject()).then(()=>LAB.msg('Table copied. Paste it into Excel.'),()=>LAB.msg('Copy is not allowed here; select the table and copy it.'));}
  else if(x==='calreset'){LAB.cal={};LAB.save();render();}
  else if(x==='reset'){LAB.s=c.init();LAB.s._t=0;LAB.msg('Machine reset to its starting state.');render();}
});
document.addEventListener('input',ev=>{const t=ev.target;if(!LAB.cur||!t.closest||!t.closest('#lab'))return;const c=LAB.cur;
  if(t.dataset.ci!=null&&t.type==='range'){const k=c.controls[+t.dataset.ci];k.set(LAB.s,+t.value,LAB);const b=$('lbv'+t.dataset.ci);if(b)b.textContent=fmt(k.get(LAB.s),k.dp==null?0:k.dp)+(k.unit?' '+k.unit:'');}
  if(t.dataset.cal){const [id,f]=t.dataset.cal.split('|');const k=LAB.cal[id]||(LAB.cal[id]={});k[f]=+t.value;LAB.save();}});
document.addEventListener('change',ev=>{const t=ev.target;if(!LAB.cur||!t.closest||!t.closest('#lab'))return;const c=LAB.cur;
  if(t.id==='labExp'){LAB.exp=+t.value;if(c.onExp)c.onExp(LAB.s,c.experiments[LAB.exp]);render();return;}
  if(t.id==='labSpeed'){LAB.speed=+t.value;return;}
  if(t.dataset.pe!=null&&c.pe&&t.tagName!=='BUTTON'){c.pe(LAB.s,t.dataset.pe,t,LAB);return;}
  if(t.dataset.ci!=null&&t.tagName==='SELECT'){const k=c.controls[+t.dataset.ci];k.set(LAB.s,t.value,LAB);render();}});
})();
