import { ButtonLink } from "@/components/ui/Button";
import { ResponsiveImg } from "@/components/ui/ResponsiveImg";
import type { HeroData } from "@/types";

import { HeroVideo } from "./HeroVideo";

/**
 * Full-screen hero. Plays public/videos/hero.(mp4|webm) when uploaded, otherwise shows the
 * hero image (which is also the video's poster).
 */
export function Hero({ data }: { data: HeroData }) {
  return (
    <section className="relative h-[calc(100svh-7.5rem)] min-h-[28rem] w-full overflow-hidden bg-line lg:h-[calc(100svh-9.5rem)]">
      <ResponsiveImg
        mobile={data.mobileImage}
        desktop={data.image}
        priority
        className="absolute inset-0 size-full object-cover"
      />
      {data.video && (
        <HeroVideo mp4={data.video.mp4} webm={data.video.webm} poster={data.image.src} />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 container-page pb-12 text-white lg:pb-20">
        <h1 className="max-w-2xl text-4xl font-light tracking-tight sm:text-5xl lg:text-7xl">
          {data.heading}
        </h1>
        {data.subheading && (
          <p className="mt-3 max-w-md text-base text-white/90">{data.subheading}</p>
        )}
        <ButtonLink href={data.cta.href} variant="inverse" className="mt-6 w-full sm:w-auto">
          {data.cta.label}
        </ButtonLink>
      </div>
    </section>
  );
}
