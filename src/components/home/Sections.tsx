import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { TrustStrip } from "@/components/layout/TrustStrip";
import { ButtonLink } from "@/components/ui/Button";
import { Img } from "@/components/ui/Img";
import { ResponsiveImg } from "@/components/ui/ResponsiveImg";
import { cn } from "@/lib/utils/cn";
import type { HomeSection, NavLink } from "@/types";

import { Hero } from "./Hero";

type SectionOf<T extends HomeSection["type"]> = Extract<HomeSection, { type: T }>["data"];

function SectionHeading({
  eyebrow,
  title,
  cta,
  className,
}: {
  eyebrow?: string;
  title: string;
  cta?: NavLink;
  className?: string;
}) {
  return (
    <div className={cn("mb-10 flex items-end justify-between gap-6 lg:mb-14", className)}>
      <div>
        {eyebrow && <p className="mb-3 label-caps text-[11px] text-muted">{eyebrow}</p>}
        <h2 className="max-w-xl text-3xl leading-tight font-light tracking-tight sm:text-4xl">
          {title}
        </h2>
      </div>
      {cta && (
        <Link
          href={cta.href}
          className="group hidden shrink-0 items-center gap-2 label-caps text-xs sm:inline-flex"
        >
          <span className="link-underline">{cta.label}</span>
          <ArrowRight
            className="size-3.5 transition-transform duration-300 ease-out group-hover:translate-x-1"
            aria-hidden
          />
        </Link>
      )}
    </div>
  );
}

/** Image tile with a soft zoom on hover and the label over a gradient. */
function Tile({
  href,
  image,
  title,
  subtitle,
  aspect = "aspect-[3/4]",
  priority,
}: {
  href: string;
  image?: SectionOf<"categoryTiles">["collections"][number]["card"];
  title: string;
  subtitle?: string;
  aspect?: string;
  priority?: boolean;
}) {
  return (
    <Link href={href} className={cn("group relative block overflow-hidden bg-line", aspect)}>
      {image && (
        <Img
          media={image}
          priority={priority}
          className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent transition-opacity duration-500 group-hover:opacity-90" />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 text-white lg:p-7">
        <div>
          <h3 className="text-xl font-light tracking-tight lg:text-2xl">{title}</h3>
          {subtitle && <p className="mt-1 text-sm text-white/85">{subtitle}</p>}
        </div>
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-white/70 transition-all duration-300 ease-out group-hover:border-white group-hover:bg-white group-hover:text-text">
          <ArrowRight className="size-4" aria-hidden />
        </span>
      </div>
    </Link>
  );
}

function CategoryTiles({ data }: { data: SectionOf<"categoryTiles"> }) {
  return (
    <section className="container-page reveal section-space">
      <SectionHeading
        eyebrow={data.eyebrow}
        title={data.heading}
        cta={{ label: "Shop all", href: "/collections/all/" }}
      />
      <ul className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-3 lg:gap-4">
        {data.collections.map((c) => (
          <li key={c.slug}>
            <Tile
              href={`/collections/${c.slug}/`}
              image={c.card}
              title={c.title}
              subtitle={c.tagline}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

function Banner({ data }: { data: SectionOf<"banner"> }) {
  return (
    <section className="group relative overflow-hidden bg-line" aria-label={data.heading}>
      <ResponsiveImg
        mobile={data.mobile}
        desktop={data.desktop}
        className="aspect-[2/3] w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.02] md:aspect-[21/9]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent md:bg-gradient-to-r md:from-black/55 md:via-black/20" />
      <div className="absolute inset-x-0 bottom-0 container-page pb-10 text-white md:top-0 md:flex md:flex-col md:justify-center md:pb-0">
        {data.eyebrow && <p className="label-caps text-xs text-white/85">{data.eyebrow}</p>}
        <h2 className="mt-3 max-w-lg text-3xl leading-tight font-light tracking-tight lg:text-5xl">
          {data.heading}
        </h2>
        {data.text && (
          <p className="mt-4 max-w-md text-sm text-white/90 lg:text-base">{data.text}</p>
        )}
        <ButtonLink href={data.cta.href} variant="inverse" className="mt-7 w-full sm:w-fit">
          {data.cta.label}
        </ButtonLink>
      </div>
    </section>
  );
}

function Editorial({ data }: { data: SectionOf<"editorial"> }) {
  return (
    <section className="container-page reveal section-space">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
        <div className="aspect-[4/5] overflow-hidden bg-line">
          <Img media={data.image} className="size-full object-cover" />
        </div>
        <div className="max-w-lg">
          {data.eyebrow && <p className="mb-4 label-caps text-[11px] text-muted">{data.eyebrow}</p>}
          <h2 className="text-3xl leading-tight font-light tracking-tight sm:text-4xl lg:text-5xl">
            {data.heading}
          </h2>
          <p className="mt-6 text-base leading-relaxed text-text/80">{data.text}</p>
          {data.cta && (
            <ButtonLink href={data.cta.href} variant="secondary" className="mt-8 w-full sm:w-auto">
              {data.cta.label}
            </ButtonLink>
          )}
        </div>
      </div>
    </section>
  );
}

function CollectionCards({ data }: { data: SectionOf<"collectionCards"> }) {
  return (
    <section className="container-page reveal section-space">
      <SectionHeading eyebrow={data.eyebrow} title={data.heading} />
      <ul className="grid gap-4 sm:grid-cols-3 lg:gap-6">
        {data.collections.map((c) => (
          <li key={c.slug}>
            <Tile
              href={`/collections/${c.slug}/`}
              image={c.card}
              title={c.title}
              subtitle={c.tagline}
              aspect="aspect-[4/5]"
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

function Lookbook({ data }: { data: SectionOf<"lookbook"> }) {
  return (
    <section className="border-t border-line">
      <div className="container-page reveal section-space">
        <SectionHeading eyebrow={data.eyebrow} title={data.heading} cta={data.cta} />
        {data.text && (
          <p className="-mt-6 mb-10 max-w-md text-sm text-muted lg:-mt-8">{data.text}</p>
        )}
        <ul className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-3 lg:gap-6">
          {data.images.map((img, i) => (
            <li
              key={img.src}
              className={cn(
                "group overflow-hidden bg-line",
                i === 0 && "col-span-2 lg:col-span-1",
                i === 1 && "lg:mt-16",
              )}
            >
              <div className={cn(i === 0 ? "aspect-[4/3] lg:aspect-[3/4]" : "aspect-[3/4]")}>
                <Img
                  media={img}
                  className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
              </div>
            </li>
          ))}
        </ul>
        {data.cta && (
          <ButtonLink href={data.cta.href} variant="secondary" className="mt-10 w-full sm:hidden">
            {data.cta.label}
          </ButtonLink>
        )}
      </div>
    </section>
  );
}

function BrandStatement({ data }: { data: SectionOf<"brandStatement"> }) {
  return (
    <section className="border-t border-line">
      <div className="container-page reveal section-space text-center">
        <p className="mb-6 label-caps text-[11px] text-muted">The ARBI promise</p>
        <p className="mx-auto max-w-4xl text-2xl leading-snug font-light tracking-tight sm:text-3xl lg:text-4xl">
          {data.text}
        </p>
      </div>
    </section>
  );
}

/** Renders home sections in the order given by content/home.json. */
export function HomeSections({ sections }: { sections: HomeSection[] }) {
  return sections.map((section, i) => {
    switch (section.type) {
      case "hero":
        return <Hero key={i} data={section.data} />;
      case "categoryTiles":
        return <CategoryTiles key={i} data={section.data} />;
      case "banner":
        return <Banner key={i} data={section.data} />;
      case "editorial":
        return <Editorial key={i} data={section.data} />;
      case "collectionCards":
        return <CollectionCards key={i} data={section.data} />;
      case "lookbook":
        return <Lookbook key={i} data={section.data} />;
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
