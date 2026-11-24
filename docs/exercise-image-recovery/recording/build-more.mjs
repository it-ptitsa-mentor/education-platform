import {createRequire} from 'node:module';import fs from 'node:fs';import path from 'node:path';
const require=createRequire(new URL('../../../package.json', import.meta.url)),esbuild=createRequire(require.resolve('vite/package.json', {paths:[path.resolve(new URL('../../../packages/web', import.meta.url).pathname)]}))('esbuild');
const root=path.resolve(new URL('../../..', import.meta.url).pathname);
const inventory=JSON.parse(fs.readFileSync(root+'/docs/exercise-image-recovery/inventory.json'));
const results=[];
for(const slug of [...new Set(inventory.filter(x=>x.slug.startsWith('js-')&&!['js-react-events','js-frontend-architecture-processes','js-frontend-architecture-rendering','js-react-hooks-use-context'].includes(x.slug)).map(x=>x.slug))]){
 try{
 const dest='/tmp/exercise-recording/'+slug;fs.mkdirSync(dest,{recursive:true});fs.cpSync(root+'/exercises/'+slug,dest,{recursive:true});fs.cpSync(dest+'/__solution__',dest,{recursive:true});
 let entry;
 if(slug.startsWith('js-react'))entry=fs.readFileSync(dest+'/src/index.jsx','utf8').replaceAll("'./","'./src/");
 else if(slug==='js-dom-element-manipulating')entry=`import normalize from './src/normalize.js';normalize(document);`;
 else if(slug==='js-frontend-architecture-ui-state')entry=`import app from './src/application.js';import data from './src/index.js';app(data);`;
 else if(slug==='js-frontend-architecture-initialization')entry=`import './src/index.js';`;
 else entry=`import app from './src/application.js';app();`;
 if(slug==='js-react-hooks-use-effect') entry=`const nativeFetch=window.fetch.bind(window);window.fetch=(url,...rest)=>nativeFetch(url==='/src/products.json'?'./src/products.json':url,...rest);`+entry;
 if(['js-react-async','js-react-component-lifecycle','js-frontend-architecture-complex-state','js-frontend-architecture-forms'].includes(slug)){
  entry=`import axios from 'axios';let tasks=[];let next=1;axios.defaults.adapter=async(config)=>{let data;const body=typeof config.data==='string'?JSON.parse(config.data):config.data;if(config.url==='/countries'){data=config.params.term?['Albania','Algeria'].filter(x=>x.toLowerCase().startsWith(config.params.term.toLowerCase())):[]}else if(config.url==='/users'){data={}}else{if(config.method==='post'){tasks.push({id:next++,text:body.text,name:body.name,state:'active'});}if(config.method==='patch'){const t=tasks.find(x=>config.url.includes('/'+x.id+'/'));if(t)t.state=config.url.endsWith('finish')?'finished':'active';}data=${slug==='js-frontend-architecture-complex-state'?'{items:tasks}':"config.method==='post'?tasks.at(-1):config.method==='patch'?tasks.find(x=>config.url.includes('/'+x.id+'/')):tasks"};data=JSON.parse(JSON.stringify(data));}await new Promise(r=>setTimeout(r,80));return{data,status:200,statusText:'OK',headers:{},config};};`+entry;
 }
 fs.writeFileSync(dest+'/record-entry.jsx',entry);
 await esbuild.build({entryPoints:[dest+'/record-entry.jsx'],bundle:true,outfile:dest+'/bundle.js',nodePaths:[root+'/node_modules'],jsx:'automatic',loader:{'.js':'jsx'},plugins:[{name:'capture-bootstrap',setup(b){b.onResolve({filter:/^bootstrap(?:\/|$)/},()=>({path:'bootstrap',namespace:'empty'}));b.onLoad({filter:/.*/,namespace:'empty'},()=>({contents:''}));}}],define:{'process.env.NODE_ENV':'"production"'}});
 let html=fs.readFileSync(fs.existsSync(dest+'/public/index.html')?dest+'/public/index.html':dest+'/index.html','utf8').replace(/<script\b[^>]*>[\s\S]*?<\/script>/g,'');
 fs.writeFileSync(dest+'/index.html','<!doctype html><meta charset="utf-8"><link rel="stylesheet" href="../bootstrap.min.css"><link rel="stylesheet" href="bundle.css"><style>body{padding:24px;background:white;color:#212529}</style>'+html+'<script src="bundle.js"></script>');results.push({slug,built:true});
 }catch(e){results.push({slug,built:false,error:e.message});}
}
fs.writeFileSync('/tmp/exercise-recording/build-more-results.json',JSON.stringify(results,null,2));console.log(results);
