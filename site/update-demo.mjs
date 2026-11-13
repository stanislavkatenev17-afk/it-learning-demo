import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const site=path.dirname(fileURLToPath(import.meta.url)),root=path.dirname(site),dist=path.join(site,'dist');
const same=(a,b)=>path.resolve(a).toLowerCase()===path.resolve(b).toLowerCase();
assert(same(await fs.realpath(root),root)&&same(await fs.realpath(dist),dist),'Ожидаются обычные папки репозитория и dist');
for(const marker of ['index.html','.nojekyll'])assert((await fs.lstat(path.join(root,marker))).isFile(),`В корне отсутствует ${marker}; проверьте выбранный репозиторий`);
const files=[];
async function walk(dir,prefix=''){
 for(const entry of await fs.readdir(dir,{withFileTypes:true})){
  assert(!entry.isSymbolicLink(),'Символические ссылки в выдаче не поддерживаются');
  const relative=prefix+entry.name;
  if(entry.isDirectory())await walk(path.join(dir,entry.name),relative+'/');
  else{
   assert(entry.isFile(),'Ожидается обычный файл');
   const allowed=/^[a-z0-9][a-z0-9._-]*\.(?:js|css|svg)$/.test(relative)||relative==='index.html'||/^assets\/(?:[a-z0-9_-]+\/)*[a-z0-9][a-z0-9._-]*\.(?:webp|png|jpe?g|svg)$/.test(relative);
   assert(allowed,`Недопустимый файл для корневой публикации: ${relative}`);
   files.push({relative,bytes:await fs.readFile(path.join(dir,entry.name))});
  }
 }
}
await walk(dist);
for(const required of ['index.html','app.js','data.js','startup.js'])assert(files.some(f=>f.relative===required),`Нет обязательного ${required}`);
// Validate every destination before writing any published file.
for(const file of files){
 let parent=root;
 for(const segment of file.relative.split('/').slice(0,-1)){
  parent=path.join(parent,segment);
  const stat=await fs.lstat(parent).catch(e=>{if(e.code==='ENOENT')return null;throw e});
  if(stat)assert(stat.isDirectory()&&!stat.isSymbolicLink(),'Папка назначения не должна перенаправлять запись');
 }
 const target=await fs.lstat(path.join(root,file.relative)).catch(e=>{if(e.code==='ENOENT')return null;throw e});
 if(target)assert(target.isFile()&&!target.isSymbolicLink(),'Назначение должно быть обычным файлом');
}
for(const file of files){
 const target=path.join(root,file.relative);await fs.mkdir(path.dirname(target),{recursive:true});await fs.writeFile(target,file.bytes);
}
console.log(`Обновлено ${files.length} файлов демонстрации. Документы и исходники сохранены. Проверьте diff перед коммитом; сеть не использовалась.`);
