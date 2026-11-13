/* Собственные компоненты интерфейса. Данные и маршруты остаются в app.js. */
'use strict';
window.CourseUI=(()=>{
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const finePointer=matchMedia('(hover: hover) and (pointer: fine)');
 const checkIcon='<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 12 4 4 8-9"/></svg>';
 const searchIcon='<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></svg>';
 let navObservers=[],searchDialog,searchOrigin,searchItems=[],searchIndex=0,sidebarCollapsed=false,sidebarTimer;
 const lessonWord=n=>n%10===1&&n%100!==11?'урок':n%10>=2&&n%10<=4&&(n%100<12||n%100>14)?'урока':'уроков';
 const shortId=n=>String(n).padStart(2,'0');

 function motionModule(m){
 const lessons=moduleLessons(m.id),done=lessons.filter(l=>completed(l.id)).length;
 const descriptions={1:'Технологии вокруг нас, устройства и программы.',2:'Файлы, папки и уверенная работа за компьютером.',3:'Что внутри компьютера и как это работает.'};
 return `<section class="motion-module" data-module="${m.id}">
  <h3><button class="motion-module-toggle" aria-expanded="false" aria-controls="motion-module-${m.id}">
   <span class="motion-module-art" aria-hidden="true">${topicIcon(m.id)}<span class="motion-art-detail">${['{ }','↗','01'][m.id-1]}</span></span>
   <span class="motion-module-meta">МОДУЛЬ ${String(m.id).padStart(2,'0')} <span>${lessons.length} ${lessons.length===4?'урока':'уроков'}</span></span>
   <span class="motion-module-title">${esc(m.title)}</span>
   <span class="motion-module-description">${esc(descriptions[m.id])}</span>
   <span class="motion-module-bottom"><span class="motion-module-action">Посмотреть уроки</span><span class="motion-plus" aria-hidden="true">+</span></span>
  </button></h3>
  <div class="motion-module-panel" id="motion-module-${m.id}" hidden><div class="motion-module-content">
   <ol>${lessons.map(l=>`<li><a href="#/lesson/${l.id}"><span class="motion-lesson-id">${l.id}</span><span>${esc(l.title)}</span><span aria-hidden="true">↗</span></a></li>`).join('')}</ol>
   <a class="motion-module-link" href="#/module/${m.id}">Открыть модуль целиком <span aria-hidden="true">→</span></a>
   <p class="motion-module-status">${done} из ${lessons.length} уроков завершено</p>
  </div></div>
 </section>`;
}

function homeMarkup(){
 return `<div class="motion-home">
  <section class="motion-hero" aria-labelledby="motion-home-title">
   <div class="motion-hero-copy"><p class="motion-eyebrow"><span aria-hidden="true"></span> Понятный старт в мире технологий</p>
    <h1 id="motion-home-title">Разберитесь в IT.<br><span>Шаг за шагом.</span></h1>
    <p class="motion-hero-lead">Компьютеры, программы и интернет — понятным языком, на примерах из повседневной жизни.</p>
    <div class="motion-hero-actions"><a class="button" href="#/lesson/1.1">Начать обучение <span aria-hidden="true">↗</span></a><a class="motion-quiet" href="#/home?section=motion-program">Посмотреть программу <span aria-hidden="true">↓</span></a></div>
    <p class="motion-hero-note">Без технической подготовки · В своём темпе</p>
   </div>
   <aside class="motion-start" aria-labelledby="motion-start-title">
    <div class="motion-start-top"><span>ВАШ ПЕРВЫЙ ШАГ</span><span>01 / 11</span></div>
    <div class="motion-start-art" aria-hidden="true"><svg viewBox="0 0 360 170" fill="none"><path d="M48 124C90 39 224 23 311 91M44 128C97 48 221 30 315 96" stroke="currentColor" stroke-width="1.5" stroke-dasharray="5 7"/><circle cx="47" cy="125" r="6" fill="currentColor"/><circle cx="313" cy="95" r="6" fill="currentColor"/><path d="m62 46 7-10m221 103 10 5m-16-110 6-8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg><span class="motion-art-tile motion-art-tile-a">${topicIcon(2)}</span><span class="motion-art-tile motion-art-tile-b">IT<span>_</span></span><span class="motion-art-tile motion-art-tile-c">${topicIcon(6)}</span></div>
    <p class="motion-start-kicker">Модуль 1 · ${moduleLessons(1).length} урока</p><h2 id="motion-start-title">${esc(C.modules[0].title)}</h2>
    <p class="motion-start-description">Поймёте, как связаны технологии, устройства и программы.</p>
    <a class="motion-start-link" href="#/lesson/1.1"><span><small>НАЧНИТЕ ЗДЕСЬ</small>Урок 1.1 · Технологии вокруг нас</span><span aria-hidden="true">↗</span></a>
   </aside>
  </section>
  <div class="motion-facts"><span><b>11</b> модулей</span><span><b>64</b> урока</span><span><span class="motion-fact-icon" aria-hidden="true">↗</span> Объяснения и практика</span><span><span class="motion-fact-icon" aria-hidden="true">✓</span> Все материалы открыты</span></div>
  <section class="motion-program" id="motion-program" aria-labelledby="motion-program-title"><div class="motion-section-heading"><div><p class="motion-eyebrow">От простого к целой картине</p><h2 id="motion-program-title">Начните с основ</h2></div><a class="motion-quiet" href="#/course">Все 11 модулей <span aria-hidden="true">↗</span></a></div>
   <div class="motion-module-grid">${C.modules.slice(0,3).map(motionModule).join('')}</div>
  </section>
  <section class="motion-how" aria-labelledby="motion-how-title"><div><p class="motion-eyebrow">Ваш способ учиться</p><h2 id="motion-how-title">Читайте. Пробуйте.<br>Понимайте.</h2></div><ol><li><span>01</span><div><h3>Изучите материал</h3><p>Идите небольшими смысловыми шагами.</p></div></li><li><span>02</span><div><h3>Разберите вопросы</h3><p>Ответьте сами, затем раскройте объяснение.</p></div></li><li><span>03</span><div><h3>Выполните практику</h3><p>Сравните с образцом и отметьте выполненное.</p></div></li></ol></section>
  ${note}<p class="muted">Учебные тексты остаются редакторскими черновиками. Проверки на учениках пока не было.</p>
 </div>`;
};

 function completionMarkup(l){
 const saved=marks.get(l.id)||[false,false,false],count=saved.filter(Boolean).length;
 const labels=['Материал изучен','Вопросы разобраны','Практика выполнена'];
 const hints=['Вы прочитали объяснения и рассмотрели примеры.','Вы ответили на вопросы и сверились с разбором.','Вы выполнили задание и сравнили с образцом.'];
 return `<section class="completion motion-completion" id="completion" aria-labelledby="completion-title" data-count="${count}">
  <div class="motion-completion-heading"><div><p class="lesson-label">Ваше прохождение</p><h2 id="completion-title">Отметьте, что вы сделали</h2></div><span class="motion-completion-score" aria-hidden="true"><b>${count}</b> / 3</span></div>
  <p>Каждую отметку можно поставить и снять независимо от остальных.</p>
  <div class="motion-progress" role="progressbar" aria-label="Отметки прохождения урока" aria-valuemin="0" aria-valuemax="3" aria-valuenow="${count}"><span style="width:${count/3*100}%"></span></div>
  <div class="checks motion-checks">${labels.map((label,i)=>`<label class="motion-check"><input type="checkbox" data-mark="${i}" ${saved[i]?'checked':''}><span class="motion-check-symbol" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="m6 12 4 4 8-9"/></svg></span><span class="motion-check-copy"><strong>${label}</strong><small>${hints[i]}</small></span><span class="motion-check-number" aria-hidden="true">0${i+1}</span></label>`).join('')}</div>
  <p id="completion-status" role="status">${count===3?'Урок завершён по вашим отметкам.':`Отмечено ${count} из 3.`}</p>${note}
 </section>`;
};


 function moduleCard(m,expanded=false){
  const lessons=moduleLessons(m.id),done=lessons.filter(l=>completed(l.id)).length;
  return `<section class="module-card ui-program-card" data-tone="${(m.id-1)%3}"><h2 class="ui-module-heading"><button class="module-card-top ui-program-toggle" aria-expanded="${expanded}" aria-controls="ui-module-${m.id}"><span class="module-index">${shortId(m.id)}</span><span class="ui-module-copy"><span class="ui-module-title">${esc(m.title)}</span><span class="ui-module-description">${lessons.length} ${lessonWord(lessons.length)} · ${done} завершено</span></span><span class="module-emblem" aria-hidden="true">${topicIcon(m.id)}</span><span class="ui-disclosure-icon" aria-hidden="true">+</span></button></h2><div class="ui-module-panel" id="ui-module-${m.id}" ${expanded?'':'hidden'}><div>${lessonRows(lessons)}<a class="text-action" href="#/quiz/${m.id}">Проверка модуля <span aria-hidden="true">→</span></a></div></div></section>`;
 }

 function fanMarkup(){
  const lessons=moduleLessons(1).slice(0,3);
  return `<div class="ui-fan"><div class="ui-fan-art" aria-hidden="true">${lessons.map((l,i)=>`<div class="ui-fan-paper" style="--fan-i:${i}"><span>${l.id}</span>${topicIcon(i+1)}<b>${esc(l.title)}</b></div>`).join('')}</div><button class="ui-fan-toggle" aria-expanded="false" aria-controls="ui-fan-lessons">Первые три урока <span aria-hidden="true">+</span></button><div id="ui-fan-lessons" hidden><ol>${lessons.map(l=>`<li>${lessonLink(l.id,l.id+' · '+l.title)}</li>`).join('')}</ol></div></div>`;
 }

 function progressMarkup(){
  const done=totalDone(),started=C.lessons.filter(l=>(marks.get(l.id)||[]).some(Boolean)&&!completed(l.id)).length;
  const first=C.lessons.find(l=>!completed(l.id));
  const stats=[['Завершено уроков',done,'из 64'],['В процессе',started,lessonWord(started)+' с неполными отметками'],['Проверок завершено',results.size,'из 11 модулей']];
  return header('Мой прогресс','Ваш путь по курсу','Завершение основано на ваших трёх отметках в каждом уроке. Результаты проверок учитываются отдельно.')+`<div class="ui-stat-grid">${stats.map(([label,value,caption])=>`<section class="ui-stat-card"><h2>${label}</h2><p class="ui-stat-value">${value}<span>${caption}</span></p></section>`).join('')}</div>`+note+`<div class="actions">${lastLesson?`<a class="button" href="#/lesson/${lastLesson}">Продолжить с урока ${lastLesson} <span aria-hidden="true">↗</span></a>`:'<a class="button" href="#/lesson/1.1">Начать первый урок</a>'}${first?lessonLink(first.id,'Первый незавершённый: '+first.id):'<p>Все уроки завершены по вашим отметкам.</p>'}</div><section class="ui-path" aria-labelledby="ui-path-title"><div class="ui-section-heading"><h2 id="ui-path-title">Маршрут по модулям</h2><span>Все модули доступны</span></div><ol class="ui-path-grid">${C.modules.map(m=>{
   const lessons=moduleLessons(m.id),n=lessons.filter(l=>completed(l.id)).length;
   return `<li><a href="#/module/${m.id}" class="${n===lessons.length?'is-complete':''}"><span class="ui-path-number">${n===lessons.length?'✓':shortId(m.id)}</span><span>${esc(m.title)}<small>${n} из ${lessons.length} уроков</small><span class="ui-path-track" aria-hidden="true"><span style="width:${n/lessons.length*100}%"></span></span></span></a></li>`;
  }).join('')}</ol></section><h2>Результаты проверок</h2><div class="progress-modules">${C.modules.map(m=>{const r=results.get(m.id);return `<section class="progress-row"><h3><a href="#/module/${m.id}">${m.id}. ${esc(m.title)}</a></h3><p class="muted">${r?`Последняя проверка: ${r.score} из ${r.total}, редакция 2.`:'Проверка ещё не завершена.'} <a href="#/quiz/${m.id}">Открыть проверку</a></p></section>`}).join('')}</div>`;
 }

 function glossary(params){
  const initial=params.get('q')||'';
  main.innerHTML=header('Словарь','Понятные объяснения терминов','Определения собраны из словарей уроков. Для одного термина могут быть разные пояснения в зависимости от темы.')+`<div class="ui-glossary-controls"><div><label class="search-label" for="term-search">Найти термин</label><input class="search" id="term-search" type="search" placeholder="Например, файл или браузер" value="${esc(initial)}"></div><div class="ui-segmented" role="group" aria-label="Представление словаря"><button type="button" aria-pressed="true" data-dictionary-view="list">Список</button><button type="button" aria-pressed="false" data-dictionary-view="cards">Карточки</button></div></div><p id="term-count" role="status" class="muted"></p><div id="terms"></div>`;
  const input=main.querySelector('#term-search'),terms=main.querySelector('#terms');
  let mode='list',found=[],index=0,revealed=false;
  const renderCards=direction=>{
   const term=found[index];
   if(!term){terms.innerHTML='<div class="editorial-box"><h2>Совпадений нет</h2><p>Попробуйте другую часть слова.</p></div>';return;}
   terms.innerHTML=`<section class="ui-study" aria-labelledby="ui-study-title"><div class="ui-study-top"><span>Повторение терминов</span><span id="ui-study-position" role="status">${index+1} из ${found.length}</span></div><div class="ui-study-card" id="ui-study-card"><p class="lesson-label">Объясните своими словами</p><h2 id="ui-study-title">${esc(term.term)}</h2><button class="button secondary ui-reveal" aria-expanded="${revealed}" aria-controls="ui-study-answer">${revealed?'Скрыть объяснение':'Показать объяснение'}</button><div class="ui-study-answer" id="ui-study-answer" ${revealed?'':'hidden'}>${term.entries[0].definition}<p>${lessonLink(term.entries[0].lesson,'Подробнее в уроке '+term.entries[0].lesson)}</p></div></div><div class="ui-study-navigation"><button class="button secondary" id="ui-study-prev" ${index===0?'disabled':''}>← Назад</button><span>Можно листать свайпом</span><button class="button" id="ui-study-next" ${index===found.length-1?'disabled':''}>Следующий →</button></div><p class="ui-study-note">Самопроверка без оценки. Ответы не меняют отметки уроков.</p></section>`;
   const card=terms.querySelector('.ui-study-card');
   if(direction&&!reduced.matches)card.animate([{opacity:.35,transform:`translateX(${direction*18}px)`},{opacity:1,transform:'translateX(0)'}],{duration:220,easing:'ease-out'});
   terms.querySelector('.ui-reveal').addEventListener('click',()=>{revealed=!revealed;const answer=terms.querySelector('#ui-study-answer'),button=terms.querySelector('.ui-reveal');answer.hidden=!revealed;button.setAttribute('aria-expanded',String(revealed));button.textContent=revealed?'Скрыть объяснение':'Показать объяснение';});
   const step=delta=>{if(index+delta<0||index+delta>=found.length)return;index+=delta;revealed=false;const focusId=document.activeElement?.id;renderCards(delta);if(focusId?.startsWith('ui-study-')){const button=terms.querySelector('#'+focusId);if(button&&!button.disabled)button.focus({preventScroll:true});else terms.querySelector('.ui-reveal').focus({preventScroll:true});}};
   terms.querySelector('#ui-study-prev').addEventListener('click',()=>step(-1));terms.querySelector('#ui-study-next').addEventListener('click',()=>step(1));
   let start=null;
   card.addEventListener('pointerdown',e=>{if(e.isPrimary&&e.button===0&&!e.target.closest('a,button,input'))start={x:e.clientX,y:e.clientY,id:e.pointerId};});
   card.addEventListener('pointerup',e=>{if(!start||start.id!==e.pointerId)return;const dx=e.clientX-start.x,dy=e.clientY-start.y;start=null;if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy)*1.7)step(dx<0?1:-1);});
   card.addEventListener('pointercancel',()=>{start=null;});
  };
  const update=()=>{
   const value=input.value.trim().toLocaleLowerCase('ru');found=C.glossary.filter(t=>t.term.toLocaleLowerCase('ru').includes(value));index=0;revealed=false;
   document.querySelector('#term-count').textContent=`Найдено терминов: ${found.length}`;
   if(mode==='cards'){renderCards();return;}
   terms.innerHTML=found.length?found.map(t=>`<section class="term"><h2>${esc(t.term)}</h2>${t.entries[0].definition}<p>${lessonLink(t.entries[0].lesson,'Подробнее в уроке '+t.entries[0].lesson)}</p>${t.entries.length>1?`<details><summary>Объяснения в других уроках (${t.entries.length-1})</summary>${t.entries.slice(1).map(e=>`<div class="term-variant">${e.definition}${lessonLink(e.lesson,'Урок '+e.lesson)}</div>`).join('')}</details>`:''}</section>`).join(''):'<div class="editorial-box"><h2>Совпадений нет</h2><p>Попробуйте другую часть слова.</p></div>';
  };
  input.addEventListener('input',update);
  main.querySelectorAll('[data-dictionary-view]').forEach(button=>button.addEventListener('click',()=>{mode=button.dataset.dictionaryView;main.querySelectorAll('[data-dictionary-view]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));update();}));
  update();
 }

 function animateDisclosure(button,panel){
  const opening=button.getAttribute('aria-expanded')!=='true',start=panel.getBoundingClientRect().height;
  panel.getAnimations().forEach(a=>a.cancel());button.setAttribute('aria-expanded',String(opening));
  const card=button.closest('.motion-module,.ui-program-card,.ui-fan');card?.classList.toggle('is-expanded',opening);
  const label=button.querySelector('.motion-module-action');if(label)label.textContent=opening?'Свернуть уроки':'Посмотреть уроки';
  panel.hidden=false;panel.inert=!opening;
  if(reduced.matches){panel.hidden=!opening;return;}
  const end=opening?panel.scrollHeight:0;
  const animation=panel.animate([{height:start+'px',opacity:opening?.35:1},{height:end+'px',opacity:opening?1:0}],{duration:300,easing:'cubic-bezier(.22,.8,.25,1)'});
  animation.onfinish=()=>{panel.hidden=!opening;};
 }

 function syncCompletion(){
  const completion=main.querySelector('.motion-completion');if(!completion)return;
  const count=[...completion.querySelectorAll('[data-mark]')].filter(input=>input.checked).length,previous=Number(completion.dataset.count);
  completion.dataset.count=String(count);completion.querySelector('.motion-completion-score b').textContent=count;
  completion.querySelector('.motion-progress').setAttribute('aria-valuenow',String(count));completion.querySelector('.motion-progress>span').style.width=count/3*100+'%';
  if(count===3&&previous!==3&&!reduced.matches)completion.querySelector('.motion-completion-score').animate([{transform:'scale(1)'},{transform:'scale(1.08)'},{transform:'scale(1)'}],{duration:280,easing:'ease-out'});
 }

 function updateNav(){
  document.querySelectorAll('.ui-pill-nav').forEach(nav=>{
   const active=nav.querySelector('a[aria-current="page"]'),indicator=nav.querySelector('.ui-nav-indicator');
   if(!active||!nav.getClientRects().length){indicator.style.opacity='0';return;}
   const n=nav.getBoundingClientRect(),a=active.getBoundingClientRect();
   indicator.style.width=a.width+'px';indicator.style.height=a.height+'px';
   indicator.style.transform=`translate(${a.left-n.left-nav.clientLeft}px,${a.top-n.top-nav.clientTop}px)`;indicator.style.opacity='1';
  });
 }

 async function copyText(text){
  if(navigator.clipboard?.writeText){try{await navigator.clipboard.writeText(text);return;}catch{/* Локальный файл может не предоставлять Clipboard API. */}}
  const textarea=document.createElement('textarea');textarea.value=text;textarea.setAttribute('readonly','');textarea.setAttribute('aria-hidden','true');textarea.style.cssText='position:fixed;left:0;top:0;opacity:0;pointer-events:none';document.body.append(textarea);textarea.select();
  try{if(!document.execCommand('copy'))throw new Error('copy-unavailable');}finally{textarea.remove();}
 }
 function setupCopy(){
  main.querySelectorAll('.prose pre').forEach((pre,i)=>{
   const code=pre.querySelector('code');
   // Копирование предназначено для размеченных примеров кода, не текстовых схем.
   if(!code||pre.closest('.visual-transcript')||/Пример (?:text|схемы)$/.test(pre.getAttribute('aria-label')||'')||pre.dataset.uiCopy)return;
   pre.dataset.uiCopy='true';const wrapper=document.createElement('div');wrapper.className='ui-code-sample';pre.before(wrapper);
   const toolbar=document.createElement('div');toolbar.className='ui-code-toolbar';toolbar.innerHTML=`<span>Пример кода</span><button type="button" class="ui-copy" aria-label="Скопировать пример кода ${i+1}"><span class="ui-copy-icon" aria-hidden="true">⧉</span><span class="ui-copy-label" aria-live="polite">Копировать</span></button>`;wrapper.append(toolbar,pre);
   const button=toolbar.querySelector('button'),label=button.querySelector('.ui-copy-label');
   button.addEventListener('click',async()=>{button.disabled=true;button.dataset.state='pending';label.textContent='Копируем…';button.querySelector('.ui-copy-icon').textContent='';
    try{await copyText(code.textContent);if(button.isConnected){button.dataset.state='success';label.textContent='Скопировано';button.querySelector('.ui-copy-icon').innerHTML=checkIcon;}}
    catch{if(button.isConnected){button.dataset.state='error';label.textContent='Не удалось скопировать';button.querySelector('.ui-copy-icon').textContent='!';}}
    finally{button.disabled=false;if(button.isConnected)button.focus({preventScroll:true});}
   });
  });
 }

 function scramble(span){
  if(reduced.matches||span.dataset.running)return;const original=span.dataset.scramble;span.dataset.running='true';let start;
  const frame=time=>{if(start===undefined)start=time;const elapsed=time-start;if(elapsed>=260||reduced.matches||!span.isConnected){span.textContent=original;delete span.dataset.running;return;}
   span.textContent=[...original].map((char,i)=>elapsed>90+i*70?char:'<>/01'[Math.floor(Math.random()*5)]).join('');requestAnimationFrame(frame);
  };requestAnimationFrame(frame);
 }
 function setupMicroInteractions(){
  main.querySelectorAll('[data-magnetic]').forEach(button=>{if(button.dataset.uiMagneticBound)return;button.dataset.uiMagneticBound='true';
   const content=button.querySelector('.ui-magnetic-content');if(!content)return;
   button.addEventListener('pointermove',e=>{if(!finePointer.matches||reduced.matches)return;const b=button.getBoundingClientRect();content.style.transform=`translate(${(e.clientX-b.left-b.width/2)/b.width*5}px,${(e.clientY-b.top-b.height/2)/b.height*5}px)`;});
   button.addEventListener('pointerleave',()=>content.style.transform='');button.addEventListener('blur',()=>content.style.transform='');
  });
  main.querySelectorAll('.motion-start').forEach(card=>{if(card.dataset.uiScrambleBound)return;card.dataset.uiScrambleBound='true';const run=()=>card.querySelectorAll('[data-scramble]').forEach(scramble);card.addEventListener('pointerenter',()=>{if(finePointer.matches)run();});card.addEventListener('focusin',run);});
 }

 function syncSidebar(){
  document.body.classList.toggle('ui-sidebar-collapsed',sidebarCollapsed);
  const button=document.querySelector('#sidebar-toggle');if(!button)return;button.setAttribute('aria-expanded',String(!sidebarCollapsed));button.setAttribute('aria-label',sidebarCollapsed?'Показать программу':'Скрыть программу');button.title=sidebarCollapsed?'Показать программу':'Скрыть программу';
  const hidden=sidebarCollapsed&&matchMedia('(min-width: 801px)').matches;sidebar.inert=hidden;if(hidden)sidebar.setAttribute('aria-hidden','true');else sidebar.removeAttribute('aria-hidden');
 }
 function setupQuiz(){
  const result=main.querySelector('.result-box');if(!result||result.querySelector('.ui-result-mark'))return;
  const feedback=document.createElement('div');feedback.className='ui-result-feedback';feedback.innerHTML='<span class="ui-result-mark" aria-hidden="true">'+checkIcon+'</span><span>Проверка завершена</span>';result.prepend(feedback);
 }
 function afterRender(){
  navObservers.forEach(o=>o.disconnect());navObservers=[];
  const kind=route().parts[0],navRoute=['lesson','module','quiz'].includes(kind)?'#/course':'#/'+kind;
  document.querySelectorAll('.global-nav,.mobile-global').forEach(nav=>{
   nav.classList.add('ui-pill-nav');nav.querySelectorAll('a').forEach(a=>{if(a.hash===navRoute)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
   if(!nav.querySelector('.ui-nav-indicator')){const indicator=document.createElement('span');indicator.className='ui-nav-indicator';indicator.setAttribute('aria-hidden','true');nav.prepend(indicator);}
   const observer=new ResizeObserver(updateNav);observer.observe(nav);navObservers.push(observer);
  });
  main.querySelectorAll('.motion-module-toggle,.ui-program-toggle').forEach(button=>{button.onclick=()=>animateDisclosure(button,document.getElementById(button.getAttribute('aria-controls')));});
  const startArt=main.querySelector('.motion-start-art');if(startArt)startArt.outerHTML=fanMarkup();
  // Fan toggle появляется после разметки декоративного блока.
  const fan=main.querySelector('.ui-fan-toggle');if(fan)fan.onclick=()=>animateDisclosure(fan,document.getElementById(fan.getAttribute('aria-controls')));
  const cta=main.querySelector('.motion-hero-actions .button');if(cta){cta.dataset.magnetic='';cta.innerHTML='<span class="ui-magnetic-content">Начать обучение <span aria-hidden="true">↗</span></span>';}
  // Сдержанный текстовый акцент остаётся внутри декоративного веера.
  const fanArt=main.querySelector('.ui-fan-art');if(fanArt&&!fanArt.querySelector('[data-scramble]'))fanArt.insertAdjacentHTML('beforeend','<span class="ui-fan-code" aria-hidden="true" data-scramble="IT">IT</span>');
  setupCopy();setupMicroInteractions();setupQuiz();syncSidebar();updateNav();
 }

 function resultMarkup(items){return items.map((item,i)=>`<li role="none"><a id="ui-command-${i}" role="option" aria-selected="${i===searchIndex}" href="${esc(item.href)}"><span><strong>${esc(item.title)}</strong><small>${esc(item.kind)}</small></span><span aria-hidden="true">↗</span></a></li>`).join('');}
 function refreshSearch(){
  const query=searchDialog.querySelector('input').value.trim().toLocaleLowerCase('ru');searchIndex=0;
  const all=[...C.modules.map(m=>({title:m.id+'. '+m.title,kind:'Модуль',href:'#/module/'+m.id})),...C.lessons.map(l=>({title:l.id+' · '+l.title,kind:'Урок',href:'#/lesson/'+l.id})),...C.glossary.map(t=>({title:t.term,kind:'Термин',href:'#/glossary?q='+encodeURIComponent(t.term)}))];
  const candidates=query?all.filter(item=>query.split(/\s+/).every(word=>item.title.toLocaleLowerCase('ru').includes(word))).sort((a,b)=>Number(b.title.toLocaleLowerCase('ru').startsWith(query))-Number(a.title.toLocaleLowerCase('ru').startsWith(query))):[{title:'Программа курса',kind:'Все 11 модулей',href:'#/course'},{title:'Словарь',kind:'Понятные объяснения',href:'#/glossary'},{title:'Мой прогресс',kind:'Отметки текущей вкладки',href:'#/progress'},...(lastLesson?[{title:'Продолжить урок '+lastLesson,kind:'Последний открытый урок',href:'#/lesson/'+lastLesson}]:[])];
  searchItems=candidates.slice(0,12);const list=searchDialog.querySelector('#ui-command-results');list.innerHTML=resultMarkup(searchItems);
  searchDialog.querySelector('#ui-command-count').textContent=query?`Найдено: ${candidates.length}${candidates.length>12?'. Показаны первые 12.':'.'}`:'Быстрые переходы';
  const input=searchDialog.querySelector('input');if(searchItems.length)input.setAttribute('aria-activedescendant','ui-command-0');else{input.removeAttribute('aria-activedescendant');list.innerHTML='<li class="ui-command-empty" role="presentation">Ничего не найдено. Попробуйте другое слово.</li>';}
 }
 function openSearch(){
  if(document.querySelector('dialog[open]')&&!searchDialog.open)return;
  searchOrigin=document.activeElement;if(searchDialog.open)return;searchDialog.querySelector('input').value='';refreshSearch();searchDialog.showModal();searchDialog.querySelector('input').focus();
 }
 function init(){
  searchDialog=document.createElement('dialog');searchDialog.className='ui-command';searchDialog.setAttribute('aria-labelledby','ui-command-title');
  searchDialog.innerHTML=`<div class="ui-command-head"><h2 id="ui-command-title">Быстрый поиск</h2><form method="dialog"><button class="ui-icon-button" aria-label="Закрыть поиск">×</button></form></div><label class="ui-sr-only" for="ui-command-input">Найти урок, модуль или термин</label><div class="ui-command-input-wrap">${searchIcon}<input id="ui-command-input" type="search" role="combobox" aria-autocomplete="list" aria-expanded="true" aria-controls="ui-command-results" autocomplete="off" placeholder="Урок, модуль или термин…"></div><p id="ui-command-count" role="status"></p><ul id="ui-command-results" role="listbox" aria-label="Результаты поиска"></ul><p class="ui-command-help">↑ ↓ — выбрать · Enter — перейти · Esc — закрыть</p>`;
  document.body.append(searchDialog);searchDialog.querySelector('input').addEventListener('input',refreshSearch);
  searchDialog.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();event.stopPropagation();searchDialog.close();return;}if(event.target!==searchDialog.querySelector('input'))return;
   if(['ArrowDown','ArrowUp'].includes(event.key)&&searchItems.length){event.preventDefault();searchIndex=(searchIndex+(event.key==='ArrowDown'?1:-1)+searchItems.length)%searchItems.length;searchDialog.querySelectorAll('[role="option"]').forEach((item,i)=>item.setAttribute('aria-selected',String(i===searchIndex)));const active=searchDialog.querySelector('#ui-command-'+searchIndex);searchDialog.querySelector('input').setAttribute('aria-activedescendant',active.id);active.scrollIntoView({block:'nearest',behavior:'instant'});}
   if(event.key==='Enter'&&searchItems.length){event.preventDefault();const href=searchItems[searchIndex].href;searchDialog.close();location.hash=href;}
  });
  searchDialog.addEventListener('click',event=>{if(event.target.closest('a'))searchDialog.close();});
  searchDialog.addEventListener('close',()=>{if(searchOrigin?.isConnected)searchOrigin.focus({preventScroll:true});});
  document.querySelector('#quick-search').innerHTML=searchIcon+'<span>Поиск</span><kbd>Ctrl K</kbd>';
  document.querySelector('#quick-search').addEventListener('click',openSearch);
  document.querySelector('#sidebar-toggle').addEventListener('click',()=>{clearTimeout(sidebarTimer);document.body.classList.add('ui-sidebar-animating');sidebarCollapsed=!sidebarCollapsed;syncSidebar();sidebarTimer=setTimeout(()=>document.body.classList.remove('ui-sidebar-animating'),320);});
  document.addEventListener('keydown',event=>{if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='k'){event.preventDefault();openSearch();}});
  window.addEventListener('resize',()=>{document.body.classList.remove('ui-sidebar-animating');syncSidebar();updateNav();});menu.addEventListener('click',()=>requestAnimationFrame(updateNav));
  reduced.addEventListener('change',()=>{if(reduced.matches){document.getAnimations().forEach(animation=>{if(Number.isFinite(animation.effect?.getComputedTiming().endTime))animation.finish();else animation.cancel();});document.querySelectorAll('.ui-magnetic-content').forEach(el=>el.style.transform='');}});
 }
 return {home:homeMarkup,moduleCard,completion:completionMarkup,progress:progressMarkup,glossary,afterRender,syncCompletion,setupQuiz,init,openSearch};
})();
