"use client";

import useEmblaCarousel from "embla-carousel-react";
import { ZoomIn } from "lucide-react";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";

import { Img } from "@/components/ui/Img";
import { cn } from "@/lib/utils/cn";
import type { Media } from "@/types";

// The zoom viewer loads the first time an image is opened.
const Lightbox = dynamic(() => import("./Lightbox").then((m) => m.Lightbox));

export function ProductGallery({ images, title }: { images: Media[]; title: string }) {
  const [index, setIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [emblaRef, embla] = useEmblaCarousel({ loop: false });

  useEffect(() => {
    if (!embla) return;
    const onSelect = () => setIndex(embla.selectedScrollSnap());
    embla.on("select", onSelect);
    return () => {
      embla.off("select", onSelect);
    };
  }, [embla]);

  const select = useCallback(
    (i: number) => {
      setIndex(i);
      embla?.scrollTo(i);
    },
    [embla],
  );

  return (
    <div className="lg:flex lg:gap-4" aria-label={`${title} images`} role="region">
      {/* Thumbnails (desktop) */}
      <ul className="hidden w-20 shrink-0 flex-col gap-3 lg:flex" aria-label="Choose image">
        {images.map((img, i) => (
          <li key={img.src}>
            <button
              type="button"
              onClick={() => select(i)}
              aria-label={`Show image ${i + 1}`}
              aria-current={i === index ? "true" : undefined}
              className={cn(
                "block aspect-[3/4] w-full overflow-hidden border",
                i === index ? "border-text" : "border-transparent opacity-70 hover:opacity-100",
              )}
            >
              <Img media={img} alt="" className="size-full object-cover" />
            </button>
          </li>
        ))}
      </ul>

      {/* Main image: swipeable on mobile, click to open the zoom viewer */}
      <div className="relative min-w-0 flex-1">
        <div className="overflow-hidden bg-line" ref={emblaRef}>
          <div className="flex touch-pan-y">
            {images.map((img, i) => (
              <div key={img.src} className="min-w-0 shrink-0 grow-0 basis-full">
                <button
                  type="button"
                  className="block aspect-[3/4] w-full cursor-zoom-in"
                  onClick={() => {
                    setIndex(i);
                    setLightbox(true);
                  }}
                  aria-label={`Open image ${i + 1} full screen`}
                  tabIndex={i === index ? 0 : -1}
                >
                  <Img media={img} priority={i === 0} className="size-full object-cover" />
                </button>
              </div>
            ))}
          </div>
        </div>
        <span className="pointer-events-none absolute right-3 bottom-3 inline-flex size-9 items-center justify-center rounded-full bg-bg/90">
          <ZoomIn className="size-4" aria-hidden />
        </span>
        {images.length > 1 && (
          <div className="mt-3 flex justify-center gap-2 lg:hidden">
            {images.map((img, i) => (
              <button
                key={img.src}
                type="button"
                onClick={() => select(i)}
                aria-label={`Show image ${i + 1}`}
                aria-current={i === index ? "true" : undefined}
                className="inline-flex size-6 items-center justify-center"
              >
                <span
                  className={cn("block size-1.5 rounded-full", i === index ? "bg-text" : "bg-line")}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {lightbox && (
        <Lightbox
          images={images}
          index={index}
          onIndex={select}
          onClose={() => setLightbox(false)}
        />
      )}
    </div>
  );
}
