(() => {
  "use strict";
  const data=window.ULL_DATA;
  const $=id=>document.getElementById(id);
  if(!data||!Array.isArray(data.questions))return;
  const key="ppl-ull-errors-v2";
  let errors=[];
  try{ errors=JSON.parse(localStorage.getItem(key)||"[]"); } catch {}
  if(!Array.isArray(errors)) errors=[];
  let pool=[],position=0,answers=new Map(),finished=false;
  const category=$("category"),mode=$("mode"),limit=$("limit");
  [...new Set(data.questions.map(q=>q.category))].forEach(c=>{let o=document.createElement("option");o.value=c;o.textContent=c;category.append(o)});
  function persist(){try{localStorage.setItem(key,JSON.stringify(errors))}catch{}}
  function shuffle(a){const b=a.slice();for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]]}return b}
  function start(){
    pool=shuffle(data.questions.filter(q=>(category.value==="all"||q.category===category.value)&&(mode.value!=="errors"||errors.includes(q.id))));
    if(limit.value!=="all")pool=pool.slice(0,Number(limit.value));
    position=0;answers=new Map();finished=false;
    $("review").hidden=true;$("end").hidden=true;
    render();
  }
  function record(choice){
    let q=pool[position];if(!q||answers.has(q.id)||finished)return;
    let correct=choice===q.correct;
    answers.set(q.id,{choice,correct});
    if(mode.value!=="test"){
      if(!correct&&!errors.includes(q.id))errors.push(q.id);
      if(correct)errors=errors.filter(x=>x!==q.id);
      persist();
    }
    render();
  }
  function showReview(){
    const root=$("reviewList");root.replaceChildren();
    pool.forEach((q,i)=>{
      const ans=answers.get(q.id);
      if(ans?.correct)return;
      const detail=document.createElement("details");
      const label=document.createElement("summary");
      label.textContent=`${i+1}. ${q.question} (${ans?"chybně":"nezodpovězeno"})`;
      const p=document.createElement("p");
      p.textContent=`Správná odpověď: ${q.correct}. ${q.explanation}`;
      detail.append(label,p);root.append(detail);
    });
    $("review").hidden=false;
  }
  function finish(){
    finished=true;
    for(const q of pool){const a=answers.get(q.id);if(!a?.correct&&!errors.includes(q.id))errors.push(q.id);if(a?.correct)errors=errors.filter(x=>x!==q.id)}
    persist();
    const correct=[...answers.values()].filter(a=>a.correct).length,unanswered=pool.length-answers.size;
    $("end").hidden=false;
    $("end").textContent=`Výsledek: ${correct} z ${pool.length} správně (${pool.length?Math.round(100*correct/pool.length):0} %). Nezodpovězeno: ${unanswered}. Jde o neoficiální procvičovací test.`;
    showReview();render();
  }
  function render(){
    const q=pool[position];
    let count=[...answers.values()],correct=count.filter(a=>a.correct).length;
    $("total").textContent=pool.length;
    $("correct").textContent=correct;
    $("mistakes").textContent=count.length-correct;
    $("choices").replaceChildren();
    $("feedback").hidden=true;
    $("reveal").hidden=mode.value==="test";
    $("next").textContent=position===pool.length-1?"Vyhodnotit test":"Další otázka →";
    if(!q){
      $("prompt").textContent="V tomto výběru nejsou žádné otázky. Změň okruh nebo režim.";
      $("subject").textContent="";$("position").textContent="0 / 0";$("reveal").disabled=true;$("next").disabled=true;return;
    }
    const ans=answers.get(q.id),visible=ans&&(mode.value!=="test"||finished);
    $("subject").textContent=q.category;
    $("prompt").textContent=q.question;
    $("position").textContent=`${position+1} / ${pool.length}`;
    $("reveal").disabled=finished||!!ans;
    $("next").disabled=finished;
    for(const option of q.options){
      let b=document.createElement("button");b.type="button";b.className="choice";b.textContent=option;
      if(visible&&option===q.correct)b.classList.add("correct");
      if(visible&&option===ans.choice&&!ans.correct)b.classList.add("wrong");
      b.disabled=finished||!!ans;b.onclick=()=>record(option);$("choices").append(b);
    }
    if(visible){
      $("feedback").hidden=false;
      $("feedbackTitle").textContent="Správná odpověď: "+q.correct;
      $("feedbackText").textContent=q.explanation;
    }
  }
  category.onchange=start;mode.onchange=start;limit.onchange=start;
  $("reset").onclick=start;$("reveal").onclick=()=>record(null);
  $("next").onclick=()=>{if(finished||!pool.length)return;if(position===pool.length-1)finish();else{position++;render();}};
  start();
})();