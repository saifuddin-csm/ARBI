// Serves the static export in out/ the way GitHub Pages does: under the base path, with
// directory index.html files and out/404.html for unknown paths. Used by Playwright and
// for local previews:  NEXT_PUBLIC_BASE_PATH=/ARBI node scripts/serve-out.mjs
import fs from "node:fs";
import http from "node:http";
import path from "node:path";

const root = path.resolve("out");
const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const port = Number(process.env.PORT ?? 4173);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".json": "application/json",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
};

http
  .createServer((req, res) => {
    const url = decodeURIComponent((req.url ?? "/").split("?")[0]);
    if (base && url === base) {
      res.writeHead(301, { location: `${base}/` });
      return res.end();
    }
    if (!url.startsWith(`${base}/`)) {
      res.writeHead(404);
      return res.end("Not found");
    }
    let file = path.join(root, url.slice(base.length));
    if (!file.startsWith(root)) {
      res.writeHead(403);
      return res.end();
    }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory())
      file = path.join(file, "index.html");
    if (!fs.existsSync(file)) {
      res.writeHead(404, { "content-type": TYPES[".html"] });
      return res.end(fs.readFileSync(path.join(root, "404.html")));
    }
    res.writeHead(200, { "content-type": TYPES[path.extname(file)] ?? "application/octet-stream" });
    fs.createReadStream(file).pipe(res);
  })
  .listen(port, () => console.log(`Serving out/ at http://localhost:${port}${base}/`));
