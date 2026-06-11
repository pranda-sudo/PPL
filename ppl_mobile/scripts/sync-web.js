const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");
const source = path.join(root, "ppl_app");
const target = path.join(root, "ppl_mobile", "www");

fs.rmSync(target, { recursive: true, force: true });
fs.cpSync(source, target, { recursive: true });
console.log("Copied ppl_app to ppl_mobile/www");
