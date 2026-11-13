// Общие части только для явно помеченных новых схем модулей 7–11.
export const small=t=>`<span class="cv-small">${t}</span>`;
export const copy=t=>`<div class="cv-copy">${t}</div>`;
export const card=(title,body,tone='blue')=>`<div class="cv-card cv-${tone}"><strong class="cv-label">${title}</strong>${body}</div>`;
export const two=(...items)=>`<div class="cv-two">${items.join('')}</div>`;
export const three=(...items)=>`<div class="cv-three">${items.join('')}</div>`;
export const box=(title,body)=>`<div class="cv-boundary"><strong class="cv-label">${title}</strong>${body}</div>`;
export const takeaway=t=>`<p class="intro-takeaway">${t}</p>`;
export const flow=(a,label,b)=>`<div class="cv-flow">${a}<div class="cv-link">${small(label)}<span class="cv-arrow" aria-hidden="true">→</span></div>${b}</div>`;
export const steps=items=>`<ol class="action-sequence">${items.map(([t,b],i)=>`<li><span class="sequence-number" aria-hidden="true">${i+1}</span><div><strong>${t}</strong><p>${b}</p></div></li>`).join('')}</ol>`;
export const definition=(lesson,section,id,title,goal,objects,invariants,body,limits,replace=false)=>({lesson,section,id,title,learningGoal:goal,objects,invariants,emphasis:goal,body,note:limits,misconception:limits,replace,action:replace?'обновить':'создать',validation:'Сверить с условиями урока; проверить подписи, направления, исходное текстовое представление, клавиатуру и компоновки 320–1440.'});
export function renderDefinitions(html,id,figure,definitions){
 const number=Number(id.split('.')[0]);let ordinal=0;
 for(const d of definitions.filter(d=>d.lesson===id)){
  const visual=figure(d.id,++ordinal,d.title,d.body,d.note).replace('class="lesson-figure"',`class="lesson-figure visual-modern visual-module-${number} course-visual"`);
  const start=html.indexOf(`<h2 id="l${id.replace('.','-')}-${d.section}"`),end=html.indexOf('<h2 ',start+1);if(start<0||end<0)throw Error('Нет раздела '+id+'/'+d.section);let part=html.slice(start,end);
  if(d.replace){const pattern=/<div class="diagram-frame"><pre aria-label="Пример text"[\s\S]*?<\/pre><\/div>/;if(!pattern.test(part))throw Error('Нет исходной текстовой схемы '+id+'/'+d.section);part=part.replace(pattern,source=>visual+`<details class="visual-transcript"><summary>Текстовое представление исходной схемы</summary>${source}</details>`);}else part+=visual;
  html=html.slice(0,start)+part+html.slice(end);
 }
 return html.replaceAll('<div class="diagram-frame"><pre aria-label="Пример text"',`<div class="diagram-frame course-source m${number}-source"><pre aria-label="Пример text"`);
}
