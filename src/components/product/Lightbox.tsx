"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { type MouseEvent, useState } from "react";

import { Img } from "@/components/ui/Img";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/utils/cn";
import type { Media } from "@/types";

type LightboxProps = {
  images: Media[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
};

/** Zoomable full-screen viewer: click or Enter toggles 2× zoom around the pointer. */
export function Lightbox({ images, index, onIndex, onClose }: LightboxProps) {
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
