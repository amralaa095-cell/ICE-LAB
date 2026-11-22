# Photo-based illustrations for the UNIMAT quick start guides (same sprite layout as the first guides)
import math
from PIL import Image,ImageDraw,ImageFont,ImageOps,ImageEnhance,ImageFilter
H='/tmp/claude-0/-home-claude/54302e07-0159-5096-9e40-53f8cb32bcce/scratchpad/qs2/'
B=(0,57,166);R=(204,9,47);W=(255,255,255);K=(27,36,51)
FB='/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf'
SS=2
_ph={}
def photo(n):
    if n not in _ph:
        im=Image.open(H+f'ph/p{n}.png').convert('RGB')
        im=ImageOps.autocontrast(im,cutoff=0.5);im=ImageEnhance.Brightness(im).enhance(1.06);im=ImageEnhance.Sharpness(im).enhance(1.2)
        _ph[n]=im
    return _ph[n]
def font(s):return ImageFont.truetype(FB,s*SS)
class Canvas:
    def __init__(s,n,x0,y0,w,ow,oh):
        s.ow,s.oh=ow,oh;s.k=ow/w;h=w*oh/ow;s.x0,s.y0=x0,y0;s.n=n
        src=photo(n).crop((int(x0),int(y0),int(x0+w),int(y0+h)))
        s.im=src.resize((ow*SS,oh*SS),Image.LANCZOS);s.d=ImageDraw.Draw(s.im)
    def P(s,x,y):return ((x-s.x0)*s.k*SS,(y-s.y0)*s.k*SS)
    def ring(s,x,y,r=40,c=B):
        X,Y=s.P(x,y);r*=SS;s.d.ellipse([X-r,Y-r,X+r,Y+r],outline=W,width=10*SS);s.d.ellipse([X-r,Y-r,X+r,Y+r],outline=c,width=6*SS)
    def arrow(s,x1,y1,x2,y2,c=B,w=9):
        A=s.P(x1,y1);Bp=s.P(x2,y2);a=math.atan2(Bp[1]-A[1],Bp[0]-A[0]);L=30*SS
        e=(Bp[0]-L*0.6*math.cos(a),Bp[1]-L*0.6*math.sin(a))
        for col,ww in ((W,w+6),(c,w)):
            s.d.line([A,e],fill=col,width=ww*SS)
            p1=(Bp[0]-L*math.cos(a-0.5),Bp[1]-L*math.sin(a-0.5));p2=(Bp[0]-L*math.cos(a+0.5),Bp[1]-L*math.sin(a+0.5))
            if col==W:
                q=lambda p:(p[0]+(p[0]-Bp[0])*0.12,p[1]+(p[1]-Bp[1])*0.12)
                s.d.polygon([(Bp[0]+5*SS*math.cos(a),Bp[1]+5*SS*math.sin(a)),q(p1),q(p2)],fill=W)
            else:s.d.polygon([Bp,p1,p2],fill=c)
    def curl(s,x,y,r=60,c=B):
        X,Y=s.P(x,y);r*=SS
        for col,ww in ((W,15),(c,9)):s.d.arc([X-r,Y-r,X+r,Y+r],start=-150,end=150,fill=col,width=ww*SS)
        a=math.radians(150);e=(X+r*math.cos(a),Y+r*math.sin(a));t=a+math.pi/2;L=26*SS
        s.d.polygon([(e[0]+L*math.cos(t),e[1]+L*math.sin(t)),(e[0]+13*SS*math.cos(t+1.57),e[1]+13*SS*math.sin(t+1.57)),(e[0]+13*SS*math.cos(t-1.57),e[1]+13*SS*math.sin(t-1.57))],fill=c)
    def cross(s,x,y,r=40):
        X,Y=s.P(x,y);r*=SS
        for col,ww in ((W,22),(R,14)):s.d.line([X-r,Y-r,X+r,Y+r],fill=col,width=ww*SS);s.d.line([X-r,Y+r,X+r,Y-r],fill=col,width=ww*SS)
    def pill(s,X,Y,txt,c=B,size=40,anchor='mm'):
        f=font(size);X*=SS;Y*=SS;b=s.d.textbbox((X,Y),txt,font=f,anchor=anchor);pad=12*SS
        s.d.rounded_rectangle([b[0]-pad,b[1]-pad*0.7,b[2]+pad,b[3]+pad*0.7],radius=14*SS,fill=c);s.d.text((X,Y),txt,font=f,fill=W,anchor=anchor)
    def zoom(s,x,y,sr,u,v,R_=170,label=None,n=None):
        """circular inset: photo region of radius sr around (x,y) shown at output (u,v) radius R_"""
        n=n or s.n;src=photo(n);R2=R_*SS
        reg=src.crop((int(x-sr),int(y-sr),int(x+sr),int(y+sr))).resize((2*R2,2*R2),Image.LANCZOS)
        m=Image.new('L',(2*R2,2*R2),0);ImageDraw.Draw(m).ellipse([0,0,2*R2-1,2*R2-1],fill=255)
        X,Y=s.P(x,y) if n==s.n else (None,None);U,V=u*SS,v*SS
        if X is not None:
            # dashed connectors from the small ring on the machine to the big circle
            rr=26*SS
            for sgn in (-1,1):
                ang=math.atan2(V-Y,U-X)+sgn*math.pi/2
                a=(X+rr*math.cos(ang),Y+rr*math.sin(ang));b=(U+R2*math.cos(ang),V+R2*math.sin(ang))
                L=math.dist(a,b);nseg=int(L/(14*SS))
                for i in range(0,nseg,2):
                    t0,t1=i/nseg,min(1,(i+1)/nseg);s.d.line([(a[0]+(b[0]-a[0])*t0,a[1]+(b[1]-a[1])*t0),(a[0]+(b[0]-a[0])*t1,a[1]+(b[1]-a[1])*t1)],fill=B,width=4*SS)
            s.d.ellipse([X-rr,Y-rr,X+rr,Y+rr],outline=W,width=9*SS);s.d.ellipse([X-rr,Y-rr,X+rr,Y+rr],outline=B,width=5*SS)
        s.im.paste(reg,(int(U-R2),int(V-R2)),m)
        s.d.ellipse([U-R2,V-R2,U+R2,V+R2],outline=W,width=12*SS);s.d.ellipse([U-R2,V-R2,U+R2,V+R2],outline=B,width=7*SS)
        if label:s.pill(min(max(u,0)+0,1040),v+R_+4,label,size=36)
        return (u,v,R_)
    def zp(s,zc,x,y,sx,sy,sr):
        """map a photo point inside a zoom to output coords: zc=(u,v,R), zoom centre (sx,sy) radius sr"""
        u,v,R_=zc;return (u+(x-sx)/sr*R_,v+(y-sy)/sr*R_)
    def out(s):return s.im.resize((s.ow,s.oh),Image.LANCZOS)
def hero(n,x0,y0,w,pts):
    c=Canvas(n,x0,y0,w,1440,840)
    for i,(x,y,dx,dy) in enumerate(pts,1):
        X,Y=c.P(x,y);U,V=X+dx*SS,Y+dy*SS
        c.d.line([(X,Y),(U,V)],fill=W,width=9*SS);c.d.line([(X,Y),(U,V)],fill=B,width=5*SS)
        c.d.ellipse([X-9*SS,Y-9*SS,X+9*SS,Y+9*SS],fill=B,outline=W,width=3*SS)
        r=26*SS;c.d.ellipse([U-r,V-r,U+r,V+r],fill=B,outline=W,width=5*SS);c.d.text((U,V),str(i),font=font(30),fill=W,anchor='mm')
    return c.out()
