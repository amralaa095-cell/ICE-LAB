/* Vibration and thermal devices, each written from its ICE Lab manual (MECH490L / MECH204L). */
(function(){const {tog,rng,sel,btn,rd,col,rhoW,cpW}=LK,U=LAB.util,g=9.81,PI=Math.PI;

/* =====================================================================================
   TM1016V Free and Forced Vibrations · "Free and Forced Vibration Apparatus (TM1016V).pdf"
   ===================================================================================== */
(function(){
const K=3800,LS=0.75,LEX=0.4,ME=4.2,IB=0.365,IS=0.123,LSEN=0.5,ME_OFF=0.009,R_OFF=0.035;
const ADD=[[0,'No added mass'],[0.2,'Mass holder (0.2 kg)'],[0.6,'Holder + 400 g'],[1.0,'Holder + 800 g'],[1.4,'Holder + 1200 g'],[1.8,'Holder + 1600 g'],[2.2,'Holder + 2000 g']];
const DAMP={none:['No damper',0,0.007],dry:['Damper fitted, no fluid (Undamped)',1,0.011],open:['Damper with fluid, piston fully open',1,0.045],shut:['Damper with fluid, piston fully shut',1,0.14]};
const IA=(add,damper)=>IB+(ME+add)*LEX*LEX+IS+(damper?0.53*0.25*0.25:0);
const fTheory=(add,damper)=>Math.sqrt(K*LS*LS/IA(add,damper))/(2*PI);
LAB.def({id:'tm1016v',on3d:'vibration',title:'TM1016V Free and Forced Vibrations',manual:'Free and Forced Vibration Apparatus (TM1016V).pdf · MECH490L',
 about:'Rigid beam on a pivot, supported by a spring at 0.75 m, with a motor exciter (two discs with offset masses) at 0.4 m. A non-contacting sensor at 0.5 m measures displacement; VDAS shows the traces, frequency, amplitude and phase.',
 constants:['Spring rate k = 3800 N/m at l_spring = 0.75 m; spring mass 0.388 kg, fixing 0.09 kg: I_spring = (m/3 + m_fixing) l² = 0.123 kg m².','Beam 1.65 kg, l_beam = 0.815 m, I_beam = 0.365 kg m².','Exciter 4.2 kg at l_exciter = 0.4 m; offset masses 2 × 4.5 g at 0.035 m; maximum speed 17 Hz (1020 rev/min).','I_A = I_beam + I_exciter + I_spring (Eq 4.1); f = (1/2π) √(k l_spring² / I_A).','Masses: holder 0.2 kg plus 5 × 400 g (Table 4.4).','Damper 0.53 kg, fitted 200–300 mm from the pivot. Displacement sensor 0.5 m from the pivot.'],
 assume:['The damper is taken at 0.25 m. Damping ratios: no damper 0.007, damper without fluid 0.011, fully open 0.045, fully shut 0.14.','The real beam is a little more flexible than the rigid-beam theory, so measured frequencies are about 1.5% below theory.','The exciter offset radius in Table 4.2 reads “0.035 mm”; 0.035 m (35 mm) is used.'],
 issues:['Table 4.2 gives the offset-mass radius as “0.035 mm”, l_spring as “0.75 mm” and l_beam as “0.815 mm”; Table 4.4 uses 0.75 m and 0.815 m, so these are metres.','“Magnification facroe” in Table 4.1 is the magnification factor.','Exp 2 asks to compare “all four conditions” but Table 4.5 lists three (undamped, fully open, fully shut).'],
 init:()=>({add:0,damp:'none',lvl:true,zero:true,mode:'free',on:false,f:0,fset:5,fn:0,th:0,w:0,t0:0,ph:0,ups:[],pk:[],fm:0,zm:0,zk:{},Ii:0,Iq:0,amp:0,lag:0,tr:[]}),
 step(s,dt){const Ia=IA(s.add,DAMP[s.damp][1]),wn=Math.sqrt(K*LS*LS/Ia)*0.985,z=DAMP[s.damp][2];
   U.lag(s,'f',s.on?s.fset:0,dt,0.8);const W=2*PI*s.f;
   const n=Math.ceil(dt/0.0008),h=dt/n;for(let i=0;i<n;i++){s.ph+=W*h;const M=s.on?ME_OFF*R_OFF*W*W*LEX*Math.cos(s.ph):0;
     const a=(M-2*z*wn*s.w*Ia-wn*wn*s.th*Ia)/Ia;s.w+=a*h;const prev=s.th;s.th+=s.w*h;s.t0+=h;
     const y=s.th*LSEN;
     if(prev<0&&s.th>=0){s.ups.push(s.t0);if(s.ups.length>6)s.ups.shift();}
     if(s.w<=0&&s.w-a*h>0){s.pk.push(Math.abs(y));if(s.pk.length>6)s.pk.shift();}
     if(s.on){const k=Math.min(1,h*W/(2*PI)/3);s.Ii+=(y*Math.cos(s.ph)-s.Ii)*k;s.Iq+=(y*Math.sin(s.ph)-s.Iq)*k;}}
   if(s.ups.length>2){const p=(s.ups[s.ups.length-1]-s.ups[0])/(s.ups.length-1);if(p>0)s.fm=1/p;}
   if(s.pk.length>2&&s.pk[0]>2e-6){const d=Math.log(s.pk[0]/s.pk[s.pk.length-1])/(s.pk.length-1);s.zm=d/Math.sqrt(4*PI*PI+d*d);if(!s.on&&s.f<0.05){s.zk[s.damp]=s.zm;}}
   s.amp=2*Math.sqrt(s.Ii*s.Ii+s.Iq*s.Iq);s.lag=((Math.atan2(s.Iq,s.Ii)*180/PI)+360)%360;if(s.lag>359.5)s.lag=0;
   s._tr=(s._tr||0)+dt;if(s._tr>0.004){s._tr=0;s.tr.push(s.th*LSEN*1000);if(s.tr.length>300)s.tr.shift();}},
 controls:[sel('add','Added mass under the exciter',ADD,'Beam',{set:(s,v)=>{s.add=+v;s.lvl=false;s.zero=false;}}),
   sel('damp','Damper',Object.keys(DAMP).map(k=>[k,DAMP[k][0]]),'Beam',{set:(s,v)=>{const was=DAMP[s.damp][1];s.damp=v;if(DAMP[v][1]!==was){s.lvl=false;s.zero=false;}}}),
   btn('Readjust the spring to bring the beam level',s=>{s.lvl=true;},'Beam'),btn('SET ZERO (displacement sensor)',s=>{if(s.lvl)s.zero=true;},'Beam'),
   btn('Free vibration: displace the beam end and release',s=>{s.on=false;s.th=0.004/LSEN;s.w=0;s.ups=[];s.pk=[];s.fm=0;s.zm=0;},'Free vibration'),
   rng('fset','Exciter speed set point',0,17,0.05,'Hz',2,'Exciter motor'),tog('on','Exciter motor','Exciter motor','Running (START)','Stopped'),
   rng('fn','Measured natural frequency entered in VDAS',0,10,0.01,'Hz',2,'VDAS')],
 readings:[rd('y','Displacement (sensor at 0.5 m)','mm',3,s=>s.th*LSEN*1000+(s.zero?0:0.8),0.002,{big:true}),rd('fm','Frequency from the trace','Hz',3,s=>s.fm,0.002),rd('zm','Damping ratio from the decay','',4,s=>s.zm,0),
   rd('rpm','Exciter speed','rev/min',0,s=>s.f*60,0.3),rd('rad','Exciter speed','rad/s',2,s=>s.f*2*PI,0.02),rd('hz','Exciter frequency','Hz',2,s=>s.f,0.003),
   rd('ratio','Speed ratio','',3,s=>s.fn>0?s.f/s.fn:null,0),rd('amp','Displacement amplitude','mm',3,s=>s.amp*1000,0.001),rd('lag','Phase lag','°',1,s=>s.on?s.lag:null,0.4)],
 warnings:[{when:s=>!s.lvl,msg:'The beam is not level after the change. Readjust the spring, then SET ZERO.'},{when:s=>s.amp*1000>12,msg:'Large amplitude: the beam may hit the beam stop. Move away from resonance.'}],
 instPanel:s=>{const T=s.tr,w=600,h=120;if(T.length<2)return '';const m=Math.max(0.05,...T.map(Math.abs));return `<div class="lb-trace"><b>VDAS trace · displacement (last ${(T.length*0.004).toFixed(1)} s)</b><svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none"><line x1="0" x2="${w}" y1="${h/2}" y2="${h/2}" stroke="#c9ced6"/><polyline fill="none" stroke="#2a78d6" stroke-width="1.6" points="${T.map((v,i)=>(i/(T.length-1)*w).toFixed(1)+','+(h/2-v/m*h*0.45).toFixed(1)).join(' ')}"/></svg><span>±${m.toFixed(2)} mm</span></div>`;},
 panelKey:s=>s.tr.length+':'+(s.tr[s.tr.length-1]||0).toFixed(3),
 experiments:[
  {id:'tm1',title:'Experiment 1: Rigid Beam and Spring – Added Mass',aim:'Show how added mass affects the natural frequency of the rigid beam and spring.',steps:[
    {t:'Create a blank results table similar to Table 4.4.'},
    {t:'With no additional mass, find the measured natural frequency (displace the beam and release; read the frequency from the trace).',rec:true,check:(s,R)=>R.some(r=>r.add===0)},
    {t:'Add the mass holder with no masses. If necessary, readjust the spring to bring the beam level and readjust the SET ZERO control.',check:s=>s.add>=0.2&&s.lvl&&s.zero},
    {t:'In VDAS, enter the mass holder value into the Added Mass field.'},
    {t:'Again, find the natural frequency.',rec:true,check:(s,R)=>R.some(r=>r.add===0.2)},
    {t:'Add the 5 × 400 g masses in steps. At each step, readjust the level of the beam and find the measured natural frequency.',rec:true,check:(s,R)=>new Set(R.map(r=>r.add)).size>=7},
    {t:'Calculate I_A and the theoretical natural frequency for each added mass, and chart frequency against added mass (Results and Charts tabs).'}],
   table:[col('add','Added mass','kg',1,(v,s)=>s.add),{k:'mt',label:'Total exciter mass',unit:'kg',dp:1},{k:'Im',label:'I_mass',unit:'kg m²',dp:3},{k:'Ia',label:'I_A',unit:'kg m²',dp:3},col('fm','Natural frequency f, measured','Hz',3,v=>v.fm),{k:'ft',label:'Natural frequency f, theoretical','unit':'Hz',dp:3}],
   calc:[r=>{const mt=ME+r.add,Im=mt*LEX*LEX;return {mt,Im,Ia:IB+Im+IS,ft:fTheory(r.add,0)};}],
   guard:s=>s.damp!=='none'?'Remove the damper for Experiment 1.':!s.lvl||!s.zero?'Level the beam and SET ZERO first.':s.on?'Stop the exciter motor: this is a free vibration test.':s.ups.length<4||Math.abs(s.th)*LSEN<2e-5?'Displace the beam and release it, then record while it vibrates.':null,
   charts:[{title:'Natural frequency against added mass',x:r=>r.add,xl:'Added mass (kg)',yl:'f (Hz)',zeroY:false,zeroX:true,series:[{name:'Measured',y:r=>r.fm},{name:'Theoretical',y:r=>r.ft,dash:true}]}]},
  {id:'tm2',title:'Experiment 2: Rigid Beam and Spring – Damping',aim:'Show the relationship between amplitude, phase lag, magnification factor and speed ratio, and how damping affects the oscillations.',steps:[
    {t:'Create a blank results table similar to Table 4.5.'},{t:'Input the VDAS parameters of Table 4.6 (free vibration, 2 mm, 50 ms).'},
    {t:'Fit the damper but do not add fluid yet (damper mass, no damping).',check:s=>s.damp==='dry'},
    {t:'If necessary, readjust the spring to bring the beam level and readjust the SET ZERO control.',check:s=>s.lvl&&s.zero},
    {t:'Find the measured natural frequency (free vibration) and enter it into VDAS.',check:s=>s.fn>0&&Math.abs(s.fn-s.fm)<0.05&&s.fm>0},
    {t:'Find the damping ratio from the decay of the free vibration.',check:s=>s.zm>0},
    {t:'Change VDAS to FORCED VIBRATIONS (Table 4.7: 0.1 mm) with the measured natural frequency entered, so it can calculate the speed ratio.'},
    {t:'Start VDAS and press the exciter motor START button.',check:s=>s.on},
    {t:'Adjust the speed in steps of 0.25 Hz from a speed ratio of 0.75; near 1.0 use 0.1 Hz steps. At each step wait for the oscillations to stabilise, then record amplitude and phase lag.',rec:true,check:(s,R)=>R.filter(r=>r.cond===DAMP.dry[0]).length>=8},
    {t:'Add fluid to the damper, set the piston disc fully open and repeat the test.',rec:true,check:(s,R)=>R.filter(r=>r.cond===DAMP.open[0]).length>=8},
    {t:'Repeat with the piston disc fully shut.',rec:true,check:(s,R)=>R.filter(r=>r.cond===DAMP.shut[0]).length>=8},
    {t:'Compare natural frequency and damping ratio for the conditions, find the magnification factor at speed ratio 1.0, and chart amplitude and phase lag against speed ratio.'}],
   table:[col('cond','Damping condition','',0,(v,s)=>DAMP[s.damp][0]),col('fn','Natural frequency (entered)','Hz',2,(v,s)=>s.fn),col('zm','Damping ratio (free decay)','',4,(v,s)=>s.zk[s.damp]!=null?s.zk[s.damp]:NaN),col('f','Forcing frequency','Hz',2,v=>v.hz),{k:'r',label:'Speed ratio','unit':'',dp:3},col('A','Amplitude','mm',3,v=>v.amp),col('lag','Phase lag','°',1,v=>v.lag),{k:'beta',label:'Magnification factor β',unit:'',dp:2}],
   calc:[r=>{const W=2*PI*r.f,Ast=ME_OFF*R_OFF*W*W*LEX/(K*LS*LS)*LSEN*1000;return {r:r.f/r.fn,beta:r.A/Ast};}],
   guard:s=>!s.on?'Start the exciter motor.':!(s.fn>0)?'Enter the measured natural frequency in VDAS first.':Math.abs(s.f-s.fset)>0.01?'Wait for the motor to reach the set speed and the oscillation to stabilise.':null,
   summary:R=>{const m={};R.forEach(r=>{(m[r.cond]=m[r.cond]||[]).push(r);});return Object.keys(m).map(k=>{const a=m[k],b=a.reduce((x,y)=>Math.abs(y.r-1)<Math.abs(x.r-1)?y:x);return [k,`f_n ${a[0].fn.toFixed(2)} Hz · ζ ${(+a[0].zm).toFixed(3)} · β at r = ${b.r.toFixed(2)}: ${b.beta.toFixed(1)}`];});},
   charts:[{title:'Amplitude against speed ratio',xl:'Speed ratio',yl:'Amplitude (mm)',series:Object.keys(DAMP).slice(1).map(k=>({name:DAMP[k][0],points:R=>R.filter(r=>r.cond===DAMP[k][0]).map(r=>[r.r,r.A])}))},
     {title:'Phase lag against speed ratio',xl:'Speed ratio',yl:'Phase lag (°)',series:Object.keys(DAMP).slice(1).map(k=>({name:DAMP[k][0],points:R=>R.filter(r=>r.cond===DAMP[k][0]).map(r=>[r.r,r.lag])}))}]}],
 onExp(s,e){if(e.id==='tm1'){s.damp='none';s.on=false;}},
 sync(s,s3){if(s3)s3.rpm=Math.round(s.f*60);},
 post(s,s3,refs){if(refs&&refs.bm)refs.bm.r[2]=Math.atan(s.th*LSEN*25/0.78);}
});})();

/* =====================================================================================
   TD360 Heat Exchanger Service Module · "Heat Exchanger Service Module (TD360).pdf"
   ===================================================================================== */
(function(){
const HX={con:['Concentric tube (TD360a)',36,true],plate:['Plate (TD360b)',62,false],shell:['Shell and tube (TD360c)',44,false]};
const Area=0.02,Tmains=18.0,Tamb=22.0;
function exch(s){const T=HX[s.hx];const Vh=Math.max(s.Vh,0.02),Vc=Math.max(s.Vc,0.02);
  const Th1=s.Ttank-0.6-0.9/Vh;const Tc1=Tmains+0.3;const rh=rhoW(Th1),rc=rhoW(Tc1);
  const Ch=Vh/60000*rh*cpW(Th1),Cc=Vc/60000*rc*cpW(Tc1),Cmin=Math.min(Ch,Cc),Cmax=Math.max(Ch,Cc),Cr=Cmin/Cmax;
  const UA=T[1]*Math.pow(Vh/3,0.35)*Math.pow(Vc/3,0.35)*(s.counter?1:0.97),NTU=UA/Cmin;
  const e=s.counter?(Math.abs(1-Cr)<1e-6?NTU/(1+NTU):(1-Math.exp(-NTU*(1-Cr)))/(1-Cr*Math.exp(-NTU*(1-Cr)))):(1-Math.exp(-NTU*(1+Cr)))/(1+Cr);
  const Q=e*Cmin*(Th1-Tc1);const loss=(Th1-Tamb)*(0.9+0.25*(s.hx==='con'?1:0));/* heat lost from the hot side to the room */
  const Th2=Th1-(Q+loss)/Ch,Tc2=Tc1+Q/Cc;
  const Th3=s.counter?(Th1+Th2)/2+0.4:(Th1+Th2)/2-0.6,Tc3=s.counter?(Tc1+Tc2)/2-0.3:(Tc1+Tc2)/2+0.5;
  return {Th1,Th2,Th3,Tc1,Tc2,Tc3};}
const cols=(kind)=>[col('Vh','Hot flow','L/min',2,v=>v.Fh),col('Vc','Cold flow','L/min',2,v=>v.Fc),col('Ttank','Heater tank','°C',1,v=>v.Tt),
  col('Th1','T_H1 in','°C',1,v=>v.TH1),col('Th2','T_H2 out','°C',1,v=>v.TH2),{k:'dTh',label:'ΔT_H',unit:'K',dp:2},col('Th3','T_H3','°C',1,v=>v.TH3),{k:'Tha',label:'Average T_H',unit:'°C',dp:2},
  col('Tc1','T_C1 in','°C',1,v=>v.TC1),col('Tc2','T_C2 out','°C',1,v=>v.TC2),{k:'dTc',label:'ΔT_C',unit:'K',dp:2},col('Tc3','T_C3','°C',1,v=>v.TC3),{k:'Tca',label:'Average T_C',unit:'°C',dp:2},
  {k:'eH',label:'η_H',unit:'%',dp:1},{k:'eC',label:'η_C',unit:'%',dp:1},{k:'em',label:'Mean η',unit:'%',dp:1},{k:'rH',label:'ρ_H',unit:'kg/m³',dp:1},{k:'rC',label:'ρ_C',unit:'kg/m³',dp:1},{k:'cH',label:'c_p,H',unit:'J/kg K',dp:0},{k:'cC',label:'c_p,C',unit:'J/kg K',dp:0},
  {k:'Qe',label:'Q̇_e emitted',unit:'W',dp:1},{k:'Qa',label:'Q̇_a absorbed',unit:'W',dp:1},{k:'CEB',label:'Energy balance coefficient',unit:'',dp:3},{k:'LMTD',label:'LMTD',unit:'K',dp:2},{k:'U',label:'U',unit:'W/m² K',dp:0}];
const calc=(counter)=>[(r,R,s)=>{const con=typeof r.Th3==='number'&&isFinite(r.Th3);const Tha=con?r.Th3:(r.Th1+r.Th2)/2,Tca=con?r.Tc3:(r.Tc1+r.Tc2)/2;
  const dTh=r.Th1-r.Th2,dTc=r.Tc2-r.Tc1,den=r.Th1-r.Tc1,rH=rhoW(Tha),rC=rhoW(Tca),cH=cpW(Tha),cC=cpW(Tca);
  const Qe=r.Vh/60000*rH*cH*dTh,Qa=r.Vc/60000*rC*cC*dTc;const d1=counter?r.Th1-r.Tc2:r.Th1-r.Tc1,d2=counter?r.Th2-r.Tc1:r.Th2-r.Tc2;
  const LMTD=Math.abs(d1-d2)<1e-6?d1:(d1-d2)/Math.log(d1/d2);
  return {dTh,dTc,Tha,Tca,eH:dTh/den*100,eC:dTc/den*100,em:(dTh+dTc)/(2*den)*100,rH,rC,cH,cC,Qe,Qa,CEB:Qa/Qe,LMTD,U:Qe/(Area*LMTD)};}];
const stable=s=>s.still>300;
LAB.def({id:'td360',on3d:'hx',title:'TD360 Heat Exchanger Service Module',manual:'Heat Exchanger Service Module (TD360).pdf · MECH490L / MECH204L',
 about:'Service module with a heated water tank, hot and cold circuits with hand flow-control valves and flow meters, and thermocouples T_H1–T_H3 and T_C1–T_C3. The concentric tube, plate or shell-and-tube exchanger connects for parallel or counter flow.',
 constants:['Q̇ = V ρ c_p ΔT (Eq 1.1–1.3); energy balance coefficient = Q̇_a / Q̇_e.','η_H = (T_H1 − T_H2)/(T_H1 − T_C1); η_C = (T_C2 − T_C1)/(T_H1 − T_C1); mean η is their average.','LMTD with ΔT1, ΔT2 at the two ends; U = Q̇_e / (A × LMTD), A = 0.02 m².','Water density (Eq 1.7) and specific heat capacity (Eq 1.6) at the average temperature of each circuit.','Concentric exchanger: use the mid-points T_H3 and T_C3 as the average temperatures.','Allow at least five minutes for the temperatures to stabilise.'],
 assume:['Cold supply from the mains at 18 °C; room 22 °C. Some heat is lost from the hot side to the room, so the energy balance coefficient is a little below 1.','UA at 3 L/min on both sides: concentric 36 W/K, plate 62 W/K, shell and tube 44 W/K, changing with flow to the power 0.35.','Heater tank: 3 kW heater, about 12 litres.'],
 issues:['Experiment 2, step 6 repeats “Repeat the procedure for flow rates as shown in the table for tests 2, 3 and 4”, but Table 1.6 keeps the flows fixed (hot 3, cold 2 L/min).'],
 init:()=>({hx:'con',counter:false,heat:false,set:60,Ttank:Tamb,pump:false,vh:0,vc:0,Vh:0,Vc:0,T:{Th1:Tamb,Th2:Tamb,Th3:Tamb,Tc1:Tmains,Tc2:Tmains,Tc3:Tmains},still:0,last:''}),
 step(s,dt){const P=s.heat&&s.Ttank<s.set?3000:0;const loss=(s.Ttank-Tamb)*4+(s.pump?(s.Vh/60000*990*4180*(s.Ttank-s.T.Th2)):0);s.Ttank+=(P-loss)/(12*4180)*dt;
   U.lag(s,'Vh',s.pump?4.2*s.vh/100:0,dt,1);U.lag(s,'Vc',4.2*s.vc/100,dt,1);
   const e=exch(s);const tau=s.pump&&s.Vc>0.05?40:400;for(const k in e)s.T[k]+=((s.pump||k[1]==='c'?e[k]:Tamb)-s.T[k])*(1-Math.exp(-dt/tau));
   const key=[s.hx,s.counter,Math.round(s.Vh*10),Math.round(s.Vc*10),s.set,s.pump].join();if(key!==s.last||Math.abs(s.Ttank-s.set)>1.2){s.still=0;s.last=key;}else s.still+=dt;},
 controls:[sel('hx','Heat exchanger fitted',Object.keys(HX).map(k=>[k,HX[k][0]]),'Set-up'),tog('counter','Connection','Set-up','Counter flow','Parallel flow'),
   tog('heat','Heater','Heater tank','On','Off'),rng('set','Heater tank temperature set point',20,70,1,'°C',0,'Heater tank'),tog('pump','Hot water pump','Hot circuit','On','Off'),
   rng('vh','Hot flow control valve',0,100,0.5,'% open',1,'Hot circuit'),rng('vc','Cold flow control valve',0,100,0.5,'% open',1,'Cold circuit')],
 readings:[rd('TH1','T_H1 hot in','°C',1,s=>s.T.Th1,0.04),rd('TH2','T_H2 hot out','°C',1,s=>s.T.Th2,0.04),rd('TH3','T_H3 hot mid','°C',1,s=>HX[s.hx][2]?s.T.Th3:null,0.04),
   rd('TC1','T_C1 cold in','°C',1,s=>s.T.Tc1,0.04),rd('TC2','T_C2 cold out','°C',1,s=>s.T.Tc2,0.04),rd('TC3','T_C3 cold mid','°C',1,s=>HX[s.hx][2]?s.T.Tc3:null,0.04),
   rd('Fh','Hot flow','L/min',2,s=>s.Vh,0.01),rd('Fc','Cold flow','L/min',2,s=>s.Vc,0.01),rd('Tt','Heater tank','°C',1,s=>s.Ttank,0.05),rd('Ta','Ambient (thermometer)','°C',1,()=>Tamb,0.03),rd('st','Time since last change','min',1,s=>s.still/60,0,{cal:false,key:false})],
 warnings:[{when:s=>s.heat&&!s.pump&&s.Ttank>s.set-1,msg:'Tank at temperature. Start the hot water pump.',level:'info'},{when:s=>s.pump&&s.Vc<0.05,msg:'No cold flow: open the cold flow control valve.'}],
 experiments:[[1,false],[1,true],[2,false],[2,true]].map(([n,cf])=>({id:'td'+n+(cf?'c':'p'),title:`Experiment ${n}: ${n===1?'Varying flow rate':'Varying temperature'} – ${cf?'Counter':'Parallel'} flow`,
   aim:n===1?'Show how different cold flow rates affect the performance of the exchanger (hot flow 3 L/min, heater 60 °C).':'Show how the hot water supply temperature affects the performance (hot 3 L/min, cold 2 L/min).',
   steps:[{t:`Connect the heat exchanger for ${cf?'counter':'parallel'} flow and a heater tank temperature of ${n===1?60:30} °C.`,check:s=>s.counter===cf&&s.set===(n===1?60:30)&&s.heat},
     {t:`Create a blank results table, similar to Table ${n===1?'1.4':'1.6'}.`},{t:'Use an accurate thermometer to check the local ambient air temperature for reference.'},
     {t:n===1?'For the first test, set the hot and cold flow rates for Test 1 (hot 3 L/min, cold 3 L/min). Allow at least five minutes for the temperatures to stabilise.':'Set the hot flow to 3 L/min and the cold flow to 2 L/min. Allow at least five minutes for the temperatures to stabilise.',
      check:s=>s.pump&&Math.abs(s.Vh-3)<0.06&&Math.abs(s.Vc-(n===1?3:2))<0.06&&stable(s),hint:'set the flows, then wait (use the time speed control)'},
     {t:'Record the hot and cold circuit temperatures.',rec:true,check:(s,R)=>R.length>=1},
     {t:n===1?'Repeat for tests 2, 3 and 4 (cold flow 2, 1 and 0.5 L/min).':'Repeat for heater tank temperatures of 40 °C, 50 °C and 60 °C.',rec:true,check:(s,R)=>R.length>=4},
     {t:'Find ΔT and average temperatures, ρ and c_p, Q̇_e, Q̇_a, efficiencies, energy balance coefficient, LMTD and U (Results tab), and plot the charts.'}],
   table:cols(),calc:calc(cf),
   guard:s=>s.counter!==cf?'The exchanger is connected for '+(s.counter?'counter':'parallel')+' flow; this experiment needs '+(cf?'counter':'parallel')+' flow.':!s.pump?'Start the hot water pump.':!stable(s)?'Allow at least five minutes for the temperatures to stabilise (now '+(s.still/60).toFixed(1)+' min).':null,
   charts:[{title:'Energy balance coefficient against '+(n===1?'cold flow rate':'heater temperature'),x:r=>n===1?r.Vc:r.Ttank,xl:n===1?'Cold flow (L/min)':'Heater tank temperature (°C)',yl:'Energy balance coefficient',zeroY:false,series:[{name:cf?'Counter flow':'Parallel flow',y:r=>r.CEB}]},
     {title:'Heat transfer coefficient U against '+(n===1?'cold flow rate':'heater temperature'),x:r=>n===1?r.Vc:r.Ttank,xl:n===1?'Cold flow (L/min)':'Heater tank temperature (°C)',yl:'U (W/m² K)',series:[{name:'U',y:r=>r.U}]},
     {title:'Simple temperature chart (inlet to outlet) for each test',xl:'Position along the exchanger (0 = hot inlet end, 1 = hot outlet end)',yl:'Temperature (°C)',zeroY:false,
      series:[0,1,2,3].flatMap(i=>[{name:'Test '+(i+1)+' hot',points:R=>R[i]?[[0,R[i].Th1],[1,R[i].Th2]]:[]},{name:'Test '+(i+1)+' cold',dash:true,points:R=>R[i]?(cf?[[1,R[i].Tc1],[0,R[i].Tc2]]:[[0,R[i].Tc1],[1,R[i].Tc2]]):[]}])}]})),
 sync(s,s3){if(!s3)return;s3.mh=U.clamp(s.Vh,0.5,4);s3.mc=U.clamp(s.Vc,0.5,4);s3.cf=s.counter;}
});})();

/* =====================================================================================
   TD1002 / TD1002A Linear Heat Conduction · "Heat Transfer Experiment Base Unit (TD1002).pdf"
   ===================================================================================== */
(function(){
const MAT={brass:['Brass (CZ121)',123],al:['Aluminium (6082)',170],ss:['Stainless steel',16],cu:['Copper (C101)',388]};
const D=0.025,A=PI*D*D/4,X=[0,0.02,0.04,0.06,0.08,0.10,0.12],Tamb=22,Tw=16;
function profile(s){const k=MAT[s.mid][1],W=s.on&&s.water?s.W:0;const Rc=s.paste?0.03:0.35;/* contact resistance at each face of the middle section, K/W */
  const Rb=x=>x/(123*A);const m0=0.05,m1=0.07;/* the middle section runs from x = 0.05 to 0.07 m */
  const Wn=W*0.96;const T7=Tw+W*0.32+(s.water?0:W*3);
  const R=x=>{let r=0;if(x<=m0)return Rb(x);r=Rb(m0)+Rc;if(x<=m1)return r+(x-m0)/(k*A);return r+0.02/(k*A)+Rc+Rb(x-m1);};
  const Rt=R(0.12);return X.map(x=>T7+Wn*(Rt-R(x)));}
LAB.def({id:'td1002',on3d:'heat',title:'TD1002A Linear Heat Conduction',manual:'Heat Transfer Experiment Base Unit (TD1002).pdf · MECH490L',
 about:'A brass bar with a heater at one end and a water-cooled heat sink at the other, with an interchangeable middle section and seven thermocouples T1–T7 at 20 mm spacing. The base unit shows heater power and temperatures.',
 constants:['W = kA (T1 − T2)/L (Eq 2.6); k = WL / ((T1 − T7) A) (Eq 2.9) using T1 and T7, 0.12 m apart.','Thermocouples at 0.00, 0.02 … 0.12 m from T1.','Typical k (Table 2.2): brass CZ121 123, aluminium 6082 170, copper C101 388 W/m K; stainless steel about 16 W/m K.','Thermal resistance R = L/(kA) (Eq 2.11); resistances in series add (Eq 2.13).'],
 assume:['Bar diameter 25 mm (A = 4.909 × 10⁻⁴ m²); the manual does not give it. The middle section is 20 mm long, from 0.05 to 0.07 m (around T4).','About 4% of the heater power is lost through the insulation. Each joint at the middle section adds 0.03 K/W with paste, 0.35 K/W without.','Cooling water at 16 °C; the heater thermal switch trips at 130 °C.'],
 issues:['The stainless steel value is not in Table 2.2 (only “Stainless Steel” with no number).'],
 init:()=>({mid:'brass',paste:true,water:false,on:false,W:0,T:X.map(()=>Tamb),trip:false,still:0,last:''}),
 step(s,dt){const P=profile(s);const tau=150;s.T=s.T.map((t,i)=>t+((s.on&&!s.trip?P[i]:(s.water?Tw+(Tamb-Tw)*0.3:Tamb))-t)*(1-Math.exp(-dt/tau)));if(s.T[0]>130){s.trip=true;}
   const key=[s.mid,s.paste,s.water,s.on,s.W].join();if(key!==s.last){s.last=key;s.still=0;}else s.still+=dt;},
 controls:[sel('mid','Middle section',Object.keys(MAT).map(k=>[k,MAT[k][0]]),'Set-up'),tog('paste','Heat transfer paste on the joints','Set-up','Applied','None'),
   tog('water','Water outlet valve','Cooling water','Open','Closed'),tog('on','Heater','Heater','On','Off',{set:(s,v)=>{s.on=v;if(!v)s.trip=false;}}),rng('W','Heater power',0,60,0.5,'W',1,'Heater')],
 readings:X.map((x,i)=>rd('T'+(i+1),'T'+(i+1)+' ('+x.toFixed(2)+' m)','°C',1,s=>s.T[i],0.03)).concat([rd('P','Heater power','W',1,s=>s.on&&!s.trip?s.W:0,0.05),rd('Ta','Ambient (thermometer)','°C',1,()=>Tamb,0.03),rd('st','Time at these settings','min',1,s=>s.still/60,0,{cal:false,key:false})]),
 warnings:[{when:s=>s.trip,msg:'The thermal switch has switched the heater off (too hot). Check the cooling water, switch the heater off and on again.'},{when:s=>s.on&&!s.water,msg:'Open the water outlet valve: the heat sink needs cooling water.'},{when:s=>s.on&&s.T[0]>115,msg:'T1 is close to the thermal switch limit. Use a lower heater power with low-conductivity middle sections.'}],
 instPanel:s=>{const w=560,h=110,mn=Math.min(...s.T)-2,mx=Math.max(...s.T)+2;return `<div class="lb-trace"><b>Temperature along the bar</b><svg viewBox="0 0 ${w} ${h}"><rect x="40" y="40" width="${w-80}" height="26" rx="4" fill="#d9b25a"/><rect x="${40+(w-80)*0.05/0.12}" y="40" width="${(w-80)*0.02/0.12}" height="26" fill="${s.mid==='ss'?'#9aa3ad':s.mid==='al'?'#c9ced6':s.mid==='cu'?'#c46b38':'#d9b25a'}" stroke="#555"/>${s.T.map((t,i)=>{const x=40+(w-80)*X[i]/0.12;return `<line x1="${x}" x2="${x}" y1="34" y2="72" stroke="#333"/><text x="${x}" y="28" text-anchor="middle" class="ax">${t.toFixed(1)}</text><text x="${x}" y="88" text-anchor="middle" class="ax">T${i+1}</text>`;}).join('')}<text x="20" y="57" class="ax" text-anchor="middle">heater</text><text x="${w-20}" y="57" class="ax" text-anchor="middle">sink</text></svg></div>`;},
 panelKey:s=>s.T.map(t=>t.toFixed(1)).join()+s.mid,
 experiments:[{id:'lin1',title:'Experiment 1 – Procedure 1: Brass bar',aim:'Show linear conduction along a uniform bar and find the thermal conductivity of brass.',steps:[
    {t:'Connect and set up the Linear Heat Conduction Experiment (TD1002A) on the heater module.'},
    {t:'Fit the brass middle section, using the heat transfer paste.',check:s=>s.mid==='brass'&&s.paste},
    {t:'Create a blank results table, similar to Table 2.3.'},{t:'Use an accurate thermometer to check the local ambient air temperature.'},
    {t:'Open the water outlet valve, then switch on the heater and set to 30 W.',check:s=>s.water&&s.on&&Math.abs(s.W-30)<0.3},
    {t:'Wait for the temperatures to stabilise and then record T1 to T7.',rec:true,check:(s,R)=>R.some(r=>Math.abs(r.W-30)<0.6)},
    {t:'For comparison, repeat the test at one or more heater powers greater than 30 W.',rec:true,check:(s,R)=>R.some(r=>r.W>31)},
    {t:'Switch off the heater and water supply.',check:(s,R)=>R.length>=2&&!s.on&&!s.water}],
   table:[col('mat','Middle section','',0,(v,s)=>MAT[s.mid][0]),col('Ta','Ambient','°C',1,v=>v.Ta),col('W','Power','W',1,v=>v.P)].concat(X.map((x,i)=>col('T'+(i+1),'T'+(i+1)+' ('+x.toFixed(2)+' m)','°C',1,v=>v['T'+(i+1)]))).concat([{k:'grad',label:'Thermal gradient (best fit)',unit:'K/m',dp:1},{k:'k',label:'k from T1 and T7',unit:'W/m K',dp:1},{k:'off',label:'T4 off the line',unit:'K',dp:2}]),
   calc:[r=>{const T=X.map((x,i)=>r['T'+(i+1)]);const f=U.fit(X,T);return {grad:f?-f.m:NaN,k:r.W*0.12/((T[0]-T[6])*A),off:f?T[3]-(f.c+f.m*0.06):NaN};}],
   guard:s=>!s.on||s.trip?'The heater is off.':s.still<480?'Wait for the temperatures to stabilise (at least 8 minutes; now '+(s.still/60).toFixed(1)+' min).':null,
   charts:[{title:'Temperature against distance along the bar',xl:'Distance from T1 (m)',yl:'Temperature (°C)',zeroY:false,zeroX:true,series:[0,1,2,3].map(i=>({name:'Test '+(i+1),points:R=>R[i]?X.map((x,j)=>[x,R[i]['T'+(j+1)]]):[]}))}]},
  {id:'lin2',title:'Experiment 1 – Procedure 2: Different materials',aim:'Show how middle sections of lower conductivity raise the overall thermal gradient.',steps:[
    {t:'Repeat the procedure using the different middle-section materials (with paste).',rec:true,check:(s,R)=>new Set(R.map(r=>r.mat)).size>=3},
    {t:'Plot temperature against position, add a best-fit line through all results and compare the overall gradient with Procedure 1.'},
    {t:'Add vertical lines for the middle section and comment on the gradient across it.'}],
   table:[col('mat','Middle section','',0,(v,s)=>MAT[s.mid][0]),col('W','Power','W',1,v=>v.P)].concat(X.map((x,i)=>col('T'+(i+1),'T'+(i+1),'°C',1,v=>v['T'+(i+1)]))).concat([{k:'grad',label:'Overall gradient',unit:'K/m',dp:1},{k:'kmid',label:'k of the middle section (T3–T5 drop)',unit:'W/m K',dp:1}]),
   calc:[r=>{const T=X.map((x,i)=>r['T'+(i+1)]),f=U.fit(X,T);const dBrass=r.W*0.96*(0.02/(123*A));/* brass parts between T3 and T5 */const dMid=(T[2]-T[4])-dBrass;return {grad:f?-f.m:NaN,kmid:r.W*0.96*0.02/(dMid*A)};}],
   guard:s=>!s.on||s.trip?'The heater is off.':s.still<480?'Wait for the temperatures to stabilise (now '+(s.still/60).toFixed(1)+' min).':null,
   charts:[{title:'Temperature against position for each material',xl:'Distance from T1 (m)',yl:'Temperature (°C)',zeroY:false,zeroX:true,series:Object.keys(MAT).map(k=>({name:MAT[k][0],points:R=>{const r=R.filter(x=>x.mat===MAT[k][0]).pop();return r?X.map((x,j)=>[x,r['T'+(j+1)]]):[];}}))}]}],
 sync(s,s3){if(s3)s3.Q=s.on&&!s.trip?s.W:0;}
});})();

/* =====================================================================================
   TD1060V Thermal Power Plant with Steam Turbine · "Thermal Power Plant with Steam Turbine (TD1060V).pdf"
   ===================================================================================== */
(function(){
const DISP=0.42e-6;/* pump volume per revolution, m³ (assumed) */
const Tamb=22;
function plant(s){const mflow=s.pumpOn&&s.heat?s.SW*DISP*rhoW(s.T1)/60:0;/* kg/s */
  const T3=s.T2-10-(mflow>0?0:0);const p1=mflow>0?Math.max(0,1.7*(mflow/5.6e-4)*(0.8+0.2*(s.T2-140)/40)):0;/* bar gauge at the nozzle */
  const Pst=mflow*(180e3+600*(T3-150))*0.16;/* steam power available to the wheel, W */
  const wm=3300,T0=Pst>0?4*Pst/wm:0,Tf=0.0016,cl=s.load/100*0.0000115;
  const w=T0>Tf?(T0-Tf)/(T0/wm+cl):0;const TG=cl*w;const PT=TG*w;const PG=PT*0.72;
  const R=4+46*(1-s.load/100);const VG=Math.sqrt(PG*R),IG=VG>0?PG/VG:0;
  return {mflow,T3,p1,SG:w*60/(2*PI),TG,PT,PG,VG,IG};}
LAB.def({id:'td1060v',on3d:'steam',title:'TD1060V Thermal Power Plant with Steam Turbine',manual:'Thermal Power Plant with Steam Turbine (TD1060V).pdf · MECH490L / MECH204L',
 about:'A piston pump feeds water from the reservoir to an electrically heated flash boiler (PID controlled). The steam drives a small turbine coupled to a generator with a variable load; the exhaust is condensed and returned.',
 constants:['Temperatures: T1 reservoir, T2 flash boiler (PID display), T3 steam feed (about 10 °C below T2), T4 expansion chamber, T5 condensate. P1 steam feed pressure.','SW pump speed; SG turbine speed; TG torque; PT = turbine mechanical power; VG, IG, PG generator; PH heater power.','Experiment 1: PID 160 °C, torque tared, load 0 then 50%, pump 0 → 80 rev/min then 80 → 40 rev/min.','Experiment 2: 60 rev/min, load 30–70%. Experiment 3: 170 and 180 °C.','Specific steam consumption = steam flow (kg/h) / power output (kW) (Eq 3.14). Willans line: steam flow against power, extended to zero flow.','Reservoir: 7 litres of deionised water.'],
 assume:['Pump displacement 0.42 ml per revolution (not in the manual): 80 rev/min ≈ 2 kg/h.','The turbine converts about 16% of the steam’s available enthalpy drop; generator efficiency 72%. Heater up to 3 kW.'],
 issues:['The procedure asks for specific steam consumption in kg/Wh (Eq 3.12), but the theory defines it in kg/kWh (Eq 3.14). The results use kg/kWh.','The text before Table 3.3 says “create tables similar to Table 3.4 and Table 3.5”, but the results tables are 3.3 and 3.4 (3.5 is the Willans line table).'],
 init:()=>({iso:false,tare:false,load:0,heat:false,set:160,T2:Tamb,pumpOn:false,SW:0,swk:0,bypass:false,fan2:false,T1:Tamb,T4:Tamb,T5:Tamb,o:plant({pumpOn:false,heat:false,SW:0,T1:Tamb,T2:Tamb,load:0}),PH:0,dmg:0,still:0,last:''}),
 step(s,dt){if(!s.iso){s.heat=false;s.pumpOn=false;}U.lag(s,'SW',s.pumpOn&&s.heat?s.swk:0,dt,0.6);
   const o=plant(s);s.o=o;const need=o.mflow*(2.6e6)+ (s.T2-Tamb)*2.2;const P=s.heat?U.clamp((s.set-s.T2)*120+need,0,3000):0;s.PH+=(P-s.PH)*(1-Math.exp(-dt/2));
   s.T2+=(P-need)/(5200)*dt;s.T1+=((o.mflow>0?24:Tamb)-s.T1)*(1-Math.exp(-dt/300));
   U.lag(s,'T4',o.mflow>0?101+o.p1*3:Tamb+(s.T2-Tamb)*0.1,dt,30);U.lag(s,'T5',o.mflow>0?38+o.mflow*8000:Tamb,dt,60);
   const key=[s.set,Math.round(s.swk),s.load,s.pumpOn,s.heat].join();if(key!==s.last){s.last=key;s.still=0;}else s.still+=dt;},
 controls:[tog('iso','Isolator switch (lower front panel)','Power','On','Off'),tog('fan2','Secondary fan switch','Power','I (on)','O (off)'),
   btn('Torque Tare (hold 5 s)',s=>{if(s.iso)s.tare=true;},'Power'),rng('load','Generator Load knob',0,100,1,'%',0,'Generator'),
   btn('Heaters ON (green)',s=>{if(s.iso)s.heat=true;},'Heater controls'),btn('Heaters OFF (red)',s=>{s.heat=false;},'Heater controls'),rng('set','PID target temperature',100,200,1,'°C',0,'Heater controls'),
   rng('swk','Pump speed knob',0,100,1,'rev/min',0,'Pump controls',{set:(s,v)=>{s.swk=v;}}),
   tog('pumpOn','Pump rocker switch','Pump controls','| (on)','O (off)',{set:(s,v)=>{if(v&&!s.heat){LAB.msg('The pump only operates when the heaters are switched ON.');}if(v&&s.swk>0){s.dmg++;LAB.msg('Switched on with the speed knob above zero: this can damage the motor windings.');}s.pumpOn=v;}}),
   tog('bypass','Red bypass valve','Pump controls','Open','Closed')],
 readings:[rd('T1','T1 reservoir','°C',1,s=>s.T1,0.05),rd('T2','T2 flash boiler (PID)','°C',1,s=>s.T2,0.1),rd('T3','T3 steam feed','°C',1,s=>s.o.mflow>0?s.o.T3:s.T2-10*Math.min(1,(s.T2-Tamb)/50),0.1),rd('T4','T4 expansion chamber','°C',1,s=>s.T4,0.08),rd('T5','T5 condensate','°C',1,s=>s.T5,0.06),
   rd('P1','P1 steam feed','bar',2,s=>s.bypass?s.o.p1*0.3:s.o.p1,0.01),rd('SW','SW pump speed','rev/min',0,s=>s.SW,0.3),rd('SG','SG turbine speed','rev/min',0,s=>s.bypass?s.o.SG*0.3:s.o.SG,8),rd('TG','TG torque','N m',4,s=>(s.bypass?0.1:1)*s.o.TG+(s.tare?0:0.0042),0.00005),
   rd('VG','VG generator voltage','V',2,s=>s.o.VG,0.01),rd('IG','IG generator current','A',3,s=>s.o.IG,0.001),rd('PG','PG electrical power','W',2,s=>s.o.PG,0.02),rd('PH','PH heater power','W',0,s=>s.PH,6),rd('load','Load','%',0,s=>s.load,0,{cal:false})],
 warnings:[{when:s=>s.bypass&&s.pumpOn,msg:'The red bypass valve is open: the steam is not going to the turbine. Close it (clockwise).'},{when:s=>s.pumpOn&&s.heat&&s.T2<s.set-15,msg:'The boiler is below the target. Wait for it to reach the set temperature before running the pump.'},{when:s=>s.dmg>0,msg:'The pump was switched on with the speed knob above zero. Always start at zero speed.'}],
 instPanel:s=>{const o=s.o;return `<div class="lb-trace"><b>Front panel</b><div class="lb-lcd"><span>TG: ${((s.tare?0:0.0042)+o.TG).toFixed(3)} Nm</span><span>Load ${s.load}%</span><span>SW ${s.SW.toFixed(0)} RPM</span><span>PID T2 ${s.T2.toFixed(0)} °C → ${s.set}</span><span>Heaters ${s.heat?'ON':'off'}</span></div></div>`;},
 panelKey:s=>[s.o.TG.toFixed(3),s.load,s.SW.toFixed(0),s.T2.toFixed(0),s.set,s.heat,s.tare].join(),
 experiments:[
  {id:'st1',title:'Experiment 1: Impact of steam flow rate',aim:'Analyse plant performance at different steam flow rates (pump speeds) and use the Willans line to estimate the turbine mechanical losses.',steps:[
    {t:'Turn on the apparatus using the isolator switch on the lower front panel.',check:s=>s.iso},
    {t:'One condenser fan starts; the Secondary Fan switch should be in the “O” (off) position.',check:s=>s.iso&&!s.fan2},
    {t:'Press and hold Torque Tare for 5 seconds. TG should read 0.000 Nm.',check:s=>s.tare},
    {t:'Rotate the Generator Load knob fully anticlockwise (zero load).',check:s=>s.load===0},
    {t:'Ensure the pump speed is 0.',check:s=>s.swk===0},
    {t:'Activate the heaters with the green push button.',check:s=>s.heat},
    {t:'Set the PID target temperature to 160 °C and let it reach and hold the target.',check:s=>s.set===160&&s.T2>158},
    {t:'With the knob at zero, switch the pump on with the rocker switch, then turn the knob to 80 RPM.',check:s=>s.pumpOn&&s.dmg===0&&Math.abs(s.SW-80)<1.5},
    {t:'Ensure the red bypass valve is fully closed. Watch T3 and P1 rise and the turbine speed up.',check:s=>!s.bypass&&s.o.SG>500},
    {t:'Set the generator load to 50%.',check:s=>s.load===50},
    {t:'Wait for the readings to stabilise (T3 about 10 °C below T2). Create Tables 3.3 and 3.4.',check:s=>s.still>120},
    {t:'Take 5 readings at pump speeds from 80 to 40 RPM, waiting for the results to stabilise each time.',rec:true,check:(s,R)=>R.length>=5&&Math.min(...R.map(r=>r.SW))<=42},
    {t:'Chart electrical power and turbine power against pump speed; fill in Table 3.5 and chart the Willans line and specific steam consumption.'}],
   table:tbl(),calc:calcSt(),guard:guardSt(160),summary:willans,
   charts:[{title:'Electrical and turbine power against pump speed',x:r=>r.SW,xl:'Pump speed SW (rev/min)',yl:'Power (W)',series:[{name:'Turbine mechanical power PT',y:r=>r.PT},{name:'Electrical power PG',y:r=>r.PG}]},
     {title:'Willans line: steam flow against turbine power',x:r=>r.PT,xl:'Turbine mechanical power PT (W)',yl:'Steam flow (kg/h)',zeroX:true,series:[{name:'Steam flow',y:r=>r.mkh,line:false},{name:'Best-fit line extended to zero flow',dash:true,dots:false,points:R=>{const f=U.fit(R.map(r=>r.PT),R.map(r=>r.mkh));if(!f||!f.m)return [];const x0=-f.c/f.m;return [[Math.min(0,x0),0],[Math.max(...R.map(r=>r.PT)),f.c+f.m*Math.max(...R.map(r=>r.PT))]];}}]},
     {title:'Specific steam consumption against turbine power',x:r=>r.PT,xl:'Turbine mechanical power PT (W)',yl:'s.s.c. (kg/kWh)',series:[{name:'s.s.c.',y:r=>r.ssc}]}]},
  {id:'st2',title:'Experiment 2: Impact of loading',aim:'Analyse plant performance at different loads and find the specific steam consumption.',steps:[
    {t:'Keep the heater at 160 °C (repeat Experiment 1 set-up if needed).',check:s=>s.set===160&&s.T2>158},
    {t:'Set the pump speed constant at 60 RPM.',check:s=>s.pumpOn&&Math.abs(s.SW-60)<1.5},
    {t:'Record results for applied loads from 30 to 70% (Tables 3.3 and 3.4).',rec:true,check:(s,R)=>R.length>=5&&Math.min(...R.map(r=>r.load))<=30&&Math.max(...R.map(r=>r.load))>=70},
    {t:'Plot specific steam consumption against turbine power.'}],
   table:tbl(),calc:calcSt(),guard:guardSt(160),charts:[{title:'Specific steam consumption against turbine power',x:r=>r.PT,xl:'Turbine mechanical power PT (W)',yl:'s.s.c. (kg/kWh)',series:[{name:'s.s.c.',y:r=>r.ssc}]}]},
  {id:'st3',title:'Experiment 3: Impact of steam inlet temperature',aim:'Vary the steam inlet temperature and compare plant performance.',steps:[
    {t:'Apply a constant load of 50%.',check:s=>s.load===50},
    {t:'Vary the pump speed from 80 to 40 RPM with the heater at 170 °C.',rec:true,check:(s,R)=>R.filter(r=>r.set===170).length>=5},
    {t:'Repeat with the heater at 180 °C.',rec:true,check:(s,R)=>R.filter(r=>r.set===180).length>=5},
    {t:'Chart electrical power against pump speed for 160 °C (Experiment 1), 170 °C and 180 °C.'}],
   table:tbl(),calc:calcSt(),guard:s=>s.set!==170&&s.set!==180?'Set the PID to 170 °C or 180 °C for this experiment.':guardSt(s.set)(s),
   charts:[{title:'Electrical power against pump speed',xl:'Pump speed SW (rev/min)',yl:'PG (W)',series:[{name:'160 °C (Experiment 1)',points:()=>(LAB.rows.st1||[]).map(r=>[r.SW,r.VG*r.IG])},{name:'170 °C',points:R=>R.filter(r=>r.set===170).map(r=>[r.SW,r.PG])},{name:'180 °C',points:R=>R.filter(r=>r.set===180).map(r=>[r.SW,r.PG])}]}]}],
 sync(s,s3){if(!s3)return;s3.on=s.iso;s3.Q=s.heat?Math.min(100,s.PH/30):0;}
});
function tbl(){return [col('set','PID set','°C',0,(v,s)=>s.set),col('PH','Heater power PH','W',0,v=>v.PH),col('SW','Pump speed SW','rev/min',0,v=>v.SW),col('P1','Steam feed P1','bar',2,v=>v.P1),col('T1','T1','°C',1,v=>v.T1),col('T3','T3','°C',1,v=>v.T3),col('T4','T4','°C',1,v=>v.T4),col('T5','T5','°C',1,v=>v.T5),
  col('load','Load','%',0,v=>v.load),col('SG','Turbine speed SG','rev/min',0,v=>v.SG),col('TG','Torque TG','N m',4,v=>v.TG),{k:'PT',label:'Turbine mechanical power PT',unit:'W',dp:2},col('VG','Voltage VG','V',2,v=>v.VG),col('IG','Current IG','A',3,v=>v.IG),{k:'PG',label:'Electrical power PG',unit:'W',dp:2},
  {k:'mkh',label:'Steam flow',unit:'kg/h',dp:3},{k:'ssc',label:'Specific steam consumption',unit:'kg/kWh',dp:0}];}
function calcSt(){return [r=>({PT:r.TG*r.SG*2*PI/60,PG:r.VG*r.IG,mkh:r.SW*DISP*rhoW(r.T1)*60})];}
function calcSsc(){return r=>({ssc:r.PT>0?r.mkh/(r.PT/1000):NaN});}
function willans(R){if(R.length<2)return null;const f=U.fit(R.map(r=>r.PT),R.map(r=>r.mkh));if(!f||!f.m)return null;return [['Willans line','steam flow = '+f.c.toFixed(3)+' + '+f.m.toFixed(4)+' × PT'],['Mechanical losses Q_TL (line at zero flow)',(-f.c/f.m).toFixed(2)+' W'],['Minimum s.s.c.',Math.min(...R.map(r=>r.ssc)).toFixed(0)+' kg/kWh']];}
function guardSt(T){return s=>!s.pumpOn?'Start the pump.':Math.abs(s.T2-T)>3?'Wait for the boiler to reach '+T+' °C.':s.bypass?'Close the bypass valve.':s.still<90?'Wait for the readings to stabilise.':null;}
LAB.defs.td1060v.experiments.forEach(e=>e.calc.push(calcSsc()));
})();
})();
