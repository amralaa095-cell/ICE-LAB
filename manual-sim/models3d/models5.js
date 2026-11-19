(function(){const PI=Math.PI;const D=(o)=>NEW3D.push(Object.assign({s:{}},o));
const X=(K)=>{const k=kit4(K),{M,B,Cy,Cz,Cx,RB}=k;k.alu=M('#c9cdd2',{m:.9,r:.35});k.brass=M('#c9a43a',{m:1,r:.3});k.clear=M('#dcebf2',{a:.22,r:.04});k.pvc=M('#4a4f58',{r:.5});
  k.hose=(R,P,r,m)=>R.add(K.node(K.tube(P,r||0.008,8,0.06),m,{}));
  k.gauge=(g,p,r)=>{g.add(Cz(r,0.03,M('#2a2c2f',{m:.5}),p,30));g.add(Cz(r*0.9,0.032,M('#f6f6f2',{r:.4}),p,30));const q=K.group({p:[p[0],p[1],p[2]+0.018],r:[0,0,2.2]});q.add(B(0.004,r*0.7,0.002,M('#17181b'),[0,r*0.3,0]));g.add(q);return q;};
  k.valve=(g,p,m)=>{g.add(B(0.04,0.04,0.04,k.pvc,p));const h=B(0.07,0.012,0.02,m||M('#c0221b'),[p[0],p[1]+0.035,p[2]]);g.add(h);return h;};
  k.patch=(g,p,w,d,ry,bare)=>{const t=K.tex(256,160,(c,W,H)=>{c.fillStyle='#f2f2ee';c.fillRect(0,0,W,H);c.strokeStyle='#8f959b';c.strokeRect(3,3,W-6,H-6);for(let y=0;y<5;y++)for(let x=0;x<9;x++){c.fillStyle=(x+y)%3?'#c0221b':'#1d1f22';c.beginPath();c.arc(22+x*26,22+y*29,5,0,7);c.fill();}});const q=K.group({p,r:[0,ry||0,0]});g.add(q);q.add(RB(w,0.03,d,0.008,M('#eeeeea',{r:.5}),[0,0.015,0]));if(!bare)q.add(K.node(K.plane(w-0.02,d-0.02),M('#fff',{t,r:.5}),{p:[0,0.031,0],r:[-PI/2,0,0]}));
    for(let i=0;i<(bare?0:5);i++){const a=[-w*0.3+i*w*0.14,0.035,-d*0.2+((i*7)%5)*d*0.08],b=[-w*0.1+((i*3)%5)*w*0.1,0.035,d*0.25];q.add(K.node(K.tube([a,[a[0],0.09,a[2]],[(a[0]+b[0])/2,0.07,(a[2]+b[2])/2+0.05],[b[0],0.09,b[2]],b],0.004,6,0.03),M('#c0221b'),{}));}return q;};
  return k;};

/* ---- 21. Heat transfer base unit ---- */
D({id:'heat',name:'Heat Transfer Base Unit',photo:21,view3d:{h:560,cam:{tgt:[0,1.2,0.1],yaw:0.4,pitch:0.18,dist:2.5},shadow:{c:[0,1.1,0],r:1.8},build(K,s){const refs={};const k=X(K),{M,B,Cy,Cz,Cx,RB,floor,bench,blk,steel,white,brass}=k,R=K.group();floor(R);bench(R,2.4,1.1,0.9,0,0);k.pod(R,1.9,0,-0.38);
  const g=K.group({p:[0,0.9,0]});R.add(g);refs.g=g;const fr=M('#3a3d42',{m:.4,r:.5});
  g.add(RB(0.5,0.56,0.3,0.01,fr,[-0.12,0.3,-0.12]));const pn=K.tex(512,512,(c,w,h)=>{c.fillStyle='#ecedea';c.fillRect(0,0,w,h);c.fillStyle='#4a4f55';c.fillRect(16,14,26,22);c.font='bold 15px sans-serif';c.fillText('HEAT TRANSFER EXPERIMENTS BASE UNIT',52,32);[[60,80],[330,80]].forEach(([x,y])=>{c.fillStyle='#1b1d20';c.fillRect(x,y,130,36);c.fillStyle='#39d353';c.font='bold 24px monospace';c.fillText(x<200?'42.6':'12.5',x+18,y+27);});c.strokeStyle='#8f959b';c.strokeRect(40,170,110,150);c.fillStyle='#1b1d20';[[95,215],[95,275]].forEach(([x,y])=>{c.beginPath();c.arc(x,y,18,0,7);c.fill();});c.fillStyle='#2f9b55';for(let i=0;i<7;i++)c.fillRect(200+i*40,292,22,14);});
  g.add(K.node(K.plane(0.5,0.56),M('#fff',{t:pn,r:.5}),{p:[-0.12,0.3,0.031]}));
  g.add(RB(0.22,0.56,0.3,0.01,M('#26282b',{r:.5}),[0.26,0.3,-0.12]));[[0.5,'#39d353'],[0.42,'#e23b2e']].forEach(([y,c])=>{g.add(B(0.1,0.035,0.004,M('#0e0f11'),[0.26,y,0.032]));g.add(B(0.06,0.014,0.002,M(c,{e:c}),[0.26,y,0.035]));});g.add(B(0.02,0.2,0.004,M('#2a66c8'),[0.26,0.24,0.032]));g.add(Cz(0.015,0.02,blk,[0.3,0.12,0.035],12));
  /* linear conduction experiment on its plate */const e=K.group({p:[0.02,0,0.3]});g.add(e);e.add(RB(0.42,0.02,0.26,0.008,white,[-0.1,0.01,0]));e.add(RB(0.28,0.02,0.26,0.008,M('#3a3d42'),[0.26,0.01,0]));
  [-0.22,0.0].forEach(x=>e.add(B(0.02,0.1,0.06,blk,[x,0.07,0])));e.add(Cx(0.035,0.09,white,[-0.16,0.09,0],22));e.add(Cx(0.035,0.09,white,[-0.05,0.09,0],22));e.add(Cx(0.014,0.06,brass,[-0.105,0.09,0],14));e.add(Cx(0.03,0.04,M('#c0221b'),[0.25,0.07,0],18));e.add(RB(0.14,0.03,0.1,0.008,M('#2a66c8'),[0.24,0.035,0.02]));
  for(let i=0;i<7;i++)k.hose(g,[[-0.21+i*0.052,0.24,0.035],[-0.21+i*0.052,0.2,0.14],[-0.2+i*0.03,0.16,0.3],[-0.18+i*0.025,0.1,0.3]],0.0025,M('#2f9b55'));
  k.hose(g,[[0.3,0.1,0.04],[0.36,0.05,0.2],[0.3,0.08,0.3]],0.008,M('#c0221b'));k.hose(g,[[0.34,0.08,0.3],[0.5,0.03,0.25],[0.55,0.03,0.0],[0.4,0.03,-0.2]],0.008,k.clear);k.hose(g,[[-0.4,0.3,-0.1],[-0.6,0.02,0.1],[-0.5,0.02,0.3],[-0.3,0.02,0.4]],0.006,blk);
  K.label('Control module',g,[-0.12,0.64,0.03]);K.label('Heater power module',g,[0.3,0.64,0.03]);K.label('Linear conduction experiment',e,[-0.1,0.18,0]);K.label('Thermocouple leads',g,[-0.3,0.22,0.2]);return {root:R,refs,update(){}};}}});

/* ---- 23. PLC process trainer ---- */
D({id:'plc',name:'PLC Process Trainer',photo:23,view3d:{h:560,cam:{tgt:[0.1,1.25,0],yaw:0.4,pitch:0.16,dist:2.6},shadow:{c:[0,1.1,0],r:1.8},build(K,s){const refs={};const k=X(K),{M,B,Cy,Cz,Cx,RB,floor,bench,blk,steel,white,clear}=k,R=K.group();floor(R);bench(R,2.4,1.1,0.9,0,0);
  const g=K.group({p:[0,0.9,0]});R.add(g);refs.g=g;[-0.22,0.4].forEach((x,i)=>{g.add(RB(0.56,0.07,0.42,0.02,M('#1d1f22',{r:.4}),[x,0.035,0.05]));for(let j=0;j<4;j++)g.add(B(0.1,0.01,0.03,M('#2a2c2f'),[x-0.2+j*0.13,0.03,0.262]));});
  g.add(B(0.6,0.7,0.02,M('#2a2c2f',{r:.5}),[0.42,0.45,-0.2]));
  const pn=K.tex(256,640,(c,w,h)=>{c.fillStyle='#f0f0ec';c.fillRect(0,0,w,h);c.strokeStyle='#2f86d1';c.lineWidth=9;c.strokeRect(46,40,150,520);c.beginPath();c.moveTo(121,40);c.lineTo(121,330);c.stroke();c.fillStyle='#c0221b';c.font='bold 30px sans-serif';c.fillText('TQ',150,310);c.save();c.translate(30,560);c.rotate(-PI/2);c.fillStyle='#1d1f22';c.font='bold 26px sans-serif';c.fillText('PLC  Process',0,0);c.restore();c.fillStyle='#1d1f22';[[196,120],[196,260],[196,420],[46,470]].forEach(([x,y])=>c.fillRect(x-12,y-9,24,18));});
  g.add(RB(0.28,0.74,0.03,0.008,white,[-0.2,0.45,0.02]));g.add(K.node(K.plane(0.28,0.74),M('#fff',{t:pn,r:.5}),{p:[-0.2,0.45,0.036]}));
  [[0.6,0.14],[0.33,0.2]].forEach(([y,h],i)=>{g.add(Cy(0.055,h,clear,[0.0,y,0.04],26));if(i===0)g.add(Cy(0.052,h*0.5,M('#3b82c4',{a:.45}),[0.0,y-h*0.25,0.04],24));g.add(Cy(0.058,0.012,M('#c9a43a',{m:1}),[0.0,y+h/2,0.04],26));g.add(Cy(0.058,0.012,blk,[0.0,y-h/2,0.04],26));});g.add(Cy(0.006,0.6,steel,[0.07,0.45,0.04],8));
  [0.72,0.5].forEach(y=>g.add(RB(0.05,0.04,0.05,0.006,M('#2f9b55'),[-0.02,y+0.02,0.09])));
  refs.pp=k.patch(g,[0.42,0.07,0.08],0.5,0.36,0,true);refs.g=g;
  K.label('Process panel',g,[-0.2,0.88,0.04]);K.label('Tanks with level sensors',g,[0.12,0.7,0.1]);K.label('PLC connection panel',g,[0.42,0.2,0.2]);return {root:R,refs,update(){}};}}});

/* ---- 24. Wind energy module ---- */
D({id:'windenergy',name:'Wind Energy Module',photo:24,view3d:{h:560,cam:{tgt:[0,1.05,0.15],yaw:0.5,pitch:0.32,dist:2.0},shadow:{c:[0,1,0],r:1.5},build(K,s){const refs={};const k=X(K),{M,B,Cy,Cz,Cx,RB,floor,bench,blk,steel,white}=k,R=K.group();floor(R);bench(R,2.0,1.1,0.9,0,0);
  const g=K.group({p:[0,0.9,0]});R.add(g);refs.g=g;g.add(RB(0.7,0.08,0.36,0.012,white,[0,0.04,-0.05]));g.add(B(0.1,0.004,0.02,M('#e08a1c'),[-0.2,0.082,-0.02]));g.add(B(0.3,0.03,0.004,M('#4a4f55'),[-0.1,0.045,0.131]));
  /* fan duct, turbine and generator */g.add(Cx(0.1,0.16,blk,[0.27,0.2,-0.05],30));g.add(Cx(0.09,0.02,M('#0c0d0e'),[0.18,0.2,-0.05],30));for(let i=0;i<5;i++)g.add(B(0.004,0.17,0.03,M('#3a3d42',{m:.5}),[0.185,0.2,-0.05],{r:[i/5*PI,0,0]}));g.add(RB(0.16,0.2,0.18,0.02,blk,[0.3,0.18,-0.05]));g.add(Cx(0.07,0.1,M('#26282b',{m:.4}),[0.42,0.2,-0.05],24));g.add(B(0.06,0.1,0.14,blk,[0.3,0.33,-0.05]));
  k.estopZ(g,[0.12,0.04,0.132]);g.add(B(0.05,0.03,0.004,M('#c0221b',{e:'#3a0a08'}),[0.26,0.045,0.131]));
  /* sloped control panel */const pn=K.tex(512,320,(c,w,h)=>{c.fillStyle='#f0f0ec';c.fillRect(0,0,w,h);c.strokeStyle='#8f959b';c.lineWidth=2;c.strokeRect(6,6,w-12,h-12);c.fillStyle='#4a4f55';c.font='bold 16px sans-serif';c.fillText('WIND ENERGY MODULE',150,34);[[70,60],[290,60]].forEach(([x,y])=>{c.fillStyle='#1b1d20';c.fillRect(x,y,120,50);c.fillStyle='#4da3ff';c.font='bold 26px monospace';c.fillText(x<200?'12.4':'0.82',x+20,y+35);});c.strokeRect(40,150,130,130);c.strokeRect(190,150,130,130);c.strokeRect(340,150,130,130);c.fillStyle='#1b1d20';c.beginPath();c.arc(105,215,32,0,7);c.fill();c.fillStyle='#e9e44a';c.beginPath();c.arc(255,215,22,0,7);c.fill();[[370,190],[410,190],[450,190],[370,240],[410,240],[450,240]].forEach(([x,y],i)=>{c.fillStyle=i%2?'#c0221b':'#1d1f22';c.beginPath();c.arc(x,y,7,0,7);c.fill();});});
  g.add(K.node(K.prismX([[0.2,0],[-0.2,0],[-0.2,0.1],[0.2,0.03]],-0.28,0.28),white,{p:[-0.2,0,0.36]}));g.add(K.node(K.plane(0.54,0.39),M('#fff',{t:pn,r:.5}),{p:[-0.2,0.068,0.36],r:[-PI/2+0.173,0,0]}));g.add(Cy(0.03,0.03,blk,[-0.36,0.1,0.38],18));
  k.hose(g,[[-0.1,0.06,0.2],[0.0,0.03,0.16],[0.05,0.07,0.1]],0.005,blk);
  K.label('Fan + wind turbine',g,[0.22,0.36,-0.05]);K.label('Generator',g,[0.44,0.32,-0.05]);K.label('Measurement panel',g,[-0.2,0.2,0.36]);return {root:R,refs,update(){}};}}});

/* ---- 25. Process trainer ---- */
D({id:'process',name:'Process Trainer',photo:25,view3d:{h:560,cam:{tgt:[0,1.3,0.1],yaw:0.35,pitch:0.16,dist:2.9},shadow:{c:[0,1.2,0],r:1.9},build(K,s){const refs={};const k=X(K),{M,B,Cy,Cz,Cx,RB,floor,bench,blk,steel,white,clear,brass}=k,R=K.group();floor(R);bench(R,2.4,1.1,0.9,0,0);k.pod(R,1.9,0,-0.42);
  const g=K.group({p:[0,0.9,0]});R.add(g);refs.g=g;[-0.5,0.5].forEach(x=>{g.add(B(0.03,0.03,0.36,M('#8f959b',{m:.8}),[x,0.015,0]));[-1,1].forEach(s=>g.add(Cy(0.02,0.012,blk,[x,0.006,s*0.17],10)));g.add(B(0.03,0.2,0.03,M('#8f959b',{m:.8}),[x,0.1,-0.1]));});
  g.add(RB(1.16,0.78,0.03,0.01,white,[0,0.5,-0.1]));g.add(B(0.07,0.07,0.003,M('#4a4f55'),[-0.5,0.82,-0.083]));[['#c0221b',0],['#1f5fb4',0.02],['#2f9b55',0.04]].forEach(([c,o])=>g.add(B(0.05,0.008,0.003,M(c),[-0.15,0.8-o,-0.083])));
  /* heater tank (red), process vessel, radiator, reservoir */g.add(RB(0.22,0.3,0.14,0.012,M('#c41f24',{r:.45}),[-0.42,0.6,-0.01]));g.add(B(0.2,0.02,0.12,M('#9a1519'),[-0.42,0.76,-0.01]));g.add(B(0.06,0.05,0.003,M('#e2b21c'),[-0.42,0.56,0.062]));
  g.add(Cy(0.085,0.34,clear,[0.02,0.66,0.02],32));g.add(Cy(0.09,0.02,brass,[0.02,0.84,0.02],32));g.add(K.node(K.lathe([[0.02,0],[0.09,0.06],[0.09,0.07],[0,0.07]],28),brass,{p:[0.02,0.42,0.02]}));g.add(Cy(0.008,0.42,steel,[-0.09,0.68,0.02],8));
  g.add(RB(0.12,0.3,0.06,0.006,blk,[0.38,0.62,-0.04]));for(let i=0;i<16;i++)g.add(B(0.11,0.004,0.07,M('#2a2c2f'),[0.38,0.49+i*0.018,-0.035]));g.add(Cz(0.06,0.06,blk,[0.5,0.42,0.02],22));
  g.add(RB(0.32,0.14,0.16,0.01,M('#1f5fb4',{r:.45}),[0.02,0.3,0.0]));
  /* pipework */const cu=M('#2f86d1',{r:.4});[[[-0.3,0.52,0.02],[-0.24,0.52,0.02],[-0.24,0.36,0.02],[-0.14,0.36,0.02]],[[0.02,0.42,0.02],[0.02,0.38,0.02]],[[0.18,0.3,0.02],[0.26,0.3,0.02],[0.26,0.74,0.02],[0.34,0.74,0.0]],[[0.1,0.8,0.02],[0.2,0.8,0.02],[0.2,0.7,0.02]],[[-0.3,0.7,0.02],[-0.2,0.72,0.02],[-0.1,0.78,0.02]]].forEach(P=>k.hose(g,P,0.008,cu));
  g.add(RB(0.06,0.06,0.06,0.008,brass,[0.2,0.7,0.02]));g.add(Cx(0.03,0.08,M('#33363a',{m:.5}),[-0.3,0.2,0.02],16));g.add(Cx(0.03,0.08,brass,[0.36,0.2,0.02],16));g.add(RB(0.05,0.06,0.04,0.006,brass,[-0.14,0.36,0.02]));
  refs.pp=k.patch(g,[0.1,0,0.38],0.46,0.32,0,true);refs.g=g;
  K.label('Heater tank',g,[-0.42,0.84,0]);K.label('Process vessel',g,[0.02,0.94,0.02]);K.label('Cooler + fan',g,[0.42,0.84,0]);K.label('Reservoir',g,[0.02,0.2,0.1]);K.label('Control panel',g,[0.1,0.1,0.42]);return {root:R,refs,update(){}};}}});

/* ---- 26. Series and parallel pumps ---- */
D({id:'pumps',name:'Series and Parallel Pumps',photo:26,view3d:{h:560,cam:{tgt:[0,1.15,0],yaw:0.4,pitch:0.2,dist:2.5},shadow:{c:[0,1.1,0],r:1.8},build(K,s){const refs={};const k=X(K),{M,B,Cy,Cz,Cx,RB,floor,bench,blk,steel,white,clear,pvc}=k,R=K.group();floor(R);bench(R,2.2,1.1,0.9,0,0);
  const g=K.group({p:[0,0.9,0]});R.add(g);refs.g=g;[[-0.5,0.3],[0.5,0.3],[-0.5,-0.3],[0.5,-0.3]].forEach(([x,z])=>g.add(Cy(0.025,0.03,blk,[x,0.015,z],12)));g.add(RB(1.16,0.1,0.72,0.02,white,[0,0.08,0]));g.add(B(0.3,0.06,0.004,M('#b9bdc0',{m:.5}),[-0.36,0.08,0.362]));
  /* two pumps with motors */[-0.02,0.34].forEach(x=>{g.add(Cz(0.1,0.07,M('#8f959b',{m:.8,r:.35}),[x,0.25,0.12],34));g.add(Cz(0.06,0.09,M('#b5b9be',{m:1,r:.3}),[x,0.25,0.13],26));g.add(Cz(0.03,0.12,steel,[x,0.25,0.14],16));{const mt=Cz(0.085,0.26,M('#1f5fb4',{m:.3,r:.4}),[x,0.25,-0.1],28);(refs.m=refs.m||[]).push(mt);g.add(mt);}g.add(B(0.16,0.03,0.3,M('#3a3d42'),[x,0.145,-0.05]));g.add(B(0.08,0.05,0.06,M('#e9ebe8'),[x-0.11,0.2,0.1]));});
  /* PVC pipework with valves and gauges */const P=(a)=>k.hose(g,a,0.016,pvc);P([[-0.42,0.2,0.26],[0.48,0.2,0.26],[0.48,0.25,0.18]]);P([[-0.02,0.2,0.26],[-0.02,0.25,0.2]]);P([[-0.3,0.45,0.02],[0.5,0.45,0.02],[0.5,0.3,0.1]]);P([[0.14,0.45,0.02],[0.14,0.3,0.1],[0.34,0.25,0.18]]);P([[-0.3,0.45,0.02],[-0.42,0.45,0.02],[-0.42,0.7,0.0],[-0.36,0.7,-0.1]]);
  refs.v=[[-0.2,0.2,0.26],[0.2,0.2,0.26],[0.0,0.45,0.02],[0.3,0.45,0.02]].map(p=>k.valve(g,p));refs.g=g;
  refs.ga=[k.gauge(g,[-0.42,0.3,0.3],0.085),k.gauge(g,[0.0,0.62,0.04],0.075),k.gauge(g,[0.42,0.62,0.04],0.075)];[[ -0.42,0.2,0.28],[0,0.5,0.03],[0.42,0.5,0.03]].forEach(p=>g.add(Cy(0.01,0.08,k.brass,[p[0],p[1]+0.02,p[2]],8)));
  /* clear reservoir and flow meter */g.add(Cy(0.1,0.4,clear,[-0.3,0.34,-0.12],34));g.add(Cy(0.096,0.24,M('#3b82c4',{a:.3}),[-0.3,0.26,-0.12],30));g.add(Cy(0.105,0.02,M('#c9cdd2',{m:.8}),[-0.3,0.55,-0.12],34));k.hose(g,[[-0.44,0.2,-0.1],[-0.44,0.72,-0.1],[-0.34,0.76,-0.12],[-0.3,0.6,-0.12]],0.02,M('#b6c3d6',{a:.6}));g.add(RB(0.09,0.06,0.05,0.006,blk,[-0.2,0.45,0.03]));g.add(B(0.06,0.03,0.003,M('#9fd6a8',{e:'#1d3b22'}),[-0.2,0.45,0.057]));
  K.label('Pump 1',g,[-0.02,0.38,0.2]);K.label('Pump 2',g,[0.34,0.38,0.2]);K.label('Pressure gauges',g,[0.2,0.78,0.04]);K.label('Reservoir',g,[-0.3,0.66,-0.12]);K.label('Valves set series or parallel',g,[0.0,0.12,0.4]);return {root:R,refs,update(){}};}}});

/* ---- 27. Losses in pipe systems (wall board) ---- */
D({id:'pipes',name:'Losses in Pipe Systems',photo:27,view3d:{h:560,cam:{tgt:[0,1.25,0],yaw:0.25,pitch:0.08,dist:3.6},shadow:{c:[0,1.2,0],r:2.4},build(K,s){const refs={};const k=X(K),{M,B,Cy,Cz,Cx,RB,floor,blk,steel,white,clear}=k,R=K.group();floor(R);
  const g=K.group({p:[0,0.55,0]});R.add(g);refs.g=g;const fr=M('#33363a',{m:.4,r:.5});[-1.25,1.25].forEach(x=>{g.add(B(0.05,1.5,0.05,fr,[x,0.2,-0.06]));g.add(B(0.05,0.04,0.6,fr,[x,-0.53,0]));});g.add(RB(2.5,1.4,0.03,0.01,M('#e4e6e5',{r:.45,m:.15}),[0,0.7,0]));
  const z=0.04,dark=M('#1c2740',{r:.45}),light=M('#8fb0cf',{r:.4});
  k.hose(g,[[-1.2,0.2,z],[-1.2,0.06,z],[1.2,0.06,z],[1.2,1.34,z],[-0.62,1.34,z],[-0.62,0.3,z],[-1.05,0.3,z]],0.016,dark);
  k.hose(g,[[-1.2,0.75,z],[-1.12,0.75,z],[-1.12,0.2,z],[1.1,0.2,z],[1.1,1.22,z],[-0.1,1.22,z],[-0.1,0.36,z],[-0.5,0.3,z]],0.013,light);
  /* manometer tube pairs */[-0.5,-0.36,-0.22,0.12,0.4,0.68,0.96].forEach((x,i)=>{[-0.014,0.014].forEach(dx=>{g.add(Cy(0.006,0.8,clear,[x+dx,0.8,z],8));const wn=Cy(0.0045,1,M('#3b82c4',{a:.7}),[x+dx,0.6,z],8);wn.s=[1,0.4,1];(refs.w=refs.w||[]).push(wn);g.add(wn);});g.add(B(0.04,0.82,0.004,M('#f4f4f0'),[x,0.8,0.02]));g.add(B(0.06,0.03,0.03,blk,[x,1.22,z]));});
  refs.ga=k.gauge(g,[-0.88,1.0,0.03],0.085);g.add(Cy(0.004,0.5,clear,[-0.9,0.6,z],6));g.add(RB(0.12,0.04,0.05,0.006,blk,[-0.78,0.3,z]));g.add(Cz(0.02,0.03,M('#2f9b55'),[-0.78,0.3,z+0.03],12));
  [[0.0,0.2],[0.9,0.2],[-0.3,0.06],[0.6,0.06]].forEach(([x,y])=>g.add(Cx(0.02,0.07,light,[x,y,z],12)));g.add(B(0.07,0.07,0.003,M('#4a4f55'),[-1.15,1.3,0.018]));
  K.label('Smooth and rough test pipes',g,[0.3,1.42,z]);K.label('Manometer tubes',g,[0.54,0.5,z]);K.label('Pressure gauge',g,[-0.88,1.16,z]);K.label('Bends, elbows and valves',g,[0.4,-0.02,z]);return {root:R,refs,update(){}};}}});

/* ---- 28. Hydrostatics bench ---- */
D({id:'hydro',name:'Hydrostatics and Properties of Fluids',photo:28,view3d:{h:560,cam:{tgt:[0,1.0,0],yaw:0.4,pitch:0.16,dist:3.2},shadow:{c:[0,0.9,0],r:2.0},build(K,s){const refs={};const k=X(K),{M,B,Cy,Cz,Cx,RB,floor,blk,steel,white,clear}=k,R=K.group();floor(R);const gy=M('#c6cacb',{r:.4,m:.1}),dk=M('#2a2c2f',{r:.5});
  R.add(B(1.5,0.3,0.8,dk,[0,0.15,0]));R.add(RB(1.0,0.62,0.7,0.02,gy,[0.18,0.61,0.02]));R.add(B(0.3,0.05,0.004,M('#f0f0ec'),[0.0,0.62,0.372]));
  R.add(RB(0.44,0.3,0.5,0.02,gy,[0.46,1.06,-0.08]));R.add(B(1.0,0.012,0.7,M('#d5d8d9',{r:.3}),[0.18,0.925,0.02]));
  /* back board with top rail, left drain tray */R.add(B(1.1,0.75,0.02,white,[0.0,1.3,-0.34]));[-0.56,0.56].forEach(x=>R.add(B(0.04,0.8,0.04,dk,[x,1.3,-0.34])));R.add(B(1.3,0.06,0.12,dk,[0,1.7,-0.3]));R.add(RB(0.4,0.1,0.6,0.01,dk,[-0.55,0.72,0.0]));
  /* apparatus on top: hydrometer jars, balance, Pascal tubes, capillary plates */[-0.2,-0.1,0.0].forEach((x,i)=>{R.add(Cy(0.025,0.3,clear,[x,1.08,-0.2],14));R.add(Cy(0.022,0.2,M(['#3b82c4','#c9a43a','#7a4a2a'][i],{a:.5}),[x,1.03,-0.2],12));});
  R.add(RB(0.3,0.03,0.14,0.006,M('#8f959b',{m:.8}),[0.0,0.945,0.15]));R.add(B(0.26,0.01,0.012,steel,[0.0,1.0,0.15]));R.add(Cy(0.006,0.06,steel,[0,0.97,0.15],6));[-0.12,0.12].forEach(x=>R.add(Cy(0.03,0.006,k.brass,[x,0.975,0.15],16)));
  [0.02,0.06,0.1,0.14].forEach((x,i)=>R.add(Cy(0.004+i*0.002,0.4,clear,[-0.38+x,1.2,-0.3],8)));R.add(RB(0.14,0.14,0.04,0.006,clear,[0.42,1.3,0.12]));R.add(Cy(0.03,0.08,M('#d7d9da',{m:1}),[0.56,1.25,0.0],16));
  R.add(B(0.2,0.28,0.003,M('#dbe8f2'),[-0.4,1.4,-0.325]));
  K.label('Hydrometers',R,[-0.1,1.3,-0.2]);K.label('Lever balance',R,[0,1.06,0.2]);K.label('Capillary tubes',R,[-0.32,1.46,-0.3]);K.label('Storage + sump',R,[0.18,0.6,0.4]);return {root:R,refs,update(){}};}}});

/* ---- 29. Centre of pressure ---- */
D({id:'cop',name:'Centre of Pressure Apparatus',photo:29,view3d:{h:560,cam:{tgt:[0,1.2,0],yaw:0.35,pitch:0.14,dist:2.2},shadow:{c:[0,1.1,0],r:1.5},build(K,s){const refs={};const k=X(K),{M,B,Cy,Cz,Cx,RB,floor,bench,blk,steel,white,clear}=k,R=K.group();floor(R);bench(R,1.8,1.0,0.9,0,0);
  const g=K.group({p:[0,0.9,0]});R.add(g);refs.g=g;g.add(RB(0.74,0.035,0.34,0.012,M('#2a2c2f',{r:.4}),[0,0.0175,0]));[[-0.33,0.14],[0.33,0.14],[-0.33,-0.14],[0.33,-0.14]].forEach(([x,z])=>g.add(Cy(0.018,0.02,steel,[x,-0.006,z],10)));
  const bt=K.tex(512,460,(c,w,h)=>{c.fillStyle='#eeeeea';c.fillRect(0,0,w,h);c.strokeStyle='#5c6168';c.lineWidth=1.4;for(let y=150;y<h-30;y+=11){c.beginPath();c.moveTo(w*0.42,y);c.lineTo(w-16,y);c.stroke();}c.fillStyle='#4a4f55';c.fillRect(20,18,26,22);c.font='bold 14px sans-serif';c.fillText('CENTRE OF PRESSURE',54,34);});
  g.add(RB(0.62,0.56,0.02,0.008,white,[-0.02,0.33,-0.1]));g.add(K.node(K.plane(0.62,0.56),M('#fff',{t:bt,r:.5}),{p:[-0.02,0.33,-0.089]}));
  /* clear quadrant on its pivot, balance arm and hanger */const PV=[0.12,0.52,0];const piv=K.group({p:PV});g.add(piv);const R1=0.1,R2=0.2,N=18;for(let i=0;i<N;i++){const a=PI+(i+0.5)/N*PI/2;[R1,R2].forEach(r=>piv.add(B(r*PI/2/N*1.06,0.004,0.075,clear,[r*Math.cos(a),r*Math.sin(a),0],{r:[0,0,a+PI/2]})));[-0.0375,0.0375].forEach(zz=>piv.add(B(R2-R1,0.15*PI/2/N*1.1,0.003,M('#dcebf2',{a:.12}),[0.15*Math.cos(a),0.15*Math.sin(a),zz],{r:[0,0,a]})));}
  refs.piv=piv;piv.add(B(0.004,R2-R1,0.075,M('#dcebf2',{a:.4}),[0,-0.15,0]));piv.add(B(R2-R1,0.004,0.075,clear,[-0.15,0,0]));g.add(Cz(0.008,0.14,steel,[PV[0],PV[1],-0.03],10));
  piv.add(B(0.36,0.012,0.012,k.alu,[-0.14,0.012,-0.05]));piv.add(Cy(0.002,0.12,steel,[-0.3,-0.05,-0.05],6));piv.add(B(0.05,0.004,0.05,clear,[-0.3,-0.11,-0.05]));[0,1,2].forEach(i=>piv.add(Cy(0.018,0.005,k.brass,[-0.3,-0.105+i*0.006,-0.05],16)));piv.add(Cx(0.02,0.04,M('#555',{m:.6}),[0.07,0.03,-0.05],14));
  /* water in the tank, spare ring weights */g.add(RB(0.36,0.2,0.1,0.006,M('#dcebf2',{a:.14}),[0.08,0.36,0.0]));refs.wat=B(0.34,1,0.09,M('#3b82c4',{a:.4}),[0.08,0.3,0]);refs.wat.s=[1,0.06,1];g.add(refs.wat);
  [-0.3,-0.22].forEach((x,j)=>{g.add(Cy(0.004,0.2,steel,[x,0.13,0.26],6));for(let i=0;i<6+j*3;i++)g.add(K.node(K.torus(0.022,0.008,6,16),M('#b5b9be',{m:1,r:.25}),{p:[x,0.045+i*0.017,0.26]}));});g.add(Cy(0.03,0.04,blk,[0.2,0.055,0.24],16));
  K.label('Quadrant',piv,[-0.16,-0.2,0.05]);K.label('Pivot',g,[PV[0]+0.08,PV[1]+0.06,0]);K.label('Balance arm + hanger',piv,[-0.28,0.08,0]);K.label('Spare masses',g,[-0.26,0.26,0.26]);return {root:R,refs,update(){}};}}});

/* ---- 30. Multi-tube manometer ---- */
D({id:'manometer',name:'Multi-Tube Manometer',photo:30,view3d:{h:560,cam:{tgt:[0,1.4,0],yaw:0.35,pitch:0.1,dist:2.6},shadow:{c:[0,1.2,0],r:1.7},build(K,s){const refs={};const k=X(K),{M,B,Cy,Cz,Cx,RB,floor,bench,blk,steel,white,clear}=k,R=K.group();floor(R);bench(R,1.8,1.0,0.9,0,0);
  const g=K.group({p:[0,0.9,0]});R.add(g);refs.g=g;g.add(RB(0.6,0.03,0.3,0.008,white,[0,0.015,0]));
  const st=K.tex(512,1024,(c,w,h)=>{c.fillStyle='#f1f1ee';c.fillRect(0,0,w,h);c.fillStyle='#9aa0a6';for(let i=0;i<14;i++){const x=36+i*33.5;for(let y=60;y<h-60;y+=9)c.fillRect(x-7,y,14,1.3);}c.fillStyle='#4a4f55';c.font='12px sans-serif';for(let i=0;i<14;i++)c.fillText(String(i+1),30+i*33.5,44);});
  g.add(RB(0.56,1.0,0.025,0.008,white,[0,0.56,-0.02]));g.add(K.node(K.plane(0.56,1.0),M('#fff',{t:st,r:.5}),{p:[0,0.56,-0.006]}));
  for(let i=0;i<14;i++){const x=-0.24+i*0.0367,l=0.25+0.5*Math.abs(Math.sin(i*0.5+0.6));g.add(Cy(0.006,0.86,clear,[x,0.56,0.004],8));{const wn=Cy(0.0045,1,M('#3b82c4',{a:.7}),[x,0.13+l/2,0.004],8);wn.s=[1,l,1];(refs.w=refs.w||[]).push(wn);g.add(wn);}}
  g.add(B(0.52,0.03,0.03,M('#d7d9da',{m:.8}),[0,1.0,0.01]));[-0.2,-0.07,0.07,0.2].forEach(x=>g.add(RB(0.03,0.07,0.03,0.006,blk,[x,1.04,0.02])));g.add(B(0.5,0.03,0.03,M('#d7d9da',{m:.8}),[0,0.12,0.02]));
  for(let i=0;i<10;i++)k.hose(g,[[-0.2+i*0.045,0.11,0.03],[-0.2+i*0.045,0.05,0.1],[-0.05+i*0.02,0.05,0.2],[0.1+i*0.01,0.03,0.3]],0.004,M('#dcebf2',{a:.5}));
  k.hose(g,[[-0.3,0.06,0.02],[-0.5,0.04,0.2],[-0.2,0.04,0.42],[0.3,0.04,0.4],[0.42,0.06,0.1]],0.016,M('#dcebf2',{a:.5}));refs.g=g;g.add(RB(0.06,0.06,0.05,0.008,blk,[0.26,0.08,0.02]));
  K.label('Manometer tubes 1–14',g,[0,1.14,0]);K.label('Air manifold',g,[0.34,1.02,0.02]);K.label('Tappings to the test section',g,[0.1,0.1,0.34]);return {root:R,refs,update(){}};}}});

/* ---- 31. Rotor dynamics rig ---- */
D({id:'rotor',name:'Rotor Dynamics / Balancing Rig',photo:31,view3d:{h:560,cam:{tgt:[0.25,1.1,0],yaw:0.4,pitch:0.18,dist:2.4},shadow:{c:[0,1.1,0],r:1.9},build(K,s){const refs={};const k=X(K),{M,B,Cy,Cz,Cx,RB,floor,ss,blk,steel,white,clear}=k,R=K.group();floor(R);
  R.add(B(1.3,0.82,0.7,ss,[0.25,0.46,0]));R.add(B(1.36,0.04,0.76,ss,[0.25,0.89,0]));R.add(B(1.3,0.1,0.66,M('#8f959b',{m:.8}),[0.25,0.05,0]));R.add(B(0.006,0.74,0.004,M('#8f959b'),[0.25,0.46,0.352]));
  const g=K.group({p:[0.3,0.91,0]});R.add(g);refs.g=g;g.add(RB(0.78,0.03,0.42,0.008,M('#d7d9da',{m:.7,r:.4}),[0.05,0.015,0]));
  /* shaft, bearing blocks, discs, motor */g.add(Cx(0.008,0.62,steel,[0.05,0.16,0],12));[-0.22,0.32].forEach(x=>{g.add(RB(0.04,0.16,0.1,0.006,M('#b5b9be',{m:.9,r:.35}),[x,0.1,0]));g.add(Cx(0.03,0.045,M('#8f959b',{m:1}),[x,0.16,0],18));});[-0.05,0.16].forEach(x=>{g.add(Cx(0.06,0.02,M('#c9cdd2',{m:1,r:.25}),[x,0.16,0],36));for(let i=0;i<8;i++){const a=i/8*PI*2;g.add(Cx(0.005,0.022,blk,[x,0.16+0.045*Math.sin(a),0.045*Math.cos(a)],6));}});
  g.add(Cx(0.05,0.14,M('#33363a',{m:.5}),[-0.36,0.16,0],24));g.add(B(0.14,0.1,0.1,M('#3a3d42'),[-0.36,0.07,0]));[[0.05,0.1],[0.2,0.1]].forEach(([x])=>g.add(Cy(0.008,0.1,k.brass,[x,0.08,0.06],8)));
  k.hose(g,[[0.05,0.03,0.08],[0.1,0.03,0.16],[0.25,0.03,0.12],[0.2,0.05,0.06]],0.004,blk);
  /* clear guard */const cg=M('#dcebf2',{a:.08,r:.04});g.add(B(0.66,0.3,0.005,cg,[0.07,0.18,0.19]));g.add(B(0.66,0.3,0.005,cg,[0.07,0.18,-0.19]));g.add(B(0.66,0.005,0.38,cg,[0.07,0.33,0]));g.add(B(0.005,0.3,0.38,cg,[0.4,0.18,0]));g.add(B(0.005,0.3,0.38,cg,[-0.26,0.18,0]));
  /* drive inverter */g.add(RB(0.1,0.2,0.12,0.01,M('#2a5db0',{r:.45}),[-0.5,0.14,0.02]));g.add(B(0.06,0.04,0.003,M('#0e0f11'),[-0.5,0.2,0.082]));g.add(RB(0.14,0.04,0.14,0.008,M('#d7d9da',{m:.6}),[-0.5,0.02,0.02]));
  K.label('Shaft with balance discs',g,[0.05,0.4,0]);K.label('Bearing + proximity probes',g,[0.34,0.26,0.1]);K.label('Motor',g,[-0.36,0.3,0]);K.label('Speed drive',g,[-0.5,0.32,0.02]);return {root:R,refs,update(){}};}}});

/* ---- 32. Free and forced vibration ---- */
D({id:'vibration',name:'Free and Forced Vibration',photo:32,view3d:{h:560,cam:{tgt:[0.05,1.3,0],yaw:0.3,pitch:0.12,dist:3.0},shadow:{c:[0,1.2,0],r:2.0},build(K,s){const refs={};const k=X(K),{M,B,Cy,Cz,Cx,RB,floor,bench,blk,steel,white}=k,R=K.group();floor(R);bench(R,2.4,1.0,0.9,0,0);k.pod(R,1.9,0,-0.35,1.98);
  const g=K.group({p:[0,0.9,0]});R.add(g);refs.g=g;const fr=M('#26282b',{r:.45,m:.2});
  [-0.55,0.55].forEach(x=>{g.add(B(0.05,0.04,0.44,fr,[x,0.02,0]));[-1,1].forEach(s=>g.add(Cy(0.03,0.03,blk,[x,0.0,s*0.2],12)));});
  /* black portal frame with white back panel */const W=1.02,H=0.78,y0=0.06;[-W/2,W/2].forEach(x=>g.add(B(0.05,H,0.14,fr,[x+0.15,y0+H/2,0])));[y0+0.025,y0+H-0.025].forEach(y=>g.add(B(W,0.05,0.14,fr,[0.15,y,0])));g.add(B(W-0.06,H-0.06,0.01,M('#dfe1df',{r:.5}),[0.15,y0+H/2,-0.06]));g.add(B(0.12,0.06,0.003,M('#3a3d42'),[0.42,y0+H-0.12,-0.053]));
  /* control box */g.add(RB(0.3,H,0.16,0.01,M('#cfd2d4',{r:.5}),[-0.52,y0+H/2,0]));g.add(B(0.1,0.035,0.004,M('#0e0f11'),[-0.52,0.62,0.082]));g.add(B(0.07,0.018,0.002,M('#39d353',{e:'#39d353'}),[-0.52,0.62,0.085]));[[0.5,'#d7dadd'],[0.44,'#d7dadd'],[0.2,'#2f9b55'],[0.14,'#c0221b']].forEach(([y,c])=>g.add(Cz(0.014,0.012,M(c),[-0.52,y,0.085],12)));g.add(B(0.05,0.05,0.003,M('#4a4f55'),[-0.6,0.76,0.082]));
  /* beam pivoted at the left, exciter with unbalance disc, spring, damper */const bm=K.group({p:[-0.28,0.46,0.02]});g.add(bm);g.add(RB(0.06,0.1,0.06,0.006,M('#b5b9be',{m:.9}),[-0.3,0.46,0.02]));bm.add(B(0.78,0.014,0.02,steel,[0.39,0,0]));
  bm.add(RB(0.08,0.07,0.07,0.008,blk,[0.38,0.045,0]));bm.add(Cz(0.045,0.012,M('#c0221b',{r:.4}),[0.38,0.05,0.045],26));bm.add(Cz(0.01,0.02,blk,[0.4,0.06,0.05],8));bm.add(B(0.05,0.05,0.003,M('#e2b21c'),[0.3,0.07,0.012]));
  const sp=[];for(let i=0;i<=80;i++){const t=i/80;sp.push([0.74+0.014*Math.cos(i*0.9),0.02+t*0.26,0.014*Math.sin(i*0.9)]);}bm.add(K.node(K.tube(sp,0.003,6,0.001),M('#c0221b',{m:.3}),{}));g.add(Cy(0.012,0.06,steel,[0.46,0.77,0.02],10));
  g.add(Cy(0.03,0.12,M('#b9922f',{m:1,r:.3}),[0.02,0.2,0.02],20));g.add(Cy(0.006,0.2,steel,[0.02,0.36,0.02],8));g.add(B(0.4,0.012,0.03,M('#d7d9da',{m:.8}),[0.25,0.12,0.02]));g.add(RB(0.04,0.08,0.04,0.006,blk,[0.2,0.42,0.02]));
  refs.bm=bm;refs.g=g;K.label('Beam',bm,[0.2,0.06,0.03]);K.label('Exciter (unbalanced disc)',bm,[0.38,0.14,0.05]);K.label('Spring',bm,[0.8,0.16,0]);K.label('Damper',g,[0.02,0.14,0.08]);K.label('Speed control',g,[-0.52,0.9,0.05]);return {root:R,refs,update(){}};}}});
})();
