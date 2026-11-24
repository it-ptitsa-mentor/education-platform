#!/usr/bin/env python3
"""Compare every original CSV occurrence with its namespaced deployed image."""
from pathlib import Path
import concurrent.futures, hashlib, json, sys, urllib.request
ROOT=Path(__file__).resolve().parents[2]
base=sys.argv[1].rstrip('/')
rows=json.loads((ROOT/'docs/exercise-image-recovery/inventory.json').read_text())
def check(row):
 result={k:row[k] for k in ['slug','title','reference','path']};result['url']=base+'/'+row['path']
 try:
  with urllib.request.urlopen(result['url'],timeout=30) as r:
   data=r.read();result.update(status=r.status,mime=r.headers.get('Content-Type'),sha256=hashlib.sha256(data).hexdigest())
  result['matches']=data==(ROOT/'packages/web/public'/row['path']).read_bytes()
  result['ok']=result['matches'] and result['mime'].startswith('image/')
 except Exception as e:result.update(ok=False,error=str(e))
 return result
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:results=list(pool.map(check,rows))
Path(sys.argv[2]).write_text(json.dumps(results,ensure_ascii=False,indent=2)+'\n')
print(f'{sum(x["ok"] for x in results)}/{len(results)} images match repository bytes')
sys.exit(0 if all(x['ok'] for x in results) else 1)
