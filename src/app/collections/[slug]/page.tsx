import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { CollectionView } from "@/components/collection/CollectionView";
import { ProductGrid } from "@/components/collection/ProductGrid";
import { ProductCard } from "@/components/product/ProductCard";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ResponsiveImg } from "@/components/ui/ResponsiveImg";
import { getCollection, getCollectionProducts, getCollectionSlugs } from "@/lib/api";
import { PAGE_SIZE, sortProducts } from "@/lib/utils/catalog";

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getCollectionSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/collections/[slug]">): Promise<Metadata> {
  const collection = await getCollection((await params).slug);
  return collection ? { title: collection.title, description: collection.description } : {};
}

export default async function CollectionPage({ params }: PageProps<"/collections/[slug]">) {
  const { slug } = await params;
  const collection = await getCollection(slug);
  if (!collection) notFound();
  const products = await getCollectionProducts(slug);
  // Prerendered first page (default sort) shown until the client applies URL filters.
  const firstPage = sortProducts(products, "featured").slice(0, PAGE_SIZE);
  const firstSlugs = new Set(firstPage.slice(0, 4).map((p) => p.slug));
  const cards = Object.fromEntries(
    products.map((p) => [
      p.slug,
      <ProductCard key={p.slug} product={p} priority={firstSlugs.has(p.slug)} />,
    ]),
  );

  return (
    <>
      {collection.banner && (
        <div className="relative bg-line">
          <ResponsiveImg
            mobile={collection.banner.mobile}
            desktop={collection.banner.desktop}
            priority
            className="aspect-[2/3] max-h-[50vh] w-full object-cover md:aspect-[21/9]"
          />
        </div>
      )}
      <div className="container-page pt-6 pb-16 lg:pb-24">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: collection.title, href: `/collections/${slug}/` },
          ]}
        />
        <header className="mt-6 mb-8 max-w-2xl">
          <h1 className="text-3xl font-light sm:text-4xl">{collection.title}</h1>
          {collection.description && (
            <p className="mt-3 text-sm text-muted">{collection.description}</p>
          )}
        </header>
        <Suspense fallback={<ProductGrid products={firstPage} />}>
          <CollectionView products={products} cards={cards} />
        </Suspense>
      </div>
    </>
  );
}
