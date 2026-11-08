const fs=require("node:fs"),assert=require("node:assert/strict");
const dirs=["docs","ppl_app","ppl_mobile/www"],files=["index.html","styles.css","mobile-course-selector.js","service-worker.js","clenstvi.html","ucet.html","pilot-public-config.js","membership-gate.js","radio-exam.js","radio-exam-data.js","ifr.js","ifr-data.js"];
for(const file of files){const a=fs.readFileSync(dirs[0]+"/"+file,"utf8");for(const dir of dirs.slice(1))assert.equal(fs.readFileSync(dir+"/"+file,"utf8"),a,"Unsynced "+dir+"/"+file);}
for(const dir of dirs){
const p=fs.readFileSync(dir+"/pilot-public-config.js","utf8"),index=fs.readFileSync(dir+"/index.html","utf8");
assert.match(p,/paymentsEnabled:\s*false/,"Payments must default to OFF");
assert.match(p,/https:\/\/rnoykjhrmparxtopwnrm\.supabase\.co/);
assert.ok(index.includes("clenstvi.html")&&index.includes("ucet.html"),"Membership menu missing");
assert.ok(index.includes("mobile-coming-soon")&&index.includes("Android")&&index.includes("iPhone"),"Mobile app announcement missing from home");
assert.ok(fs.readFileSync(dir+"/clenstvi.html","utf8").includes("Mobilní aplikace připravujeme"),"Mobile app announcement missing from membership page");
assert.ok(fs.readFileSync(dir+"/service-worker.js","utf8").includes("registration.unregister()"),"Legacy offline PWA is not retired");
for(const name of ["index.html","ull.html","icao.html","icao-flight.html","ifr.html","radio-exam.html","calc.html","instruments.html","preflight.html","weather-trainer.html"]){const content=fs.readFileSync(dir+"/"+name,"utf8");assert.ok(content.includes("membership-gate.js?v=39"),"Missing membership gate: "+dir+"/"+name);assert.ok(content.includes("html:not(.pilot-access-granted)"),"No fail-closed CSS: "+dir+"/"+name);}
}
for(const f of ["docs/ucet.html","docs/clenstvi.html"]){
const text=fs.readFileSync(f,"utf8"),script=[...text.matchAll(/<script(?:\s+[^>]*)?>([\s\S]*?)<\/script>/g)].map(m=>m[1]).filter(Boolean);
for(const s of script)new Function(s);
}
for(const f of ["docs/pilot-public-config.js","docs/radio-exam.js","docs/radio-exam-data.js","docs/ifr.js","docs/ifr-data.js"])new Function(fs.readFileSync(f,"utf8"));
const exposed=dirs.flatMap(dir=>["pilot-public-config.js","clenstvi.html","ucet.html"].map(f=>dir+"/"+f));
for(const file of exposed){const content=fs.readFileSync(file,"utf8");assert.doesNotMatch(content,/(?:sk_live_|sk_test_[A-Za-z0-9]{16}|whsec_[A-Za-z0-9]{16}|sb_secret_[A-Za-z0-9]{16}|service_role\s*[:=]\s*['"][A-Za-z0-9])/,"Possible exposed secret in "+file);}
const sql=fs.readFileSync("supabase/migrations/20261107_pilot_academy.sql","utf8");
for(const name of ["student_profiles","memberships","study_progress","premium_questions","stripe_event_receipts"])assert.match(sql,new RegExp("alter table public\\."+name+" enable row level security","i"));
console.log("✓ Member UI gates installed across all modules; PWA caches retired; web/mobile synced; payments remain disabled.");

for (const dir of dirs) {
 const mainCss=fs.readFileSync(dir+"/styles.css","utf8");
 const account=fs.readFileSync(dir+"/ucet.html","utf8");
 assert.match(mainCss,/touch-action:\s*manipulation/,"Mobile touch behavior missing: "+dir);
 assert.match(mainCss,/@media \(max-width: 360px\)/,"Very narrow mobile layout missing: "+dir);
 assert.match(mainCss,/grid-template-columns:\s*1fr/,"Single-column mobile layout missing: "+dir);
 assert.match(account,/fields input\{font-size:16px/,"iOS login input zoom prevention missing: "+dir);
 assert.match(account,/safe-area-inset-bottom/,"iOS safe-area handling missing: "+dir);
}
console.log("✓ Mobile web styles and login consistency validated.");

for(const dir of dirs){
 const page=fs.readFileSync(dir+"/index.html","utf8"),css=fs.readFileSync(dir+"/styles.css","utf8"),js=fs.readFileSync(dir+"/mobile-course-selector.js","utf8"),account=fs.readFileSync(dir+"/ucet.html","utf8");
 for(const fragment of ["mobileCoursePicker","mobileOpenPpl","mobileBackToCourses","./ull.html","./ifr.html","./radio-exam.html","./icao.html","./mobile-course-selector.js"])assert.ok(page.includes(fragment),"Missing course selector component: "+dir+" "+fragment);
 assert.ok(css.includes("html:not(.pilot-mobile-ppl-open) .mobile-course-picker"),"Course selector CSS missing "+dir);
 assert.ok(js.includes("pilot-mobile-ppl-open"),"Course chooser interaction missing "+dir);
 assert.ok(account.includes("Vybrat kurz a pokračovat"),"Course picker account CTA missing "+dir);
 new Function(js);
}
console.log("✓ Mobile course selection and navigation synced.");

for (const dir of dirs) {
  const css=fs.readFileSync(dir+"/styles.css","utf8");
  const selector=css.slice(css.lastIndexOf("/* The same post-login course chooser is the desktop home as well. */"));
  assert.ok(selector.includes("@media(min-width:821px)"),"Desktop course selection breakpoint missing: "+dir);
  assert.ok(selector.includes("html:not(.pilot-mobile-ppl-open) .app-shell{display:none}"),"Desktop default must show course chooser: "+dir);
  assert.ok(selector.includes("html.pilot-mobile-ppl-open .mobile-back-to-courses{display:inline-flex}"),"Desktop return navigation missing: "+dir);
  assert.ok(selector.includes("repeat(3,minmax(0,1fr))"),"Desktop course card grid missing: "+dir);
}
console.log("✓ Desktop and mobile course chooser both enabled.");
