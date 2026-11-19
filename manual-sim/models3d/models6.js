/* ---- 34. H8 Impact of a jet on the hydraulic bench · 33. H314B Hare's tube ---- */
(function(){const PI=Math.PI;
NEW3D.push({id:'h8',name:'Impact of a Jet (H8)',photo:34,s:{},view3d:{h:560,cam:{tgt:[0,1.15,0],yaw:0.5,pitch:0.15,dist:2.4},shadow:{c:[0,0.9,0],r:1.6},build(K,s){const refs={};const k=kit4(K),{M,B,Cy,Cz,Cx,RB}=k,R=K.group();k.floor(R);
  const body=M('#4d5359',{m:.15,r:.45}),top=M('#e3e1da',{r:.55}),steel=M('#c9cdd2',{m:.9,r:.35}),clear=M('#dcebf2',{a:.2,r:.04}),blk=M('#1d1f22',{r:.45}),red=M('#c0221b',{r:.4});
  /* hydraulic bench */R.add(B(1.25,0.87,0.62,body,[0,0.435,0]));R.add(B(1.27,0.05,0.64,top,[0,0.895,0]));R.add(B(0.45,0.05,0.3,M('#c9c7bf',{r:.5}),[-0.32,0.93,0]));
  R.add(B(0.36,0.18,0.004,M('#f2f2ee'),[0.1,0.74,0.312]));R.add(Cz(0.02,0.02,M('#2fae3b',{r:.4}),[0.0,0.7,0.32],18));R.add(K.node(K.torus(0.05,0.008,24,8),red,{r:[PI/2,0,0],p:[0.45,0.7,0.33]}));
  K.label('Hydraulic bench',R,[0.2,0.55,0.34]);
  /* H8: clear cylinder on a base, nozzle, vane, lid with weigh beam */const g=K.group({p:[-0.3,0.95,0]});R.add(g);refs.g=g;
  g.add(Cy(0.17,0.03,blk,[0,0.015,0],32));g.add(Cy(0.15,0.42,clear,[0,0.24,0],32));g.add(Cy(0.17,0.025,blk,[0,0.46,0],32));
  g.add(Cy(0.012,0.2,steel,[0,0.13,0],14));g.add(Cy(0.008,0.02,steel,[0,0.24,0],12));
  const jet=Cy(0.005,0.035,M('#7fb6e6',{a:.75}),[0,0.2675,0],10);g.add(jet);refs.jet=jet;jet.vis=false;
  /* beam on the lid: pivot at one side, vane rod down to the vane */const beam=K.group({p:[-0.15,0.49,0]});g.add(beam);refs.beam=beam;
  beam.add(B(0.4,0.012,0.02,steel,[0.2,0,0]));beam.add(Cy(0.004,0.18,steel,[0.15,-0.1,0],8));beam.add(Cy(0.03,0.008,M('#e9ebe8',{m:.6}),[0.15,-0.19,0],24));
  const jk=B(0.03,0.03,0.04,M('#8f959b',{m:.8}),[0.17,0.02,0]);beam.add(jk);jk.p0=0.17;refs.jockey=jk;
  g.add(B(0.02,0.05,0.04,blk,[-0.15,0.49,0]));g.add(B(0.004,0.06,0.03,M('#f6f6f2'),[0.26,0.5,0.02]));g.add(Cy(0.004,0.06,steel,[0.22,0.52,0],8));
  K.label('Vane',g,[0.08,0.32,0.12]);K.label('Jockey weight on the weigh beam',g,[0.0,0.6,0.05]);K.label('10 mm nozzle',g,[0.1,0.2,0.12]);
  return {root:R,refs,update(){}};}}});

NEW3D.push({id:'h314b',name:'Hare’s Tube (H314B)',photo:33,s:{},view3d:{h:560,cam:{tgt:[0,0.6,0],yaw:0.25,pitch:0.1,dist:1.7},shadow:{c:[0,0.4,0],r:1.0},build(K,s){const refs={};const k=kit4(K),{M,B,Cy,Cz,Cx,RB}=k,R=K.group();k.floor(R);
  const wh=M('#efefec',{r:.6}),clear=M('#dcebf2',{a:.22,r:.04}),steel=M('#c9cdd2',{m:.9,r:.35}),blk=M('#1d1f22',{r:.45});
  R.add(B(0.6,0.03,0.3,M('#3a3d42',{r:.5}),[0,0.015,0]));R.add(B(0.5,0.9,0.02,wh,[0,0.48,-0.08]));
  const X=[-0.1,0.1];X.forEach((x,i)=>{R.add(Cy(0.008,0.62,clear,[x,0.5,-0.04],12));R.add(B(0.018,0.5,0.003,steel,[x+0.022,0.48,-0.065]));
    /* beaker and liquid */R.add(Cy(0.04,0.1,clear,[x,0.08,-0.04],24));const lq=Cy(0.037,0.06,M(i?'#c9a43a':'#5b9bd5',{a:.65}),[x,0.06,-0.04],24);R.add(lq);
    const col=Cy(0.0065,1,M(i?'#c9a43a':'#5b9bd5',{a:.8}),[x,0.1,-0.04],10);col.s=[1,0.01,1];R.add(col);refs['c'+i]=col;});
  R.add(K.node(K.tube([[-0.1,0.81,-0.04],[-0.1,0.86,-0.04],[0,0.88,-0.04],[0.1,0.86,-0.04],[0.1,0.81,-0.04]],0.005,8,0.03),blk,{}));
  R.add(Cy(0.015,0.16,clear,[0,0.97,-0.04],16));const pl=Cy(0.004,0.12,steel,[0,1.09,-0.04],8);R.add(pl);refs.pl=pl;R.add(B(0.02,0.012,0.012,M('#c0221b'),[0,0.86,-0.02]));
  K.label('Syringe',R,[0.08,1.02,-0.02]);K.label('Water',R,[-0.1,0.16,0.05]);K.label('Test liquid',R,[0.1,0.16,0.05]);K.label('Tube clip',R,[0.06,0.86,0.0]);
  return {root:R,refs,update(){}};}}});
})();
