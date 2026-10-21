import { assetPath } from "@/lib/utils/assetPath";
import type { Media } from "@/types";

type ResponsiveImgProps = {
  mobile: Media;
  desktop: Media;
  /** Viewport width (px) at which the desktop art is used. */
  breakpoint?: number;
  className?: string;
  priority?: boolean;
};

/** Art-directed image: separate mobile and desktop crops (e.g. 2:3 vs 21:9 banners). */
export function ResponsiveImg({
  mobile,
  desktop,
  breakpoint = 768,
  className,
  priority,
}: ResponsiveImgProps) {
  return (
    <picture>
      <source
        media={`(min-width: ${breakpoint}px)`}
        srcSet={assetPath(desktop.src)}
        width={desktop.width}
        height={desktop.height}
      />
      <img
        src={assetPath(mobile.src)}
        alt={mobile.alt}
        width={mobile.width}
        height={mobile.height}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        decoding="async"
        className={className}
      />
    </picture>
  );
}
