"use strict";
const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const files = execFileSync("git", ["ls-files", "-z"], { encoding: "utf8" }).split("\0").filter(Boolean);
const dangerous = [
  ["Private key", /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/],
  ["Stripe secret API key", /\bsk_(?:live|test)_[A-Za-z0-9]{16,}\b/],
  ["Stripe webhook secret", /\bwhsec_[A-Za-z0-9]{16,}\b/],
  ["Supabase secret API key", /\bsb_secret_[A-Za-z0-9_-]{16,}\b/],
  ["GitHub access token", /\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{30,}\b/],
  ["GitHub fine-grained token", /\bgithub_pat_[A-Za-z0-9_]{40,}\b/],
  ["AWS access key ID", /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/],
];
let failed = false;
for (const filename of files) {
  if (!/\.(?:[cm]?js|ts|tsx|jsx|html|css|json|md|ya?ml|toml|sql|env|txt|py)$/i.test(filename)) continue;
  if (!fs.existsSync(filename) || fs.statSync(filename).size > 5_000_000) continue;
  const content = fs.readFileSync(filename, "utf8");
  for (const [kind, pattern] of dangerous) {
    if (pattern.test(content)) { console.error("Potential " + kind + " in " + filename); failed = true; }
  }
  if (/(^|\/)\.env(?:\.|$)/.test(filename) && !filename.endsWith(".env.example")) {
    console.error("Tracked environment file: " + filename); failed = true;
  }
}
if (failed) process.exit(1);
console.log("Security scan passed: no recognized embedded secrets in tracked text files.");
