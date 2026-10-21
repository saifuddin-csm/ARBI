import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ContentPageView } from "@/components/content/ContentPageView";
import { getPage } from "@/lib/api";

export const metadata: Metadata = { title: "About ARBI" };

export default async function AboutPage() {
  const page = await getPage("about");
  if (!page) notFound();
  return (
    <ContentPageView
      page={page}
      crumbs={[
        { label: "Home", href: "/" },
        { label: "About", href: "/pages/about/" },
      ]}
    />
  );
}
