import fs from "node:fs";
import path from "node:path";

import type { Media, MediaInput } from "@/types";

// Resolves content image paths at build time: an uploaded file in public/ wins, otherwise
// the SVG from scripts/generate-placeholders.mjs is used. Keep the mapping in sync with it.

const PUBLIC_DIR = path.join(process.cwd(), "public");
const UPLOAD_EXTS = [".webp", ".avif", ".jpg", ".jpeg", ".png"];
const DEFAULT_SIZE = { width: 1200, height: 1600 };

const existsCache = new Map<string, boolean>();

function publicFileExists(publicPath: string): boolean {
  let hit = existsCache.get(publicPath);
  if (hit === undefined) {
    hit = fs.existsSync(path.join(PUBLIC_DIR, publicPath));
    existsCache.set(publicPath, hit);
  }
  return hit;
}

export function placeholderPath(src: string): string {
  return src.replace(/^\/images\//, "/placeholders/").replace(/\.[a-z0-9]+$/i, ".svg");
}

/** Returns the uploaded file for an /images path, trying common extensions, or undefined. */
export function findUpload(src: string): string | undefined {
  const base = src.replace(/\.[a-z0-9]+$/i, "");
  const own = src.slice(base.length).toLowerCase();
  const candidates = [own, ...UPLOAD_EXTS.filter((e) => e !== own)];
  for (const ext of candidates) {
    if (ext && publicFileExists(base + ext)) return base + ext;
  }
  return undefined;
}

export function resolveMedia(input: MediaInput, defaults: Partial<MediaInput> = {}): Media {
  const upload = input.src.startsWith("/images/") ? findUpload(input.src) : input.src;
  return {
    src: upload ?? placeholderPath(input.src),
    alt: input.alt,
    width: input.width ?? defaults.width ?? DEFAULT_SIZE.width,
    height: input.height ?? defaults.height ?? DEFAULT_SIZE.height,
    placeholder: !upload,
  };
}

/** Returns the video path if the file has been uploaded to public/, else undefined. */
export function resolveVideo(src: string | undefined): string | undefined {
  return src && publicFileExists(src) ? src : undefined;
}
