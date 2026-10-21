"use client";

import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { type MouseEvent, useCallback, useEffect, useState } from "react";

import { Img } from "@/components/ui/Img";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/utils/cn";
import type { Media } from "@/types";

/** Zoomable full-screen viewer: click or Enter toggles 2× zoom around the pointer. */
function Lightbox({
  images,
  index,
  onIndex,
  onClose,
}: {
  images: Media[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");
  const go = (d: number) => {
    setZoom(false);
    onIndex((index + d + images.length) % images.length);
  };

  function onMove(e: MouseEvent<HTMLButtonElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    setOrigin(
      `${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`,
    );
  }

  return (
    <Modal open onClose={onClose} title={`Image ${index + 1} of ${images.length}`} size="full">
      <div
        className="relative flex h-full items-center justify-center bg-bg p-4"
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") go(1);
          if (e.key === "ArrowLeft") go(-1);
        }}
      >
        <button
          type="button"
          onClick={() => setZoom((z) => !z)}
          onMouseMove={onMove}
          className={cn(
            "h-full max-h-[80vh] overflow-hidden",
            zoom ? "cursor-zoom-out" : "cursor-zoom-in",
          )}
          aria-label={zoom ? "Zoom out" : "Zoom in"}
          aria-pressed={zoom}
        >
          <Img
            media={images[index]}
            priority
            className="h-full w-auto object-contain transition-transform duration-200"
            style={zoom ? { transform: "scale(2)", transformOrigin: origin } : undefined}
          />
        </button>
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              className="absolute top-1/2 left-2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-bg/90 shadow"
              aria-label="Previous image"
            >
              <ChevronLeft className="size-5" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="absolute top-1/2 right-2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-bg/90 shadow"
              aria-label="Next image"
            >
              <ChevronRight className="size-5" aria-hidden />
            </button>
          </>
        )}
      </div>
    </Modal>
  );
}

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
