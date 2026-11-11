/* dc-lite: renders the ICE Lab site pages (Design Component markup) as plain web pages.
   Supports {{holes}}, <sc-if>, <sc-for>, on* handlers, <helmet>, and a React-like DCLogic class. */
(function(){
"use strict";
var TABLEISH=/<(\/?)(table|thead|tbody|tfoot|tr|td|th|caption|colgroup|select|option|optgroup)(?=[\s>\/])/gi;
function DCLogic(props){this.props=props||{};this.state={};}
DCLogic.prototype.setState=function(u,cb){var p=this.state;var n=typeof u==='function'?u(p,this.props):u;this.state=Object.assign({},p,n||{});this.__prev=this.__prev||p;schedule(this,cb);};
DCLogic.prototype.forceUpdate=function(cb){schedule(this,cb);};
window.DCLogic=DCLogic;
function schedule(c,cb){if(cb)(c.__cbs=c.__cbs||[]).push(cb);if(c.__q)return;c.__q=true;Promise.resolve().then(function(){c.__q=false;if(c.__render)c.__render();});}

function lookup(path,scope){path=path.trim();if(path==='true')return true;if(path==='false')return false;if(path==='null')return null;if(path==='undefined')return undefined;
  if(/^-?\d+(\.\d+)?$/.test(path))return parseFloat(path);var m=/^(['"])(.*)\1$/.exec(path);if(m)return m[2];
  var parts=path.split('.'),v;for(var i=scope.length-1;i>=0;i--){if(scope[i]!=null&&Object.prototype.hasOwnProperty.call(scope[i],parts[0])){v=scope[i][parts[0]];break;}}
  for(var j=1;j<parts.length&&v!=null;j++)v=v[parts[j]];return v;}
var HOLE=/\{\{([^}]*)\}\}/g,WHOLE=/^\s*\{\{([^}]*)\}\}\s*$/;
function interp(str,scope){return str.replace(HOLE,function(_,p){var v=lookup(p,scope);return v==null||v===false?'':String(v);});}
function realTag(n){var t=n.localName;return t.indexOf('dcx-')===0?t.slice(4):t;}

function render(tpl,scope,out){
  for(var c=tpl.firstChild;c;c=c.nextSibling){
    if(c.nodeType===3){out.push(document.createTextNode(c.nodeValue.indexOf('{{')<0?c.nodeValue:interp(c.nodeValue,scope)));continue;}
    if(c.nodeType!==1)continue;var tag=realTag(c);
    if(tag==='sc-if'){var a=c.getAttribute('value')||'',m=WHOLE.exec(a),v=m?lookup(m[1],scope):a;if(v)render(c,scope,out);continue;}
    if(tag==='sc-for'){var la=c.getAttribute('list')||'',mm=WHOLE.exec(la),list=mm?lookup(mm[1],scope):null,as=c.getAttribute('as')||'item';
      if(list&&list.length)for(var i=0;i<list.length;i++){var o={$index:i};o[as]=list[i];render(c,scope.concat([o]),out);}continue;}
    if(tag==='helmet'||tag==='script')continue;
    var el=c.namespaceURI&&c.namespaceURI!=='http://www.w3.org/1999/xhtml'?document.createElementNS(c.namespaceURI,c.localName):document.createElement(tag);
    el.__h={};el.__p={};
    for(var k=0;k<c.attributes.length;k++){var at=c.attributes[k],name=at.name,val=at.value;
      if(name.indexOf('hint-')===0)continue;
      var w=WHOLE.exec(val);
      if(/^on[a-z]/i.test(name)){var fn=w?lookup(w[1],scope):null;if(typeof fn==='function')el.__h[evName(name,c)]=fn;continue;}
      if(w){var raw=lookup(w[1],scope);
        if(name==='value'||name==='checked'||name==='selected'||name==='disabled'){el.__p[name]=raw;if(name!=='value'){if(raw)el.setAttribute(name,'');}else if(raw!=null)el.setAttribute('value',String(raw));continue;}
        if(raw==null||raw===false)continue;el.setAttribute(name,raw===true?'':String(raw));continue;}
      el.setAttribute(name,val.indexOf('{{')<0?val:interp(val,scope));}
    var kids=[];render(c,scope,kids);
    var host=tag==='template'?el.content:el;for(var q=0;q<kids.length;q++)host.appendChild(kids[q]);
    out.push(el);}
}
function evName(n,tplEl){var e=n.slice(2).toLowerCase();if(e==='change'){var t=realTag(tplEl),ty=(tplEl.getAttribute('type')||'').toLowerCase();if(t==='textarea'||(t==='input'&&!/^(checkbox|radio|file|range|color|date|time|datetime-local)$/.test(ty)))return 'input';}if(e==='doubleclick')return 'dblclick';return e;}
function bind(el){var h=el.__h||{};el.__dl=el.__dl||{};Object.keys(h).forEach(function(t){if(el.__dl[t])return;el.__dl[t]=true;el.addEventListener(t,function(e){var f=el.__h&&el.__h[t];if(f)f(e);});});}
function props(el){var p=el.__p||{};if('value' in p){var s=p.value==null?'':String(p.value);if(el.value!==s)el.value=s;}if('checked' in p)el.checked=!!p.checked;if('selected' in p)el.selected=!!p.selected;if('disabled' in p)el.disabled=!!p.disabled;}
function finalize(el){if(el.nodeType!==1)return;bind(el);props(el);for(var c=el.firstChild;c;c=c.nextSibling)finalize(c);}
function morph(old,nu){
  if(old.nodeType!==nu.nodeType||old.nodeName!==nu.nodeName){finalize(nu);old.parentNode.replaceChild(nu,old);return;}
  if(old.nodeType===3){if(old.nodeValue!==nu.nodeValue)old.nodeValue=nu.nodeValue;return;}
  var oa=old.attributes,na=nu.attributes,i;
  for(i=oa.length-1;i>=0;i--){if(!nu.hasAttribute(oa[i].name))old.removeAttribute(oa[i].name);}
  for(i=0;i<na.length;i++){if(old.getAttribute(na[i].name)!==na[i].value)old.setAttribute(na[i].name,na[i].value);}
  old.__h=nu.__h;old.__p=nu.__p;bind(old);props(old);
  morphKids(old,nu);}
function morphKids(old,nu){var a=Array.prototype.slice.call(old.childNodes),b=Array.prototype.slice.call(nu.childNodes),i;
  for(i=0;i<b.length;i++){if(i<a.length)morph(a[i],b[i]);else{finalize(b[i]);old.appendChild(b[i]);}}
  for(i=b.length;i<a.length;i++)old.removeChild(a[i]);}

function boot(){
  var src=document.querySelector('script[type="text/x-dc-tpl"]');if(!src)return;
  var t=document.createElement('template');t.innerHTML=src.textContent.replace(TABLEISH,'<$1dcx-$2');
  var tpl=t.content;
  Array.prototype.slice.call(tpl.querySelectorAll('helmet')).forEach(function(h){while(h.firstChild){var n=h.firstChild;h.removeChild(n);if(n.nodeType===1)document.head.appendChild(n.localName==='style'||n.localName==='link'?n:n);}h.parentNode.removeChild(h);});
  var sc=document.querySelector('script[data-dc-script]'),Comp=DCLogic,defaults={};
  if(sc){try{var dp=JSON.parse(sc.getAttribute('data-props')||'{}');Object.keys(dp).forEach(function(k){if(k[0]!=='$'&&dp[k]&&'default' in dp[k])defaults[k]=dp[k].default;});}catch(e){}
    try{Comp=(new Function('DCLogic',sc.textContent+'\n;return typeof Component!=="undefined"?Component:DCLogic;'))(DCLogic);}catch(e){console.error('[dc-lite] logic error',e);}}
  var root=document.getElementById('dc-root');var inst=new Comp(Object.assign({},defaults));inst.props=inst.props||defaults;if(!inst.state)inst.state={};
  var first=true;
  inst.__render=function(){var vals={};try{vals=inst.renderVals?inst.renderVals()||{}:{};}catch(e){console.error('[dc-lite] renderVals',e);}
    var out=[];render(tpl,[vals],out);var box=document.createElement('div');out.forEach(function(n){box.appendChild(n);});
    if(first){out.forEach(finalize);while(box.firstChild)root.appendChild(box.firstChild);}else morphKids(root,box);
    var prev=inst.__prev;inst.__prev=null;
    if(first){first=false;if(inst.componentDidMount)inst.componentDidMount();}else if(inst.componentDidUpdate)inst.componentDidUpdate(inst.props,prev||inst.state);
    var cbs=inst.__cbs;inst.__cbs=null;if(cbs)cbs.forEach(function(f){f();});
    if(location.hash&&!root.__scrolled){root.__scrolled=true;var tg=document.getElementById(location.hash.slice(1));if(tg)tg.scrollIntoView();}};
  inst.__render();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
