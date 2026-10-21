const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * Prefixes a root-relative path from /public with the deploy basePath.
 * next/link handles basePath itself; plain <img>, <video> and CSS urls do not.
 */
export function assetPath(path: string): string {
  if (/^(https?:)?\/\//.test(path) || path.startsWith("data:")) return path;
  return `${basePath}${path.startsWith("/") ? path : `/${path}`}`;
}
