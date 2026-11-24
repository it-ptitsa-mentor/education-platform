import fs from 'node:fs';
const port=process.env.CDP_PORT ?? '9337';
const tabs=await(await fetch(`http://127.0.0.1:${port}/json/list`)).json();const ws=new WebSocket(tabs.find(t=>t.type==='page').webSocketDebuggerUrl);await new Promise(r=>ws.onopen=r);let id=0;const p=new Map();ws.onmessage=e=>{let m=JSON.parse(e.data);if(m.id){p.get(m.id)(m);p.delete(m.id)}};const call=(method,params={})=>new Promise(r=>{let n=++id;p.set(n,r);ws.send(JSON.stringify({id:n,method,params}))});const ev=async expression=>{const r=await call('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(r.result.exceptionDetails)throw Error(JSON.stringify(r));return r.result.result.value};
await call('Page.enable');await call('Emulation.setDeviceMetricsOverride',{width:780,height:400,deviceScaleFactor:1,mobile:false});
const jobs=(await import('./scenarios-more.mjs')).default;const results=[];
for(const [slug,steps]of Object.entries(jobs)){
 try{
 await call('Emulation.setDeviceMetricsOverride',{width:780,height:slug.includes('forms')?900:slug.includes('use-effect')?650:450,deviceScaleFactor:1,mobile:false});
 await call('Page.navigate',{url:`http://127.0.0.1:8767/${slug}/`});await new Promise(r=>setTimeout(r,400));await ev(`window.setValue=(s,v)=>{const e=document.querySelector(s);Object.getOwnPropertyDescriptor(e.tagName==='TEXTAREA'?HTMLTextAreaElement.prototype:HTMLInputElement.prototype,'value').set.call(e,v);e.dispatchEvent(new Event('input',{bubbles:true}));e.dispatchEvent(new Event('change',{bubbles:true}));};`);
 const folder=`/tmp/exercise-recording/${slug}/frames`;fs.rmSync(folder,{recursive:true,force:true});fs.mkdirSync(folder,{recursive:true});let n=0;
 for(const [label,action,assertion]of steps){if(action)await ev(action);await new Promise(r=>setTimeout(r,200));if(!await ev(assertion))throw Error(label+' assertion '+assertion);const s=await call('Page.captureScreenshot',{format:'png'});fs.writeFileSync(`${folder}/${String(n++).padStart(3,'0')}.png`,Buffer.from(s.result.data,'base64'));results.push({slug,step:label,passed:true});}
 console.log(slug,'OK');
 }catch(e){results.push({slug,passed:false,error:e.message});console.log(slug,e.message);}
}
fs.writeFileSync('/tmp/exercise-recording/more-scenarios-results.json',JSON.stringify(results,null,2));ws.close();
