import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {execFileSync,spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const site=path.dirname(fileURLToPath(import.meta.url)),root=path.dirname(site),out=path.join(root,'audit/2026-11-13/technical-preparation');
await fs.mkdir(out,{recursive:true});
const fixture=await fs.mkdtemp(path.join(out,'build-check-')),copy=path.join(fixture,'site');await fs.mkdir(copy);
for(const f of await fs.readdir(root))if(f.endsWith('.md'))await fs.copyFile(path.join(root,f),path.join(fixture,f));
for(const f of await fs.readdir(site))if(f.endsWith('.mjs')||f==='package.json')await fs.copyFile(path.join(site,f),path.join(copy,f));
await fs.cp(path.join(site,'src'),path.join(copy,'src'),{recursive:true});
for(const m of['module-1','module-3']){await fs.mkdir(path.join(copy,'assets',m),{recursive:true});for(const f of await fs.readdir(path.join(site,'assets',m)))if(f.endsWith('.webp'))await fs.copyFile(path.join(site,'assets',m,f),path.join(copy,'assets',m,f))}
async function hashes(dir,prefix=''){const result={};for(const e of await fs.readdir(dir,{withFileTypes:true})){const name=prefix+e.name;if(e.isDirectory())Object.assign(result,await hashes(path.join(dir,e.name),name+'/'));else result[name]=crypto.createHash('sha256').update(await fs.readFile(path.join(dir,e.name))).digest('hex')}return Object.fromEntries(Object.entries(result).sort())}
const run=()=>execFileSync(process.execPath,['build.mjs'],{cwd:copy,encoding:'utf8',windowsHide:true});
const firstLog=run(),first=await hashes(path.join(copy,'dist'));assert.equal(Object.keys(first).length,25);
await fs.mkdir(path.join(copy,'dist','local-notes'));await fs.writeFile(path.join(copy,'dist/local-notes/keep.txt'),'Preserve this unrelated file');await fs.writeFile(path.join(copy,'dist/colorful.css'),'old unused asset');
const repeatedLog=run(),repeated=await hashes(path.join(copy,'dist'));assert.deepEqual(repeated,first);
const archives=await fs.readdir(path.join(copy,'build-archive'));assert.equal(archives.length,1);const archived=path.join(copy,'build-archive',archives[0],'dist');assert.equal(await fs.readFile(path.join(archived,'local-notes/keep.txt'),'utf8'),'Preserve this unrelated file');assert.equal(await fs.readFile(path.join(archived,'colorful.css'),'utf8'),'old unused asset');
const app=path.join(copy,'src/app.js'),absent=path.join(copy,'src/app.js.unavailable');assert(path.resolve(app).startsWith(path.resolve(fixture)+path.sep)&&path.resolve(absent).startsWith(path.resolve(fixture)+path.sep));
await fs.rename(app,absent);let failed;try{failed=spawnSync(process.execPath,['build.mjs'],{cwd:copy,encoding:'utf8',windowsHide:true});assert.notEqual(failed.status,0);assert.deepEqual(await hashes(path.join(copy,'dist')),first)}finally{await fs.rename(absent,app)}
const report={checkedAt:new Date().toISOString(),fixture,checks:[{name:'clean-and-repeated-output-identical',pass:true,files:Object.keys(first).length},{name:'unused-assets-not-published',pass:!('colorful.css'in repeated)&&!('style.css'in repeated)},{name:'unknown-and-old-files-preserved-in-archive',pass:true,archived},{name:'failed-build-keeps-current-output',pass:true}],firstLog,repeatedLog,expectedFailure:failed.stderr.trim(),files:first,pass:true};
await fs.writeFile(path.join(out,'build-output-check.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({pass:true,files:Object.keys(first).length,checks:report.checks},null,2));
