/* Enigma I / M3, three moving rotors, reflector B, A–Z entry wheel.
   Rotor specifications: https://enigmamuseum.com/rotwirg.htm
   Left-to-right window notation; stepping occurs BEFORE the signal. */
(()=>{'use strict';
const ABC='ABCDEFGHIJKLMNOPQRSTUVWXYZ',mod=n=>(n%26+26)%26;
const ROTORS={I:{w:'EKMFLGDQVZNTOWYHXUSPAIBRCJ',notch:'Q'},II:{w:'AJDKSIRUXBLHWTMCQGZNPYFVOE',notch:'E'},III:{w:'BDFHJLCPRTXVZNYEIWGAKMUSQO',notch:'V'},IV:{w:'ESOVPZJAYQUIRHXLNFTGKDCMWB',notch:'J'},V:{w:'VZBRGITYUPSDNHLXAWMJQOFECK',notch:'Z'}};
const REFLECTOR='YRUHQSLDPXNGOKMIEBFZCWVJAT';
const clean=s=>String(s).toUpperCase().replace(/[^A-Z]/g,'');
const defaults=()=>({rotors:['I','II','III'],start:'AAA',rings:'AAA',plugs:''});
function validate(c){if(!Array.isArray(c.rotors)||c.rotors.length!==3||new Set(c.rotors).size!==3||c.rotors.some(x=>!ROTORS[x]))throw Error('Оберіть три різні ротори.');if(!/^[A-Z]{3}$/.test(c.start)||!/^[A-Z]{3}$/.test(c.rings))throw Error('Позиції та кільця — по три латинські літери A–Z.');const pairs=String(c.plugs||'').trim().toUpperCase().split(/\s+/).filter(Boolean);if(pairs.length>10||pairs.some(x=>!/^[A-Z]{2}$/.test(x)||x[0]===x[1])||new Set(pairs.join('')).size!==pairs.length*2)throw Error('Перемички: до 10 пар, наприклад AB CD. Літера належить лише одній парі.');return pairs;}
class Machine{
 constructor(config=defaults()){const pairs=validate(config);this.config={...config,rotors:[...config.rotors],plugs:pairs.join(' ')};this.pos=[...config.start].map(c=>ABC.indexOf(c));this.rings=[...config.rings].map(c=>ABC.indexOf(c));this.plug=[...ABC].map((_,i)=>i);for(const [a,b] of pairs){const i=ABC.indexOf(a),j=ABC.indexOf(b);this.plug[i]=j;this.plug[j]=i;}this.count=0;}
 get windows(){return this.pos.map(x=>ABC[x]).join('');}
 step(){const p=this.pos,n=this.config.rotors.map(x=>ROTORS[x].notch);const mid=ABC[p[1]]===n[1],right=ABC[p[2]]===n[2];if(mid)p[0]=mod(p[0]+1);if(mid||right)p[1]=mod(p[1]+1);p[2]=mod(p[2]+1);}
 pass(n,i,reverse=false){const w=ROTORS[this.config.rotors[i]].w,offset=this.pos[i]-this.rings[i],x=mod(n+offset);const out=reverse?w.indexOf(ABC[x]):ABC.indexOf(w[x]);return mod(out-offset);}
 press(letter){if(!/^[A-Z]$/.test(letter))throw Error('Оберіть одну латинську літеру A–Z.');const before=this.windows;this.step();let n=ABC.indexOf(letter);const path=[{part:'Клавіша',letter:ABC[n]}];n=this.plug[n];path.push({part:'Панель →',letter:ABC[n]});for(let i=2;i>=0;i--){n=this.pass(n,i);path.push({part:this.config.rotors[i]+' →',letter:ABC[n]});}n=ABC.indexOf(REFLECTOR[n]);path.push({part:'Відбивач B',letter:ABC[n]});for(let i=0;i<3;i++){n=this.pass(n,i,true);path.push({part:this.config.rotors[i]+' ←',letter:ABC[n]});}n=this.plug[n];path.push({part:'Панель ←',letter:ABC[n]});this.count++;return {input:letter,output:ABC[n],before,after:this.windows,path};}
 run(text){return [...clean(text)].map(c=>this.press(c));}
}
function run(text,c=defaults()){const m=new Machine(c),trace=m.run(text);return {config:m.config,input:clean(text),output:trace.map(t=>t.output).join(''),windows:m.windows,trace};}
const DISKS=['EKMFLGDQVZNTOWYHXUSPAIBRCJ','AJDKSIRUXBLHWTMCQGZNPYFVOE','BDFHJLCPRTXVZNYEIWGAKMUSQO'];
function diskRow(text,offset){return [...text].map((c,i)=>DISKS[i][mod(DISKS[i].indexOf(c)+offset)]).join('');}
window.EnigmaCore={ABC,ROTORS,REFLECTOR,Machine,run,defaults,validate,clean,diskRow,DISKS};
})();
