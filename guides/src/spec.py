from art import Canvas,hero
OW,OH=1040,720
def C(n,x0,y0,w):return Canvas(n,x0,y0,w,OW,OH)
def st(f):return f
G=[]
# ---------------- M-01 Technics: wood lathe (photo 3) ----------------
def w2():c=C(3,250,0,1300);c.zoom(630,70,110,840,330,190,'mark both centres');return c.out()
def w3():c=C(3,600,300,1200);c.arrow(1420,560,1330,560);c.zoom(1090,545,260,830,190,170,'points in the marks');return c.out()
def w4():c=C(3,650,380,1100);c.ring(1080,645,55);c.zoom(1080,600,150,850,200,170,'close · centre height');c.ring(1068,815,35);c.pill(330,660,'tighten the clamp');return c.out()
def w5():c=C(3,650,350,1000);c.curl(1080,548,70);c.ring(1080,640,40);c.pill(560,90,'one turn by hand: nothing touches');return c.out()
def w6():c=C(3,450,200,1598);c.zoom(1985,500,90,830,520,160,'start slow');c.zoom(845,420,70,230,520,160,'I · switch on');return c.out()
def w7():c=C(3,650,380,1050);c.arrow(860,615,1320,615);c.pill(540,620,'tool on the rest · cut just below centre');return c.out()
def w8():c=C(3,450,200,1300);c.zoom(845,420,70,820,300,170,'O · wait for a full stop');return c.out()
def w9():c=C(3,150,60,1898);c.cross(1990,480,45);c.pill(520,660,'unplug · brush the shavings away');return c.out()
G.append(dict(no='M-01',file='M-01',part='wood',name='UNIMAT ML Technics · wood lathe',kind='Wood turning between centres',
 hero=lambda:hero(3,148,60,1900,[(560,330,-70,-70),(845,420,70,-90),(872,545,-60,90),(1085,640,60,110),(1068,815,-90,40),(1700,850,40,110),(1300,545,40,-110),(1775,560,70,-90),(1985,500,-60,-120)]),
 leg=['Motor · 12 V DC','ON / OFF switch','Drive centre · on the headstock','Tool rest (T-rest)','Tool rest clamp screw','Carriage handwheel · slides the rest','Tailstock centre','Tailstock handwheel · advances the centre','Speed knob · variable power adapter'],
 safe=['<b>Adjust the tool rest only with the machine stopped.</b>','No gloves, loose sleeves, jewellery or open long hair.','Keep the rest close to the blank; never reach over the spinning blank.','Stand to the side, not in line with the blank.','First time? Book an induction with a technician.'],
 glance=[('Material','Soft wood blanks, no cracks or knots'),('Speed','Low to rough, higher to finish'),('Tool','Turning chisel on the T-rest')],
 titles=['Set up the wood lathe','Turn, stop, finish'],
 steps=[('ppe','Gear up','Glasses on, hair tied, sleeves up, closed shoes. Take off gloves, rings and watch.',''),
  (w2,'Prepare the blank','Straight-grained blank, no cracks. Mark the centre on both ends and punch a small dent.',''),
  (w3,'Fit between the centres','Blank on the drive centre, wind the tailstock in until both points bite. Lock it.',''),
  (w4,'Set the tool rest','About 3 mm from the blank, at its centre height. Tighten the clamp screw.',''),
  (w5,'Turn by hand','Spin the blank one full turn by hand: it must not touch the rest.','w'),
  (w6,'Low speed, power on','Speed knob to low, then switch on. Stand to the side of the blank.',''),
  (w7,'Cut with the chisel','Hold the chisel firmly on the rest, edge just below centre. Light cuts, move along the rest.',''),
  (w8,'Stop, then check','Switch off and wait for a full stop. Move the rest away, then measure.','w'),
  (w9,'Off, unplug, clean','Unplug, brush the shavings off the bed and centres, return the chisels.','')],
 trouble=[('Blank wobbles','Stop. Wind the tailstock in and lock it'),('Chisel digs in','Tool flat on the rest, edge lower, lighter cut'),('Smoke at the tail centre','Back the tailstock off a little'),('Motor slows down','Lighter cuts, or a little more speed')],
 leave=['Machine off and unplugged','Blank removed, rest slid back','Shavings brushed into the bin','Chisels and centres returned','Booking marked as finished']))
# ---------------- M-01 Technics: disc sander (photos 4 and 2) ----------------
def s2():c=C(4,350,180,900);c.zoom(820,500,130,860,250,170,'no tears · fully stuck');return c.out()
def s3():c=C(4,1100,550,948);c.zoom(1730,880,160,250,250,170,'peel · centre · press');return c.out()
def s4():c=C(2,900,60,1100);c.zoom(1430,370,110,320,500,170,'plate tight on the spindle');return c.out()
def s5():c=C(4,350,180,900);c.curl(820,500,95);c.pill(270,80,'turn by hand: runs true');return c.out()
def s6():c=C(4,500,150,1200);c.zoom(1335,400,70,850,560,150,'I · switch on');return c.out()
def s7():c=C(4,500,250,700);c.arrow(735,420,735,590,w=11);c.pill(560,660,'use the half that moves down');return c.out()
def s8():c=C(4,500,150,1200);c.zoom(1335,400,70,850,560,150,'O · wait for a stop');return c.out()
def s9():c=C(4,230,180,1600);c.pill(520,660,'unplug · wipe the dust away');return c.out()
G.append(dict(no='M-01',file='M-01',part='sander',name='UNIMAT ML Technics · disc sander',kind='Disc sanding on the motor unit',
 hero=lambda:hero(4,230,180,1600,[(450,470,-70,-60),(820,500,90,-80),(760,660,-80,80),(1000,960,0,110),(1730,880,40,-110),(1335,400,40,-80)]),
 leg=['Motor unit','Sanding disc on the plate','Headstock plate','Bed','Spare sanding discs','In-line ON / OFF switch'],
 safe=['<b>Sand only on the half of the disc that moves down.</b>','Dust mask and glasses on. No gloves, loose sleeves or jewellery.','Small parts: hold with pliers or a clamp, never fingers near the disc.','Change discs only when switched off and unplugged.','First time? Book an induction with a technician.'],
 glance=[('Discs','Self-adhesive, keep spares'),('Materials','Wood, plastic, soft-metal edges'),('Pressure','Light, keep the part moving')],
 titles=['Set up the disc sander','Sand, stop, finish'],
 steps=[('ppe','Gear up','Glasses and dust mask on, hair tied, sleeves up. Take off gloves, rings and watch.',''),
  (s2,'Check the disc','The disc must be flat, fully stuck and not torn. If not, change it.',''),
  (s3,'Change a worn disc','Unplugged: peel the old disc, centre a new one on the plate and press it flat.',''),
  (s4,'Fit the sanding plate','The plate replaces the collet chuck shown here. Screw it on the spindle and tighten.',''),
  (s5,'Turn by hand','Turn the plate one full turn by hand: it must run true and touch nothing.','w'),
  (s6,'Power on','Switch on with the in-line switch. Keep fingers clear of the disc.',''),
  (s7,'Sand on the down side','Hold the part firmly with light pressure on the half that moves down. Keep it moving.',''),
  (s8,'Stop, then check','Switch off and wait for a full stop before checking the part.','w'),
  (s9,'Off, unplug, clean','Unplug, wipe the dust off the machine and the bench, store the spare discs.','')],
 trouble=[('Part snatched','Lighter pressure, down side only, hold firmly'),('Burning smell','Keep the part moving, fit a new disc'),('Disc comes loose','Stop, unplug, fit a new disc pressed flat'),('Clogged disc','Change it for a new one')],
 leave=['Machine off and unplugged','Worn discs in the bin','Dust wiped off machine and bench','Spare discs stored','Booking marked as finished']))
# ---------------- M-02 Pearl / centre drilling (photo 1) ----------------
def p2():c=C(1,520,300,950);c.zoom(860,610,150,820,250,180,'tight · short stick-out');return c.out()
def p3():c=C(1,900,300,950);c.zoom(1260,575,110,800,520,170,'bit fully in · tight');return c.out()
def p4():c=C(1,700,250,1100);c.arrow(1650,720,1430,720);c.pill(560,660,'slide up close · lock on the bed');return c.out()
def p5():c=C(1,520,300,950);c.curl(860,600,90);c.pill(560,80,'chuck key out · turn by hand');return c.out()
def p6():c=C(1,150,60,1600);c.ring(420,290,70);c.pill(560,660,'plug in · switch on at low speed');return c.out()
def p7():c=C(1,1000,300,950);c.zoom(1690,555,120,330,420,170,'in · back · in');c.arrow(1380,450,1230,450);return c.out()
def p8():c=C(1,700,300,950);c.zoom(1150,565,130,820,250,170,'stopped · then check');return c.out()
def p9():c=C(1,150,60,1600);c.pill(520,660,'unplug · brush the chips away');return c.out()
G.append(dict(no='M-02',file='M-02',name='Pearl / centre drilling machine',kind='Horizontal drilling: the part turns, the drill feeds in',
 hero=lambda:hero(1,150,80,1750,[(420,280,-80,-60),(850,600,-40,110),(1170,563,0,-110),(1290,580,40,110),(1530,470,-60,-110),(1690,555,70,-90),(1000,790,0,100)]),
 leg=['Motor & headstock','3-jaw chuck · holds and spins the part','Drill bit','Drill chuck in the tailstock','Tailstock','Feed handwheel · red dial in mm','Bed'],
 safe=['<b>Never leave the chuck key in the chuck.</b>','No gloves, loose sleeves, jewellery or open long hair.','Never touch the spinning part or clear chips by hand.','Stop the machine before measuring or adjusting.','First time? Book an induction with a technician.'],
 glance=[('Drills','Twist drills 1–4 mm, centre drill'),('Feed','Handwheel, red dial in mm'),('Work holding','3-jaw chuck, short stick-out')],
 titles=['Set up the drill','Drill, check, finish'],
 steps=[('ppe','Gear up','Glasses on, hair tied, sleeves up, closed shoes. Take off gloves, rings and watch.',''),
  (p2,'Clamp the part','Tighten the 3-jaw chuck evenly, part sticking out as little as possible.',''),
  (p3,'Fit the drill','Push the bit fully into the tailstock drill chuck and tighten it. Centre drill first.',''),
  (p4,'Bring the tailstock up','Slide it until the bit is a few mm from the part, then lock it on the bed.',''),
  (p5,'Key out, turn by hand','Remove the chuck key. Turn the chuck by hand: nothing may touch the bit.','w'),
  (p6,'Power on, low speed','Plug in and switch on at a low speed. Hands away from the chuck.',''),
  (p7,'Feed in pecks','Turn the handwheel slowly; back out often to clear chips. The dial reads depth.',''),
  (p8,'Stop, then check','Back the drill out, switch off, wait for a full stop. Check the hole.','w'),
  (p9,'Off, unplug, clean','Unplug, brush chips away, deburr the hole. Never use hands or compressed air.','')],
 trouble=[('Hole starts off centre','Use the centre drill first'),('Part slips in the chuck','Stop. Tighten all three jaws'),('Squeal or smoke','Back out, clear chips, feed slower'),('Drill grabs at the end','Ease off just before breakthrough')],
 leave=['Machine off and unplugged','Drill removed and returned','Chips brushed into the bin','Chuck key back in its place','Booking marked as finished']))
# ---------------- M-03 Horizontal milling (photo 5) ----------------
def h2():c=C(5,700,550,900);c.zoom(1180,790,180,280,250,180,'clamp in the T-slots');return c.out()
def h3():c=C(5,750,250,800);c.zoom(1105,560,90,300,250,170,'short stick-out · tight');return c.out()
def h4():c=C(5,300,0,1700);c.arrow(1650,900,1900,900,w=11);c.arrow(840,190,840,380,w=11);c.pill(520,660,'Z: cutter height · X: part beside the cutter');return c.out()
def h5():c=C(5,750,250,800);c.curl(1100,545,70);c.pill(520,80,'turn the spindle by hand: clear');return c.out()
def h6():c=C(5,500,100,1300);c.ring(960,330,70);c.pill(520,660,'plug in · switch on');return c.out()
def h7():c=C(5,800,650,950);c.zoom(1320,1060,110,300,250,170,'touch · zero · 0.1–0.2 mm');return c.out()
def h8():c=C(5,600,450,1300);c.arrow(1500,780,1080,780,w=11);c.pill(520,660,'slow feed, light passes');return c.out()
def h9():c=C(5,300,0,1700);c.pill(520,660,'stop · measure · brush the chips away');return c.out()
G.append(dict(no='M-03',file='M-03',name='Horizontal milling machine',kind='Milling with a horizontal spindle and T-slot table',
 hero=lambda:hero(5,30,40,2000,[(970,300,60,-90),(1100,520,90,-40),(1120,580,90,60),(800,330,-90,-50),(840,110,-90,-20),(1200,820,-40,110),(1330,1150,-110,-50),(1720,860,60,-90),(600,560,-80,80)]),
 leg=['Motor','Spindle with collet','End mill cutter','Vertical slide · carries the head','Z handwheel · head up / down','T-slot table','Y handwheel · table toward the cutter','X handwheel · table along the bed','Mounting plate'],
 safe=['<b>Never hold the part by hand: always clamp it.</b>','No gloves, loose sleeves, jewellery or open long hair.','Keep fingers away from the cutter, chips are sharp and hot.','Stop the machine before measuring or adjusting.','First time? Book an induction with a technician.'],
 glance=[('Cutters','End mills 3–6 mm in the collet'),('Depth','0.1–0.2 mm per pass'),('Dials','Red dials read mm')],
 titles=['Set up the mill','Cut, stop, finish'],
 steps=[('ppe','Gear up','Glasses on, hair tied, sleeves up, closed shoes. Take off gloves, rings and watch.',''),
  (h2,'Clamp the part','Clamp the part, or a vice, to the T-slot table. Never hold it by hand.',''),
  (h3,'Fit the cutter','Cutter into the collet, short stick-out, tighten the collet nut.',''),
  (h4,'Line up','Z handwheel sets the cutter height, X moves the part beside the cutter.',''),
  (h5,'Turn by hand','Turn the spindle one full turn by hand: the cutter must clear everything.','w'),
  (h6,'Power on','Plug in and switch on. Hands off the table near the cutter.',''),
  (h7,'Touch off, set depth','Y handwheel in until the cutter just touches, zero the dial, add 0.1–0.2 mm.',''),
  (h8,'Feed slowly','Wind X slowly against the cutter rotation. Several light passes.',''),
  (h9,'Stop, measure, clean','Switch off, wait for a stop, back away. Measure, then brush chips away.','w')],
 trouble=[('Chatter or noise','Lighter cut, shorter cutter stick-out'),('Part moves','Stop. Clamp it again, tighter'),('Rough finish','Slower, steadier feed, sharp cutter'),('Motor slows','Take a lighter cut')],
 leave=['Machine off and unplugged','Cutter removed and returned','Chips brushed into the bin','Clamps and table clean','Booking marked as finished']))
# ---------------- M-05 6-axis mill (photo 7) ----------------
def x2():c=C(7,800,350,800);c.zoom(1150,580,110,280,250,170,'set angle · lock');return c.out()
def x3():c=C(7,550,700,800);c.zoom(890,980,140,820,250,170,'tight · short stick-out');return c.out()
def x4():c=C(7,550,650,800);c.zoom(810,830,90,820,250,170,'lock lever on');return c.out()
def x5():c=C(7,850,750,700);c.zoom(1085,935,70,250,250,160,'cutter tight in the collet');return c.out()
def x6():c=C(7,600,650,900);c.curl(900,990,80);c.pill(520,80,'turn by hand: cutter clear');return c.out()
def x7():c=C(7,350,630,1300);c.arrow(700,1190,1000,1150,w=11);c.pill(520,660,'power on · light passes');return c.out()
def x8():c=C(7,550,650,800);c.curl(900,990,90);c.zoom(810,830,80,820,250,150,'unlock · turn · lock');return c.out()
def x9():c=C(7,250,250,1798);c.pill(520,660,'stop · measure · brush the chips away');return c.out()
G.append(dict(no='M-05',file='M-05',name='6-axis mill ML',kind='Mill with a tilting head and a dividing head',
 hero=lambda:hero(7,248,250,1800,[(1240,1000,80,60),(1170,560,90,-60),(1095,935,-30,100),(960,480,-90,-40),(1390,560,60,-80),(880,1000,-80,80),(810,830,-90,-40),(840,1270,110,-50)]),
 leg=['Motor','Tilting head · angle scale','End mill','Column','Head slide handwheel','Dividing head with 3-jaw chuck','Index lock lever','X handwheel · along the bed'],
 safe=['<b>Lock the head angle and the index before every cut.</b>','No gloves, loose sleeves, jewellery or open long hair.','Keep fingers away from the cutter, chips are sharp and hot.','Stop the machine before indexing, measuring or adjusting.','First time? Book an induction with a technician.'],
 glance=[('Cutters','End mills 3–6 mm'),('Depth','0.1–0.2 mm per pass'),('Index','Unlock, turn, lock')],
 titles=['Set up the 6-axis mill','Cut, index, finish'],
 steps=[('ppe','Gear up','Glasses on, hair tied, sleeves up, closed shoes. Take off gloves, rings and watch.',''),
  (x2,'Set the head angle','Read the angle on the scale, then tighten the lock screws.',''),
  (x3,'Clamp the part','Tighten the part in the dividing-head chuck, short stick-out. Key out.',''),
  (x4,'Lock the index','Turn the dividing disc to the first position and lock it with the red lever.',''),
  (x5,'Fit the cutter','Cutter fully into the collet, tighten the nut, keep the stick-out short.',''),
  (x6,'Turn by hand','Turn the spindle one full turn by hand: the cutter must clear the chuck.','w'),
  (x7,'Power on, light passes','Switch on, bring the part to the cutter with the handwheels, light cuts.',''),
  (x8,'Index to the next face','Stop the motor. Unlock, turn to the next division, lock, then cut again.','w'),
  (x9,'Stop, measure, clean','Switch off, wait for a stop, back away. Measure, then brush chips away.','')],
 trouble=[('Faces not even','Lock the index before each cut'),('Angle drifts','Stop. Tighten the head lock screws'),('Chatter','Lighter cut, shorter cutter'),('Part slips in the chuck','Stop. Tighten all three jaws')],
 leave=['Machine off and unplugged','Head back at 0°, locks tight','Cutter removed and returned','Chips brushed into the bin','Booking marked as finished']))
# ---------------- M-06 Metal lathe with power motor (photo 6) ----------------
def l2():c=C(6,600,200,1000);c.zoom(960,390,130,820,470,170,'max 3× diameter out');return c.out()
def l3():c=C(6,950,300,700);c.zoom(1230,540,80,250,230,170,'tip on the centre line');return c.out()
def l4():c=C(6,600,200,1000);c.curl(960,390,80);c.pill(520,660,'key out · one turn by hand');return c.out()
def l5():c=C(6,100,100,900);c.zoom(280,230,90,700,250,170,'I · switch on');return c.out()
def l6():c=C(6,900,300,800);c.arrow(1265,780,1205,590,w=11);c.pill(520,660,'cross-slide: across the end');return c.out()
def l7():c=C(6,700,150,1100);c.arrow(1520,470,1180,520,w=11);c.pill(520,660,'0.2 mm depth · wind toward the chuck');return c.out()
def l8():c=C(6,100,100,900);c.zoom(280,230,90,700,250,170,'O · wait for a stop');return c.out()
def l9():c=C(6,150,120,1600);c.pill(520,660,'unplug · brush the chips off the bed');return c.out()
G.append(dict(no='M-06',file='M-06',name='Metal lathe with power motor',kind='Metal turning with a belt-driven headstock',
 hero=lambda:hero(6,150,120,1600,[(800,720,-40,100),(530,640,-90,40),(960,390,-60,-100),(1180,360,0,-100),(1185,470,90,-60),(1280,840,-90,40),(1650,580,60,90),(1380,360,40,-100),(280,230,80,-40)]),
 leg=['Motor · power drive','Belt and pulleys · do not bend','3-jaw chuck','Workpiece','Tool post & cutting tool','Cross-slide handwheel · depth of cut','Carriage handwheel · along the bed','Tailstock with live centre','In-line ON / OFF switch'],
 safe=['<b>Never leave the chuck key in the chuck.</b>','No gloves, loose sleeves, jewellery or open long hair.','Never touch the spinning part, the belt or the chips.','Stop the machine before measuring or adjusting.','First time? Book an induction with a technician.'],
 glance=[('Tools','HSS turning tools, tip at centre'),('Depth','0.1–0.2 mm per pass'),('Long parts','Support with the tailstock centre')],
 titles=['Set up the lathe','Turn, measure, finish'],
 steps=[('ppe','Gear up','Glasses on, hair tied, sleeves up, closed shoes. Take off gloves, rings and watch.',''),
  (l2,'Clamp the stock','Max 3× its diameter sticking out; longer parts need the tailstock centre.',''),
  (l3,'Tool at centre height','The tool tip must sit exactly on the centre line of the part.',''),
  (l4,'Key out, turn by hand','Remove the chuck key. Turn the chuck one full turn: nothing should hit.','w'),
  (l5,'Power on','Plug in and switch on with the in-line switch. Stand to the side of the chuck.',''),
  (l6,'Face the end','Touch the end, then wind the cross-slide across. 0.1–0.2 mm per pass.',''),
  (l7,'Turn the diameter','Set the depth with the cross-slide, wind the carriage toward the chuck. Repeat.',''),
  (l8,'Stop, then measure','Switch off and wait for a full stop. Measure with the calipers.','w'),
  (l9,'Off, unplug, clean','Unplug, brush chips off the bed. Never use hands or compressed air.','')],
 trouble=[('Chatter','Less stick-out, sharper tool, lighter cut'),('Pip left on the end','Tool not at centre height: reset it'),('Belt slips or squeals','Lighter cut; call a technician'),('Part slips','Stop. Tighten all three jaws')],
 leave=['Machine off and unplugged','Tool and chuck key returned','Chips brushed into the bin','Carriage wound back','Booking marked as finished']))
