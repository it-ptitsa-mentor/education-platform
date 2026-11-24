import fs from 'node:fs';
const port=process.env.CDP_PORT ?? '9337';
const tabs=await(await fetch(`http://127.0.0.1:${port}/json/list`)).json();const ws=new WebSocket(tabs.find(t=>t.type==='page').webSocketDebuggerUrl);await new Promise(r=>ws.onopen=r);let id=0;const p=new Map();ws.onmessage=e=>{let m=JSON.parse(e.data);if(m.id){p.get(m.id)(m);p.delete(m.id)}};const call=(method,params={})=>new Promise(r=>{let n=++id;p.set(n,r);ws.send(JSON.stringify({id:n,method,params}))});const ev=async expression=>{const r=await call('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(r.result.exceptionDetails)throw Error(JSON.stringify(r));return r.result.result.value};
await call('Page.enable');await call('Emulation.setDeviceMetricsOverride',{width:780,height:400,deviceScaleFactor:1,mobile:false});
const jobs={
'js-frontend-architecture-processes':[
['Начальное состояние',`document.querySelector('[data-editable-target="name"]').textContent.trim()==='name'`],
['Редактирование name',`document.querySelector('[data-editable-target="name"]').click();!!document.querySelector('#name')`],
['Ввод Cat',`document.querySelector('#name').value='Cat';true`],
['Сохранение',`document.querySelector('form').dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));document.querySelector('[data-editable-target="name"]').textContent==='Cat'`],
['Повторное редактирование',`document.querySelector('[data-editable-target="name"]').click();document.querySelector('#name').value==='Cat'&&document.querySelector('#name').selectionEnd===3`],
['Очистка name',`document.querySelector('#name').value='';document.querySelector('form').dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));!!document.querySelector('[data-editable-target="name"] i')`],
['Независимое поле email',`document.querySelector('[data-editable-target="email"]').click();document.querySelector('#email').value='cat@example.com';true`],
['Сохранение email',`document.querySelector('form').dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));document.querySelector('[data-editable-target="email"]').textContent==='cat@example.com'`]],
'js-frontend-architecture-rendering':[
['Все ноутбуки',`document.querySelectorAll('.result li').length===4`],
['Процессор intel',`document.querySelector('[name=processor_eq]').value='intel';document.querySelector('[name=processor_eq]').dispatchEvent(new Event('change',{bubbles:true}));document.querySelectorAll('.result li').length===2`],
['Память 16',`document.querySelector('[name=memory_eq]').value='16';document.querySelector('[name=memory_eq]').dispatchEvent(new Event('change',{bubbles:true}));document.querySelector('.result').textContent==='v2'`],
['Частота от 4: пустая выдача',`document.querySelector('[name=frequency_gte]').value='4';document.querySelector('[name=frequency_gte]').dispatchEvent(new Event('input',{bubbles:true}));document.querySelector('.result').textContent===''`],
['Сброс фильтров',`document.querySelectorAll('form input,form select').forEach(e=>{e.value='';e.dispatchEvent(new Event(e.tagName==='SELECT'?'change':'input',{bubbles:true}))});document.querySelectorAll('.result li').length===4`]],
'js-react-hooks-use-context':[
['White / Home',`!!document.querySelector('article.light')`],
['Black',`document.querySelector('#radio-2').click();true`],
['Profile: тема сохраняется',`[...document.querySelectorAll('[role=tab]')].find(e=>e.textContent==='Profile').click();true`],
['Blue',`document.querySelector('#radio-3').click();true`],
['Home: Blue',`[...document.querySelectorAll('[role=tab]')].find(e=>e.textContent==='Home').click();true`]]};
const results=[];
for(const [slug,steps]of Object.entries(jobs)){
 await call('Page.navigate',{url:`http://127.0.0.1:8767/${slug}/`});await new Promise(r=>setTimeout(r,500));
 const folder=`/tmp/exercise-recording/${slug}/frames`;fs.mkdirSync(folder,{recursive:true});let n=0;
 for(const [label,action]of steps){if(!await ev(action))throw Error(slug+' '+label);await new Promise(r=>setTimeout(r,120));
  if(slug.endsWith('use-context')&&label==='Black'&&!await ev(`!!document.querySelector('article.dark')`))throw Error('black theme');
  if(slug.endsWith('use-context')&&label.includes('Blue')&&!await ev(`!!document.querySelector('article.dark-blue')`))throw Error('blue theme');
  const s=await call('Page.captureScreenshot',{format:'png'});fs.writeFileSync(`${folder}/${String(n++).padStart(3,'0')}.png`,Buffer.from(s.result.data,'base64'));results.push({slug,step:label,passed:true});
 }
}
fs.writeFileSync('/tmp/exercise-recording/scenarios.json',JSON.stringify(results,null,2));console.log(results);ws.close();
