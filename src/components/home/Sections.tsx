import Link from "next/link";

import { TrustStrip } from "@/components/layout/TrustStrip";
import { ProductCard } from "@/components/product/ProductCard";
import { ButtonLink } from "@/components/ui/Button";
import { Carousel } from "@/components/ui/Carousel";
import { Img } from "@/components/ui/Img";
import { ResponsiveImg } from "@/components/ui/ResponsiveImg";
import type { HomeSection } from "@/types";

import { Hero } from "./Hero";
import { ShopTheLook } from "./ShopTheLook";

type SectionOf<T extends HomeSection["type"]> = Extract<HomeSection, { type: T }>["data"];

function SectionHeading({ title, cta }: { title: string; cta?: { label: string; href: string } }) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4">
      <h2 className="text-2xl font-light sm:text-3xl">{title}</h2>
      {cta && (
        <Link href={cta.href} className="shrink-0 label-caps text-xs underline underline-offset-4">
          {cta.label}
        </Link>
      )}
    </div>
  );
}

function SplitTiles({ data }: { data: SectionOf<"splitTiles"> }) {
  return (
    <section className="grid gap-1 sm:grid-cols-2" aria-label="Shop by gender">
      {data.tiles.map((t) => (
        <Link
          key={t.title}
          href={t.cta.href}
          className="group relative block aspect-[3/4] overflow-hidden bg-line"
        >
          <Img
            media={t.image}
            className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 text-white lg:p-10">
            <h2 className="text-3xl font-light lg:text-4xl">{t.title}</h2>
            <span className="mt-4 inline-block border border-white px-6 py-3 label-caps text-xs transition-colors group-hover:bg-white group-hover:text-text">
              {t.cta.label}
            </span>
          </div>
        </Link>
      ))}
    </section>
  );
}

function Banner({ data }: { data: SectionOf<"banner"> }) {
  return (
    <section className="relative overflow-hidden bg-line" aria-label={data.heading}>
      <ResponsiveImg
        mobile={data.mobile}
        desktop={data.desktop}
        className="aspect-[2/3] w-full object-cover md:aspect-[21/9]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent md:bg-gradient-to-r md:from-black/45" />
      <div className="absolute inset-x-0 bottom-0 container-page pb-10 text-white md:top-0 md:flex md:flex-col md:justify-center md:pb-0">
        {data.eyebrow && <p className="label-caps text-xs text-white/85">{data.eyebrow}</p>}
        <h2 className="mt-2 max-w-lg text-3xl font-light lg:text-5xl">{data.heading}</h2>
        {data.text && (
          <p className="mt-3 max-w-md text-sm text-white/90 lg:text-base">{data.text}</p>
        )}
        <ButtonLink href={data.cta.href} variant="inverse" className="mt-6 w-full sm:w-fit">
          {data.cta.label}
        </ButtonLink>
      </div>
    </section>
  );
}

function ProductRow({ data }: { data: SectionOf<"productRow"> }) {
  return (
    <section className="container-page section-space">
      <SectionHeading title={data.heading} cta={data.cta} />
      <ul className="-mx-[var(--gutter)] flex snap-x snap-mandatory gap-3 overflow-x-auto px-[var(--gutter)] pb-2 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible lg:px-0">
        {data.products.map((p) => (
          <li key={p.slug} className="w-[70%] shrink-0 snap-start sm:w-[40%] lg:w-auto">
            <ProductCard product={p} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function CollectionCards({ data }: { data: SectionOf<"collectionCards"> }) {
  return (
    <section className="container-page section-space pt-0 lg:pt-0">
      <SectionHeading title={data.heading} />
      <ul className="grid gap-6 sm:grid-cols-3">
        {data.collections.map((c) => (
          <li key={c.slug}>
            <Link href={`/collections/${c.slug}/`} className="group block">
              <div className="aspect-[3/4] overflow-hidden bg-line">
                {c.card && (
                  <Img
                    media={c.card}
                    className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                )}
              </div>
              <h3 className="mt-4 label-caps text-sm">{c.title}</h3>
              {c.tagline && <p className="mt-1 text-sm text-muted">{c.tagline}</p>}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ProductCarousel({ data }: { data: SectionOf<"carousel"> }) {
  return (
    <section className="container-page border-t border-line section-space">
      <SectionHeading title={data.heading} cta={data.cta} />
      <Carousel label={data.heading}>
        {data.products.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </Carousel>
    </section>
  );
}

function BrandStatement({ data }: { data: SectionOf<"brandStatement"> }) {
  return (
    <section className="container-page border-t border-line section-space text-center">
      <p className="mx-auto max-w-3xl text-xl leading-relaxed font-light sm:text-2xl lg:text-3xl">
        {data.text}
      </p>
    </section>
  );
}

/** Renders home sections in the order given by content/home.json. */
export function HomeSections({ sections }: { sections: HomeSection[] }) {
  return sections.map((section, i) => {
    switch (section.type) {
      case "hero":
        return <Hero key={i} data={section.data} />;
      case "splitTiles":
        return <SplitTiles key={i} data={section.data} />;
      case "banner":
        return <Banner key={i} data={section.data} />;
      case "productRow":
        return <ProductRow key={i} data={section.data} />;
      case "collectionCards":
        return <CollectionCards key={i} data={section.data} />;
      case "shopTheLook":
        return <ShopTheLook key={i} data={section.data} />;
      case "carousel":
        return <ProductCarousel key={i} data={section.data} />;
      case "brandStatement":
        return <BrandStatement key={i} data={section.data} />;
      case "trustStrip":
        return (
          <section key={i} className="container-page border-t border-line section-space">
            <TrustStrip badges={section.data.badges} />
          </section>
        );
      default:
        return null;
    }
  });
}
