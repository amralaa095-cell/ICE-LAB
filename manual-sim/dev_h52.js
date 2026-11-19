/* H52 Series and Parallel Pumps · from "Series and Parallel Pumps (H52).pdf" (MECH451L / MECH204L). */
(function(){const {tog,rng,btn,rd,col}=LK,U=LAB.util;
/* Table 5.1 valve settings (V5 as required) */
const T51={p1:[false,true,false,false],p2:[true,false,false,true],series:[true,false,true,false],parallel:[true,true,false,true]};
const NAME={p1:'Pump 1 only',p2:'Pump 2 only',series:'Pumps 1 and 2 in series',parallel:'Pumps 1 and 2 in parallel',none:'Not a Table 5.1 setting'};
function cfgOf(s){const v=[s.V1>5,s.V2,s.V3,s.V4];for(const k in T51)if(T51[k].every((b,i)=>b===v[i]))return k;return 'none';}
/* one pump at full speed: pressure rise in bar against flow in L/s (assumed curve, see notes) */
const H0=1.15,A=0.45;const Hp=q=>Math.max(-0.2,H0-A*q*q);
const suc=(Q,v1)=>0.02+0.035*Q*Q/Math.pow(Math.max(v1,0.02),2);       /* inlet loss, bar */
const del=(Q,v5)=>(0.06+0.09/Math.pow(Math.max(v5,0.015),2))*Q*Q;     /* V5 + return pipe, bar */
function solve(s){const c=cfgOf(s),v1=s.V1/100,v5=s.V5/100;s.cfg=c;
  const p1=s.p1on&&s.air<1,p2=s.p2on&&s.air<1;let Q=0,P1=-0.02,P2=-0.02,P3=-0.02;
  const net={p1:q=>(s.p1on?Hp(q):-9)-suc(q,1),p2:q=>(s.p2on?Hp(q):-9)-suc(q,v1),series:q=>(s.p1on?Hp(q):-0.3*q*q)+(s.p2on?Hp(q):-0.3*q*q)-suc(q,v1)-0.03*q*q,
            parallel:q=>{const a=s.p1on,b=s.p2on;if(a&&b)return Hp(q/2)-suc(q,v1);if(a||b)return Hp(q)-suc(q,v1)-0.05*q*q;return -9;}}[c];
  if(net&&(s.p1on||s.p2on)){const f=q=>net(q)-del(q,v5);Q=f(0)<=0?0:U.bisect(f,0,4);
    const ps=-suc(Q,c==='p1'?1:v1);
    if(c==='p1'){P1=-0.02;P2=-0.02;P3=del(Q,v5)+0.02*Q*Q;}
    else if(c==='p2'){P1=ps;P2=ps+(s.p2on?Hp(Q):0);P3=P2-0.02*Q*Q;}
    /* series: water goes through pump 2 first (P1 inlet, P2 between the pumps), then pump 1 (P3 delivery) */
    else if(c==='series'){P1=ps;P2=ps+(s.p2on?Hp(Q):-0.3*Q*Q);P3=P2+(s.p1on?Hp(Q):-0.3*Q*Q)-0.03*Q*Q;}
    else{P1=ps;const q2=s.p1on&&s.p2on?Q/2:Q;P2=ps+(s.p2on?Hp(q2):-0.05*Q*Q);P3=ps+(s.p1on?Hp(q2):-0.05*Q*Q)-0.01*Q*Q;}}
  /* air in the pipework after start: flow is unsteady until flushed */
  if(s.air>0.05&&(s.p1on||s.p2on)){const w=Math.sin(s._t*9)*0.25*s.air;Q*=1-0.5*s.air+w*0.3;P2*=1-0.3*s.air;}
  return {Q,P1,P2,P3};}
const RT=()=>({p1on:false,p2on:false,V1:100,V2:false,V3:false,V4:false,V5:100,air:1,Q:0,P1:-0.02,P2:-0.02,P3:-0.02,cfg:'none',N:0,dead:0});
const HEAD=(r,type)=>type==='parallel'?((r.P2+r.P3)/2-r.P1):type==='series'?(r.P3-r.P1):(r.P2-r.P1);
const tbl=[col('P1','Inlet pressure P1','bar',2,v=>v.P1),col('P2','Outlet pressure P2','bar',2,v=>v.P2),col('P3','Outlet pressure P3','bar',2,v=>v.P3),col('Qm','Flow rate Q','l/min',1,v=>v.Q),
  {k:'Qs',label:'Flow rate Q',unit:'l/s',dp:3},{k:'Hb',label:'Total head H',unit:'bar',dp:3},{k:'Hk',label:'Total head H',unit:'kPa',dp:1},{k:'W2',label:'Hydraulic power W2',unit:'W',dp:1}];
const calcFor=type=>[(r)=>{const Qs=r.Qm/60,Hb=HEAD(r,type),Hk=Hb*100;return {Qs,Hb,Hk,W2:Hk*1000*Qs/1000};}];
const isCfg=c=>s=>s.cfg===c;
const steps=(type,stepBar)=>[
  {t:'Start the apparatus and ensure that all air has been flushed out.',check:s=>(s.p1on||s.p2on)&&s.air<0.05,hint:'start the pump(s) and wait for the flow to steady'},
  {t:`Set the valves on the apparatus for flow through ${NAME[type]}. Refer to Table 5.1.`,check:isCfg(type)},
  {t:'Set Valve V5 fully open.',check:s=>s.V5>=98},
  {t:'Create a blank results table similar to Table 5.3.'},
  {t:type==='p2'?'Record Pump 2 inlet pressure P1 and Pump 2 outlet pressure P2.':'Record inlet pressure P1 and outlet pressures P2 and P3.',rec:true,check:(s,R)=>R.length>=1},
  {t:'Record flow from the flow meter.',check:(s,R)=>R.length>=1},
  {t:`In ${stepBar} bar steps, use the delivery valve V5 to increase the outlet pressure checking the pressure on ${type==='p2'?'P2':'P3'}. Do not adjust the inlet valve.`,rec:true,check:(s,R)=>R.length>=3},
  {t:'Repeat steps 5 to 7 above until valve V5 is nearly fully closed.',rec:true,check:(s,R)=>R.length>=5&&Math.min(...R.map(r=>r.Qm))<15},
  {t:type==='p2'?'Switch off Pump 2.':'Switch off the pumps.',check:(s,R)=>R.length>=5&&!s.p1on&&!s.p2on},
  {t:'If finished with the apparatus, shut it down.'}];
const guard=type=>s=>s.cfg!==type?'The valves are not set for '+NAME[type]+' (Table 5.1). Set them before recording.':(!s.p1on&&!s.p2on)?'Start the pump first.':s.air>0.05?'Wait until all the air has been flushed out.':null;
const chartAll={title:'Total head against flow rate (single, series and parallel)',x:r=>r.Qs,xl:'Flow rate Q (l/s)',yl:'Total head H (kPa)',zeroX:true,
  series:[{name:'Single pump (pump 2)',points:()=>pts('h52e1')},{name:'Pumps in series',points:()=>pts('h52e2')},{name:'Pumps in parallel',points:()=>pts('h52e3')}]};
function pts(id){const c=LAB.cur,e=c.experiments.find(x=>x.id===id),R=LAB.rows[id]||[];return R.map(r=>LAB.calcRow(e,r,R)).map(r=>[r.Qs,r.Hk]);}
LAB.def({id:'h52',on3d:'pumps',title:'H52 Series and Parallel Pumps',manual:'Series and Parallel Pumps (H52).pdf · MECH451L / MECH204L Lab Manuals',
 about:'Two identical centrifugal pumps with a built-in water vessel and flow meter. Valves V1–V4 set the arrangement (Table 5.1); V5 controls the flow. Gauges P1 (pump 2 inlet), P2 (pump 2 outlet) and P3 (delivery) read in bar.',
 constants:['Valve settings for each arrangement: Table 5.1 (V1 Closed/Open/Open/Open, V2 Open/Closed/Closed/Open, V3 Closed/Closed/Open/Closed, V4 Closed/Open/Closed/Open for pump 1 only / pump 2 only / series / parallel).','Total head H = pO − pI (Eq 5.1); gauges in bar, × 100 000 for Pa.','Parallel: average of the two outlet pressures minus the inlet. Series: inlet of the first pump subtracted from the outlet of the second.','Hydraulic power W2 = (pO − pI) Q (Eq 5.2).','When stopped the gauges show a slight negative reading (head of water in the pressure pipes).'],
 assume:['Pump curve (each pump at full speed): 1.15 bar at zero flow, falling with the square of flow (0.45 bar per (l/s)²). The manual gives no pump curve.','Pump speed is fixed at about 2 850 rev/min (single-phase pumps); the manual has no speed control.','Pipe and valve losses chosen so that the readings fall in the ranges the manual describes (0.1 bar steps for one pump, 0.2 bar for series).','Where the valve figure (5.2–5.6) would show which pipe each valve is on, the simulation follows Table 5.1 only. Any other valve setting is flagged and gives no flow.'],
 issues:['The text says “three Bourdon gauges (P1 to P4)” but only P1, P2 and P3 are described.','“For series pump tests, use the inlet pressure of the first pump” but P1 is described as pump 2 inlet. The simulation uses P3 − P1 for series and the average of P2 and P3 minus P1 for parallel.'],
 init:RT,
 step(s,dt){const on=s.p1on||s.p2on;if(on)s.air=Math.max(0,s.air-dt/(s.V5>60?6:14));else s.air=Math.min(1,s.air+dt/600);
   const r=solve(s);U.lag(s,'Q',r.Q,dt,0.6);U.lag(s,'P1',r.P1,dt,0.4);U.lag(s,'P2',r.P2,dt,0.4);U.lag(s,'P3',r.P3,dt,0.4);
   U.lag(s,'N',on?2850-40*s.Q:0,dt,0.8);s.dead=on&&s.Q<0.02?s.dead+dt:0;},
 controls:[tog('p1on','Pump 1','Pumps','Running','Stopped'),tog('p2on','Pump 2','Pumps','Running','Stopped'),
   rng('V1','V1 · pump inlet (suction) valve',0,100,1,'% open',0,'Valves (Table 5.1)'),tog('V2','V2','Valves (Table 5.1)','Open','Closed'),tog('V3','V3','Valves (Table 5.1)','Open','Closed'),tog('V4','V4','Valves (Table 5.1)','Open','Closed'),
   rng('V5','V5 · delivery (flow control) valve',0,100,1,'% open',0,'Valves (Table 5.1)'),
   btn('Pump 1 only',s=>{s.V1=0;s.V2=true;s.V3=false;s.V4=false;},'Set valves from Table 5.1'),btn('Pump 2 only',s=>{s.V1=100;s.V2=false;s.V3=false;s.V4=true;},'Set valves from Table 5.1'),
   btn('Series',s=>{s.V1=100;s.V2=false;s.V3=true;s.V4=false;},'Set valves from Table 5.1'),btn('Parallel',s=>{s.V1=100;s.V2=true;s.V3=false;s.V4=true;},'Set valves from Table 5.1')],
 readings:[rd('P1','P1 inlet','bar',2,s=>s.P1,0.004),rd('P2','P2 outlet','bar',2,s=>s.P2,0.004),rd('P3','P3 delivery','bar',2,s=>s.P3,0.004),rd('Q','Flow meter','l/min',1,s=>s.Q*60,0.15),rd('N','Pump speed','rev/min',0,s=>s.N,3),
   rd('cfg','Valve setting','',0,s=>NAME[s.cfg],0,{cal:false,key:false})],
 warnings:[{when:s=>s.dead>8,msg:'Do not run the pumps for long periods with the inlet and/or outlet valves fully closed.'},
   {when:s=>(s.p1on||s.p2on)&&s.cfg==='none',msg:'These valve positions are not one of the settings in Table 5.1.'},
   {when:s=>s.cfg==='p1'&&s.p2on||s.cfg==='p2'&&s.p1on,msg:'The other pump is running but its valves are closed.'}],
 experiments:[
  {id:'h52e1',title:'Experiment 1: Single Pump',aim:'Find the head–flow characteristic of one pump (pump 2).',steps:steps('p2','0.1'),table:tbl,calc:calcFor('p2'),guard:guard('p2'),charts:[chartAll]},
  {id:'h52e2',title:'Experiment 2: Pumps in Series',aim:'Find the combined characteristic of the two pumps in series.',steps:steps('series','0.2'),table:tbl,calc:calcFor('series'),guard:guard('series'),charts:[chartAll]},
  {id:'h52e3',title:'Experiment 3: Pumps in Parallel',aim:'Find the combined characteristic of the two pumps in parallel.',steps:steps('parallel','0.1'),table:tbl,calc:calcFor('parallel'),guard:guard('parallel'),charts:[chartAll]},
  {id:'h52e4',title:'Experiment 4: Suction Test',aim:'Find the relationship between pump flow rate and inlet pressure.',
   steps:[{t:'Create a blank results table similar to Table 5.4.'},{t:'Set the Pump and its valves in single pump (pump 2) configuration, refer to Table 5.1.',check:isCfg('p2')},
     {t:'Start the pump motor.',check:s=>s.p2on&&s.air<0.05},{t:'Record the speed and total head.',rec:true,check:(s,R)=>R.length>=1},
     {t:'Slowly close the pump inlet (suction) valve (V1) in steps of 0.05 bar.',rec:true,check:(s,R)=>R.length>=5},{t:'Plot a graph of flow rate against suction (inlet) pressure.',check:(s,R)=>R.length>=5}],
   table:[col('Qm','Flow rate Q','l/min',1,v=>v.Q),col('P1','Inlet pressure P1','bar',2,v=>v.P1),{k:'Qs',label:'Flow rate Q',unit:'l/s',dp:3},col('N','Speed','rev/min',0,v=>v.N),{k:'Hk',label:'Total head H',unit:'kPa',dp:1},col('P2','P2','bar',2,v=>v.P2)],
   calc:[r=>({Qs:r.Qm/60,Hk:(r.P2-r.P1)*100})],guard:s=>s.cfg!=='p2'?'Set the valves for pump 2 only (Table 5.1).':!s.p2on?'Start pump 2.':null,
   charts:[{title:'Flow rate against suction (inlet) pressure',x:r=>r.P1,xl:'Inlet pressure P1 (bar)',yl:'Flow rate Q (l/s)',zeroY:true,series:[{name:'Pump 2',y:r=>r.Qs}]}]}],
 hit(s,id){if(id==='st0')s.p1on=!s.p1on;else if(id==='st1')s.p2on=!s.p2on;else if(id==='V2')s.V2=!s.V2;else if(id==='V3')s.V3=!s.V3;else if(id==='V4')s.V4=!s.V4;},
 sync(s,s3){if(!s3||!s3.on)return;s3.on[0]=s.p1on;s3.on[1]=s.p2on;s3.suc=s.V1;s3.del=Math.max(5,s.V5);s3.v2=s.V1>5&&s.cfg!=='p1';s3.v3=s.cfg==='series';s3.v4=s.V2;}
});
})();
