import { createRequire } from 'node:module';
import fs from 'node:fs';import path from 'node:path';
const require=createRequire(new URL('../../../../package.json', import.meta.url));const esbuild=require('esbuild');
const root=path.resolve(new URL('../../../..', import.meta.url).pathname);
for(const [slug,entry] of [['js-frontend-architecture-processes',`import app from './src/application.js';app();`],['js-frontend-architecture-rendering',`import app from './src/application.js';import laptops from './src/index.js';app(laptops);`],['js-react-hooks-use-context',`import React from 'react';import {createRoot} from 'react-dom/client';import App from './src/App.jsx';import './src/style.css';createRoot(document.getElementById('container')).render(<App/>);`]]){
 const dest='/tmp/exercise-recording/'+slug;fs.mkdirSync(dest,{recursive:true});
 fs.cpSync(root+'/exercises/'+slug,dest,{recursive:true});fs.cpSync(dest+'/__solution__',dest,{recursive:true});
 fs.writeFileSync(dest+'/record-entry.jsx',entry);
 await esbuild.build({entryPoints:[dest+'/record-entry.jsx'],bundle:true,outfile:dest+'/bundle.js',nodePaths:[root+'/node_modules'],jsx:'automatic',loader:{'.js':'jsx'},define:{'process.env.NODE_ENV':'"production"'}});
 let html=fs.readFileSync(dest+'/index.html','utf8');
 html=html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g,'');
 // Bootstrap is presentation only; use a small deterministic equivalent where no stylesheet was provided.
 const style=`<link rel="stylesheet" href="../bootstrap.min.css"><style>body{padding:24px;background:white;color:#212529}</style>`;
 fs.writeFileSync(dest+'/index.html','<!doctype html><meta charset="UTF-8"><link rel="stylesheet" href="bundle.css">'+style+html+'<script src="bundle.js"></script>');
}
