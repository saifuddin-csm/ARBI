import type { CSSProperties } from "react";

import { assetPath } from "@/lib/utils/assetPath";
import type { Media } from "@/types";

type ImgProps = {
  media: Media;
  className?: string;
  /** Above-the-fold images load eagerly with high priority. */
  priority?: boolean;
  sizes?: string;
  alt?: string;
  style?: CSSProperties;
};

/**
 * Renders a resolved Media item (uploaded photo or generated placeholder). Static export
 * has no image optimiser, so this is a plain <img> with basePath, size and lazy loading.
 */
export function Img({ media, className, priority, sizes, alt, style }: ImgProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- static export; images are pre-optimised
    <img
      src={assetPath(media.src)}
      alt={alt ?? media.alt}
      width={media.width}
      height={media.height}
      sizes={sizes}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
      className={className}
      style={style}
    />
  );
}
