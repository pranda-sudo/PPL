(()=>{
"use strict";
const data=window.RADIO_EXAM_DATA;if(!data||!Array.isArray(data.questions))return;
const $=id=>document.getElementById(id),licButtons=[...document.querySelectorAll("[data-license]")];
let license=new URLSearchParams(location.search).get("license")==="vfl"?"vfl":"ofl";
let pool=[],index=0,answers=new Map(),finished=false,errors={ofl:[],vfl:[]};
try{const prev=JSON.parse(localStorage.getItem("radio-errors-v1")||"{}");for(const k of ["ofl","vfl"])if(Array.isArray(prev[k]))errors[k]=prev[k]}catch{}
const save=()=>{try{localStorage.setItem("radio-errors-v1",JSON.stringify(errors))}catch{}};
const shuffle=a=>{let b=a.slice();for(let i=b.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]]}return b};
const relevant=q=>q.scope==="both"||q.scope===license;
const category=q=>q.category==="Průkazy"?"Předpisy":q.category;
const topics=[...new Set(data.questions.map(category))];
const select=$("category");topics.forEach(t=>{let option=document.createElement("option");option.value=t;option.textContent=t;select.append(option)});
function getBank(){return data.questions.filter(relevant)}
function stats(){const done=[...answers.values()],ok=done.filter(a=>a.correct).length;$("bankCount").textContent=getBank().length;$("selectedCount").textContent=pool.length;$("correctCount").textContent=ok;$("wrongCount").textContent=done.length-ok;}
function start(){const mode=$("mode").value,cat=select.value;
 pool=shuffle(getBank().filter(q=>(cat==="all"||category(q)===cat)&&(mode!=="errors"||errors[license].includes(q.id))));
 if($("limit").value!=="all")pool=pool.slice(0,Number($("limit").value));
 index=0;answers=new Map();finished=false;
 $("review").hidden=true;$("examResult").hidden=true;render();
}
function saveError(q,isCorrect){if(isCorrect)errors[license]=errors[license].filter(id=>id!==q.id);else if(!errors[license].includes(q.id))errors[license].push(q.id);save();}
function choose(value){const q=pool[index];if(!q||answers.has(q.id)||finished)return;const isCorrect=value===q.correct;answers.set(q.id,{value,correct:isCorrect});if($("mode").value!=="exam")saveError(q,isCorrect);render();}
function finish(){
 finished=true;let correct=0;const bySubject={};
 for(const q of pool){let k=category(q);bySubject[k]??={total:0,correct:0};bySubject[k].total++;
  const a=answers.get(q.id);if(a?.correct){correct++;bySubject[k].correct++}
  saveError(q,!!a?.correct);
 }
 $("examResult").hidden=false;const root=$("examResult");root.replaceChildren();
 const h=document.createElement("h3");h.textContent="Výsledek – "+correct+" / "+pool.length+" ("+(pool.length?Math.round(100*correct/pool.length):0)+" %)";root.append(h);
 for(const [key,v] of Object.entries(bySubject)){let p=document.createElement("p");let percentage=Math.round(v.correct/v.total*100);p.textContent=key+": "+v.correct+" / "+v.total+" ("+percentage+" %) "+(percentage>=90?"– dosaženo 90 %":"– pod 90 %");root.append(p)}
 const note=document.createElement("p");note.textContent="Hranice 90 % je zde jen výuková pomůcka. Oficiální písemná zkouška se hodnotí zvlášť za každý předmět a vychází z úplné banky ČTÚ.";root.append(note);
 $("review").hidden=false;const review=$("reviewRows");review.replaceChildren();
 pool.forEach((q,i)=>{let a=answers.get(q.id);if(a?.correct)return;const details=document.createElement("details"),summary=document.createElement("summary"),p=document.createElement("p");summary.textContent=(i+1)+". "+q.question; p.textContent="Správně: "+q.correct+". "+q.explanation;details.append(summary,p);review.append(details)});
 render();
}
function render(){
 const q=pool[index],mode=$("mode").value;stats();$("choices").replaceChildren();$("feedback").hidden=true;
 $("reveal").hidden=mode==="exam";$("next").disabled=finished||!pool.length;
 $("next").textContent=index===pool.length-1?"Dokončit a vyhodnotit":"Další otázka →";
 if(!q){$("prompt").textContent="Pro aktuální výběr nejsou otázky. Změň nastavení nebo zahaj nový průchod.";$("subject").textContent="";$("position").textContent="0 / 0";$("reveal").disabled=true;return;}
 $("prompt").textContent=q.question;$("subject").textContent=category(q);$("position").textContent=(index+1)+" / "+pool.length;
 const response=answers.get(q.id),show=!!response&&(mode!=="exam"||finished);
 $("reveal").disabled=finished||!!response;
 const rotated=shuffle(q.options);
 for(const opt of rotated){const button=document.createElement("button");button.type="button";button.textContent=opt;button.disabled=finished||!!response;if(show&&opt===q.correct)button.classList.add("correct");if(show&&opt===response.value&&!response.correct)button.classList.add("wrong");button.onclick=()=>choose(opt);$("choices").append(button)}
 if(show){const box=$("feedback");box.hidden=false;box.className="feedback"+(response.correct?"":" bad");const b=document.createElement("strong");b.textContent=response.correct?"Správně!":"Správná odpověď: "+q.correct;const p=document.createElement("p");p.textContent=q.explanation;box.replaceChildren(b,p);}
}
const oral=[
{scope:"both",title:"Hláskovací abeceda",question:"Vyhláskuj registrační značku OK-ABC mezinárodní hláskovací abecedou.",answer:"Oscar Kilo – Alfa Bravo Charlie. U zkoušky trénuj také české hláskování podle aktuální osnovy OFL.",why:"Nezbytné podle ústní osnovy ČTÚ."},
{scope:"both",title:"Zkouška rádia",question:"Předveď žádost o zkoušku rádia a vysvětli stupeň čitelnosti 1–5.",answer:"Uveď volanou stanici, vlastní volací značku, zkoušku rádia a kmitočet. Stupeň 5 označuje dokonale čitelné vysílání.",why:"Nezbytné pro OFL i VFL."},
{scope:"both",title:"Čísla a frekvence",question:"Přečti nahlas čísla dráhy, výšku, dohlednost a frekvenci 118,505 MHz podle používané frazeologie.",answer:"Vyslov jednotlivé číslice ve správném jazyce a s předepsaným způsobem hláskování; rozlišuj zvláštní pravidla pro výšky a dohlednosti. Před skutečným vysíláním ověř aktuální L FRAZEOLOGIE.",why:"Součást povinné osnovy ČTÚ."},
{scope:"both",title:"Priorita zpráv",question:"Uveď rozdíl mezi MAYDAY a PAN PAN a sestav krátkou nouzovou zprávu.",answer:"MAYDAY je tíseň s nejvyšší předností, PAN PAN naléhavost/pilnost. Tísňová zpráva: MAYDAY třikrát, volaná stanice, volací značka, povaha tísně, úmysl pilota, poloha/výška a další užitečné údaje.",why:"Tíseň a pilnost jsou nezbytnou ústní dovedností."},
{scope:"both",title:"Navázání spojení",question:"Zahaj spojení s příslušnou leteckou stanicí. Jak se představíš a co oznámíš?",answer:"Oslov stanici jejím volacím znakem, uveď vlastní volací znak a následně požadavek či polohu, podle postupů a situace. Nepovažuj vlastní žádost za vydané povolení.",why:"Základní radiotelefonní provoz."},
{scope:"both",title:"Vstup do CTR",question:"Chceš vstoupit do řízeného okrsku. Co uděláš před hranicí CTR?",answer:"Včas navážeš spojení s příslušným ATC, uvedeš volací značku, polohu, výšku a záměr a vyčkáš požadovaného povolení. Do CTR nevstupuj bez splnění předepsaných podmínek.",why:"Modelová situace ve zveřejněné ústní osnově."},
{scope:"both",title:"Opakování bezpečnostně významných pokynů",question:"ATC ti přidělí výšku a povolení k překřížení dráhy. Jak postupuješ?",answer:"Přečti zpět přidělenou výšku a povolení ke křížení včetně označení dráhy a vlastní volací značky; při nejasnosti požádej o zopakování.",why:"Přesné potvrzení snižuje riziko nedorozumění."},
{scope:"vfl",title:"Anglická frazeologie",question:"Přelož do angličtiny: Žádám o vstup do řízeného okrsku a pokračování na letiště.",answer:"Příklad: Request entry into controlled zone for landing at [aerodrome]. V praxi doplň volací znak, polohu, výšku a potřebné údaje podle požadavků stanoviště.",why:"VFL zahrnuje praktickou anglickou komunikaci."},
{scope:"vfl",title:"ATIS",question:"Poslechni ATIS a zaznamenej identifikátor informace, dráhu, vítr a QNH.",answer:"Při nácviku zapisuj písmeno informace, čas, používanou dráhu, směr a rychlost větru, dohlednost a QNH. Aktuální ATIS se mění; výukové zadání nepředstavuje živé vysílání.",why:"ATIS je uvedený v oficiální ústní osnově VFL."},
{scope:"vfl",title:"Četba a překlad",question:"Přečti a přelož krátký anglický NOTAM a větu z letecké informační příručky.",answer:"Cvič přesné porozumění omezením, časům UTC, místu a podmínkám provozu. ČTÚ požaduje četbu a překlad anglického leteckého textu.",why:"Specifická součást ústní části VFL."},
{scope:"vfl",title:"QDM / QDR",question:"Vysvětli rozdíl mezi QDM a QDR.",answer:"QDM je magnetický směr k radiostanici (bez větru); QDR je magnetický směr od stanice. Nejde automaticky o aktuálně letěný heading při větru.",why:"Q-kódy jsou součástí ústní osnovy VFL."},
{scope:"vfl",title:"Rozdíl VFL a ICAO English",question:"Získáš složením ústní zkoušky VFL automaticky jazykovou kvalifikaci ICAO Level 4?",answer:"Ne. Radiotelefonní oprávnění VFL a zápis jazykové způsobilosti podle ICAO/Part-FCL jsou odlišné věci.",why:"ČTÚ na tento rozdíl přímo upozorňuje."}
];
function loadOral(){const root=$("oralCards");root.replaceChildren();let stored={};try{stored=JSON.parse(localStorage.getItem("radio-oral-v1")||"{}")}catch{}
 const subset=oral.filter(x=>x.scope==="both"||x.scope===license);
 subset.forEach((x,i)=>{const key=license+"-"+x.title;let card=document.createElement("article");card.className="oral-card";let h=document.createElement("h3");h.textContent=(i+1)+". "+x.title;let p=document.createElement("p");p.textContent=x.question;const d=document.createElement("details");const summary=document.createElement("summary");summary.textContent="Otevřít vzorový postup";const answer=document.createElement("p");answer.textContent=x.answer;const why=document.createElement("p");why.textContent=x.why;d.append(summary,answer,why);const label=document.createElement("label"),box=document.createElement("input");box.type="checkbox";box.checked=!!stored[key];const tx=document.createElement("span");tx.textContent="Procvičeno nahlas";label.append(box,tx);box.onchange=()=>{stored[key]=box.checked;try{localStorage.setItem("radio-oral-v1",JSON.stringify(stored))}catch{}updateOral()};card.append(h,p,d,label);root.append(card)});
 function updateOral(){const checks=[...root.querySelectorAll('input[type="checkbox"]')];$("oralStatus").textContent="Ústní příprava: "+checks.filter(x=>x.checked).length+" / "+checks.length+" témat procvičeno (neznamená úspěšné složení ústní zkoušky)."}
 $("resetOral").onclick=()=>{root.querySelectorAll('input[type="checkbox"]').forEach(x=>x.checked=false);subset.forEach(x=>{stored[license+"-"+x.title]=false});try{localStorage.setItem("radio-oral-v1",JSON.stringify(stored))}catch{}updateOral()};
 updateOral();
}
function setLicense(value){license=value;licButtons.forEach(b=>{const active=b.dataset.license===value;b.classList.toggle("active",active);b.setAttribute("aria-pressed",String(active))});$("licenseInfo").textContent=value==="ofl"?"OFL: omezené radiotelefonní oprávnění platné pouze na území ČR. Ústní zkouška převážně v češtině.":"VFL: všeobecný průkaz s širšími oprávněními. Ústní zkouška zahrnuje angličtinu a ATIS.";
 const url=new URL(location.href);url.searchParams.set("license",value);history.replaceState(null,"",url);start();loadOral();}
licButtons.forEach(b=>b.onclick=()=>setLicense(b.dataset.license));
$("mode").onchange=start;select.onchange=start;$("limit").onchange=start;$("restart").onclick=start;
$("reveal").onclick=()=>choose(null);
$("next").onclick=()=>{if(finished||!pool.length)return;if(index===pool.length-1)finish();else{index++;render()}};
document.querySelectorAll("[data-view]").forEach(b=>b.onclick=()=>{const id=b.dataset.view;document.querySelectorAll("[data-view]").forEach(x=>x.classList.toggle("active",x===b));for(const view of ["test","oral","official"])$(view+"View").hidden=view!==id});
setLicense(license);
})();