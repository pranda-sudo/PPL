(() => {
"use strict";
const modules={ppl:null,ull:"./ull.html?v=24",icao:"./icao.html?v=24"};
const buttons=[...document.querySelectorAll(".module-nav [data-module]")];
const controls=document.getElementById("pplSidebarControls"),ppl=document.getElementById("pplWorkspace");
const embedded=document.getElementById("embeddedWorkspace"),frame=document.getElementById("moduleFrame"),shell=document.getElementById("applicationShell");
if(!buttons.length||!controls||!ppl||!embedded||!frame||!shell)return;
let current="ppl";
function activate(target,updateHistory=true){
  if(!Object.prototype.hasOwnProperty.call(modules,target))target="ppl";
  const isPpl=target==="ppl";
  shell.classList.toggle("module-secondary",!isPpl);
  controls.hidden=!isPpl;ppl.hidden=!isPpl;embedded.hidden=isPpl;
  buttons.forEach(b=>{const active=b.dataset.module===target;b.classList.toggle("active",active);b.setAttribute("aria-pressed",String(active));});
  if(!isPpl&&current!==target){frame.src=modules[target];frame.title=target==="ull"?"ULL testy":"ICAO English";}
  current=target;
  const url=new URL(window.location.href);
  if(isPpl)url.searchParams.delete("module");else url.searchParams.set("module",target);
  if(updateHistory&&url.href!==window.location.href)history.pushState({module:target},"",url);
}
buttons.forEach(b=>b.addEventListener("click",()=>{activate(b.dataset.module);window.scrollTo(0,0);}));
window.addEventListener("popstate",()=>activate(new URLSearchParams(window.location.search).get("module")||"ppl",false));
activate(new URLSearchParams(window.location.search).get("module")||"ppl",false);
})();