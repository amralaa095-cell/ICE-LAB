import sys
sys.path.insert(0,'.')
from PIL import Image
import spec
OLD='/home/claude/ice-lab/guides/img/'
def key(g):return g['file']+('-'+g['part'] if g.get('part') else '')
def build(g):
    sp=Image.new('RGB',(3120,3000),'white');old=Image.open(OLD+g['no']+'.png').convert('RGB')
    for j,s in enumerate(g['steps']):
        im=old.crop((0,0,1040,720)) if s[0]=='ppe' else s[0]()
        sp.paste(im,((j%3)*1040,(j//3)*720))
    sp.paste(g['hero'](),(0,2160));sp.paste(old.crop((1500,2160,2040,2700)),(1500,2160))
    return sp
if __name__=='__main__':
    for g in spec.G:
        if len(sys.argv)>1 and key(g) not in sys.argv[1:]:continue
        sp=build(g);sp.save(f'out/{key(g)}.png',optimize=True);sp.resize((1560,1500)).save(f'out/prev_{key(g)}.jpg',quality=75);print(key(g))
