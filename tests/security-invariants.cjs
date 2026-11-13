"use strict";
const fs = require("node:fs");
const assert = require("node:assert/strict");
const api = fs.readFileSync("supabase/functions/premium-questions/index.ts", "utf8");
const gate = fs.readFileSync("docs/membership-gate.js", "utf8");
const tests = [
  ["verify JWT using Auth server", /auth\.getUser\(/],
  ["reject users without a verified account", /user\.is_anonymous\s*===\s*true/],
  ["check active membership on every request", /\.eq\("status",\s*"active"\)/],
  ["check membership expiry", /\.gt\("ends_at",\s*now\)/],
  ["do not expose correct answer on question fetch", /select\("id,module_key,question_body,options"\)/],
  ["disable browser/proxy caching", /Cache-Control.*no-store/],
  ["limit request body", /MAX_BODY_BYTES/],
  ["reject untrusted browser origins", /!allowedOrigins\.has\(origin\)/],
];
for (const [name, pattern] of tests) assert.match(api, pattern, name);
assert.match(gate, /pilot-access-granted/, "Public gate must enable free access");
assert.doesNotMatch(gate, /supabase\.auth|getUser|memberships/, "Public gate must not require accounts");
// Guard against accidentally adding secret credentials to public application assets.
for (const dir of ["docs", "ppl_app", "ppl_mobile/www"]) {
  for (const file of fs.readdirSync(dir)) {
    if (!/\.(js|html)$/i.test(file)) continue;
    const source = fs.readFileSync(dir + "/" + file, "utf8");
    assert.doesNotMatch(source, /(?:SUPABASE_SERVICE_ROLE_KEY|STRIPE_SECRET_KEY|sb_secret_[A-Za-z0-9_-]{16,}|sk_live_[A-Za-z0-9]{16,})\s*[:=]/, "Server secret found in public asset: " + dir + "/" + file);
  }
}
console.log("Security invariants passed (source checks, not a penetration test).");
