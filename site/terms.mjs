// Избирательные акценты: понятие при определении и первое иностранное название.
// Словарь курса не используется как список слов для сплошного выделения.
export const foreignTerms=['JavaScript','TypeScript','Bluetooth','Unicode','Windows','Android','GitHub','Python','Passkey','Wi-Fi','UTF-8','macOS','Linux','HTTPS','ASCII','HTML','JSON','HTTP','CSS','API','DNS','URL','TCP','UDP','USB','CPU','RAM','SSD','HDD','SQL','RGB','Git','iOS','IP','IT'];
const escape=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const foreignPattern=`(?<![\\p{L}\\p{N}_])(?:${foreignTerms.map(escape).join('|')})(?![\\p{L}\\p{N}_])`;
const normalize=s=>s.toLocaleLowerCase('ru').replace(/\s+/g,' ').trim().replace(/[,:;]+$/,'');
const wrap=s=>`<span class="course-term">${s}</span>`;

// Вне урока нет автоматических учебных акцентов: вопрос не подсказывает ответ.
export const withoutEmphasis=html=>html.replace(/<\/?strong\b[^>]*>/gi,'');

function definition(body,suffix=''){
 const inside=body.match(/^([^<>\u0000]{1,80}?)(\s+[—–]\s+)([\s\S]*)$/);
 const parts=inside?inside.slice(1):suffix&&/^[^<>\u0000]{1,80}$/.test(body)?[body,suffix,'']:null;
 if(!parts||parts[0].trim().split(/\s+/).length>8)return null;
 if((parts[0].match(/\p{L}/gu)||[]).length<3&&!foreignTerms.some(t=>normalize(t)===normalize(parts[0])))return null;
 return parts;
}

export function emphasizeLesson(html){
 const protectedParts=[];
 const hold=part=>`\u0000${protectedParts.push(part)-1}\u0000`;
 const activityMarker='\u0000ACTIVITIES\u0000';
 const activitiesHeading=[...html.matchAll(/<h2\b[^>]*>[\s\S]*?<\/h2>/gi)].find(m=>{
  const text=m[0].replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim().replace(/^\d+[.)]?\s*/, '');
  return /^(?:Проверка понимания|Проверим (?:весь урок|понимание)|Практика\b|Самопроверка\b|Что стоит запомнить|Словарь урока)/i.test(text);
 });
 if(activitiesHeading)html=html.slice(0,activitiesHeading.index)+activityMarker+html.slice(activitiesHeading.index);
 // Бережём рисунки, код и структуру заголовков. Рисунки уже добавлены сборщиком.
 html=html.replace(/<(figure|pre|code|script|style|h[1-6])\b[^>]*>[\s\S]*?<\/\1\s*>/gi,hold);
 const activityAt=html.indexOf(activityMarker);
 const activities=activityAt<0?'':withoutEmphasis(html.slice(activityAt+activityMarker.length));
 if(activityAt>=0)html=html.slice(0,activityAt);
 const strong=/<strong\b[^>]*>([\s\S]*?)<\/strong>(\s+[—–]\s+)?/gi;
 const definedForeign=new Set();
 for(const match of html.matchAll(strong)){
  const parts=definition(match[1],match[2]);
  if(parts)for(const word of parts[0].matchAll(new RegExp(foreignPattern,'giu')))definedForeign.add(word[0].toLowerCase());
 }
 const definitionsSeen=new Set();
 html=html.replace(strong,(_,body,suffix='')=>{
  const parts=definition(body,suffix);
  if(!parts)return body+suffix;
  const [name,separator,rest]=parts,key=normalize(name);
  const first=!definitionsSeen.has(key);definitionsSeen.add(key);
  return (first?wrap(name):name)+separator+rest;
 });
 // В таблицах и раскрываемых ответах не ищем дополнительные термины.
 // Уже отобранные определения сохраняются, но их не оборачиваем повторно.
 html=html.replace(/<(table|details|summary|button)\b[^>]*>[\s\S]*?<\/\1\s*>|<span class="course-term">[\s\S]*?<\/span>/gi,hold);
 const foreignSeen=new Set(definedForeign),stack=[];
 html=html.split(/(<[^>]+>)/g).map(part=>{
  if(part.startsWith('<')){
   const close=part.match(/^<\/([a-z][\w-]*)/i),open=part.match(/^<([a-z][\w-]*)/i);
   if(close){const at=stack.lastIndexOf(close[1].toLowerCase());if(at>=0)stack.splice(at)}
   else if(open&&!/\/>$/.test(part)&&!/^<(?:br|hr|img|input|meta|link)\b/i.test(part))stack.push(open[1].toLowerCase());
   return part;
  }
  if(stack.some(t=>['table','details','summary','button','pre','code','figure','script','style'].includes(t)))return part;
  return part.split(/(&(?:#\d+|#x[a-f\d]+|[a-z]+);)/gi).map(text=>text.startsWith('&')?text:text.replace(new RegExp(foreignPattern,'giu'),word=>{
   const key=word.toLowerCase();if(foreignSeen.has(key))return word;
   foreignSeen.add(key);return wrap(word);
  })).join('');
 }).join('');
 html+=activities;
 // Вложенные сохранённые фрагменты раскрываем от новых к старым.
 for(let i=protectedParts.length-1;i>=0;i--)html=html.replaceAll(`\u0000${i}\u0000`,protectedParts[i]);
 return html;
}
