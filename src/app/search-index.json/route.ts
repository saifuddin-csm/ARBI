import { getSearchIndex } from "@/lib/api";

// Prerendered to out/search-index.json; the search drawer and /search load it on demand.
export const dynamic = "force-static";

export async function GET() {
  return Response.json(await getSearchIndex());
}
