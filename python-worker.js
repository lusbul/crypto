'use strict';
const PYODIDE_URL='https://cdn.jsdelivr.net/pyodide/v0.27.7/full/';
let runtime=null;
let outputChars=0;
let currentId=null;
let busy=false;
function send(type,text){self.postMessage({type,text,id:currentId});}
function output(text){outputChars+=text.length;if(outputChars>80000)throw new Error('Забагато виведення. Скоротіть цикл або кількість print().');send('output',text+'\n');}
self.onmessage=async(event)=>{
 if(event.data.type!=='run'||busy)return;
 busy=true;currentId=event.data.id;outputChars=0;
 let globals=null,dict=null;
 try{
  if(!runtime){
   send('phase','loading');
   importScripts(PYODIDE_URL+'pyodide.js');
   runtime=await loadPyodide({indexURL:PYODIDE_URL});
  }
  const inputs=(event.data.stdin||'').replace(/\r/g,'').split('\n');
  if(!event.data.stdin)inputs.length=0;
  runtime.setStdout({batched:output});
  runtime.setStderr({batched:output});
  runtime.setStdin({stdin:()=>inputs.length?inputs.shift():undefined});
  dict=runtime.globals.get('dict');globals=dict();globals.set('__name__','__main__');
  send('phase','running');
  const result=await runtime.runPythonAsync(event.data.code,{globals,filename:'student_code.py'});
  if(result&&typeof result.destroy==='function')result.destroy();
  send('done','');
 }catch(error){send('error',String(error.message||error));}
 finally{if(globals)globals.destroy();if(dict)dict.destroy();busy=false;}
};
