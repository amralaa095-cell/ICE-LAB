/* Small helpers shared by the device files. */
(function(){
const K={};window.LK=K;
K.tog=(id,label,group,on,off,extra)=>Object.assign({type:'toggle',label,group,on:on||'On',off:off||'Off',get:s=>!!s[id],set:(s,v)=>{s[id]=v;}},extra||{});
K.rng=(id,label,min,max,step,unit,dp,group,extra)=>Object.assign({type:'range',label,group,min,max,step,unit,dp,get:s=>s[id],set:(s,v)=>{s[id]=v;}},extra||{});
K.sel=(id,label,options,group,extra)=>Object.assign({type:'select',label,group,options,get:s=>s[id],set:(s,v)=>{s[id]=isNaN(+v)||v===''?v:+v;}},extra||{});
K.btn=(label,act,group,extra)=>Object.assign({type:'button',label,group,act},extra||{});
K.rd=(id,label,unit,dp,get,nz,extra)=>Object.assign({id,label,unit,dp,get,nz:nz||0},extra||{});
/* table column that copies an instrument reading or a machine setting into the row */
K.col=(k,label,unit,dp,from)=>({k,label,unit,dp,from});
K.calc=(k,label,unit,dp)=>({k,label,unit,dp});
K.g=9.81;
/* water properties used across the fluids and heat manuals */
K.rhoW=T=>(999.839+16.952*T-7.990e-3*T*T-46.241e-6*T*T*T+105.846e-9*T*T*T*T-280.54e-12*Math.pow(T,5))/(1+16.887e-3*T); /* TD360 Eq 1.7 */
K.cpW=T=>4185.5*(0.996185+0.0002874*Math.pow((T+100)/100,5.26)+0.011160*Math.pow(10,-0.036*T)); /* TD360 Eq 1.6, J/kg K */
K.muW=T=>2.414e-5*Math.pow(10,247.8/(T+273.15-140)); /* dynamic viscosity of water, Pa s (standard correlation) */
K.rnd=(a,b)=>a+Math.random()*(b-a);
})();
