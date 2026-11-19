/* Fluid mechanics devices, each written from its ICE Lab manual (MECH451L / MECH204L). */
(function(){const {tog,rng,sel,btn,rd,col,rhoW,muW}=LK,U=LAB.util,g=9.81;
const n0=(x)=>Math.max(0,x);

/* =====================================================================================
   H11 Centre of Pressure Apparatus · "Centre of Pressure Apparatus (H11).pdf"
   ===================================================================================== */
(function(){
const B=0.075,R1=0.1,R2=0.2,ARM=0.2,w=9810;
/* moment of the water about the pivot for scale reading h (m), plane angle th (deg): Eq 6.4–6.8 */
function Mw(h,th){const c=Math.cos(th*Math.PI/180),lim=R1*c;if(h>=R2*c)return 0;
  if(h<=lim)return w*B*c*(R2**3-R1**3)/3-w*B*(R2*R2-R1*R1)*h/2;           /* fully submerged */
  return w*B*c*R2**3/3-w*B*R2*R2*h/2+w*B*h**3/(6*c*c);}                      /* partly submerged: sec²θ h³/6 */
const theory=(h,th)=>th===0?(h<=0.1?1.71675-11.03625*h:1.962-14.715*h+122.625*h**3):(h<=0.0866?1.4868-11.036*h:1.699-14.715*h+163.459*h**3);
LAB.def({id:'h11',on3d:'cop',title:'H11 Centre of Pressure Apparatus',manual:'Centre of Pressure Apparatus (H11).pdf · MECH451L Fluid Mechanics',
 about:'A quadrant tank on a pivot, with a trim tank and two weight hangers. Water poured into the quadrant tank pushes on the plane surface; weights on the hanger balance it. The tank can be set at 0° or 30°.',
 constants:['Plane width B = 75 mm, inner radius R1 = 100 mm, outer radius R2 = 200 mm, weight arm 200 mm.','w = ρg = 9810 N/m³.','Fully submerged, 0°: M = 1.71675 − 11.03625 h (Eq 6.5). Partly submerged, 0°: M = 1.962 − 14.715 h + 122.625 h³ (Eq 6.8).','Partly submerged, 30°: M = 1.699 − 14.715 h + 163.459 h³.','Full submersion when h ≤ 100 mm at 0°, or h ≤ 86.6 mm at 30°.','At 30° the applied weight is multiplied by cos 30 (weight angle correction).','Start of Experiment 1: h around 170–180 mm. Start of Experiment 2: h around 150 mm.'],
 assume:['The hanger takes 10 g weights (one 10 g, the rest 20 g), up to 960 g in total, as in Table 6.3.','The tilt shown on the back panel is the out-of-balance moment ÷ 0.06 N·m per degree (the real stiffness depends on the trim tank).'],
 issues:['Eq 6.5 for the 30° plane repeats the 0° numbers (1.71675 − 11.03625h). From Eq 6.4 the 30° full-submersion line is M = 1.4868 − 11.036 h; the simulation uses that.','The text says “while adding eater” (water).'],
 init:()=>({th:0,trimW:10,trim:0.35,hook:false,W:0,h:0.2,lvl:0,tilt:3}),
 step(s,dt){const c=s.th===30?Math.cos(Math.PI/6):1;
   const trimNeed=s.th===30?240:10;const trimErr=(s.trimW-trimNeed)/1000*g*ARM+(s.trim-0.5)*0.3;
   const MW=(s.hook?s.W:0)/1000*g*ARM*c;const M=Mw(s.h,s.th);const tgt=U.clamp((MW-M+trimErr)/0.06,-10,10);
   U.lag(s,'tilt',tgt,dt,0.7);},
 controls:[sel('th','Tank angle (plane from vertical)',[[0,'0° (Experiment 1)'],[30,'30° (Experiment 2)']],'Set-up'),
   sel('trimW','First hanger (trim weight)',[[10,'Empty hanger, 10 g'],[240,'Hanger + 230 g = 240 g']],'Set-up'),
   rng('trim','Water in the trim tank',0,1,0.005,'',3,'Set-up'),
   tog('hook','Second weight hanger','Weights','Hooked on','Off'),
   btn('Put 10 g on the second hanger (20 g total)',s=>{s.W=20;},'Weights'),btn('Add 20 g',s=>{s.W=Math.min(960,(s.W||20)+20);},'Weights'),btn('Remove 20 g',s=>{s.W=Math.max(20,s.W-20);},'Weights'),
   rng('lvl','Coloured water poured into the quadrant tank',0,1,0.001,'',3,'Water',{set:(s,v)=>{s.lvl=v;s.h=0.2-0.2*v;}})],
 readings:[rd('tilt','Tank angle from the 0 mm line','°',2,s=>s.tilt,0.02,{big:true}),rd('h','Water level h (scale)','mm',1,s=>s.h*1000,0.15,{res:0.5}),rd('W','Weight on the second hanger','g',0,s=>s.hook?s.W:0,0,{cal:false})],
 warnings:[{when:s=>Math.abs(s.tilt)>8,msg:'The tank is hard against its stop. Adjust the weight or the water.'},{when:s=>s.h<0.0005&&Math.abs(s.tilt)>0.3,msg:'The water level has reached 0 mm: stop the experiment here.'}],
 experiments:[0,30].map((th,j)=>({id:'h11e'+(j+1),title:j?'Experiment 2: Angled Plane (30° from vertical)':'Experiment 1: Vertical Plane (0°)',
   aim:'Find the relationship between water height and the moment of force (fluid thrust) on '+(j?'an angled':'a vertical')+' plane surface.',
   steps:[{t:'Mix about 2 litres of clean, cold water with a few drops of dye. Make sure the equipment is level.'},
     {t:'Create a blank results table similar to Table '+(j?'6.4.':'6.3.')},
     {t:j?'Hook one weight hanger to the support with about 230 g weight (240 g in total) and add water to the trim tank until the tank is at 30°: the 30° line lines up with the 0 mm line.':'Hook one (empty) weight hanger to the support and add water to the trim tank until the tank is level: the line on the back of the tank lines up with the 0 mm line.',
      check:s=>s.th===th&&s.trimW===(j?240:10)&&!s.hook&&s.lvl<0.01&&Math.abs(s.tilt)<0.25,hint:'set the angle and trim hanger, then adjust the trim tank water until the tank angle reads 0.00°'},
     {t:'Add the second weight hanger with a 10 g weight, giving a total weight of 20 g.',check:s=>s.hook&&s.W>=20},
     {t:'Pour coloured water into the quadrant tank until it returns to '+(j?'30':'0')+' degrees. Note the weight and the height reading h (expect '+(j?'around 150 mm':'around 170 to 180 mm')+').',rec:true,check:(s,R)=>R.length>=1},
     {t:'Continue increasing the weight in 20 g increments, adding water until the tank '+(j?'returns to 30 degrees':'becomes level')+'. Record the weight and level at each increment.',rec:true,check:(s,R)=>R.length>=8},
     {t:'Stop when the water level h reaches 0 mm or you have used all the weights.',check:(s,R)=>R.length>=8&&(s.h<0.003||s.W>=960)}],
   table:[col('Wg','W','g',0,(v,s)=>s.W),{k:'WN',label:'W',unit:'N',dp:3},{k:'Ma',label:'Actual M',unit:'N m',dp:4},col('hmm','h','mm',1,v=>v.h),{k:'hm',label:'h',unit:'m',dp:4},{k:'Mt',label:'Theory M',unit:'N m',dp:4}],
   calc:[r=>{const c=th?Math.cos(Math.PI/6):1,WN=r.Wg/1000*g,hm=r.hmm/1000;return {WN,Ma:WN*ARM*c,hm,Mt:theory(hm,th)};}],
   guard:s=>s.th!==th?'Set the tank angle to '+th+'° for this experiment.':!s.hook?'Hook on the second weight hanger first.':Math.abs(s.tilt)>0.3?'The tank is not at '+th+'°: adjust the water until it returns to the line (within ±0.3°).':null,
   summary:R=>{const F=R.filter(r=>r.hm<=(th?0.0866:0.1)),P=R.filter(r=>r.hm>(th?0.0866:0.1));const o=[];const f=U.fit(F.map(r=>r.hm),F.map(r=>r.Ma));if(f)o.push(['Fully submerged fit',`M = ${f.c.toFixed(3)} ${f.m<0?'−':'+'} ${Math.abs(f.m).toFixed(3)} h`],['Theory',th?'M = 1.4868 − 11.036 h':'M = 1.71675 − 11.03625 h']);o.push(['Readings fully / partly submerged',F.length+' / '+P.length]);return o;},
   charts:[{title:'Moment against water height h',x:r=>r.hm,xl:'h (m)',yl:'M (N m)',zeroX:true,series:[{name:'Actual M',y:r=>r.Ma,line:false},{name:'Theory M',y:r=>r.Mt,dash:true,dots:false}]}]})),
 onExp(s,e){s.th=e.id==='h11e2'?30:0;s.trimW=s.th===30?240:10;s.hook=false;s.W=0;s.lvl=0;s.h=0.2;},
 sync(s,s3){if(!s3)return;s3.h=Math.round(U.clamp((0.2-s.h)*800,0,160));s3.m=s.hook?s.W:0;},
 post(s,s3,refs){if(refs&&refs.piv)refs.piv.r[2]=-s.tilt*Math.PI/180;}
});})();

/* =====================================================================================
   Bernoulli Venturi · "Flow Measurement - Bernoulli Venturi Apparatus.pdf"
   ===================================================================================== */
(function(){
const TAP=['A','B','C','D','E','F','G','H','J','K','L'];
const AREA=[530.9,422.7,265.9,201.1,221.4,267.9,319.2,374.6,434.8,499.2,530.9].map(a=>a*1e-6);
const POS=[-54,-34,-22,-8,7,22,37,52,67,82,102];
const a1=AREA[0],a2=AREA[3],k=a2*Math.sqrt(2*g/(1-(a2/a1)**2));
const Cd=0.965;
function heads(Q,base){const u2=Q/a2,hv=u2*u2/(2*g);let loss=0;return AREA.map((a,i)=>{const un=Q/a;
  if(i>3)loss=0.16*hv*(i-3)/7;                               /* diffuser loss grows along the divergent part */
  const lossC=(1/(Cd*Cd)-1)*hv*(1-(a2/a1)**2)*Math.min(1,i/3); /* small loss to the throat: gives C < 1 */
  return base-(un*un-(Q/a1)**2)/(2*g)-lossC-loss;});}
LAB.def({id:'venturi',on3d:'manometer',title:'Bernoulli Venturi Apparatus',manual:'Flow Measurement - Bernoulli Venturi Apparatus.pdf · MECH451L',
 about:'A convergent–divergent (Venturi) meter on the hydraulic bench with 11 piezometer tappings A to L. The bench valve sets the flow; the outlet valve sets the pressure level in the tubes. Flow is measured with the bench.',
 constants:['Tappings A–L: areas 530.9, 422.7, 265.9, 201.1, 221.4, 267.9, 319.2, 374.6, 434.8, 499.2, 530.9 mm² (Table 2.1).','Distance from datum: −54, −34, −22, −8, 7, 22, 37, 52, 67, 82, 102 mm.','Upstream section a1 = tapping A, throat a2 = tapping D.','Q = C a2 √(2g(h1 − h2) / (1 − (a2/a1)²)) (Eq 2.5); k = a2 √(2g / (1 − (a2/a1)²)), Q = C k √(h1 − h2) (Eq 2.7).','Ideal head coefficient (a2/a1)² − (a2/an)² (Eq 2.10); actual (hn − h1)/(u2²/2g) (Eq 2.11).','C is usually between 0.92 and 0.99.'],
 assume:['C of the simulated meter is about 0.965; the diverging part loses about 16% of the throat velocity head.','The bench gives up to about 0.45 L/s through the meter. The outlet valve raises or lowers all the levels together.','The tubes read 0 to 320 mm.'],
 issues:['Table 2.1 gives tapping E at −7 mm, 1 mm from the throat D at −8 mm. From the areas E is downstream of D, so the simulation uses +7 mm.','Table 2.1 gives the 9th diameter (J) as 25.53 mm, but its area 434.8 mm² is a 23.53 mm diameter. The simulation uses the areas.'],
 init:()=>({bv:0,ov:100,Q:0,hb:0,air:true,h:Array(11).fill(0)}),
 step(s,dt){const Qt=0.45e-3*Math.pow(s.bv/100,0.8)*Math.min(1,0.25+s.ov/100);U.lag(s,'Q',Qt,dt,1.5);
   const back=0.03+0.27*(1-s.ov/100)*(0.3+s.bv/100);U.lag(s,'hb',back,dt,1.2);
   const h=heads(s.Q,0);const top=s.hb-Math.min(...h)+0.01;s.h=heads(s.Q,top);if(s.bv>2)s.air=false;},
 controls:[rng('bv','Hydraulic bench flow control valve',0,100,1,'% open',0,'Flow'),rng('ov','Venturi outlet (flow control) valve',5,100,1,'% open',0,'Flow')],
 readings:TAP.map((t,i)=>rd('h'+t,'Tube '+t,'mm',0,s=>s.h?U.clamp(s.h[i]*1000,0,320):0,0.6,{res:1})).concat([rd('Q','Bench flow','L/s',3,s=>s.Q*1000,0.002),rd('tV','Time to collect 3 L','s',1,s=>s.Q>1e-6?0.003/s.Q:0,0.15,{cal:false})]),
 warnings:[{when:s=>s.h&&Math.max(...s.h)>0.32,msg:'A level is above the top of the scale. Open the outlet valve a little.'},{when:s=>s.h&&s.Q>1e-5&&Math.min(...s.h)<0.005,msg:'The throat level is at the bottom of the scale: air may be drawn in. Close the outlet valve a little.'},{when:s=>s.air,msg:'Start the flow and bleed the air out of the tubes before taking readings.',level:'info'}],
 experiments:[{id:'ven1',title:'Venturi meter: flow and pressure distribution (Tables 2.3–2.7)',aim:'Find the coefficient of discharge C of the Venturi meter and compare the actual pressure distribution with Bernoulli theory.',
   steps:[{t:'Start the bench, open both valves and bleed the air from the piezometer tubes.',check:s=>s.bv>90&&!s.air,hint:'open the bench valve fully'},
     {t:'Adjust the outlet valve so that all levels are on the scale, the highest near the top.',check:s=>s.h&&Math.max(...s.h)<0.32&&Math.max(...s.h)>0.2&&Math.min(...s.h)>0.005},
     {t:'Create a blank results table, similar to Table 2.3.'},
     {t:'Record the pressure tapping readings and the flow (converted to m³/s).',rec:true,check:(s,R)=>R.length>=1},
     {t:'Slightly reduce the flow rate through the meter and wait for it to stabilise. Use the hydraulic bench to measure the flow.',rec:true,check:(s,R)=>R.length>=3},
     {t:'Repeat for several more (lower) flow rates down to the minimum flow that gives a reasonable set of pressure levels along the meter.',rec:true,check:(s,R)=>R.length>=6},
     {t:'Tables 2.4–2.7 and the charts are worked out in the Results and Charts tabs: ideal and actual pressure distribution, √(h1 − h2) against Q, C against Q and the percentage error.'}],
   table:[col('Q','Flow Q','m³/s',6,v=>v.Q/1000)].concat(TAP.map((t,i)=>col('h'+t,t+(i===0?' (h1)':i===3?' (h2)':''),'mm',0,v=>v['h'+t]))).concat([{k:'u2',label:'Throat velocity u2',unit:'m/s',dp:3},{k:'sq',label:'√(h1 − h2)',unit:'m^½',dp:4},{k:'C',label:'C',unit:'',dp:3},{k:'Qc',label:'Calculated flow (average C)',unit:'m³/s',dp:6},{k:'err',label:'Error',unit:'%',dp:2}]),
   calc:[(r,R)=>{const u2=r.Q/a2,sq=Math.sqrt(n0(r.hA-r.hD)/1000),C=sq>0?r.Q/(k*sq):NaN;
     const Cs=R.map(x=>{const q=Math.sqrt(n0(x.hA-x.hD)/1000);return q>0?x.Q/(k*q):NaN;}).filter(isFinite);const Cav=Cs.reduce((a,b)=>a+b,0)/(Cs.length||1);const Qc=Cav*k*sq;return {u2,sq,C,Qc,err:(Qc-r.Q)/r.Q*100};}],
   guard:s=>s.air?'Bleed the air out first.':s.Q<2e-5?'There is no flow through the meter.':Math.max(...s.h)>0.32||Math.min(...s.h)<0.005?'A level is off the scale. Adjust the outlet valve.':null,
   summary:R=>{if(!R.length)return null;const f=U.fit(R.map(r=>r.Q),R.map(r=>r.sq));const Cav=R.reduce((a,r)=>a+(r.C||0),0)/R.length;const o=[['k = a2 √(2g/(1−(a2/a1)²))',k.toExponential(4)+' m^2.5/s'],['Average C',Cav.toFixed(3)]];if(f&&f.m)o.push(['C from gradient of √Δh against Q (1 / (k × gradient))',(1/(k*f.m)).toFixed(3)]);return o;},
   charts:[{title:'Dimensionless pressure distribution (Tables 2.4 and 2.5)',xl:'Distance from tapping A (mm)',yl:'(hn − h1) / (u2²/2g)',zeroY:false,series:[
       {name:'Ideal (Eq 2.10)',dash:true,points:()=>POS.map((p,i)=>[p-POS[0],(a2/a1)**2-(a2/AREA[i])**2])},
       {name:'Actual, highest flow',points:R=>{if(!R.length)return [];const r=R.reduce((a,b)=>b.Q>a.Q?b:a);const hv=(r.Q/a2)**2/(2*g);return TAP.map((t,i)=>[POS[i]-POS[0],(r['h'+t]-r.hA)/1000/hv]);}},
       {name:'Actual, lowest flow',points:R=>{if(R.length<2)return [];const r=R.reduce((a,b)=>b.Q<a.Q?b:a);const hv=(r.Q/a2)**2/(2*g);return TAP.map((t,i)=>[POS[i]-POS[0],(r['h'+t]-r.hA)/1000/hv]);}}]},
     {title:'√(h1 − h2) against flow Q (Table 2.6)',x:r=>r.Q,xl:'Q (m³/s)',yl:'√(h1 − h2) (m^½)',zeroX:true,series:[{name:'Results',y:r=>r.sq}]},
     {title:'Coefficient of discharge C against flow',x:r=>r.Q,xl:'Q (m³/s)',yl:'C',zeroY:false,series:[{name:'C',y:r=>r.C}]}]}],
 sync(s,s3){if(s3)s3.flow=Math.round(s.Q/0.45e-3*100);}
});})();

/* =====================================================================================
   Hare's tube (shared by H314 and H314B) · "Hares Tube (H314B).pdf"
   ===================================================================================== */
const LIQ=[['oil','Light oil (sample)',880],['salt','Salt solution (sample)',1100],['glyc','Glycerol (sample)',1260],['spirit','Methylated spirit (sample)',830]];
function hareInit(){return {liq:'oil',wB:80,lB:80,imm:false,clip:false,plunger:0,closed:false,zero:false,hw:0,hl:0,hold:0};}
function hareStep(s,dt){const rl=LIQ.find(x=>x[0]===s.liq)[2],rw=998.2;
  if(!s.closed){const dp=s.clip&&s.imm?s.plunger*58:0;/* Pa per % of plunger travel */
    U.lag(s,'hw',dp/(rw*g),dt,0.5);U.lag(s,'hl',dp/(rl*g),dt,0.5);s.hold=0;}
  else{s.hold+=dt;const f=s.hold<3?0.004*dt:0;s.hw-=s.hw*f;s.hl-=s.hl*f;}}
const hareCtl=[sel('liq','Test liquid (second beaker)',LIQ.map(x=>[x[0],x[1]]),'Beakers'),tog('imm','Tubes lowered into the beakers (≥ 40 ml)','Beakers','Immersed','Raised'),
  tog('clip','Tube clip','Syringe','Open','Gripping'),rng('plunger','Syringe plunger withdrawn',0,100,1,'%',0,'Syringe',{set:(s,v)=>{if(!s.closed)s.plunger=v;}}),
  tog('closed','Tube clip closed on the tube (holds the liquid)','Syringe','Closed','Not closed'),tog('zero','Slide scales moved down to touch the beaker surfaces','Scales','Zeroed','Not zeroed'),
  btn('Release: open the clip and push the plunger fully in',s=>{s.closed=false;s.clip=true;s.plunger=0;},'Syringe')];
const hareRd=[rd('hw','Height of water (tube 1)','mm',0,s=>s.hw*1000+(s.zero?0:38),0.25,{res:1}),rd('hl','Height of test liquid (tube 2)','mm',0,s=>s.hl*1000+(s.zero?0:38),0.25,{res:1})];
const hareWarn=[{when:s=>Math.max(s.hw,s.hl)>0.45,msg:'The liquid is near the top of an acrylic tube. Do not let it rise into the black rubber tubing.'},{when:s=>s.plunger>0&&!s.clip&&!s.closed,msg:'The tube clip is gripping the tube: open it before drawing liquid up.',level:'info'}];
const hareExp=(id)=>({id,title:'Specific gravity with Hare’s tube (Table 1.2)',aim:'Determine the specific gravity of a test liquid compared to water and compare calculated results with theoretical results.',
  steps:[{t:'Carefully release the syringe from the clip on the front panel.'},
    {t:'Make sure that the syringe plunger is fully in and that the tube clip is gently gripping the tube but not compressing it.',check:s=>s.plunger===0&&!s.closed},
    {t:'Fill one beaker with 80 ml water and another beaker with approximately 80 ml of the test liquid.'},
    {t:'Make a table similar to Table 1.2.'},
    {t:'Raise the acrylic tubes enough to place the filled beakers centrally under them.'},
    {t:'Keeping the slide scales clear of the liquid, gently lower the tubes into the beakers so that they are immersed by at least 40 ml.',check:s=>s.imm},
    {t:'Open the tube clip and slowly withdraw the syringe plunger to draw liquid up into both tubes. Do not let it rise into the rubber tubing.',check:s=>s.clip&&s.hw>0.15},
    {t:'Close the tube clip to keep the liquids in the tubes. The levels drop a little, then stabilise.',check:s=>s.closed&&s.hold>3},
    {t:'Holding the tubes in place, move both slide scales down until the point of each scale just touches the liquid surface in its beaker.',check:s=>s.zero},
    {t:'Record the liquid levels in the tubes, then fully open the tube clip and push the plunger fully in.',rec:true,check:(s,R)=>R.length>=1},
    {t:'Repeat at least three times for each liquid and take the average.',rec:true,check:(s,R)=>R.length>=3},
    {t:'Repeat this experiment for different liquids.',check:(s,R)=>new Set(R.map(r=>r.liq)).size>=2}],
  table:[col('liq','Name of liquid','',0,(v,s)=>LIQ.find(x=>x[0]===s.liq)[1]),col('hl','Height of liquid h₁','mm',0,v=>v.hl),col('hw','Height of water h₂','mm',0,v=>v.hw),{k:'sg',label:'Specific gravity γ = h₂/h₁',unit:'',dp:3},{k:'rho',label:'Density of the liquid',unit:'kg/m³',dp:0}],
  calc:[r=>({sg:r.hw/r.hl,rho:r.hw/r.hl*998.2})],
  guard:s=>!s.closed?'Close the tube clip and let the levels settle first.':s.hold<3?'Wait for the levels to stabilise.':!s.zero?'Move the slide scales down to the beaker surfaces first (step 9).':null,
  summary:R=>{const m={};R.forEach(r=>{(m[r.liq]=m[r.liq]||[]).push(r.sg);});return Object.keys(m).map(k=>[k+' (average of '+m[k].length+')',(m[k].reduce((a,b)=>a+b,0)/m[k].length).toFixed(3)]);},
  charts:[]});
const hareReset=s=>{if(!s.closed)return;};

LAB.def({id:'h314b',on3d:'h314b',title:'H314B Hare’s Tube',manual:'Hares Tube (H314B).pdf · MECH451L',
 about:'Two acrylic tubes and a central syringe in an “m” arrangement, each tube with a sliding scale, and three glass beakers.',
 constants:['P = hρg (Eq 1.2). Both tubes have the same reduced pressure above them, so h₁ρ₁ = h₂ρ₂ (Eq 1.3).','Specific gravity of the test liquid = h(water) / h(liquid) (Eq 1.5).','Beakers filled with 80 ml; tubes immersed by at least 40 ml.'],
 assume:['Test liquid densities (sample values): light oil 880, salt solution 1100, glycerol 1260, methylated spirit 830 kg/m³.','Each 1% of plunger travel lowers the pressure above the liquids by 58 Pa. The tubes are about 450 mm long.','Before the scales are zeroed, readings include about 38 mm of immersion.'],
 issues:[],init:hareInit,step:hareStep,controls:hareCtl,readings:hareRd,warnings:hareWarn,experiments:[hareExp('hare1')],
 post(s,s3,refs){if(!refs)return;[s.hw,s.hl].forEach((h,i)=>{const c=refs['c'+i];if(c){const v=Math.max(0.002,h);c.s=[1,v,1];c.p[1]=0.09+v/2;}});if(refs.pl)refs.pl.p[1]=1.09+s.plunger/100*0.08;}});

/* =====================================================================================
   H314 Hydrostatics and Properties of Fluids · "Hydrostatics and Properties of Fluids Apparatus (H314).pdf"
   ===================================================================================== */
(function(){
const DL=[['water','Water',998.2],['oil','Light oil (sample)',880],['salt','Salt solution (sample)',1100]];
const VL=[['glyc','Glycerin (sample)',1260,1.41,0.085],['oil','Motor oil (sample)',880,0.29,0.03],['soap','Liquid soap (sample)',1030,0.85,0.05]];
const rhoD=s=>DL.find(x=>x[0]===s.dl)[2];
const BAL=0.1;/* triple-beam balance resolution, g */
const beakerM=72.4,bottleM=31.6,canObj={d:25.0,h:50.0};
function balance(s){const r=rhoD(s);switch(s.on){case 'beaker':return beakerM;case 'beakerL':return beakerM+s.V*1.0024*r/1000;case 'beakerD':return beakerM+Math.PI*canObj.d**2/4*canObj.h/1000*r/1000*0.995;
  case 'bottle':return bottleM;case 'bottleL':return bottleM+50.0*r/1000+(s.dry?0:0.35);default:return 0;}}
const rec=(k)=>(s,LAB)=>{s[k]=Math.round(balance(s)/BAL)*BAL+(Math.random()-0.5)*BAL;LAB.msg('Balance reads '+s[k].toFixed(1)+' g.');};
LAB.def({id:'h314',on3d:'hydro',title:'H314 Hydrostatics and Properties of Fluids',manual:'Hydrostatics and Properties of Fluids Apparatus (H314).pdf · MECH451L',
 about:'Bench with triple-beam balance, measuring beaker, Eureka can, density bottle, Hare’s tube, measuring cylinders and steel balls.',
 constants:['ρ = mass (g) / volume (ml) × 10³ (Eq 1.1). Pure water at 20 °C: 998.2 kg/m³; the result should be within 1%.','Density bottle volume 50 ml.','Hare’s tube: h₁ρ₁ = h₂ρ₂ (Eq 1.3).','Falling ball (Stokes): μ = 2(ρp − ρf) g R² / (9 Vs) (Eq 1.7).'],
 assume:['Balance resolution 0.1 g. Empty beaker 72.4 g, empty density bottle with stopper 31.6 g.','The Eureka can solid is a cylinder 25.0 mm diameter × 50.0 mm long (shown on the vernier).','Falling-ball liquids (sample values at 20 °C): glycerin 1260 kg/m³, 1.41 Pa s; motor oil 880 kg/m³, 0.29 Pa s; liquid soap 1030 kg/m³, 0.85 Pa s. Viscosity falls with temperature (about 8%, 3% and 5% per °C).','Steel balls 7800 kg/m³. Marks X and Y 200 mm apart by default.'],
 issues:['Table 1.4 asks for the ball “surface area”, which Eq 1.7 does not use.'],
 init:()=>Object.assign(hareInit(),{dl:'water',on:'none',V:0,dry:false,m1:null,m2:null,vl:'glyc',T:20,D:200,ball:3,falling:false,tf:0,x:0,lastT:null}),
 step(s,dt){hareStep(s,dt);const L=VL.find(x=>x[0]===s.vl),mu=L[3]*Math.exp(-L[4]*(s.T-20)),R=s.ball/2000,Vs=2*(7800-L[2])*g*R*R/(9*mu)*(1-2.1*R/0.025);
   if(s.falling){s.tf+=dt;s.x+=Vs*dt;if(s.x>=s.D/1000+0.05){s.falling=false;s.lastT=(s.D/1000)/Vs;LAB.msg('Ball passed mark Y. Time from X to Y: '+s.lastT.toFixed(2)+' s.');}}},
 controls:[sel('dl','Liquid for density',DL.map(x=>[x[0],x[1]]),'Density'),sel('on','On the balance pan',[['none','Nothing'],['beaker','Empty measuring beaker'],['beakerL','Beaker + liquid'],['beakerD','Beaker + displaced liquid (Eureka can)'],['bottle','Dry density bottle + stopper'],['bottleL','Filled density bottle + stopper']],'Density'),
   rng('V','Liquid in the measuring beaker',0,500,1,'ml',0,'Density'),tog('dry','Outside of the density bottle dried','Density','Dried','Wet'),
   btn('Weigh: first mass m₁',rec('m1'),'Density'),btn('Weigh: second mass m₂',rec('m2'),'Density')].concat(hareCtl.map(c=>Object.assign({},c,{group:'Hare’s tube · '+c.group}))).concat([
   sel('vl','Viscosity liquid',VL.map(x=>[x[0],x[1]]),'Falling ball'),rng('T','Liquid temperature',15,30,0.5,'°C',1,'Falling ball'),rng('D','Distance between marks X and Y',100,300,10,'mm',0,'Falling ball'),
   sel('ball','Steel ball',[[1.5,'1.5 mm'],[2,'2 mm'],[3,'3 mm'],[4,'4 mm']],'Falling ball'),btn('Drop a ball',s=>{s.falling=true;s.tf=0;s.x=-0.05;s.lastT=null;},'Falling ball')]),
 readings:[rd('bal','Balance','g',1,s=>balance(s),0,{res:0.1}),rd('V','Beaker graduations','ml',0,s=>s.V,0,{res:5,cal:false}),rd('m1','m₁ (weighed)','g',1,s=>s.m1,0,{cal:false}),rd('m2','m₂ (weighed)','g',1,s=>s.m2,0,{cal:false})].concat(hareRd).concat([
   rd('Tl','Liquid temperature','°C',1,s=>s.T,0.03),rd('tf','Stopwatch (X to Y)','s',2,s=>s.lastT,0,{res:0.01}),rd('db','Ball diameter (micrometer)','mm',3,s=>+s.ball,0.004,{res:0.001})]),
 warnings:hareWarn,
 experiments:[
  {id:'den1',title:'Density: measuring beaker',aim:'Find the density of a liquid from the mass of a measured volume.',steps:[
     {t:'Weigh the empty measuring beaker using the triple-beam balance and record the mass.',check:s=>s.m1!=null&&s.on==='beaker',hint:'put the empty beaker on the pan and press Weigh: m₁'},
     {t:'Fill the beaker with water and read the volume as accurately as possible.',check:s=>s.V>=100},
     {t:'Weigh the beaker plus water and record the mass.',check:s=>s.m2!=null&&s.on==='beakerL'},
     {t:'Record the result; the mass of liquid is found by subtraction and ρ = mass/volume × 10³ (Eq 1.1).',rec:true,check:(s,R)=>R.length>=1}],
   table:[col('liq','Liquid','',0,(v,s)=>DL.find(x=>x[0]===s.dl)[1]),col('m1','Empty beaker','g',1,(v,s)=>s.m1),col('m2','Beaker + liquid','g',1,(v,s)=>s.m2),col('V','Volume','ml',0,(v,s)=>Math.round(s.V/5)*5),{k:'m',label:'Mass of liquid',unit:'g',dp:1},{k:'rho',label:'Density ρ',unit:'kg/m³',dp:0},{k:'e',label:'Difference from 998.2 (water)',unit:'%',dp:2}],
   calc:[r=>{const m=r.m2-r.m1,rho=m/r.V*1000;return {m,rho,e:r.liq==='Water'?(rho-998.2)/998.2*100:NaN};}],
   guard:s=>s.m1==null||s.m2==null?'Weigh the empty beaker (m₁) and the beaker with liquid (m₂) first.':s.V<10?'Put some liquid in the beaker.':null,charts:[]},
  {id:'den2',title:'Density: Eureka can',aim:'Find the density from the mass of liquid displaced by a solid of known volume.',steps:[
     {t:'Take a solid object which fits in the can, measure its dimensions and calculate its volume (25.0 mm diameter × 50.0 mm).'},
     {t:'Place the Eureka can at the edge of the working surface with the spout over the sink, and fill it with liquid until it overflows.'},
     {t:'Weigh an empty beaker and place it under the spout.',check:s=>s.m1!=null},
     {t:'Gently lower the object into the can until fully immersed, collect the liquid in the beaker and re-weigh the beaker plus liquid.',check:s=>s.m2!=null&&s.on==='beakerD',hint:'select “Beaker + displaced liquid” and press Weigh: m₂'},
     {t:'Record the result and calculate the density (Eq 1.1).',rec:true,check:(s,R)=>R.length>=1}],
   table:[col('liq','Liquid','',0,(v,s)=>DL.find(x=>x[0]===s.dl)[1]),{k:'Vo',label:'Volume of the solid',unit:'ml',dp:2},col('m1','Empty beaker','g',1,(v,s)=>s.m1),col('m2','Beaker + displaced liquid','g',1,(v,s)=>s.m2),{k:'m',label:'Mass displaced',unit:'g',dp:1},{k:'rho',label:'Density ρ',unit:'kg/m³',dp:0}],
   calc:[r=>{const Vo=Math.PI*2.5*2.5/4*5.0,m=r.m2-r.m1;return {Vo,m,rho:m/Vo*1000};}],guard:s=>s.m1==null||s.m2==null?'Weigh the empty beaker (m₁) and then the beaker with the displaced liquid (m₂).':null,charts:[]},
  {id:'den3',title:'Density: density bottle (50 ml)',aim:'Find the density using a vessel of accurately known volume.',steps:[
     {t:'Dry and weigh the bottle and stopper.',check:s=>s.m1!=null&&s.on==='bottle'},
     {t:'Fill the bottle with liquid and replace the stopper.',check:s=>s.on==='bottleL'},
     {t:'Carefully dry the outside of the bottle and remove any excess liquid from the stopper.',check:s=>s.dry},
     {t:'Re-weigh the bottle plus liquid and determine the mass of liquid and hence the density.',check:s=>s.m2!=null&&s.on==='bottleL'},
     {t:'Record the result.',rec:true,check:(s,R)=>R.length>=1}],
   table:[col('liq','Liquid','',0,(v,s)=>DL.find(x=>x[0]===s.dl)[1]),col('m1','Bottle + stopper','g',1,(v,s)=>s.m1),col('m2','Bottle + liquid','g',1,(v,s)=>s.m2),{k:'m',label:'Mass of liquid',unit:'g',dp:1},{k:'rho',label:'Density ρ',unit:'kg/m³',dp:0}],
   calc:[r=>{const m=r.m2-r.m1;return {m,rho:m/50*1000};}],guard:s=>s.m1==null||s.m2==null?'Weigh the dry bottle (m₁) and the filled bottle (m₂) first.':null,charts:[]},
  hareExp('hare'),
  {id:'visc',title:'Viscosity: falling ball (Tables 1.4 and 1.5)',aim:'Determine the viscosity of a liquid by observing the terminal velocity of a sphere falling through it.',steps:[
     {t:'Fill the measuring cylinder with liquid.'},{t:'Measure the temperature of the liquid.'},{t:'Fix a mark X well below the top of the liquid.'},
     {t:'Fix a second mark Y near the bottom of the cylinder, and measure the distance D between X and Y.'},
     {t:'Measure the diameter of each ball in two perpendicular directions with the micrometer (more than one ball; take the average).'},
     {t:'Measure the weight of each ball, and the mass and volume of the liquid.'},
     {t:'Time the fall of balls of varying diameter between the marks X and Y.',rec:true,check:(s,R)=>new Set(R.map(r=>r.d1.toFixed(1))).size>=2},
     {t:'Repeat with a different liquid and fill in Tables 1.4 and 1.5.',check:(s,R)=>new Set(R.map(r=>r.liq)).size>=2}],
   table:[col('liq','Liquid','',0,(v,s)=>VL.find(x=>x[0]===s.vl)[1]),col('T','Temperature','°C',1,v=>v.Tl),col('D','Distance of fall','m',3,(v,s)=>s.D/1000),col('d1','Ball diameter 1','mm',3,v=>v.db),col('d2','Ball diameter 2','mm',3,(v,s)=>+s.ball+(Math.random()-0.5)*0.006),{k:'d',label:'Average ball diameter',unit:'m',dp:5},{k:'A',label:'Surface area',unit:'m²',dp:7},col('t','Time of fall','s',2,v=>v.tf),{k:'Vs',label:'Terminal velocity',unit:'m/s',dp:4},{k:'mu',label:'Dynamic viscosity',unit:'Pa s',dp:3}],
   calc:[r=>{const d=(r.d1+r.d2)/2000,Vs=r.D/r.t,rf=VL.find(x=>x[1]===r.liq)[2];return {d,A:Math.PI*d*d,Vs,mu:2*(7800-rf)*g*(d/2)**2/(9*Vs)};}],
   guard:s=>s.lastT==null?'Drop a ball and let it pass mark Y first.':null,
   summary:R=>{const m={};R.forEach(r=>{(m[r.liq]=m[r.liq]||[]).push(r.mu);});return Object.keys(m).map(k=>['Average μ, '+k,(m[k].reduce((a,b)=>a+b,0)/m[k].length).toFixed(3)+' Pa s']);},charts:[]}],
 onExp(s,e){if(e.id==='den1'||e.id==='den2'||e.id==='den3'){s.m1=null;s.m2=null;s.on='none';}},
 sync(s,s3){if(s3)s3.sel=s.dl==='water'?0:s.dl==='oil'?1:2;}
});})();

/* =====================================================================================
   H8 Impact of a Jet · "Impact of a Jet (H8).pdf"
   ===================================================================================== */
(function(){
const VANES={flat:['Flat plate (90°)',1,0.95],cone:['120° cone',1.5,0.93],hemi:['Hemisphere (180°)',2,0.9],asym:['Asymmetrical vane (β = 30°)',0.75,0.94]};
const F_y=y=>39.24*y;
LAB.def({id:'h8',on3d:'h8',title:'H8 Impact of a Jet',manual:'Impact of a Jet (H8).pdf · MECH451L',
 about:'A vertical jet from a 10 mm nozzle strikes a vane on a weigh beam. A 600 g jockey weight slides along the beam to balance the force. Flow is measured with the hydraulic bench.',
 constants:['Nozzle 10 mm: A = 78.54 mm², u = ṁ / 0.07854 (Eq 4.12, water 10³ kg/m³).','Vane 35 mm above the nozzle: u₀² = u² − 0.6867 (Eq 4.15).','Jockey 600 g, vane 150 mm from the pivot: F = 0.6 × 9.81 × y / 0.15 = 39.24 y.','F = ṁu₀(1 − cos θ): flat plate ×1, 120° cone ×1.5, hemisphere ×2 (Table 4.4).','Asymmetrical vane β = 30°: Fp = ṁu₀ cos β (Eq 4.17), Fx = ṁu₀ cos²β (Eq 4.18).'],
 assume:['The measured force is 90–95% of theory (splash and losses).','The bench gives up to about 0.32 kg/s through the nozzle.','The beam has a small zero error until the spring is adjusted.'],
 issues:['Eq 4.10 text says “a value of 103 kg.m-3 can be used”: this is 10³ kg/m³.'],
 init:()=>({vane:'flat',bv:0,m:0,y:0,z:0.9,tilt:0}),
 step(s,dt){U.lag(s,'m',0.32*Math.pow(s.bv/100,0.9),dt,1.2);const u=s.m/0.07854,u0=Math.sqrt(n0(u*u-0.6867)),V=VANES[s.vane];const F=s.m*u0*V[1]*V[2];
   const out=F*0.15-0.6*g*s.y/1000+(s.z-0.5)*0.03;U.lag(s,'tilt',U.clamp(out*60,-6,6),dt,0.5);s.F=F;},
 controls:[sel('vane','Vane fitted',Object.keys(VANES).map(k=>[k,VANES[k][0]]),'Set-up'),rng('z','Beam zero (spring adjuster)',0,1,0.005,'',3,'Set-up'),
   rng('bv','Hydraulic bench flow',0,100,1,'% open',0,'Flow'),rng('y','Jockey weight position y from zero',0,100,0.5,'mm',1,'Weigh beam')],
 readings:[rd('tilt','Beam position from the level mark','mm',1,s=>s.tilt,0.04,{big:true}),rd('y','Jockey distance y','mm',1,s=>s.y,0,{res:0.5,cal:false}),rd('Q','Bench flow','L/min',2,s=>s.m*60,0.05),rd('mk','Mass flow (bench)','kg/s',4,s=>s.m,0.0005)],
 warnings:[{when:s=>Math.abs(s.tilt)>5,msg:'The beam is against its stop.'}],
 experiments:['sym','asym'].map(t=>({id:'h8'+t,title:t==='sym'?'Symmetrical vanes (Table 4.5)':'Asymmetrical vane (Table 4.6)',aim:t==='sym'?'Show that the force on a vane is proportional to the rate of delivery of momentum and can be predicted from the vane shape.':'Measure the vertical force on the 30° asymmetrical vane and compare with the symmetrical vanes.',
   steps:[{t:'Create a blank results table similar to Table '+(t==='sym'?'4.5':'4.6')+(t==='asym'?'. Mount the asymmetrical vane perpendicular to the weigh beam.':'.'),check:t==='asym'?s=>s.vane==='asym':null},
     {t:'Make sure the weigh beam is at balance with the jockey weight at the zero position.',check:s=>s.y===0&&s.m<0.003&&Math.abs(s.tilt)<0.2,hint:'bench off, jockey at 0, adjust the beam zero'},
     {t:'Start the hydraulic bench and set to maximum flow.',check:s=>s.bv>=99},
     {t:'Move the jockey weight until the beam balances again. Note the distance y from the zero position.',check:s=>s.y>0&&Math.abs(s.tilt)<0.2},
     {t:'Record the flow rate using the hydraulic bench.',rec:true,check:(s,R)=>R.length>=1},
     {t:'Reduce the bench flow in steps to give at least eight more readings of distance y and flow in relatively equal increments.',rec:true,check:(s,R)=>R.filter(r=>r.vane===R[R.length-1].vane).length>=9},
     {t:'Repeat for the other vanes that need to be tested.',check:t==='sym'?(s,R)=>new Set(R.map(r=>r.vane)).size>=3:null},
     {t:'Chart force F against rate of delivery of momentum ṁu₀ for each vane, compare actual with theory and identify causes of error.'+(t==='asym'?' Compare with the symmetrical vane results.':'')}],
   table:[col('vane','Vane','',0,(v,s)=>VANES[s.vane][0]),col('Q','Flow rate','L/min',2,v=>v.Q),{k:'m',label:'Mass flow ṁ',unit:'kg/s',dp:4},col('y','Distance y','m',4,v=>v.y/1000),{k:'u',label:'Velocity u',unit:'m/s',dp:3},{k:'u0',label:'Velocity u₀',unit:'m/s',dp:3},{k:'mu0',label:'Rate of delivery of momentum ṁu₀',unit:'kg m/s²',dp:4}]
     .concat(t==='sym'?[{k:'F',label:'Force F',unit:'N',dp:3},{k:'Ft',label:'Theory F',unit:'N',dp:3}]:[{k:'Fp',label:'Perpendicular force Fp',unit:'N',dp:3},{k:'Fx',label:'Vertical force Fx (theory)',unit:'N',dp:3},{k:'F',label:'Measured vertical force',unit:'N',dp:3}]),
   calc:[r=>{const m=r.Q/60,u=m/0.07854,u0=Math.sqrt(n0(u*u-0.6867)),mu0=m*u0,F=F_y(r.y);const k=Object.values(VANES).find(v=>v[0]===r.vane)||[0,1];
     return t==='sym'?{m,u,u0,mu0,F,Ft:mu0*k[1]}:{m,u,u0,mu0,F,Fp:mu0*Math.cos(Math.PI/6),Fx:mu0*0.75};}],
   guard:s=>(t==='asym')!==(s.vane==='asym')?(t==='asym'?'Fit the asymmetrical vane.':'Fit a symmetrical vane (flat, cone or hemisphere).'):s.m<0.01?'Start the bench flow.':Math.abs(s.tilt)>0.25?'The beam is not balanced: move the jockey until it is level.':null,
   summary:R=>{const m={};R.forEach(r=>{(m[r.vane]=m[r.vane]||[]).push(r);});return Object.keys(m).map(k=>{const f=U.fit(m[k].map(r=>r.mu0),m[k].map(r=>r.F));return [k+': slope F / ṁu₀',f?f.m.toFixed(3):'—'];});},
   charts:[{title:'Force against rate of delivery of momentum',xl:'ṁu₀ (kg m/s²)',yl:'F (N)',zeroX:true,series:Object.keys(VANES).filter(k=>(t==='asym')===(k==='asym')).map(k=>({name:VANES[k][0],line:false,points:R=>R.filter(r=>r.vane===VANES[k][0]).map(r=>[r.mu0,r.F])})).concat(Object.keys(VANES).filter(k=>(t==='asym')===(k==='asym')).map(k=>({name:'Theory, '+VANES[k][0],dash:true,dots:false,points:R=>{const x=Math.max(0.01,...R.map(r=>r.mu0));return [[0,0],[x,x*VANES[k][1]]];}})))}]})),
 onExp(s,e){s.vane=e.id==='h8asym'?'asym':s.vane==='asym'?'flat':s.vane;},
 post(s,s3,refs){if(refs&&refs.beam)refs.beam.r[2]=-s.tilt*0.01;if(refs&&refs.jet)refs.jet.vis=s.m>0.01;if(refs&&refs.jockey)refs.jockey.p[0]=refs.jockey.p0+s.y/1000;}
});})();

/* =====================================================================================
   H16 Losses in Pipe Systems · "Losses in Pipe Systems (H16).pdf"
   ===================================================================================== */
(function(){
const d=0.0136,D=0.0262,A=Math.PI*d*d/4,Ab=Math.PI*D*D/4;
const KE=(1-A/Ab)**2,KC=U.lin(A/Ab,[0,0.2,0.4,0.6,0.8,1],[0.5,0.41,0.30,0.18,0.06,0]);
/* lengths between tappings and bend coefficients: not in the manual (see assumptions) */
const LEN={A:0.914,B:0.3,C:0.3,G:0.3,J:0.4,L:0.914};const KB={B:1.1,C:0.9,G:0.42,J:0.22};
const fD=Re=>Re<2300?64/Math.max(Re,1):0.316/Math.pow(Re,0.25);
function circuit(s,T){const nu=muW(T)/rhoW(T);
  const loss=(Q,which)=>{const V=Q/A,Vb=Q/Ab,Re=V*d/nu,Reb=Vb*D/nu,hv=V*V/(2*g),hvb=Vb*Vb/(2*g),fr=(L,f,dd,h)=>f*L/dd*h;const f=fD(Re),fb=fD(Reb);
    if(which==='dark')return {C:fr(LEN.C,f,d,hv)+KB.C*hv,A:fr(LEN.A,f,d,hv),B:fr(LEN.B,f,d,hv)+KB.B*hv,rest:6*hv};
    return {E:KE*hv-(hv-hvb),L:fr(LEN.L,fb,D,hvb),F:KC*hv+(hv-hvb),J:fr(LEN.J,f,d,hv)+KB.J*hv,G:fr(LEN.G,f,d,hv)+KB.G*hv,rest:6*hv};};
  return loss;}
const Hs=Q=>5.6-1.3e7*Q*Q;                                  /* hydraulic bench supply head, m */
const Kgate=x=>0.15/Math.pow(Math.max(x,0.004),2.2),Kglobe=x=>3.2/Math.pow(Math.max(x,0.004),1.6);
const PAIRS={dark:[['C',1,2],['A',3,4],['B',5,6]],light:[['E',7,8],['L',8,9],['F',9,10],['J',11,12],['K',13,14],['G',15,16]]};
LAB.def({id:'h16',on3d:'pipes',title:'H16 Losses in Pipe Systems',manual:'Losses in Pipe Systems (H16).pdf · MECH451L',
 about:'Two circuits fed from one hydraulic bench. Dark blue: C 90° elbow (1–2), A straight pipe (3–4), B sharp bend (5–6), D gate valve (gauge). Light blue: E sudden expansion 13.6→26.2 mm (7–8), L large-bore straight (8–9), F sudden contraction (9–10), J 150 mm bend (11–12), K globe valve (gauge), G 50 mm bend (15–16).',
 constants:['Standard bore 13.6 mm, large bore 26.2 mm.','Darcy f = hL 2gd / (LV²) (Eq 3.5); Blasius f = 0.0785 / Re^0.25 (Eq 3.6, as printed).','K_E = (1 − Au/Ad)² (Eq 3.9). K_C from Table 3.3 (Ad/Au = 0.27 → about 0.37).','hL = measured + (Vu² − Vd²)/2g for the expansion and contraction (Eq 3.11).','K_B = (hL − hF) 2g / V² (Eq 3.16).','Valve pressure drop 0.1 to about 0.5 bar in 0.05 bar steps; ignore piezometer differences below 20 mm.'],
 assume:['Pipe lengths between tappings are not in the manual: 914 mm for the straight pipes A and L, 300 mm through bends B, C and G, 400 mm through bend J.','Bend coefficients used to make the readings: sharp bend 1.1, elbow 0.9, 50 mm bend 0.42, 150 mm bend 0.22.','The bench supply head falls from 5.6 m at no flow. Water temperature is set below (default 20 °C).'],
 issues:['Eq 3.6 as printed (0.0785/Re^0.25) is the Fanning form; Darcy’s f from Eq 3.5 is four times larger (0.316/Re^0.25). The results table shows both.','Both procedures (Tables 3.4 and 3.5) say “fully shut the Globe valve and fully open the Gate valve”. For the light blue circuit it must be the other way round.','Step 7 says the next reading is 0.2 bar, but the tables and step 8 use 0.05 bar steps (0.1, 0.15, 0.2 …).'],
 init:()=>({bench:0,gate:0,globe:0,T:20,Qd:0,Ql:0,air:true}),
 step(s,dt){const loss=circuit(s,s.T);const sol=(K,which,x)=>{if(x<=0.001)return 0;const f=Q=>{const L=loss(Q,which);const sum=Object.values(L).reduce((a,b)=>a+b,0);return Hs(Q)*s.bench/100-sum-K(x)*(Q/A)**2/(2*g);};return f(1e-7)<=0?0:U.bisect(f,1e-7,1e-3);};
   /* both circuits share the bench: the open one takes the flow */
   const qd=sol(Kgate,'dark',s.gate/100),ql=sol(Kglobe,'light',s.globe/100),sh=qd&&ql?0.72:1;
   U.lag(s,'Qd',qd*sh,dt,1.2);U.lag(s,'Ql',ql*sh,dt,1.2);if(s.Qd+s.Ql>5e-5)s.air=false;
   s.Ld=loss(s.Qd,'dark');s.Ll=loss(s.Ql,'light');s.dpG=Kgate(s.gate/100)*(s.Qd/A)**2/(2*g)*rhoW(s.T)*g/1e5;s.dpK=Kglobe(s.globe/100)*(s.Ql/A)**2/(2*g)*rhoW(s.T)*g/1e5;},
 controls:[rng('bench','Hydraulic bench flow control',0,100,1,'%',0,'Supply'),rng('T','Water temperature',10,35,0.5,'°C',1,'Supply'),
   rng('gate','Gate valve D (dark blue circuit)',0,100,0.5,'% open',1,'Valves'),rng('globe','Globe valve K (light blue circuit)',0,100,0.5,'% open',1,'Valves')],
 readings:[rd('dpG','Gauge across gate valve','bar',3,s=>s.dpG,0.002),rd('dpK','Gauge across globe valve','bar',3,s=>s.dpK,0.002),rd('Q','Bench flow','L/s',3,s=>(s.Qd+s.Ql)*1000,0.002),rd('T','Water temperature','°C',1,s=>s.T,0.03)]
   .concat(PAIRS.dark.concat(PAIRS.light).map(([k,a,b])=>rd('p'+a+'_'+b,'Piezometer '+a+'−'+b+' ('+k+')','mm',0,s=>{const L=k in (s.Ld||{})?s.Ld:s.Ll||{};return (L[k]||0)*1000;},0.8,{res:1,hide:k==='K'}))),
 warnings:[{when:s=>s.gate>1&&s.globe>1,msg:'Both valves are open, so the flow divides between the circuits. Test one circuit at a time.'},{when:s=>s.air&&s.bench>0,msg:'Bleed the air from the piezometer tubes once the flow is running.',level:'info'}],
 experiments:[['dark','Dark blue circuit (Table 3.4)','gate','Gate','dpG',[1,2,3,4,5,6]],['light','Light blue circuit (Table 3.5)','globe','Globe','dpK',[7,8,9,10,11,12,15,16]]].map(([c,title,vk,vn,dk,tubes])=>({id:'h16'+c,title,
   aim:'Find the pressure losses across the valve, along pipes and across fittings for a range of flow rates; find K values and compare the friction factor with Blasius.',
   steps:[{t:'Create a blank results table similar to '+title.slice(-10,-1)+'.'},
     {t:'Start the hydraulic bench and adjust for full flow. Fully shut the '+(c==='dark'?'Globe':'Gate')+' valve and fully open the '+vn+' valve.',check:s=>s.bench>=99&&s[vk]>=99&&s[c==='dark'?'globe':'gate']<=0.5},
     {t:'Slowly shut the '+vn+' valve until the pressure drop across it reaches 0.1 bar.',check:s=>Math.abs(s[dk]-0.1)<0.006},
     {t:'Wait for conditions to stabilise, making a small adjustment at the bench or valve if necessary.'},
     {t:'Record the flow rate using the hydraulic bench, and the pressure drops across each piezometer (mm of water) around the circuit.',rec:true,check:(s,R)=>R.length>=1},
     {t:'Shut the valve further, in steps of 0.05 bar, and repeat.',rec:true,check:(s,R)=>R.length>=5},
     {t:'Continue to the maximum you can achieve from the bench (usually around 0.45 to 0.5 bar).',rec:true,check:(s,R)=>R.length>=8&&Math.max(...R.map(r=>r.dp))>0.44}],
   table:[col('dp','Pressure gauge','bar',3,v=>v[dk]),{k:'dpm',label:'Pressure gauge',unit:'m water',dp:3},col('QL','Flow rate','L/s',3,v=>v.Q),{k:'Q',label:'Volume flow',unit:'m³/s',dp:6}]
     .concat(PAIRS[c].filter(p=>p[0]!=='K').map(([k,a,b])=>col('h'+k,a+'−'+b+' ('+k+')','mm',0,v=>v['p'+a+'_'+b])))
     .concat([col('T','Water temperature','°C',1,v=>v.T),{k:'V',label:'Velocity V (13.6 mm)',unit:'m/s',dp:3},{k:'Re',label:'Reynolds number',unit:'',dp:0},{k:'hv',label:'V²/2g',unit:'m',dp:4},{k:'fB',label:'f Blasius (Eq 3.6)',unit:'',dp:4},{k:'fB4',label:'4 × Eq 3.6 (Darcy form)',unit:'',dp:4}])
     .concat(c==='dark'?[{k:'fA',label:'f actual, pipe A (Eq 3.5)',unit:'',dp:4},{k:'KBb',label:'K_B sharp bend B',unit:'',dp:3},{k:'KBc',label:'K_B elbow C',unit:'',dp:3},{k:'Kv',label:'K gate valve',unit:'',dp:2},{k:'lh',label:'log hL (A)',unit:'',dp:3},{k:'lq',label:'log Q',unit:'',dp:3}]
       :[{k:'fL',label:'f actual, large bore L',unit:'',dp:4},{k:'hLE',label:'Total head loss, expansion',unit:'m',dp:4},{k:'KEm',label:'K_E measured',unit:'',dp:3},{k:'hLF',label:'Total head loss, contraction',unit:'m',dp:4},{k:'KCm',label:'K_C measured',unit:'',dp:3},{k:'KBg',label:'K_B 50 mm bend G',unit:'',dp:3},{k:'KBj',label:'K_B 150 mm bend J',unit:'',dp:3},{k:'Kv',label:'K globe valve',unit:'',dp:2}]),
   calc:[r=>{const Q=r.QL/1000,V=Q/A,Vb=Q/Ab,nu=muW(r.T)/rhoW(r.T),Re=V*d/nu,hv=V*V/(2*g),hvb=Vb*Vb/(2*g),fB=0.0785/Math.pow(Re,0.25),f4=4*fB,dpm=r.dp*1e5/(rhoW(r.T)*g);
     const o={dpm,Q,V,Re,hv,fB,fB4:f4,Kv:dpm/hv};const hF=L=>f4*L/d*hv;
     if(c==='dark'){const hA=r.hA/1000;Object.assign(o,{fA:hA*2*g*d/(LEN.A*V*V),KBb:(r.hB/1000-hF(LEN.B))/hv,KBc:(r.hC/1000-hF(LEN.C))/hv,lh:Math.log10(Math.max(hA,1e-6)),lq:Math.log10(Q)});}
     else{const hLE=r.hE/1000+(hv-hvb),hLF=r.hF/1000+(hvb-hv);const ReB=Vb*D/nu;Object.assign(o,{fL:r.hL/1000*2*g*D/(LEN.L*Vb*Vb),hLE,KEm:hLE/hv,hLF,KCm:hLF/hv,KBg:(r.hG/1000-hF(LEN.G))/hv,KBj:(r.hJ/1000-hF(LEN.J))/hv});}
     return o;}],
   guard:s=>s.air?'Bleed the air from the piezometers first.':(c==='dark'?s.Qd:s.Ql)<1e-5?'There is no flow in this circuit: open its valve.':(c==='dark'?s.globe:s.gate)>0.5?'Fully shut the other circuit’s valve.':null,
   summary:R=>{if(R.length<2)return null;const o=[];if(c==='dark'){const P=R.filter(r=>r.hA>=20),f=U.fit(P.map(r=>r.lq),P.map(r=>r.lh));if(f)o.push(['Gradient n of log hL against log Q (straight pipe)',f.m.toFixed(3)]);const av=k=>R.reduce((a,r)=>a+r[k],0)/R.length;o.push(['Average K_B sharp bend',av('KBb').toFixed(3)],['Average K_B elbow',av('KBc').toFixed(3)]);}
     else{const av=k=>R.reduce((a,r)=>a+r[k],0)/R.length;o.push(['Average K_E measured / theory',av('KEm').toFixed(3)+' / '+KE.toFixed(3)],['Average K_C measured / Table 3.3',av('KCm').toFixed(3)+' / '+KC.toFixed(3)],['Average K_B 50 mm bend',av('KBg').toFixed(3)],['Average K_B 150 mm bend',av('KBj').toFixed(3)]);}return o;},
   charts:c==='dark'?[{title:'log head loss against log volume flow (straight pipe A)',x:r=>r.lq,xl:'log Q',yl:'log hL',zeroX:false,zeroY:false,series:[{name:'Pipe A',y:r=>r.lh}]},
       {title:'Friction factor against Reynolds number',x:r=>r.Re,xl:'Re',yl:'f',series:[{name:'Actual (Eq 3.5)',y:r=>r.fA},{name:'Blasius (Eq 3.6 as printed)',y:r=>r.fB,dash:true},{name:'4 × Eq 3.6',y:r=>r.fB4,dash:true}]},
       {title:'Bend head loss hB against V²/2g',x:r=>r.hv,xl:'V²/2g (m)',yl:'hB (m)',zeroX:true,series:[{name:'Sharp bend B',y:r=>r.KBb*r.hv},{name:'Elbow C',y:r=>r.KBc*r.hv}]}]
     :[{title:'Bend head loss hB against V²/2g',x:r=>r.hv,xl:'V²/2g (m)',yl:'hB (m)',zeroX:true,series:[{name:'50 mm bend G',y:r=>r.KBg*r.hv},{name:'150 mm bend J',y:r=>r.KBj*r.hv}]},
       {title:'Total head loss at the expansion and contraction against V²/2g',x:r=>r.hv,xl:'V²/2g (13.6 mm) (m)',yl:'hL (m)',zeroX:true,series:[{name:'Expansion E',y:r=>r.hLE},{name:'Contraction F',y:r=>r.hLF}]}]})),
 sync(s,s3){if(s3)s3.flow=Math.round((s.Qd+s.Ql)/0.35e-3*100);}
});})();
})();
