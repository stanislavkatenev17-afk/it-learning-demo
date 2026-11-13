export function decorateLesson(html){
  html=html.replace(/(<pre\b[\s\S]*?<\/pre>)/g,'<div class="diagram-frame">$1</div>');
  html=html.replace(/<p>(<strong>[^<]{1,90} —[^<]*<\/strong>[\s\S]*?<\/p>)/g,'<p class="definition">$1');
  html=html.replace(/<h3([^>]*)>(Ответы и объяснения|Образец[^<]*)<\/h3>([\s\S]*?)(?=<h[23]|$)/g,(_,attrs,title,body)=>`<details class="answer"><summary>${title}</summary><div><h3${attrs}>${title}</h3>${body}</div></details>`);
  return html.replace(/<h2 id="([^"]+)">(\d+)\. (.*?)<\/h2>/g,(_,id,n,title)=>`<h2 id="${id}" class="section-heading"><span class="section-number" aria-hidden="true">${n.padStart(2,'0')}</span><span>${title}</span></h2>`);
}
