import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import {emphasizeLesson,withoutEmphasis} from './terms.mjs';
const wrap=s=>`<span class="course-term">${s}</span>`;

// Обычные слова не размечаются; иностранное имя встречается с акцентом один раз.
assert.equal(emphasizeLesson('<p>Результат, получение, экран, программа. HTML, HTML и HTML5.</p>'),`<p>Результат, получение, экран, программа. ${wrap('HTML')}, HTML и HTML5.</p>`);
assert.equal(emphasizeLesson('<p>CSS и css. API.</p>'),`<p>${wrap('CSS')} и css. ${wrap('API')}.</p>`);
// Предпочитается настоящее определение, а не раннее упоминание в абзаце.
assert.equal(emphasizeLesson('<p>Поговорим про HTML.</p><p class="definition"><strong>HTML — язык разметки.</strong> HTML.</p>'),`<p>Поговорим про HTML.</p><p class="definition">${wrap('HTML')} — язык разметки. HTML.</p>`);
assert.equal(emphasizeLesson('<p><strong>Информация — сведения о чём-либо.</strong> Информация.</p><p><strong>Информация — другое пояснение.</strong></p>'),`<p>${wrap('Информация')} — сведения о чём-либо. Информация.</p><p>Информация — другое пояснение.</p>`);
assert.equal(emphasizeLesson('<p><strong>API</strong> — способ взаимодействия. API.</p>'),`<p>${wrap('API')} — способ взаимодействия. API.</p>`);
assert.equal(emphasizeLesson('<p><strong>Ответ:</strong> <strong>Вся фраза важна.</strong></p>'),'<p>Ответ: Вся фраза важна.</p>');
assert.equal(emphasizeLesson('<p><strong>А — исходный вариант.</strong></p>'),'<p>А — исходный вариант.</p>');
const review='<h2><span>08</span><span>Проверка понимания</span></h2><p><strong>Вопрос:</strong> HTML.</p><h2>Словарь урока</h2><p><strong>Информация</strong> — сведения.</p>';
assert.equal(emphasizeLesson(review),withoutEmphasis(review));
const coreHeading='<h2>Проверка должна доходить до нужного содержания</h2><p><strong>Резервная копия — отдельная копия.</strong></p>';
assert(emphasizeLesson(coreHeading).includes(wrap('Резервная копия')));
// Атрибуты, сущности и код сохраняются; внутренние подписи рисунков не теряются.
assert.equal(emphasizeLesson('<p title="HTML">HTML &amp; CSS</p>'),`<p title="HTML">${wrap('HTML')} &amp; ${wrap('CSS')}</p>`);
const protectedHtml='<h2>HTML</h2><pre><code>HTML &lt;strong&gt;</code></pre><code>CSS</code><figure><strong>HTML</strong><p>CSS</p></figure>';
assert.equal(emphasizeLesson(protectedHtml),protectedHtml);
const studyTable='<table><thead><tr><th>HTML</th></tr></thead><tbody><tr><td><code>CSS</code></td></tr></tbody></table>';
assert.equal(emphasizeLesson(studyTable),studyTable);
const answer='<details><summary>Ответ</summary><p>HTML</p><table><tr><td><code>CSS</code></td></tr></table></details>';
assert.equal(emphasizeLesson(answer),answer);
assert.equal(withoutEmphasis('<p><strong>Ответ:</strong> HTML <code>&lt;strong&gt;</code></p>'),'<p>Ответ: HTML <code>&lt;strong&gt;</code></p>');

// Проверяем готовый курс: политика действует в каждом уроке и не даёт подсказок в тестах.
const context={window:{}};vm.runInNewContext(await fs.readFile(new URL('./dist/data.js',import.meta.url),'utf8'),context);
const C=context.window.COURSE;
for(const lesson of C.lessons){
 assert(!lesson.html.includes('\u0000'),`Не раскрыт сохранённый фрагмент: ${lesson.id}`);
 assert(!lesson.titleHtml.includes('course-term'),`Автоакцент в заголовке: ${lesson.id}`);
 const body=lesson.html.replace(/<figure\b[\s\S]*?<\/figure>/g,'');
 assert(!/<strong\b/.test(body),`Осталось сплошное выделение: ${lesson.id}`);
 const accents=[...body.matchAll(/<span class="course-term">([^<]+)<\/span>/g)].map(m=>m[1].toLowerCase());
 assert.equal(accents.length,new Set(accents).size,`Повторяющийся акцент: ${lesson.id}`);
}
for(const q of C.questions){assert(!q.prompt.includes('course-term'));assert(!q.explanation.includes('course-term'));for(const o of q.options)assert(!o.html.includes('course-term'))}
for(const t of C.glossary)for(const e of t.entries)assert(!e.definition.includes('course-term'));
console.log('Выделение: ключевые названия при определении, иностранные термины без повторов; сохранность кода, рисунков, таблиц и вопросов проверена.');
