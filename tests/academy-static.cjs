const fs=require("node:fs"),assert=require("node:assert/strict");
const dirs=["docs","ppl_app","ppl_mobile/www"],files=["index.html","service-worker.js","clenstvi.html","ucet.html","pilot-public-config.js","radio-exam.js","radio-exam-data.js","ifr.js","ifr-data.js"];
for(const file of files){const a=fs.readFileSync(dirs[0]+"/"+file,"utf8");for(const dir of dirs.slice(1))assert.equal(fs.readFileSync(dir+"/"+file,"utf8"),a,"Unsynced "+dir+"/"+file);}
for(const dir of dirs){
const p=fs.readFileSync(dir+"/pilot-public-config.js","utf8"),index=fs.readFileSync(dir+"/index.html","utf8");
assert.match(p,/paymentsEnabled:\s*false/,"Payments must default to OFF");
assert.match(p,/https:\/\/rnoykjhrmparxtopwnrm\.supabase\.co/);
assert.ok(index.includes("clenstvi.html")&&index.includes("ucet.html"),"Membership menu missing");
assert.ok(fs.readFileSync(dir+"/service-worker.js","utf8").includes("pilot-public-config.js"),"Config not offline cached");
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
console.log("✓ Web, source and mobile are synchronized; payment switch is disabled; public secrets scan and RLS markers passed.");
