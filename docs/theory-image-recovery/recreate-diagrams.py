import json,re,html,hashlib
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2];audit_path=ROOT/'docs/theory-image-recovery/recovery.json';audit=json.loads(audit_path.read_text());reg=json.loads((ROOT/'content/theory-images.json').read_text())
def text(x,y,s,size=22,color='#f4efe5'):return f'<text x="{x}" y="{y}" font-size="{size}" fill="{color}">{html.escape(s)}</text>'
def box(x,y,w,h,label,fill='#25252e'):
 return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="7" fill="{fill}" stroke="#e8b45a"/>'+text(x+12,y+h/2+7,label)
def line(x,y,xx,yy):return f'<path d="M{x},{y} L{xx},{yy}" stroke="#e8b45a" stroke-width="3" marker-end="url(#arrow)"/>'
def svg(title,body,h=370):return f'''<svg xmlns="http://www.w3.org/2000/svg" width="960" height="{h}" viewBox="0 0 960 {h}" role="img" aria-label="{html.escape(title)}"><defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 Z" fill="#e8b45a"/></marker></defs><rect width="960" height="{h}" rx="12" fill="#141419"/><g font-family="Arial, sans-serif">{text(28,40,title,26,'#e8b45a')}{body}</g></svg>'''
def grid(kind):
 s=''
 for r in range(3):
  for c in range(4):
   fill='#354c64' if (kind=='tracks' and (r==1 or c==1)) else '#25252e'
   s+=f'<rect x="{150+c*150}" y="{85+r*65}" width="150" height="65" fill="{fill}" stroke="#aaa"/>'
 if kind=='lines':
  for c in range(5):s+=text(144+c*150,75,str(c+1),20)
  for r in range(4):s+=text(110,91+r*65,str(r+1),20)
  s+=text(150,325,'5 вертикальных линий · 4 горизонтальные линии',22)
 else:s+=f'<rect x="300" y="150" width="150" height="65" fill="#e8b45a"/>'+text(315,190,'ячейка',20,'#141419')+text(150,325,'Колонка × ряд = ячейка. Несколько ячеек = область.',22)
 return s
for row in audit:
 if row['status'] not in ['missing-original', 'recreated-diagram']:continue
 lesson=ROOT/row['lesson'];n=row['ordinal'];name=lesson.name
 if name=='02-terminologiya.md':title='Линии сетки' if n==1 else 'Колонка, ряд и ячейка';body=grid('lines' if n==1 else 'tracks')
 elif name=='10-emmet.md':
  title='Emmet: три элемента списка';body=text(35,95,'header>.logo+nav>ul>li*3',25)+box(35,130,170,60,'header')+line(205,160,255,160)+box(265,130,130,60,'.logo')+line(205,160,255,260)+box(265,230,130,60,'nav')+line(395,260,435,260)+box(445,230,100,60,'ul')
  for j in range(3):body+=line(545,260,605,120+j*90)+box(615,90+j*90,170,60,'li №'+str(j+1))
 elif name=='08-nalozhenie-elementov.md':
  if n==0:
   title='Оси страницы и глубина';body=line(160,260,740,260)+text(750,270,'x → вправо')+line(160,110,160,330)+text(30,100,'y ↓ вниз')+line(160,260,465,85)+text(490,92,'z → к пользователю')
  else:
   title='Порядок наложения позиционированных блоков';body=box(60,100,230,180,'.block-one','#324359')+box(155,150,230,160,'.block-two','#574c66')+box(250,200,230,130,'.block-three','#806128')+text(520,125,'Одинаковый z-index:')+text(520,160,'последний в DOM — сверху')+text(520,240,'Больший z-index')+text(520,275,'поднимает блок выше')
 elif name=='06-neyavnaya-setka.md':
  title='Неявная сетка: grid-column-start: 8';body=text(35,85,'6 явных колонок × 30px; оставшееся место делят 2 неявных трека',22)
  for c in range(8):
   w=70 if c<6 else 220;x=35+c*70 if c<6 else 455+(c-6)*220
   body+=f'<rect x="{x}" y="130" width="{w}" height="100" fill="{ "#25252e" if c<6 else "#574c36"}" stroke="#e8b45a"/>'+text(x+10,120,str(c+1),18)
  body+=text(880,120,'9',18)+text(685,185,'Элемент 1',22)+text(35,280,'Явная сетка',22)+text(460,280,'Неявная колонка 7')+text(685,315,'Неявная колонка 8')
 elif name=='17-virtual-dom.md':
  title='React: однонаправленный поток данных';body=box(35,115,190,90,'Действие')+line(225,160,270,160)+box(280,115,250,90,'setState → state')+line(530,160,575,160)+box(585,115,330,90,'Новое представление UI')+text(35,285,'Состояние передаётся сверху вниз через props.')+text(35,325,'Изменения реального DOM применяются на этапе commit.')
 else:raise Exception(name)
 path=Path('assets/restored')/lesson.relative_to(ROOT/'content/theory').with_suffix('')/(str(n+1)+'.svg');dest=ROOT/'content/theory'/path;dest.parent.mkdir(parents=True,exist_ok=True);dest.write_text(svg(title,body))
 # Find marker by inventory ordinal among the remaining markers.
 content=lesson.read_text();content=re.sub(r'<!--\s*IMG\b.*?-->',f'![{title}](course/theory/{path.as_posix()})',content,count=1,flags=re.S);lesson.write_text(content)
 reg[row['source_block']]={'path':path.as_posix(),'alt':title};row.update(status='recreated-diagram',path=str(dest.relative_to(ROOT)),sha256=hashlib.sha256(dest.read_bytes()).hexdigest(),reason='Source CDN returns an error; recreated from adjacent lesson text and examples.')
audit_path.write_text(json.dumps(audit,ensure_ascii=False,indent=2)+'\n');(ROOT/'content/theory-images.json').write_text(json.dumps(reg,ensure_ascii=False,indent=2)+'\n')
