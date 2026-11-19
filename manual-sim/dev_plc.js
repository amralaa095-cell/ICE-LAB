/* CE111 PLC Process with the CE123 PLC Trainer · "PLC Process Trainer (CE111).pdf" (Chapter 11).
   The PLC runs the student's program written as a Mitsubishi FX instruction list (the List view of GX Developer). */
(function(){const {tog,rng,sel,btn,rd,col}=LK,U=LAB.util;
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* ---------------- instruction-list PLC ---------------- */
const OPS={LD:1,LDI:1,LDP:1,LDF:1,AND:1,ANI:1,ANDP:1,ANDF:1,OR:1,ORI:1,ORP:1,ORF:1,ANB:0,ORB:0,MPS:0,MRD:0,MPP:0,INV:0,OUT:1,SET:1,RST:1,PLS:1,PLF:1,MC:2,MCR:1,END:0,NOP:0};
const DEV=/^(X[0-7]|Y[0-7]|M\d{1,4}|T\d{1,2}|C\d{1,2}|S\d{1,3})$/;
function parse(src){const P=[],E=[];src.split(/\r?\n/).forEach((raw,ln)=>{let l=raw.replace(/;.*$/,'').trim();if(!l)return;l=l.replace(/^\d+\s+/,'');const w=l.toUpperCase().split(/[\s,]+/);const op=w[0];
  if(!(op in OPS)){E.push(`Line ${ln+1}: unknown instruction “${esc(w[0])}”.`);return;}
  const d=w[1],ins={op,d,ln};
  if(OPS[op]===1&&op!=='MCR'&&!(d&&(DEV.test(d)||/^M80(00|02|13)$/.test(d)))){E.push(`Line ${ln+1}: “${esc(op)}” needs a device such as X0, Y1, M10, T0 or C0.`);return;}
  if(op==='OUT'&&d&&/^[TC]/.test(d)){const k=(w[2]||'').match(/^K(\d+)$/);if(!k){E.push(`Line ${ln+1}: OUT ${d} needs a constant, e.g. OUT ${d} K30.`);return;}ins.k=+k[1];}
  if(op==='OUT'&&d&&/^X/.test(d)){E.push(`Line ${ln+1}: an input (${d}) cannot be an output.`);return;}
  if(op==='MC'){if(!/^N\d$/.test(w[1]||'')||!/^M\d+$/.test(w[2]||'')){E.push(`Line ${ln+1}: write MC N0 M100 (nesting level and an M relay).`);return;}ins.n=+w[1].slice(1);ins.m=w[2];}
  if(op==='MCR'){if(!/^N\d$/.test(w[1]||'')){E.push(`Line ${ln+1}: write MCR N0.`);return;}ins.n=+w[1].slice(1);}
  if(/^T(\d+)$/.test(d||'')&&+d.slice(1)>63)E.push(`Line ${ln+1}: timers are T0 to T63 on the CE123 (FX1S).`);
  if(/^C(\d+)$/.test(d||'')&&+d.slice(1)>31)E.push(`Line ${ln+1}: counters are C0 to C31 here.`);
  P.push(ins);});
  if(P.length&&P[P.length-1].op!=='END')E.push('The program should finish with END.');
  const mc=P.filter(i=>i.op==='MC').length,mcr=P.filter(i=>i.op==='MCR').length;if(mc!==mcr)E.push('Every MC needs a matching MCR.');
  return {P,E};}
function newMem(){return {M:{},T:{},C:{},Tacc:{},Cprev:{},prev:{},Y:{},first:true};}
function get(mem,io,d,t){if(d==='M8000')return true;if(d==='M8002')return mem.first;if(d==='M8013')return (t%1)<0.5;
  const k=d[0],n=d.slice(1);if(k==='X')return !!io.X[+n];if(k==='Y')return !!mem.Y[+n];if(k==='M'||k==='S')return !!mem.M[d];if(k==='T')return !!mem.T[d];if(k==='C')return !!mem.C[d];return false;}
function scan(prog,mem,io,dt,t){let acc=false;const st=[],mps=[];let mcOff=0;const mcLv=[];const lnOn={};
  for(const i of prog){const op=i.op,d=i.d;const v=d?get(mem,io,d,t):false;const edge=k=>{const p=mem.prev[k+i.ln];mem.prev[k+i.ln]=v;return k==='P'?v&&!p:!v&&p;};
    switch(op){case 'LD':if(st.length||acc!==undefined)st.push(acc);acc=v;break;case 'LDI':st.push(acc);acc=!v;break;case 'LDP':st.push(acc);acc=edge('P');break;case 'LDF':st.push(acc);acc=edge('F');break;
      case 'AND':acc=acc&&v;break;case 'ANI':acc=acc&&!v;break;case 'ANDP':acc=acc&&edge('P');break;case 'ANDF':acc=acc&&edge('F');break;
      case 'OR':acc=acc||v;break;case 'ORI':acc=acc||!v;break;case 'ORP':acc=acc||edge('P');break;case 'ORF':acc=acc||edge('F');break;
      case 'ANB':acc=st.pop()&&acc;break;case 'ORB':acc=st.pop()||acc;break;case 'MPS':mps.push(acc);break;case 'MRD':acc=mps[mps.length-1];break;case 'MPP':acc=mps.pop();break;case 'INV':acc=!acc;break;
      case 'OUT':{const a=acc&&!mcOff;if(/^T/.test(d)){if(a){mem.Tacc[d]=Math.min(i.k*0.1,(mem.Tacc[d]||0)+dt);}else mem.Tacc[d]=0;mem.T[d]=mem.Tacc[d]>=i.k*0.1-1e-9;mem.Tk=mem.Tk||{};mem.Tk[d]=i.k;}
        else if(/^C/.test(d)){const p=mem.Cprev[d];mem.Cprev[d]=a;if(a&&!p&&(mem.Tacc[d]||0)<i.k){mem.Tacc[d]=(mem.Tacc[d]||0)+1;}mem.C[d]=(mem.Tacc[d]||0)>=i.k;mem.Ck=mem.Ck||{};mem.Ck[d]=i.k;}
        else if(d[0]==='Y')mem.Y[+d.slice(1)]=a;else mem.M[d]=a;break;}
      case 'SET':if(acc&&!mcOff){if(d[0]==='Y')mem.Y[+d.slice(1)]=true;else mem.M[d]=true;}break;
      case 'RST':if(acc&&!mcOff){if(d[0]==='Y')mem.Y[+d.slice(1)]=false;else if(/^[TC]/.test(d)){mem.Tacc[d]=0;(d[0]==='T'?mem.T:mem.C)[d]=false;}else mem.M[d]=false;}break;
      case 'PLS':{const p=mem.prev['pls'+i.ln];mem.prev['pls'+i.ln]=acc;mem.M[d]=acc&&!p&&!mcOff;break;}
      case 'PLF':{const p=mem.prev['plf'+i.ln];mem.prev['plf'+i.ln]=acc;mem.M[d]=!acc&&p&&!mcOff;break;}
      case 'MC':mem.M[i.m]=acc&&!mcOff;mcLv.push(!(acc&&!mcOff));if(!(acc&&!mcOff))mcOff++;break;
      case 'MCR':{const off=mcLv.pop();if(off)mcOff=Math.max(0,mcOff-1);break;}
      case 'END':break;}
    lnOn[i.ln]=d?v:acc;if(op==='END')break;}
  mem.first=false;return lnOn;}

/* ---------------- CE111 process ---------------- */
const CAP=2.0;/* litres per tank */
function process(s,dt){const Y=s.act;const pump=Y[0],v1=Y[1],v2=Y[2],v3=Y[3],v4=Y[4];const Q=pump&&s.res>0.05?3.0*s.speed/100:0;/* L/min */
  let toT1=0,byp=0;if(Q>0){if(v1&&v2){toT1=Q*0.45;byp=Q-toT1;}else if(v2)toT1=Q;else if(v1)byp=Q;else{s.dead+=dt;}}
  if(!(pump&&!v1&&!v2))s.dead=Math.max(0,s.dead-dt*0.5);
  const d3=v3?2.4*Math.sqrt(Math.max(0,s.t1)):0,d4=v4?2.4*Math.sqrt(Math.max(0,s.t2)):0;/* L/min */
  s.t1+=(toT1-d3)/60*dt/CAP;s.t2+=(d3-d4)/60*dt/CAP;let ov=0;if(s.t1>1.05){ov+=s.t1-1.05;s.t1=1.05;}if(s.t2>1.05){ov+=s.t2-1.05;s.t2=1.05;}
  s.res+=(-toT1/60*dt+d4/60*dt)/6+ov*CAP/6;s.res=U.clamp(s.res,0,1);s.ovf=ov>0?2:Math.max(0,(s.ovf||0)-dt);
  s.flow=Q>0&&(toT1>0||byp>0)?Q:0;s.fph=(s.fph||0)+s.flow*4*dt;/* flow meter pulses: 4 per litre/min per s */
  /* float switches have a little hysteresis (about 1.5% of the tank) */
  const hy=(o,v,th)=>o?v>th-0.015:v>th+0.015;const S=s.sens||[];
  s.t1=Math.max(0,s.t1);s.t2=Math.max(0,s.t2);
  s.sens=[Math.floor(s.fph*2)%2===1&&s.flow>0,hy(S[1],s.t2,0.15),hy(S[2],s.t2,0.8),hy(S[3],s.t1,0.15),hy(S[4],s.t1,0.8),hy(S[5],s.res,0.3)];}
const INIT=()=>({mode:'EXTERNAL',run:false,speed:100,sw:[0,0,0,0,0,0,0,0],ov:[0,0,0,0,0,0],src:'; Write your program here as an instruction list\n; (in GX Developer: View > Instruction list, Alt+F1).\n; Example of the format only:\n;   LD  X0\n;   OUT Y0\n\nEND\n',
  prog:[],err:[],loaded:false,mem:newMem(),lnOn:{},t1:0.05,t2:0.05,res:0.9,act:[0,0,0,0,0,0],sens:[0,0,0,0,0,1],dead:0,dmg:false,X:[],Y:[],seen:{},delay:0,ver:'Task B',progName:'A',ycyc:[],tm:{},acc:0,lastY:'',ych:0});
LAB.def({id:'ce111',on3d:'plc',title:'CE111 PLC Process with CE123 PLC Trainer',manual:'PLC Process Trainer (CE111).pdf · Chapter 11 (CE123 with GX Developer)',
 about:'CE123 PLC Trainer (Mitsubishi FX1S) wired to the CE111 process: a pump, four solenoid valves, two tanks, a reservoir, five float switches and a pulse flow meter. You write the ladder logic; the simulator runs it as an instruction list.',
 constants:['Inputs: X0 F1 flow meter pulses, X1 L1 Tank 2 LOW, X2 L2 Tank 2 HIGH, X3 L3 Tank 1 LOW, X4 L4 Tank 1 HIGH, X5 L5 reservoir LOW (must be HIGH to run). X6 and X7 are operator inputs.','Outputs: Y0 pump P1, Y1 V1 bypass, Y2 V2 Tank 1 feed, Y3 V3 Tank 1 drain into Tank 2, Y4 V4 Tank 2 drain to the reservoir.','Pump protection: never run the pump with V1 and V2 both closed. Close V1 after opening V2; open V1 before closing V2.','Timers T0–T63 (100 ms base, OUT T0 K30 = 3 s); counters C0–C31.','EXTERNAL / INTERNAL mode, RUN / STOP, logic ‘1’ overrides for inputs and outputs.'],
 assume:['Instruction list accepted: LD, LDI, LDP, LDF, AND, ANI, ANDP, ANDF, OR, ORI, ORP, ORF, ANB, ORB, MPS, MRD, MPP, INV, OUT, SET, RST, PLS, PLF, MC, MCR, END; devices X, Y, M, T, C and M8000 (always on), M8002 (first scan), M8013 (1 s clock).','INTERNAL mode: the PLC reads only the trainer’s input switches, not the CE111 sensors. EXTERNAL mode: switches and sensors together.','Each tank holds 2 L; pump up to 3 L/min; L1/L3 switch at 15% and L2/L4 at 80% of the tank; L5 goes LOW below 30% of the reservoir.','Output override switches act in both STOP and RUN (OR with the PLC output).'],
 issues:['Experiment 11.1 maps X0–X5 to Y0–Y5, but the CE111 only uses Y0–Y4; Y5 lights only on the trainer.','The manual gives no solution programs: the ladder logic is the student’s design, as the manual intends.'],
 init:INIT,
 step(s,dt){const n=Math.max(1,Math.round(dt/0.01)),h=dt/n;for(let k=0;k<n;k++){
   const X=[];for(let i=0;i<8;i++)X[i]=!!s.sw[i]||(s.mode==='EXTERNAL'&&i<6&&!!s.sens[i]);s.X=X;
   if(s.run&&s.loaded){s.lnOn=scan(s.prog,s.mem,{X},h,s._t+k*h);}else{s.mem.Y={};}
   const Yp=[];for(let i=0;i<6;i++)Yp[i]=!!(s.run&&s.mem.Y[i]);s.Y=Yp;
   /* solenoid valves and the pump contactor take about 0.2 s to respond */
   const cmd=[0,1,2,3,4,5].map(i=>(Yp[i]&&s.mode==='EXTERNAL')||!!s.ov[i]);s.cmdT=s.cmdT||[0,0,0,0,0,0];s.act=s.act.map((a,i)=>{if(!!cmd[i]!==!!a){s.cmdT[i]+=h;if(s.cmdT[i]>=0.2){s.cmdT[i]=0;return cmd[i];}return a;}s.cmdT[i]=0;return a;});process(s,h);
   const key=s.act.join('');if(key!==s.lastY){s.lastY=key;s.ych=0;}else s.ych+=h;
   if(s.act[2]&&!s._v2){s.ycyc.push(s._t+k*h);}s._v2=s.act[2];
   for(let i=0;i<6;i++){if(X[i]&&Yp[i])s.seen['x'+i]=1;}if(X[7]&&Yp[5])s.seen.x7=1;
   if(s.act[1])s.seen.v1=1;if(s.act[2])s.seen.v2=1;if(s.act[3])s.seen.v3=1;if(s.act[4])s.seen.v4=1;if(s.act[0]&&s.flow>0)s.seen.p1=1;
   /* sequence timing for Experiment 11.9 */const tm=s.tm;if(X[6]&&tm.start==null)tm.start=s._t;if(tm.start!=null){if(s.sens[4]&&tm.l4==null)tm.l4=s._t;if(tm.l4!=null&&s.sens[2]&&tm.l2==null)tm.l2=s._t;if(tm.l2!=null&&s.sens[4]&&s.sens[2]&&tm.both==null)tm.both=s._t;}
   if(X[7]&&tm.rst==null&&tm.start!=null)tm.rst=s._t;if(tm.rst!=null&&!s.sens[3]&&!s.sens[1]&&tm.empty==null)tm.empty=s._t;}
  if(s.dead>3&&!s.dmg){s.dmg=true;}s.ycyc=s.ycyc.filter(t=>t>s._t-120);},
 controls:[tog('run','CE123 RUN / STOP','CE123','RUN','STOP',{set:(s,v)=>{if(v&&!s.loaded){LAB.msg('Download a program first.');return;}s.run=v;if(v)s.mem=newMem();}}),
   sel('mode','Mode',[['EXTERNAL','EXTERNAL'],['INTERNAL','INTERNAL']],'CE123'),
   ...[0,1,2,3,4,5,6,7].map(i=>tog('X'+i,'X'+i+' logic ‘1’ override'+['',' (L1)',' (L2)',' (L3)',' (L4)',' (L5)',' (operator)',' (operator)'][i]+(i===0?' (F1)':''),'Input switches','1','0',{get:s=>!!s.sw[i],set:(s,v)=>{s.sw[i]=v?1:0;}})),
   ...[0,1,2,3,4,5].map(i=>tog('Y'+i,'Y'+i+' logic ‘1’ override · '+['Pump P1','V1 bypass','V2 Tank 1 feed','V3 Tank 1 drain','V4 Tank 2 drain','(trainer only)'][i],'Output overrides','1','0',{get:s=>!!s.ov[i],set:(s,v)=>{s.ov[i]=v?1:0;}})),
   rng('speed','Pump speed',0,100,1,'%',0,'CE111'),btn('Refill the reservoir and empty both tanks',s=>{s.t1=0.05;s.t2=0.05;s.res=0.9;s.dmg=false;s.dead=0;},'CE111')],
 ctlPanel:(s)=>`<div class="lb-plc"><label for="labPlcSrc"><b>Program (instruction list)</b></label><textarea id="labPlcSrc" spellcheck="false" rows="14">${esc(s.src)}</textarea>
   <p class="lb-bar"><button type="button" class="lb-mini" data-pe="load">Compile and download (F4)</button><button type="button" class="lb-mini" data-pe="clear">New program</button></p>
   ${s.err.length?`<div class="lb-err">${s.err.map(e=>`<div>${e}</div>`).join('')}</div>`:s.loaded?`<p class="lb-note">Downloaded: ${s.prog.length} instructions. Switch the CE123 to RUN.</p>`:''}</div>`,
 pe(s,id){if(id==='load'){const t=document.getElementById('labPlcSrc');s.src=t?t.value:s.src;const r=parse(s.src);s.err=r.E;if(!r.E.length){s.prog=r.P;s.loaded=true;s.mem=newMem();LAB.msg('Program compiled and downloaded.');}else{s.loaded=false;s.run=false;}}
   if(id==='clear'){s.src=INIT().src;s.err=[];s.loaded=false;s.run=false;s.prog=[];}},
 instPanel:s=>{const led=(on,l)=>`<span class="lb-led ${on?'on':''}">${l}</span>`;const lv=(v,x,lab,sw)=>`<g transform="translate(${x} 0)"><rect x="0" y="10" width="70" height="90" fill="#eef3f8" stroke="#7d8794"/><rect x="1" y="${100-Math.min(1,v)*90}" width="68" height="${Math.min(1,v)*90}" fill="#5b9bd5"/>${sw.map(([y,o,n])=>`<circle cx="76" cy="${100-y*90}" r="4" fill="${o?'#1baf7a':'#c9ced6'}"/><text x="83" y="${104-y*90}" class="ax">${n}</text>`).join('')}<text x="35" y="116" text-anchor="middle" class="ax">${lab}</text></g>`;
   const mon=s.loaded?`<div class="lb-mon">${s.prog.map(i=>`<div class="${s.run&&s.lnOn[i.ln]?'on':''}">${esc(i.op)} ${esc(i.d||'')}${i.k!=null?' K'+i.k:''}${i.m?' N'+i.n+' '+i.m:i.op==='MCR'?' N'+i.n:''}</div>`).join('')}</div>`:'';
   const T=Object.keys(s.mem.Tk||{}).map(k=>`${k} ${(s.mem.Tacc[k]||0).toFixed(1)}/${(s.mem.Tk[k]*0.1).toFixed(1)} s`),C=Object.keys(s.mem.Ck||{}).map(k=>`${k} ${s.mem.Tacc[k]||0}/${s.mem.Ck[k]}`),Mm=Object.keys(s.mem.M).filter(k=>s.mem.M[k]);
   return `<div class="lb-trace"><b>CE123 · ${s.run?'RUN':'STOP'} · ${s.mode}</b><div class="lb-leds">${[0,1,2,3,4,5,6,7].map(i=>led(s.X[i],'X'+i)).join('')}</div><div class="lb-leds">${[0,1,2,3,4,5].map(i=>led(s.Y[i]||s.ov[i],'Y'+i)).join('')}</div>
   <p class="lb-note">Device batch: ${[...Mm,...T,...C].join(' · ')||'—'}</p></div>
   <div class="lb-trace"><b>CE111 process</b><svg viewBox="0 0 330 124">${lv(s.t1,10,'Tank 1',[[0.8,s.sens[4],'L4'],[0.15,s.sens[3],'L3']])}${lv(s.t2,120,'Tank 2',[[0.8,s.sens[2],'L2'],[0.15,s.sens[1],'L1']])}${lv(s.res,230,'Reservoir',[[0.3,s.sens[5],'L5']])}</svg>
   <div class="lb-leds">${led(s.act[0],'Pump')}${led(s.act[1],'V1')}${led(s.act[2],'V2')}${led(s.act[3],'V3')}${led(s.act[4],'V4')}${led(s.sens[0],'F1')}</div></div>${mon}`;},
 panelKey:s=>[s.X.join(),s.Y.join(),s.act.join(),s.ov.join(),(s.t1*50|0),(s.t2*50|0),(s.res*50|0),s.sens.join(),s.run,s.mode,Object.values(s.lnOn).join(),JSON.stringify(s.mem.Tacc).length+Math.round(Object.values(s.mem.Tacc).reduce((a,b)=>a+b,0)*5),Object.keys(s.mem.M).filter(k=>s.mem.M[k]).join()].join('|'),
 readings:[rd('t1','Tank 1 level','%',0,s=>s.t1*100,0,{cal:false}),rd('t2','Tank 2 level','%',0,s=>s.t2*100,0,{cal:false}),rd('res','Reservoir level','%',0,s=>s.res*100,0,{cal:false}),rd('fl','Pump flow','L/min',2,s=>s.flow||0,0,{cal:false}),rd('cyc','V2 cycles in the last 2 min','',0,s=>s.ycyc.length,0,{cal:false})],
 warnings:[{when:s=>s.act[0]&&!s.act[1]&&!s.act[2],msg:'The pump is running with V1 and V2 both closed. Never run the pump against closed valves.'},{when:s=>s.dmg,msg:'The pump ran dead-headed for several seconds: in the real rig this damages the pump.'},{when:s=>s.ovf>0,msg:'A tank is overflowing.'},{when:s=>s.act[0]&&!s.sens[5],msg:'Reservoir level LOW (L5): the pump should stop.'},{when:s=>s.mode==='INTERNAL'&&s.run,msg:'INTERNAL mode: the PLC is not reading the CE111 sensors and its outputs do not drive the CE111.',level:'info'}],
 experiments:[
  ex('11.1','Familiarisation and simple programming','Gain experience with the CE123, downloading, and simulated versus physical operation.',[
    {t:'Write a program mapping X0→Y0 … X5→Y5, plus a seventh rung with X7 in parallel with X5 driving Y5. Compile and download.',check:s=>s.loaded},
    {t:'Run the program with the CE123 in EXTERNAL mode.',check:s=>s.run&&s.mode==='EXTERNAL'},
    {t:'For each input X0–X5 press the logic ‘1’ override and check the matching output LED.',check:s=>[0,1,2,3,4,5].every(i=>s.seen['x'+i])},
    {t:'Check Y5 responds to both X5 and X7.',check:s=>s.seen.x5&&s.seen.x7},
    {t:'Switch to INTERNAL mode while running; toggle inputs and note what the outputs do. Switch back to EXTERNAL and compare.',rec:true,check:(s,R)=>R.some(r=>r.mode==='INTERNAL')&&R.some(r=>r.mode==='EXTERNAL')}],ioTable()),
  ex('11.2','Logic operations in ladder logic','Implement OR/NOR, AND/NAND and XOR on the CE123 and verify them with truth tables.',[
    {t:'Program A: Y0 ON if X0 ON, OR X1 ON, OR X2 OFF. Download and record Y0 for all 8 combinations of X0–X2.',rec:true,check:(s,R)=>new Set(R.filter(r=>r.prog==='A').map(r=>r.X0+''+r.X1+r.X2)).size>=8},
    {t:'Program B: Y0 ON only if X0 ON, AND X1 ON, AND X2 OFF. Record all 8 combinations.',rec:true,check:(s,R)=>new Set(R.filter(r=>r.prog==='B').map(r=>r.X0+''+r.X1+r.X2)).size>=8},
    {t:'Program C: Y0 ON if exactly one of X0 or X1 is ON (exclusive OR). Record all 4 combinations.',rec:true,check:(s,R)=>new Set(R.filter(r=>r.prog==='C').map(r=>r.X0+''+r.X1)).size>=4}],ioTable(true)),
  ex('11.3','Timers, counters and monitoring','Timed sequences and counting, observed in the monitor.',[
    {t:'Part 1: when X0 is set, Y0 turns on at once, then Y1, Y2 … after fixed delays, repeating continuously (use the last timer to reset the first). Download and run.',check:s=>s.loaded&&s.run&&Object.keys(s.mem.Tk||{}).length>=2},
    {t:'Part 2: watch the monitor (Instruments tab): active contacts are highlighted and timer values count up.',rec:true,check:(s,R)=>R.length>=2},
    {t:'Part 3: Y0 and Y1 turn on when X0 has been toggled ON a chosen number of times, OR X1 a different number of times. Test both counters.',rec:true,check:(s,R)=>R.length>=4&&Object.keys(s.mem.Ck||{}).length>=2}],ioTable()),
  ex('11.4','Editing and adding comments','Document the timer program for maintenance.',[
    {t:'Open the timer sequence program from Experiment 11.3 and add a comment (after ;) for every device used.',check:s=>(s.src.match(/;/g)||[]).length>=6},
    {t:'Add a statement above each rung describing its function, and a header note: program name, author, date, purpose, timer presets and assumptions.',check:s=>/author|date|purpose/i.test(s.src)},
    {t:'Compile and download the commented program to confirm it still runs.',check:s=>s.loaded}],ioTable()),
  ex('11.5','Master coils, SET and RESET','Conditional blocks with MC/MCR and latching with SET/RST.',[
    {t:'Part 1: two independent timed sequences: A cycles Y0 and Y1, B cycles Y2 and Y3. Put A inside a Master Coil block controlled by X0.',check:s=>s.loaded&&s.prog.some(i=>i.op==='MC')},
    {t:'Run it: with X0 ON sequence A runs; with X0 OFF it stops completely, while B carries on.',rec:true,check:(s,R)=>R.length>=2},
    {t:'Part 2: latch an internal relay M1 with SET and clear it with RST, and use M1 to control the Master Coil.',check:s=>s.loaded&&s.prog.some(i=>i.op==='SET')&&s.prog.some(i=>i.op==='RST')},
    {t:'Test what happens to the outputs inside the block when the MC condition goes FALSE.',rec:true,check:(s,R)=>R.length>=4}],ioTable()),
  ex('11.6','Basic programming exercise – manual control','Check every sensor and actuator and run the process by hand with the overrides, without a PLC program.',[
    {t:'With the CE123 on and all outputs at ‘0’, check the five level switches (Instruments tab).'},
    {t:'Test each valve V1–V4 with its output override (an audible click, LED on).',check:s=>s.seen.v1&&s.seen.v2&&s.seen.v3&&s.seen.v4},
    {t:'Test the pump: open the bypass V1 first (Y1 ‘1’), then start the pump (Y0 ‘1’) at maximum speed; F1 flashes. Record observations in Table 11.4.',rec:true,check:s=>s.seen.p1&&!s.dmg},
    {t:'Manual cycle: open V1, V2, V3 and V4; start the pump at full speed; close V1 (water to Tank 1); close V4.',check:s=>s.act[0]&&s.act[2]&&!s.act[1]},
    {t:'Watch Tank 1 fill until L4 lights. Open V1 again and stop the pump.',check:s=>s.sens[4]&&!s.act[0]},
    {t:'Open V3 to drain Tank 1 into Tank 2; watch Tank 2 fill until L2 lights.',check:s=>s.sens[2]},
    {t:'Open V4 to drain Tank 2 back to the reservoir.',rec:true,check:(s,R)=>s.act[4]&&R.length>=2}],ioTable()),
  ex('11.7','Basic level control (Tank 1)','Pump interlock, on-off level control of Tank 1, and the effect of timer delays on valve cycling.',[
    {t:'Task A: on X6 with L5 HIGH, open the bypass V1, then start the pump; stop the pump if the reservoir goes LOW.',check:s=>s.run&&s.sw[6]&&s.act[1]&&s.act[0]},
    {t:'Task B: keep Tank 1 around L4: X4 LOW → V2 open, V3 closed; X4 HIGH → V2 closed, V3 open. Pump at maximum. Count V2 cycles in 2 minutes and record (version “Task B”, delay 0).',rec:true,check:(s,R)=>R.some(r=>r.ver==='Task B')},
    {t:'Task C: add a timer delay (2–10 s) before each valve change. Record the cycles in 2 minutes for a short and a long delay.',rec:true,check:(s,R)=>R.filter(r=>r.ver!=='Task B').length>=2}],
    {table:[col('ver','Program version','',0,(v,s)=>s.ver||'Task B'),col('dl','Timer delay','s',1,(v,s)=>s.delay||0),col('cyc','Valve cycles in 2 min','',0,v=>v.cyc)],guard:s=>!s.run?'Run the program first.':s._t<130?'Let the program run for at least 2 minutes.':null,extra:true}),
  ex('11.8','Level control (Tank 1 and Tank 2)','Keep both tanks near their HIGH marks with a different anti-cycling strategy.',[
    {t:'X6 starts the control, X7 stops it; the reservoir level is monitored all the time. Remember filling Tank 2 means draining Tank 1.',check:s=>s.run&&s.loaded},
    {t:'Run and observe: both tanks held near L4 and L2.',rec:true,check:(s,R)=>R.length>=1&&s.t1>0.6&&s.t2>0.6},
    {t:'Compare the valve cycling with the timer method of Experiment 11.7.',rec:true,check:(s,R)=>R.length>=2}],ioTable()),
  ex('11.9','Tank filling sequence','A fixed fill sequence with M relays for the step memory.',[
    {t:'X6 (fill request): fill Tank 1; when L4 HIGH, drain Tank 1 into Tank 2; when L2 HIGH, refill Tank 1; stop when both are full.',check:s=>s.tm.both!=null},
    {t:'X7 (operator reset) empties both tanks and returns to the start.',check:s=>s.tm.empty!=null},
    {t:'Record the phase durations, then run the sequence at least twice.',rec:true,check:(s,R)=>R.length>=2}],
    {table:[{k:'f1',label:'Fill Tank 1',unit:'s',dp:0},{k:'f2',label:'Drain Tank 1 → fill Tank 2',unit:'s',dp:0},{k:'f3',label:'Refill Tank 1',unit:'s',dp:0},{k:'tot',label:'Total sequence time',unit:'s',dp:0},{k:'rs',label:'Reset / drain all',unit:'s',dp:0},{k:'tm',label:'Times (s from start of session)',unit:'',dp:0,from:(v,s)=>JSON.stringify(Object.fromEntries(Object.entries(s.tm).map(([k,x])=>[k,Math.round(x)])))}],
     calc:[r=>{const t=JSON.parse(r.tm||'{}');return {f1:t.l4-t.start,f2:t.l2-t.l4,f3:t.both-t.l2,tot:t.both-t.start,rs:t.empty-t.rst};}],guard:s=>s.tm.both==null?'Run the full sequence first (both tanks full).':null,extra:true}),
  ex('11.10','Simulated batch sequencing','Eight-stage batch: load A, transfer, load B, transfer, reaction (≥ 30 s), discharge, wash, repeat; X6 low holds, X7 resets.',[
    {t:'Design the program with M relays for the stages and at least one timer for the reaction period.',check:s=>s.loaded&&Object.keys(s.mem.Tk||{}).length>=1},
    {t:'Start with X6 and record each stage: active outputs, duration and M devices active.',rec:true,check:(s,R)=>R.length>=8},
    {t:'Verify the cycle repeats automatically; test hold (X6 LOW) and reset (X7).'}],
    {table:[{k:'st',label:'Stage',unit:'',dp:0,from:(v,s,R)=>R.length+1},{k:'ao',label:'Active outputs',unit:'',dp:0,from:(v,s)=>s.act.map((a,i)=>a?['P1','V1','V2','V3','V4','Y5'][i]:null).filter(Boolean).join(' ')||'none'},{k:'du',label:'Duration so far',unit:'s',dp:0,from:(v,s)=>s.ych},{k:'md',label:'M devices active',unit:'',dp:0,from:(v,s)=>Object.keys(s.mem.M).filter(k=>s.mem.M[k]).join(' ')||'none'}],guard:s=>!s.run?'Run the program first.':null,extra:true})],
 onExp(s){s.ver='Task B';},
 sync(s,s3){if(!s3)return;s3.run=s.run;s3.lv=s.t1;s3.pOn=!!s.act[0];s3.vOn=!!s.act[3];}
});
function ioTable(truth){return {table:(truth?[col('prog','Program','',0,(v,s)=>s.progName||'A')]:[]).concat([col('mode','Mode','',0,(v,s)=>s.mode)]).concat([0,1,2,3,4,5,6,7].map(i=>col('X'+i,'X'+i,'',0,(v,s)=>s.X[i]?1:0))).concat([0,1,2,3,4,5].map(i=>col('Y'+i,'Y'+i,'',0,(v,s)=>s.Y[i]||s.ov[i]?1:0))),guard:s=>null,extra:true};}
function ex(n,title,aim,steps,t){return {id:'plc'+n.replace('.','_'),title:'Experiment '+n+': '+title,aim,steps,table:t.table,calc:t.calc,guard:t.guard,charts:[]};}
/* extra controls used by some experiments */
const D=LAB.defs.ce111;D.controls.push(sel('progName','Program being tested (Experiment 11.2)',[['A','Program A (OR / NOR)'],['B','Program B (AND / NAND)'],['C','Program C (XOR)']],'Records'),sel('ver','Program version (Experiment 11.7)',[['Task B','Task B – no delay'],['Task C short','Task C – short delay'],['Task C long','Task C – long delay']],'Records'),rng('delay','Timer delay used (Experiment 11.7)',0,10,0.5,'s',1,'Records'),btn('Clear the sequence timing (Experiment 11.9)',s=>{s.tm={};},'Records'));
D.experiments.find(e=>e.id==='plc11_7').table[2]=col('cyc','Valve cycles in 2 min','',0,(v,s)=>s.ycyc.length);
LAB.plc={parse,scan,newMem};
})();
