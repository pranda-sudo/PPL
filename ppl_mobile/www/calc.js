(() => {
"use strict";
const $=id=>document.getElementById(id);
const nf=new Intl.NumberFormat("cs-CZ",{maximumFractionDigits:2});
const n=v=>nf.format(v);
const f=v=>Number.isFinite(v)?n(v):"—";
const rad=d=>d*Math.PI/180;
const norm=d=>(d%360+360)%360;
const input=id=>{const e=$(id);if(!e)return NaN;const s=e.value.trim().replace(",",".");return s===""?NaN:Number(s);};
const missing=x=>!Number.isFinite(x);
function show(id,title,metrics,steps,warnings=[],error=false){
 const root=$("result-"+id);if(!root)return;root.replaceChildren();root.classList.toggle("error",error);
 const headline=document.createElement("div");headline.className="result-header";headline.textContent=title;root.append(headline);
 if(metrics.length){const grid=document.createElement("div");grid.className="metrics";metrics.forEach(([label,value])=>{const card=document.createElement("div");card.className="metric";const strong=document.createElement("strong");strong.textContent=value;const small=document.createElement("span");small.textContent=label;card.append(strong,small);grid.append(card)});root.append(grid)}
 if(steps.length){const block=document.createElement("div");block.className="formula";const label=document.createElement("strong");label.textContent="Postup výpočtu";block.append(label);steps.forEach(step=>{const p=document.createElement("p");p.textContent=step;block.append(p)});root.append(block)}
 if(warnings.length){const ul=document.createElement("ul");ul.className="warnings";warnings.forEach(t=>{const li=document.createElement("li");li.textContent=t;ul.append(li)});root.append(ul)}
}
const error=(id,message)=>show(id,"Oprav vstupní hodnoty",[],[],[message],true);
const positive=(...values)=>values.every(v=>Number.isFinite(v)&&v>0);
const nonnegative=(...values)=>values.every(v=>Number.isFinite(v)&&v>=0);
const validDirection=(...values)=>values.every(v=>Number.isFinite(v)&&v>=0&&v<=360);
function navigation(){
 const dist=input("nav-distance"),gs=input("nav-gs");
 if(!nonnegative(dist)||!positive(gs))return error("navigation","Vzdálenost nesmí být záporná a GS musí být větší než nula.");
 const hours=dist/gs,mins=hours*60;
 show("navigation","Výsledek", [["Doba letu",f(mins)+" min"],["Hodiny",f(hours)+" h"],["Vzdálenost",f(dist)+" NM"]],
 [`čas = vzdálenost / GS = ${f(dist)} / ${f(gs)} = ${f(hours)} h`,`čas v minutách = ${f(hours)} × 60 = ${f(mins)} min`],
 ["Při měnícím se větru a rychlosti se doba letu průběžně přepočítává."]);
}
function wind(){
 const track=input("wind-track"),tas=input("wind-tas"),dir=input("wind-from"),speed=input("wind-speed");
 if(!validDirection(track,dir)||!positive(tas)||!nonnegative(speed))return error("wind","Směry musí být 0–360°, TAS > 0 a vítr nesmí být záporný.");
 const delta=rad(dir-track);
 const head=speed*Math.cos(delta),cross=speed*Math.sin(delta);
 if(Math.abs(cross)>=tas)return error("wind","Boční složka větru dosahuje nebo převyšuje TAS: požadovanou trať při tomto modelu nelze udržet.");
 const correction=Math.asin(cross/tas);
 const gs=tas*Math.cos(correction)-head;
 if(gs<=0)return error("wind","Vypočtená GS je nulová nebo záporná; za těchto podmínek nelze pokračovat po zamýšlené trati vpřed.");
 const hdg=norm(track+correction*180/Math.PI);
 show("wind","Kurz potřebný k udržení trati",[
 ["Letěný kurz (HDG)",f(hdg)+"°"],["Oprava o vítr (WCA)",(correction>=0?"+":"")+f(correction*180/Math.PI)+"°"],
 ["Ground speed",f(gs)+" kt"],["Protivítr / zadní vítr",(head>=0?"Protivítr ":"Zadní vítr ")+f(Math.abs(head))+" kt"],
 ["Boční vítr",(cross>=0?"zprava ":"zleva ")+f(Math.abs(cross))+" kt"]],
 [`podélná složka = ${f(speed)} × cos(${f(norm(dir-track))}°) = ${f(head)} kt (kladná = protivítr)`,
  `boční složka = ${f(speed)} × sin(${f(norm(dir-track))}°) = ${f(cross)} kt (kladná = zprava)`,
  `WCA = arcsin(boční vítr / TAS) = ${f(correction*180/Math.PI)}°`,
  `HDG = trať + WCA = ${f(hdg)}°; GS = TAS × cos(WCA) − protivítr = ${f(gs)} kt`],
 ["Zadaný track i směr větru musí být ve stejné soustavě (oba pravé nebo oba magnetické). Nezahrnuje změny větru, turbulence ani chyby odhadu."]);
}
function runway(){
 const track=input("runway-heading"),dir=input("runway-from"),speed=input("runway-speed");
 if(!validDirection(track,dir)||!nonnegative(speed))return error("runway","Směry musí být v rozsahu 0–360° a rychlost větru nesmí být záporná.");
 const delta=rad(dir-track),head=speed*Math.cos(delta),cross=speed*Math.sin(delta);
 show("runway","Složky větru při daném směru dráhy",[
 [head>=0?"Protivítr":"Zadní vítr",f(Math.abs(head))+" kt"],
 ["Boční složka",f(Math.abs(cross))+" kt"],
 ["Vítr přichází",Math.abs(cross)<.005?"v ose dráhy":cross>0?"zprava":"zleva"]],
 [`podélná složka = ${f(speed)} × cos(${f(norm(dir-track))}°) = ${f(head)} kt`,
 `boční složka = ${f(speed)} × sin(${f(norm(dir-track))}°) = ${f(cross)} kt`],
 ["Před použitím porovnej s limity a doporučeními konkrétního letadla, včetně nárazů a stavu dráhy."]);
}
function fuel(){
 const usable=input("fuel-usable"),burn=input("fuel-burn"),time=input("fuel-time"),reserve=input("fuel-reserve");
 if(!nonnegative(usable,time,reserve)||!positive(burn))return error("fuel","Palivo, čas a rezerva nesmí být záporné; spotřeba musí být větší než nula.");
 const route=burn*time/60,keep=burn*reserve/60,margin=usable-route-keep,endurance=usable/burn*60;
 const warn=["Uvažuj i palivo pro pojíždění, stoupání, změnu počasí, odklon a typově či právně požadované rezervy."];
 if(margin<0)warn.unshift("Zadané použitelné palivo nestačí na plánovaný čas a zvolenou rezervu.");
 show("fuel",margin<0?"Nedostatečné palivo podle vstupů":"Orientační palivová bilance",[
 ["Spotřeba na trasu",f(route)+" l"],["Zvolená rezerva",f(keep)+" l"],
 ["Zůstatek po trase a rezervě",f(margin)+" l"],["Teoretická vytrvalost",f(endurance)+" min"]],
 [`palivo na trasu = ${f(burn)} × ${f(time)} / 60 = ${f(route)} l`,
 `rezerva = ${f(burn)} × ${f(reserve)} / 60 = ${f(keep)} l`,
 `zůstatek = ${f(usable)} − ${f(route)} − ${f(keep)} = ${f(margin)} l`],warn,margin<0);
}
function balance(){
 const pairs=[[1,2],[2,2],[3,2],[4,2]].map(([idx])=>[input("cg-m"+idx),input("cg-a"+idx)]);
 if(pairs.some(([m,a])=>!nonnegative(m)||missing(a)))return error("balance","Hmotnosti musí být nezáporné a každé rameno musí být platné číslo.");
 const mass=pairs.reduce((s,x)=>s+x[0],0);
 if(mass<=0)return error("balance","Součet hmotností musí být větší než nula.");
 const moment=pairs.reduce((s,x)=>s+x[0]*x[1],0),cg=moment/mass;
 const max=$("cg-max").value.trim()===""?null:input("cg-max");
 const forward=$("cg-forward").value.trim()===""?null:input("cg-forward");
 const aft=$("cg-aft").value.trim()===""?null:input("cg-aft");
 if([max,forward,aft].some(x=>x!==null&&!Number.isFinite(x))||(max!==null&&max<=0))return error("balance","Nepovinné meze musí být platná čísla; MTOM musí být kladná.");
 if(forward!==null&&aft!==null&&forward>aft)return error("balance","Přední mez těžiště nesmí být za zadní mezí.");
 const warn=["Výsledek není ověřením letové způsobilosti. Limity těžiště mohou záviset na hmotnosti a je nutné kontrolovat i stav po spotřebování paliva."];
 let exceeded=false;
 if(max===null)warn.push("Není zadané MTOM – hmotnost nebyla porovnána s limitem.");
 else if(mass>max){exceeded=true;warn.push("Vypočtená hmotnost překračuje zadané MTOM.");}
 if(forward===null||aft===null)warn.push("Nejsou zadané obě meze těžiště – nelze potvrdit polohu vůči povolenému rozsahu.");
 else if(cg<forward||cg>aft){exceeded=true;warn.push("Těžiště je mimo zadaný interval.");}
 show("balance",exceeded?"Překročen některý zadaný limit":"Orientační výpočet zatížení",[
 ["Celková hmotnost",f(mass)+" kg"],["Celkový moment",f(moment)+" kg·m"],
 ["Těžiště od referenčního bodu",f(cg)+" m"],["Hmotnostní rezerva",max===null?"Nezadána":f(max-mass)+" kg"]],
 [`součet hmotností = ${pairs.map(p=>f(p[0])).join(" + ")} = ${f(mass)} kg`,
 `celkový moment = Σ(hmotnost × rameno) = ${f(moment)} kg·m`,
 `CG = celkový moment / celková hmotnost = ${f(moment)} / ${f(mass)} = ${f(cg)} m`],warn,exceeded);
}
function climb(){
 const alt=input("climb-feet"),roc=input("climb-rate"),gs=input("climb-gs");
 if(!nonnegative(alt)||!positive(roc,gs))return error("climb","Výškový rozdíl musí být nezáporný; rychlost stoupání/klesání a GS musejí být větší než nula.");
 const minutes=alt/roc,dist=gs*minutes/60,gradient=gs?roc/(gs*6076.11549/60)*100:0;
 show("climb","Orientační stoupání nebo klesání",[
 ["Doba",f(minutes)+" min"],["Vzdálenost za dobu",f(dist)+" NM"],["Gradient",f(gradient)+" %"]],
 [`čas = ${f(alt)} / ${f(roc)} = ${f(minutes)} min`,
 `vzdálenost = ${f(gs)} × ${f(minutes)} / 60 = ${f(dist)} NM`,
 `gradient = (ft/min) / (ft/min podél země) × 100 = ${f(gradient)} %`],
 ["Výpočet předpokládá konstantní vertikální rychlost a GS. Pro bezpečnost vůči terénu musí být zohledněny další faktory."]);
}
const convert={
"nm-km":[1.852,"km","NM × 1,852"],"km-nm":[1/1.852,"NM","km / 1,852"],
"ft-m":[.3048,"m","ft × 0,3048"],"m-ft":[1/.3048,"ft","m / 0,3048"],
"kt-kmh":[1.852,"km/h","kt × 1,852"],"kmh-kt":[1/1.852,"kt","km/h / 1,852"],
"kg-lb":[2.20462262185,"lb","kg × 2,2046226"],"lb-kg":[1/2.20462262185,"kg","lb / 2,2046226"],
"l-usgal":[1/3.785411784,"US gal","l / 3,785411784"],"usgal-l":[3.785411784,"l","US gal × 3,785411784"],
"c-f":[null,"°F","°F = °C × 9/5 + 32"],"f-c":[null,"°C","°C = (°F − 32) × 5/9"],
"hpa-inhg":[1/33.8638866667,"inHg","hPa / 33,8638867"],"inhg-hpa":[33.8638866667,"hPa","inHg × 33,8638867"]
};
function units(){
 const x=input("unit-value"),key=$("unit-pair").value,row=convert[key];
 if(!Number.isFinite(x)||!row)return error("units","Zadej platnou hodnotu.");
 const v=key==="c-f"?x*1.8+32:key==="f-c"?(x-32)/1.8:x*row[0];
 show("units","Převedená hodnota",[["Výsledek",f(v)+" "+row[1]]],[row[2],`Pro vstup ${f(x)} vychází ${f(v)} ${row[1]}.`]);
}
const functions={navigation,wind,runway,fuel,balance,climb,units};
let active="navigation";
function activate(target){
 if(!functions[target])return;
 active=target;
 document.querySelectorAll("[data-tab]").forEach(btn=>{const yes=btn.dataset.tab===target;btn.classList.toggle("selected",yes);btn.setAttribute("aria-pressed",String(yes))});
 document.querySelectorAll("[data-panel]").forEach(panel=>panel.hidden=panel.dataset.panel!==target);
 const url=new URL(window.location.href);url.searchParams.set("tab",target);window.history.replaceState({},"",url);
 functions[target]();
}
document.querySelectorAll("[data-tab]").forEach(btn=>btn.addEventListener("click",()=>activate(btn.dataset.tab)));
document.querySelectorAll("input,select").forEach(control=>control.addEventListener("input",()=>functions[active]()));
activate(new URLSearchParams(location.search).get("tab")||"navigation");
})();