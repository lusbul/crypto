(()=>{'use strict';const key='crypto-enigma-practice-v1';let records=[];try{const v=JSON.parse(localStorage.getItem(key)||'[]');if(Array.isArray(v))records=v.slice(-8);}catch{}
const list=document.getElementById('practice-log'),status=document.getElementById('practice-status');
function paint(){list.replaceChildren();const h=document.createElement('p');h.textContent='Журнал практики · '+records.length+' дослідів';list.append(h);records.forEach((r,i)=>{const details=document.createElement('details'),summary=document.createElement('summary'),text=document.createElement('p');summary.textContent='Дослід '+(i+1)+' · '+r.input+' → '+r.output;text.textContent=EnigmaLab.describe(r);text.style.whiteSpace='pre-wrap';details.append(summary,text);list.append(details);});}
function save(){try{localStorage.setItem(key,JSON.stringify(records));status.textContent='Журнал збережено на цьому пристрої. У вебботі Ви виконаєте окремі контрольні досліди.';}catch{status.textContent='Автозбереження недоступне. Не закривайте сторінку, доки не завершили дослід.';}}
EnigmaLab.mount(document.getElementById('free-simulator'),{capture:true,onCapture:r=>{records.push(r);records=records.slice(-8);save();paint();}});
document.getElementById('clear-experiments').onclick=()=>{if(!confirm('Очистити журнал практики? Звіт веббота залишиться окремо.'))return;records=[];save();paint();};paint();
})();
