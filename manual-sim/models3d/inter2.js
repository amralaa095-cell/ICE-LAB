/* Interaction layer, part 2: the remaining rigs. Models are simplified teaching models, not calibrated to the manuals. */
(function(){const PI=Math.PI,by=id=>NEW3D.find(d=>d.id===id),clamp=(v,a,b)=>Math.min(b,Math.max(a,v)),f1=v=>v.toFixed(1),f2=v=>v.toFixed(2),f0=v=>v.toFixed(0);
function rig(id,o){const d=by(id);if(!d)return;d.live=true;d.hint=o.hint;d.hud=o.hud;d.params=o.params||[];d._knobs=o.knobs||[];d._btns=o.btns||[];d.onHit=function(s,hid){if(o.hit)o.hit(s,hid,this);};const b0=d.view3d.build;
 d.view3d.build=(K,s0,st)=>{const sc=b0(K,d.s,st),s=d.s,k=kit4(K);Object.assign(s,JSON.parse(JSON.stringify(o.init||{})));const g=sc.refs.g||sc.root;
  (o.knobs||[]).forEach(q=>{const mk=q.axis==='y'?k.Cy:k.Cz;const n=mk(0.026,0.024,k.M('#1d1f22',{r:.4}),q.p,20);n.pick='knob:'+q.id;n.tip=q.tip+' (drag)';g.add(n);g.add(mk(0.009,0.028,k.M('#e9ebe8'),q.p,10));K.label(q.tip,g,[q.p[0],q.p[1]+0.06,q.p[2]]);});
  (o.btns||[]).forEach(q=>{const mk=q.axis==='y'?k.Cy:k.Cz;const n=mk(0.022,0.02,k.M(q.c||'#2f9b55',{r:.4}),q.p,18);n.pick=q.id;n.tip=q.tip;g.add(n);K.label(q.tip,g,[q.p[0],q.p[1]+0.055,q.p[2]]);});
  const ex=o.setup?o.setup(K,s,sc.refs,g,k,d):null;sc.update=(s2,dt,t)=>{dt=Math.min(dt||0.016,0.05);o.step(s,dt,t,sc.refs,ex,K);};return sc;};}
const lag=(s,key,target,dt,rate)=>{s[key]+=(target-s[key])*Math.min(1,dt*(rate||2));};

/* ---- Losses in pipe systems ---- */
rig('pipes',{params:[{id:'flow',min:0,max:100,step:1}],init:{flow:40,q:0,dh:[0,0,0,0,0,0,0]},knobs:[{id:'flow',p:[-0.78,0.42,0.07],tip:'Flow control valve'}],
 hint:'Drag the flow control valve. Each pair of tubes is one test section: the gap between the two levels is the head lost there, and it grows with the square of the flow.',
 hud:s=>[['Flow',f2(s.q*0.35)+' L/s'],['Smooth pipe loss',f0(s.dh[0]*1000)+' mm'],['Rough pipe loss',f0(s.dh[3]*1000)+' mm'],['Bend loss',f0(s.dh[4]*1000)+' mm'],['Valve loss',f0(s.dh[6]*1000)+' mm'],['Supply pressure',f2(0.3+1.4*s.q*s.q)+' bar']],
 step(s,dt,t,r){lag(s,'q',s.flow/100,dt,3);const K=[0.16,0.2,0.26,0.42,0.22,0.3,0.36];K.forEach((k,i)=>{s.dh[i]=k*s.q*s.q;const up=0.62-0.05*s.q*s.q*(i/6),a=r.w[2*i],b=r.w[2*i+1];a.s=[1,up,1];a.p[1]=0.4+up/2;const dn=Math.max(0.03,up-s.dh[i]);b.s=[1,dn,1];b.p[1]=0.4+dn/2;});r.ga.r[2]=2.2-clamp((0.3+1.4*s.q*s.q)/2.5,0,1)*4.4;}});

/* ---- Centre of pressure ---- */
rig('cop',{params:[{id:'h',min:0,max:160,step:1}],init:{h:60,m:100,tilt:0,F:0,mb:0,ycp:0},knobs:[{id:'h',p:[0.3,0.12,0.2],tip:'Water depth',axis:'y'}],btns:[{id:'add',p:[-0.3,0.08,0.12],tip:'Add 50 g',c:'#c9a43a',axis:'y'},{id:'rem',p:[-0.2,0.08,0.12],tip:'Remove 50 g',c:'#8f959b',axis:'y'}],
 hint:'Set the water depth with the knob, then add or remove 50 g masses until the balance arm sits level. The mass needed tells you where the centre of pressure is.',
 hit(s,id){if(id==='add')s.m=Math.min(600,s.m+50);if(id==='rem')s.m=Math.max(0,s.m-50);},
 hud:s=>[['Water depth h',s.h+' mm'],['Hanger mass',s.m+' g'],['Hydrostatic force',f2(s.F)+' N'],['Mass to balance',f0(s.mb)+' g'],['Centre of pressure',s.ycp?f0(s.ycp)+' mm below surface':'—'],['Arm',Math.abs(s.m-s.mb)<25?'Level ✓':s.m>s.mb?'Hanger side down':'Tank side down']],
 step(s,dt,t,r){const h=s.h/1000,B=0.075,D=0.1,R2=0.2,L=0.275,rg=9810;let F,M,y;if(h<=D){F=rg*B*h*h/2;y=2*h/3;M=F*(R2-h/3);}else{const hc=h-D/2;F=rg*B*D*hc;y=hc+D*D/(12*hc);M=F*(R2-h+y);}s.F=F;s.ycp=h>0?y*1000:0;s.mb=M/(9.81*L)*1000;
  lag(s,'tilt',clamp((s.m-s.mb)/400,-0.16,0.16),dt,2.5);r.piv.r[2]=s.tilt;const wh=Math.min(0.19,h*1.0)+0.002;r.wat.s=[1,wh,1];r.wat.p[1]=0.265+wh/2;}});

/* ---- Hydrostatics bench: hydrometers ---- */
rig('hydro',{init:{sel:0},hint:'Click a hydrometer jar to read the liquid in it. A denser liquid pushes the hydrometer higher, so less of the stem is under the surface.',
 hit(s,id){if(id[0]==='j')s.sel=+id[1];},
 hud:s=>{const L=[['Water',1.0],['Cooking oil',0.92],['Glycerol',1.26]][s.sel];return [['Liquid',L[0]],['Relative density',f2(L[1])],['Density',f0(L[1]*1000)+' kg/m³'],['Stem under surface',f0(60/L[1])+' mm']];},
 setup(K,s,r,g,k){const hs=[];[-0.2,-0.1,0.0].forEach((x,i)=>{const rd=[1,0.92,1.26][i],q=K.group({p:[x,1.02+0.06*(rd-0.9),-0.2]});g.add(q);const a=k.Cy(0.004,0.22,k.M('#f4f4ee'),[0,0.1,0],8),b=k.Cy(0.012,0.07,k.M('#d7d9da',{a:.8}),[0,-0.04,0],12);[a,b].forEach(n=>{n.pick='j'+i;n.tip='Hydrometer '+(i+1);q.add(n);});hs.push(q);});return hs;},
 step(s,dt,t,r,hs){hs.forEach((q,i)=>{q.s=i===s.sel?[1.6,1,1.6]:[1,1,1];});}});

/* ---- Wind energy module ---- */
rig('windenergy',{params:[{id:'v',min:0,max:12,step:0.1},{id:'R',min:5,max:200,step:1}],init:{v:0,R:50,n:0,V:0,I:0,P:0},knobs:[{id:'v',p:[-0.36,0.105,0.38],tip:'Wind speed',axis:'y'},{id:'R',p:[-0.2,0.105,0.44],tip:'Load resistance',axis:'y'}],
 hint:'Raise the wind speed, then change the load resistance. Power is highest when the load matches the generator, not at the lowest or highest resistance.',
 hud:s=>[['Wind speed',f1(s.v)+' m/s'],['Rotor speed',f0(s.n)+' rev/min'],['Voltage',f2(s.V)+' V'],['Current',f0(s.I*1000)+' mA'],['Electrical power',f2(s.P)+' W'],['Load',s.R+' Ω']],
 step(s,dt,t,r,ex,K){const e=1.9*s.v,Ri=40;s.I=e/(Ri+s.R);s.V=s.I*s.R;s.P=s.V*s.I;lag(s,'n',s.v*190*(1-0.35*Ri/(Ri+s.R)),dt,1.5);if(s.v>0&&Math.random()<s.v*dt*4)K.emit({p:[0.1,0.9+0.2+(Math.random()-0.5)*0.12,-0.05+(Math.random()-0.5)*0.12],v:[0.15+s.v*0.06,0,0],life:0.9,size:0.006,c:'#4da3ff',a:.7});}});

/* ---- Torsion ---- */
rig('torsion',{params:[{id:'th',min:0,max:60,step:0.5}],init:{th:0,T:0,tau:0,ty:1},knobs:[{id:'th',p:[0.4,0.38,0.0],tip:'Handwheel: twist'}],
 hint:'Turn the handwheel to twist the specimen. Torque rises in a straight line until the surface yields, then flattens.',
 hud:s=>[['Angle of twist',f1(s.th)+'°'],['Torque',f2(s.T)+' N·m'],['Surface shear stress',f0(s.tau)+' MPa'],['Behaviour',s.th<s.ty?'Elastic':'Yielding'],['Shear modulus used','26 GPa (aluminium)']],
 setup(K,s,r,g,k){const q=K.group({p:[0.29,0.28,0]});q.add(k.B(0.004,0.075,0.006,k.M('#c0221b'),[0,0.037,0]));g.add(q);return q;},
 step(s,dt,t,r,q){const G=26e9,d=0.006,L=0.44,J=PI*Math.pow(d,4)/32,ty=180e6*L/(G*d/2)*180/PI;s.ty=ty;const th=s.th*PI/180,Te=G*J*th/L,Ty=G*J*(ty*PI/180)/L;s.T=s.th<ty?Te:Ty*(1+0.33*(1-Math.exp(-(s.th-ty)/12)));s.tau=s.T*(d/2)/J/1e6;q.r[0]=-th;}});

/* ---- Rotating fatigue ---- */
rig('fatigue',{params:[{id:'W',min:10,max:80,step:1}],init:{W:40,on:false,N:0,broke:false,S:0,Nf:1},knobs:[{id:'W',p:[-0.36,0.06,0.2],tip:'Load on hanger',axis:'y'}],btns:[{id:'go',p:[0.39,0.07,0.1],tip:'Start / stop motor'}],
 hint:'Set the load on the hanger, then start the motor. Every turn reverses the bending stress; the counter runs until the specimen breaks. Heavier load, far fewer cycles.',
 hit(s,id){if(id==='go'){if(s.broke){s.broke=false;s.N=0;}s.on=!s.on;}},
 hud:s=>[['Motor',s.on?'Running':'Stopped'],['Hanger load',s.W+' N'],['Stress amplitude',f0(s.S)+' MPa'],['Cycles',Math.round(s.N).toLocaleString('en-US')],['Predicted life',Math.round(s.Nf).toLocaleString('en-US')],['Specimen',s.broke?'Broken':'Intact']],
 step(s,dt){s.S=s.W*0.125*32/(PI*Math.pow(0.008,3))/1e6;s.Nf=Math.pow(900/s.S,8.2);if(s.on&&!s.broke){s.N+=dt*Math.max(50,s.Nf/12);if(s.N>=s.Nf){s.N=s.Nf;s.broke=true;s.on=false;toast('Specimen broke at '+Math.round(s.Nf).toLocaleString('en-US')+' cycles. Press start to fit a new one.');}}}});

/* ---- Forces in a truss ---- */
rig('truss',{params:[{id:'W',min:0,max:500,step:5}],init:{W:100,w:0},knobs:[{id:'W',p:[0,0.2,0.06],tip:'Screw jack load'}],
 hint:'Turn the screw jack to load the middle joint. Diagonals near the supports go into compression, the bottom chord into tension. Negative means compression.',
 hud:s=>[['Load W',f0(s.w)+' N'],['End diagonals',f0(-0.559*s.w)+' N'],['Inner diagonals',f0(0.559*s.w)+' N'],['Top chord',f0(-0.5*s.w)+' N'],['Bottom chord, ends',f0(0.25*s.w)+' N'],['Bottom chord, middle',f0(0.75*s.w)+' N']],
 step(s,dt){lag(s,'w',s.W,dt,4);}});

/* ---- Bending stress ---- */
rig('bending',{params:[{id:'W',min:0,max:500,step:5}],init:{W:100,w:0},knobs:[{id:'W',p:[0.12,1.02,0.06],tip:'Load'}],
 hint:'Increase the load. Between the two load points the bending moment is constant, so strain changes in a straight line down the section and is zero at the neutral axis.',
 hud:s=>{const M=s.w/2*0.25,I=3.0e-8,E=69e9,e=y=>M*y/(E*I)*1e6;return [['Load',f0(s.w)+' N'],['Bending moment',f2(M)+' N·m'],['Strain, top of web',f0(e(0.026))+' µε'],['Strain, mid web',f0(e(0.006))+' µε'],['Strain, flange',f0(e(-0.012))+' µε'],['Neutral axis','12 mm above the base']];},
 step(s,dt){lag(s,'w',s.W,dt,4);}});

/* ---- Buckling ---- */
rig('buckling',{params:[{id:'P',min:0,max:260,step:1}],init:{P:0,d:0},knobs:[{id:'P',p:[0.62,0.46,0.0],tip:'Handwheel: load'}],
 hint:'Wind the handwheel to load the strut. The sideways deflection stays small, then runs away as the load nears the Euler buckling load.',
 hud:s=>[['Axial load',s.P+' N'],['Euler buckling load','248 N (pinned ends)'],['Mid-span deflection',f1(s.d*1000)+' mm'],['Load / buckling load',f2(s.P/248)],['State',s.P<200?'Stable':s.P<248?'Close to buckling':'Buckled']],
 step(s,dt,t,r){const tgt=clamp(0.0012/Math.max(0.02,1-s.P/248),0,0.07);lag(s,'d',tgt,dt,3);r.strut.s=[1,1,s.d/0.05*1+0.02];}});

/* ---- Beam apparatus ---- */
rig('beams',{init:{n:2},btns:[{id:'add',p:[0.0,0.6,0.04],tip:'Add 10 N at mid-span',c:'#c9a43a'},{id:'rem',p:[0.14,0.6,0.04],tip:'Remove 10 N',c:'#8f959b'}],
 hint:'Add or remove 10 N at mid-span. Each support takes half the load, and the dial gauge shows the deflection, which doubles when the load doubles.',
 hit(s,id){if(id==='add')s.n=Math.min(10,s.n+1);if(id==='rem')s.n=Math.max(0,s.n-1);},
 hud:s=>{const W=s.n*10,d=W*1/(48*200e9*3.42e-10)*1000;return [['Load at mid-span',W+' N'],['Left reaction',f1(W/2)+' N'],['Right reaction',f1(W/2)+' N'],['Deflection',f2(d)+' mm'],['Span','1000 mm'],['Beam','Steel, 19 × 6 mm']];},
 step(s,dt,t,r){const d=s.n*10/(48*200e9*3.42e-10);r.beam.p[1]=0.324-Math.min(0.02,d*3);}});

/* ---- Pin-jointed frameworks ---- */
rig('frameworks',{params:[{id:'W',min:0,max:300,step:5}],init:{W:50,w:0},knobs:[{id:'W',p:[0.06,0.4,0.12],tip:'Load at the free joint'}],
 hint:'Increase the load on the free joint of the cantilever frame. The top members go into tension, the bottom members into compression.',
 hud:s=>[['Load',f0(s.w)+' N'],['Top member at wall',f0(2.36*s.w)+' N'],['Bottom member at wall',f0(-2.36*s.w)+' N'],['Outer diagonal',f0(1.55*s.w)+' N'],['Vertical',f0(-s.w)+' N'],['Free-joint deflection',f2(s.w*0.0042)+' mm']],
 step(s,dt){lag(s,'w',s.W,dt,4);}});

/* ---- Steam plant ---- */
rig('steam',{params:[{id:'Q',min:0,max:100,step:1}],init:{Q:0,on:false,p:0,n:0},knobs:[{id:'Q',p:[0.72,1.12,0.2],tip:'Heater power'}],btns:[{id:'go',p:[0.32,0.38,0.31],tip:'Isolator on / off',c:'#c0221b'}],
 hint:'Switch the isolator on, then raise the heater power. Pressure builds in the boiler first; the turbine only spins once there is steam to drive it.',
 hit(s,id){if(id==='go')s.on=!s.on;},
 hud:s=>[['Supply',s.on?'ON':'OFF'],['Heater power',f0(s.on?s.Q*30:0)+' W'],['Boiler pressure',f2(s.p)+' bar gauge'],['Steam temperature',f0(100+28*Math.sqrt(s.p))+' °C'],['Turbine speed',f0(s.n)+' rev/min'],['Generator output',f1(s.n*s.n/9e5)+' W']],
 step(s,dt,t,r,ex,K){lag(s,'p',s.on?s.Q/100*4:0,dt,0.25);lag(s,'n',Math.max(0,s.p-0.6)*1900,dt,0.8);if(s.p>0.4&&Math.random()<dt*s.p*8)K.emit({p:[-0.25,1.02,0.05],v:[(Math.random()-0.5)*0.05,0.18,(Math.random()-0.5)*0.05],life:1.2,size:0.02,grow:2,c:'#ffffff',a:.35});}});

/* ---- Refrigeration ---- */
rig('refrig',{params:[{id:'x',min:10,max:100,step:1}],init:{x:50,on:false,pe:5,pc:5},knobs:[{id:'x',p:[-0.02,0.08,0.26],tip:'Expansion valve'}],btns:[{id:'go',p:[0.3,0.3,0.26],tip:'Compressor on / off'}],
 hint:'Start the compressor, then open or close the expansion valve. The two pressures move apart as the cycle settles; closing the valve lowers the evaporating pressure and temperature.',
 hit(s,id){if(id==='go')s.on=!s.on;},
 hud:s=>{const te=-26+8.2*(s.pe-1),tc=-26+8.2*(s.pc-1)*0.92+14;return [['Compressor',s.on?'Running':'Off'],['Evaporating pressure',f2(s.pe)+' bar'],['Condensing pressure',f2(s.pc)+' bar'],['Evaporator temperature',f1(te)+' °C'],['Condenser temperature',f1(tc)+' °C'],['COP (cooling)',s.on&&s.pc-s.pe>0.5?f1(clamp((te+273)/(tc-te)*0.55,0.5,9)):'—']];},
 step(s,dt){lag(s,'pe',s.on?1.2+2.2*s.x/100:5,dt,0.5);lag(s,'pc',s.on?9.5-1.5*s.x/100:5,dt,0.5);}});

/* ---- Heat exchanger ---- */
rig('hx',{params:[{id:'mh',min:0.5,max:4,step:0.1},{id:'mc',min:0.5,max:4,step:0.1}],init:{mh:2,mc:2,cf:true},knobs:[{id:'mh',p:[0.2,0.3,0.34],tip:'Hot flow'},{id:'mc',p:[0.32,0.3,0.34],tip:'Cold flow'}],btns:[{id:'dir',p:[-0.2,0.2,0.34],tip:'Swap parallel / counter flow',c:'#1f5fb4'}],
 hint:'Change the hot and cold flows, and swap between parallel and counter flow. Counter flow gives the larger temperature change for the same flows.',
 hit(s,id){if(id==='dir')s.cf=!s.cf;},
 hud:s=>{const Ch=s.mh/60*4186,Cc=s.mc/60*4186,Cmin=Math.min(Ch,Cc),Cr=Cmin/Math.max(Ch,Cc),NTU=95/Cmin,e=s.cf?(Cr>0.999?NTU/(1+NTU):(1-Math.exp(-NTU*(1-Cr)))/(1-Cr*Math.exp(-NTU*(1-Cr)))):(1-Math.exp(-NTU*(1+Cr)))/(1+Cr),Q=e*Cmin*(60-20);return [['Arrangement',s.cf?'Counter flow':'Parallel flow'],['Hot in → out','60.0 → '+f1(60-Q/Ch)+' °C'],['Cold in → out','20.0 → '+f1(20+Q/Cc)+' °C'],['Heat transferred',f0(Q)+' W'],['Effectiveness',f0(e*100)+' %'],['Flows',f1(s.mh)+' / '+f1(s.mc)+' L/min']];},
 step(){}});

/* ---- Heat transfer: linear conduction ---- */
rig('heat',{params:[{id:'Q',min:0,max:60,step:1}],init:{Q:20,q:0},knobs:[{id:'Q',p:[0.2,0.2,0.04],tip:'Heater power'}],
 hint:'Raise the heater power and wait. The temperatures along the brass bar settle on a straight line: its slope gives the thermal conductivity.',
 hud:s=>{const g=s.q/(121*4.9e-4);return [['Heater power',f1(s.q)+' W'],['T1 (hot end)',f1(22+g*0.09+4)+' °C'],['T4 (middle)',f1(22+g*0.045+4)+' °C'],['T7 (cold end)',f1(26)+' °C'],['Gradient',f0(g)+' K/m'],['k of brass','121 W/m·K']];},
 setup(K,s,r,g,k){const m=k.M('#c9a43a',{m:1,r:.3});const n=k.Cx(0.016,0.062,m,[-0.085,0.09,0.3],14);g.add(n);return m;},
 step(s,dt,t,r,m){lag(s,'q',s.Q,dt,0.4);const a=clamp(s.q/60,0,1);m.e='#'+['00','33','66','99','cc'][Math.round(a*4)]+'1000';}});

/* ---- Sieve shaker ---- */
rig('sieve',{init:{on:false,t:0},btns:[{id:'go',p:[0,0.13,0.21],tip:'Start / stop'}],
 hint:'Start the shaker. The sample works its way down the stack; after about 10 minutes of shaking the masses on each sieve stop changing.',
 hit(s,id){if(id==='go'){if(s.t>=600)s.t=0;s.on=!s.on;}},
 hud:s=>{const k=1-Math.exp(-s.t/150),R=[4,11,24,31,18,9,3].map(x=>x*k);return [['Shaker',s.on?'Running':s.t>=600?'Finished':'Stopped'],['Shaking time',f0(s.t/60)+' min '+f0(s.t%60)+' s'],['Retained 4.75 mm',f1(R[0])+' %'],['Retained 1.18 mm',f1(R[2])+' %'],['Retained 300 µm',f1(R[4])+' %'],['Still on top sieve',f1(100-R.reduce((a,b)=>a+b,0)+R[0])+' %']];},
 step(s,dt,t,r){if(s.on){s.t+=dt*40;if(s.t>=600){s.t=600;s.on=false;toast('Sieving complete. Weigh each sieve to get the grading curve.');}}r.g.p[0]=s.on?0.003*Math.sin(t*60):0;}});

/* ---- Direct shear ---- */
rig('shear',{params:[{id:'N',min:50,max:400,step:10}],init:{N:100,on:false,x:0},knobs:[{id:'N',p:[0.05,0.6,0.0],tip:'Normal load',axis:'y'}],btns:[{id:'go',p:[-0.6,0.2,0.19],tip:'Start / reset shearing'}],
 hint:'Set the normal load on the hanger, then start shearing. Shear force climbs to a peak and falls back; repeat at other loads to find cohesion and friction angle.',
 hit(s,id){if(id==='go'){if(s.x>=8){s.x=0;s.on=false;}else s.on=!s.on;}},
 hud:s=>{const sig=s.N/0.0036/1000,tp=5+sig*Math.tan(32*PI/180),u=s.x/1.6,tau=tp*(u<1?Math.sin(u*PI/2):1-0.18*(1-Math.exp(-(u-1)*1.5)));s.tau=tau;return [['Normal load',s.N+' N'],['Normal stress',f1(sig)+' kPa'],['Horizontal displacement',f2(s.x)+' mm'],['Shear stress',f1(tau)+' kPa'],['Peak for this load',f1(tp)+' kPa'],['Model soil','c 5 kPa, φ 32°']];},
 step(s,dt){if(s.on){s.x+=dt*0.9;if(s.x>=8){s.x=8;s.on=false;}}}});

/* ---- Rotor dynamics ---- */
rig('rotor',{params:[{id:'n',min:0,max:3000,step:10}],init:{n:0,bal:false,a:0},knobs:[{id:'n',p:[-0.5,0.26,0.09],tip:'Shaft speed'}],btns:[{id:'bal',p:[0.16,0.36,0.0],tip:'Fit / remove balance mass',c:'#c9a43a',axis:'y'}],
 hint:'Raise the shaft speed through the critical speed (about 1,650 rev/min) and watch the vibration peak. Fit the balance mass and run through again.',
 hit(s,id){if(id==='bal')s.bal=!s.bal;},
 hud:s=>[['Shaft speed',s.n+' rev/min'],['Critical speed','1650 rev/min'],['Speed ratio',f2(s.n/1650)],['Vibration at the probe',f0(s.a)+' µm peak'],['Balance mass',s.bal?'Fitted':'Not fitted'],['Region',s.n<1500?'Below critical':s.n<1800?'At critical':'Above critical']],
 step(s,dt){const r=s.n/1650,z=0.05,e=s.bal?6:42;lag(s,'a',e*r*r/Math.sqrt(Math.pow(1-r*r,2)+Math.pow(2*z*r,2)),dt,2);}});
})();
