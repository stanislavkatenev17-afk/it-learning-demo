import {createBuildOutput,publishBuildOutput} from './build-output.mjs';
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {markdown,setLinks} from './markdown.mjs';
import {decorateLesson} from './render.mjs';
import {illustrateLesson} from './lesson-visuals.mjs';
import {backgroundSymbols,backgroundGrain} from './background-art.mjs';
import {emphasizeLesson,withoutEmphasis} from './terms.mjs';
import {escapeHtml} from './markdown.mjs';
const here=path.dirname(fileURLToPath(import.meta.url)),root=path.dirname(here);
const read=async name=>(await fs.readFile(path.join(root,name),'utf8')).replace(/\r/g,'');
const files=(await fs.readdir(root)).filter(f=>/^МОДУЛЬ_\d+_УРОК_\d+_.+\.md$/.test(f));
const idFromFile=f=>{const m=f.match(/^МОДУЛЬ_(\d+)_УРОК_(\d+)_/);return `${+m[1]}.${+m[2]}`};
setLinks([...files.map(f=>[f,`#/lesson/${idFromFile(f)}`]),['НАВИГАЦИЯ_КУРСА.md','#/course']]);
const nav=await read('НАВИГАЦИЯ_КУРСА.md');
const modules=[...nav.matchAll(/^## Модуль (\d+)\. (.+)$/gm)].map(m=>({id:+m[1],title:m[2]}));
const lessons=[],glossary=new Map();
for(const file of files){
 const raw=await read(file),id=idFromFile(file),[module,number]=id.split('.').map(Number),title=raw.match(/^# (.+)$/m)[1];
 const first=raw.search(/^## /m);assert(first>0,file);
 const body=raw.slice(first).replace(/\n## Редакторские[^\n]*[\s\S]*$/,'').replace(/^\*\*Навигация:\*\*.*$/gm,'').replace(/\n---\s*$/,'').trim();
 const rendered=markdown(body,`l${id.replace('.','-')}`);
 lessons.push({id,module,number,title,file,html:illustrateLesson(id,decorateLesson(rendered.html)),headings:rendered.headings.filter(h=>h.level===2)});
 const dictionary=body.split(/^## Словарь урока\s*$/m)[1]||'';
 const terms=[...dictionary.matchAll(/^- \*\*([^*]+)\*\*\s*[—–-]\s*(.+)$/gm)].map(m=>[m[1],m[2]]);
 const tableRows=dictionary.split('\n').filter(line=>line.startsWith('|')).slice(2);
 for(const row of tableRows){const cells=row.trim().replace(/^\||\|$/g,'').split(/(?<!\\)\|/).map(s=>s.trim());if(cells.length>=2)terms.push([cells[0].replace(/[*`]/g,''),cells[1]])}
 for(const [termText,definitionText] of terms){
  const term=termText.trim(),definition=definitionText.trim(),key=term.toLocaleLowerCase('ru');
  if(!glossary.has(key))glossary.set(key,{term,entries:[]});
  glossary.get(key).entries.push({lesson:id,definition:markdown(definition).html});
 }
}
lessons.sort((a,b)=>a.module-b.module||a.number-b.number);
const bank=await read('ПРОВЕРКИ_ПО_МОДУЛЯМ_БАНК_ЗАДАНИЙ.md');
const questions=[...bank.matchAll(/^### (M(\d{2})-Q(\d{2})) — (.+)\n([\s\S]*?)(?=^### |^## |$(?![\s\S]))/gm)].map(m=>{
 const body=m[5],start=body.search(/^- [АБВ]\. /m),key=body.match(/\*\*Ключ: ([АБВ])\.\*\*/)[1],explanation=body.match(/\*\*Ключ: [АБВ]\.\*\* ([\s\S]*?) \*\*Повторение:/)[1];
 return {id:m[1],module:+m[2],title:m[4],prompt:markdown(body.slice(0,start).trim()).html,options:[...body.matchAll(/^- ([АБВ])\. (.+)$/gm)].map(x=>({key:x[1],text:x[2]})),key,explanation:markdown(explanation).html,lesson:`${+m[2]}.${+m[3]}`};
});
assert.equal(lessons.length,64);assert.equal(modules.length,11);assert.equal(questions.length,64);
assert.equal(new Set(lessons.map(l=>l.id)).size,64);
for(const q of questions){assert.equal(q.options.length,3);assert(q.options.some(o=>o.key===q.key));assert(lessons.some(l=>l.id===q.lesson))}
for(const l of lessons){assert(l.headings.length>5,l.id);assert(!l.html.includes('Редакторские'),l.id);assert(l.html.length>1000,l.id)}
assert(glossary.size>150,`Слишком мало терминов: ${glossary.size}`);
for(const lesson of lessons){lesson.html=emphasizeLesson(lesson.html);lesson.titleHtml=escapeHtml(lesson.title)}
for(const term of glossary.values())for(const entry of term.entries)entry.definition=withoutEmphasis(entry.definition);
for(const question of questions){question.prompt=withoutEmphasis(question.prompt);question.explanation=withoutEmphasis(question.explanation);for(const option of question.options)option.html=escapeHtml(option.text)}
const data={modules,lessons,questions,glossary:[...glossary.values()].sort((a,b)=>a.term.localeCompare(b.term,'ru')),version:2};
const output=await createBuildOutput(here);
await fs.writeFile(path.join(output,'background-symbols-light.svg'),backgroundSymbols());
await fs.writeFile(path.join(output,'background-grain-light.svg'),backgroundGrain());
await fs.writeFile(path.join(output,'data.js'),`window.COURSE=${JSON.stringify(data).replace(/</g,'\\u003c')};\n`);
for(const asset of ['index.html','startup.js','workspace.css','color-themes.css','lesson-visuals.css','learning-ui.css','module-1-visuals.css','module-2-visuals.css','module-3-visuals.css','module-4-visuals.css','module-5-visuals.css','module-6-visuals.css','course-visuals.css','module-7-visuals.css','learning-ui.js','app.js'])await fs.copyFile(path.join(here,'src',asset),path.join(output,asset));
await fs.mkdir(path.join(output,'assets','module-1'),{recursive:true});
for(const asset of ['monitor-front.webp','mountains.webp','house.webp'])await fs.copyFile(path.join(here,'assets','module-1',asset),path.join(output,'assets','module-1',asset));
await fs.mkdir(path.join(output,'assets','module-3'),{recursive:true});
for(const asset of ['processor.webp','ram.webp','ssd.webp'])await fs.copyFile(path.join(here,'assets','module-3',asset),path.join(output,'assets','module-3',asset));
await publishBuildOutput(here,output);
console.log(`Готово: ${modules.length} модулей, ${lessons.length} урока, ${questions.length} заданий, ${glossary.size} терминов.`);
