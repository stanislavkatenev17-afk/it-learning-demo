// Модуль 1: смысловые пиктограммы и живые подписи. Не логотипы программ.
const modernFigure=original=>(...args)=>original(...args).replace('class="lesson-figure"','class="lesson-figure visual-modern"');
const drawings={
 speech:'<rect x="12" y="15" width="66" height="43" rx="10"/><path d="M24 58v14l17-14M28 32v10m11-17v24m12-19v14m12-17v20"/>',
 note:'<rect x="20" y="10" width="50" height="70" rx="6"/><path d="M30 28h30M30 40h30M30 52h21M30 64h26"/>',
 phone:'<path d="M12 45s12-19 33-19 33 19 33 19-12 19-33 19S12 45 12 45Z"/><circle cx="45" cy="45" r="9"/>',
 read:'<rect x="14" y="22" width="62" height="46" rx="7"/><path d="m16 26 29 23 29-23"/>',
 keep:'<path d="M24 12h35l13 13v53H24Z M59 12v15h13M35 53l9 9 17-20"/>',
 person:'<circle cx="45" cy="25" r="13"/><path d="M20 76v-9a25 25 0 0 1 50 0v9Z"/>',
 pencil:'<path d="m20 61 39-39 12 12-39 39-16 4ZM54 27l12 12M20 61l12 12M61 20l5-5a5 5 0 0 1 7 0l5 5a5 5 0 0 1 0 7l-5 5"/>'
};
const drawing=name=>`<svg class="intro-drawing" viewBox="0 0 90 90" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${drawings[name]}</svg>`;

export function illustrateFirstLesson(html,{figure:originalFigure}){
 const figure=modernFigure(originalFigure);
 const card=(color,body)=>`<div class="intro-card intro-${color}">${body}</div>`;
 const art=name=>`<span class="intro-art">${drawing(name)}</span>`;
 const label=text=>`<strong class="intro-label">${text}</strong>`;
 const arrow='<span class="intro-arrow" aria-hidden="true">→</span>';
 const forms=figure('information-forms',1,'Одни сведения — разные формы',
  `<p class="visual-intro">О времени встречи можно узнать по-разному.</p><div class="intro-forms">${card('blue',art('speech')+label('Услышать')+'<span class="intro-message">«Встреча в пятницу,<br>в шесть вечера»</span>')}${card('teal',art('note')+label('Прочитать записку')+'<span class="intro-message">Встреча<br>Пятница, 18:00</span>')}${card('ochre',art('phone')+label('Увидеть на экране')+'<span class="intro-message">Встреча<br>Пятница, 18:00</span>')}</div><p class="intro-takeaway">Во всех трёх случаях узнаём одно: когда встреча.</p>`,
  'Сведения здесь одинаковые, а способ их представления различается. Информация может быть представлена и изображением — не только словами или числами.');
 const receive=figure('receive-and-keep',2,'Узнать время и оставить запись',
  `<div class="intro-pair">${card('blue',art('read')+label('Получить')+'<span class="intro-message">Прочитать сообщение<br>«Пятница, 18:00»</span><p class="intro-result">Теперь вы знаете время.</p>')}${card('teal',art('keep')+label('Сохранить')+'<span class="intro-message">Оставить запись<br>«Пятница, 18:00»</span><p class="intro-result">К записи можно вернуться позже.</p>')}</div><p class="intro-takeaway">Прочитать и оставить для будущего обращения — разные действия.</p>`,
  'Это сравнение смысла действий. По одному факту просмотра нельзя определить, сохранила ли программа сообщение. Здесь сохранение означает оставить сведения для дальнейшего обращения, а не нажатие определённой кнопки.');
 const transfer=figure('share-information',3,'Передать — не обязательно лишиться',
  `<p class="visual-intro">В этом примере сообщение доставлено и осталось у отправителя.</p><div class="intro-transfer">${card('blue',art('person')+label('Отправитель')+'<span class="intro-message">Пятница, 18:00</span><p class="intro-result">Сообщение осталось доступно.</p>')}<div class="intro-link"><span>Передача<br> сообщения</span>${arrow}</div>${card('teal',art('person')+label('Получатель')+'<span class="intro-message">Пятница, 18:00</span><p class="intro-result">Сообщение стало доступно.</p>')}</div>`,
  'Получение и передача описывают этот обмен с разных сторон. Схема показывает один успешный пример, а не правило хранения всех сообщений. Доступность сообщения ещё не означает, что получатель его прочитал.');
 const process=figure('information-action-result',4,'Изменили запись — получили результат',
  `<div class="intro-process">${card('blue',art('note')+label('Сведения')+'<span class="intro-message">Встреча<br>Среда, 18:00</span>')}${arrow}${card('ochre',art('pencil')+label('Действие')+'<span class="intro-message">Исправляем<br>«среда» на «пятница»</span>')}${arrow}${card('teal',art('note')+label('Результат')+'<span class="intro-message">Встреча<br>Пятница, 18:00</span>')}</div><p class="intro-takeaway">Изменение содержания записи — обработка информации.</p>`,
  'Это смысл задачи, а не устройство компьютера. По условию новое время уже известно. Схема показывает исправление записи; сохранение изменённой версии для будущего обращения — отдельный вопрос.');

 // Привязки проверяем до выделения терминов. При смене структуры — явная ошибка сборки.
 const insert=(section,anchor,visual)=>{
  const start=html.indexOf(`<h2 id="l1-1-${section}"`),end=html.indexOf('<h2 ',start+1);
  if(start<0||end<0)throw new Error(`Не найден раздел ${section} урока 1.1`);
  const part=html.slice(start,end);
  if(anchor&&!part.includes(anchor))throw new Error(`Не найдена привязка рисунка в разделе ${section} урока 1.1`);
  html=html.slice(0,start)+(anchor?part.replace(anchor,visual+anchor):part+visual)+html.slice(end);
 };
 insert(2,'<p class="self-check"><strong>Проверьте себя.',forms);
 insert(3,null,receive);
 insert(5,null,transfer);
 const start=html.indexOf('<h2 id="l1-1-7"'),end=html.indexOf('<h2 ',start+1);
 if(start<0||end<0)throw new Error('Не найден раздел 7 урока 1.1');
 const part=html.slice(start,end),pattern=/<div class="diagram-frame"><pre\b[\s\S]*?<\/pre><\/div>/;
 if(!pattern.test(part))throw new Error('Не найдена текстовая схема урока 1.1');
 html=html.slice(0,start)+part.replace(pattern,original=>process+`<details class="visual-transcript"><summary>Текстовое представление исходной схемы</summary>${original}</details>`)+html.slice(end);
 return html;
}
// Корпус неизменен: один локальный ресурс и одни координаты экрана во всех сценах.
const screenWindow=(kind,photo='mountains')=>`<div class="screen-window screen-${kind}"><div class="screen-title">${kind==='text'?'Текст':'Просмотр'}</div>${kind==='text'?'<div class="screen-copy"><b>Покупки</b><span>Хлеб</span><span>Яблоки</span><span>Молоко</span></div>':`<div class="screen-photo"><img src="assets/module-1/${photo}.webp" width="800" height="533" alt="${photo==='mountains'?'Горы у озера':'Дом с тёмной крышей'} — сгенерированное учебное изображение"></div><div class="screen-tools" aria-hidden="true">‹ <span>− &nbsp; +</span> ›</div>`}</div>`;
const device=(kind,photo)=>`<div class="modern-device"><img class="monitor-body" src="assets/module-1/monitor-front.webp" width="1100" height="733" alt="Реалистичный учебный рендер монитора, вид спереди"><div class="monitor-screen">${screenWindow(kind,photo)}</div></div>`;
const scene=(color,title,kind,photo,copy)=>`<div class="intro-card intro-${color} device-card"><strong class="intro-label">${title}</strong>${device(kind,photo)}<span class="intro-message">${copy}</span></div>`;
const conditional='<p class="conditional-label">Окна программ условные · названия продуктов не используются</p>';
export function illustrateSecondLesson(html,{figure:originalFigure}){
 const figure=modernFigure(originalFigure);
 const tasks=figure('same-computer',1,'Компьютер тот же — задачи разные',`${conditional}<div class="intro-pair">${scene('blue','Составить список','text',null,'Программа для текста<br>Содержание: список покупок')}${scene('teal','Посмотреть фотографию','photo','mountains','Программа просмотра<br>Содержание: фотография')}</div><p class="intro-takeaway">В этом примере экран и клавиатуру не заменяли. Для задач использовали разные программы.</p>`,'Две сцены показывают один компьютер в разные моменты; показан его монитор. Изменение картинки на экране само по себе не доказывает смену программы. Здесь она задана условием примера.');
 const layers=figure('screen-window-content',2,'Что физическое, а что показано',`${conditional}<div class="layer-device">${device('text')}<span class="layer-badge layer-one" aria-hidden="true">1</span><span class="layer-badge layer-two" aria-hidden="true">2</span><span class="layer-badge layer-three" aria-hidden="true">3</span></div><ol class="layer-legend"><li><b>Физический экран</b><span>Устройство, на котором видно изображение.</span></li><li><b>Окно программы для текста</b><span>Область содержания и средств управления.</span></li><li><b>Содержание: список покупок</b><span>Хлеб, яблоки, молоко — текст, который можно изменить.</span></li></ol><p class="intro-takeaway">Программа позволяет изменять текст. Её окно показывает список и средства управления.</p>`,'Корпус изображён реалистично, окно условное. Саму программу нельзя отождествлять с нарисованной рамкой окна. У программы может быть несколько окон; работа программы не всегда видна.');
 const content=figure('same-program',3,'Другая фотография — та же программа',`<p class="visual-intro">В одной программе просмотра открыли сначала одну фотографию, затем другую.</p>${conditional}<div class="intro-pair">${scene('blue','Сначала: горы','photo','mountains','Программа просмотра показывает первую фотографию.')}${scene('ochre','Затем: дом','photo','house','Та же программа показывает другую фотографию.')}</div><p class="intro-takeaway">Изменилось содержание. Программа и физический экран остались прежними.</p>`,'Смена фотографии — действие внутри одной программы по условию этого примера. По одному внешнему виду окна нельзя надёжно определить, какая программа работает. Фотографические изображения созданы для учебного примера.');
 const insert=(section,visual,replace=false)=>{
  const start=html.indexOf(`<h2 id="l1-2-${section}"`),end=html.indexOf('<h2 ',start+1);
  if(start<0||end<0)throw new Error(`Не найден раздел ${section} урока 1.2`);
  let part=html.slice(start,end);
  if(replace){const pattern=/<div class="diagram-frame"><pre\b[\s\S]*?<\/pre><\/div>/;if(!pattern.test(part))throw new Error('Не найдена схема 1.2');part=part.replace(pattern,original=>visual+`<details class="visual-transcript"><summary>Текстовое представление исходной схемы</summary>${original}</details>`);}else part+=visual;
  html=html.slice(0,start)+part+html.slice(end);
 };
 insert(1,tasks);insert(5,layers,true);insert(6,content);
 return html;
}

// Общая вставка с проверкой раздела; исходные текстовые схемы остаются доступны.
function insertVisual(html,lesson,section,visual,replace=false){
 const start=html.indexOf(`<h2 id="l${lesson.replace('.','-')}-${section}"`),end=html.indexOf('<h2 ',start+1);
 if(start<0||end<0)throw new Error(`Не найден раздел ${section} урока ${lesson}`);
 let part=html.slice(start,end);
 if(replace){const pattern=/<div class="diagram-frame"><pre\b[\s\S]*?<\/pre><\/div>/;if(!pattern.test(part))throw new Error(`Не найдена исходная схема ${lesson}`);part=part.replace(pattern,original=>visual+`<details class="visual-transcript"><summary>Текстовое представление исходной схемы</summary>${original}</details>`);}else part+=visual;
 return html.slice(0,start)+part+html.slice(end);
}
const conceptIcon=name=>{
 const shapes={browser:'<rect x="4" y="5" width="28" height="25" rx="4"/><path d="M4 12h28M9 9h1m4 0h1M10 18h15M10 23h10"/>',network:'<circle cx="18" cy="18" r="5"/><rect x="13" y="2" width="10" height="6" rx="1"/><rect x="2" y="27" width="10" height="6" rx="1"/><rect x="24" y="27" width="10" height="6" rx="1"/><path d="M18 8v5M7 27l7-6m15 6-7-6"/>',photo:'<rect x="4" y="5" width="28" height="25" rx="4"/><circle cx="24" cy="12" r="3"/><path d="m5 25 9-10 8 9 4-5 6 6"/>',text:'<rect x="7" y="3" width="22" height="30" rx="3"/><path d="M12 11h12M12 17h12M12 23h8"/>',site:'<rect x="3" y="3" width="22" height="24" rx="3"/><path d="M25 10h5a3 3 0 0 1 3 3v17a3 3 0 0 1-3 3H14a3 3 0 0 1-3-3v-3M8 10h12M8 16h12M8 22h7"/>'};
 return `<svg viewBox="0 0 36 36" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${shapes[name]}</svg>`;
};
export function illustrateThirdLesson(html,{figure:originalFigure}){
 const figure=modernFigure(originalFigure);
 const concepts=figure('browser-internet-site',1,'Браузер, интернет и сайт — разные вещи',`<div class="concept-grid"><div class="concept-card"><span class="concept-icon">${conceptIcon('browser')}</span><strong>Браузер</strong><span class="concept-type">Программа</span><p>Открывает и показывает страницы, позволяет пользоваться сайтом.</p></div><div class="concept-card"><span class="concept-icon">${conceptIcon('network')}</span><strong>Интернет</strong><span class="concept-type">Большая сеть</span><p>Связывает устройства и сети для обмена сведениями.</p></div><div class="concept-card"><span class="concept-icon">${conceptIcon('site')}</span><strong>Сайт</strong><span class="concept-type">Страницы и возможности</span><p>Например, расписание библиотеки и поиск книг.</p></div></div><p class="intro-takeaway">Открыть браузер — ещё не значит найти нужное расписание на сайте.</p>`,'Это сравнение понятий, а не последовательность запуска. Значки обозначают роли и не являются логотипами конкретных продуктов.');
 const row=(icon,task,program,why)=>`<div class="task-row"><span class="concept-icon">${conceptIcon(icon)}</span><div class="task-goal"><span class="small-label">Задача</span><strong>${task}</strong></div><span class="task-arrow" aria-hidden="true">→</span><div class="task-choice"><span class="small-label">Подходящий вид программы</span><strong>${program}</strong><p>${why}</p></div></div>`;
 const choices=figure('task-program-choice',2,'Выбираем программу по задаче',`<div class="task-rows">${row('browser','Открыть сайт библиотеки','Браузер','Позволяет пользоваться сайтами.')}${row('text','Создать список в отдельной программе для текста','Текстовый редактор','Позволяет вводить и изменять текст.')}${row('photo','Посмотреть сохранённую фотографию','Программа просмотра','Позволяет показать изображение.')}</div><p class="intro-takeaway">Задача → нужные возможности → объяснение выбора.</p>`,'Показаны подходящие варианты при данных условиях. Возможности могут пересекаться: фотографию можно увидеть и на сайте, а на сайте может быть ввод текста. Слово «текст» или «фото» само по себе не определяет единственный вид программы.');
 html=insertVisual(html,'1.3',3,concepts);
 return insertVisual(html,'1.3',6,choices);
}

export function illustrateFourthLesson(html,{figure:originalFigure}){
 const figure=modernFigure(originalFigure);
 const number=n=>`<span class="ui-number" aria-hidden="true">${n}</span>`;
 const elements=figure('interface-elements',1,'Одно окно — разные элементы',`<p class="conditional-label">Условный интерфейс · статическая схема для объяснения</p><div class="application-window"><div class="application-title">${number(1)}<span class="ui-label">Окно записи</span></div><div class="application-panes"><div class="application-main"><div class="ui-label">${number(2)} Поле ввода «Название»</div><div class="illustrated-input">Покупки<span class="static-caret" aria-hidden="true"></span></div><span class="illustrated-button">${number(3)} Сохранить</span><p class="ui-status">Действие ещё не выбрано.<br>Результат ещё не проверен.</p></div><div class="illustrated-menu"><div class="ui-label">${number(4)} Меню «Действия»</div><ul><li>Новая запись</li><li>Изменить вид</li></ul><p>Показан открытый список вариантов.</p></div></div></div><ol class="layer-legend"><li><b>Окно</b><span>Объединяет содержание и средства управления.</span></li><li><b>Поле</b><span>Принимает и изменяет название.</span></li><li><b>Кнопка</b><span>Позволяет выбрать действие сохранения.</span></li><li><b>Меню</b><span>Предлагает варианты; открытие списка ещё не выполняет выбранное действие.</span></li></ol>`,'Элементы здесь нарисованы, нажимать их не нужно. Это не интерфейс конкретного продукта. Окно не равно физическому экрану, а выбор «Сохранить» сам по себе не доказывает успешную запись.');
 const step=(n,title,text)=>`<li><span class="sequence-number" aria-hidden="true">${n}</span><div><strong>${title}</strong><p>${text}</p></div></li>`;
 const sequence=figure('input-action-result',2,'От задачи к проверенному результату',`<ol class="action-sequence">${step(1,'Понять задачу','Нужно назвать запись «Покупки».')}${step(2,'Найти поле и ввести название','Выбрать нужное поле. Проверить, что в нём написано «Покупки».')}${step(3,'Выбрать подходящее действие','Выбрать «Сохранить», если именно это нужно для задачи.')}${step(4,'Проверить, что произошло','Прочитать сообщение программы. Ошибка сохранения означает, что успешная запись не подтверждена.')}</ol><p class="intro-takeaway">Ввод текста, выбор действия и успешный результат — разные вещи.</p>`,'Порядок объясняет этот пример, а не все программы. Если расположение кнопки изменилось, её назначение уточняют по названию и контексту. Изменение на экране само по себе не доказывает постоянное сохранение.');
 html=insertVisual(html,'1.4',7,elements);
 return insertVisual(html,'1.4',8,sequence,true);
}
