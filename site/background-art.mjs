// Собственный декоративный SVG-фон: символы IT и воспроизводимая зернистость.
// Символы не содержат учебных сведений и подключаются только через CSS.
const shapes={
 code:'<path d="m12 5-12 15 12 15m27-30 12 15-12 15M31 0 21 40"/>',
 braces:'<path d="M15 0C3 0 9 14 3 18l-3 2 3 2c6 4 0 18 12 18M37 0c12 0 6 14 12 18l3 2-3 2c-6 4 0 18-12 18"/>',
 binary:'<rect x="0" y="0" width="17" height="29" rx="8"/><path d="m29 6 7-6v29m-6 0h13M3 25 14 4"/>',
 chip:'<rect x="6" y="6" width="30" height="30" rx="5"/><rect x="14" y="14" width="14" height="14" rx="2"/><path d="M13 0v6m8-6v6m8-6v6M13 36v6m8-6v6m8-6v6M0 13h6m-6 8h6m-6 8h6m30-16h6m-6 8h6m-6 8h6"/>',
 file:'<path d="M3 0h22l13 13v34H3ZM25 0v13h13M11 25h18M11 33h12"/>',
 network:'<rect x="17" y="0" width="17" height="13" rx="3"/><rect x="0" y="33" width="17" height="13" rx="3"/><rect x="34" y="33" width="17" height="13" rx="3"/><path d="M25.5 13v11M8.5 33v-9h34v9"/>',
 terminal:'<rect width="55" height="37" rx="5"/><path d="m10 11 9 8-9 8m18 0h15"/>',
 cloud:'<path d="M12 36C-3 36-3 16 10 14 9-2 34-7 39 10c19-4 25 26 6 26Z"/>',
 brackets:'<path d="M12 0H0v36h12M33 0h12v36H33"/>',
 folder:'<path d="M0 9V1h18l7 8h28v31H0ZM0 14h53"/>'
};
const positions=[
 ['code',65,42,-12,.9],['binary',300,90,9,.8],['network',570,40,-8,.85],['braces',815,100,13,1],
 ['file',180,260,10,.85],['chip',435,205,-10,.8],['terminal',700,285,8,.8],['cloud',920,215,-12,.85],
 ['brackets',45,450,8,.85],['binary',295,475,-15,.9],['folder',555,430,12,.8],['code',835,505,-7,.8],
 ['network',145,650,-9,.75],['braces',435,655,8,.85],['chip',720,650,-12,.85],['file',925,690,10,.7]
];
export function backgroundSymbols(){
 const colors=['#436f9d','#377f7b','#997446'];
 const groups=positions.map(([name,x,y,angle,scale],i)=>`<g transform="translate(${x} ${y}) rotate(${angle}) scale(${scale})" stroke="${colors[i%colors.length]}">${shapes[name]}</g>`).join('');
 return `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="780" viewBox="0 0 1000 780"><g fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity=".25">${groups}</g></svg>`;
}
export function backgroundGrain(){
 let seed=7419;
 const random=()=>{seed=(Math.imul(1664525,seed)+1013904223)>>>0;return seed/4294967296};
 const dots=Array.from({length:900},()=>`<circle cx="${(random()*180).toFixed(2)}" cy="${(random()*180).toFixed(2)}" r="${(.25+random()*.55).toFixed(2)}" opacity="${(.08+random()*.16).toFixed(2)}"/>`).join('');
 return `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180"><g fill="#688fa8">${dots}</g></svg>`;
}
