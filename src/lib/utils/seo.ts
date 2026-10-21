// Absolute URL of the deployed site, e.g. https://saifuddin-csm.github.io/ARBI.
// CI sets NEXT_PUBLIC_SITE_URL from actions/configure-pages; locally it is localhost.
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export function siteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
