(function(){const PI=Math.PI;const D=(o)=>NEW3D.push(Object.assign({s:{}},o));
const X=(K)=>{const k=kit4(K),{M,B,Cy}=k;k.alu=M('#c9cdd2',{m:.9,r:.35});
  /* bar between two points in a z-plane */k.bar=(g,a,b,z,t,m,dz)=>{const dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy);g.add(B(L,t,dz||t,m,[(a[0]+b[0])/2,(a[1]+b[1])/2,z],{r:[0,0,Math.atan2(dy,dx)]}));};
  /* structures test frame: aluminium profile portal on four legs */
  k.sframe=(g,w,h,y0,d)=>{const p=0.045,a=k.alu;d=d||0.0;[-1,1].forEach(s=>{g.add(B(p,h,p,a,[s*w/2,y0+h/2,0]));[-1,1].forEach(q=>{g.add(B(p,y0+0.02,p,a,[s*(w/2+0.0),(y0+0.02)/2,q*0.2]));g.add(Cy(0.022,0.012,k.blk,[s*w/2,0.006,q*0.2],10));});g.add(B(p,p,0.4+p,a,[s*w/2,y0,0]));});g.add(B(w+p,p,p,a,[0,y0+h,0]));g.add(B(w+p,p,p,a,[0,y0,0]));};
  k.disp=(g,p,ry,txt)=>{g.add(k.RB(0.16,0.11,0.06,0.01,M('#3fa56a',{r:.5}),p,{r:[0,ry||0,0]}));g.add(K.node(K.plane(0.09,0.035),M('#fff',{t:k.screen(256,96,(c,w,h)=>{c.fillStyle='#39d353';c.font='bold 54px monospace';c.fillText(txt||'125',70,70);}),e:'#0b1016'}),{p:[p[0]+Math.sin(ry||0)*0.032,p[1]+0.015,p[2]+Math.cos(ry||0)*0.032],r:[0,ry||0,0]}));};
  return k;};

/* ---- 11. Rotating fatigue machine ---- */
D({id:'fatigue',name:'Rotating Fatigue Machine',photo:11,view3d:{h:560,cam:{tgt:[0,1.02,0.1],yaw:0.35,pitch:0.28,dist:2.3},shadow:{c:[0,1,0],r:1.7},build(K,s){const refs={};const k=X(K),{M,B,Cy,Cz,Cx,RB,floor,bench,blk,steel}=k,R=K.group();floor(R);bench(R,2.2,1.1,0.9,0,0);
  const g=K.group({p:[0.05,0.9,0.1]});R.add(g);refs.g=g;g.add(RB(1.0,0.025,0.34,0.008,blk,[0,0.0125,0]));[[-0.46,0.14],[0.46,0.14],[-0.46,-0.14],[0.46,-0.14]].forEach(([x,z])=>g.add(Cy(0.015,0.02,steel,[x,0.03,z],10)));
  /* spindle, chuck, specimen, loading bearing under a clear guard */g.add(B(0.06,0.1,0.1,M('#33363a',{m:.5}),[-0.12,0.075,0]));g.add(Cx(0.03,0.06,steel,[-0.17,0.11,0],18));g.add(Cx(0.008,0.16,M('#c9a43a',{m:1,r:.3}),[-0.27,0.11,0],10));g.add(Cx(0.022,0.03,steel,[-0.36,0.11,0],16));g.add(B(0.02,0.02,0.16,blk,[-0.36,0.11,0.05]));g.add(Cy(0.004,0.08,steel,[-0.36,0.07,0.12],6));g.add(Cy(0.03,0.02,M('#b9922f',{m:1}),[-0.36,0.04,0.12],18));g.add(Cx(0.035,0.01,M('#e9ebe8'),[-0.1,0.11,0.0],24));
  g.add(RB(0.44,0.22,0.24,0.006,M('#dcebf2',{a:.09,r:.05}),[-0.27,0.135,0]));[-1,1].forEach(s=>g.add(B(0.44,0.006,0.006,M('#9fb3bd',{a:.6}),[-0.27,0.245,s*0.12])));g.add(B(0.16,0.07,0.003,M('#f6f6f2',{r:.6}),[-0.27,0.13,0.122]));g.add(B(0.16,0.018,0.004,M('#c0221b'),[-0.27,0.155,0.122]));
  /* blue motor with fins and terminal box */g.add(Cx(0.08,0.24,M('#1f5fb4',{m:.3,r:.4}),[0.12,0.11,0],30));for(let i=0;i<9;i++)g.add(Cx(0.086,0.006,M('#1a50a0',{m:.3,r:.4}),[0.03+i*0.024,0.11,0],30));g.add(Cx(0.085,0.05,blk,[0.255,0.11,0],30));g.add(RB(0.1,0.05,0.09,0.008,blk,[0.1,0.21,0]));g.add(B(0.08,0.02,0.003,M('#e2b21c'),[0.1,0.236,0.02]));g.add(B(0.2,0.02,0.2,M('#1a50a0'),[0.12,0.035,0]));
  /* starter with emergency stop */g.add(RB(0.13,0.2,0.14,0.02,M('#eeeeea',{r:.5}),[0.39,0.125,0.02]));g.add(Cz(0.035,0.004,M('#e2b21c'),[0.39,0.17,0.092],20));g.add(Cz(0.018,0.02,M('#c0221b'),[0.39,0.17,0.1],16));[-0.025,0.025].forEach(x=>g.add(Cz(0.012,0.01,M('#d7dadd'),[0.39+x,0.07,0.092],12)));
  /* cycle counter */g.add(RB(0.2,0.05,0.14,0.01,M('#eeeeea',{r:.5}),[-0.72,0.025,0.1],{r:[0,0.2,0]}));g.add(K.node(K.plane(0.07,0.03),M('#fff',{t:k.screen(256,96,(c,w,h)=>{c.fillStyle='#39d353';c.font='bold 44px monospace';c.fillText('018432',30,66);}),e:'#0b1016'}),{p:[-0.74,0.051,0.09],r:[-PI/2,0,0.2]}));g.add(K.node(K.tube([[-0.62,0.03,0.08],[-0.52,0.01,0.2],[-0.4,0.02,0.16]],0.004,6,0.05),blk,{}));
  K.label('Specimen under guard',g,[-0.27,0.3,0]);K.label('Motor',g,[0.12,0.3,0]);K.label('Load hanger',g,[-0.36,0.02,0.2]);K.label('Cycle counter',g,[-0.72,0.12,0.1]);return {root:R,refs,update(){}};}}});

/* ---- 12. Forces in a truss ---- */
D({id:'truss',name:'Forces in a Truss',photo:12,view3d:{h:560,cam:{tgt:[0,1.3,0],yaw:0.3,pitch:0.14,dist:3.0},shadow:{c:[0,1.2,0],r:2.0},build(K,s){const refs={};const k=X(K),{M,B,Cy,Cz,Cx,RB,floor,bench,blk,steel,alu}=k,R=K.group();floor(R);bench(R,2.4,1.1,0.9,0,0);
  const g=K.group({p:[0,0.9,0]});R.add(g);refs.g=g;k.sframe(g,1.3,0.78,0.2);
  /* Warren truss of black members with strain-gauged joints */const y0=0.42,y1=0.74,N=[[-0.48,y0],[-0.16,y0],[0.16,y0],[0.48,y0],[-0.32,y1],[0,y1],[0.32,y1]];const E=[[0,1],[1,2],[2,3],[4,5],[5,6],[0,4],[4,1],[1,5],[5,2],[2,6],[6,3]];
  E.forEach(([a,b])=>k.bar(g,N[a],N[b],0,0.018,blk,0.012));N.forEach(n=>{g.add(Cz(0.022,0.03,M('#33363a',{m:.6}),[n[0],n[1],0],16));g.add(Cz(0.007,0.036,steel,[n[0],n[1],0],8));});
  /* supports: pinned left, roller right; screw load at mid joint with load cell */g.add(B(0.05,0.2,0.05,blk,[-0.48,0.33,0]));g.add(B(0.05,0.2,0.05,blk,[0.48,0.33,0]));g.add(Cz(0.012,0.06,steel,[0.48,0.4,0],10));
  g.add(Cy(0.008,0.16,steel,[0,0.3,0],8));g.add(RB(0.06,0.06,0.05,0.008,M('#c0221b',{r:.5}),[0,0.26,0]));g.add(Cy(0.03,0.02,blk,[0,0.22,0],18));
  k.disp(g,[0.78,0.3,0.1],-0.3,'500');g.add(RB(0.2,0.06,0.14,0.01,M('#3a3d42'),[0.2,0.03,0.3]));
  [0,1,2,3,4].forEach(i=>g.add(K.node(K.tube([[N[i+1>6?6:i+1][0],N[i+1][1]-0.01,0.02],[N[i+1][0]+0.05,0.3,0.12],[0.15+i*0.02,0.05,0.26]],0.0025,5,0.05),M('#e9ebe8'),{})));
  K.label('Truss members with strain gauges',g,[0,0.84,0]);K.label('Load cell + screw jack',g,[0.2,0.24,0.05]);K.label('Load display',g,[0.78,0.42,0.1]);K.label('Test frame',g,[-0.65,1.04,0]);return {root:R,refs,update(){}};}}});

/* ---- 13. Bending stress in a beam ---- */
D({id:'bending',name:'Bending Stress in a Beam',photo:13,view3d:{h:560,cam:{tgt:[0,1.3,0],yaw:0.3,pitch:0.14,dist:3.0},shadow:{c:[0,1.2,0],r:2.0},build(K,s){const refs={};const k=X(K),{M,B,Cy,Cz,Cx,RB,floor,bench,blk,steel,alu}=k,R=K.group();floor(R);bench(R,2.4,1.1,0.9,0,0);
  const g=K.group({p:[0,0.9,0]});R.add(g);refs.g=g;k.sframe(g,1.2,0.8,0.2);
  /* inverted T-beam on two supports, loaded at two points from above */const y=0.5;g.add(B(0.9,0.006,0.04,alu,[0,y-0.02,0]));g.add(B(0.9,0.04,0.006,alu,[0,y,0]));[-0.4,0.4].forEach(x=>{g.add(B(0.05,0.26,0.05,blk,[x,0.34,0]));g.add(Cz(0.01,0.06,steel,[x,y-0.03,0],10));});
  [-0.15,0.15].forEach(x=>{g.add(Cy(0.008,0.36,steel,[x,y+0.2,0],8));g.add(Cz(0.012,0.05,steel,[x,y+0.03,0],10));});g.add(B(0.36,0.025,0.04,blk,[0,y+0.38,0]));g.add(Cy(0.01,0.14,steel,[0,y+0.46,0],8));
  /* load cell housing on top of the frame */g.add(RB(0.22,0.1,0.1,0.01,blk,[0,1.07,0]));g.add(B(0.12,0.03,0.003,M('#f4f4ee'),[0,1.08,0.052]));[-0.2,0.2].forEach(x=>g.add(B(0.03,0.2,0.03,blk,[x,1.12,0])));g.add(Cy(0.04,0.02,blk,[0,1.14,0],18));
  /* strain gauges and leads to the bridge unit */for(let i=0;i<9;i++){const x=-0.04+i*0.01;g.add(B(0.006,0.01,0.002,M('#c9a43a',{m:1}),[x,y-0.015+i*0.004,0.004]));g.add(K.node(K.tube([[x,y,0.006],[x+0.05,0.3,0.1],[0.2+i*0.015,0.08,0.25]],0.0022,5,0.05),M(['#c0221b','#1f5fb4','#2f9b55','#e2b21c'][i%4]),{}));}
  g.add(RB(0.3,0.08,0.2,0.012,M('#3a3d42'),[0.3,0.04,0.28]));k.disp(g,[0.75,0.3,0.1],-0.3,'-152');
  /* parts tray on the bench */g.add(RB(0.4,0.05,0.14,0.01,M('#2a2c2f'),[-0.35,0.025,0.42]));g.add(B(0.38,0.006,0.12,M('#d6e6ee',{a:.4}),[-0.35,0.053,0.42]));
  K.label('T-beam with strain gauges',g,[0,0.58,0.06]);K.label('Load cell',g,[0.2,1.2,0]);K.label('Strain bridge',g,[0.3,0.14,0.3]);return {root:R,refs,update(){}};}}});

/* ---- 14. Buckling of struts ---- */
D({id:'buckling',name:'Buckling Test Apparatus',photo:14,view3d:{h:560,cam:{tgt:[0,1.08,0.1],yaw:0.35,pitch:0.22,dist:2.7},shadow:{c:[0,1,0],r:1.9},build(K,s){const refs={};const k=X(K),{M,B,Cy,Cz,Cx,RB,floor,bench,blk,steel,alu,white}=k,R=K.group();floor(R);bench(R,2.4,1.1,0.9,0,0);k.pod(R,1.9,0,-0.38);
  const g=K.group({p:[0,0.9,0]});R.add(g);refs.g=g;const lg=M('#dcdedc',{r:.5});
  [-0.62,0.62].forEach(x=>[-1,1].forEach(s=>{g.add(B(0.03,0.2,0.03,lg,[x+Math.sign(x)*0.04,0.1,s*0.13],{r:[s*0.25,0,Math.sign(x)*0.2]}));g.add(Cy(0.02,0.015,blk,[x+Math.sign(x)*0.06,0.008,s*0.155],10));}));
  const st=K.tex(1024,64,(c,w,h)=>{c.fillStyle='#dcdedc';c.fillRect(0,0,w,h);c.fillStyle='#2a2c2f';for(let i=0;i<=100;i++){c.fillRect(20+i*9.8,h-(i%10?14:26),1.5,i%10?14:26);}c.font='14px sans-serif';for(let i=0;i<=10;i++)c.fillText(String(i*100),14+i*98,22);});
  g.add(RB(1.3,0.09,0.2,0.01,lg,[0,0.24,0]));g.add(K.node(K.plane(1.24,0.07),M('#fff',{t:st,r:.5}),{p:[0,0.24,0.101]}));g.add(B(1.3,0.012,0.14,M('#8f959b',{m:.8}),[0,0.29,0]));
  /* loading end with handwheel, load cell end, bowed strut */g.add(RB(0.1,0.12,0.14,0.01,blk,[0.52,0.35,0]));g.add(Cx(0.012,0.12,steel,[0.62,0.36,0],10));g.add(K.node(K.torus(0.07,0.012,8,30),blk,{p:[0.69,0.36,0],r:[0,0,PI/2]}));g.add(Cx(0.02,0.02,blk,[0.69,0.36,0],12));
  g.add(RB(0.12,0.12,0.14,0.01,blk,[-0.52,0.35,0]));g.add(B(0.08,0.04,0.004,M('#f4f4ee'),[-0.52,0.36,0.072]));
  const P=[];for(let i=0;i<=24;i++){const t=i/24;P.push([-0.46+t*0.92,0.36,0.05*Math.sin(t*PI)]);}refs.strut=K.node(K.tube(P,0.005,6,0.001),M('#b5b9be',{m:1,r:.25}),{});g.add(refs.strut);
  /* mid-span dial gauge on magnetic base */g.add(RB(0.06,0.05,0.05,0.006,blk,[0,0.32,-0.07]));g.add(Cy(0.006,0.12,steel,[0,0.4,-0.07],6));g.add(Cz(0.035,0.02,M('#f4f4ee',{r:.4}),[0,0.44,-0.05],24));
  /* upper black rail on posts */[-0.6,0.6].forEach(x=>g.add(B(0.03,0.3,0.03,lg,[x,0.44,-0.1])));g.add(B(1.36,0.04,0.05,blk,[0,0.6,-0.1]));
  /* rack of spare struts on the bench */const rk=K.group({p:[0.15,0.01,0.4]});g.add(rk);rk.add(RB(0.66,0.02,0.24,0.01,blk,[0,0.01,0]));for(let i=0;i<7;i++)rk.add(B(0.6,0.004,0.018,M('#b5b9be',{m:1,r:.3}),[0,0.026,-0.09+i*0.03]));
  k.disp(g,[-0.42,0.06,0.3],0.2,'184');
  K.label('Strut (bows sideways)',g,[0,0.4,0.2]);K.label('Screw handwheel',g,[0.69,0.5,0]);K.label('Load cell end',g,[-0.52,0.48,0]);K.label('Spare struts',rk,[0,0.08,0]);return {root:R,refs,update(){}};}}});

/* ---- 15. Beam apparatus ---- */
D({id:'beams',name:'Beam Apparatus',photo:15,view3d:{h:560,cam:{tgt:[0,1.15,0],yaw:0.3,pitch:0.16,dist:3.0},shadow:{c:[0,1,0],r:2.1},build(K,s){const refs={};const k=X(K),{M,B,Cy,Cz,Cx,RB,floor,bench,blk,steel,alu,white}=k,R=K.group();floor(R);bench(R,2.6,1.1,0.9,0,0);k.pod(R,1.9,0,-0.38);
  const g=K.group({p:[0,0.9,0]});R.add(g);refs.g=g;
  [-0.75,0.75].forEach(x=>{g.add(RB(0.06,0.46,0.3,0.01,white,[x,0.25,0]));[-1,1].forEach(s=>{g.add(Cy(0.05,0.04,blk,[x,0.02,s*0.15],20));});g.add(B(0.1,0.03,0.42,blk,[x,0.05,0]));});
  const sc=K.tex(1024,32,(c,w,h)=>{c.fillStyle='#17181b';c.fillRect(0,0,w,h);c.fillStyle='#e9ebe8';for(let i=0;i<=140;i++)c.fillRect(8+i*7.2,0,1.2,i%10?9:18);});
  g.add(B(1.5,0.05,0.03,blk,[0,0.13,0.08]));g.add(B(1.5,0.05,0.03,blk,[0,0.13,-0.08]));g.add(B(1.5,0.05,0.03,blk,[0,0.46,-0.02]));g.add(K.node(K.plane(1.46,0.03),M('#fff',{t:sc}),{p:[0,0.465,-0.004]}));
  /* load-cell supports and the test beam */[-0.5,0.5].forEach(x=>{g.add(RB(0.07,0.14,0.2,0.008,white,[x,0.22,0]));g.add(K.node(K.prismX([[0.02,0],[-0.02,0],[0,0.03]],-0.03,0.03),steel,{p:[x,0.29,0],r:[0,PI/2,0]}));g.add(Cz(0.03,0.015,M('#f4f4ee',{r:.4}),[x,0.22,0.108],22));});
  refs.beam=B(1.2,0.006,0.025,M('#b5b9be',{m:1,r:.25}),[0,0.324,0]);g.add(refs.beam);
  /* hangers with weights, dial gauge on the top rail */[-0.2,0.25].forEach((x,i)=>{g.add(Cy(0.003,0.14,steel,[x,0.25,0],6));g.add(B(0.03,0.02,0.04,blk,[x,0.335,0]));for(let j=0;j<3+i;j++)g.add(Cy(0.03,0.012,M(j%2?'#b9922f':'#c9a43a',{m:1,r:.3}),[x,0.19+j*0.013,0],20));});
  g.add(RB(0.06,0.07,0.05,0.006,blk,[0.05,0.5,0.0]));g.add(Cy(0.004,0.12,steel,[0.05,0.4,0.02],6));g.add(Cz(0.04,0.02,M('#f4f4ee',{r:.4}),[0.05,0.42,0.04],24));g.add(RB(0.07,0.1,0.02,0.006,white,[0.3,0.42,0.02]));
  g.add(RB(0.24,0.03,0.18,0.01,M('#2a2c2f'),[-0.45,0.015,0.35]));g.add(K.node(K.tube([[-0.5,0.2,0.1],[-0.55,0.03,0.2],[-0.45,0.03,0.3]],0.003,6,0.05),blk,{}));
  K.label('Test beam',g,[0,0.36,0.06]);K.label('Load-cell supports',g,[-0.5,0.2,0.2]);K.label('Weight hangers',g,[0.25,0.16,0.1]);K.label('Dial gauge on scale rail',g,[0.05,0.56,0]);return {root:R,refs,update(){}};}}});

/* ---- 16. Pin-jointed frameworks ---- */
D({id:'frameworks',name:'Pin-Jointed Frameworks',photo:16,view3d:{h:560,cam:{tgt:[0,1.2,0],yaw:0.35,pitch:0.16,dist:3.0},shadow:{c:[0,1.1,0],r:2.0},build(K,s){const refs={};const k=X(K),{M,B,Cy,Cz,Cx,RB,floor,bench,blk,steel,alu,white}=k,R=K.group();floor(R);bench(R,2.6,1.1,0.9,0,0);k.pod(R,2.0,0,-0.38);
  const g=K.group({p:[0,0.9,0]});R.add(g);refs.g=g;
  [-0.6,0.6].forEach(x=>[-1,1].forEach(s=>{g.add(B(0.035,0.26,0.035,white,[x+Math.sign(x)*0.04,0.13,s*0.14],{r:[s*0.25,0,Math.sign(x)*0.25]}));g.add(Cy(0.02,0.015,blk,[x+Math.sign(x)*0.07,0.008,s*0.17],10));}));
  const st=K.tex(1024,64,(c,w,h)=>{c.fillStyle='#c9cdd2';c.fillRect(0,0,w,h);c.fillStyle='#2a2c2f';for(let i=0;i<=120;i++)c.fillRect(10+i*8.3,h-(i%10?12:24),1.4,i%10?12:24);});
  g.add(B(1.3,0.08,0.24,alu,[0,0.28,0]));g.add(K.node(K.plane(1.28,0.07),M('#fff',{t:st,m:.5,r:.4}),{p:[0,0.28,0.121]}));[-0.06,0.06].forEach(z=>g.add(B(1.3,0.004,0.01,M('#8f959b',{m:1}),[0,0.322,z])));
  /* column with a cantilever pin-jointed frame */g.add(B(0.07,0.62,0.07,alu,[-0.5,0.63,0]));const N=[[-0.46,0.72],[-0.46,0.5],[-0.2,0.72],[-0.2,0.5],[0.06,0.5]],E=[[0,2],[1,3],[2,3],[0,3],[3,4],[2,4]];E.forEach(([a,b])=>k.bar(g,N[a],N[b],0.05,0.022,blk,0.014));N.forEach(n=>g.add(Cz(0.02,0.03,M('#33363a',{m:.6}),[n[0],n[1],0.05],14)));
  g.add(Cy(0.004,0.16,steel,[0.06,0.42,0.05],6));g.add(Cy(0.03,0.04,M('#b9922f',{m:1}),[0.06,0.33,0.05],18));
  /* red load cell block, white upright, instruments */g.add(RB(0.07,0.16,0.07,0.008,M('#c0221b',{r:.5}),[-0.52,0.4,0.13]));g.add(RB(0.08,0.5,0.06,0.008,white,[-0.2,0.57,-0.08]));g.add(RB(0.06,0.05,0.05,0.006,white,[0.1,0.35,0.13]));
  for(let i=0;i<5;i++)g.add(K.node(K.tube([[-0.42+i*0.1,0.5,0.06],[-0.4+i*0.1,0.2,0.2],[-0.3+i*0.12,0.03,0.3]],0.003,5,0.06),M('#f1f1ee'),{}));
  [-0.95,0.95].forEach(x=>{g.add(RB(0.2,0.07,0.16,0.01,M('#1f5fb4',{r:.45}),[x,0.035,0.2]));g.add(B(0.12,0.04,0.06,blk,[x,0.09,0.2]));});
  K.label('Pin-jointed frame',g,[-0.2,0.82,0.05]);K.label('Load',g,[0.16,0.36,0.05]);K.label('Load cell',g,[-0.52,0.54,0.16]);K.label('Slotted bed with scale',g,[0.4,0.38,0.12]);return {root:R,refs,update(){}};}}});

/* ---- 18. Thermal power plant with steam turbine ---- */
D({id:'steam',name:'Steam Turbine Power Plant',photo:18,view3d:{h:560,cam:{tgt:[0.1,0.85,0],yaw:0.35,pitch:0.16,dist:3.4},shadow:{c:[0,0.8,0],r:2.2},build(K,s){const refs={};const k=X(K),{M,B,Cy,Cz,Cx,RB,floor,blk,steel,white}=k,R=K.group();floor(R);
  const fr=M('#55595e',{m:.4,r:.5}),g=K.group({p:[0,0,0]});R.add(g);refs.g=g;
  [[-0.85,0.35],[0.05,0.35],[-0.85,-0.35],[0.05,-0.35],[0.95,0.35],[0.95,-0.35]].forEach(([x,z])=>{g.add(B(0.04,x>0.5?0.5:1.0,0.04,fr,[x,x>0.5?0.25:0.5,z]));g.add(Cy(0.03,0.04,blk,[x,0.02,z],12));});
  g.add(B(0.96,0.035,0.78,fr,[-0.4,1.0,0]));g.add(B(0.94,0.03,0.74,fr,[-0.4,0.16,0]));[0.35,-0.35].forEach(z=>g.add(B(0.94,0.03,0.03,fr,[0.5,0.3,z])));
  /* turbine and dynamo under a red perforated guard */const pt=K.tex(128,128,(c,w,h)=>{c.clearRect(0,0,w,h);c.fillStyle='#c41f24';c.fillRect(0,0,w,h);c.globalCompositeOperation='destination-out';for(let y=0;y<8;y++)for(let x=0;x<8;x++){c.beginPath();c.arc(x*16+(y%2?12:4),y*16+8,4.6,0,7);c.fill();}},{rep:true});
  g.add(Cx(0.15,0.3,M('#fff',{t:pt,at:.5,uvs:[6,3],r:.5}),[-0.62,1.2,0.05],36));g.add(Cx(0.08,0.26,steel,[-0.62,1.2,0.05],20));g.add(Cx(0.07,0.2,blk,[-0.35,1.2,0.05],24));g.add(Cx(0.075,0.06,M('#d7d9da',{m:1}),[-0.47,1.2,0.05],24));g.add(B(0.05,0.05,0.003,M('#e2b21c'),[-0.42,1.2,0.122]));g.add(B(0.5,0.02,0.3,blk,[-0.52,1.03,0.05]));
  g.add(Cx(0.07,0.2,M('#e9ebe8',{r:.4}),[-0.25,1.18,-0.2],24));g.add(K.node(K.tube([[-0.7,1.3,-0.1],[-0.7,1.45,-0.2],[-0.3,1.4,-0.25],[-0.25,1.25,-0.2]],0.012,8,0.08),blk,{}));
  /* boiler and condenser below */g.add(RB(0.16,0.66,0.6,0.01,white,[-0.72,0.58,0]));for(let i=0;i<18;i++)g.add(B(0.004,0.56,0.5,blk,[-0.6+i*0.008,0.6,0],{}));g.add(Cy(0.15,0.52,blk,[-0.25,0.62,0.05],30));g.add(K.node(K.sphere(0.15,18),blk,{p:[-0.25,0.88,0.05],s:[1,0.5,1]}));
  g.add(K.node(K.tube([[-0.5,0.8,0.25],[-0.45,0.72,0.3],[-0.4,0.8,0.3],[-0.36,0.7,0.25]],0.012,8,0.03),M('#d7d9da',{m:1}),{}));
  g.add(RB(0.34,0.14,0.3,0.02,M('#1f5fb4',{r:.4,m:.3}),[-0.5,0.25,0.1]));g.add(Cx(0.06,0.16,M('#1a50a0',{m:.3}),[-0.3,0.27,0.1],20));[0,1].forEach(i=>g.add(K.node(K.tube([[-0.4+i*0.1,0.32,0.2],[-0.38+i*0.1,0.42,0.28],[-0.3+i*0.1,0.36,0.2]],0.01,8,0.03),M('#b8653a',{m:1,r:.3}),{})));
  /* control console */const c=K.group({p:[0.5,0,0]});g.add(c);c.add(RB(0.86,0.56,0.6,0.01,white,[0,0.62,0]));c.add(K.node(K.prismX([[0.3,0.9],[-0.3,0.9],[-0.3,1.3],[0.06,1.3]],-0.43,0.43),white,{}));c.add(B(0.88,0.02,0.6,fr,[0,0.9,0]));
  const pn=K.tex(512,256,(q,w,h)=>{q.fillStyle='#ecedea';q.fillRect(0,0,w,h);q.fillStyle='#4a4f55';q.font='bold 15px sans-serif';q.fillText('THERMAL POWER PLANT WITH STEAM ENGINE',60,26);q.fillRect(24,10,24,22);[[70,60],[300,60]].forEach(([x,y])=>{q.fillStyle='#1b1d20';q.fillRect(x,y,130,34);q.fillStyle='#b9c23a';q.fillRect(x+8,y+8,114,18);});[[80,130],[150,130],[230,130],[300,130],[330,190]].forEach(([x,y],i)=>{q.fillStyle='#1b1d20';q.fillRect(x-18,y-18,36,36);q.fillStyle=i===1?'#c0221b':i===0?'#e23b2e':'#33363a';q.beginPath();q.arc(x,y,10,0,7);q.fill();});['#1a56c4','#1a56c4','#1a56c4'].forEach((cc,i)=>{q.fillStyle=cc;q.beginPath();q.arc(40+i*44,222,16,0,7);q.fill();});});
  c.add(K.node(K.plane(0.84,0.5),M('#fff',{t:pn,r:.5}),{p:[0,1.105,0.185],r:[-0.733,0,0]}));
  c.add(B(0.14,0.14,0.006,M('#e2b21c'),[-0.18,0.52,0.302]));c.add(Cz(0.05,0.03,M('#c0221b'),[-0.18,0.52,0.31],20));c.add(B(0.02,0.1,0.02,M('#c0221b'),[-0.18,0.52,0.33]));c.add(B(0.05,0.05,0.006,blk,[-0.14,0.74,0.302]));[0.6,0.5].forEach(y=>c.add(Cz(0.012,0.01,blk,[0.22,y,0.302],10)));c.add(Cy(0.02,0.1,M('#2f9b55'),[0,0.25,0.1]));
  K.label('Turbine + generator',g,[-0.55,1.42,0.05]);K.label('Boiler',g,[-0.78,0.98,0.3]);K.label('Condenser',g,[-0.25,0.98,0.2]);K.label('Feed pump',g,[-0.45,0.38,0.3]);K.label('Control console',c,[0,1.38,0]);return {root:R,refs,update(){}};}}});

/* ---- 19. Refrigeration / heat pump trainer ---- */
D({id:'refrig',name:'Refrigeration / Heat Pump Trainer',photo:19,view3d:{h:560,cam:{tgt:[0,1.25,0],yaw:0.35,pitch:0.14,dist:2.9},shadow:{c:[0,1.1,0],r:1.9},build(K,s){const refs={};const k=X(K),{M,B,Cy,Cz,Cx,RB,floor,ss,blk,steel,white}=k,R=K.group();floor(R);
  R.add(B(1.3,0.8,0.7,ss,[0,0.45,0]));R.add(B(1.36,0.04,0.76,ss,[0,0.87,0]));R.add(B(1.3,0.1,0.66,M('#8f959b',{m:.8}),[0,0.05,0]));R.add(B(0.006,0.72,0.004,M('#8f959b'),[0,0.45,0.352]));
  const g=K.group({p:[0,0.89,0]});R.add(g);refs.g=g;const fr=M('#26282b',{r:.5});
  /* glazed base frame */[[-0.6,0.25],[0.6,0.25],[-0.6,-0.25],[0.6,-0.25]].forEach(([x,z])=>g.add(B(0.03,0.36,0.03,fr,[x,0.18,z])));[0.015,0.36].forEach(y=>{[-0.25,0.25].forEach(z=>g.add(B(1.23,0.03,0.03,fr,[0,y,z])));[-0.6,0.6].forEach(x=>g.add(B(0.03,0.03,0.53,fr,[x,y,0])));});
  g.add(B(1.2,0.33,0.005,M('#dcebf2',{a:.15,r:.05}),[0,0.19,0.25]));g.add(B(1.2,0.005,0.5,M('#dcebf2',{a:.15,r:.05}),[0,0.375,0]));
  /* compressor, receiver, gauges, expansion valve */g.add(Cy(0.09,0.14,blk,[0.3,0.11,0],28));g.add(K.node(K.sphere(0.09,18),blk,{p:[0.3,0.18,0],s:[1,0.7,1]}));g.add(RB(0.14,0.16,0.14,0.02,blk,[0.48,0.11,0.02]));g.add(Cy(0.04,0.2,M('#2a2c2f',{m:.5}),[0.12,0.13,-0.1],18));
  [-0.45,-0.3].forEach((x,i)=>{g.add(Cz(0.065,0.03,M('#f4f4ee',{r:.4}),[x,0.2,0.2],30));g.add(K.node(K.torus(0.065,0.006,6,30),M(i?'#c0221b':'#1f5fb4'),{p:[x,0.2,0.216],r:[PI/2,0,0]}));g.add(B(0.004,0.05,0.002,blk,[x,0.215,0.217],{r:[0,0,0.6-i*1.3]}));});
  g.add(RB(0.16,0.12,0.12,0.01,white,[-0.38,0.07,0.16]));g.add(RB(0.26,0.03,0.2,0.008,white,[-0.02,0.03,0.1]));
  [[[-0.3,0.2,0.1],[-0.1,0.3,0.0],[0.2,0.3,0.0],[0.3,0.25,0]],[[0.3,0.25,0.05],[0.1,0.33,0.15],[-0.2,0.33,0.15],[-0.45,0.27,0.18]]].forEach(P=>g.add(K.node(K.tube(P,0.006,8,0.05),M('#b8653a',{m:1,r:.3}),{})));
  /* evaporator / condenser duct and instrument panel behind */g.add(RB(1.1,0.16,0.2,0.01,M('#b9bdc0',{r:.5}),[0,0.47,-0.12]));g.add(B(0.3,0.1,0.004,M('#2a4e7a',{r:.3}),[-0.25,0.47,-0.018]));g.add(B(0.3,0.1,0.004,M('#2a4e7a',{r:.3}),[0.3,0.47,-0.018]));g.add(Cz(0.05,0.03,blk,[0,0.47,0.0],20));
  g.add(Cy(0.03,0.16,M('#dcebf2',{a:.3}),[0.58,0.5,0.0],14));g.add(Cy(0.03,0.16,M('#dcebf2',{a:.3}),[-0.58,0.5,0.0],14));
  const pn=K.tex(512,256,(q,w,h)=>{q.fillStyle='#b9bdc0';q.fillRect(0,0,w,h);q.strokeStyle='#8f959b';q.strokeRect(4,4,w/2-8,h-8);q.strokeRect(w/2+4,4,w/2-8,h-8);q.fillStyle='#2a2c2f';q.font='bold 14px sans-serif';q.fillText('REFRIGERATION CYCLE',34,30);[[60,80],[140,80],[60,150],[140,150]].forEach(([x,y])=>{q.fillStyle='#1b1d20';q.fillRect(x-26,y-18,52,36);q.fillStyle='#39d353';q.font='bold 18px monospace';q.fillText('4.2',x-18,y+7);});[[200,90],[200,160]].forEach(([x,y])=>{q.fillStyle='#1b1d20';q.beginPath();q.arc(x,y,14,0,7);q.fill();});q.strokeStyle='#2a2c2f';q.lineWidth=2;q.strokeRect(300,70,150,110);q.beginPath();q.moveTo(300,125);q.lineTo(450,125);q.stroke();});
  g.add(RB(1.0,0.38,0.05,0.008,M('#b9bdc0',{r:.5}),[0,0.76,-0.2]));g.add(K.node(K.plane(0.98,0.36),M('#fff',{t:pn,r:.5}),{p:[0,0.76,-0.172]}));[-0.4,0.4].forEach(x=>g.add(B(0.03,0.2,0.03,fr,[x,0.5,-0.22])));
  K.label('Compressor',g,[0.3,0.3,0.1]);K.label('Pressure gauges',g,[-0.38,0.32,0.25]);K.label('Evaporator / condenser',g,[0,0.6,-0.05]);K.label('Instrument panel',g,[0,1.0,-0.17]);return {root:R,refs,update(){}};}}});
})();
