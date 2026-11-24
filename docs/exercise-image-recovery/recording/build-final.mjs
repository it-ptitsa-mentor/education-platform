import { createRequire } from 'node:module';
import fs from 'node:fs';import path from 'node:path';
const root=path.resolve(new URL('../../..',import.meta.url).pathname);
const require=createRequire(root+'/package.json');const esbuild=createRequire(require.resolve('vite/package.json',{paths:[root+'/packages/web']}))('esbuild');
for(const slug of ['css-content-background','css-content-box-model','js-react-events']){
 const dest='/tmp/exercise-final-recording/'+slug;fs.mkdirSync(dest,{recursive:true});
 fs.cpSync(root+'/exercises/'+slug,dest,{recursive:true});fs.cpSync(dest+'/__solution__',dest,{recursive:true});
 if(slug==='js-react-events'){
  const entry=fs.readFileSync(dest+'/src/index.jsx','utf8').replace("'./Carousel.jsx'","'./src/Carousel.jsx'").replaceAll("'/images/","'./images/");
  fs.writeFileSync(dest+'/entry.jsx',entry);fs.cpSync(dest+'/public/images',dest+'/images',{recursive:true});
  await esbuild.build({entryPoints:[dest+'/entry.jsx'],bundle:true,outfile:dest+'/bundle.js',nodePaths:[root+'/node_modules'],jsx:'automatic',loader:{'.js':'jsx'},plugins:[{name:'bootstrap',setup(b){b.onResolve({filter:/^bootstrap(?:\/|$)/},()=>({path:'bootstrap',namespace:'empty'}));b.onLoad({filter:/.*/,namespace:'empty'},()=>({contents:''}));}}],define:{'process.env.NODE_ENV':'"production"'}});
  fs.writeFileSync(dest+'/index.html','<!doctype html><meta charset="utf-8"><link rel="stylesheet" href="../bootstrap.min.css"><style>body{margin:0;background:white}.carousel{max-width:720px}</style><div id="container"></div><script src="bundle.js"></script>');
 }
}
fs.copyFileSync('/tmp/exercise-recording/bootstrap.min.css','/tmp/exercise-final-recording/bootstrap.min.css');
