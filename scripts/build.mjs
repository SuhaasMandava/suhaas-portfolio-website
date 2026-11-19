// Copies the public site files into dist/, which is what Cloudflare Pages
// serves. Keeping this list explicit means the README, LICENSE, function
// source and local tooling never end up on the live site.
import { cpSync, rmSync, mkdirSync } from "node:fs";

const PUBLIC = [
  "_headers",
  "index.html",
  "research.html",
  "research-anthropic.html",
  "research-spacex.html",
  "privacy-policy.html",
  "terms-of-use.html",
  "styles.css",
  "research.css",
  "script.js",
  "glow-cursor.js",
  "assets",
  "papers",
  "vendor",
];

rmSync("dist", { recursive: true, force: true });
mkdirSync("dist");
for (const path of PUBLIC) cpSync(path, `dist/${path}`, { recursive: true });
console.log(`Copied ${PUBLIC.length} entries to dist/`);
