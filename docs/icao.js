(() => {
"use strict";
const el=id=>document.getElementById(id);
const storeKey="ppl-icao-progress-v1";
let saved={};
try { saved=JSON.parse(localStorage.getItem(storeKey)||"{}")||{}; } catch { saved={}; }
let mode="vocabulary",index=0,answered=false,selected=null;
const all=window.ICAO_DATA;
if(!all||!Array.isArray(all.vocabulary)||!Array.isArray(all.radio)){el("prompt").textContent="Nepodařilo se načíst výuková data.";return;}
const items=()=>all[mode];
const shuffle=(a,seed)=>{const b=[...a];let x=(seed+1)*991;for(let j=b.length-1;j>0;j--){x=(x*1664525+1013904223)>>>0;const k=x%(j+1);[b[j],b[k]]=[b[k],b[j]];}return b;};
const save=()=>{try{localStorage.setItem(storeKey,JSON.stringify(saved))}catch{}};
function updateStats(){const total=all.vocabulary.length+all.radio.length;const done=[...all.vocabulary,...all.radio].filter(x=>saved[x.id]).length;el("total").textContent=total;el("done").textContent=done;el("percent").textContent=Math.round(done/total*100)+" %";}
function options(item){if(mode==="radio")return item.options;const alternatives=all.vocabulary.filter(x=>x.id!==item.id).slice((index*3)%Math.max(1,all.vocabulary.length-3));let wrong=alternatives.slice(0,3).map(x=>x.cs);if(wrong.length<3)wrong=all.vocabulary.filter(x=>x.id!==item.id).slice(0,3).map(x=>x.cs);return shuffle([item.cs,...wrong],index);}
function reveal(correctChoice=null){const item=items()[index];answered=true;selected=correctChoice;const correct=mode==="radio"?item.correct:item.cs;[...el("answers").children].forEach(b=>{b.disabled=true;if(b.textContent===correct)b.classList.add("correct");else if(correctChoice===b.textContent)b.classList.add("wrong");});el("feedback").hidden=false;el("feedbackTitle").textContent="Správná odpověď: "+correct;el("feedbackText").textContent=item.why;el("feedbackExample").textContent=mode==="vocabulary"?"Příklad: "+item.example:"Modelová odpověď: "+correct;if(correctChoice===correct){saved[item.id]=true;save();updateStats();}}
function render(){if(mode==="about"){el("study").hidden=true;el("about").hidden=false;return;}el("study").hidden=false;el("about").hidden=true;answered=false;selected=null;el("feedback").hidden=true;const item=items()[index];el("category").textContent=mode==="vocabulary"?"Aviation Vocabulary":"ATC / Radiokomunikace";el("prompt").textContent=mode==="vocabulary"?"Co znamená „"+item.en+"“?":item.prompt;el("hint").textContent=mode==="vocabulary"?"Vyber český význam anglického výrazu.":"Vyber nejvhodnější odpověď pro popsanou situaci.";el("position").textContent=(index+1)+" / "+items().length;el("answers").replaceChildren();options(item).forEach(value=>{const b=document.createElement("button");b.className="choice";b.type="button";b.textContent=value;b.addEventListener("click",()=>{if(!answered)reveal(value)});el("answers").append(b);});}
document.querySelectorAll(".tabs button").forEach(b=>b.addEventListener("click",()=>{mode=b.dataset.mode;index=0;document.querySelectorAll(".tabs button").forEach(x=>x.classList.toggle("active",x===b));render();}));
el("reveal").addEventListener("click",()=>{if(!answered&&mode!=="about")reveal()});
el("next").addEventListener("click",()=>{index=(index+1)%items().length;render()});
updateStats();render();
})();