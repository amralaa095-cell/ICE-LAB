/* ICE Lab booking: collects the form, stores the request on this device, sends it */
window.ICEBOOK=(function(){
const C=window.ICE_CONFIG||{};const KEY='icelab.requests';
const esc=t=>String(t==null?'':t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function all(){try{return JSON.parse(localStorage.getItem(KEY)||'[]');}catch(e){return [];}}
function save(L){try{localStorage.setItem(KEY,JSON.stringify(L));}catch(e){}}
function put(r){const L=all().filter(x=>x.ref!==r.ref);L.unshift(r);save(L);try{sessionStorage.setItem('icelab.last',JSON.stringify(r));}catch(e){}}
function get(ref){const r=all().find(x=>x.ref===ref);if(r)return r;try{const s=JSON.parse(sessionStorage.getItem('icelab.last')||'null');return s&&s.ref===ref?s:null;}catch(e){return null;}}
function remove(ref){save(all().filter(x=>x.ref!==ref));}
function newRef(){const d=new Date(),p=n=>String(n).padStart(2,'0');return 'ICE-'+d.getFullYear()+p(d.getMonth()+1)+p(d.getDate())+'-'+Math.random().toString(36).slice(2,6).toUpperCase();}
const FIELDS=[['Reference','ref'],['Lab','lab'],['Request','type'],['Equipment or room','item'],['When','when'],['Attendees','att'],['Name','name'],['Role','role'],['ID','sid'],['Email','email'],['Department','dept'],['Course or project','course'],['Description','desc'],['Supervisor','sup'],['Supervisor email','supEmail'],['PPE','ppe']];
function text(r){return FIELDS.filter(([,k])=>r[k]).map(([l,k])=>l+': '+r[k]).join('\n');}
function dl(r){return '<dl>'+FIELDS.filter(([,k])=>r[k]&&k!=='ref').map(([l,k])=>`<dt>${esc(l)}</dt><dd>${esc(r[k])}</dd>`).join('')+'</dl>';}
function mailto(r){const to=C.labEmail||'';const cc=r.supEmail?'&cc='+encodeURIComponent(r.supEmail):'';return 'mailto:'+encodeURIComponent(to).replace(/%40/g,'@')+'?subject='+encodeURIComponent('Lab request '+r.ref+' · '+r.item)+cc+'&body='+encodeURIComponent('Hello,\n\nPlease review this lab request.\n\n'+text(r)+'\n\nThank you.');}
async function send(r){if(C.endpoint){try{await fetch(C.endpoint,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(r)});r.status='sent';}catch(e){r.status='email-draft';}}else r.status='email-draft';put(r);return r;}
return {all,get,put,remove,newRef,text,dl,mailto,send,esc,config:C};})();
