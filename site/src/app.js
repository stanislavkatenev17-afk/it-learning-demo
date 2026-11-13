'use strict';
const UI=window.CourseUI;
const C=window.COURSE,main=document.querySelector('#main'),sidebar=document.querySelector('#sidebar'),menu=document.querySelector('#menu');
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const marks=new Map(),results=new Map();let lastLesson=null,quiz=null,currentHash='',observer=null;
const completed=id=>(marks.get(id)||[]).filter(Boolean).length===3;
const moduleLessons=id=>C.lessons.filter(l=>l.module===id);
const totalDone=()=>C.lessons.filter(l=>completed(l.id)).length;
const route=()=>{const [path,query='']=location.hash.slice(1).split('?');return {parts:(path||'/home').split('/').filter(Boolean),params:new URLSearchParams(query)}};
const lessonLink=(id,label)=>`<a href="#/lesson/${id}">${esc(label)}</a>`;
const note='<p class="session-note notice">Отметки, результаты и место остановки действуют только в этой вкладке до обновления страницы. Постоянное сохранение пока не подключено.</p>';
function closeMenu(){menu.setAttribute('aria-expanded','false');sidebar.classList.remove('is-open')}
function revealCurrentLesson(){const inner=sidebar.querySelector('.sidebar-inner'),active=sidebar.querySelector('.nav-lessons a[aria-current="page"]');if(inner?.clientHeight&&active)inner.scrollTop=Math.max(0,active.offsetTop-inner.clientHeight*.48)}
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));sidebar.classList.toggle('is-open',open);if(open)revealCurrentLesson()});
sidebar.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!document.querySelector('dialog[open]')){closeMenu();menu.focus()}});
function side(lesson){
 const nav=`<nav class="mobile-global" aria-label="Страницы"><a href="#/home">Главная</a><a href="#/course">Программа</a><a href="#/glossary">Словарь</a><a href="#/progress">Мой прогресс</a></nav>`;
 const currentModule=lesson?.module||+(route().parts[1]||0),r=route().parts[0];
 sidebar.innerHTML=`<div class="sidebar-inner">${nav}<a class="sidebar-course" href="#/course"><span class="course-symbol" aria-hidden="true">≡</span><span>Введение в IT<small>11 модулей · 64 урока</small></span></a><p class="sidebar-label">Программа обучения</p><nav class="module-nav" aria-label="Модули курса">${C.modules.map(m=>`<div class="nav-module"><a href="#/module/${m.id}" ${m.id===currentModule?'aria-current="'+(r==='module'?'page':'true')+'"':''}><span class="nav-number">${String(m.id).padStart(2,'0')}</span><span>${esc(m.title)}</span></a>${lesson&&m.id===lesson.module?`<nav class="nav-lessons" aria-label="Уроки модуля">${moduleLessons(m.id).map(l=>`<a href="#/lesson/${l.id}" ${l.id===lesson.id?'aria-current="page"':''}><span class="lesson-dot" aria-hidden="true">${completed(l.id)?'✓':''}</span><span>${esc(l.title)}${l.id===lesson.id?`<small class="current-lesson-label">Вы здесь · ${l.id}</small>`:''}</span></a>`).join('')}<a href="#/quiz/${m.id}"><span class="lesson-dot quiz-dot" aria-hidden="true">?</span><span>Проверка модуля</span></a></nav>`:''}</div>`).join('')}</nav><p class="sidebar-note"><span aria-hidden="true">↗</span> В своём темпе<br>Все материалы открыты</p></div>`;
 const outline=document.querySelector('#lesson-outline');outline.hidden=!lesson;
 outline.innerHTML=lesson?`<div class="outline-inner"><p class="sidebar-label">В этом уроке</p><nav aria-label="Разделы урока">${lesson.headings.map((h,i)=>`<a href="#/lesson/${lesson.id}?section=${h.id}"><span>${String(i+1).padStart(2,'0')}</span>${esc(h.title.replace(/^\d+[.)]\s*/,''))}</a>`).join('')}</nav><a class="outline-completion" href="#/lesson/${lesson.id}?section=completion">Отметки о прохождении <span aria-hidden="true">↗</span></a></div>`:'';
 requestAnimationFrame(revealCurrentLesson);
}
function techBackdrop(){return `<svg class="tech-backdrop" viewBox="0 0 220 170" fill="none" aria-hidden="true" focusable="false"><g stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="m28 27-9 9 9 9m26-18 9 9-9 9m-16 5 6-27"/><rect x="118" y="12" width="34" height="28" rx="5"/><rect x="178" y="58" width="30" height="28" rx="5"/><rect x="102" y="95" width="34" height="28" rx="5"/><path d="M152 26h41v32m-75-32H89v83h13m34 0h57V86"/><circle cx="89" cy="68" r="3" fill="white"/><rect x="24" y="100" width="36" height="36" rx="5"/><rect x="33" y="109" width="18" height="18" rx="2"/><path d="M31 95v5m10-5v5m10-5v5m-20 36v5m10-5v5m10-5v5m-32-34h5m-5 10h5m-5 10h5m36-20h5m-5 10h5m-5 10h5"/></g><g fill="currentColor" font-family="Consolas,monospace" font-size="11"><text x="120" y="31">{ }</text><text x="181" y="77">&gt;_</text><text x="155" y="151">01 10</text></g></svg>`}
function topicIcon(id){
 const drawings=[
  '<rect x="4" y="5" width="24" height="22" rx="4"/><path d="m11 12-4 4 4 4m10-8 4 4-4 4m-7 2 4-8"/>',
  '<path d="M3 10V6h10l3 4h13v16H3Zm0 0h26M9 15h8m-8 5h13"/>',
  '<rect x="8" y="8" width="16" height="16" rx="3"/><rect x="12" y="12" width="8" height="8" rx="1"/><path d="M11 3v5m5-5v5m5-5v5M11 24v5m5-5v5m5-5v5M3 11h5m-5 5h5m-5 5h5m16-10h5m-5 5h5m-5 5h5"/>',
  '<rect x="4" y="5" width="24" height="22" rx="4"/><path d="M9 11v10m5-10h5v10h-5zm10 0v10"/>',
  '<rect x="4" y="5" width="24" height="22" rx="3"/><path d="M4 11h24M9 8h1m3 0h1m3 0h1m-9 8h6m-6 5h14"/>',
  '<rect x="11" y="3" width="10" height="8" rx="2"/><rect x="2" y="22" width="10" height="8" rx="2"/><rect x="20" y="22" width="10" height="8" rx="2"/><path d="M16 11v6M7 22v-5h18v5"/>',
  '<circle cx="16" cy="16" r="12"/><ellipse cx="16" cy="16" rx="5" ry="12"/><path d="M4 16h24M7 9h18M7 23h18"/>',
  '<rect x="3" y="3" width="11" height="11" rx="2"/><rect x="18" y="3" width="11" height="11" rx="2"/><rect x="3" y="18" width="11" height="11" rx="2"/><path d="M18 23h11m-6-5v11"/>',
  '<path d="m10 8-7 8 7 8m12-16 7 8-7 8m-9 4 6-24"/>',
  '<path d="m16 3 11 5v8c0 7-11 13-11 13S5 23 5 16V8Z"/><path d="m10 16 4 4 8-9"/>',
  '<circle cx="8" cy="6" r="3"/><circle cx="8" cy="26" r="3"/><circle cx="24" cy="9" r="3"/><path d="M8 9v14m0-5c9 0 16-1 16-6"/>'
 ];
 return `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${drawings[(id-1)%drawings.length]}</svg>`;
}
function techRibbon(){return `<div class="tech-ribbon" aria-hidden="true">${[2,6,9,10].map(id=>`<span class="tech-mark">${topicIcon(id)}</span>`).join('')}<span class="tech-bits">01<span>10</span></span></div>`}
function header(label,title,lead,extra='',titleHtml=''){return `<header class="lesson-header">${techBackdrop()}<p class="lesson-label">${esc(label)}</p><h1>${titleHtml||esc(title)}</h1><p class="lead">${esc(lead)}</p>${techRibbon()}${extra}</header>`}
function overview(){return `<div class="course-stats"><span><strong>11</strong> модулей</span><span><strong>64</strong> урока</span><span><strong>В своём темпе</strong> без ограничений доступа</span></div>`}
function lessonRows(list){return `<ol class="lesson-list">${list.map(l=>`<li><span class="row-id">${l.id}</span>${lessonLink(l.id,l.title)}<span class="row-status">${completed(l.id)?'Завершён':(marks.get(l.id)||[]).some(Boolean)?'Есть отметки':'Открыт'}</span></li>`).join('')}</ol>`}
function moduleCard(m){return UI.moduleCard(m,route().parts[0]==='module'||m.id===1)}

function home(){main.innerHTML=UI.home()}

function course(){main.innerHTML=header('Программа курса','От первого знакомства до целой картины','Все уроки доступны сразу. Рекомендуем двигаться последовательно: новые объяснения опираются на предыдущие.')+overview()+`<div class="module-list">${C.modules.map(moduleCard).join('')}</div>`}
function modulePage(id){const m=C.modules.find(m=>m.id===+id);if(!m)return missing();main.innerHTML=header(`Модуль ${m.id}`,m.title,'Изучите уроки, выполните практику и разберите вопросы. Затем можно пройти отдельную проверку.')+moduleCard(m)+note}
function completionBlock(l){return UI.completion(l)}

function lessonContents(l){return `<details class="mobile-outline"><summary>Содержание урока <span>${l.headings.length} разделов</span></summary><nav aria-label="Разделы урока">${l.headings.map(h=>`<a href="#/lesson/${l.id}?section=${h.id}">${esc(h.title)}</a>`).join('')}</nav></details>`}
function setupLessonVisuals(){
 const demo=main.querySelector('[data-lesson-demo]');if(!demo)return;
 const show=demo.querySelector('[data-demo-show]'),reset=demo.querySelector('[data-demo-reset]'),hint=demo.querySelector('#polka-demo-hint'),status=demo.querySelector('[data-demo-status]');
 const update=visible=>{hint.hidden=!visible;demo.dataset.shown=String(visible);show.setAttribute('aria-expanded',String(visible));status.textContent=visible?'Действие выполнено: пояснение показано.':'Начальное состояние: пояснение скрыто.'};
 show.addEventListener('click',()=>update(true));reset.addEventListener('click',()=>update(false));
}
function lessonPage(id){const l=C.lessons.find(l=>l.id===id);if(!l)return missing();lastLesson=id;const count=(marks.get(id)||[]).filter(Boolean).length,idx=C.lessons.indexOf(l),prev=C.lessons[idx-1],next=C.lessons[idx+1];
 main.innerHTML=`<div class="lesson-topline"><a href="#/module/${l.module}">Модуль ${l.module} · Урок ${l.number}</a><a href="#/lesson/${id}?section=completion">Мои отметки <span id="count">${count} из 3</span></a></div>`+header(C.modules.find(m=>m.id===l.module).title,l.title,'Читайте в своём темпе. Вопросы и практика помогут проверить, как вы поняли объяснения.','',l.titleHtml)+lessonContents(l)+`<article class="prose">${l.html}</article>`+completionBlock(l)+`<footer class="lesson-footer"><div class="lesson-pagination">${prev?lessonLink(prev.id,'← '+prev.id+'. '+prev.title):'<span>Первый урок курса</span>'}${next?lessonLink(next.id,next.id+'. '+next.title+' →'):'<a href="#/progress">Посмотреть итоги прохождения →</a>'}</div><p><a href="#/quiz/${l.module}">Перейти к проверке модуля ${l.module}</a></p><p>Переход дальше доступен независимо от отметок и результатов.</p></footer>`;
 main.querySelectorAll('[data-mark]').forEach(input=>input.addEventListener('change',()=>{const values=[...main.querySelectorAll('[data-mark]')].map(x=>x.checked);marks.set(id,values);const n=values.filter(Boolean).length;document.querySelector('#count').textContent=`${n} из 3`;document.querySelector('#completion-status').textContent=n===3?'Урок завершён по вашим отметкам.':`Отмечено ${n} из 3.`;const dot=sidebar.querySelector(`.nav-lessons a[href="#/lesson/${id}"] .lesson-dot`);if(dot)dot.textContent=n===3?'✓':'';UI.syncCompletion()}));
 setupLessonVisuals();
 observer=new IntersectionObserver(entries=>{for(const e of entries){if(!e.isIntersecting)continue;for(const a of document.querySelectorAll('nav[aria-label="Разделы урока"] a')){const active=a.href.endsWith('section='+e.target.id);a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current')}}},{rootMargin:'-80px 0px -65% 0px'});main.querySelectorAll('.prose h2').forEach(h=>observer.observe(h));
}
function progress(){main.innerHTML=UI.progress()}

function glossaryPage(params){UI.glossary(params)}

function quizPage(id){const m=C.modules.find(m=>m.id===+id);if(!m)return missing();const qs=C.questions.filter(q=>q.module===m.id),last=results.get(m.id);if(!quiz||quiz.module!==m.id)quiz={module:m.id,answers:{},completed:!!last,result:last};
 const intro=header(`Проверка модуля ${m.id}`,m.title,'В каждом задании выберите один ответ. После проверки разберите объяснения и при необходимости вернитесь к урокам. Попытки не ограничены.');
 if(quiz.completed){const r=quiz.result;main.innerHTML=intro+`<section class="result-box" role="status"><h2>Результат: ${r.score} из ${r.total}</h2><p>Результат не меняет отметки уроков и не закрывает доступ к материалам. Редакция набора: 2.</p><button class="button" id="retry">Начать новую попытку</button></section>`+note+qs.map((q,i)=>`<section class="quiz-card"><p class="lesson-label">Задание ${i+1}</p>${q.prompt}<p><strong>Ваш ответ:</strong> ${esc(r.answers[q.id])}. ${q.options.find(o=>o.key===r.answers[q.id]).html}</p><p class="${r.answers[q.id]===q.key?'correct':'incorrect'}">${r.answers[q.id]===q.key?'Верно.':'Есть ошибка.'} Верный ответ: ${esc(q.key)}.</p><div class="explanation">${q.explanation}</div>${lessonLink(q.lesson,'Повторить урок '+q.lesson)}</section>`).join('');document.querySelector('#retry').addEventListener('click',()=>{quiz={module:m.id,answers:{},completed:false};quizPage(id);main.focus();window.scrollTo(0,0)});UI.setupQuiz();return;}
 main.innerHTML=intro+`<p class="notice">Ответьте на все ${qs.length} ${qs.length===4?'задания':'заданий'}. Результат не меняет отметки и не ограничивает доступ к урокам.</p><form id="quiz-form" novalidate>${qs.map((q,i)=>`<fieldset class="quiz-card" id="question-${q.id}"><legend>Задание ${i+1} из ${qs.length}</legend>${q.prompt}<div class="options">${q.options.map(o=>`<label><input type="radio" name="${q.id}" value="${o.key}" ${quiz.answers[q.id]===o.key?'checked':''}><span>${o.key}. ${o.html}</span></label>`).join('')}</div></fieldset>`).join('')}<p id="quiz-error" role="alert"></p><button class="button" type="submit">Проверить ответы</button></form>${note}`;
 main.querySelectorAll('.options input').forEach(input=>input.addEventListener('change',()=>{quiz.answers[input.name]=input.value;input.closest('fieldset').classList.remove('unanswered')}));document.querySelector('#quiz-form').addEventListener('submit',event=>{event.preventDefault();const missing=qs.filter(q=>!quiz.answers[q.id]);if(missing.length){document.querySelector('#quiz-error').textContent=`Выберите ответ в заданиях: ${missing.map(q=>qs.indexOf(q)+1).join(', ')}. Попытка ещё не завершена.`;for(const q of missing)document.querySelector('#question-'+q.id).classList.add('unanswered');const el=document.querySelector('#question-'+missing[0].id+' input');el.focus();return;}const r={score:qs.filter(q=>quiz.answers[q.id]===q.key).length,total:qs.length,answers:{...quiz.answers},version:2};results.set(m.id,r);quiz.completed=true;quiz.result=r;quizPage(id);main.focus();window.scrollTo(0,0)});
}
function missing(){main.innerHTML=header('Страница не найдена','Вернёмся к программе','Такого урока или раздела нет в текущем курсе.')+'<a class="button" href="#/course">Программа курса</a>'}
const leaveDialog=document.createElement('dialog');leaveDialog.innerHTML='<h2>Выйти из проверки?</h2><p>Ответы незавершённой попытки будут сброшены. Последний завершённый результат останется до обновления страницы.</p><div class="actions"><button class="button" id="stay">Продолжить проверку</button><button class="button secondary" id="leave">Выйти без завершения</button></div>';document.body.append(leaveDialog);let pendingHash='';document.querySelector('#stay').addEventListener('click',()=>leaveDialog.close());document.querySelector('#leave').addEventListener('click',()=>{quiz=null;leaveDialog.close();location.hash=pendingHash});
window.addEventListener('beforeunload',e=>{if(quiz&&!quiz.completed&&Object.keys(quiz.answers).length){e.preventDefault();e.returnValue=''}});
function render(){
 const target=location.hash||'#/home';if(quiz&&!quiz.completed&&Object.keys(quiz.answers).length&&target.split('?')[0]!==`#/quiz/${quiz.module}`){pendingHash=target;history.replaceState(null,'',currentHash||'#/home');if(!leaveDialog.open)leaveDialog.showModal();return;}
 const r=route(),[kind,id]=r.parts,section=r.params.get('section');
 if(currentHash.split('?')[0]===target.split('?')[0]&&section){document.getElementById(section)?.scrollIntoView();currentHash=target;return;}
 document.body.dataset.page=kind;
 observer?.disconnect();closeMenu();side(kind==='lesson'?C.lessons.find(l=>l.id===id):null);
 if(kind==='home')home();else if(kind==='course')course();else if(kind==='module')modulePage(id);else if(kind==='lesson')lessonPage(id);else if(kind==='glossary')glossaryPage(r.params);else if(kind==='progress')progress();else if(kind==='quiz')quizPage(id);else missing();
 document.title=(main.querySelector('h1')?.innerText.replace(/\s+/g,' ')||'Введение в IT')+' — Обучающая платформа';currentHash=target;
 const navRoute=['lesson','module','quiz'].includes(kind)?'#/course':target.split('?')[0];
 document.querySelectorAll('.global-nav a').forEach(a=>{if(a.hash===navRoute)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});
 UI.afterRender();
 if(section)document.getElementById(section)?.scrollIntoView();else window.scrollTo({top:0,behavior:'instant'});main.focus({preventScroll:true});
}
document.addEventListener('click',e=>{const link=e.target.closest('a[href]');if(link?.getAttribute('href')==='#main'){e.preventDefault();main.focus();return}link?.closest('.mobile-outline')?.removeAttribute('open');if(link?.hash===location.hash&&link.hash.includes('?section=')){e.preventDefault();document.getElementById(route().params.get('section'))?.scrollIntoView();closeMenu()}});
if(window.CourseStartup?.canStart(C,UI)){
 try{UI.init();render();window.addEventListener('hashchange',render);window.CourseStartup.ready();}
 catch(error){window.CourseStartup.fail();console.error('Не удалось запустить курс:',error);}
}
