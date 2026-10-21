"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { ButtonLink } from "@/components/ui/Button";
import { ResponsiveImg } from "@/components/ui/ResponsiveImg";
import { assetPath } from "@/lib/utils/assetPath";
import type { HeroData } from "@/types";

/**
 * Full-screen hero. Plays public/videos/hero.(mp4|webm) when uploaded (muted, looping, with
 * a pause control), otherwise shows the hero image. Reduced-motion users get the poster.
 */
export function Hero({ data }: { data: HeroData }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      if (mq.matches) video.pause();
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  function toggle() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) void video.play();
    else video.pause();
  }

  return (
    <section className="relative h-[calc(100svh-7.5rem)] min-h-[28rem] w-full overflow-hidden bg-line lg:h-[calc(100svh-9.5rem)]">
      <ResponsiveImg
        mobile={data.mobileImage}
        desktop={data.image}
        priority
        className="absolute inset-0 size-full object-cover"
      />
      {data.video && (
        <video
          ref={videoRef}
          className="absolute inset-0 size-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          poster={assetPath(data.image.src)}
          aria-hidden
        >
          {data.video.webm && <source src={assetPath(data.video.webm)} type="video/webm" />}
          {data.video.mp4 && <source src={assetPath(data.video.mp4)} type="video/mp4" />}
        </video>
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
      {data.video && (
        <button
          type="button"
          onClick={toggle}
          className="absolute right-4 bottom-4 inline-flex size-10 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60"
          aria-label={playing ? "Pause background video" : "Play background video"}
        >
          {playing ? (
            <Pause className="size-4" aria-hidden />
          ) : (
            <Play className="size-4" aria-hidden />
          )}
        </button>
      )}
    </section>
  );
}
