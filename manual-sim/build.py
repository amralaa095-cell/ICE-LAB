"""Puts the lab-manual simulation system into bench.html.
Usage (from the repository folder): python3 manual-sim/build.py
It removes any earlier copy (between the lab-css / lab-js tags) and inserts the current files."""
import os,re
here=os.path.dirname(os.path.abspath(__file__));root=os.path.dirname(here)
p=os.path.join(root,'bench.html');src=open(p,encoding='utf-8').read()
src=re.sub(r'<style id="lab-css">.*?</style>\n','',src,flags=re.S);src=re.sub(r'<script id="lab-js">.*?</script>\n','',src,flags=re.S)
css=open(os.path.join(here,'lab_site.css'),encoding='utf-8').read()
js=''.join(open(os.path.join(here,f),encoding='utf-8').read()+'\n' for f in ['kit.js','engine.js','dev_h52.js','dev_fluids.js','dev_thermo.js','dev_materials.js','dev_plc.js','bench_bridge.js'])
src=src.replace('</head>','<style id="lab-css">\n'+css+'\n</style>\n</head>',1)
i=src.rindex('</body>');src=src[:i]+'<script id="lab-js">\n'+js+'</script>\n'+src[i:]
open(p,'w',encoding='utf-8').write(src);print('bench.html updated',len(src))
