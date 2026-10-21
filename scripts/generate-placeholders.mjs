// Generates SVG placeholders for every image referenced in content/*.json and writes
// docs/ASSETS.md, the list of real files the team can upload to replace them.
//
// Mapping (must match src/lib/api/media.ts):
//   /images/<path>.<ext>  ->  /placeholders/<path>.svg
//
// Runs automatically before `npm run dev` and `npm run build`. Output in public/placeholders
// is generated, so it is git-ignored.
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(
  path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, "$1")),
  "..",
);
const contentDir = path.join(root, "content");
const publicDir = path.join(root, "public");
const outDir = path.join(publicDir, "placeholders");

const PRODUCT_SIZE = { width: 1200, height: 1600 };
const DEFAULT_SIZE = { width: 1200, height: 1600 };
const UPLOAD_EXTS = [".webp", ".avif", ".jpg", ".jpeg", ".png"];

const read = (file) => JSON.parse(fs.readFileSync(path.join(contentDir, file), "utf8"));

/** @type {Map<string, {src: string, alt: string, label: string, tone: string, width: number, height: number, group: string}>} */
const media = new Map();

function add(input, group, defaults = {}) {
  if (!input || typeof input.src !== "string" || !input.src.startsWith("/images/")) return;
  media.set(input.src, {
    src: input.src,
    alt: input.alt ?? "",
    label: input.label ?? defaults.label ?? input.alt ?? "",
    tone: input.tone ?? defaults.tone ?? "#D9D6D0",
    width: input.width ?? defaults.width ?? DEFAULT_SIZE.width,
    height: input.height ?? defaults.height ?? DEFAULT_SIZE.height,
    group,
  });
}

function walk(value, group) {
  if (Array.isArray(value)) return value.forEach((v) => walk(v, group));
  if (value && typeof value === "object") {
    if (typeof value.src === "string") add(value, group);
    Object.values(value).forEach((v) => walk(v, group));
  }
}

for (const p of read("products.json")) {
  p.images.forEach((img, i) =>
    add(img, "Products", {
      ...PRODUCT_SIZE,
      tone: p.color.hex,
      label: `${p.title} — ${p.color.name} (${i + 1}/${p.images.length})`,
    }),
  );
}
for (const [file, group] of [
  ["home.json", "Home page"],
  ["collections.json", "Collections"],
  ["navigation.json", "Menu"],
  ["size-charts.json", "Size charts"],
]) {
  walk(read(file), group);
}

function luminance(hex) {
  const n = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(n.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function wrap(text, maxChars) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = "";
  for (const w of words) {
    if ((line + " " + w).trim().length > maxChars && line) {
      lines.push(line);
      line = w;
    } else line = (line + " " + w).trim();
  }
  if (line) lines.push(line);
  return lines.slice(0, 4);
}

function svg({ src, label, tone, width, height }) {
  const ink = luminance(tone) > 0.35 ? "#111111" : "#FFFFFF";
  const min = Math.min(width, height);
  const fs1 = Math.round(min * 0.055);
  const fs2 = Math.round(min * 0.024);
  const lines = wrap(label, Math.max(12, Math.floor((width * 0.8) / (fs1 * 0.55))));
  const startY = height / 2 - ((lines.length - 1) * fs1 * 1.25) / 2;
  const text = lines
    .map((l, i) => `<tspan x="50%" y="${Math.round(startY + i * fs1 * 1.25)}">${esc(l)}</tspan>`)
    .join("");
  const inset = Math.round(min * 0.04);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(label)} (placeholder)">
<rect width="100%" height="100%" fill="${tone}"/>
<rect x="${inset}" y="${inset}" width="${width - inset * 2}" height="${height - inset * 2}" fill="none" stroke="${ink}" stroke-opacity="0.18" stroke-width="${Math.max(2, Math.round(min * 0.003))}"/>
<g fill="${ink}" font-family="Helvetica, Arial, sans-serif" text-anchor="middle">
<text font-size="${fs2}" letter-spacing="${fs2 * 0.25}" y="${inset + fs2 * 2.4}" x="50%" opacity="0.7">ARBI · PLACEHOLDER</text>
<text font-size="${fs1}" font-weight="600">${text}</text>
<text font-size="${Math.round(fs2 * 0.85)}" y="${height - inset - fs2 * 1.6}" x="50%" opacity="0.6">${esc(src)} · ${width}×${height}</text>
</g>
</svg>
`;
}

const toPlaceholder = (src) =>
  src.replace(/^\/images\//, "/placeholders/").replace(/\.[a-z0-9]+$/i, ".svg");
const hasUpload = (src) => {
  const base = src.replace(/\.[a-z0-9]+$/i, "");
  return UPLOAD_EXTS.some((ext) => fs.existsSync(path.join(publicDir, base + ext)));
};

// Stand-in stock photos (docs/stock-photos.json) count as "replace me", not as ARBI's own.
const stockFile = path.join(root, "docs", "stock-photos.json");
const stock = fs.existsSync(stockFile) ? JSON.parse(fs.readFileSync(stockFile, "utf8")) : {};
const status = (src) =>
  !hasUpload(src) ? "placeholder" : stock[src] ? "stock photo — replace" : "✅ ARBI photo";

fs.rmSync(outDir, { recursive: true, force: true });
let generated = 0;
for (const m of media.values()) {
  const file = path.join(publicDir, toPlaceholder(m.src));
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, svg(m));
  generated++;
}

// docs/ASSETS.md: the upload checklist.
const groups = new Map();
for (const m of media.values()) {
  if (!groups.has(m.group)) groups.set(m.group, []);
  groups.get(m.group).push(m);
}
let md = `# ARBI image and video checklist

Generated by \`scripts/generate-placeholders.mjs\` — do not edit by hand.

Drop a file at the path below (inside \`public/\`) and push. The next build uses it
instead of the placeholder automatically. Files marked "stock photo — replace" are
temporary Pexels stand-ins (see \`docs/CREDITS.md\`): overwrite them with ARBI's own photo
of the same name, then delete that entry from \`docs/stock-photos.json\`. The extension can be any of
${UPLOAD_EXTS.map((e) => `\`${e}\``).join(", ")} as long as the name matches. Optimise
images first (WebP or AVIF, longest side ≤ 2000 px).

## Videos

| File | Status | Notes |
| --- | --- | --- |
| \`public/videos/hero.mp4\` | ${fs.existsSync(path.join(publicDir, "videos/hero.mp4")) ? "✅ uploaded" : "placeholder"} | Home hero, 10–20 s, muted, under 8 MB. The hero image is used as its poster. |
| \`public/videos/hero.webm\` | ${fs.existsSync(path.join(publicDir, "videos/hero.webm")) ? "✅ uploaded" : "optional"} | Optional smaller WebM version of the same clip. |
`;
for (const [group, items] of groups) {
  md += `\n## ${group}\n\n| File | Size | Status | Shows |\n| --- | --- | --- | --- |\n`;
  for (const m of items) {
    md += `| \`public${m.src}\` | ${m.width}×${m.height} | ${status(m.src)} | ${m.label.replace(/\|/g, "/")} |\n`;
  }
}
fs.writeFileSync(path.join(root, "docs", "ASSETS.md"), md);

// docs/CREDITS.md: where each stand-in stock photo came from.
const stockEntries = Object.entries(stock);
let credits = `# Photo credits

Generated by \`scripts/generate-placeholders.mjs\` from \`docs/stock-photos.json\`.

The site currently uses ${stockEntries.length} stand-in photos from [Pexels](https://www.pexels.com/),
used under the [Pexels licence](https://www.pexels.com/license/) (free to use, attribution not
required). They are placeholders until ARBI's own photography replaces them. No reference-store
images are used.

| File | Pexels photo |
| --- | --- |
`;
for (const [file, c] of stockEntries) credits += `| \`public${file}\` | ${c.photo} |\n`;
fs.writeFileSync(path.join(root, "docs", "CREDITS.md"), credits);
console.log(
  `placeholders: ${generated} SVGs written to public/placeholders, docs/ASSETS.md updated`,
);
