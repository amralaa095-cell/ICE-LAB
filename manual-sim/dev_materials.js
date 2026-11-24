/* Materials testing devices, each written from its ICE Lab manual (MECH241L). */
(function(){const {tog,rng,sel,btn,rd,col}=LK,U=LAB.util,g=9.81,PI=Math.PI;
const jit=(v,a)=>v+(Math.random()-0.5)*2*a;

/* =====================================================================================
   Charpy · "Pendulum Impact Testing Machine (Charpy).pdf"
   ===================================================================================== */
(function(){
const MET={ms:['Mild steel (sample)',96,'Ductile: dull, fibrous surface with shear lips; the specimen bent before breaking.'],al:['Aluminium alloy (sample)',21,'Mostly ductile: grey, slightly fibrous surface.'],br:['Brass (sample)',38,'Ductile: some bending and a fibrous surface.'],ci:['Cast iron (sample)',4,'Brittle: flat, bright, crystalline surface; no bending.']};
const M=20.4,R=0.75,A0=150*PI/180,E0=M*g*R*(1-Math.cos(A0));
LAB.def({id:'charpy',on3d:'charpy',title:'Pendulum Impact Tester (Charpy)',manual:'Pendulum Impact Testing Machine (Charpy).pdf · MECH241L',
 about:'A pendulum hammer is raised and locked, then released to strike a V-notched specimen resting horizontally on two supports. The digital readout shows the energy absorbed.',
 constants:['E_a = mg(h1 − h2) (Eq 4.1), read directly from the digital display.','mgh1 = ½ m v_max² (Eq 4.2).','Depth at notch = specimen depth − depth of notch; A = depth at notch × specimen width; K = E_a / A (J/mm²).','Specimen placed with the notch facing away from the hammer.'],
 assume:['Hammer 20.4 kg, 0.75 m to the centre of percussion, released from 150°: about 275 J available.','Specimens 10 × 10 mm with a 2 mm V-notch; vernier readings ±0.02 mm. Energies are typical sample values for each metal.'],
 issues:[],
 init:()=>({met:'ms',meas:false,dims:null,st:'down',placed:false,away:true,E:0,rise:0,broken:false,vmax:0}),
 step(s,dt){if(s.st==='swing'){s.t=(s.t||0)+dt;if(s.t>1.2){s.st='done';}}},
 controls:[sel('met','Specimen material',Object.keys(MET).map(k=>[k,MET[k][0]]),'Specimen',{set:(s,v)=>{s.met=v;s.meas=false;s.dims=null;s.placed=false;s.broken=false;s.E=0;}}),
   btn('Measure the specimen with the vernier caliper',s=>{s.meas=true;s.dims={d:jit(10,0.02),w:jit(10,0.02),n:jit(2,0.02)};},'Specimen'),
   sel('away','Notch orientation',[[1,'Notch facing away from the hammer'],[0,'Notch facing the hammer']],'Specimen',{get:s=>s.away?1:0,set:(s,v)=>{s.away=+v===1;}}),
   btn('Place the specimen on the supports',s=>{if(s.st==='swing')return;s.placed=true;s.broken=false;s.E=0;s.rise=0;},'Specimen'),
   btn('Raise the hammer and lock it',s=>{if(s.st!=='swing'){s.st='up';s.E=0;}},'Pendulum'),
   btn('Release the hammer',s=>{if(s.st!=='up')return;const e=s.placed&&!s.broken?Math.min(E0*0.98,MET[s.met][1]*(s.away?1:1.18)*jit(1,0.05)*(s.dims?s.dims.w*(s.dims.d-s.dims.n)/80:1)):0;const fr=1.6;s.E=e+fr;s.rise=Math.acos(1-(E0-s.E)/(M*g*R))*180/PI;s.vmax=Math.sqrt(2*g*R*(1-Math.cos(A0)));if(s.placed)s.broken=true;s.placed=false;s.st='swing';s.t=0;},'Pendulum')],
 readings:[rd('E','Absorbed energy (digital readout)','J',1,s=>s.st==='done'||s.st==='swing'?s.E:0,0,{res:0.1,big:true}),rd('d','Specimen depth','mm',2,s=>s.dims?s.dims.d:null,0,{cal:false}),rd('w','Specimen width','mm',2,s=>s.dims?s.dims.w:null,0,{cal:false}),rd('n','Depth of notch','mm',2,s=>s.dims?s.dims.n:null,0,{cal:false}),rd('rise','Hammer rise after impact','°',1,s=>s.st==='done'?s.rise:null,0,{cal:false}),rd('v','Maximum hammer velocity','m/s',2,s=>s.vmax||null,0,{cal:false})],
 warnings:[{when:s=>s.st==='up'&&!s.placed,msg:'The hammer is raised and locked. Keep clear of the swing area while placing the specimen.',level:'info'},{when:s=>!s.away&&s.placed,msg:'The notch must face away from the hammer.'}],
 instPanel:s=>s.broken&&s.st==='done'?`<div class="lb-trace"><b>Fracture surface</b><p>${MET[s.met][2]}</p></div>`:'',panelKey:s=>s.st+s.broken+s.met,
 experiments:[{id:'ch1',title:'Charpy impact test (Table 4.2)',aim:'Find the energy absorbed and impact strength of notched specimens of different metals.',steps:[
   {t:'Create a blank results table similar to Table 4.2.'},{t:'Ensure the machine is properly set up and powered on.'},
   {t:'Measure the specimen dimensions using a vernier caliper, including width, thickness and notch depth.',check:s=>s.meas},
   {t:'Calculate the net cross-sectional area at the notch.',check:s=>s.meas},
   {t:'Raise the pendulum hammer to its initial height and lock it in position.',check:s=>s.st==='up'||s.st==='swing'||s.st==='done'},
   {t:'Place the pre-notched specimen horizontally on the supports with the notch facing away from the hammer.',check:s=>(s.placed&&s.away)||s.broken},
   {t:'Release the hammer to strike the specimen.',check:s=>s.broken&&s.st==='done'},
   {t:'Record the absorbed impact energy displayed on the digital readout.',rec:true,check:(s,R)=>R.length>=1},
   {t:'Retrieve the fractured specimen and observe the fracture surface (Instruments tab).'},
   {t:'Repeat the test for specimens of different materials.',rec:true,check:(s,R)=>new Set(R.map(r=>r.met)).size>=3}],
  table:[col('met','Metal','',0,(v,s)=>MET[s.met][0]),col('d','Specimen depth','mm',2,v=>v.d),col('w','Specimen width','mm',2,v=>v.w),col('n','Depth of notch','mm',2,v=>v.n),{k:'dn',label:'Depth at notch',unit:'mm',dp:2},{k:'A',label:'Area at notch',unit:'mm²',dp:1},col('E','Absorbed energy','J',1,v=>v.E),{k:'K',label:'Impact strength',unit:'J/mm²',dp:3},col('fr','Fracture','',0,(v,s)=>MET[s.met][2].split(':')[0])],
  calc:[r=>{const dn=r.d-r.n,A=dn*r.w;return {dn,A,K:r.E/A};}],
  guard:s=>!s.dims?'Measure the specimen first.':!(s.broken&&s.st==='done')?'Break the specimen first (raise, place, release).':null,charts:[]}],
 sync(s,s3){if(!s3)return;if(s.st==='up'&&s3.st==='down')s3.st='lift';if(s.st==='swing'&&s3.st==='up'){s3.st='swing';s3.w=0;s3.hit=false;s3.max=0;}}
});})();

/* =====================================================================================
   Torsion · "Torsion Test Apparatus (PA Hilton).pdf"
   ===================================================================================== */
(function(){
const MAT={st:['Steel (sample)',79300,220],al:['Aluminium alloy (sample)',26000,140],br:['Brass (sample)',37000,150]};
const Jof=(d,di)=>PI*(Math.pow(d,4)-Math.pow(di||0,4))/32;
LAB.def({id:'torsion',on3d:'torsion',title:'Torsion Test Apparatus (PA Hilton)',manual:'Torsion Test Apparatus (PA Hilton).pdf · MECH241L',
 about:'The specimen is held between two grips. A handwheel twists one end; the other end reacts on a torque arm against a load cell. The HDA200 display shows the twist angle and the load.',
 constants:['T/J = Gθ/L (Eq 2.1). Solid shaft J = πd⁴/32; hollow shaft J = π(d_o⁴ − d_i⁴)/32.','Torque T = F × r (load × torque arm radius).','Actual twist = HDA200 twist − initial angle.','Loading stays strictly in the elastic region.'],
 assume:['Specimens 6 mm diameter, 75 mm gauge length; torque arm radius 100 mm.','Shear yield (sample values): steel 220 MPa, aluminium 140 MPa, brass 150 MPa. G: steel 79.3, aluminium 26, brass 37 GPa.','The display starts with a small non-zero initial angle until zeroed.'],
 issues:['Table 2.1 swaps d_i and d_o (“d_i outer diameter, d_o inner diameter”). Eq 2.3 uses d_o as the outer diameter.'],
 init:()=>({mat:'st',d:6,di:0,L:75,r:100,fit:false,zeroed:false,init0:jit(1.3,0.4),tw:0,F:0,yield:false,meas:false}),
 step(s,dt){const m=MAT[s.mat],J=Jof(s.d,s.di),th=s.tw*PI/180;let T=m[1]*J*th/s.L;const Ty=m[2]*J/(s.d/2);if(T>Ty){s.yield=true;T=Ty*(1+0.15*(1-Math.exp(-(T/Ty-1)*3)));}s.F=s.fit?T/s.r:0;},
 controls:[sel('mat','Specimen material',Object.keys(MAT).map(k=>[k,MAT[k][0]]),'Specimen',{set:(s,v)=>{s.mat=v;s.fit=false;s.yield=false;s.tw=0;s.meas=false;}}),btn('Measure diameter and gauge length (vernier)',s=>{s.meas=true;s.dm=jit(s.d,0.01);s.Lm=jit(s.L,0.05);},'Specimen'),
   tog('fit','Specimen secured in the grips','Specimen','Secured','Not fitted'),btn('Zero torque and angle readings',s=>{s.zeroed=true;s.init0=s.tw;},'HDA200'),
   rng('tw','Handwheel: applied twist',0,12,0.05,'°',2,'Loading',{set:(s,v)=>{if(s.fit)s.tw=v;}}),btn('Unload the specimen',s=>{s.tw=0;},'Loading')],
 readings:[rd('F','Load','N',2,s=>s.F+(s.zeroed?0:0.6),0.02),rd('H','HDA200 twist','°',2,s=>s.tw+(s.zeroed?0:s.init0),0.005),rd('dm','Diameter (vernier)','mm',2,s=>s.meas?s.dm:null,0,{cal:false}),rd('Lm','Gauge length','mm',1,s=>s.meas?s.Lm:null,0,{cal:false})],
 warnings:[{when:s=>{const m=MAT[s.mat];return s.F*s.r>0.8*m[2]*Jof(s.d,s.di)/(s.d/2);},msg:'Approaching the elastic limit. Keep loading strictly within the elastic region.'},{when:s=>s.yield,msg:'The specimen has yielded: results beyond this point are not elastic. Fit a new specimen.'}],
 experiments:[{id:'tor1',title:'Torsion test (Table 2.2)',aim:'Find the modulus of rigidity G from torque and angle of twist in the elastic region.',steps:[
   {t:'Ensure the torsion machine is properly set up and calibrated.'},{t:'Measure the specimen’s outer diameter (and inner diameter, if hollow) with a vernier caliper.',check:s=>s.meas},
   {t:'Measure the gauge length of the specimen.',check:s=>s.meas},{t:'Secure the specimen between the grips of the torsion tester.',check:s=>s.fit},
   {t:'Zero the torque and angular displacement readings.',check:s=>s.zeroed},{t:'Apply torque gradually and uniformly.',check:s=>s.tw>0.2},
   {t:'Record force and angular displacement values in Table 2.2.',rec:true,check:(s,R)=>R.length>=6},{t:'Maintain loading strictly within the elastic region.',check:(s,R)=>R.length>=6&&!s.yield},
   {t:'Unload the specimen after sufficient data has been collected.',check:(s,R)=>R.length>=6&&s.tw===0}],
  table:[col('mat','Specimen','',0,(v,s)=>MAT[s.mat][0]),col('d','Diameter d','mm',2,(v,s)=>s.dm),col('L','Gauge length L','mm',1,(v,s)=>s.Lm),col('r','Torque arm radius r','mm',0,(v,s)=>s.r),col('i0','Initial angle','°',2,(v,s)=>s.zeroed?0:s.init0),
    col('F','Load','N',2,v=>v.F),{k:'T',label:'Torque',unit:'N mm',dp:0},col('H','HDA200 twist','°',2,v=>v.H),{k:'tdeg',label:'Actual twist',unit:'°',dp:3},{k:'trad',label:'Actual twist',unit:'rad',dp:5},{k:'G',label:'G (T L / J θ)',unit:'N/mm²',dp:0}],
  calc:[r=>{const T=r.F*r.r,tdeg=r.H-r.i0,trad=tdeg*PI/180;return {T,tdeg,trad,G:trad>0?T*r.L/(Jof(r.d)*trad):NaN};}],
  guard:s=>!s.meas?'Measure the specimen first.':!s.fit?'Secure the specimen in the grips.':null,
  summary:R=>{if(R.length<2)return null;const f=U.fit(R.map(r=>r.trad),R.map(r=>r.T));if(!f)return null;const G=f.m*R[0].L/Jof(R[0].d);return [['Slope T/θ',f.m.toFixed(0)+' N mm/rad'],['G from the slope',G.toFixed(0)+' N/mm²'],['J',Jof(R[0].d).toFixed(1)+' mm⁴']];},
  charts:[{title:'Torque against angle of twist',x:r=>r.trad,xl:'Actual twist θ (rad)',yl:'Torque T (N mm)',zeroX:true,series:[{name:'Results',y:r=>r.T}]}]}],
 sync(s,s3){if(s3)s3.th=Math.min(60,s.tw*5);}
});})();

/* =====================================================================================
   MTS Universal Testing Machine · "MTS Universal Testing Machine.pdf"
   ===================================================================================== */
(function(){
const MAT={ms:{n:'Mild steel (sample)',E:205000,lop:245,el:255,uyp:290,lyp:268,ue:0.20,uts:440,lud:0.012,ef:0.30,fs:0.78,ra:0.58},
  al:{n:'Aluminium alloy (sample)',E:69000,lop:230,el:245,uyp:0,lyp:0,ue:0.09,uts:310,lud:0,ef:0.14,fs:0.85,ra:0.42},
  br:{n:'Brass (sample)',E:100000,lop:180,el:195,uyp:0,lyp:0,ue:0.32,uts:360,lud:0,ef:0.42,fs:0.80,ra:0.50}};
function sigma(m,e){const ey=m.el/m.E;if(e<=m.lop/m.E)return m.E*e;if(e<=ey)return m.lop+(m.el-m.lop)*(e-m.lop/m.E)/(ey-m.lop/m.E);
  if(m.uyp){const e1=ey+0.0015;if(e<e1)return m.el+(m.uyp-m.el)*(e-ey)/(e1-ey);const e2=e1+0.001;if(e<e2)return m.uyp-(m.uyp-m.lyp)*(e-e1)/(e2-e1);if(e<e2+m.lud)return m.lyp+3*Math.sin((e-e2)*900);
    const e3=e2+m.lud;if(e<m.ue)return m.lyp+(m.uts-m.lyp)*(1-Math.pow(1-(e-e3)/(m.ue-e3),2.2));}
  else if(e<m.ue)return m.el+(m.uts-m.el)*(1-Math.pow(1-(e-ey)/(m.ue-ey),2.6));
  if(e<m.ef)return m.uts-(m.uts-m.fs*m.uts)*Math.pow((e-m.ue)/(m.ef-m.ue),1.8);return 0;}
LAB.def({id:'utm',on3d:'utm',title:'MTS Universal Testing Machine',manual:'MTS Universal Testing Machine.pdf · MECH241L',
 about:'The specimen is held in the grips; the crosshead moves apart at a set speed and the load cell and extensometer give load against elongation until fracture.',
 constants:['σ = F/A0, ε = ΔL/L0.','From the stress–strain curve: LOP, EL, UYP, LYP, UTS, FS = F_f/A_f, E, %EL = (L_f − L0)/L0 × 100, %RA = (A0 − A_f)/A0 × 100.'],
 assume:['Round specimens 6.00 mm diameter, 30 mm gauge length; elongation from an extensometer on the gauge length.','Sample material curves: mild steel with upper and lower yield points; aluminium and brass without a yield point.','Readings are logged automatically while the test runs (closely spaced in the elastic part).'],
 issues:['Step 8 lists %EL but not %RA, which the theory also defines; both are given in the results summary.'],
 init:()=>({mat:'ms',meas:false,grip:false,run:false,v:2,e:0,F:0,broke:false,fin:null,tlog:0,Fmax:0}),
 step(s,dt){const m=MAT[s.mat],A0=PI*36/4;if(s.run&&!s.broke){s.e+=s.v/60/30*dt;const sg=sigma(m,s.e);s.F=sg*A0/1000;s.Fmax=Math.max(s.Fmax,s.F);
   if(s.e>=m.ef){s.broke=true;s.run=false;const Af=A0*(1-m.ra*jit(1,0.02));s.fin={Lf:30*(1+m.ef*0.97)+jit(0,0.05),df:Math.sqrt(4*Af/PI),Ff:s.F||m.fs*m.uts*A0/1000};s.F=0;LAB.msg('The specimen has fractured.');LAB.render();}
   s.tlog+=dt;const de=s.e-(s.elog||0);if((s.e<0.012?de>=0.00015:(s.tlog>=0.5&&de>=0.002))&&LAB.cur&&LAB.cur.id==='utm'){s.tlog=0;s.elog=s.e;const ex=LAB.cur.experiments[0];(LAB.rows[ex.id]=LAB.rows[ex.id]||[]).push({F:+(s.F+(Math.random()-0.5)*0.01).toFixed(3),dl:+(s.e*30).toFixed(4)});if(LAB.rows[ex.id].length%20===0&&LAB.save)LAB.save();}}},
 controls:[sel('mat','Specimen material',Object.keys(MAT).map(k=>[k,MAT[k].n]),'Specimen',{set:(s,v)=>{Object.assign(s,{mat:v,meas:false,grip:false,run:false,e:0,F:0,broke:false,fin:null,Fmax:0});}}),
   btn('Measure gauge length and diameter',s=>{s.meas=true;s.L0=jit(30,0.02);s.d0=jit(6,0.005);},'Specimen'),tog('grip','Specimen mounted and aligned in the grips','Specimen','Mounted','Not mounted'),
   rng('v','Crosshead speed',0.5,10,0.5,'mm/min',1,'Test'),tog('run','Test','Test','Running','Stopped',{set:(s,v)=>{if(v&&(!s.grip||s.broke))return;s.run=v;}}),
   btn('Join the halves and measure final length and diameter',s=>{if(s.fin){s.finM=true;LAB.render();}},'After fracture')],
 readings:[rd('F','Load','kN',3,s=>s.F,0.004),rd('dl','Elongation','mm',3,s=>s.e*30,0),rd('sg','Stress (live)','MPa',1,s=>s.F*1000/(PI*9),0,{cal:false}),rd('L0','Gauge length L0','mm',2,s=>s.meas?s.L0:null,0,{cal:false}),rd('d0','Diameter d0','mm',3,s=>s.meas?s.d0:null,0,{cal:false}),
   rd('Lf','Final gauge length','mm',2,s=>s.finM?s.fin.Lf:null,0,{cal:false}),rd('df','Diameter at fracture','mm',3,s=>s.finM?s.fin.df:null,0,{cal:false})],
 warnings:[{when:s=>s.run,msg:'Test running: keep clear of the specimen area.',level:'info'}],
 experiments:[{id:'ten1',title:'Tensile test',aim:'Find the stress–strain curve and material properties of a metal specimen.',steps:[
   {t:'Measure the original gauge length and diameter of the specimen accurately.',check:s=>s.meas},{t:'Mount the specimen securely in the grips, properly aligned.',check:s=>s.grip},
   {t:'Begin applying the tensile load gradually and record load against elongation at regular intervals (logged automatically).',check:s=>s.run||s.broke},
   {t:'Continue the test until the specimen fractures completely.',check:s=>s.broke},{t:'Join the two broken halves and measure the final gauge length and the diameter at the fracture.',check:s=>s.finM},
   {t:'Calculate engineering stress and strain for each interval (Results tab).'},{t:'Plot the stress–strain curve (Charts tab).'},{t:'Determine LOP, EL, UYP, LYP, UTS, FS, E and %EL (summary under the table).'}],
  table:[col('F','Load','kN',3,v=>v.F),col('dl','Elongation ΔL','mm',3,v=>v.dl),{k:'sg',label:'Engineering stress σ',unit:'MPa',dp:1},{k:'ep',label:'Engineering strain ε',unit:'',dp:5}],
  calc:[(r,R,s)=>{const A0=PI*Math.pow(s.d0||6,2)/4;return {sg:r.F*1000/A0,ep:r.dl/(s.L0||30)};}],
  guard:s=>!s.meas?'Measure the specimen first.':!s.grip?'Mount the specimen.':null,
  summary:(R,s)=>{if(R.length<10)return null;const m=MAT[s.mat];const el=R.filter(r=>r.sg<m.lop*0.9&&r.sg>10);const f=U.fit(el.map(r=>r.ep),el.map(r=>r.sg));const uts=Math.max(...R.map(r=>r.sg));const A0=PI*Math.pow(s.d0||6,2)/4;
    const o=[['Young’s modulus E (fit of the straight part)',f?(f.m/1000).toFixed(1)+' GPa':'—'],['Limit of proportionality (where the curve leaves the line by 0.5%)',(()=>{if(!f)return '—';const r=R.find(r=>r.sg>50&&Math.abs(r.sg-(f.c+f.m*r.ep))>0.005*r.sg+1);return r?r.sg.toFixed(0)+' MPa':'—';})()],
      ['UTS',uts.toFixed(0)+' MPa']];
    if(m.uyp){const yr=R.filter(r=>r.ep<0.02&&r.ep>m.el/m.E);if(yr.length){const up=Math.max(...yr.map(r=>r.sg));o.push(['Upper yield point',up.toFixed(0)+' MPa'],['Lower yield point',Math.min(...yr.filter(r=>r.ep>0.004).map(r=>r.sg)).toFixed(0)+' MPa']);}}
    if(s.finM){const Af=PI*s.fin.df*s.fin.df/4;o.push(['Fracture strength FS = F_f / A_f',(s.fin.Ff*1000/Af).toFixed(0)+' MPa'],['% elongation',((s.fin.Lf-s.L0)/s.L0*100).toFixed(1)+' %'],['% reduction in area',((A0-Af)/A0*100).toFixed(1)+' %']);}
    return o;},
  charts:[{title:'Engineering stress against engineering strain',x:r=>r.ep,xl:'Strain ε',yl:'Stress σ (MPa)',zeroX:true,series:[{name:'Test',y:r=>r.sg,dots:false}]}]}],
 sync(s,s3){if(!s3)return;if(s.run&&s3.st==='idle')s3.st='run';if(!s.run&&!s.broke&&s3.st!=='idle'){s3.st='idle';s3.e=0;s3.F=0;}}
});})();

/* =====================================================================================
   HSM19D Rotating Fatigue · "Rotating Fatigue Testing Machine (HSM19D).pdf"
   ===================================================================================== */
(function(){
const MAT={st:['Mild steel (sample)',620,0.085,235],al:['Aluminium alloy (sample)',420,0.105,0],br:['Brass (sample)',480,0.1,150]};
const D=8,L=125,RPM=2800;
const sig=F=>32*F*L/(PI*D*D*D);
function life(m,S){const k=MAT[m];if(k[3]&&S<=k[3])return Infinity;return Math.pow(k[1]/S,1/k[2])*Math.pow(10,(Math.random()-0.5)*0.5);}
LAB.def({id:'hsm19d',on3d:'fatigue',title:'HSM19D Rotating Fatigue Machine',manual:'Rotating Fatigue Testing Machine (HSM19D).pdf · MECH241L',
 about:'A cantilever specimen rotates while a screw jack applies a load at its end, so each revolution reverses the bending stress. A counter logs the cycles until fracture, when the unit switches off.',
 constants:['σ = My/I = 32FL/(πD³) (Eq 3.7), the stress amplitude S.','Plot S against N and log S against log N; find the endurance limit if there is one.','Below the endurance limit stop after about 10⁷ reversals (around 30 hours) and record “Not failed”.'],
 assume:['Test diameter D = 8 mm, cantilever length L = 125 mm, 2 800 rev/min, one cycle per revolution.','Sample S–N curves: mild steel endurance about 235 MPa; brass about 150 MPa; aluminium has none. Lives scatter by about ±0.25 in log N.'],
 issues:['10⁷ reversals in 30 hours means about 5 500 per minute; at 2 800 rev/min one reversal per revolution would take about 60 hours. The manual does not give the speed.'],
 init:()=>({mat:'st',pwr:false,disp:false,cnt:0,tare:false,F:0,Fset:0,sw:false,guard:false,pc:false,log:false,on:false,N:0,Nf:0,broke:false,lagF:0}),
 step(s,dt){U.lag(s,'lagF',s.Fset,dt,1.5);s.F=s.lagF;if(s.on){if(!(s.sw&&s.guard&&s.pwr)){s.on=false;LAB.msg('The motor stopped: a microswitch is open or there is no power.');return;}
   if(!s.Nf)s.Nf=life(s.mat,sig(s.F));s.N+=RPM/60*dt;if(s.N>=s.Nf){s.N=s.Nf;s.on=false;s.broke=true;LAB.msg('The specimen has fractured; the unit has switched off.');LAB.render();}}},
 controls:[sel('mat','Specimen grade',Object.keys(MAT).map(k=>[k,MAT[k][0]]),'Specimen',{set:(s,v)=>{Object.assign(s,{mat:v,N:0,Nf:0,broke:false,on:false});}}),btn('Fit a new specimen',s=>{Object.assign(s,{N:0,Nf:0,broke:false,on:false,sw:false,guard:false});},'Specimen'),
   tog('pwr','Power lead connected to the starter box','Set-up','Connected','Off'),tog('disp','Counter display box (rocker switch)','Set-up','On','Off'),
   btn('Rotate the specimen by hand',s=>{if(s.disp){s.handCount=true;s.N+=1;}},'Set-up'),btn('Reset the count to zero',s=>{s.N=0;},'Set-up'),
   btn('Tare the load reading',s=>{s.tare=true;},'Load'),rng('Fset','Screw jack load',0,300,1,'N',0,'Load',{set:(s,v)=>{if(!s.on)s.Fset=v;}}),
   tog('sw','Specimen microswitch engaged','Safety','Engaged','Open'),tog('guard','Guard closed (guard microswitch)','Safety','Closed','Open'),
   tog('pc','Display box connected to the computer; HSM19D software running','Logging','Connected','No'),tog('log','Software logging','Logging','START (logging)','STOP'),
   btn('Start motor (green button)',s=>{if(s.broke){LAB.msg('Fit a new specimen.');return;}if(s.sw&&s.guard&&s.pwr){s.on=true;}else LAB.msg('The motor will not start until both microswitches are engaged and the power is connected.');},'Motor'),
   btn('Stop motor',s=>{s.on=false;},'Motor'),btn('Stop the test (not failed)',s=>{s.on=false;s.stopped=true;},'Motor')],
 readings:[rd('F','Force','N',1,s=>s.F+(s.tare?0:3.2),0.3),rd('N','Cycle count','',0,s=>s.disp?s.N:null,0,{cal:false,big:true}),rd('rpm','Speed','rev/min',0,s=>s.on?RPM:0,4),rd('S','Bending stress S','MPa',1,s=>sig(s.F),0,{cal:false}),rd('hrs','Running time','h',2,s=>s.N/RPM/60,0,{cal:false})],
 warnings:[{when:s=>s.on&&s.N>1e7,msg:'More than 10⁷ cycles: the test may be stopped and recorded as “Not failed”.',level:'info'},{when:s=>s.on,msg:'Use the time speed control to run long tests (up to 10 hours per second).',level:'info'}],
 experiments:[{id:'fat1',title:'Fatigue test (Tables 3.2 and 3.3)',aim:'Find the S–N curve of the specimen material and any endurance limit.',steps:[
   {t:'Connect the power lead to the starter box.',check:s=>s.pwr},{t:'Plug in the sensor connections and turn on the counter display box.',check:s=>s.disp},
   {t:'Rotate the specimen by hand to check that a count is registered, then reset the count to zero.',check:s=>s.handCount&&s.N===0},
   {t:'Tare the load reading, apply a load with the screw jack to check the force registers, then remove the load.',check:s=>s.tare},
   {t:'Set the desired load with the screw jack and allow the reading to stabilise.',check:s=>s.Fset>0&&Math.abs(s.F-s.Fset)<0.5},
   {t:'Ensure the specimen microswitch is engaged.',check:s=>s.sw},{t:'Check that all components are stable and securely tightened.'},
   {t:'Close the guard and ensure the guard microswitch is engaged.',check:s=>s.guard},{t:'Connect the display box to the host computer and start the HSM19D software.',check:s=>s.pc},
   {t:'Press START logging and choose a file name.',check:s=>s.log},{t:'Start the motor with the large green button.',check:s=>s.on||s.broke},
   {t:'Check the force and speed readings stay stable; leave the unit to run.',check:s=>s.N>1000},
   {t:'When the specimen fractures the unit switches off. Record the count, press STOP logging.',rec:true,check:(s,R)=>R.length>=1},
   {t:'Repeat with other loads (shared class results) to build the S–N curve.',rec:true,check:(s,R)=>R.length>=5}],
  table:[col('g','Grade','',0,(v,s)=>MAT[s.mat][0]),col('D','Test diameter D','mm',1,()=>D),col('rpm','Speed','rev/min',0,()=>RPM),col('L','Cantilever length L','mm',0,()=>L),col('F','Applied load F','N',1,(v,s)=>s.Fset),col('N','No. of test cycles','',0,(v,s)=>Math.round(s.N)),{k:'S',label:'Bending stress σ',unit:'N/mm²',dp:1},{k:'lS',label:'log σ',unit:'',dp:3},{k:'lN',label:'log N',unit:'',dp:3},col('res','Result','',0,(v,s)=>s.broke?'Failed':'Not failed')],
  calc:[r=>{const S=sig(r.F);return {S,lS:Math.log10(S),lN:Math.log10(Math.max(1,r.N))};}],
  guard:s=>s.on?'Wait for the specimen to fracture, or stop the test after about 10⁷ cycles.':!s.broke&&!(s.stopped&&s.N>=1e6)?'No result yet: run the test until fracture (or stop after about 10⁷ cycles).':null,
  summary:R=>{const F=R.filter(r=>r.res==='Failed');if(F.length<2)return null;const f=U.fit(F.map(r=>r.lN),F.map(r=>r.lS));return f?[['log σ = '+f.c.toFixed(3)+' '+(f.m<0?'−':'+')+' '+Math.abs(f.m).toFixed(4)+' log N','(best fit of failed specimens)'],['Not failed',R.length-F.length+' specimen(s)']]:null;},
  charts:[{title:'S–N curve',x:r=>r.N,xl:'Cycles to failure N',yl:'Stress amplitude S (N/mm²)',zeroY:false,series:[{name:'Results',y:r=>r.S,line:false}]},{title:'log S against log N',x:r=>r.lN,xl:'log N',yl:'log S',zeroY:false,series:[{name:'Results',y:r=>r.lS,line:false}]}]}],
 onExp(){},
 sync(s,s3){if(!s3)return;s3.W=Math.max(10,Math.min(80,Math.round(s.F/3)));s3.on=s.on;s3.broke=s.broke;s3.N=s.N;}
});})();


})();
