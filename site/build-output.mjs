import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
const samePath=(a,b)=>path.resolve(a).toLocaleLowerCase('en')===path.resolve(b).toLocaleLowerCase('en');

export async function createBuildOutput(site){
 const root=await fs.realpath(site);
 const staged=await fs.mkdtemp(path.join(root,'.dist-build-'));
 assert(samePath(path.dirname(staged),root),'Временная сборка должна находиться непосредственно в site');
 return staged;
}

export async function publishBuildOutput(site,staged){
 const root=await fs.realpath(site),dist=path.join(root,'dist');
 assert(samePath(path.dirname(path.resolve(staged)),root)&&path.basename(staged).startsWith('.dist-build-'),'Недопустимый путь подготовленной сборки');
 const ready=await fs.lstat(staged);
 assert(ready.isDirectory()&&!ready.isSymbolicLink()&&samePath(await fs.realpath(staged),staged),'Сборка должна быть обычной папкой внутри site');
 const current=await fs.lstat(dist).catch(error=>{if(error.code!=='ENOENT')throw error;return null});
 let previous;
 if(current){
  assert(current.isDirectory()&&!current.isSymbolicLink()&&samePath(await fs.realpath(dist),dist),'dist должна быть обычной папкой внутри site');
  const archive=path.join(root,'build-archive');await fs.mkdir(archive,{recursive:true});
  assert(samePath(await fs.realpath(archive),archive),'Архив сборок не должен перенаправлять за пределы site');
  previous=path.join(await fs.mkdtemp(path.join(archive,'before-build-')),'dist');
  assert(samePath(path.dirname(path.dirname(previous)),archive),'Недопустимый путь архива сборки');
  // Preserve all previous files, including unknown ones. No recursive deletion.
  await fs.rename(dist,previous);
 }
 try{await fs.rename(staged,dist)}catch(error){if(previous)await fs.rename(previous,dist);throw error}
 if(previous)console.log(`Прежний dist сохранён: ${path.relative(root,previous)}`);
}
