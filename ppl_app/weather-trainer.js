(()=>{
"use strict";
const $=id=>document.getElementById(id);
const samples=[
"METAR LKPR 071230Z 24008KT 9999 FEW035 14/08 Q1021 NOSIG=",
"METAR LKTB 071300Z 19012KT 3500 -RA BR BKN008 OVC030 09/08 Q1006=",
"METAR LKKV 071330Z 27020G34KT 6000 TSRA SCT018CB BKN030 16/12 Q1009=",
"TAF LKPR 071100Z 0712/0812 24010KT 9999 SCT030 BECMG 0718/0720 28015G25KT 6000 -RA BKN018 TEMPO 0802/0806 2500 RA BKN007=",
"TAF LKTB 071100Z 0712/0812 18008KT 9999 SCT035 PROB30 0718/0722 3000 TSRA BKN015CB FM080300 28012KT 7000 BKN025="
];
const gloss=[
["METAR","Pravidelná zpráva o pozorovaném počasí na letišti."],["SPECI","Mimořádné pozorování při významné změně počasí."],["TAF","Letištní předpověď počasí na dané časové období."],["KT","Uzly – rychlost větru."],["G","Náraz větru, např. 22015G25KT = 15 kt, nárazy 25 kt."],["VRB","Proměnlivý směr větru."],["9999","Převládající dohlednost 10 km nebo více."],["CAVOK","Dohlednost alespoň 10 km, žádná významná oblačnost pod 5 000 ft či vyšší předepsanou mezí, žádné CB/TCU a žádné významné současné počasí."],["FEW","Malé množství oblačnosti (1–2 osminy)."],["SCT","Polojasno, roztrhaná oblačnost (3–4 osminy)."],["BKN","Oblačno, souvislejší oblačnost (5–7 osmin)."],["OVC","Zataženo (8 osmin)."],["NSC","Žádná významná oblačnost podle příslušné definice."],["VV","Vertikální dohlednost při zakrytém nebi, v jednotkách stovek ft."],["CB","Cumulonimbus – bouřkový oblak."],["TCU","Towering cumulus – mohutný kupovitý oblak."],["BR","Kouřmo."],["FG","Mlha."],["RA","Déšť."],["DZ","Mrholení."],["SN","Sníh."],["TS","Bouřka."],["SH","Přeháňky."],["FZ","Namrzající jev."],["Q1013","Tlak QNH 1013 hPa."],["NOSIG","Nepředpokládá se významná změna v krátkodobé předpovědi připojené k METAR."],["TEMPO","Přechodné změny v uvedeném časovém intervalu."],["BECMG","Postupná změna podmínek v uvedeném intervalu."],["FM","Od uvedeného času platí nová skupina předpovědi."],["PROB30","Pravděpodobnost 30 % pro popsané podmínky."],["NSW","Následně žádné významné počasí ve smyslu skupiny."],["M","Záporná teplota, např. M03 = −3 °C."],["Z","Čas UTC / zulu."]
];
const questions=[
["METAR LKPR 071230Z 24008KT 9999 FEW035 14/08 Q1021","Co znamená 24008KT?",["Vítr odkud 240°, 8 kt","Trať 240°, 8 km/h","Dráha 24, dohlednost 800 m"],0,"Směr větru se udává odkud fouká; 08KT = 8 uzlů."],
["METAR LKPR 071230Z 24008KT 9999 FEW035 14/08 Q1021","Co znamená 9999?",["Dohlednost přesně 9 999 m","Dohlednost alespoň 10 km","Dohlednost 999 m"],1,"9999 označuje dohlednost 10 km nebo více."],
["METAR LKPR 071230Z 24008KT 9999 FEW035 14/08 Q1021","Co znamená FEW035?",["Zataženo 3 500 ft","1–2 osminy oblačnosti se základnou 3 500 ft nad letištěm","Oblačnost 35 m AMSL"],1,"FEW znamená 1–2 osminy; 035 × 100 = 3 500 ft nad letištěm."],
["METAR LKPR 071230Z 24008KT 9999 FEW035 14/08 Q1021","Jaké je QNH?",["1 021 hPa","1 021 inHg","102,1 hPa"],0,"Q1021 udává tlak QNH 1021 hPa."],
["METAR LKTB 071300Z 19012KT 3500 -RA BR BKN008 09/08 Q1006","Jaká je převládající dohlednost?",["3,5 km","35 km","350 m"],0,"Skupina 3500 znamená 3 500 metrů."],
["METAR LKTB 071300Z 19012KT 3500 -RA BR BKN008 09/08 Q1006","Co znamená -RA BR?",["Slabý déšť a kouřmo","Silný sníh","Bouřka bez deště"],0,"-RA je slabý déšť, BR je kouřmo."],
["METAR LKTB 071300Z 19012KT 3500 BKN008 OVC030 09/08 Q1006","Jaká je nejnižší hlášená vrstva BKN/OVC?",["800 ft nad letištěm","8 000 ft AMSL","300 ft nad letištěm"],0,"BKN008 znamená základnu vrstvy v 800 ft nad letištěm."],
["METAR LKKV 071330Z 27020G34KT 6000 TSRA SCT018CB 16/12 Q1009","Co vyjadřuje G34?",["Nárazy až 34 kt","Dohlednost 34 km","Směr větru 034°"],0,"G34 je nárazová rychlost 34 uzlů."],
["METAR LKKV 071330Z 27020G34KT 6000 TSRA SCT018CB 16/12 Q1009","Co znamená TSRA?",["Bouřka s deštěm","Slabý mrholivý déšť","Sněhové přeháňky"],0,"TS označuje bouřku, RA déšť."],
["METAR LKPR 071230Z 24008KT 9999 FEW035 14/08 Q1021 NOSIG","Co znamená NOSIG?",["Ve výhledu krátkodobé předpovědi bez významné změny","Bez radiového spojení","Bez současné oblačnosti"],0,"NOSIG se vztahuje ke krátkodobé tendenci počasí, ne k úplné absenci rizika."],
["METAR LKPR 071230Z 24008KT 9999 FEW035 14/08 Q1021","Co znamená 14/08?",["Teplota 14 °C, rosný bod 8 °C","14 km dohlednost a 8 kt vítr","QNH 1408 hPa"],0,"Pár T/Td udává teplotu vzduchu a rosný bod ve °C."],
["METAR LKPR 071230Z 24008KT 9999 FEW035 14/08 Q1021","Co znamená 071230Z?",["7. den v měsíci, 12:30 UTC","7. měsíc, 12:30 místního času","7. den, 23:00 UTC"],0,"První dvě číslice jsou den měsíce, další čtyři hodiny a minuty UTC."],
["TAF LKPR 071100Z 0712/0812 24010KT 9999 SCT030","Jaká je doba platnosti 0712/0812?",["Od 7. dne 12:00 UTC do 8. dne 12:00 UTC","Pouze 7. den od 12:00 do 08:12","Od 7. do 8. hodiny"],0,"Čtyři číslice na obou stranách lomítka znamenají den a hodinu začátku a konce."],
["TAF LKPR 071100Z 0712/0812 24010KT 9999 SCT030 BECMG 0718/0720 28015KT","Co vyjadřuje BECMG 0718/0720?",["Postupnou změnu mezi 18:00 a 20:00 UTC dne 7.","Přechodný výskyt maximálně jednu hodinu","Přesně v 18:20"],0,"BECMG popisuje postupný přechod k novým podmínkám během intervalu."],
["TAF LKPR 071100Z 0712/0812 24010KT 9999 SCT030 TEMPO 0802/0806 2500 RA","Jaký význam má TEMPO?",["Přechodné změny mezi uvedenými časy","Trvalou změnu od 02:00","Zrušení TAF"],0,"TEMPO vyjadřuje dočasné odchylky v rámci intervalu."],
["TAF LKTB 071100Z 0712/0812 18008KT 9999 SCT035 PROB30 0718/0722 3000 TSRA","Co znamená PROB30?",["30% pravděpodobnost popsaných podmínek","Rychlost větru 30 kt","30 minut trvající bouřka"],0,"PROB30 udává pravděpodobnost předpovídaného jevu."],
["TAF LKTB 071100Z 0712/0812 18008KT 9999 SCT035 FM080300 28012KT 7000 BKN025","Co vyjadřuje FM080300?",["Novou předpověď od 8. dne v 03:00 UTC","Počasí pouze do 03:00","Viditelnost 800 m"],0,"FM představuje změnu od konkrétního data a času, obvykle nahrazující předchozí převažující podmínky."],
["METAR LKPR 071230Z 24008KT CAVOK 14/08 Q1021","Je CAVOK univerzální povolení k letu VFR?",["Ano, vždy","Ne, je to souhrnná meteorologická značka, nikoli rozhodnutí o letu","Ano, pokud je let v ČR"],1,"CAVOK neřeší všechny podmínky trasy, terén, aktuální aktivaci prostorů, schopnosti pilota nebo výkony letadla."],
["METAR LKTB 071300Z 19012KT 3500 -RA BR BKN008 09/08 Q1006","Je zpráva sama o sobě dostatečná pro předletovou přípravu přeletu?",["Ano, METAR cíle stačí","Ne, je potřeba také TAF, průběh počasí po trase, alternativy a další podklady","Ano, protože obsahuje QNH"],1,"METAR je pozorování v určitém místě a čase, ne úplná předpověď pro trasu."],
["METAR LKPR 071230Z VRB03KT 9999 NSC 12/06 Q1019","Co znamená VRB03KT?",["Proměnlivý směr větru o rychlosti 3 kt","Vítr 030° a 3 kt","Bezvětří"],0,"VRB je proměnlivý směr, rychlost 03 kt."],
["METAR LKPR 071230Z 00000KT 9999 NSC 12/06 Q1019","Co vyjadřuje 00000KT?",["Bezvětří","Proměnlivý vítr 5 kt","Vítr od severu 50 kt"],0,"00000KT udává klidný vítr."],
["METAR LKPR 071230Z 24008KT 0600 FG VV002 04/04 Q1019","Co znamená VV002?",["Vertikální dohlednost 200 ft při zakrytém nebi","Oblačnost FEW ve 2 000 ft","Výšku dráhy 200 m"],0,"VV se používá u zakrytého nebe; 002 značí 200 ft vertikální dohlednosti."],
["METAR LKPR 071230Z 24008KT 9999 BKN020TCU 16/11 Q1019","Co značí TCU?",["Mohutný kupovitý oblak","Bezvýznamnou vrstevnatou oblačnost","Teplotu rosného bodu"],0,"TCU = towering cumulus, možný signál výrazné konvekce."],
["METAR LKPR 071230Z 24008KT 9999 M03/M07 Q1020","Jaká je teplota vzduchu?",["−3 °C","+3 °C","−7 °C"],0,"Předpona M znamená minus; M03 = −3 °C."],
["METAR LKPR 071230Z 24008KT 9999 SCT030 BKN045 10/05 Q1018","Která vrstva je nejnižší BKN/OVC?",["BKN045, 4 500 ft nad letištěm","SCT030, 3 000 ft nad letištěm","Žádná vrstva není udána"],0,"Ceiling v běžném významu vychází z nejnižší BKN/OVC nebo vertikální dohlednosti, nikoli ze SCT."]
];
const decisions=[
["METAR LKTB 071300Z 19012KT 3500 -RA BR BKN008 09/08 Q1006","Plánuješ běžný denní VFR odlet z letiště uvnitř CTR. Bez zvláštního VFR povolení máš na letišti hlášenou dohlednost 3 500 m a strop 800 ft. Jaké je správné rozhodnutí?",["Nevzlétnout jako běžný VFR; prověřit možnosti a plán","Odletět, pokud běží motor","Dohlednost nehraje roli"],0,"SERA.5005(b) stanoví pro takový provoz bez příslušného povolení hranice stropu 1 500 ft a pozemní dohlednosti 5 km. Oba hlášené údaje jsou pod nimi."],
["METAR LKPR 071230Z 24008KT CAVOK 14/08 Q1021 NOSIG","Na letišti je CAVOK, ale nad horskou trasou nemáš aktuální počasí ani informace o aktivních prostorech. Co uděláš?",["Poletím automaticky, protože CAVOK","Doplním počasí po trase, prostor a alternativy před rozhodnutím","Nebudu kontrolovat nic dalšího"],1,"CAVOK platí pro podmínky konkrétního letiště, nikoliv automaticky pro celý přelet."],
["TAF LKPR 071100Z 0712/0812 24010KT 9999 SCT030 TEMPO 0715/0719 2000 TSRA BKN008CB","Přílet plánuješ v 17:00 UTC, tedy uvnitř TEMPO s bouřkou, dohledností 2 km a nízkými CB. Co je vhodné?",["Předpokládat stále CAVOK","Změnit čas, trasu či cíl; vyhodnotit alternativy a rizika bouřek","TEMPO ignorovat"],1,"Přechodně předpovězené bouřky a nízká dohlednost vyžadují plán s bezpečnými alternativami. TEMPO není záruka, že nenastane."],
["METAR LKKV 071330Z 27020G34KT 6000 TSRA SCT018CB BKN030 16/12 Q1009","Pro malé výcvikové letadlo nejsou ověřeny limity bočního větru a v okolí je bouřka. Jak rozhodneš?",["Vždy odletět, protože dohlednost je přes 5 km","Odložit nebo přehodnotit let až po ověření počasí, limitů a bezpečné alternativy","Vypnout rádio"],1,"Nárazy a bouřka mohou být nebezpečné i při relativně dobré dohlednosti. Je potřeba posoudit konkrétní typ a situaci."],
["METAR LKPR 071230Z 24008KT 9999 FEW035 14/08 Q1021 NOSIG","Jsi před výcvikovým letem. Na letišti je příznivý METAR, ale ještě nemáš potvrzenou předepsanou palivovou rezervu. Co je správně?",["Dopočítat palivo a rezervy dříve, než rozhodneš o letu","Příznivé počasí automaticky nahrazuje rezervu","Letový plán a palivo nejsou důležité"],0,"Vyhodnocení počasí je jen jedna část předletové přípravy; je třeba ověřit také palivo, technický stav a další omezení."],
["TAF LKTB 071100Z 0712/0812 18008KT 9999 SCT035 PROB30 0718/0722 3000 TSRA BKN015CB","Přílet plánuješ na 20:00 UTC. TAF uvádí PROB30 bouřky pro daný interval. Co je správně?",["Bouřka je jistá","Bouřka určitě nenastane","Riziko zahrnout do rozhodnutí, sledovat aktualizace a mít alternativu"],2,"30% pravděpodobnost není nula ani jistota. Je nutné zvážit důsledky i pravděpodobnost."],
["METAR LKPR 071230Z 24008KT 9999 FEW035 14/08 Q1021","Potřebuješ plánovat přílet až za 5 hodin. Na co samotný METAR nestačí?",["Na pozorování QNH v okamžiku zprávy","Na předpověď počasí v čase plánovaného příletu","Na zjištění vydání v UTC"],1,"Pro budoucí čas je třeba TAF a další vhodné předpovědi, samotný METAR popisuje pozorovaný stav."],
["METAR LKTB 071300Z 19012KT 3500 BR BKN008 09/08 Q1006","Ve výuce máš úkol určit nejnižší hlášený strop oblačnosti. Co vybereš?",["800 ft nad letištěm","3 500 ft nad letištěm","8 000 ft nad mořem"],0,"BKN008 značí základnu BKN ve výšce 800 ft nad letištěm; 3500 je dohlednost v metrech."]
];
const weather={"-":"slabé","":"", "+":"silné"};
const wxDict={RA:"déšť",DZ:"mrholení",SN:"sníh",SG:"sněhová zrna",PL:"ledové pelety",GR:"kroupy",GS:"malé kroupy",FG:"mlha",BR:"kouřmo",HZ:"zákal",FU:"kouř",DU:"prach",SA:"písek",TS:"bouřka",SH:"přeháňky",FZ:"namrzající",MI:"nízký",BC:"chuchvalce",PR:"částečně",DR:"nízká zvířená",BL:"vysoká zvířená",VC:"v okolí",SQ:"húlava"};
function describeWx(token){
 let part=token,qual="";
 if(part.startsWith("-")||part.startsWith("+")){qual=part[0]==="-"?"slabý jev: ":"silný jev: ";part=part.slice(1)}
 let found=[];while(part.length>=2){const a=part.slice(0,2);if(!wxDict[a])return null;found.push(wxDict[a]);part=part.slice(2)}return part.length===0&&found.length?qual+found.join(" / "):null;
}
function describe(t,type){
 let m;
 if(/^(METAR|TAF|SPECI|AMD|COR|AUTO)$/.test(t))return {name:"Druh / příznak zprávy",desc:({"METAR":"Pozorování letištního počasí","TAF":"Předpověď letištního počasí","SPECI":"Mimořádná zpráva","AMD":"Opravená předpověď","COR":"Oprava vydané zprávy","AUTO":"Automatické pozorování"})[t]};
 if(/^[A-Z]{4}$/.test(t))return {name:"Letiště ICAO",desc:"Identifikační čtyřpísmenný kód letiště "+t+"."};
 if((m=t.match(/^(\d{2})(\d{2})(\d{2})Z$/)))return {name:"Čas vydání / pozorování UTC",desc:"Den "+Number(m[1])+" v měsíci, "+m[2]+":"+m[3]+" UTC."};
 if((m=t.match(/^(\d{2})(\d{2})\/(\d{2})(\d{2})$/)))return {name:"Časový interval",desc:"Od "+Number(m[1])+". dne "+m[2]+":00 UTC do "+Number(m[3])+". dne "+m[4]+":00 UTC."};
 if((m=t.match(/^FM(\d{2})(\d{2})(\d{2})$/)))return {name:"FM – změna od času",desc:"Nová skupina předpovědi platí od "+Number(m[1])+". dne "+m[2]+":"+m[3]+" UTC."};
 if(t==="TEMPO")return {name:"TEMPO",desc:"Přechodné změny podmínek v následujícím časovém intervalu."};
 if(t==="BECMG")return {name:"BECMG",desc:"Postupný přechod k novým převládajícím podmínkám."};
 if(/^PROB(30|40)$/.test(t))return {name:"Pravděpodobnost",desc:"Pravděpodobnost "+t.slice(4)+" % následně popsaného počasí."};
 if((m=t.match(/^((?:\d{3})|VRB)(\d{2,3})(?:G(\d{2,3}))?KT$/)))return {name:"Přízemní vítr",desc:(m[1]==="VRB"?"Proměnlivý směr":"Vítr od "+Number(m[1])+"°")+" rychlostí "+Number(m[2])+" kt"+(m[3]?", nárazy "+Number(m[3])+" kt":"")+"."};
 if((m=t.match(/^(\d{3})V(\d{3})$/)))return {name:"Proměnlivý směr",desc:"Směr kolísá mezi "+Number(m[1])+"° a "+Number(m[2])+"°."};
 if(t==="CAVOK")return {name:"CAVOK",desc:"Dohlednost alespoň 10 km; žádná významná oblačnost pod předepsaným limitem (obvykle 5 000 ft nebo výše dle MSA), žádné CB/TCU a žádné významné počasí."};
 if(t==="9999")return {name:"Dohlednost",desc:"Převládající dohlednost 10 km nebo více."};
 if(/^\d{4}$/.test(t))return {name:"Dohlednost",desc:"Převládající dohlednost "+Number(t).toLocaleString("cs-CZ")+" m."};
 if((m=t.match(/^(FEW|SCT|BKN|OVC)(\d{3})(CB|TCU)?$/))){const amount={FEW:"1–2 osminy",SCT:"3–4 osminy",BKN:"5–7 osmin",OVC:"8 osmin"};return {name:"Oblačnost",desc:m[1]+" = "+amount[m[1]]+", základna "+(Number(m[2])*100).toLocaleString("cs-CZ")+" ft nad letištěm"+(m[3]?", druh "+m[3]:"")+"."}}
 if((m=t.match(/^VV(\d{3}|\/\/\/)$/)))return {name:"Vertikální dohlednost",desc:m[1]==="///"?"Vertikální dohlednost neurčena.":"Zakryté nebe; vertikální dohlednost "+Number(m[1])*100+" ft."};
 if(t==="NSC")return {name:"NSC",desc:"Žádná významná oblačnost podle pravidel kódování."};
 if(t==="SKC")return {name:"SKC",desc:"Jasná obloha."};
 if((m=t.match(/^(M?\d{2})\/(M?\d{2})$/))){const cv=s=>(s[0]==="M"?"−"+Number(s.slice(1)):String(Number(s)))+" °C";return {name:"Teplota / rosný bod",desc:"Teplota "+cv(m[1])+", rosný bod "+cv(m[2])+"."}}
 if((m=t.match(/^Q(\d{4})$/)))return {name:"QNH",desc:"Tlak QNH "+Number(m[1])+" hPa."};
 if(t==="NOSIG")return {name:"Krátkodobá tendence",desc:"V krátkodobém výhledu se neočekává významná změna."};
 if(t==="NSW")return {name:"NSW",desc:"Žádné významné počasí ve smyslu změnové skupiny."};
 if(t==="RMK")return {name:"Poznámky",desc:"Začátek doplňujících poznámek; následující prvky nemusí tento výukový dekodér podporovat."};
 const wx=describeWx(t);if(wx)return {name:"Jev počasí",desc:wx+"."};
 return {name:"Nepodporovaná nebo neúplná skupina",desc:"Význam nelze tímto výukovým dekodérem bezpečně určit. Ověř v úplném oficiálním klíči METAR/TAF.",unsupported:true};
}
function decode(raw){
 const normalized=raw.toUpperCase().trim().replace(/=+$/,"").replace(/\s+/g," ");
 const parts=normalized.split(" ").filter(Boolean);
 if(!parts.length)return [{token:"—",name:"Prázdná zpráva",desc:"Vlož METAR nebo TAF."}];
 if(!["METAR","SPECI","TAF"].includes(parts[0]))return [{token:parts[0],name:"Nepodporovaný začátek",desc:"Zpráva musí začínat METAR, SPECI nebo TAF."}];
 return parts.map(t=>({token:t,...describe(t,parts[0])}));
}
function fillDecode(){const root=$("decoded");root.replaceChildren();for(const it of decode($("raw").value)){const wrap=document.createElement("div");wrap.className="token";if(it.unsupported)wrap.style.borderColor="#d29b52";let head=document.createElement("strong");head.textContent=it.token+" · "+it.name;let p=document.createElement("p");p.textContent=it.desc;wrap.append(head,p);root.append(wrap)}}
let q=0,d=0,selected=null,dSelected=null,answered=false,dAnswered=false,correct=0,attempted=0;
function renderExercise(kind){
 const isDecision=kind==="decision",items=isDecision?decisions:questions,index=isDecision?d:q,item=items[index],prefix=isDecision?"d":"q",options=$(isDecision?"dChoices":"choices");
 $(prefix==="d"?"dCount":"qCount").textContent=(index+1)+" / "+items.length;
 $(prefix==="d"?"dCode":"qCode").textContent=item[0];
 $(prefix==="d"?"dText":"qText").textContent=item[1];
 options.replaceChildren();$(prefix==="d"?"dResult":"qResult").hidden=true;
 if(isDecision){dSelected=null;dAnswered=false}else{selected=null;answered=false}
 item[2].forEach((value,i)=>{let btn=document.createElement("button");btn.type="button";btn.textContent=value;btn.onclick=()=>{if(isDecision?dAnswered:answered)return;options.querySelectorAll("button").forEach(x=>x.classList.remove("selected"));btn.classList.add("selected");if(isDecision)dSelected=i;else selected=i;};options.append(btn)});
 if(!isDecision)$("score").textContent="V tomto průchodu: "+correct+" správně z "+attempted+" zodpovězených.";
}
function revealExercise(isDecision,mark){
 const i=isDecision?d:q,it=(isDecision?decisions:questions)[i],chosen=isDecision?dSelected:selected,already=isDecision?dAnswered:answered;
 const box=$(isDecision?"dResult":"qResult"),options=$(isDecision?"dChoices":"choices");
 if(already)return;
 if(mark&&chosen===null){box.hidden=false;box.className="feedback bad";box.textContent="Nejprve vyber odpověď, nebo použij tlačítko Ukázat vysvětlení.";return}
 box.hidden=false;box.className="feedback"+(mark&&chosen!==it[3]?" bad":"");
 box.textContent=(chosen===it[3]?"Správně. ":"Správná odpověď: "+it[2][it[3]]+". ")+it[4];
 options.querySelectorAll("button").forEach((button,k)=>{button.disabled=true;if(k===it[3])button.classList.add("correct");if(mark&&k===chosen&&chosen!==it[3])button.classList.add("wrong")});
 if(isDecision)dAnswered=true;else{answered=true;if(mark){attempted++;if(chosen===it[3])correct++}$("score").textContent="V tomto průchodu: "+correct+" správně z "+attempted+" zodpovězených."}
}
$("sample").onchange=()=>{$("raw").value=samples[Number($("sample").value)];fillDecode()};
$("decode").onclick=fillDecode;
$("copy").onclick=()=>{const value=$("raw").value;if(navigator.clipboard&&window.isSecureContext)navigator.clipboard.writeText(value).catch(()=>{});else{$("raw").focus();$("raw").select()}};
$("reveal").onclick=()=>revealExercise(false,false);$("next").onclick=()=>{q=(q+1)%questions.length;renderExercise("quiz")};
$("dReveal").onclick=()=>revealExercise(true,false);$("dNext").onclick=()=>{d=(d+1)%decisions.length;renderExercise("decision")};
document.querySelectorAll("[data-tab]").forEach(b=>b.onclick=()=>{const active=b.dataset.tab;document.querySelectorAll("[data-tab]").forEach(x=>x.classList.toggle("active",x===b));for(const name of ["decoder","quiz","decision","glossary"])$("panel-"+name).hidden=active!==name;});
const glossary=$("glossary");for(const [short,meaning] of gloss){const item=document.createElement("div");const strong=document.createElement("strong");strong.textContent=short;const p=document.createElement("p");p.textContent=meaning;item.append(strong,p);glossary.append(item)}
$("raw").value=samples[0];fillDecode();renderExercise("quiz");renderExercise("decision");
})();