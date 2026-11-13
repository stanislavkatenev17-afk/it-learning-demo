export const escapeHtml=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const links=new Map();
export function setLinks(entries){links.clear();for(const [file,url] of entries)links.set(file,url)}
function inline(text){
  const tokens=[];const stash=html=>{tokens.push(html);return `\u0000${tokens.length-1}\u0000`};
  text=text.replace(/`([^`]+)`/g,(_,v)=>stash(`<code>${escapeHtml(v)}</code>`));
  text=text.replace(/\[([^\]]+)\]\(([^)]+)\)/g,(_,label,url)=>{let dest=links.get(url);if(!dest&&/^https?:\/\//.test(url))dest=url;if(!dest)return escapeHtml(label);return stash(`<a href="${escapeHtml(dest)}"${dest.startsWith('http')?' target="_blank" rel="noopener noreferrer"':''}>${escapeHtml(label)}</a>`)});
  text=escapeHtml(text).replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/(?<!\*)\*([^*]+)\*(?!\*)/g,'<em>$1</em>');
  return text.replace(/\u0000(\d+)\u0000/g,(_,n)=>tokens[+n]);
}
const cells=line=>line.trim().replace(/^\||\|$/g,'').split(/(?<!\\)\|/).map(x=>x.trim().replace(/\\\|/g,'|'));
export function markdown(text,prefix='section'){
  const lines=text.split('\n'), out=[], headings=[];let i=0, count=0;
  while(i<lines.length){let l=lines[i];if(!l.trim()){i++;continue}
    if(/^```/.test(l)){const lang=l.slice(3).trim();const code=[];i++;while(i<lines.length&&!/^```/.test(lines[i]))code.push(lines[i++]);i++;out.push(`<pre aria-label="Пример ${escapeHtml(lang||'схемы')}"><code>${escapeHtml(code.join('\n'))}</code></pre>`);continue}
    if(/^>\s?/.test(l)){const quote=[];while(i<lines.length&&/^>\s?/.test(lines[i]))quote.push(lines[i++].replace(/^>\s?/,''));out.push(`<blockquote><p>${inline(quote.join(' '))}</p></blockquote>`);continue}
    const h=l.match(/^(#{1,6})\s+(.+)/);if(h){const level=Math.max(2,h[1].length),id=`${prefix}-${++count}`;headings.push({id,title:h[2],level});out.push(`<h${level} id="${id}">${inline(h[2])}</h${level}>`);i++;continue}
    if(/^\s*([-*_])\1\1+\s*$/.test(l)){out.push('<hr>');i++;continue}
    if(l.trim().startsWith('|')&&i+1<lines.length&&/^\s*\|[\s:|\-]+\|\s*$/.test(lines[i+1])){const head=cells(l),rows=[];i+=2;while(i<lines.length&&lines[i].trim().startsWith('|'))rows.push(cells(lines[i++]));out.push(`<div class="table-scroll" tabindex="0" role="region" aria-label="Учебная таблица"><table><thead><tr>${head.map(x=>`<th scope="col">${inline(x)}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map(x=>`<td>${inline(x)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`);continue}
    if(/^\s*(?:[-*]|\d+\.)\s+/.test(l)){const ordered=/^\s*\d+\./.test(l),items=[];while(i<lines.length&&/^\s*(?:[-*]|\d+\.)\s+/.test(lines[i])){items.push(lines[i++].replace(/^\s*(?:[-*]|\d+\.)\s+/,''));}out.push(`<${ordered?'ol':'ul'}>${items.map(x=>`<li>${inline(x)}</li>`).join('')}</${ordered?'ol':'ul'}>`);continue}
    const para=[l];i++;while(i<lines.length&&lines[i].trim()&&!/^(#{1,6}\s|```|\s*[-*]\s|\s*\d+\.\s|\|)/.test(lines[i])&&!/^\s*---\s*$/.test(lines[i]))para.push(lines[i++]);const joined=para.join(' ');
    if(/^\*\*(?:Ответ|Образец ответа|Пример ответа)(?:\*\*|:)/i.test(joined)){out.push(`<details class="answer"><summary>Свериться с объяснением</summary><div><p>${inline(joined)}</p></div></details>`)}else out.push(`<p${/^\*\*Проверьте себя/.test(joined)?' class="self-check"':''}>${inline(joined)}</p>`);
  }return {html:out.join('\n'),headings};
}
