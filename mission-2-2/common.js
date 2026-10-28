const ABC='АБВГҐДЕЄЖЗИІЇЙКЛМНОПРСТУФХЦЧШЩЬЮЯ';const mod=(a,n)=>((a%n)+n)%n;const $=id=>document.getElementById(id);
function caesar(s,k,reverse=false){return [...s.toUpperCase()].map(ch=>{let i=ABC.indexOf(ch);return i<0?ch:ABC[mod(i+(reverse?-k:k),33)]}).join('')}
function vig(s,key,reverse=false){let keys=[...key.toUpperCase()].map(c=>ABC.indexOf(c)).filter(x=>x>=0),i=0;return [...s.toUpperCase()].map(ch=>{let n=ABC.indexOf(ch);if(n<0)return ch;return ABC[mod(n+(reverse?-1:1)*keys[(i++)%keys.length],33)]}).join('')}
function checkAnswer(input,correct,feedback,explanation){let v=$(input).value.trim().toUpperCase().replace(/\s+/g,'');$(feedback).textContent=v===String(correct).toUpperCase()?'✅ Правильно! '+explanation:'🔎 Спробуйте ще. Відкрийте підказку й перевірте обчислення.'}
