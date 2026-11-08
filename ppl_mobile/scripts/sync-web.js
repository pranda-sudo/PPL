const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");
const source = path.join(root, "docs");
const target = path.join(root, "ppl_mobile", "www");

fs.rmSync(target, { recursive: true, force: true });
fs.cpSync(source, target, { recursive: true });
// CNAME is for GitHub Pages DNS only and must not be packaged into native apps.
fs.rmSync(path.join(target, "CNAME"), { force: true });
console.log("Copied canonical docs web application to ppl_mobile/www");
