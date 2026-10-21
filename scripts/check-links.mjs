// Checks every internal link and asset in the static export (out/) resolves to a file,
// and prints a page count per route group. Run after `npm run build`:
//   NEXT_PUBLIC_BASE_PATH=/ARBI node scripts/check-links.mjs
import fs from "node:fs";
import path from "node:path";

const root = path.resolve("out");
const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

if (!fs.existsSync(root)) {
  console.error("out/ not found — run `npm run build` first.");
  process.exit(1);
}

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : [p];
  });
}

const htmlFiles = walk(root).filter((f) => f.endsWith(".html"));
const ATTR = /\s(?:href|src|poster)="([^"]+)"|\ssrcset="([^"]+)"/g;

function resolves(urlPath) {
  if (base && !urlPath.startsWith(`${base}/`) && urlPath !== base) return false;
  const rel = decodeURIComponent(urlPath.slice(base.length)) || "/";
  const target = path.join(root, rel);
  if (rel.endsWith("/")) return fs.existsSync(path.join(target, "index.html"));
  return fs.existsSync(target) || fs.existsSync(path.join(target, "index.html"));
}

const broken = new Map();
let checked = 0;
for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8");
  for (const m of html.matchAll(ATTR)) {
    const values = m[1] ? [m[1]] : m[2].split(",").map((s) => s.trim().split(/\s+/)[0]);
    for (const raw of values) {
      const value = raw.replace(/&amp;/g, "&");
      if (!value.startsWith("/") || value.startsWith("//")) continue; // external, mailto:, #, data:
      const urlPath = value.split(/[?#]/)[0];
      checked++;
      if (!resolves(urlPath)) {
        const from = path.relative(root, file);
        if (!broken.has(urlPath)) broken.set(urlPath, new Set());
        broken.get(urlPath).add(from);
      }
    }
  }
}

const pages = htmlFiles
  .map((f) => "/" + path.relative(root, f).replace(/\\/g, "/"))
  .filter((p) => p.endsWith("/index.html"))
  .map((p) => p.replace(/index\.html$/, ""));
const group = (prefix) => pages.filter((p) => p.startsWith(prefix)).length;
const products = group("/products/");
const collections = group("/collections/");
console.log(
  `Pages: ${pages.length} total — ${products} products, ${collections} collections, ` +
    `${pages.length - products - collections} other (+ 404.html: ${fs.existsSync(path.join(root, "404.html")) ? "yes" : "NO"})`,
);
console.log(`Links/assets checked: ${checked} across ${htmlFiles.length} HTML files`);

if (broken.size) {
  console.error(`\n${broken.size} broken internal link(s):`);
  for (const [url, from] of broken) {
    console.error(
      `  ${url}\n    from ${[...from].slice(0, 3).join(", ")}${from.size > 3 ? ` (+${from.size - 3} more)` : ""}`,
    );
  }
  process.exit(1);
}
console.log("No broken internal links.");
