import fs from 'node:fs';
const tabs=await(await fetch('http://127.0.0.1:9361/json/list')).json();const ws=new WebSocket(tabs.find(x=>x.type==='page').webSocketDebuggerUrl);await new Promise(r=>ws.onopen=r);let id=0;const pending=new Map();ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id){pending.get(m.id)?.(m);pending.delete(m.id)}};const call=(method,params={})=>new Promise(r=>{const n=++id;pending.set(n,r);ws.send(JSON.stringify({id:n,method,params}))});const ev=async expression=>{const r=await call('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(r.result.exceptionDetails)throw Error(JSON.stringify(r));return r.result.result.value};
const root=new URL('../../../',import.meta.url).pathname;const results=[];
await call('Page.enable');await call('Emulation.setDeviceMetricsOverride',{width:740,height:450,deviceScaleFactor:1,mobile:false});
for(const slug of ['css-content-background','css-content-box-model','js-react-events']){
 await call('Page.navigate',{url:'http://127.0.0.1:8772/'+slug+'/'});await new Promise(r=>setTimeout(r,700));await ev(`Promise.all([...document.images].map(i=>i.decode()))`);
 const folder='/tmp/exercise-final-recording/'+slug+'/frames';fs.mkdirSync(folder,{recursive:true});
 if(slug==='js-react-events'){
  const expected=[0,1,2,0,2,1,0];for(let n=0;n<expected.length;n++){
   if(n>0){await ev(`document.querySelector('${n<4?'.carousel-control-next':'.carousel-control-prev'}').click()`);await new Promise(r=>setTimeout(r,100));}
   const actual=await ev(`[...document.querySelectorAll('.carousel-item')].findIndex(e=>e.classList.contains('active'))`);if(actual!==expected[n])throw Error('carousel '+actual+' expected '+expected[n]);
   if(!await ev(`document.querySelector('.carousel-item.active img').naturalWidth>0`))throw Error('slide image');
   results.push({slug,step:n,active:actual,passed:true});const clip=await ev(`(()=>{const r=document.querySelector('.carousel').getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,scale:1}})()`);const shot=await call('Page.captureScreenshot',{format:'png',clip});fs.writeFileSync(folder+'/'+String(n).padStart(3,'0')+'.png',Buffer.from(shot.result.data,'base64'));
  }
 }else{
  const info=await ev(slug.endsWith('background')?`(()=>{const e=document.querySelector('.card'),s=getComputedStyle(e);return {width:e.offsetWidth,height:e.offsetHeight,background:s.backgroundImage,size:s.backgroundSize,position:s.backgroundPosition,text:e.textContent.trim()}})()`:`(()=>{const e=document.querySelector('.profile img');return {width:e.width,height:e.height,naturalWidth:e.naturalWidth,round:getComputedStyle(e).borderRadius}})()`);
  if(slug.endsWith('background')&&(info.width!==300||info.height!==200||info.size!=='cover'))throw Error(JSON.stringify(info));if(slug.endsWith('box-model')&&(info.width!==100||!info.naturalWidth))throw Error(JSON.stringify(info));
  results.push({slug,...info,passed:true});const box=await ev(`(()=>{const r=document.querySelector('${slug.endsWith('background')?'.card':'.profile'}').getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,scale:1}})()`);const shot=await call('Page.captureScreenshot',{format:'png',clip:box});fs.writeFileSync(root+'packages/web/public/exercise-assets/'+slug+'/final.png',Buffer.from(shot.result.data,'base64'));
 }
}
fs.writeFileSync(root+'docs/exercise-image-recovery/final-scenarios.json',JSON.stringify(results,null,2)+'\n');console.log(results);ws.close();
