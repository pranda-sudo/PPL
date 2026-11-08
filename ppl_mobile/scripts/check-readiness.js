"use strict";
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const root=path.resolve(__dirname,".."),web=path.join(root,"www");
const config=JSON.parse(fs.readFileSync(path.join(root,"capacitor.config.json"),"utf8"));
const pkg=JSON.parse(fs.readFileSync(path.join(root,"package.json"),"utf8"));
assert.match(config.appId,/^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*){2,}$/i);
assert.equal(config.webDir,"www");
assert.ok(!config.server?.url,"Production mobile builds must not load remote untrusted origins");
assert.equal(pkg.private,true);
for(const f of ["index.html","ucet.html","membership-gate.js","pilot-public-config.js","mobile-course-selector.js","styles.css"]){
 assert.ok(fs.existsSync(path.join(web,f)),"Missing mobile file: "+f);
}
const html=fs.readFileSync(path.join(web,"index.html"),"utf8");
assert.ok(html.includes("mobileCoursePicker"),"Course chooser missing");
assert.ok(html.includes("data-member-src"),"Paid modules must have membership gate");
const pub=fs.readFileSync(path.join(web,"pilot-public-config.js"),"utf8");
assert.doesNotMatch(pub,/sb_secret_|sk_live_|SUPABASE_SERVICE_ROLE_KEY/);
console.log("OK: mobile app structure and configuration checked.");
// Deliberate release blocker: bundled answer keys would allow extraction from APK/IPA.
const publicBanks=["data/questions.json","data/questions.js","ull-data.js","ifr-data.js","radio-exam-data.js"]
 .filter(f=>fs.existsSync(path.join(web,f)));
if(process.argv.includes("--release")){
 assert.equal(publicBanks.length,0,"STOP RELEASE: premium question banks bundled publicly: "+publicBanks.join(", "));
 throw Error("Release not approved: paid content server migration, payments, privacy & device tests remain outstanding");
}
if(publicBanks.length)console.warn("INTERNAL TEST ONLY: bundled question banks are extractable:",publicBanks.join(", "));
