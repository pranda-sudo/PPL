(()=>{
"use strict";
const $=id=>document.getElementById(id),key="ppl-preflight-v1",sections=window.PREFLIGHT_SECTIONS;
if(!Array.isArray(sections))return;
const storage={};let blank=false;
const root=$("checklists");
const ids=[];
sections.forEach((section,i)=>{
 const wrap=document.createElement("section");wrap.className="check-section";
 const heading=document.createElement("h3");heading.textContent=section.title;wrap.append(heading);
 section.items.forEach(([label,help],j)=>{
  const id="pf-"+i+"-"+j;ids.push(id);
  const line=document.createElement("div");line.className="checkrow";
  const check=document.createElement("label");check.className="tick";
  const box=document.createElement("input");box.type="checkbox";box.id=id;box.name=id;
  const text=document.createElement("span");text.textContent=label;check.append(box,text);line.append(check);
  const details=document.createElement("details");const sum=document.createElement("summary");sum.textContent="Proč zkontrolovat?";const paragraph=document.createElement("p");paragraph.textContent=help;details.append(sum,paragraph);line.append(details);wrap.append(line);
 });
 root.append(wrap);
});
function fields(){return [...document.querySelectorAll("input[name],select[name],textarea[name]")];}
function save(){
 const obj={};
 fields().forEach(e=>obj[e.name]=e.type==="checkbox"?e.checked:e.value);
 try{localStorage.setItem(key,JSON.stringify(obj));$("saveStatus").textContent="Příprava je uložená v tomto prohlížeči.";}catch{$("saveStatus").textContent="Prohlížeč nepovolil ukládání. Pro zachování údajů použij tisk / PDF.";}
}
function restore(){
 try{const obj=JSON.parse(localStorage.getItem(key)||"{}");fields().forEach(e=>{if(Object.prototype.hasOwnProperty.call(obj,e.name)){if(e.type==="checkbox")e.checked=!!obj[e.name];else e.value=obj[e.name]}})}catch{}
}
function count(){
 const n=ids.filter(id=>$(id).checked).length;
 $("doneCount").textContent=n;$("allCount").textContent=ids.length;$("percentage").textContent=Math.round(n/ids.length*100)+" %";
}
function num(name){
 const e=document.querySelector('[name="'+name+'"]');if(!e||e.value.trim()==="")return null;
 const x=Number(e.value.replace(",","."));return Number.isFinite(x)?x:null;
}
function fuel(){
 const usable=num("fuel"),burn=num("fuelUse"),reserve=num("fuelReserve");
 const dest=$("fuelSummary");dest.classList.remove("warning");
 if([usable,burn,reserve].some(x=>x===null)){dest.textContent="Orientační bilance: doplň použitelné palivo, plánovanou spotřebu a požadovanou rezervu.";return}
 if([usable,burn,reserve].some(x=>x<0)){dest.textContent="Zadej nezáporné hodnoty paliva.";dest.classList.add("warning");return}
 const margin=usable-burn-reserve;
 dest.textContent="Orientační bilance: "+usable.toLocaleString("cs-CZ")+" − "+burn.toLocaleString("cs-CZ")+" − "+reserve.toLocaleString("cs-CZ")+" = "+margin.toLocaleString("cs-CZ",{maximumFractionDigits:1})+" l. "+(margin<0?"Zadané palivo nestačí.":"Před letem ověř typové spotřeby a předepsané rezervy.");
 if(margin<0)dest.classList.add("warning");
}
function navigationLog(){
 let totalNm=0,totalMinutes=0,validLegs=0,missingLegs=0;
 for(let i=1;i<=6;i++){
  const d=num("leg"+i+"nm"),g=num("leg"+i+"gs"),out=$("leg"+i+"time");
  if(d===null&&g===null){out.textContent="–";continue}
  if(d===null||g===null||d<0||g<=0){out.textContent="!";missingLegs++;continue}
  const minutes=d/g*60;
  out.textContent=minutes.toLocaleString("cs-CZ",{maximumFractionDigits:1});
  totalNm+=d;totalMinutes+=minutes;validLegs++;
 }
 $("navTotals").textContent="Úseky: "+validLegs+" · celková vzdálenost "+totalNm.toLocaleString("cs-CZ",{maximumFractionDigits:1})+" NM · čas "+totalMinutes.toLocaleString("cs-CZ",{maximumFractionDigits:1})+" min"+(missingLegs?" · neúplné údaje u "+missingLegs+" úseků":"");
}
function printDocument(isBlank){
 blank=isBlank;
 if(blank)document.body.classList.add("blank-print");else document.body.classList.remove("blank-print");
 $("printDate").textContent="Tisk: "+new Date().toLocaleString("cs-CZ");
 window.print();
}
window.addEventListener("afterprint",()=>{document.body.classList.remove("blank-print");blank=false});
$("printFilled").addEventListener("click",()=>printDocument(false));
$("printBlank").addEventListener("click",()=>printDocument(true));
$("clearAll").addEventListener("click",()=>{
 if(!window.confirm("Opravdu vymazat veškeré údaje, poznámky a zaškrtnuté body přípravy?"))return;
 fields().forEach(e=>{if(e.type==="checkbox")e.checked=false;else if(e.tagName==="SELECT")e.selectedIndex=0;else e.value=""});
 document.querySelector('[name="date"]').valueAsDate=new Date();
 save();count();fuel();navigationLog();
});
document.addEventListener("input",e=>{if(e.target.closest(".shell")){save();count();fuel()}});
document.addEventListener("change",e=>{if(e.target.closest(".shell")){save();count();fuel()}});
restore();
const date=document.querySelector('[name="date"]');if(!date.value)date.valueAsDate=new Date();
count();fuel();navigationLog();
})();