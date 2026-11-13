import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const read=name=>fs.readFile(new URL('./dist/'+name,import.meta.url),'utf8');
const html=await read('index.html'),app=await read('app.js');
assert.match(html,/<html\b[^>]*data-theme="light"/,'Сайт должен сразу открываться в светлом оформлении');
assert.match(html,/<meta name="color-scheme" content="light">/);
assert.doesNotMatch(html,/theme-toggle|theme-preference|data-theme="dark"/);
assert.doesNotMatch(app,/courseTheme|themeButton|systemTheme|prefers-color-scheme|localStorage|dataset\.theme\s*=/,'Старая настройка браузера и тема устройства не должны менять оформление');

const styles=[...html.matchAll(/<link rel="stylesheet" href="([^"?]+)[^"]*">/g)].map(match=>match[1]);
assert(styles.includes('color-themes.css'));
for(const name of styles){
 const css=await read(name);
 assert.doesNotMatch(css,/data-theme\s*=\s*["']dark|prefers-color-scheme|color-scheme\s*:\s*dark|background-(?:symbols|grain)-dark|theme-toggle/,name);
}
assert.match(await read('color-themes.css'),/color-scheme\s*:\s*light/);
for(const name of ['theme-preference.js','background-symbols-dark.svg','background-grain-dark.svg']){
 await assert.rejects(fs.access(new URL('./dist/'+name,import.meta.url)),{code:'ENOENT'},name+' больше не нужен в сборке');
}
console.log('Тема: только светлое оформление; переключатель, автовыбор, чтение старой настройки и тёмные активы удалены.');
