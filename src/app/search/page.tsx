import type { Metadata } from "next";
import { Suspense } from "react";

import { SearchResults } from "@/components/search/SearchResults";

export const metadata: Metadata = { title: "Search" };

export default function SearchPage() {
  return (
    <div className="container-page py-10 lg:py-16">
      <h1 className="text-3xl font-light sm:text-4xl">Search</h1>
      <Suspense fallback={<p className="mt-6 text-sm text-muted">Loading search…</p>}>
        <SearchResults />
      </Suspense>
    </div>
  );
}
