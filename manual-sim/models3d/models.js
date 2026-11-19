/* New 3D models for the ICE Lab benches, built on the site's own G3 engine. Units: metres. */
const NEW3D=[];
(function(){
const PI=Math.PI;
/* ---- shared helpers ---- */
function kit(K){
  const M=K.mat;
  const B=(w,h,d,m,p,o)=>K.node(K.box(w,h,d),m,Object.assign({p},o||{}));
  const Cy=(r,h,m,p,o,seg)=>K.node(K.cyl(r,r,h,seg||24),m,Object.assign({p},o||{}));
  const Cz=(r,h,m,p,seg)=>Cy(r,h,m,p,{r:[PI/2,0,0]},seg);      /* axis along z */
  const Cx=(r,h,m,p,seg)=>Cy(r,h,m,p,{r:[0,0,PI/2]},seg);      /* axis along x */
  /* rounded box: rounded on the 4 edges that run along x */
  const rprof=(d,h,rad,n)=>{const P=[];n=n||5;[[1,1],[-1,1],[-1,-1],[1,-1]].forEach(([sz,sy],q)=>{for(let i=0;i<=n;i++){const a=q*PI/2+i/n*PI/2;P.push([sz*(d/2-rad)+rad*Math.cos(a),sy*(h/2-rad)+rad*Math.sin(a)]);}});return P;};
  const RB=(w,h,d,rad,m,p,o)=>K.node(K.prismX(rprof(d,h,rad),-w/2,w/2),m,Object.assign({p},o||{}));
  /* square loft along x: sections [x,w,h,yc] */
  const loft=(S)=>{const g={p:[],n:[],u:[],i:[]};const quad=(a,b,c,d)=>{const u=[b[0]-a[0],b[1]-a[1],b[2]-a[2]],v=[d[0]-a[0],d[1]-a[1],d[2]-a[2]];let n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];const l=Math.hypot(...n)||1;n=n.map(x=>x/l);const k=g.p.length/3;[a,b,c,d].forEach((q,j)=>{g.p.push(...q);g.n.push(...n);g.u.push(j%3?1:0,j>1?1:0);});g.i.push(k,k+1,k+2,k,k+2,k+3);};
    const ring=([x,w,h,yc])=>{yc=yc||0;return [[x,yc-h/2,w/2],[x,yc+h/2,w/2],[x,yc+h/2,-w/2],[x,yc-h/2,-w/2]];};
    for(let s=0;s<S.length-1;s++){const A=ring(S[s]),C=ring(S[s+1]);for(let k=0;k<4;k++){const k2=(k+1)%4;quad(A[k],C[k],C[k2],A[k2]);}}return g;};
  const floor=(R,c)=>{if(!window.G3_STUDIO)R.add(K.node(K.plane(8,8),M(c||'#e9eae6',{r:.9}),{r:[-PI/2,0,0]}));};
  /* lab bench: dark worktop on white cabinet with wood drawers, as in the ICE Lab */
  const bench=(R,w,d,h,x,z)=>{const g=K.group({p:[x||0,0,z||0]});R.add(g);g.add(RB(w,0.04,d,0.012,M('#2b2d31',{r:.25,m:.1}),[0,h-0.02,0]));g.add(B(w-0.06,h-0.14,d-0.08,M('#eceeed',{r:.7}),[0,(h-0.14)/2+0.1,0]));g.add(B(w-0.1,0.1,d-0.14,M('#3a3d42',{r:.6}),[0,0.05,0]));
    const n=Math.max(2,Math.round(w/0.62));for(let i=0;i<n;i++){const dw=(w-0.12)/n,xx=-w/2+0.06+dw*(i+0.5);g.add(B(dw-0.02,h-0.32,0.012,M('#7d6a58',{r:.6}),[xx,(h-0.14)/2+0.1,d/2-0.036]));g.add(B(0.12,0.02,0.012,M('#2b2d31',{r:.4}),[xx,h-0.2,d/2-0.028]));}return g;};
  return {M,B,Cy,Cz,Cx,RB,loft,floor,bench,PI};
}

window.kit3=kit;
/* =================== 1. Universal testing machine (twin column) =================== */
NEW3D.push({id:'utm',name:'Universal Testing Machine',photo:8,s:{},view3d:{h:560,cam:{tgt:[0,1.3,0],yaw:0.42,pitch:0.1,dist:3.3},shadow:{c:[0,1,0],r:2.4},
 build(K,s){const refs={};const {M,B,Cy,Cz,Cx,RB,floor}=kit(K),R=K.group();floor(R);
  const body=M('#2c2e32',{r:.42,m:.25}),body2=M('#1f2124',{r:.5,m:.2}),steel=M('#b9bdc2',{m:1,r:.28}),dsteel=M('#6f757c',{m:1,r:.35}),rub=M('#151617',{r:.8}),red=M('#b3261e',{r:.45});
  /* plinth the frame stands on */R.add(RB(1.05,0.42,0.8,0.02,M('#d9dcdc',{r:.6}),[0,0.21,0]));
  const Y0=0.42,g=K.group({p:[0,Y0,0]});R.add(g);
  /* base: rounded casing, red waist line, feet */
  [[-0.3,0.22],[0.3,0.22],[-0.3,-0.22],[0.3,-0.22]].forEach(([x,z])=>g.add(Cy(0.035,0.03,rub,[x,0.015,z])));
  g.add(RB(0.86,0.03,0.62,0.012,red,[0,0.045,0]));g.add(RB(0.84,0.2,0.6,0.05,body,[0,0.16,0]));g.add(RB(0.78,0.02,0.54,0.008,body2,[0,0.265,0]));
  /* T-slot table */g.add(B(0.4,0.012,0.34,dsteel,[0,0.281,0.02]));[-0.1,0,0.1].forEach(x=>g.add(B(0.012,0.004,0.34,body2,[x,0.288,0.02])));
  /* columns with ribbed way covers on the inside faces */
  const H=1.62;[-1,1].forEach(sx=>{g.add(RB(0.13,H,0.2,0.03,body,[sx*0.335,0.27+H/2,-0.02],{r:[0,PI/2,0]}));
    for(let i=0;i<46;i++)g.add(B(0.022,0.022,0.11,i%2?body2:M('#34373b',{r:.6}),[sx*0.262,0.33+i*0.033,-0.02]));
    g.add(B(0.012,H-0.16,0.03,dsteel,[sx*0.3,0.3+H/2,0.085]));/* limit-stop rail */[0.62,1.28].forEach(y=>g.add(B(0.03,0.035,0.045,M('#d9a514',{r:.5}),[sx*0.3,y,0.1])));});
  /* top beam */g.add(RB(0.82,0.13,0.24,0.03,body,[0,0.27+H+0.045,-0.02]));g.add(B(0.3,0.012,0.16,body2,[0,0.27+H+0.115,-0.02]));
  /* moving crosshead */const xh=K.group({p:[0,1.2,-0.02]});g.add(xh);xh.add(RB(0.52,0.12,0.2,0.02,body,[0,0,0]));xh.add(B(0.16,0.035,0.012,M('#d7dadd',{r:.5}),[0,0.01,0.102]));xh.add(B(0.05,0.012,0.002,red,[0,0.01,0.109]));
  /* load cell + coupling */xh.add(Cy(0.055,0.06,steel,[0,-0.09,0.02]));xh.add(Cy(0.022,0.05,dsteel,[0,-0.145,0.02]));
  /* wedge grips */const grip=(y,flip)=>{const q=K.group({p:[0,y,0],r:[flip?PI:0,0,0]});q.add(K.node(K.prismX([[0.055,0.07],[-0.055,0.07],[-0.04,-0.07],[0.04,-0.07]],-0.075,0.075),steel,{}));q.add(B(0.152,0.03,0.115,dsteel,[0,0.085,0]));
     [-1,1].forEach(k=>q.add(K.node(K.prismX([[0.057,0.05],[0.02,0.05],[0.008,-0.068],[0.045,-0.068]],-0.03,0.03),M('#8f959b',{m:1,r:.5}),{s:[1,1,k]})));q.add(Cz(0.012,0.05,rub,[0.09,0.085,0]));q.add(Cx(0.008,0.09,dsteel,[0.12,0.085,0]));return q;};
  refs.hs=null;const up=grip(-0.26);up.p[2]=0.02;xh.add(up);const lo=grip(0.0,true);lo.p=[0,0.46,0];g.add(lo);g.add(Cy(0.03,0.1,dsteel,[0,0.335,0]));
  /* dog-bone specimen */refs.spec=B(0.02,0.36,0.004,M('#c9cdd2',{m:1,r:.25}),[0,0.7,0]);g.add(refs.spec);refs.xh=xh;refs.g=g;
  /* handset on its bracket with coiled cable */const hs=K.group({p:[0.47,1.18,0.1],r:[0.25,-0.4,0]});g.add(hs);hs.add(RB(0.085,0.2,0.04,0.014,M('#3a3d42',{r:.5}),[0,0,0],{r:[0,PI/2,0]}));hs.add(B(0.05,0.035,0.004,M('#9fd6a8',{e:'#1d3b22',r:.3}),[0,0.05,0.022]));[[-0.014,0],[0.014,0],[-0.014,-0.03],[0.014,-0.03],[0,-0.06]].forEach(([x,y])=>hs.add(Cz(0.008,0.006,M('#d7dadd',{r:.5}),[x,y,0.022],12)));
  g.add(B(0.07,0.02,0.04,body2,[0.42,1.1,0.06]));refs.hs=hs;
  const coil=[];for(let i=0;i<=90;i++){const t=i/90;coil.push([0.47+0.012*Math.cos(i*0.9),1.07-t*0.7,0.1+0.012*Math.sin(i*0.9)]);}g.add(K.node(K.tube(coil,0.004,6,0.001),rub,{}));
  /* E-stop */g.add(RB(0.07,0.05,0.07,0.01,M('#e2b21c',{r:.5}),[0.33,0.3,0.22]));g.add(Cy(0.022,0.02,M('#c0221b',{r:.4}),[0.33,0.335,0.22]));
  /* status lights */[['#3fae5a',0],['#d9a514',0.03],['#d7dadd',0.06]].forEach(([c,o])=>g.add(Cz(0.007,0.004,M(c,{e:c}),[-0.335,0.46+o,0.082],10)));
  K.label('Load cell',xh,[0,-0.09,0.1]);K.label('Wedge grips',g,[0.12,0.5,0.1]);K.label('Moving crosshead',xh,[-0.2,0.08,0.12]);K.label('Handset',hs,[0,0.14,0]);
  return {root:R,refs,update(){}};}}});
})();
