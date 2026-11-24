(function(){const PI=Math.PI;
/* extra shared furniture */
window.kit4=function(K){const refs={};const k=window.kit3(K),{M,B,Cy,Cz,Cx,RB}=k;
  k.ss=M('#c9ccce',{m:.85,r:.32});k.blk=M('#1d1f22',{r:.5});k.steel=M('#b5b9be',{m:1,r:.3});k.white=M('#ecedea',{r:.55});k.rub=M('#151617',{r:.8});
  /* stainless table with optional lower shelf */
  k.stable=(R,w,d,h,x,z,shelf)=>{const g=K.group({p:[x||0,0,z||0]});R.add(g);refs.g=g;g.add(B(w,0.035,d,k.ss,[0,h-0.0175,0]));g.add(B(w,0.05,0.02,k.ss,[0,h-0.06,d/2-0.01]));[[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([a,b])=>{g.add(B(0.04,h-0.04,0.04,k.ss,[a*(w/2-0.03),(h-0.04)/2,b*(d/2-0.03)]));g.add(Cy(0.022,0.03,k.blk,[a*(w/2-0.03),0.015,b*(d/2-0.03)],10));});if(shelf)g.add(B(w-0.06,0.02,d-0.06,k.ss,[0,shelf,0]));return g;};
  /* services pod above an island bench */
  k.pod=(R,w,x,z,y)=>{const g=K.group({p:[x||0,y||1.78,z||-0.3]});R.add(g);refs.g=g;g.add(RB(w,0.26,0.2,0.02,M('#e6e7e3',{r:.6}),[0,0,0]));[-w*0.36,-w*0.28].forEach((xx,i)=>g.add(Cz(0.032,0.03,M(i?'#1f5fb4':'#2f9b55',{r:.4}),[xx,0,0.11],16)));g.add(B(0.26,0.09,0.004,M('#fbfbf8',{r:.6}),[0.05,0.03,0.103]));[w*0.28,w*0.37].forEach(xx=>g.add(B(0.09,0.09,0.006,M('#f6f6f2',{r:.5}),[xx,0,0.104])));[-1,1].forEach(a=>R.add(B(0.05,(y||1.78)-0.9-0.12,0.05,M('#d9dad6',{r:.6}),[(x||0)+a*(w/2-0.1),0.9+((y||1.78)-0.9-0.12)/2,(z||-0.3)-0.15])));return g;};
  /* small touch screen texture */
  k.screen=(w,h,draw)=>K.tex(w||256,h||160,(c,W,H)=>{c.fillStyle='#10161d';c.fillRect(0,0,W,H);c.fillStyle='#1f6fd1';c.fillRect(0,0,W,H*0.16);c.fillStyle='#dfe7ee';c.font='bold '+Math.round(H*0.2)+'px sans-serif';if(draw)draw(c,W,H);else{c.fillText('READY',W*0.1,H*0.55);c.fillStyle='#39d353';c.fillRect(W*0.1,H*0.68,W*0.5,H*0.08);}});
  k.stripe=(col)=>K.tex(256,64,(c,W,H)=>{c.fillStyle='#e3e5e4';c.fillRect(0,0,W,H);c.fillStyle=col||'#1c63b8';c.beginPath();c.moveTo(W*0.08,H);c.lineTo(W*0.2,0);c.lineTo(W*0.3,0);c.lineTo(W*0.18,H);c.fill();c.fillStyle='#3d4757';c.fillRect(W*0.36,H*0.3,W*0.4,H*0.1);c.fillRect(W*0.36,H*0.55,W*0.25,H*0.08);});
  k.estop=(g,p)=>{g.add(Cy(0.028,0.012,M('#e2b21c',{r:.5}),[p[0],p[1],p[2]],18));g.add(Cy(0.02,0.02,M('#c0221b',{r:.4}),[p[0],p[1]+0.016,p[2]],18));};
  k.estopZ=(g,p)=>{g.add(Cz(0.028,0.012,M('#e2b21c',{r:.5}),p,18));g.add(Cz(0.02,0.02,M('#c0221b',{r:.4}),[p[0],p[1],p[2]+0.016],18));};
  return k;};
const D=(o)=>NEW3D.push(Object.assign({s:{}},o));

/* ---- 5. Muffle furnace ---- */
D({id:'furnace',name:'Muffle Furnace',photo:5,view3d:{h:560,cam:{tgt:[0,1.2,0],yaw:0.4,pitch:0.16,dist:2.5},shadow:{c:[0,1.1,0],r:1.7},build(K){const refs={};const k=kit4(K),{M,B,Cy,Cz,Cx,RB,floor,blk,steel}=k,R=K.group();floor(R);k.stable(R,1.2,0.8,0.82);
  const g=K.group({p:[0,0.82,0]});R.add(g);refs.g=g;const beige=M('#d8d2c6',{r:.6}),base=M('#aeb0b0',{r:.55});
  g.add(RB(0.66,0.2,0.56,0.012,base,[0,0.1,0]));g.add(RB(0.72,0.56,0.6,0.012,beige,[0,0.48,-0.02]));g.add(B(0.68,0.5,0.03,M('#dcd6ca',{r:.6}),[0,0.5,0.295]));
  g.add(Cz(0.022,0.01,steel,[0,0.44,0.315],18));g.add(Cz(0.01,0.012,blk,[0,0.44,0.318],12));
  g.add(Cx(0.014,0.66,M('#8f8a80',{m:.5,r:.4}),[0,0.225,0.33],14));[-0.35,0.35].forEach(x=>g.add(RB(0.05,0.06,0.07,0.012,blk,[x,0.225,0.32])));
  g.add(B(0.07,0.06,0.004,blk,[-0.2,0.1,0.282]));g.add(B(0.05,0.03,0.002,M('#e2572e',{e:'#5a1a0a'}),[-0.2,0.1,0.285]));g.add(B(0.05,0.05,0.004,blk,[0.22,0.1,0.282]));g.add(B(0.1,0.03,0.002,M('#f4f4ee'),[0,0.06,0.282]));
  for(let i=0;i<14;i++)g.add(B(0.6,0.004,0.006,M('#b7b1a5',{r:.6}),[0,0.765,-0.28+i*0.008]));g.add(Cy(0.03,0.12,steel,[0,0.82,-0.2]));
  /* heat-proof gloves on top */g.add(RB(0.22,0.03,0.1,0.012,M('#c2452e',{r:.8}),[0,0.775,0.12]));
  K.label('Insulated chamber door',g,[0,0.62,0.32]);K.label('Temperature controller',g,[-0.2,0.02,0.3]);K.label('Vent',g,[0.1,0.9,-0.2]);return {root:R,refs,update(){}};}}});

/* ---- 6. Sieve shaker ---- */
D({id:'sieve',name:'Sieve Shaker',photo:6,view3d:{h:560,cam:{tgt:[0.1,1.15,0],yaw:0.35,pitch:0.14,dist:2.4},shadow:{c:[0,1.1,0],r:1.6},build(K){const refs={};const k=kit4(K),{M,B,Cy,Cz,Cx,RB,floor,ss,blk,steel,white}=k,R=K.group();floor(R);k.stable(R,0.7,0.6,0.85);
  const g=K.group({p:[0,0.85,0]});R.add(g);refs.g=g;
  g.add(K.node(K.lathe([[0.0,0],[0.19,0],[0.2,0.02],[0.2,0.1],[0.17,0.17],[0.15,0.19],[0,0.19]],40),white,{}));g.add(K.node(K.plane(0.16,0.06),M('#fff',{t:k.screen(256,96),e:'#0b1016',r:.2}),{p:[0,0.07,0.2]}));g.add(B(0.2,0.012,0.004,M('#1c63b8'),[0,0.03,0.2]));
  const sieve=(q,y,r)=>{q.add(Cy(r,0.05,M('#cfd2d4',{m:1,r:.22}),[0,y,0],40));q.add(K.node(K.torus(r,0.005,6,40),M('#e4e6e7',{m:1,r:.2}),{p:[0,y+0.025,0]}));};
  sieve(g,0.215,0.15);sieve(g,0.268,0.15);g.add(Cy(0.152,0.014,M('#3a3d42',{m:.5}),[0,0.3,0],40));g.add(K.node(K.lathe([[0.03,0],[0.14,0],[0.1,0.03],[0.03,0.04]],30),M('#d7d9da',{m:.9,r:.3}),{p:[0,0.307,0]}));
  [-0.2,0.2].forEach(x=>{g.add(Cy(0.008,0.62,steel,[x,0.43,0],10));g.add(Cy(0.02,0.04,blk,[x,0.36,0],12));g.add(Cy(0.02,0.03,M('#d7d9da',{m:1}),[x,0.13,0],12));});g.add(B(0.46,0.02,0.04,M('#d7d9da',{m:.9,r:.3}),[0,0.35,0]));
  /* wall controller */R.add(RB(0.22,0.14,0.06,0.02,white,[0,1.72,-0.33],{r:[0,0,0]}));R.add(B(0.1,0.04,0.004,M('#12161b'),[-0.03,1.74,-0.298]));R.add(K.node(K.tube([[0,1.65,-0.31],[0,1.3,-0.3],[0.02,1.0,-0.22]],0.004,6,0.05),blk,{}));
  /* rack with spare sieves and trays */const rk=K.group({p:[0.72,0,0]});R.add(rk);[[-0.25,-0.25],[0.25,-0.25],[-0.25,0.25],[0.25,0.25]].forEach(([x,z])=>rk.add(B(0.03,1.25,0.03,ss,[x,0.625,z])));[0.2,0.5,0.8,1.25].forEach(y=>rk.add(B(0.54,0.02,0.54,ss,[0,y,0])));
  for(let i=0;i<7;i++){rk.add(Cy(0.15,0.05,M('#cfd2d4',{m:1,r:.22}),[0,1.29+i*0.055,0],40));rk.add(K.node(K.torus(0.15,0.005,6,40),M('#e4e6e7',{m:1,r:.2}),{p:[0,1.315+i*0.055,0]}));}
  [['#3fae5a',0.56],['#e2c21c',0.86]].forEach(([c,y])=>rk.add(RB(0.44,0.1,0.4,0.02,M(c,{r:.6}),[0,y,0.02])));
  K.label('Sieve stack + clamp',g,[0.24,0.36,0.1]);K.label('Vibrating base',g,[0.26,0.1,0.1]);K.label('Spare sieves',rk,[0,1.72,0]);return {root:R,refs,update(){}};}}});

/* ---- 7. Direct shear machine ---- */
D({id:'shear',name:'Direct Shear Testing Machine',photo:7,view3d:{h:560,cam:{tgt:[0.05,0.95,0],yaw:0.4,pitch:0.14,dist:3.0},shadow:{c:[0,0.8,0],r:2.0},build(K){const refs={};const k=kit4(K),{M,B,Cy,Cz,Cx,RB,floor,ss,blk,steel}=k,R=K.group();floor(R);
  const blue=M('#1f5fb4',{r:.45,m:.2});[-0.5,0.5].forEach(x=>{[-1,1].forEach(s=>R.add(B(0.07,0.86,0.03,blue,[x,0.43,s*0.13],{r:[s*0.16,0,0]})));R.add(B(0.09,0.02,0.52,blue,[x,0.01,0]));R.add(B(0.07,0.05,0.2,blue,[x,0.5,0]));});
  const g=K.group({p:[0,0.86,0]});R.add(g);refs.g=g;g.add(RB(1.5,0.1,0.42,0.02,ss,[0,0.05,0]));const nt=K.tex(512,40,(c,w,h)=>{c.fillStyle='#c9ccce';c.fillRect(0,0,w,h);c.fillStyle='#3d4757';c.font='bold 24px sans-serif';c.fillText('DIRECT SHEAR TESTING MACHINE',50,29);});g.add(K.node(K.plane(0.8,0.06),M('#fff',{t:nt,m:.5,r:.4}),{p:[0.25,0.05,0.211]}));
  /* control console */g.add(RB(0.4,0.24,0.36,0.03,M('#d9dbda',{r:.5}),[-0.52,0.22,0]));g.add(K.node(K.plane(0.2,0.13),M('#fff',{t:k.screen(),e:'#0b1016',r:.2}),{p:[-0.47,0.24,0.182]}));k.estopZ(g,[-0.66,0.26,0.18]);g.add(B(0.38,0.03,0.004,M('#1f5fb4'),[-0.52,0.13,0.182]));
  /* shear box carriage */g.add(B(0.6,0.02,0.2,M('#8f959b',{m:.9,r:.4}),[0.2,0.11,0]));g.add(RB(0.2,0.1,0.18,0.01,blk,[0.05,0.17,0]));g.add(RB(0.12,0.05,0.12,0.008,M('#c9a43a',{m:1,r:.35}),[0.05,0.245,0]));g.add(Cy(0.012,0.05,steel,[0.05,0.29,0]));
  /* loading yoke and hanger */[-0.1,0.1].forEach(z=>g.add(Cy(0.008,0.44,steel,[0.05,0.31,z],10)));g.add(B(0.03,0.02,0.24,steel,[0.05,0.53,0]));g.add(Cy(0.01,0.2,steel,[0.05,0.45,0]));g.add(Cy(0.03,0.02,blk,[0.05,0.56,0]));
  R.add(Cy(0.008,0.6,steel,[0.05,0.5,0.1],10));R.add(Cy(0.07,0.01,steel,[0.05,0.21,0.1],24));[0,1].forEach(i=>R.add(Cy(0.06,0.02,M('#3a3d42',{m:.6}),[0.05,0.23+i*0.022,0.1],24)));
  /* dial gauges, load ring, drive */g.add(Cz(0.035,0.02,M('#f4f4ee',{r:.4}),[-0.12,0.36,0.03],24));g.add(Cy(0.004,0.2,steel,[-0.12,0.26,0.03],6));g.add(Cx(0.012,0.26,steel,[0.3,0.17,0],10));g.add(K.node(K.torus(0.04,0.008,8,24),steel,{p:[0.36,0.17,0],r:[PI/2,0,0]}));g.add(Cz(0.03,0.02,M('#f4f4ee',{r:.4}),[0.36,0.17,0.03],20));
  g.add(RB(0.14,0.12,0.14,0.01,blk,[0.52,0.17,0]));g.add(Cx(0.01,0.16,steel,[0.64,0.19,0],10));g.add(Cx(0.035,0.02,blk,[0.7,0.19,0],18));
  /* slotted weights on the floor */[0,1,2].forEach(i=>R.add(RB(0.22,0.02,0.22,0.005,M('#d7d9da',{m:.7,r:.4}),[-0.95,0.01+i*0.022,0.35],{r:[0,0.2*i,0]})));
  K.label('Shear box',g,[0.05,0.33,0.12]);K.label('Normal-load hanger',R,[0.2,0.5,0.14]);K.label('Control console',g,[-0.52,0.42,0.1]);K.label('Load ring',g,[0.36,0.28,0.05]);return {root:R,refs,update(){}};}}});

/* ---- 10. Torsion test apparatus ---- */
D({id:'torsion',name:'Torsion Test Apparatus',photo:10,view3d:{h:560,cam:{tgt:[0,1.08,0.1],yaw:0.4,pitch:0.2,dist:2.6},shadow:{c:[0,1,0],r:1.9},build(K){const refs={};const k=kit4(K),{M,B,Cy,Cz,Cx,RB,floor,bench,blk,steel}=k,R=K.group();floor(R);bench(R,2.4,1.1,0.9,0,0);k.pod(R,1.9,0,-0.38);
  const g=K.group({p:[0,0.9,0.05]});R.add(g);refs.g=g;const alu=M('#c9cdd2',{m:.9,r:.35});
  [[-0.62,-0.08],[0.62,-0.08],[-0.62,0.08],[0.62,0.08]].forEach(([x,z])=>{g.add(B(0.04,0.16,0.04,alu,[x,0.08,z]));g.add(Cy(0.02,0.012,blk,[x,0.006,z],10));});
  g.add(B(1.36,0.045,0.09,alu,[0,0.18,0]));[-0.02,0.02].forEach(z=>g.add(B(1.36,0.004,0.008,M('#8f959b',{m:1}),[0,0.204,z])));g.add(B(1.36,0.02,0.02,alu,[0,0.19,-0.07]));
  /* fixed (torque) end with load cell arm */g.add(RB(0.1,0.12,0.1,0.01,blk,[-0.42,0.265,0]));g.add(Cx(0.03,0.05,steel,[-0.35,0.28,0],18));g.add(B(0.03,0.02,0.2,blk,[-0.46,0.28,0.06]));g.add(Cy(0.02,0.05,steel,[-0.46,0.24,0.15]));
  /* driven end: gearbox, handwheel, protractor */g.add(RB(0.12,0.14,0.12,0.012,blk,[0.2,0.275,0]));g.add(Cx(0.03,0.05,steel,[0.12,0.28,0],18));g.add(Cx(0.085,0.012,M('#f4f4ee',{r:.4}),[0.27,0.28,0],36));const pt=K.tex(256,256,(c,w,h)=>{c.clearRect(0,0,w,h);c.fillStyle='#f4f4ee';c.beginPath();c.arc(w/2,h/2,w/2,0,7);c.fill();c.strokeStyle='#222';for(let i=0;i<72;i++){const a=i/72*PI*2,r0=i%6?112:100;c.lineWidth=i%6?1.5:3;c.beginPath();c.moveTo(w/2+r0*Math.cos(a),h/2+r0*Math.sin(a));c.lineTo(w/2+122*Math.cos(a),h/2+122*Math.sin(a));c.stroke();}c.fillStyle='#1d1f22';c.beginPath();c.arc(w/2,h/2,36,0,7);c.fill();});
  g.add(K.node(K.plane(0.17,0.17),M('#fff',{t:pt,at:.5,r:.5}),{p:[0.277,0.28,0],r:[0,PI/2,0]}));g.add(Cx(0.012,0.1,steel,[0.33,0.28,0],10));g.add(Cx(0.05,0.015,blk,[0.38,0.28,0],24));g.add(Cx(0.008,0.04,blk,[0.4,0.31,0.02],8));
  /* specimen */g.add(Cx(0.006,0.44,M('#c9a43a',{m:1,r:.3}),[-0.11,0.28,0],12));
  /* digital torque meter */g.add(RB(0.2,0.14,0.08,0.012,M('#3fa56a',{r:.5}),[0.75,0.2,0.1],{r:[0,-0.3,0]}));g.add(K.node(K.plane(0.1,0.04),M('#fff',{t:k.screen(256,96,(c,w,h)=>{c.fillStyle='#39d353';c.font='bold 54px monospace';c.fillText('2.41',60,70);}),e:'#0b1016'}),{p:[0.745,0.22,0.143],r:[0,-0.3,0]}));
  g.add(K.node(K.tube([[-0.46,0.22,0.15],[-0.3,0.02,0.3],[0.4,0.02,0.32],[0.72,0.14,0.14]],0.004,6,0.08),blk,{}));
  /* keyboard as in the photo */
  K.label('Torque arm + load cell',g,[-0.46,0.4,0.1]);K.label('Specimen',g,[-0.1,0.36,0]);K.label('Angle scale + handwheel',g,[0.32,0.44,0]);K.label('Torque display',g,[0.75,0.34,0.1]);return {root:R,refs,update(){}};}}});
})();
