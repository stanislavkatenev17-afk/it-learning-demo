import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import vm from 'node:vm';
const raw=await fs.readFile(new URL('./dist/data.js',import.meta.url),'utf8');
const context={window:{}};vm.runInNewContext(raw,context);const C=context.window.COURSE;
assert.equal(C.lessons.length,64);assert.equal(C.modules.length,11);assert.equal(C.questions.length,64);
const nav=await fs.readFile(new URL('../НАВИГАЦИЯ_КУРСА.md',import.meta.url),'utf8');
const order=[...nav.matchAll(/^- \[(\d+\.\d+)\./gm)].map(m=>m[1]);
assert.deepEqual(Array.from(C.lessons,l=>l.id),order);
const decode=s=>s.replace(/&#39;/g,"'").replace(/&quot;/g,'"').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
const words=s=>s.toLocaleLowerCase('ru').match(/[a-zа-яё]+/g)||[];
for(const l of C.lessons){
 const source=(await fs.readFile(new URL('../'+l.file,import.meta.url),'utf8')).replace(/\r/g,'');
 const body=source.slice(source.search(/^## /m)).replace(/\n## Редакторские[^\n]*[\s\S]*$/,'').replace(/^\*\*Навигация:\*\*.*$/gm,'').replace(/\n---\s*$/,'').trim();
 const expected=words(body.replace(/^```[^\n]*$/gm,'').replace(/\[([^\]]+)\]\([^)]+\)/g,'$1'));
 const actual=words(decode(l.html.replace(/<[^>]*>/g,' ')));
 let i=0;for(const word of actual){if(word===expected[i])i++}
 assert.equal(i,expected.length,`Потеря текста ${l.id}: ${expected.slice(i,i+10).join(' ')}`);
 for(const [,id] of l.html.matchAll(/href="#\/lesson\/([^"?]+)"/g))assert(C.lessons.some(x=>x.id===id),`${l.id} -> ${id}`);
 assert(l.html.includes('<details'),`Нет раскрываемых ответов: ${l.id}`);
 assert(C.glossary.some(t=>t.entries.some(e=>e.lesson===l.id)),`Нет словаря: ${l.id}`);
}
for(const m of C.modules){const lessons=C.lessons.filter(l=>l.module===m.id),qs=C.questions.filter(q=>q.module===m.id);assert.equal(qs.length,lessons.length);for(const q of qs){assert.equal(q.options.length,3);assert(q.options.some(o=>o.key===q.key));assert(C.lessons.some(l=>l.id===q.lesson))}}
const app=await fs.readFile(new URL('./src/app.js',import.meta.url),'utf8');assert(!/localStorage|sessionStorage|fetch\(/.test(app));
console.log(`Проверено: порядок и сохранность текста всех 64 уроков, ссылки, словари, состав 11 проверок и ключи. Терминов: ${C.glossary.length}.`);
