(function(){const PI=Math.PI,kit=window.kit3;
/* =================== 2. Pendulum impact tester in its octagonal guard =================== */
NEW3D.push({id:'charpy',name:'Pendulum Impact Tester',photo:9,s:{},view3d:{h:560,cam:{tgt:[0,1.25,0],yaw:0.38,pitch:0.08,dist:4.3},shadow:{c:[0,1.1,0],r:2.6},
 build(K,s){const refs={};const {M,B,Cy,Cz,Cx,RB,floor}=kit(K),R=K.group();floor(R);
  const alu=M('#c4c8cc',{m:.9,r:.35}),clear=M('#dcebf2',{a:.06,r:.05}),blk=M('#1d1f22',{r:.45,m:.2}),steel=M('#aeb3b8',{m:1,r:.3}),yel=M('#e8b90f',{r:.5});
  /* plinth */R.add(RB(1.5,0.32,1.1,0.02,M('#dfe1e1',{r:.6}),[0,0.16,0]));R.add(B(1.2,0.06,0.8,M('#2b2d31',{r:.4}),[0,0.35,0]));
  const Y=0.38,g=K.group({p:[0,Y,0]});R.add(g);refs.g=g;
  /* octagon outline in the x-y plane */const W=0.98,HH=1.0,c=0.42,cy=1.0;const V=[[-c,cy+HH],[c,cy+HH],[W,cy+HH-0.56],[W,cy-HH+0.56],[c,cy-HH],[-c,cy-HH],[-W,cy-HH+0.56],[-W,cy+HH-0.56]];const D=0.42,p=0.04;
  const bar=(a,b,z)=>{const dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy);g.add(B(L+p,p,p,alu,[(a[0]+b[0])/2,(a[1]+b[1])/2,z],{r:[0,0,Math.atan2(dy,dx)]}));};
  [D,-D].forEach(z=>{V.forEach((v,i)=>bar(v,V[(i+1)%8],z));/* the two full-height posts and the mid rails */[-c,c].forEach(x=>g.add(B(p,2*HH,p,alu,[x,cy,z])));[cy+0.42,cy-0.34].forEach(y=>g.add(B(2*c,p,p,alu,[0,y,z])));g.add(B(p,0.66,p,alu,[-0.14,cy-0.67,z]));});
  V.forEach((v,i)=>{g.add(B(p,p,2*D,alu,[v[0],v[1],0]));g.add(K.node(K.sphere(0.03,10),blk,{p:[v[0],v[1],D]}));g.add(K.node(K.sphere(0.03,10),blk,{p:[v[0],v[1],-D]}));
    const w=V[(i+1)%8],dx=w[0]-v[0],dy=w[1]-v[1],L=Math.hypot(dx,dy);g.add(B(L,0.005,2*D-0.04,clear,[(v[0]+w[0])/2,(v[1]+w[1])/2,0],{r:[0,0,Math.atan2(dy,dx)]}));});
  /* front and back sheets */[D,-D].forEach(z=>{g.add(B(2*c,2*HH,0.005,clear,[0,cy,z]));[-1,1].forEach(sx=>g.add(K.node(K.prismX([[sx*c,cy+HH],[sx*W,cy+HH-0.56],[sx*W,cy-HH+0.56],[sx*c,cy-HH]],-0.0025,0.0025),clear,{r:[0,-PI/2,0],p:[0,0,z]})));});
  /* machine: base casting, column, dial, pendulum */
  g.add(RB(0.5,0.16,0.62,0.02,blk,[0,0.08,0]));g.add(RB(0.3,1.24,0.14,0.03,blk,[0,0.78,-0.2],{r:[0,PI/2,0]}));g.add(RB(0.34,0.3,0.2,0.04,blk,[0,1.42,-0.17],{r:[0,PI/2,0]}));
  const PV=[0,1.36,0];g.add(Cz(0.03,0.36,steel,[0,1.36,-0.05]));
  /* dial */const dt=K.tex(256,256,(c2,w,h)=>{c2.fillStyle='#f3f3ef';c2.beginPath();c2.arc(w/2,h/2,w/2,0,7);c2.fill();c2.strokeStyle='#222';c2.fillStyle='#222';for(let i=0;i<=60;i++){const a=PI*0.75+i/60*PI*1.5,r0=i%5?108:98;c2.lineWidth=i%5?1.5:3;c2.beginPath();c2.moveTo(w/2+r0*Math.cos(a),h/2+r0*Math.sin(a));c2.lineTo(w/2+118*Math.cos(a),h/2+118*Math.sin(a));c2.stroke();}c2.font='bold 15px sans-serif';c2.textAlign='center';for(let i=0;i<=6;i++){const a=PI*0.75+i/6*PI*1.5;c2.fillText(String(i*50),w/2+82*Math.cos(a),h/2+82*Math.sin(a)+5);}c2.fillText('J',w/2,h/2+58);c2.fillStyle='#1d1f22';c2.beginPath();c2.arc(w/2,h/2,60,0,7);c2.fill();},{});
  g.add(Cz(0.19,0.03,M('#e9e9e4',{r:.5}),[0,1.36,-0.07],40));g.add(K.node(K.plane(0.37,0.37),M('#fff',{t:dt,at:.5,r:.5}),{p:[0,1.36,-0.052]}));refs.ptr=K.group({p:[0,1.36,-0.046]});refs.ptr.add(B(0.006,0.15,0.004,M('#c0221b'),[0,0.075,0]));g.add(refs.ptr);
  const pen=K.group({p:PV.slice(),r:[0,0,0.5]});g.add(pen);pen.add(Cy(0.014,0.9,steel,[0,-0.45,0.08]));pen.add(Cz(0.05,0.1,blk,[0,0,0.08]));
  /* C-shaped hammer */pen.add(K.node(K.prismX([[0.17,0.11],[-0.17,0.11],[-0.17,-0.13],[-0.05,-0.13],[-0.05,-0.01],[0.05,-0.01],[0.05,-0.13],[0.17,-0.13]],-0.03,0.03),M('#33363a',{m:.6,r:.4}),{p:[0,-0.93,0.08],r:[0,PI/2,0]}));pen.add(B(0.012,0.05,0.04,steel,[0.031,-1.03,0.08]));
  /* anvil with specimen */g.add(RB(0.3,0.14,0.2,0.012,M('#c9b98a',{r:.5,m:.3}),[0,0.23,0.08]));[-0.06,0.06].forEach(x=>g.add(B(0.05,0.07,0.1,steel,[x,0.335,0.08])));refs.spec=B(0.14,0.012,0.012,M('#8f959b',{m:1,r:.3}),[0,0.345,0.08]);g.add(refs.spec);refs.pen=pen;refs.g=g;
  /* warning labels and controls on the front */[0,-0.09].forEach(dy=>g.add(B(0.13,0.07,0.004,yel,[-0.26,cy+0.3+dy,D+0.004])));[['#1a56c4',0],['#d9a514',0.045],['#d9a514',0.09],['#1a56c4',0.135]].forEach(([cc,o])=>g.add(Cz(0.016,0.004,M(cc,{r:.5}),[0.3,cy+0.32-o,D+0.004],14)));
  g.add(B(0.03,0.09,0.04,blk,[c+0.01,cy+0.3,D+0.02]));/* door latch */
  K.label('Dial',g,[0.2,1.56,0]);K.label('Pendulum',pen,[0.05,-0.5,0.1]);K.label('Anvil + specimen',g,[0.2,0.3,0.2]);K.label('Guard',g,[-0.75,1.75,D]);
  return {root:R,refs,update(){}};}}});

/* =================== 3. Bench-top wind tunnel =================== */
NEW3D.push({id:'wind',name:'Wind Tunnel',photo:22,s:{},view3d:{h:560,cam:{tgt:[0.15,1.08,0],yaw:0.5,pitch:0.16,dist:3.1},shadow:{c:[0.1,1,0],r:2.2},
 build(K,s){const refs={};const {M,B,Cy,Cz,Cx,RB,loft,floor,bench}=kit(K),R=K.group();floor(R);bench(R,3.0,0.9,0.9,0.15,0);
  const blk=M('#17181b',{r:.38,m:.15}),blk2=M('#232529',{r:.55}),edge=M('#0e0f11',{r:.6}),clear=M('#d6e6ee',{a:.2,r:.04}),steel=M('#b5b9be',{m:1,r:.3});
  const Y=0.9,g=K.group({p:[0,Y,0]});R.add(g);refs.g=g;const AX=0.36;
  /* inlet: square mouth with a rounded lip, then a smooth contraction */
  const sec=[];for(let i=0;i<=14;i++){const t=i/14,k=1-(3*t*t-2*t*t*t);sec.push([-1.18+t*0.5,0.2+0.42*k,0.2+0.42*k,AX]);}
  g.add(K.node(loft(sec),blk,{}));g.add(B(0.3,0.64,0.64,blk,[-1.31,AX,0]));g.add(RB(0.04,0.68,0.68,0.03,edge,[-1.46,AX,0]));
  /* honeycomb screen at the mouth */const hc=K.tex(256,256,(c,w,h)=>{c.fillStyle='#0c0d0e';c.fillRect(0,0,w,h);c.strokeStyle='#3a3d42';c.lineWidth=1;for(let i=0;i<=32;i++){c.beginPath();c.moveTo(i*8,0);c.lineTo(i*8,h);c.stroke();c.beginPath();c.moveTo(0,i*8);c.lineTo(w,i*8);c.stroke();}});
  g.add(K.node(K.plane(0.6,0.6),M('#fff',{t:hc,r:.8}),{p:[-1.481,AX,0],r:[0,-PI/2,0]}));
  /* test section: flanged frame with clear window, aerofoil inside */
  [-0.68,-0.24].forEach(x=>{g.add(RB(0.035,0.3,0.3,0.012,edge,[x,AX,0]));for(let i=0;i<5;i++)[-1,1].forEach(k=>g.add(Cx(0.006,0.04,steel,[x,AX-0.12+i*0.06,k*0.138],8)));});
  g.add(B(0.42,0.012,0.2,blk,[-0.46,AX+0.106,0]));g.add(B(0.42,0.012,0.2,blk,[-0.46,AX-0.106,0]));g.add(B(0.42,0.2,0.006,M('#111214',{r:.5}),[-0.46,AX,-0.1]));
  g.add(B(0.42,0.2,0.006,clear,[-0.46,AX,0.1]));[[0,0.1],[0,-0.1]].forEach(([_,dy])=>g.add(B(0.42,0.022,0.012,edge,[-0.46,AX+dy,0.102])));[-0.66,-0.26].forEach(x=>g.add(B(0.022,0.2,0.012,edge,[x,AX,0.102])));
  const af=[];for(let i=0;i<=20;i++){const t=i/20,x=t*t,y=0.6*(0.2969*Math.sqrt(x)-0.126*x-0.3516*x*x+0.2843*x*x*x-0.1015*x*x*x*x);af.push([x*0.12-0.06,y*0.12*1.6]);}for(let i=19;i>0;i--){const t=i/20,x=t*t,y=0.6*(0.2969*Math.sqrt(x)-0.126*x-0.3516*x*x+0.2843*x*x*x-0.1015*x*x*x*x);af.push([x*0.12-0.06,-y*0.12*1.6]);}
  refs.af=K.node(K.prismX(af,-0.09,0.09),M('#c9cdd2',{m:.8,r:.3}),{p:[-0.46,AX,0],r:[0.14,PI/2,0]});g.add(refs.af);refs.g=g;refs.AX=AX;g.add(Cz(0.005,0.2,steel,[-0.46,AX,0],8));
  /* control box under the test section */g.add(RB(0.46,0.22,0.3,0.015,blk2,[-0.46,0.11,0],{r:[0,PI/2,0]}));g.add(B(0.4,0.02,0.24,blk,[-0.46,0.225,0]));
  [[-0.08,'#d7dadd'],[0,'#d7dadd'],[0.08,'#d7dadd']].forEach(([x,cc])=>{g.add(Cz(0.022,0.02,M('#0f1012',{r:.4}),[-0.46+x,0.13,0.156],20));g.add(Cz(0.006,0.024,M(cc,{m:.8,r:.3}),[-0.46+x,0.13,0.158],10));});
  [['#3fae5a',-0.14],['#c0221b',0.14]].forEach(([cc,x])=>g.add(Cz(0.01,0.008,M(cc,{e:cc}),[-0.46+x,0.06,0.154],12)));g.add(B(0.16,0.03,0.004,M('#d7dadd',{r:.5}),[-0.46,0.055,0.153]));
  /* long diffuser with a coloured stripe */
  const st=K.tex(512,64,(c,w,h)=>{c.fillStyle='#17181b';c.fillRect(0,0,w,h);const gr=c.createLinearGradient(0,0,w,0);gr.addColorStop(0,'rgba(120,70,190,0)');gr.addColorStop(.5,'#7a46c0');gr.addColorStop(1,'rgba(200,60,140,0)');c.strokeStyle=gr;c.lineWidth=5;c.beginPath();c.moveTo(60,46);c.lineTo(w-30,30);c.stroke();c.fillStyle='#e6e8ea';c.font='600 20px sans-serif';c.fillText('WIND TUNNEL',70,30);});
  g.add(K.node(loft([[-0.22,0.2,0.2,AX],[1.02,0.4,0.4,AX]]),blk,{}));g.add(K.node(K.plane(1.1,0.14),M('#fff',{t:st,r:.4}),{p:[0.38,AX,0.166],r:[0,-0.081,0]}));
  /* fan housing with bolted flange and grille */g.add(RB(0.05,0.5,0.5,0.03,edge,[1.03,AX,0]));g.add(RB(0.2,0.46,0.46,0.06,blk,[1.15,AX,0]));g.add(Cx(0.2,0.012,M('#0b0c0d',{r:.8}),[1.252,AX,0],36));
  for(let i=0;i<8;i++){const a=i/8*PI*2;g.add(B(0.006,0.36,0.03,M('#3a3d42',{m:.5,r:.4}),[1.256,AX,0],{r:[a,0,0]}));}g.add(Cx(0.05,0.03,blk2,[1.265,AX,0],20));
  for(let i=0;i<12;i++){const a=i/12*PI*2;g.add(Cx(0.008,0.07,steel,[1.03,AX+0.215*Math.sin(a)*1.05,0.215*Math.cos(a)*1.05],8));}
  /* supports */[[-1.3,0.3],[0.55,0.2],[1.12,0.3]].forEach(([x,w])=>{[-1,1].forEach(k=>g.add(B(0.04,0.2,0.04,blk2,[x,0.1,k*w*0.5])));g.add(B(0.06,0.02,w+0.1,blk2,[x,0.01,0]));});
  K.label('Inlet contraction',g,[-1.05,AX+0.38,0]);K.label('Test section',g,[-0.46,AX+0.2,0.1]);K.label('Diffuser',g,[0.4,AX+0.24,0]);K.label('Fan',g,[1.18,AX+0.3,0]);K.label('Speed and balance controls',g,[-0.46,0.02,0.2]);
  return {root:R,refs,update(){}};}}});

/* =================== 4. Heat-exchanger service module =================== */
NEW3D.push({id:'hx',name:'Heat Exchanger Service Module',photo:20,s:{},view3d:{h:560,cam:{tgt:[0.2,1.2,0.1],yaw:0.5,pitch:0.2,dist:2.5},shadow:{c:[0.1,1.1,0],r:2.0},
 build(K,s){const refs={};const {M,B,Cy,Cz,Cx,RB,floor,bench}=kit(K),R=K.group();floor(R);bench(R,2.4,1.1,0.9,0.15,0);
  const fr=M('#4a4f55',{m:.5,r:.45}),white=M('#ecedea',{r:.55}),blk=M('#1d1f22',{r:.5}),steel=M('#b5b9be',{m:1,r:.3}),brass=M('#c9a43a',{m:1,r:.3}),hot=M('#c8261c',{r:.45}),cold=M('#1f3f9c',{r:.45}),clear=M('#d6e6ee',{a:.25,r:.04}),grn=M('#2f9b55',{r:.5});
  const Y=0.9,g=K.group({p:[-0.25,Y,-0.05]});R.add(g);refs.g=g;const t=0.035;
  /* steel tube frame: base rectangle, two uprights at the back right, top rail */
  [[0,0.3],[0,-0.3]].forEach(([_,z])=>g.add(B(1.0,t,t,fr,[0,t/2,z])));[-0.5,0.5].forEach(x=>g.add(B(t,t,0.6+t,fr,[x,t/2,0])));
  [[-0.5,0.3],[0.5,0.3],[-0.5,-0.3],[0.5,-0.3]].forEach(([x,z])=>g.add(Cy(0.02,0.012,blk,[x,-0.004,z],12)));
  [[0.5,0.3],[0.5,-0.3],[-0.12,-0.3],[-0.5,-0.3]].forEach(([x,z])=>g.add(B(t,0.86,t,fr,[x,0.43,z])));g.add(B(1.0+t,t,t,fr,[0,0.86,-0.3]));g.add(B(t,t,0.6+t,fr,[0.5,0.86,0]));g.add(B(0.62+t,t,t,fr,[0.19,0.86,0.3]));
  /* tanks and pump behind the panel */g.add(RB(0.3,0.5,0.34,0.02,M('#2a2c2f',{r:.5}),[0.28,0.3,-0.08]));g.add(RB(0.26,0.3,0.26,0.04,M('#dfe3e4',{a:.55,r:.1}),[-0.08,0.2,-0.12]));g.add(Cx(0.07,0.2,M('#2b4e9b',{r:.4,m:.3}),[-0.3,0.12,0.12]));g.add(Cx(0.085,0.05,blk,[-0.19,0.12,0.12]));
  /* white panel with printed mimic, displays, sockets */
  const pt=K.tex(768,768,(c,w,h)=>{c.fillStyle='#ecedea';c.fillRect(0,0,w,h);c.strokeStyle='#b8bcbc';c.lineWidth=2;c.strokeRect(6,6,w-12,h-12);c.fillStyle='#4a4f55';c.font='bold 26px sans-serif';c.fillText('HEAT EXCHANGER SERVICE MODULE',64,52);c.fillRect(22,26,30,30);
    const disp=(x,y,v,l)=>{c.fillStyle='#1b1d20';c.fillRect(x,y,150,58);c.fillStyle='#39d353';c.font='bold 34px monospace';c.fillText(v,x+18,y+42);c.fillStyle='#4a4f55';c.font='16px sans-serif';c.fillText(l,x,y-10);};
    disp(110,120,'60.0','Hot flow  L/min');disp(470,120,'2.40','Cold flow  L/min');disp(110,250,'41.6','T1 … T4  °C');
    c.fillStyle='#1b1d20';c.fillRect(470,250,60,60);c.fillRect(548,250,92,60);c.fillStyle='#e23b2e';c.font='bold 26px monospace';c.fillText('60',478,290);c.fillStyle='#39d353';c.fillText('59.8',556,290);c.fillStyle='#4a4f55';c.font='16px sans-serif';c.fillText('Tank heater controller',470,240);
    c.fillStyle='#1b1d20';[[130,380],[190,380]].forEach(([x,y])=>{c.beginPath();c.arc(x,y,20,0,7);c.fill();});c.fillStyle='#39d353';c.beginPath();c.arc(130,380,9,0,7);c.fill();c.fillStyle='#4a4f55';c.fillText('Heater    Pump',104,424);
    c.strokeStyle='#4a4f55';c.lineWidth=2;c.beginPath();c.moveTo(30,470);c.lineTo(w-30,470);c.stroke();c.font='15px sans-serif';['T1','T2','T3','T4'].forEach((l,i)=>{c.fillText(l,118+i*150,505);});
    c.fillStyle='#c8261c';c.font='bold 17px sans-serif';c.fillText('HOT OUT',70,640);c.fillText('HOT RETURN',190,640);c.fillStyle='#1f3f9c';c.fillText('COLD OUT',420,640);c.fillText('COLD RETURN',560,640);
    c.fillStyle='#1a56c4';c.beginPath();c.arc(80,560,24,0,7);c.fill();c.fillStyle='#fff';c.font='bold 22px sans-serif';c.fillText('!',75,568);});
  const PX=0.02,PZ=0.32;g.add(B(0.66,0.66,0.02,white,[PX,0.5,PZ-0.011]));g.add(K.node(K.plane(0.66,0.66),M('#fff',{t:pt,r:.5}),{p:[PX,0.5,PZ]}));
  const px=u=>PX-0.33+u/768*0.66,py=v=>0.83-v/768*0.66;
  /* thermocouple sockets (green) with leads */const tc=[];[0,1,2,3].forEach(i=>{const x=px(128+i*150),y=py(528);g.add(B(0.03,0.018,0.016,grn,[x,y,PZ+0.008]));tc.push([x,y]);});
  /* hose tails on the panel */const tails=[[px(110),py(690),hot],[px(250),py(690),hot],[px(460),py(690),cold],[px(620),py(690),cold]];tails.forEach(([x,y,m])=>{g.add(Cz(0.016,0.04,brass,[x,y,PZ+0.02],14));g.add(Cz(0.02,0.012,m,[x,y,PZ+0.044],14));});
  /* flow valves */[[px(330),py(150)],[px(690),py(150)]].forEach(([x,y])=>{g.add(Cz(0.02,0.03,blk,[x,y,PZ+0.015],16));g.add(B(0.05,0.008,0.008,blk,[x,y,PZ+0.034]));});
  /* exchanger on its plate, to the right of the module */const e=K.group({p:[1.0,Y,0.25]});R.add(e);e.add(RB(0.62,0.02,0.3,0.008,white,[0,0.01,0]));
  [-0.2,0.2].forEach(x=>{e.add(RB(0.05,0.13,0.1,0.01,blk,[x,0.085,0]));e.add(Cx(0.035,0.03,blk,[x+(x<0?-0.035:0.035),0.11,0],18));});
  e.add(Cx(0.03,0.36,clear,[0,0.11,0],24));e.add(Cx(0.011,0.5,M('#b8653a',{m:1,r:.3}),[0,0.11,0],14));[-0.12,0.12].forEach(x=>e.add(Cy(0.008,0.05,brass,[x,0.16,0],10)));[-0.27,0.27].forEach(x=>e.add(Cx(0.012,0.04,brass,[x,0.11,0],10)));
  /* hoses: hot (red) to the inner tube ends, cold (blue) to the shell ports */
  const W=(x,y)=>[x-0.25,Y+y-0.9+0.9,0];const P=([x,y],z)=>[x-0.25,y+Y,z-0.05];
  const hose=(a,b,m,sag,side)=>{const A=P([a[0],a[1]],PZ+0.05),Bq=b,mid=[(A[0]+Bq[0])/2+side,Y+0.03,Math.max(A[2],Bq[2])+sag];R.add(K.node(K.tube([A,[A[0],A[1],A[2]+0.07],[A[0]+side*0.3,Y+0.04,A[2]+sag*0.7],mid,[Bq[0],Bq[1]-0.0,Bq[2]+0.12],Bq],0.011,10,0.09),m,{}));};
  hose(tails[0],[1.0-0.3,Y+0.11,0.25],hot,0.34,0.05);hose(tails[1],[1.0+0.3,Y+0.11,0.25],hot,0.42,0.2);
  hose(tails[2],[1.0-0.12,Y+0.19,0.25],cold,0.28,0.1);hose(tails[3],[1.0+0.12,Y+0.19,0.25],cold,0.22,0.12);
  /* green thermocouple leads to the exchanger */tc.forEach(([x,y],i)=>{const A=P([x,y],PZ+0.02),E=[1.0+[-0.24,-0.12,0.12,0.24][i],Y+0.15,0.25];R.add(K.node(K.tube([A,[A[0],A[1]-0.12,A[2]+0.1],[(A[0]+E[0])/2,Y+0.02,A[2]+0.22+i*0.03],[E[0],Y+0.06,E[2]+0.1],E],0.003,6,0.06),grn,{}));});
  /* bench services pod above, as in the photo */const pod=K.group({p:[0.15,1.78,-0.3]});R.add(pod);pod.add(RB(1.9,0.28,0.2,0.02,M('#e6e7e3',{r:.6}),[0,0,0]));[-0.7,-0.5].forEach((x,i)=>pod.add(Cz(0.035,0.03,M(i?'#1f5fb4':'#2f9b55',{r:.4}),[x,0,0.11],16)));pod.add(B(0.3,0.1,0.004,M('#fbfbf8',{r:.6}),[0.1,0.03,0.103]));[0.55,0.72].forEach(x=>pod.add(B(0.1,0.1,0.006,M('#f6f6f2',{r:.5}),[x,0,0.104])));[-0.9,0.9].forEach(x=>R.add(B(0.05,0.76,0.05,M('#d9dad6',{r:.6}),[0.15+x,1.3,-0.48])));
  K.label('Service module',g,[PX,0.9,PZ]);K.label('Hot circuit',R,[0.55,Y+0.12,0.62]);K.label('Cold circuit',R,[1.05,Y+0.3,0.3]);K.label('Tubular heat exchanger',e,[0,0.24,0]);K.label('Thermocouple sockets',g,[px(350),py(470),PZ+0.03]);
  return {root:R,refs,update(){}};}}});
})();
