/* Interaction layer: makes the fluid, control and test rigs operable. */
(function(){const PI=Math.PI,by=id=>NEW3D.find(d=>d.id===id),clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const DROP=['furnace'];for(let i=NEW3D.length-1;i>=0;i--)if(DROP.includes(NEW3D[i].id))NEW3D.splice(i,1);
const SEC={vickers:'Material testing',h8:'Fluid mechanics',h314b:'Fluid mechanics',shear:'Material testing',sieve:'Material testing',utm:'Material testing',charpy:'Material testing',torsion:'Solid mechanics',fatigue:'Solid mechanics',truss:'Solid mechanics',bending:'Solid mechanics',buckling:'Solid mechanics',beams:'Solid mechanics',frameworks:'Solid mechanics',steam:'Thermodynamics',refrig:'Thermodynamics',hx:'Thermodynamics',heat:'Thermodynamics',wind:'Fluid mechanics',pumps:'Fluid mechanics',pipes:'Fluid mechanics',hydro:'Fluid mechanics',cop:'Fluid mechanics',manometer:'Fluid mechanics',plc:'Control and process',process:'Control and process',windenergy:'Control and process',rotor:'Vibration',vibration:'Vibration'};
NEW3D.forEach(d=>d.sec=SEC[d.id]||'Other');
function wrap(id,o,fn){const d=by(id);if(!d)return;Object.assign(d,o);d.live=true;const b0=d.view3d.build;d.view3d.build=(K,s,st)=>{const sc=b0(K,d.s,st);const u=fn(K,d.s,sc.refs,sc.root,d);if(u)sc.update=u;return sc;};}
const each=(n,f)=>{f(n);(n.kids||[]).forEach(k=>each(k,f));};
/* sockets and patch leads: click one socket, then another, to join them; click a joined pair again to pull the lead */
function wiring(K,parent,s,defs,top){const k=kit4(K),{M,Cy}=k;s.w=s.w||[];s.sel=null;const N={},leads=[];
  defs.forEach(q=>{const n=Cy(0.012,0.014,M(q.c,{r:.4}),[q.p[0],top+0.007,q.p[1]],16);n.pick='sk:'+q.id;n.tip=q.tip||q.id;parent.add(n);parent.add(Cy(0.006,0.016,M('#0c0d0e'),[q.p[0],top+0.008,q.p[1]],10));N[q.id]={n,q,m:n.mat};});
  const cols=['#c0221b','#1f5fb4','#e2b21c','#2f9b55','#7a46c0','#17181b'];
  const draw=()=>{leads.forEach(l=>l.vis=false);s.w.forEach(([a,b],i)=>{const A=N[a].q.p,B=N[b].q.p,h=0.07+0.02*(i%3);const t=K.node(K.tube([[A[0],top+0.012,A[1]],[A[0],top+h,A[1]],[(A[0]+B[0])/2,top+h+0.03,(A[1]+B[1])/2+0.03],[B[0],top+h,B[1]],[B[0],top+0.012,B[1]]],0.004,6,0.03),M(cols[i%6],{r:.5}),{});parent.add(t);leads.push(t);});};
  draw();return {has:(a,b)=>s.w.some(w=>(w[0]===a&&w[1]===b)||(w[0]===b&&w[1]===a)),
   hit(id){id=id.slice(3);if(!s.sel){s.sel=id;N[id].n.mat=M('#ffffff',{e:'#ffd23a',r:.3});return;}const a=s.sel;N[a].n.mat=N[a].m;s.sel=null;if(a===id)return;const i=s.w.findIndex(w=>(w[0]===a&&w[1]===id)||(w[0]===id&&w[1]===a));if(i>=0)s.w.splice(i,1);else{s.w=s.w.filter(w=>!w.includes(a)&&!w.includes(id));s.w.push([a,id]);}draw();},
   panel(w,d,labels,title){const t=K.tex(640,Math.round(640*d/w),(c,W,H)=>{c.fillStyle='#f2f2ee';c.fillRect(0,0,W,H);c.strokeStyle='#8f959b';c.lineWidth=2;c.strokeRect(4,4,W-8,H-8);c.fillStyle='#1b2433';c.font='bold 20px sans-serif';c.fillText(title,16,28);c.font='bold 15px sans-serif';c.textAlign='center';defs.forEach(q=>{const x=(q.p[0]/w+0.5)*W,y=(q.p[1]/d+0.5)*H;c.fillStyle='#3d4757';c.fillText(q.id,x,y+34);});(labels||[]).forEach(([tx,x,y])=>{c.fillStyle='#0039a6';c.textAlign='left';c.fillText(tx,x*W,y*H);});});
     parent.add(K.node(K.plane(w-0.02,d-0.02),M('#fff',{t,r:.5}),{p:[0,top+0.001,0],r:[-PI/2,0,0]}));}};}
const btn=(K,parent,p,col,pick,tip)=>{const k=kit4(K);const n=k.Cy(0.016,0.014,k.M(col,{r:.4}),p,18);n.pick=pick;n.tip=tip;parent.add(n);return n;};
const knob=(K,parent,p,pid,tip,axis)=>{const k=kit4(K);const n=(axis==='z'?k.Cz:k.Cy)(0.024,0.022,k.M('#1d1f22',{r:.4}),p,20);n.pick='knob:'+pid;n.tip=tip;parent.add(n);const m=(axis==='z'?k.Cz:k.Cy)(0.008,0.026,k.M('#e9ebe8'),p,10);parent.add(m);return n;};

/* ---------- PLC process trainer ---------- */
wrap('plc',{hint:'Join each PLC output to its device and each sensor to its input: click a socket, then the socket it goes to. Then press the green RUN button. Red is STOP.',
 hud:s=>[['PLC',s.run?'RUN':'STOP'],['Step',s.run?(s.fill?'Filling':'Draining'):'—'],['Tank level',Math.round(s.lv*100)+' %'],['Pump',s.pOn?'ON':'off'],['Drain valve',s.vOn?'OPEN':'closed'],['Leads fitted',s.w.length+' of 4']],
 onHit(s,id){if(id.startsWith('sk:'))this._w.hit(id);else if(id==='run'){s.run=true;s.fill=true;toast('PLC in RUN. The program fills to the high-level switch, then drains to the low-level switch.');}else if(id==='stop'){s.run=false;toast('PLC stopped. Outputs are off.');}}},
 (K,s,refs,R,d)=>{const k=kit4(K),{M,Cy}=k,pp=refs.pp;Object.assign(s,{run:false,fill:true,lv:0.3,pOn:false,vOn:false,warn:0});
  const defs=[{id:'Q0',p:[-0.18,-0.11],c:'#1f5fb4',tip:'PLC output Q0'},{id:'Q1',p:[-0.08,-0.11],c:'#1f5fb4',tip:'PLC output Q1'},{id:'I0',p:[0.08,-0.11],c:'#2f9b55',tip:'PLC input I0'},{id:'I1',p:[0.18,-0.11],c:'#2f9b55',tip:'PLC input I1'},
   {id:'PUMP',p:[-0.18,0.07],c:'#c0221b',tip:'Pump motor'},{id:'VALVE',p:[-0.08,0.07],c:'#c0221b',tip:'Drain solenoid valve'},{id:'LS LOW',p:[0.08,0.07],c:'#e2b21c',tip:'Low-level switch'},{id:'LS HIGH',p:[0.18,0.07],c:'#e2b21c',tip:'High-level switch'}];
  const W=wiring(K,pp,s,defs,0.03);d._w=W;W.panel(0.5,0.36,[['PLC OUTPUTS',0.06,0.16],['PLC INPUTS',0.58,0.16],['PROCESS DEVICES',0.06,0.6],['LEVEL SWITCHES',0.58,0.6]],'PLC CONNECTIONS');
  btn(K,pp,[-0.03,0.037,-0.03],'#2f9b55','run','RUN');btn(K,pp,[0.03,0.037,-0.03],'#c0221b','stop','STOP');
  const g=refs.g,wat=Cy(0.052,1,M('#3b82c4',{a:.5}),[0,0.3,0.04],24);g.add(wat);const lamp=k.Cz(0.012,0.01,M('#39d353',{e:'#39d353'}),[-0.3,0.78,0.04],12);g.add(lamp);
  return (s2,dt)=>{dt=Math.min(dt||0.016,0.05);const hi=s.lv>=0.9,lo=s.lv<=0.1;s.pOn=false;s.vOn=false;
   if(s.run){if(s.fill&&hi&&W.has('LS HIGH','I1'))s.fill=false;if(!s.fill&&lo&&W.has('LS LOW','I0'))s.fill=true;s.pOn=s.fill&&W.has('Q0','PUMP');s.vOn=!s.fill&&W.has('Q1','VALVE');
    if(s.fill&&s.lv>=1&&!W.has('LS HIGH','I1')){s.run=false;toast('Tank overflowed: the PLC never saw the high-level switch. Join LS HIGH to input I1.');}
    if(s.fill&&!s.pOn&&performance.now()-s.warn>6000){s.warn=performance.now();toast('Output Q0 is on but nothing is connected to the pump. Join Q0 to PUMP.');}
    if(!s.fill&&!s.vOn&&performance.now()-s.warn>6000){s.warn=performance.now();toast('Output Q1 is on but the drain valve is not connected. Join Q1 to VALVE.');}}
   s.lv=clamp(s.lv+((s.pOn?0.16:0)-(s.vOn?0.2:0))*dt,0,1);const h=0.19*s.lv+0.002;wat.s=[1,h,1];wat.p[1]=0.235+h/2;lamp.mat.e=s.run?'#39d353':'#1d3b22';lamp.mat.c=s.run?'#39d353':'#27402b';};});

/* ---------- Process trainer: level control loop ---------- */
wrap('process',{params:[{id:'sp',min:0,max:100,step:1}],hint:'Close the loop with two leads: CONTROLLER OUT to PUMP DRIVE, and LEVEL TX to PV IN. Drag the black knob to change the set point and watch the level follow.',
 hud:s=>[['Set point',s.sp+' %'],['Level (PV)',(s.lv*100).toFixed(1)+' %'],['Controller output',Math.round(s.u*100)+' %'],['Loop',s.closed?'Closed (PI)':s.open?'Open (manual)':'Not wired']],
 onHit(s,id){if(id.startsWith('sk:'))this._w.hit(id);}},
 (K,s,refs,R,d)=>{const k=kit4(K),{M,Cy}=k,pp=refs.pp;Object.assign(s,{sp:50,lv:0.2,u:0,I:0,closed:false,open:false});
  const defs=[{id:'CONTROLLER OUT',p:[-0.15,-0.08],c:'#1f5fb4'},{id:'PV IN',p:[0.15,-0.08],c:'#2f9b55'},{id:'PUMP DRIVE',p:[-0.15,0.07],c:'#c0221b'},{id:'LEVEL TX',p:[0.15,0.07],c:'#e2b21c'}];
  const W=wiring(K,pp,s,defs,0.03);d._w=W;W.panel(0.46,0.32,[['SET POINT',0.42,0.42]],'PROCESS CONTROL');knob(K,pp,[0,0.042,0.0],'sp','Set point (drag)');
  const g=refs.g,wat=Cy(0.08,1,M('#3b82c4',{a:.4}),[0.02,0.55,0.02],30);g.add(wat);const mark=k.B(0.19,0.004,0.004,M('#c0221b'),[0.02,0.6,0.11]);g.add(mark);
  return (s2,dt)=>{dt=Math.min(dt||0.016,0.05);s.open=W.has('CONTROLLER OUT','PUMP DRIVE');s.closed=s.open&&W.has('LEVEL TX','PV IN');
   if(s.closed){const e=s.sp/100-s.lv;s.I=clamp(s.I+e*dt*0.6,-1,1);s.u=clamp(2.2*e+s.I,0,1);}else if(s.open){s.u=s.sp/100;s.I=0;}else{s.u=0;s.I=0;}
   s.lv=clamp(s.lv+(0.22*s.u-0.14*Math.sqrt(Math.max(s.lv,0)))*dt,0,1);const h=0.32*s.lv+0.002;wat.s=[1,h,1];wat.p[1]=0.5+h/2;mark.p[1]=0.5+0.32*s.sp/100;};});

/* ---------- Series and parallel pumps ---------- */
wrap('pumps',{params:[{id:'thr',min:10,max:100,step:1}],hint:'Click a blue motor to start or stop that pump. Click the red valve handles: V1 pump 1 delivery, V2 pump 2 delivery, V3 pump 2 suction from the tank, V4 crossover (pump 1 into pump 2). Drag the black wheel to throttle the outlet.',
 hud:s=>[['Arrangement',s.mode],['Flow',s.Q.toFixed(2)+' L/s'],['Pump 1 delivery',s.P1.toFixed(2)+' bar'],['Pump 2 delivery',s.P2.toFixed(2)+' bar'],['Total head',s.H.toFixed(1)+' m'],['Outlet valve',s.thr+' % open']],
 onHit(s,id){if(id==='m0')s.on[0]=!s.on[0];else if(id==='m1')s.on[1]=!s.on[1];else if(id[0]==='v'){const i=+id[1];s.v[i]=!s.v[i];}}},
 (K,s,refs)=>{const k=kit4(K);Object.assign(s,{on:[false,false],v:[true,false,false,false],thr:60,Q:0,P1:0,P2:0,H:0,mode:'Stopped',q:0});
  refs.m.forEach((n,i)=>{n.pick='m'+i;n.tip=()=>'Pump '+(i+1)+': '+(s.on[i]?'running (click to stop)':'stopped (click to start)');});
  const order=[2,3,0,1];/* handle order on the rig -> V1..V4 */const names=['V1 pump 1 delivery','V2 pump 2 delivery','V3 pump 2 suction','V4 crossover'];
  [2,3,1,0].forEach((ri,vi)=>{const n=refs.v[ri];n.pick='v'+vi;n.tip=()=>names[vi]+': '+(s.v[vi]?'open':'closed');K.label('V'+(vi+1),n,[0,0.03,0],{});});
  knob(K,refs.g,[0.5,0.3,0.14],'thr','Outlet valve (drag)','z');K.label('Outlet valve',refs.g,[0.56,0.36,0.14]);
  return (s2,dt,t)=>{dt=Math.min(dt||0.016,0.05);const H0=11,kq=6,[a,b]=s.on,[V1,V2,V3,V4]=s.v;let Hs=0,kk=1,mode='No flow path';
   if(a&&b&&V4&&V2&&!V1&&!V3){Hs=2*H0;kk=2*kq;mode='Series';}else if(a&&b&&V1&&V2&&V3&&!V4){Hs=H0;kk=kq/4;mode='Parallel';}else if(a&&V1&&!V4){Hs=H0;kk=kq;mode='Pump 1 alone';}else if(b&&V2&&V3&&!V4){Hs=H0;kk=kq;mode='Pump 2 alone';}else if(!a&&!b)mode='Stopped';
   const c=18/Math.pow(s.thr/100,2),Qt=Hs?Math.sqrt(Hs/(kk+c)):0;s.q+=(Qt-s.q)*Math.min(1,dt*3);s.Q=s.q;s.H=s.q>0.01?Hs-kk*s.q*s.q:0;s.mode=mode;
   const h1=a?(mode==='Parallel'?H0-kq*s.q*s.q/4:H0-kq*s.q*s.q):0,h2=b?(mode==='Series'?s.H:mode==='Parallel'?h1:mode==='Pump 2 alone'?s.H:H0):0;s.P1=Math.max(0,h1)*0.0981;s.P2=Math.max(0,h2)*0.0981;
   const ang=p=>2.2-clamp(p/2.5,0,1)*4.4;refs.ga[0].r[2]=ang(0.2+s.q*0.05);refs.ga[1].r[2]=ang(s.P1);refs.ga[2].r[2]=ang(s.P2);
   refs.m.forEach((n,i)=>{n.mat.e=s.on[i]?'#0a2a66':null;n.p[1]=0.25+(s.on[i]?0.0012*Math.sin(t*90+i):0);});refs.v.forEach((n,ri)=>{const vi=[3,2,0,1][ri];n.r[1]=s.v[vi]?0:PI/2;n.mat.c=s.v[vi]?'#c0221b':'#6d1512';});};});

/* ---------- Pendulum impact tester ---------- */
wrap('charpy',{hint:'Click the pendulum to raise and latch it, then click it again to release. The pointer stays at the energy the specimen absorbed.',
 hud:s=>[['Pendulum',{down:'At rest',up:'Latched at 125°',swing:'Swinging',done:'Test done'}[s.st]],['Release angle','125°'],['Rise after impact',s.rise?s.rise.toFixed(1)+'°':'—'],['Energy absorbed',s.E?s.E.toFixed(0)+' J':'—'],['Capacity','300 J']],
 onHit(s,id){if(id!=='pend')return;if(s.st==='down'||s.st==='done'){s.st='lift';s.E=0;s.rise=0;}else if(s.st==='up'){s.st='swing';s.w=0;s.hit=false;s.max=0;}}},
 (K,s,refs)=>{Object.assign(s,{st:'down',th:0,w:0,E:0,rise:0,hit:false,max:0});const pen=refs.pen;each(pen,n=>{if(n.geo){n.pick='pend';n.tip=()=>s.st==='up'?'Release the pendulum':'Raise and latch the pendulum';}});
  const TH=125*PI/180,Emax=300,eOf=th=>Emax*(1-Math.cos(th))/(1-Math.cos(TH)),W2=13;
  return (s2,dt)=>{dt=Math.min(dt||0.016,0.03);
   if(s.st==='lift'){s.th=Math.min(TH,s.th+dt*1.6);refs.spec.vis=true;refs.spec.p=[0,0.345,0.08];refs.spec.r=[0,0,0];if(s.th>=TH)s.st='up';}
   else if(s.st==='swing'){for(let i=0;i<4;i++){const h=dt/4;s.w+=-W2*Math.sin(s.th)*h;const th1=s.th+s.w*h;
      if(!s.hit&&s.th>0&&th1<=0){s.hit=true;const KE=eOf(TH),Ea=95+Math.random()*60;s.Eabs=Ea;s.w*=Math.sqrt(Math.max(0.05,1-Ea/KE));s.sv=[-1.6,1.2];}
      s.th=th1;}if(s.hit){s.max=Math.max(s.max,-s.th);if(s.w>0&&!s.E){s.rise=s.max*180/PI;s.E=Emax-eOf(s.max);}s.w*=(1-0.5*dt);if(refs.spec.vis&&s.sv){refs.spec.p[0]+=s.sv[0]*dt;refs.spec.p[1]+=s.sv[1]*dt;s.sv[1]-=6*dt;refs.spec.r[2]+=9*dt;if(refs.spec.p[1]<0.18)refs.spec.vis=false;}
      if(s.E&&Math.abs(s.th)<0.02&&Math.abs(s.w)<0.08){s.th=0;s.w=0;s.st='done';}}}
   pen.r[2]=s.th;refs.ptr.r[2]=-(PI*0.75+(s.E||0)/300*PI*1.5)-PI/2;};});

/* ---------- Universal testing machine ---------- */
wrap('utm',{hint:'Click the handset to start the tensile test. The crosshead rises, the specimen stretches, necks and breaks. Click the handset again to return and fit a new specimen.',
 hud:s=>[['Test',{idle:'Ready',run:'Running',broke:'Specimen broken'}[s.st]],['Extension',(s.e*1000).toFixed(2)+' mm'],['Load',s.F.toFixed(2)+' kN'],['Stress',s.sig.toFixed(0)+' MPa'],['Peak load',s.Fm.toFixed(2)+' kN']],
 onHit(s,id){if(id!=='hs')return;if(s.st==='idle')s.st='run';else if(s.st==='broke'){s.st='idle';s.e=0;s.F=0;s.sig=0;s.Fm=0;}}},
 (K,s,refs)=>{const k=kit4(K),{M,B}=k;Object.assign(s,{st:'idle',e:0,F:0,sig:0,Fm:0});each(refs.hs,n=>{if(n.geo){n.pick='hs';n.tip=()=>s.st==='idle'?'Start test':s.st==='broke'?'Return crosshead, new specimen':'Test running';}});
  const sm=M('#c9cdd2',{m:1,r:.25}),hA=B(0.02,1,0.004,sm,[0,0,0]),hB=B(0.02,1,0.004,sm,[0,0,0]);hA.vis=hB.vis=false;refs.g.add(hA);refs.g.add(hB);
  const L0=0.1,sigOf=e=>{const E=70000,sy=275,eu=0.11,su=320,ef=0.15;if(e<sy/E)return E*e;if(e<eu)return sy+(su-sy)*Math.sqrt((e-sy/E)/(eu-sy/E));return su-(su-250)*Math.pow((e-eu)/(ef-eu),2);};
  return (s2,dt)=>{dt=Math.min(dt||0.016,0.05);if(s.st==='run'){s.e+=dt*0.0022;const st=s.e/L0;s.sig=sigOf(st);s.F=s.sig*80/1000;s.Fm=Math.max(s.Fm,s.F);if(st>=0.15){s.st='broke';s.F=0;s.sig=0;toast('Specimen broke after necking. Peak load '+s.Fm.toFixed(2)+' kN.');}}
   const vis=s.e*6;refs.xh.p[1]=1.2+vis;const brk=s.st==='broke';refs.spec.vis=!brk;refs.spec.s=[1-Math.min(0.5,vis*1.2),1+vis/0.36,1];refs.spec.p[1]=0.7+vis/2;hA.vis=hB.vis=brk;if(brk){const L=0.17;hA.s=[0.6,L,1];hB.s=[0.6,L,1];hA.p=[0,0.52+L/2,0];hB.p=[0,0.88+vis-L/2,0];}};});

/* ---------- Free and forced vibration ---------- */
wrap('vibration',{params:[{id:'rpm',min:0,max:900,step:5}],hint:'Drag the black speed knob on the control box. The beam amplitude peaks when the exciter speed matches the natural frequency (about 7 Hz, 420 rev/min).',
 hud:s=>[['Exciter speed',s.rpm+' rev/min'],['Forcing frequency',(s.rpm/60).toFixed(2)+' Hz'],['Natural frequency','7.00 Hz'],['Frequency ratio',(s.rpm/420).toFixed(2)],['Amplitude at beam end',(s.A*1000).toFixed(1)+' mm']]},
 (K,s,refs)=>{Object.assign(s,{rpm:0,A:0,ph:0});knob(K,refs.g,[-0.52,0.33,0.09],'rpm','Exciter speed (drag)','z');K.label('Speed knob',refs.g,[-0.52,0.4,0.1]);
  return (s2,dt)=>{dt=Math.min(dt||0.016,0.05);const r=s.rpm/420,z=0.06;const At=0.0016*r*r/Math.sqrt(Math.pow(1-r*r,2)+Math.pow(2*z*r,2));s.A+=(At-s.A)*Math.min(1,dt*2);s.ph+=dt*s.rpm/60*2*PI;refs.bm.r[2]=Math.atan(s.A/0.78*3)*Math.sin(s.ph);};});

/* ---------- Wind tunnel ---------- */
wrap('wind',{params:[{id:'spd',min:0,max:100,step:1},{id:'aoa',min:-4,max:20,step:0.5}],hint:'Drag the left knob for fan speed and the right knob for the aerofoil angle. Lift rises with angle until the aerofoil stalls near 14°.',
 hud:s=>[['Fan speed',s.spd+' %'],['Air speed',s.V.toFixed(1)+' m/s'],['Angle of attack',s.aoa.toFixed(1)+'°'],['Lift',s.L.toFixed(2)+' N'],['Drag',s.D.toFixed(2)+' N'],['State',s.aoa>14?'Stalled':'Attached flow']]},
 (K,s,refs)=>{Object.assign(s,{spd:0,aoa:8,V:0,L:0,D:0,acc:0});const g=refs.g;knob(K,g,[-0.54,0.13,0.17],'spd','Fan speed (drag)','z');knob(K,g,[-0.38,0.13,0.17],'aoa','Aerofoil angle (drag)','z');K.pcap(160);
  return (s2,dt)=>{dt=Math.min(dt||0.016,0.05);s.V=0.36*s.spd;const q=0.5*1.2*s.V*s.V,S=0.0144,a=s.aoa,CL=a<=14?0.1*(a+2):Math.max(0.5,1.6-0.12*(a-14)),CD=0.02+0.0006*a*a+(a>14?0.12:0);s.L=q*S*CL;s.D=q*S*CD;refs.af.r[0]=a*PI/180;
   s.acc+=dt*s.V*1.2;while(s.acc>1&&s.V>0){s.acc-=1;const y=refs.AX+(Math.random()-0.5)*0.14,z=(Math.random()-0.5)*0.12,v=0.25+s.V/36*0.9;K.emit({p:[-0.68+0.0,0.9+y,z],v:[v,(a>14?(Math.random()-0.5)*0.25:-a*0.004)*v,0],life:0.44/v,size:0.006,c:a>14?'#e08a1c':'#4da3ff',a:.8});}};});

/* ---------- Multi-tube manometer ---------- */
wrap('manometer',{params:[{id:'flow',min:0,max:100,step:1}],hint:'Drag the black wheel to change the air flow. Each tube shows the static pressure at its tapping: the level drops most where the section is narrowest.',
 hud:s=>[['Air flow',s.flow+' %'],['Highest tube',(s.hi*1000).toFixed(0)+' mm'],['Lowest tube',(s.lo*1000).toFixed(0)+' mm'],['Largest difference',((s.hi-s.lo)*1000).toFixed(0)+' mm']]},
 (K,s,refs)=>{Object.assign(s,{flow:40,hi:0,lo:0});knob(K,refs.g,[0.26,0.08,0.06],'flow','Air flow (drag)','z');K.label('Flow valve',refs.g,[0.34,0.12,0.06]);const cur=refs.w.map(()=>0.7);
  return (s2,dt)=>{dt=Math.min(dt||0.016,0.05);const f=Math.pow(s.flow/100,2);let hi=0,lo=9;refs.w.forEach((n,i)=>{const x=i/13,shape=Math.exp(-Math.pow((x-0.42)/0.16,2))+0.25*x;const t=0.72-0.5*f*shape;cur[i]+=(t-cur[i])*Math.min(1,dt*4);n.s=[1,cur[i],1];n.p[1]=0.13+cur[i]/2;hi=Math.max(hi,cur[i]);lo=Math.min(lo,cur[i]);});s.hi=hi;s.lo=lo;};});
})();
