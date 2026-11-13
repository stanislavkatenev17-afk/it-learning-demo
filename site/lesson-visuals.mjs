import {illustrateModule11} from './module-11-visuals.mjs';
import {illustrateModule10} from './module-10-visuals.mjs';
import {illustrateModule9} from './module-9-visuals.mjs';
import {illustrateModule8} from './module-8-visuals.mjs';
import {illustrateModule7,modernizeLegacy7} from './module-7-visuals.mjs';
// Авторские учебные иллюстрации. Текст Markdown сохраняется целиком.
import {illustrateFirstLesson,illustrateSecondLesson,illustrateThirdLesson,illustrateFourthLesson} from './module-1-visuals.mjs';
import {illustrateModule2} from './module-2-visuals.mjs';
import {illustrateModule3} from './module-3-visuals.mjs';
import {illustrateModule4} from './module-4-visuals.mjs';
import {illustrateModule5} from './module-5-visuals.mjs';
import {illustrateModule6} from './module-6-visuals.mjs';
const icon=(name)=>{
 const paths={
  page:'<rect x="4" y="3" width="20" height="24" rx="3"/><path d="M9 9h10M9 14h10M9 19h6"/>',
  html:'<path d="m9 6-7 8 7 8m10-16 7 8-7 8M17 3l-6 22"/>',
  css:'<path d="M14 3a11 11 0 1 0 0 22h2a3 3 0 0 0 1-5.8 2 2 0 0 1 .8-3.9h2.6A4.6 4.6 0 0 0 25 10.7C25 6.4 20 3 14 3Z"/><circle cx="9" cy="10" r="1"/><circle cx="15" cy="7" r="1"/><circle cx="20" cy="10" r="1"/>',
  js:'<path d="m16 2-11 15h9l-2 9 11-15h-9Z"/>',
  device:'<rect x="4" y="3" width="20" height="16" rx="2"/><path d="M5 19 2 25h24l-3-6M10 22h8"/>',
  server:'<rect x="4" y="3" width="20" height="22" rx="2"/><path d="M4 10h20M4 17h20M12 6.5h7M12 13.5h7M12 20.5h7"/><circle cx="8" cy="6.5" r=".7"/><circle cx="8" cy="13.5" r=".7"/><circle cx="8" cy="20.5" r=".7"/>',
  eye:'<path d="M2 14S6 6 14 6s12 8 12 8-4 8-12 8S2 14 2 14Z"/><circle cx="14" cy="14" r="4"/>',
  save:'<path d="M6 3h11l6 6v16H6ZM17 3v6h6m-13 8 3 3 6-7"/>',
  text:'<path d="M5 6h18M14 6v17m-5 0h10"/>',
  button:'<rect x="3" y="7" width="22" height="14" rx="4"/><path d="m12 11 6 3-6 3Z"/>'
 };
 return `<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${paths[name]}</svg>`;
};
// Неровный двойной контур — свой рисунок, без фильтров, внешних картинок и шрифтов.
const sketchFrame='<svg class="sketch-frame" viewBox="0 0 100 100" preserveAspectRatio="none" fill="none" aria-hidden="true" focusable="false"><path d="M2 3 Q28 1 52 2 T98 3 L97.7 48 98 97 Q73 99 49 97.8 L2 98 2.5 53 Z"/><path class="sketch-second-stroke" d="M4 1.5 51 1 96 2 M99 7 98.7 55 99 94 M94 99 56 98.7 6 99"/></svg>';
function sketchArtwork(body){
 return body.replace(/<div class="(?:role-card |structure-root|mock-browser|demo-picture|state-card|exchange-endpoint|saving-state)[^"]*"[^>]*>/g,tag=>tag+sketchFrame)
  .replace(/(<ul class="parts-tree">[\s\S]*?<\/ul>)/g,tree=>tree.replaceAll('<li>','<li>'+sketchFrame));
}
const topBar='<div class="mock-chrome"><span class="mock-dots" aria-hidden="true"><i></i><i></i><i></i></span><span>Полка</span></div>';
function browserMock(color='blue'){
 return `<div class="mock-browser" role="img" aria-label="Схематичный вид страницы Полка до нажатия: ${color==='green'?'зелёный':'синий'} заголовок Подсказка и кнопка Показать подсказку. Пояснение не показано и места в этой демонстрации не занимает.">${topBar}<div class="mock-content"><p class="mock-heading ${color==='green'?'is-green':''}">Подсказка</p><span class="mock-button">Показать подсказку</span></div><div class="mock-footnote">До нажатия · пояснение скрыто</div></div>`;
}
function figure(id,number,title,body,note){
 return `<figure class="lesson-figure" data-visual="${id}" aria-labelledby="visual-${id}"><figcaption><span class="visual-kicker">${id==='javascript'?'Демонстрация':'Схема'} ${String(number).padStart(2,'0')}${id==='javascript'?' · можно нажимать':''}</span><strong class="visual-title" id="visual-${id}">${title}</strong></figcaption>${sketchArtwork(body)}<p class="visual-note">${note}</p></figure>`;
}
const visuals=[
 figure('roles',1,'Три основные роли на одной странице',
  `<div class="roles-picture"><div class="role-cards"><div class="role-card role-html"><span class="visual-icon">${icon('html')}</span><strong>HTML</strong><p class="role-purpose">Содержание, структура и смысл</p><p class="role-example"><span>В «Полке»</span>Заголовок, абзац и кнопка с заданным назначением</p></div><div class="role-card role-css"><span class="visual-icon">${icon('css')}</span><strong>CSS</strong><p class="role-purpose">Оформление и расположение</p><p class="role-example"><span>В «Полке»</span>Синий заголовок; пояснение сначала скрыто</p></div><div class="role-card role-js"><span class="visual-icon">${icon('js')}</span><strong>JavaScript</strong><p class="role-purpose">Программные действия</p><p class="role-example"><span>В «Полке»</span>После нажатия программа показывает пояснение</p></div></div><div class="roles-branches" aria-hidden="true"><span></span><span></span><span></span></div><p class="roles-processing"><strong>Браузер обрабатывает материалы страницы</strong><span aria-hidden="true">↓</span></p><div class="single-page"><span class="visual-chip">Схематичный экран · до нажатия</span>${browserMock()}</div></div><details class="visual-limits"><summary>Как понимать разделение ролей</summary><ul><li>HTML также даёт встроенные действия, например переход по ссылке.</li><li>CSS может менять вид при взаимодействии, например при наведении указателя.</li><li>JavaScript может менять содержание, структуру и оформление, а также выполнять действия без нажатия кнопки.</li></ul></details>`,
  'Это схема основных ролей, а не порядка запуска технологий. Материалы могут быть организованы по-разному: ровно три отдельных файла не требуются. На экране показан момент до нажатия, поэтому предусмотренная реакция ещё не выполнена.'),
 figure('structure',2,'HTML описывает состав страницы',
  `<div class="structure-picture"><div class="structure-root"><span class="visual-icon">${icon('page')}</span><strong>Страница «Полка»</strong></div><ul class="parts-tree"><li><span class="part-icon">${icon('text')}</span><div><span class="part-label">Заголовок</span><strong>Подсказка</strong></div></li><li><span class="part-icon">${icon('page')}</span><div><span class="part-label">Абзац</span><strong>Перед встречей проверьте время</strong><span class="part-detail">Текст есть в данных, даже когда он скрыт</span></div></li><li><span class="part-icon">${icon('button')}</span><div><span class="part-label">Кнопка</span><strong>Показать подсказку</strong></div></li></ul></div>`,
  'Это упрощённая схема содержания, а не полный HTML-документ и не снимок экрана. Назначение части не определяется одним только размером или цветом текста.'),
 figure('appearance',3,'Тот же заголовок — другое оформление',
  `<div class="appearance-picture"><div><p class="visual-panel-label"><span class="color-swatch swatch-blue" aria-hidden="true"></span>Синий заголовок</p>${browserMock()}</div><div><p class="visual-panel-label"><span class="color-swatch swatch-green" aria-hidden="true"></span>Зелёный заголовок</p>${browserMock('green')}</div></div><div class="visual-equation"><span>Тот же текст</span><span>То же назначение в HTML</span><strong>Изменено только правило цвета в CSS</strong></div>`,
  'В обоих вариантах сравнивается один момент: до нажатия. Пояснение уже есть в данных, но не показано. В этом сравнении меняется только правило цвета заголовка в CSS.'),
 figure('javascript',4,'Нажмите — и проследите реакцию',
  `<p class="visual-intro">В этой демонстрации программа на JavaScript показывает уже полученный текст.</p><div class="demo-picture" data-lesson-demo>${topBar}<div class="mock-content"><h3 class="mock-heading">Подсказка</h3><p class="demo-hint" id="polka-demo-hint" hidden>Перед встречей проверьте время.</p><button class="demo-button" type="button" data-demo-show aria-controls="polka-demo-hint" aria-expanded="false">Показать подсказку</button></div><div class="demo-toolbar"><p class="demo-status" role="status" aria-live="polite" data-demo-status>Начальное состояние: пояснение скрыто.</p><button class="demo-reset" type="button" data-demo-reset>Начать заново</button></div></div><p class="event-flow-label">Предусмотренная последовательность после нажатия</p><ol class="event-flow"><li><span>1</span><strong>Нажатие</strong><small>Событие</small></li><li><span>2</span><strong>Выполнение реакции</strong><small>Программа меняет состояние абзаца</small></li><li><span>3</span><strong>Пояснение становится видно</strong><small>Результат этой реакции</small></li></ol>`,
  'Все материалы демонстрации уже получены. Нажатие не отправляет запрос, не записывает данные и не изменяет отметки урока. По внешнему виду других кнопок нельзя определить способ их работы.'),
 figure('local',5,'Всё происходит на вашем устройстве',
  `<div class="local-boundary"><p class="boundary-label">${icon('device')}Ваше устройство · браузер</p><div class="local-flow"><div class="state-card"><span class="visual-chip">До нажатия</span><strong>Текст пояснения уже есть</strong><span class="state-label">Абзац скрыт</span></div><div class="state-change"><span class="flow-arrow" aria-hidden="true">→</span><span>Нажатие<br>и выполнение реакции</span></div><div class="state-card state-visible"><span class="visual-chip">После нажатия</span><strong>Тот же текст пояснения</strong><span class="state-label">Абзац показан</span></div></div></div><div class="scenario-badges"><span>Нового запроса нет</span><span>Запись не предусмотрена</span></div>`,
  'Скрытый текст уже есть в полученных данных. В этом сценарии нажатие меняет только видимость абзаца. Отсутствие нового запроса и записи задано условиями, а не определено по виду кнопки.'),
 figure('network',6,'За новым списком нужно обратиться к сервису',
  `<p class="visual-intro">Другая история: вы нажали «Обновить список».</p><div class="exchange-picture" role="img" aria-label="1. Программа в браузере отправляет запрос за новым списком. 2. Серверная программа обрабатывает запрос и готовит ответ. 3. Ответ с нужными данными возвращается в браузер."><div class="exchange-endpoint"><span class="endpoint-icon">${icon('device')}</span><strong>Ваше устройство</strong><span>Программа в браузере</span><small>Отправляет запрос<br>и использует ответ</small></div><div class="exchange-routes"><div class="exchange-route request"><span><strong>1. Запрос</strong><br>за новым списком</span><b aria-hidden="true">→</b></div><div class="exchange-route response"><b aria-hidden="true">←</b><span><strong>3. Ответ</strong><br>с новыми данными</span></div></div><div class="exchange-endpoint server-endpoint"><span class="endpoint-icon">${icon('server')}</span><strong>Сервис</strong><span>Серверная программа</span><small><strong>2. Обработка запроса</strong><br>Подготовка ответа</small></div></div><div class="exchange-result"><strong>4. Обновление списка.</strong> Программа в браузере использует полученные данные и меняет страницу.</div>`,
  'По условию сервер прислал нужные данные и обмен завершился успешно. Схема показывает последовательность этого сценария; реальный запрос здесь не выполняется.'),
 figure('saving',7,'Показано на экране — ещё не значит сохранено',
  `<div class="saving-picture"><div class="saving-state"><span class="endpoint-icon">${icon('eye')}</span><strong>Изменение видно</strong><span>Что мы наблюдаем<br>в интерфейсе</span></div><div class="saving-inference"><span aria-hidden="true">?</span><strong>Не подтверждает</strong></div><div class="saving-state"><span class="endpoint-icon">${icon('save')}</span><strong>Записана ли эта версия?</strong><span>Нужны отдельные сведения<br>о результате записи</span></div></div><p class="saving-conclusion">Текст может быть сохранён или не сохранён. Из одного показа это неизвестно.</p>`,
  'Для вывода о сохранении нужно подтверждение записи именно нужной версии. В местном примере с подсказкой запись не предусмотрена — это известно из его условий.')
];

export function illustrateLesson(id,html){
 if(id.startsWith('11.'))return illustrateModule11(html,id,figure);
 if(id.startsWith('10.'))return illustrateModule10(html,id,figure);
 if(id.startsWith('9.'))return illustrateModule9(html,id,figure);
 if(id.startsWith('8.'))return illustrateModule8(html,id,figure);
 if(id.startsWith('7.')&&id!=='7.5')return illustrateModule7(html,id,figure);
 if(id.startsWith('6.'))return illustrateModule6(html,id,figure);
 if(id.startsWith('5.'))return illustrateModule5(id,html,{figure});
 if(id.startsWith('4.'))return illustrateModule4(id,html,{figure});
 if(id.startsWith('3.'))return illustrateModule3(id,html,{figure});
 if(id.startsWith('2.'))return illustrateModule2(id,html,{figure});
 if(id==='1.4')return illustrateFourthLesson(html,{figure});
 if(id==='1.3')return illustrateThirdLesson(html,{figure});
 if(id==='1.2')return illustrateSecondLesson(html,{figure,sketchFrame});
 if(id==='1.1')return illustrateFirstLesson(html,{figure,sketchFrame});
 if(id!=='7.5')return html;
 for(let section=2;section<=8;section++){
  const start=html.indexOf(`<h2 id="l7-5-${section}"`);
  const end=html.indexOf('<h2 ',start+1);
  if(start<0||end<0)throw new Error(`Не найден раздел ${section} урока 7.5`);
  const part=html.slice(start,end);
  const pattern=/<div class="diagram-frame"><pre\b[\s\S]*?<\/pre><\/div>/;
  if(!pattern.test(part))throw new Error(`Нет текстовой схемы в разделе ${section} урока 7.5`);
  const illustrated=part.replace(pattern,original=>visuals[section-2]+`<details class="visual-transcript"><summary>Текстовое представление схемы</summary>${original}</details>`);
  html=html.slice(0,start)+illustrated+html.slice(end);
 }
 return modernizeLegacy7(html);
}

