import sys,os,shutil;sys.path.insert(0,'.');sys.path.insert(0,'../guide')
import pages,spec,sprite
TPL=open('../site/guides.py').read().split("TPL='''")[1].split("'''")[0]
REPO='/home/claude/ice-lab/guides'
by={}
for g in spec.G:by.setdefault(g['file'],[]).append(g)
for f,gs in by.items():
    html=[]
    if len(gs)>1:
        html.append('<style>@media print{.gnav{display:none!important}}</style><div class="gnav" style="max-width:794px;margin:16px auto 0;display:flex;gap:10px;flex-wrap:wrap;font:600 15px Raleway,Arial,sans-serif">'+''.join(f'<a href="#{g["part"]}" style="color:#0039a6;border:1.5px solid #0039a6;border-radius:8px;padding:10px 14px;text-decoration:none;background:#fff">{g["name"].split(" · ")[-1].capitalize()}</a>' for g in gs)+'</div>')
    for g in gs:
        k=sprite.key(g);pages.CUR['img']=k;from PIL import Image;Image.open(f'out/{k}.png').convert('RGB').save(f'{REPO}/img/{k}.jpg',quality=84,optimize=True,progressive=True)
        ps=pages.build(g,None)
        html+= [f'<div class="sheet"{" id="+chr(34)+g["part"]+chr(34) if (i==0 and g.get("part")) else ""}>{p}</div>' for i,p in enumerate(ps)]
    out=TPL%dict(no=f,pages='\n'.join(html))
    open(f'{REPO}/{f}.html','w').write(out);print(f,len(gs))
