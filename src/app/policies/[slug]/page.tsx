import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ContentPageView } from "@/components/content/ContentPageView";
import { getPage } from "@/lib/api";

const POLICIES = ["privacy", "refund", "shipping", "terms"];

export const dynamicParams = false;

export function generateStaticParams() {
  return POLICIES.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/policies/[slug]">): Promise<Metadata> {
  const page = await getPage((await params).slug);
  return page ? { title: page.title } : {};
}

export default async function PolicyPage({ params }: PageProps<"/policies/[slug]">) {
  const { slug } = await params;
  const page = await getPage(slug);
  if (!page) notFound();
  return (
    <ContentPageView
      page={page}
      crumbs={[
        { label: "Home", href: "/" },
        { label: page.title, href: `/policies/${slug}/` },
      ]}
    />
  );
}
