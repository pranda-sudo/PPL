/* Pilot Academy v39 – UI access gate, NOT a substitute for protected content hosting.
 * Public GitHub source files remain retrievable until migrated behind authenticated backend.
 */
(function(){
  "use strict";
  const BASE="https://rnoykjhrmparxtopwnrm.supabase.co";
  const KEY="sb_publishable_D7LhJDklP2bjLYsIzUqcRg_GKIPGkgk";
  const style=document.createElement("style");
  style.textContent="html:not(.pilot-access-granted) body{visibility:hidden!important}html.pilot-access-denied body{visibility:visible!important}";
  document.head.appendChild(style);
  // Disable old offline copies for cooperating clients. Previously saved files may remain accessible.
  if("serviceWorker" in navigator){navigator.serviceWorker.getRegistrations().then(rs=>Promise.all(rs.filter(r=>r.scope.startsWith(location.origin+location.pathname.substring(0,location.pathname.lastIndexOf("/")+1))).map(r=>r.unregister()))).catch(()=>{});}
  if("caches" in window){caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith("ppl-testy-")).map(k=>caches.delete(k)))).catch(()=>{});}
  const render=async()=>{
    document.documentElement.classList.add("pilot-access-denied");
    document.body.replaceChildren();
    document.body.style.cssText="visibility:visible!important;min-height:100vh;margin:0;display:grid;place-items:center;padding:24px;background:#f4f7f9;color:#172535;font:16px/1.5 system-ui,-apple-system,Segoe UI,sans-serif";
    const card=document.createElement("section");
    card.style.cssText="width:min(100%,550px);background:white;border:1px solid #dae2e9;border-radius:20px;padding:clamp(24px,5vw,42px);box-shadow:0 20px 50px #17253512;text-align:center";
    const icon=document.createElement("div");icon.textContent="✈";icon.style.cssText="font-size:40px;margin-bottom:13px;color:#0b796c";
    const h=document.createElement("h1");h.textContent="Pilotní akademie";h.style.cssText="font-size:30px;margin:0 0 12px";
    const p=document.createElement("p");p.textContent="Testy a výukové trenažéry jsou dostupné pouze studentům s aktivním členstvím. Pro vstup se přihlas a ověř platnost svého přístupu.";p.style.cssText="color:#627184;margin:0 0 24px";
    const links=document.createElement("div");links.style.cssText="display:flex;gap:12px;flex-wrap:wrap;justify-content:center";
    for(const item of [{text:"Přihlásit se",url:"./ucet.html"},{text:"Členství a tarify",url:"./clenstvi.html"}]){
      const a=document.createElement("a");a.textContent=item.text;a.href=item.url;
      a.style.cssText="background:"+(item.url.includes("ucet")?"#087b6c":"#e8f3f1")+";color:"+(item.url.includes("ucet")?"white":"#087b6c")+";padding:12px 16px;border-radius:10px;text-decoration:none;font-weight:750";
      links.appendChild(a);
    }
    const small=document.createElement("p");small.textContent="Platby zatím nejsou spuštěné. Přístup je uzamčený do dokončení bezpečné platební integrace.";small.style.cssText="font-size:12px;color:#7b8790;margin:23px 0 0";
    const mobile=document.createElement("p");mobile.textContent="📱 Připravujeme také mobilní aplikaci pro iPhone (Apple App Store) a Android (Google Play). Termín vydání zatím nebyl stanoven.";mobile.style.cssText="margin:18px 0 0;padding:14px;background:#edf8f5;color:#17695d;border-radius:11px;font-size:13px;line-height:1.6";
    card.append(icon,h,p,links,mobile,small);document.body.append(card);
  };
  async function check(){
    try{
      const mod=await import("https://esm.sh/@supabase/supabase-js@2.49.4");
      const supabase=mod.createClient(BASE,KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:false}});
      const {data:{user},error:authErr}=await supabase.auth.getUser();
      if(authErr||!user?.id){await render();return}
      const now=new Date().toISOString();
      const {data,error}=await supabase.from("memberships").select("id").eq("user_id",user.id).eq("status","active").lte("starts_at",now).gt("ends_at",now).limit(1);
      if(error||!data?.length){await render();return}
      document.documentElement.classList.add("pilot-access-granted");
      // Load training code only after a fresh authenticated membership check.
      // Source files themselves are still public until server-side migration.
      for (const placeholder of document.querySelectorAll("script[data-member-src]")) {
        await new Promise((resolve,reject)=>{
          const script=document.createElement("script");
          script.src=placeholder.dataset.memberSrc;
          script.async=false;
          script.onload=resolve;
          script.onerror=()=>reject(new Error("Training file unavailable"));
          placeholder.replaceWith(script);
        });
      }
    }catch(e){await render()}
  }
  // Required network check on every page load; no stored membership grant.
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",check,{once:true});
  else check();
})();
