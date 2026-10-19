(()=>{
'use strict';
const script=document.currentScript;
const workerURL=new URL('python-worker.js',script.src);
let sequence=0;
const save=(text,name)=>{const url=URL.createObjectURL(new Blob([text],{type:'text/x-python;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),10000);};
async function copy(text,target,status){try{await navigator.clipboard.writeText(text);status.textContent='Код скопійовано.';}catch{target.focus();target.select();status.textContent='Код виділено. Натисніть Ctrl+C або виберіть «Копіювати».';}}
document.querySelectorAll('.py-lab').forEach((lab,index)=>{
 const editor=lab.querySelector('.py-editor'),out=lab.querySelector('.py-output'),status=lab.querySelector('.py-status');
 const run=lab.querySelector('.py-run'),stop=lab.querySelector('.py-stop'),stdin=lab.querySelector('.py-stdin');
 const examples=Array.from(lab.querySelectorAll('.py-example'));
 let worker=null,busy=false,timer=null,currentId=0,chars=0;
 const setBusy=value=>{busy=value;run.disabled=value;stop.disabled=!value;lab.setAttribute('aria-busy',String(value));};
 const halt=(message)=>{clearTimeout(timer);if(worker)worker.terminate();worker=null;setBusy(false);status.textContent=message;};
 const timeout=(ms,message)=>{clearTimeout(timer);timer=setTimeout(()=>halt(message),ms);};
 editor.value=examples[0].textContent;
 editor.id='python-editor-'+index;
 lab.querySelector('.py-editor-label').htmlFor=editor.id;
 out.id='python-output-'+index;lab.querySelector('.py-output-label').htmlFor=out.id;
 stdin.id='python-stdin-'+index;lab.querySelector('.py-stdin-label').htmlFor=stdin.id;
 if(window.matchMedia('(min-width:761px)').matches)lab.querySelector('.py-sample').open=true;
 lab.querySelectorAll('.py-insert').forEach((button,i)=>button.addEventListener('click',()=>{
  editor.value=examples[i].textContent;editor.focus();status.textContent='Приклад вставлено в Runner. Змініть код або натисніть «Запустити».';
 }));
 lab.querySelector('.py-copy').addEventListener('click',()=>copy(editor.value,editor,status));
 lab.querySelector('.py-save').addEventListener('click',()=>{save(editor.value,lab.dataset.filename||'my_code.py');status.textContent='Файл .py підготовлено до завантаження.';});
 stop.addEventListener('click',()=>halt('Виконання зупинено. Код можна змінити й запустити ще раз.'));
 editor.addEventListener('keydown',event=>{
  if(event.key==='Tab'){event.preventDefault();const a=editor.selectionStart,b=editor.selectionEnd;editor.setRangeText('    ',a,b,'end');}
  if((event.ctrlKey||event.metaKey)&&event.key==='Enter'){event.preventDefault();if(!busy)run.click();}
 });
 run.addEventListener('click',()=>{
  if(busy)return;if(!editor.value.trim()){status.textContent='Вставте або напишіть код.';return;}
  if(!window.Worker){status.textContent='Цей браузер не підтримує Runner. Збережіть код і запустіть у своєму середовищі Python.';return;}
  setBusy(true);out.textContent='';chars=0;currentId=++sequence;
  try{
   if(!worker){
    worker=new Worker(workerURL);
    worker.addEventListener('error',()=>halt('Не вдалося завантажити Runner. Перевірте інтернет і наявність python-worker.js у корені сайту.'));
    worker.addEventListener('message',event=>{
     const data=event.data;if(data.id!==currentId)return;
     if(data.type==='phase'){
      if(data.text==='loading'){status.textContent='Завантажую Python. Перший запуск може тривати трохи довше…';}
      else{status.textContent='Виконую програму…';timeout(15000,'Програму зупинено через тривале виконання. Перевірте цикли та запустіть ще раз.');}
     }else if(data.type==='output'){
      chars+=data.text.length;if(chars>80000){halt('Забагато виведення. Скоротіть кількість print() або ітерацій.');return;}
      out.textContent+=data.text;out.scrollTop=out.scrollHeight;
     }else if(data.type==='done'){
      clearTimeout(timer);setBusy(false);status.textContent='Готово. Змініть код і запустіть ще раз.';if(!out.textContent)out.textContent='Програма завершилася без виведення. Для результату використайте print().';
     }else if(data.type==='error'){
      clearTimeout(timer);setBusy(false);out.textContent+='\n'+data.text;status.textContent='Є помилка Python. Прочитайте повідомлення й виправте код.';
     }
    });
   }
   status.textContent='Готую Runner…';timeout(90000,'Python не завантажився вчасно. Перевірте інтернет і спробуйте ще раз.');
   worker.postMessage({type:'run',id:currentId,code:editor.value,stdin:stdin.value});
  }catch{halt('Не вдалося запустити Runner. Перевірте інтернет і спробуйте ще раз.');}
 });
 window.addEventListener('pagehide',()=>{clearTimeout(timer);if(worker)worker.terminate();});
});
})();
