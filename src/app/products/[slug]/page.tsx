import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductCard } from "@/components/product/ProductCard";
import { ProductDetails } from "@/components/product/ProductDetails";
import { ProductGallery } from "@/components/product/ProductGallery";
import { RecentlyViewed } from "@/components/product/RecentlyViewed";
import { Reviews } from "@/components/product/Reviews";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Carousel } from "@/components/ui/Carousel";
import {
  getProduct,
  getProductSlugs,
  getRelatedProducts,
  getReviews,
  getSiblings,
  getSite,
  getSizeChart,
  toSummary,
} from "@/lib/api";
import { formatPrice } from "@/lib/utils/formatPrice";
import { siteUrl } from "@/lib/utils/seo";

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getProductSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/products/[slug]">): Promise<Metadata> {
  const product = await getProduct((await params).slug);
  if (!product) return {};
  const title = `${product.title} — ${product.color.name}`;
  return {
    title,
    description: product.shortDescription,
    openGraph: {
      title,
      description: product.shortDescription,
      images: product.images[0].placeholder ? undefined : [siteUrl(product.images[0].src)],
    },
  };
}

export default async function ProductPage({ params }: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();
  const [related, reviews, site, sizeChart] = await Promise.all([
    getRelatedProducts(product),
    getReviews(product.id),
    getSite(),
    getSizeChart(product.sizeChartId),
  ]);
  const summary = toSummary(product);
  const genderCrumb =
    product.gender === "men"
      ? { label: "Men", href: "/collections/men/" }
      : product.gender === "women"
        ? { label: "Women", href: "/collections/women/" }
        : { label: "Accessories", href: "/collections/accessories/" };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${product.title} — ${product.color.name}`,
    description: product.shortDescription,
    sku: product.variants[0]?.sku,
    color: product.color.name,
    brand: { "@type": "Brand", name: "ARBI" },
    image: product.images.map((i) => siteUrl(i.src)),
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "BDT",
      availability: summary.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
    ...(product.rating !== undefined && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.rating,
        reviewCount: product.reviewCount,
      },
    }),
  };

  const { insideDhaka, outsideDhaka } = site.shippingRates;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <div className="container-page pt-4 pb-16">
        <Breadcrumb
          className="mb-6"
          items={[
            { label: "Home", href: "/" },
            genderCrumb,
            { label: product.title, href: `/products/${slug}/` },
          ]}
        />
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-14">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <ProductGallery images={product.images} title={product.title} />
          </div>
          <ProductDetails
            product={product}
            summary={summary}
            siblings={getSiblings(product)}
            sizeChart={sizeChart}
            trustBadges={site.productTrustBadges}
            deliveryEstimate={site.deliveryEstimate}
            shippingSummary={`Delivery costs ${formatPrice(insideDhaka)} inside Dhaka and ${formatPrice(outsideDhaka)} outside Dhaka, free on orders over ${formatPrice(site.freeShippingThreshold)}. Cash on delivery is available nationwide.`}
          />
        </div>
      </div>

      <section className="border-t border-line bg-line/40">
        <div className="container-page py-12 text-center lg:py-16">
          <p className="label-caps text-xs text-muted">The ARBI note</p>
          <p className="mx-auto mt-3 max-w-2xl text-lg leading-relaxed font-light">
            {site.brandStatement}
          </p>
        </div>
      </section>

      <Reviews rating={product.rating} count={product.reviewCount} reviews={reviews} />

      {related.length > 0 && (
        <section className="container-page border-t border-line section-space">
          <h2 className="mb-8 text-2xl font-light sm:text-3xl">You may also like</h2>
          <Carousel label="You may also like">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </Carousel>
        </section>
      )}

      <RecentlyViewed excludeSlug={slug} />
    </>
  );
}
