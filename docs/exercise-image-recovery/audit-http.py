import json,urllib.request,hashlib,pathlib,csv,concurrent.futures,sys
inventory=json.load(open(sys.argv[1]));base=sys.argv[2]
def check(row):
 slug=row['slug'];path=row.get('path',row['reference'].removeprefix('./').lstrip('/'));url=base.rstrip('/')+'/'+path
 try:
  r=urllib.request.urlopen(url,timeout=20);data=r.read();mime=r.headers.get_content_type();ok=mime.startswith('image/') and len(data)>0
  result={'slug':slug,'original_reference':row['reference'],'url':url,'status':r.status,'mime':mime,'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest(),'image':ok,'expected_status':row['status']}
 except Exception as e:result={'slug':slug,'original_reference':row['reference'],'url':url,'image':False,'error':str(e),'expected_status':row['status']}
 print(slug,path,result.get('status',result.get('error')),flush=True);return result
with concurrent.futures.ThreadPoolExecutor(max_workers=5)as ex:results=list(ex.map(check,inventory))
pathlib.Path(sys.argv[3]).write_text(json.dumps(results,ensure_ascii=False,indent=2)+'\n');print('TOTAL',len(results),'IMAGES',sum(x['image']for x in results),'FAILED',sum(not x['image']for x in results))
