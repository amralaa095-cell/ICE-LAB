import base64,io,json,os,sys
sys.path.insert(0,'../guide')
from qr import qr_img

FONT='<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&amp;family=Raleway:wght@400;500;600;700;800&amp;display=swap">'
def uri_svg(s): return 'data:image/svg+xml;base64,'+base64.b64encode(s.encode()).decode()
def uri_png(im):
    b=io.BytesIO(); im.save(b,'PNG',optimize=True); return 'data:image/png;base64,'+base64.b64encode(b.getvalue()).decode()
IDS={'M-01': 'd4b0f0b70c1c8adb7651ea00001e8993', 'M-02': 'ed3f7417cb267a364b13df852a502f28', 'M-03': 'db6f8b416652d2fbc4138739ed360702', 'M-04': '636b7845804a0dbfb2cbedecf4d446bc', 'M-05': 'c04dc8df17a8ae748ddcb98be4549fd0', 'M-06': 'a0ee26782f71b617cc272c50d78e2e39', 'M-07': '391f42e9ec0da485339ea22faed239d6', 'M-08': '693f6a97a33401e6366492361d26b15f', 'M-09': 'b6b03dbebc48b7362e156fb86fa25a15', 'M-10': '66dafaab5b4d981e842b3fc8e3c78c05', 'M-11': 'aea8c5bf7a2facf645b46c13cee52b38'}
CUR={}
def crop(no,sx,sy,sw,sh,dw,alt,extra=''):
    k=dw/sw; dh=round(sh*k,1)
    return f'<div style="width:{dw}px;height:{dh}px;overflow:hidden;position:relative;flex-shrink:0;{extra}"><img src="img/{CUR["img"]}.jpg" alt="{alt}" style="position:absolute;max-width:none;width:{3120*k:.1f}px;left:{-sx*k:.1f}px;top:{-sy*k:.1f}px"></div>'
def wrap(title,body):
    return f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>{title}</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
{FONT}
<style>body{{margin:0}}.warn li{{margin:0 0 5px}}</style>
</helmet>
<div style="width:794px;height:1123px;box-sizing:border-box;background:#fff;font-family:Raleway,Arial,sans-serif;color:#1b2433;display:flex;flex-direction:column;font-feature-settings:'lnum' 1,'tnum' 1;overflow:hidden">
{body}
</div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{{"$preview":{{"width":794,"height":1123}}}}'>
class Component extends DCLogic {{
renderVals() {{
return {{}};
}}
}}
</script>
</body>
</html>
'''
def img(m,key):
    if key=='ppe': return uri_svg(ppe3.ppe(**m['ppe']))
    return uri_svg(open(f"im/{m['fam']}_{key}.svg").read())
def card(m,i,key,t,d,w):
    j=i-1
    ring='#cc092f' if w else '#dfe3ea'
    flag='<span style="margin-left:auto;background:#cc092f;color:#fff;font-size:11px;font-weight:800;letter-spacing:.08em;padding:3px 7px;border-radius:3px">CHECK</span>' if w else ''
    return f'''<div style="border:1.5px solid {ring};border-radius:12px;overflow:hidden;display:flex;flex-direction:column;background:#fff">
  {crop(m['no'],(j%3)*1040,(j//3)*720,1040,720,286,f"Step {i}: {t}","margin:0 auto;")}
  <div style="padding:10px 16px 14px;border-top:1px solid #dfe3ea;flex-grow:1;display:flex;gap:12px">
    <span style="width:34px;height:34px;border-radius:50%;background:#0039a6;color:#fff;font-weight:800;font-size:18px;display:flex;align-items:center;justify-content:center;flex-shrink:0">{i}</span>
    <div style="flex-grow:1"><div style="display:flex;align-items:center;font-weight:800;font-size:17px;color:#1b2433">{t}{flag}</div>
    <div style="font-size:13.5px;line-height:1.4;color:#3d4757;margin-top:3px">{d}</div></div>
  </div></div>'''
def head2(m,title,kicker):
    return f'''<div style="padding:40px 48px 16px;display:flex;justify-content:space-between;align-items:flex-end;border-bottom:3px solid #0039a6">
    <div>
      <div style="font-size:13px;letter-spacing:.2em;font-weight:800;text-transform:uppercase;color:#cc092f">{kicker}</div>
      <div style="font-family:'Playfair Display',Georgia,serif;font-weight:800;font-size:36px;line-height:1.1;margin-top:6px;color:#0039a6">{title}</div>
    </div>
    <div style="font-size:12px;color:#5c6f7c;text-align:right;line-height:1.5">Circle = zoomed side view<br>Red border = stop and check</div>
  </div>'''
def foot(m,n): return f'<div id="foot" style="margin:auto 48px 40px;display:flex;justify-content:space-between;font-size:12px;color:#5c6f7c;border-top:1px solid #dfe3ea;padding-top:10px"><span>{m["no"]} · {m["name"]} · ICE Lab, AUBH</span><span>{n}</span></div>'
def build(m,out):
    url=f"https://amralaa095-cell.github.io/ICE-LAB/Manufacturing.dc.html#{m['no']}"
    leg=m['leg']
    half=(len(leg)+1)//2
    order=[]
    for i in range(half):
        order.append(i)
        if i+half<len(leg): order.append(i+half)
    def lg(i):
        a,_,b=leg[i].partition(' · ')
        return f'<div style="display:flex;gap:10px;align-items:center;font-size:14px;line-height:1.3"><span style="display:inline-flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:50%;background:#0039a6;color:#fff;font-weight:800;font-size:14px;flex-shrink:0">{i+1}</span><span><b>{a}</b>{" · "+b if b else ""}</span></div>'
    gl=''.join(f'<div style="font-size:13px;color:#5c6f7c">{a}</div><div style="font-size:15px;font-weight:700;margin-top:-4px">{b}</div>' for a,b in m['glance'])
    hh=385 if len(leg)<=8 else 356
    front=f'''  <div style="background:#0039a6;color:#fff;padding:40px 48px 30px;display:flex;justify-content:space-between;align-items:flex-start;gap:24px">
    <div>
      <div style="font-size:13px;letter-spacing:.22em;font-weight:700;text-transform:uppercase;opacity:.85">ICE Lab · AUBH · Manufacturing</div>
      <div style="font-family:'Playfair Display',Georgia,serif;font-weight:800;font-size:54px;line-height:1.05;margin-top:10px">Quick Start Guide</div>
      <div style="margin-top:14px;display:flex;align-items:center;gap:12px;flex-wrap:wrap">
        <span style="background:#cc092f;font-weight:800;font-size:18px;padding:5px 12px;border-radius:4px">{m['no']}</span>
        <span style="font-size:19px;font-weight:600">{m['name']}</span>
      </div>
      <div style="font-size:14px;font-weight:500;opacity:.85;margin-top:6px">{m['kind']}</div>
    </div>
    <div style="background:#fff;border-radius:10px;padding:10px;width:132px;flex-shrink:0;text-align:center">
      {crop(m['no'],1500,2160,540,540,112,"QR code to the "+m['no']+" machine page","margin:0 auto;")}
      <div style="color:#1b2433;font-size:11px;font-weight:700;line-height:1.25;margin-top:6px">Scan: machine page &amp; booking</div>
    </div>
  </div>
  <div style="padding:20px 48px 0">
    <div style="font-size:13px;letter-spacing:.18em;font-weight:800;text-transform:uppercase;color:#0039a6">Know your machine</div>
    {crop(m['no'],0,2160,1440,840,round(hh*1440/840),"Photo of the machine with numbered parts","margin:0 auto;")}
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:9px 28px;margin-top:6px">{''.join(lg(i) for i in order)}</div>
  </div>
  <div style="margin:18px 48px 0;display:flex;gap:20px">
    <div style="flex:1;border:2px solid #cc092f;border-radius:10px;padding:14px 20px">
      <div style="display:flex;align-items:center;gap:10px;color:#cc092f;font-weight:800;font-size:16px;letter-spacing:.06em;text-transform:uppercase">
        <span style="display:inline-flex;width:24px;height:24px;border-radius:50%;background:#cc092f;color:#fff;align-items:center;justify-content:center;font-size:16px">!</span>Safety first</div>
      <ul class="warn" style="margin:10px 0 0;padding-left:18px;font-size:13.5px;line-height:1.35;color:#3d4757">{''.join('<li>'+x.replace('<b>','<b style="color:#1b2433">')+'</li>' for x in m['safe'])}</ul>
    </div>
    <div style="width:250px;background:#f5f6f8;border-radius:10px;padding:14px 18px;display:flex;flex-direction:column;gap:6px">
      <div style="font-weight:800;font-size:16px;color:#0039a6;text-transform:uppercase;letter-spacing:.06em">At a glance</div>{gl}
    </div>
  </div>
  <div id="foot" style="margin-top:auto;background:#f5f6f8;border-top:3px solid #0039a6;padding:14px 48px 40px;display:flex;justify-content:space-between;font-size:12px;color:#5c6f7c">
    <span>9 steps inside →</span><span>amralaa095-cell.github.io/ICE-LAB</span>
  </div>'''
    st=m['steps']
    grid=lambda cs:f'<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;padding:18px 48px 16px">{cs}</div>'
    back=head2(m,m['titles'][0],f"{m['no']} · Steps 1–6")+grid(''.join(card(m,i,*s) for i,s in enumerate(st[:6],1)))+foot(m,2)
    tr=''.join(f'<div style="display:flex;gap:10px;padding:8px 0;border-bottom:1px solid #dfe3ea"><b style="width:150px;flex-shrink:0;font-size:13px">{a}</b><span style="font-size:13px;color:#3d4757">{b}</span></div>' for a,b in m['trouble'])
    tcard=f'<div style="border-radius:12px;background:#f5f6f8;padding:18px 20px"><div style="font-weight:800;font-size:16px;color:#0039a6;text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px">If something goes wrong</div>{tr}</div>'
    chk=''.join(f'<div style="display:flex;gap:10px;align-items:center;font-size:14px;padding:5px 0"><span style="width:16px;height:16px;border:2px solid #fff;border-radius:3px;flex-shrink:0"></span>{x}</div>' for x in m['leave'])
    leave=f'''<div style="margin:0 48px;background:#0039a6;color:#fff;border-radius:12px;padding:20px 24px;display:flex;gap:28px;align-items:center">
  <div style="flex-grow:1"><div style="font-family:'Playfair Display',Georgia,serif;font-weight:800;font-size:24px;margin-bottom:6px">Before you leave</div>{chk}</div>
  <div style="background:#fff;border-radius:10px;padding:10px;width:130px;text-align:center;flex-shrink:0">{crop(m['no'],1500,2160,540,540,110,"QR code to the "+m['no']+" machine page","margin:0 auto;")}<div style="color:#1b2433;font-size:11px;font-weight:700;margin-top:6px;line-height:1.25">Scan to book again</div></div>
</div>'''
    p3=head2(m,m['titles'][1],f"{m['no']} · Steps 7–9")+grid(''.join(card(m,i,*s) for i,s in enumerate(st[6:],7))+tcard)+leave+foot(m,3)
    return [front,back,p3]
