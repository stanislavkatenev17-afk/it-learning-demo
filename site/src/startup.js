'use strict';
// This guard is independent of the course data, UI components and application.
(() => {
 const main=document.querySelector('#main');
 const fallback=document.querySelector('#course-load-fallback')?.cloneNode(true);
 let state='loading';
 main.setAttribute('aria-busy','true');
 function fail(){
  if(state==='failed')return;
  state='failed';
  if(fallback){main.replaceChildren(fallback);fallback.querySelector('h1').textContent='Не удалось загрузить курс';fallback.querySelector('[data-load-message]').textContent='Страница курса загрузилась не полностью. Проверьте соединение и повторите попытку.';}
  main.removeAttribute('aria-busy');
  document.querySelector('#sidebar').replaceChildren();
  document.querySelector('#lesson-outline').hidden=true;
  document.body.dataset.page='load-error';
  main.focus({preventScroll:true});
 }
 function canStart(data,ui){
  const valid=data&&['modules','lessons','questions','glossary'].every(key=>Array.isArray(data[key])&&data[key].length>0)
   &&ui&&['init','afterRender','home','moduleCard','completion','syncCompletion','progress','glossary','setupQuiz'].every(key=>typeof ui[key]==='function');
  if(!valid)fail();
  return !!valid;
 }
 function ready(){state='ready';main.removeAttribute('aria-busy');}
 document.addEventListener('submit',event=>{if(event.target.matches('[data-course-retry]')){event.preventDefault();location.reload();}});
 document.addEventListener('DOMContentLoaded',()=>{if(state!=='ready')fail();},{once:true});
 window.CourseStartup={canStart,ready,fail};
})();
