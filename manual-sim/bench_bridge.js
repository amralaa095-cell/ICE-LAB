/* Bridge between the manual simulation system (LAB) and the Virtual Bench devices on the website.
   In "Lab manual" mode the LAB configuration runs the machine and the bench apparatus (2D / 3D) follows it. */
(function(){
if(typeof DEVMAP==='undefined'||!window.LAB)return;
const MAP={h52:'h52',h11:'h11',bernoulli:'venturi',h314:'h314',h8:'h8',h16:'h16',tm1016v:'tm1016v',td360:'td360',td1002:'td1002',td1060v:'td1060v',
  tensile:'utm',charpy:'charpy',vickers:'vickers',fatigue:'hsm19d',metallography:'metallo',torsion:'torsion',plc:'ce111'};
/* the hydraulic bench flow follows the lab simulation while lab manual mode is on */
let LQ={};['h8','bernoulli','h16'].forEach(k=>{const o=BFN[k];BFN[k]=()=>{if(LAB.cur&&LAB.d3&&LAB.d3.d===DEVMAP[k]&&LQ[k]!=null)return LQ[k];return o?o():BQ[k]*Math.pow(BENCH.v/100,0.8);};});
const act=(d,id)=>{const a=(d.actions||[]).find(x=>x.id===id);if(a)try{a.fn(d.s,d);}catch(e){}};
const cl=(v,a,b)=>Math.min(b,Math.max(a,v));
const BR={
 h52(L,b){b.V=[L.V1>5?1:0,L.V2?1:0,L.V3?1:0,L.V4?1:0];b.v1=cl(L.V1,5,100);b.v5=cl(L.V5,2,100);b.P1=!!L.p1on;b.P2=!!L.p2on;b.exp=['e1','e2','e3','e4'][LAB.exp]||'e1';},
 h11(L,b){b.th=L.th;b.h=cl(L.h*1000,0,200);b.W=Math.max(20,L.hook?L.W:20);b.tap=0;b.ang=-L.tilt*Math.PI/180;b.om=0;},
 h8(L,b){b.tg=L.vane;BENCH.acc='h8';BENCH.v=L.bv;BENCH.on=L.bv>0;LQ.h8=L.m;b.bv=L.bv;b.y=cl(L.y,0,250);},
 bernoulli(L,b){BENCH.acc='bernoulli';BENCH.v=L.bv;BENCH.on=L.bv>0;LQ.bernoulli=L.Q*1000;b.bv=L.bv;b.ov=L.ov;if(L.h&&b.lev&&b.lev.length===L.h.length)b.lev=L.h.map(v=>cl(v*1000,0,400));},
 h16(L,b){BENCH.acc='h16';BENCH.v=L.bench;BENCH.on=L.bench>0;LQ.h16=(L.Qd+L.Ql)*1000;b.bv=L.bench;const dark=L.gate>=L.globe;b.cir=dark?'A':'B';b.vo=cl(dark?L.gate:L.globe,2,100);b.bled=!L.air;},
 h314(L,b){const e=LAB.cur.experiments[LAB.exp].id;b.exp={den1:'dens',den2:'arch',den3:'bottle',hare:'hare',visc:'visc'}[e]||b.exp;b.liq=L.dl==='oil'?'oil':L.dl==='salt'?'salt':'water';},
 tm1016v(L,b){b.exp=LAB.exp?'e2':'e1';b.am=L.add;b.dmp={none:'none',dry:'nofluid',open:'open',shut:'shut'}[L.damp];b.mode=L.on?'forced':'free';b.f=L.fset;b.on=L.on;b.th=L.th;b.om=L.w;},
 td360(L,b){b.tp={con:'conc',plate:'plate',shell:'shell'}[L.hx];b.arr=L.counter?'cnt':'par';b.Th=cl(L.set,30,70);b.Fh=cl(L.Vh,0.5,4);b.Fc=cl(L.Vc,0.5,4);b.heat=!!L.heat;b.hp=!!L.pump;b.cp=L.Vc>0.05;b.Tt=L.Ttank;b.hf=L.Vh;b.cf=L.Vc;if(b.D)Object.assign(b.D,{TH1:L.T.Th1,TH2:L.T.Th2,TH3:L.T.Th3,TC1:L.T.Tc1,TC2:L.T.Tc2,TC3:L.T.Tc3});},
 td1002(L,b){b.mid=L.mid;b.paste=L.paste?1:0;b.P=L.W;b.heat=L.on&&!L.trip;b.cool=!!L.water;b.trip=!!L.trip;if(b.D&&b.D.length===L.T.length)b.D=L.T.slice();},
 td1060v(L,b){Object.assign(b,{sp:L.set,sw:L.SW,L:L.load,byp:L.bypass?1:0,iso:L.iso,heat:L.heat,pump:L.pumpOn,fan2:L.fan2,tare:L.tare,T1:L.T1,T2:L.T2,T4:L.T4,T5:L.T5,T3:L.o.T3||b.T3,N:L.o.SG,PH:L.PH});},
 tensile(L,b,br){const m={ms:'s1018',al:'al6061',br:'brass'}[L.mat];if(b.mat!==m){b.mat=m;}b.shape='round';b.d=6;b.L0=30;b.v=cl(L.v,1,50);if(!b.g||br.mat!==m){b.g=tGeom(b);br.mat=m;}b.u=L.e*30+L.F*0.05;b.e=L.e;b.running=!!L.run&&!L.broke;b.time=L._t;b.broken=!!L.broke;},
 charpy(L,b,br){b.mat={ms:'c1018',al:'al',br:'s355',ci:'ci'}[L.met]||'c1018';b.type='charpy';
   if(br.st!==L.st){if(L.st==='up'&&b.phase==='done')act(this,'brake');if(L.st==='swing'){b.loaded=!!L.placed||L.broken;act(this,'rel');}br.st=L.st;}
   if(br.placed!==L.placed){if(L.placed&&!b.loaded)act(this,'load');br.placed=L.placed;}},
 vickers(L,b,br){b.mat={A:'ms',B:'brass',C:'cu',D:'ts',E:'ms'}[L.spec];const F=[1,5,10,20,30,50];b.F=F.reduce((a,x)=>Math.abs(x-L.load)<Math.abs(a-L.load)?x:a);b.dw=cl(L.dwell,5,30);if(br.ph!==L.phase){if(L.phase==='load'&&(b.ph==='idle'||b.ph==='view'))act(this,'go');br.ph=L.phase;}},
 fatigue(L,b){b.mat={st:'steel',al:'al',br:'brass'}[L.mat];b.run=!!L.on;b.N=L.N;b.done=L.broke?'frac':null;},
 metallography(L,b){b.step=L.rinsed&&L.etch>=5?5:L.scr===0?4:L.mounted&&L.scr<=1?3:L.mounted&&L.scr<=3?2:L.mounted?1:0;b.et=cl(L.etch||8,2,30);b.auto=false;b.prog=0;},
 torsion(L,b){b.mat={st:'steel',al:'al',br:'brass'}[L.mat];b.d=L.d;b.L=L.L;b.th=L.tw;b.run=false;b.brk=false;},
 plc(L){PLC.power=true;PLC.run=false;PLC.ext=L.mode==='EXTERNAL';PLC.umb=true;PLC.leads=true;for(let i=0;i<8;i++)PLC.X[i]=L.X[i]?1:0;for(let i=0;i<6;i++){PLC.Y[i]=L.Y[i]?1:0;PLC.out[i]=L.act[i]?1:0;}
   const P=PLC.P;P.h1=Math.max(0,30+(L.t1-0.15)*100/0.65);P.h2=Math.max(0,30+(L.t2-0.15)*70/0.65);P.res=L.res*5500;P.q=(L.flow||0)/60*1000;}
};
Object.keys(MAP).forEach(bid=>{const c=LAB.defs[MAP[bid]];if(!c)return;c.post=null;c.sync=function(L,b,d3){const f=BR[bid];if(!f||!d3||!d3.d)return;d3.br=d3.br||{};try{f.call(d3.d,L,b,d3.br);}catch(e){}try{dirty=true;}catch(e){}};});

const LABHTML=`<section class="panel labwrap" id="lab" hidden aria-label="Lab manual simulation"><div class="lb-head"><div><div class="lb-kick">Lab manual mode · run the machine as the manual says</div><div class="lb-name" id="labName"></div><div class="lb-src" id="labSrc"></div></div>
<div class="lb-run"><label>Experiment <select id="labExp"></select></label><label>Time speed <select id="labSpeed"><option value="1">Real time</option><option value="5">× 5</option><option value="20">× 20</option><option value="60">1 min per s</option><option value="600">10 min per s</option><option value="3600">1 h per s</option><option value="36000">10 h per s</option></select></label><span class="lb-clock">Machine time <b id="labClock">0:00</b></span><button type="button" class="lb-mini" data-x="reset">Reset machine</button></div></div>
<div id="labWarn" class="lb-warn" hidden></div><div id="labMsg" class="lb-msg" role="status" hidden></div>
<div class="lb-tabs" role="tablist" id="labTabs"><button type="button" role="tab" data-t="proc">Procedure</button><button type="button" role="tab" data-t="ctl">Controls</button><button type="button" role="tab" data-t="inst">Instruments</button><button type="button" role="tab" data-t="res">Results</button><button type="button" role="tab" data-t="chart">Charts</button><button type="button" role="tab" data-t="cal">Calibration</button><button type="button" role="tab" data-t="man">Manual data</button></div>
<div id="labBody"></div></section>`;
let mode='manual';try{mode=localStorage.getItem('icelab.labmode')||'manual';}catch(e){}

function inject(){const h=(location.hash||'').slice(1),d=DEVMAP[h],v=document.getElementById('view');if(!v)return;
  const wb=v.querySelector('.wb');const lid=d&&MAP[d.id];
  if(!lid||!LAB.defs[lid]||!wb){if(LAB.cur&&!document.getElementById('lab'))LAB.close();return;}
  if(wb.querySelector('#lab')&&wb.dataset.lab===d.id)return;
  wb.dataset.lab=d.id;const tools=wb.querySelector('.wb-tools')||wb.querySelector('.wb-head')||wb;
  const sw=document.createElement('div');sw.className='seg labmode-seg';sw.id='labMode';sw.setAttribute('role','radiogroup');sw.setAttribute('aria-label','How to run this machine');
  sw.innerHTML='<label title="Follow the ICE Lab manual step by step"><input type="radio" name="labmode" value="manual"><span>Lab manual mode</span></label><label title="Change anything freely"><input type="radio" name="labmode" value="free"><span>Free bench</span></label>';
  tools.insertBefore(sw,tools.firstChild);wb.insertAdjacentHTML('beforeend',LABHTML);
  sw.querySelectorAll('input').forEach(r=>r.addEventListener('change',()=>{mode=r.value;try{localStorage.setItem('icelab.labmode',mode);}catch(e){}apply(d);try{dirty=true;refresh(true);}catch(e){}}));
  apply(d);}
function apply(d){const wb=document.querySelector('#view .wb');const lab=document.getElementById('lab');const on=mode==='manual';if(wb)wb.classList.toggle('labmode',on);
  document.querySelectorAll('#labMode input').forEach(r=>{r.checked=r.value===mode;});
  if(on){if(!LAB.cur||!LAB.d3||LAB.d3.d!==d)LAB.open(LAB.defs[MAP[d.id]],{s:d.s,d});}else LAB.close();
  if(lab)lab.hidden=!on;try{window.dispatchEvent(new Event('resize'));}catch(e){}}
let _it;const mo=new MutationObserver(()=>{clearTimeout(_it);_it=setTimeout(inject,30);});
const vw=document.getElementById('view');if(vw)mo.observe(vw,{childList:true});
addEventListener('hashchange',()=>setTimeout(inject,60));setTimeout(inject,60);

})();
