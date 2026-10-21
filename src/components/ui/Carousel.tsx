"use client";

import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { type ReactNode, useCallback, useEffect, useState } from "react";

import { cn } from "@/lib/utils/cn";

type CarouselProps = {
  label: string;
  children: ReactNode[];
  /** Tailwind width classes for each slide. */
  slideClassName?: string;
  className?: string;
  controls?: boolean;
};

export function Carousel({
  label,
  children,
  slideClassName = "basis-[72%] sm:basis-[42%] lg:basis-[24%]",
  className,
  controls = true,
}: CarouselProps) {
  const [emblaRef, embla] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: true,
  });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const update = useCallback(() => {
    if (!embla) return;
    setCanPrev(embla.canScrollPrev());
    setCanNext(embla.canScrollNext());
  }, [embla]);

  useEffect(() => {
    if (!embla) return;
    const frame = requestAnimationFrame(update);
    embla.on("select", update).on("reInit", update).on("scroll", update);
    return () => {
      cancelAnimationFrame(frame);
      embla.off("select", update).off("reInit", update).off("scroll", update);
    };
  }, [embla, update]);

  return (
    <div
      className={cn("relative", className)}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
    >
      <div className="overflow-hidden" ref={emblaRef}>
        <ul className="-ml-3 flex touch-pan-y sm:-ml-4">
          {children.map((child, i) => (
            <li
              key={i}
              className={cn("min-w-0 shrink-0 grow-0 pl-3 sm:pl-4", slideClassName)}
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${children.length}`}
            >
              {child}
            </li>
          ))}
        </ul>
      </div>
      {controls && (canPrev || canNext) && (
        <div className="mt-4 hidden justify-end gap-2 md:flex">
          <button
            type="button"
            onClick={() => embla?.scrollPrev()}
            disabled={!canPrev}
            aria-label="Previous slides"
            className="inline-flex size-10 items-center justify-center rounded-full border border-line hover:border-text disabled:opacity-30"
          >
            <ChevronLeft className="size-4" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => embla?.scrollNext()}
            disabled={!canNext}
            aria-label="Next slides"
            className="inline-flex size-10 items-center justify-center rounded-full border border-line hover:border-text disabled:opacity-30"
          >
            <ChevronRight className="size-4" aria-hidden />
          </button>
        </div>
      )}
    </div>
  );
}
