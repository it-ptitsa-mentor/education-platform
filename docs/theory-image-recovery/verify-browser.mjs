import fs from 'node:fs';
const mode=process.env.MODE??'before';const base=process.env.SITE_BASE??'https://education.it-ptitsa-mentor.ru/preview/';
const tabs=await(await fetch(`http://127.0.0.1:${process.env.CDP_PORT??'9348'}/json/list`)).json();const ws=new WebSocket(tabs.find(t=>t.type==='page').webSocketDebuggerUrl);await new Promise(r=>ws.onopen=r);let id=0;const pending=new Map();ws.onmessage=e=>{let m=JSON.parse(e.data);if(m.id){pending.get(m.id)?.(m);pending.delete(m.id)}};
const call=(method,params={})=>new Promise(r=>{let n=++id;pending.set(n,r);ws.send(JSON.stringify({id:n,method,params}))});
const ev=async expression=>{let r=await call('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(r.result.exceptionDetails)throw Error(JSON.stringify(r));return r.result.result.value};
await call('Page.enable');await call('Page.bringToFront');await call('Network.enable');await call('Network.setCacheDisabled',{cacheDisabled:true});await call('Network.clearBrowserCache');
const root=new URL('../../',import.meta.url).pathname.replace(/\/$/,'');const course=JSON.parse(fs.readFileSync(root+'/content/course.json'));const audit=JSON.parse(fs.readFileSync(root+'/docs/theory-image-recovery/recovery.json'));const paths=new Set(audit.map(r=>r.lesson));const lessons=[];
for(const m of course.modules)for(const t of m.topics)for(const l of t.lessons)if(paths.has(l.theory))lessons.push({...l,url:base+`learn/${m.slug}/${t.slug}/${l.index}/theory`});
const folder=root+'/docs/screenshots/theory-recovery';fs.mkdirSync(folder,{recursive:true});const results=[];
for(const width of [1440,390]){
 await call('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:width===390});
 const selected=mode==='before'?lessons.filter(l=>['Введение в HTML','Терминология','Наложение элементов'].includes(l.title)):lessons;
 for(const l of selected){
  await call('Page.navigate',{url:l.url});let status;
  for(let i=0;i<80;i++){await new Promise(r=>setTimeout(r,100));status=await ev(`({ready:!!document.querySelector('.lesson-theory[aria-busy="false"]'),text:document.body.innerText})`);if(status.text.includes('Вход в тренажёр'))break;if(status.ready&&status.text.includes(l.title))break;}
  const r=await ev(`(async()=>{await Promise.all([...document.querySelectorAll('main img')].map(i=>i.decode().catch(()=>null)));return {title:document.querySelector('h1')?.textContent,images:[...document.querySelectorAll('img')].filter(i=>i.src.includes('/course/theory/assets/')).map(i=>({src:i.src,ok:i.complete&&i.naturalWidth>0,width:i.getBoundingClientRect().width,parent:i.parentElement.getBoundingClientRect().width})),overflow:document.documentElement.scrollWidth-innerWidth,gate:document.body.innerText.includes('Вход в тренажёр')}})()`);
  const expected=audit.filter(a=>a.lesson===l.theory&&a.path).map(a=>a.path.replace('content/','course/'));const missing=expected.filter(p=>!r.images.some(i=>i.src.includes(p)&&i.ok));results.push({url:l.url,width,expected:expected.length,missing,...r});console.log(mode,width,l.title,r.images.length,r.images.every(i=>i.ok),r.overflow,r.gate);
  if(['Введение в HTML','Терминология','Наложение элементов'].includes(l.title)){
   await ev(`document.querySelector('img[src*="/assets/restored/"]')?.scrollIntoView({block:'center'})`);
   const s=await call('Page.captureScreenshot',{format:'png'});fs.writeFileSync(`${folder}/${mode}-${l.theory.split('/').at(-1).slice(0,-3)}-${width}.png`,Buffer.from(s.result.data,'base64'));
  }
 }
}
fs.writeFileSync(root+'/docs/theory-image-recovery/'+mode+'-browser.json',JSON.stringify(results,null,2));ws.close();
