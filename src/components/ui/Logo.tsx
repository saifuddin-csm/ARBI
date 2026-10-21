import { assetPath } from "@/lib/utils";

// Intrinsic sizes of the logo files; keep the aspect ratio and avoid layout shift.
const VARIANTS = {
  /** Compact lockup (wordmark with the signature to its right) for the header. */
  default: { src: "/brand/arbi-logo.webp", width: 900, height: 219 },
  /** Full lockup with the "Clothes for you" tagline, for light backgrounds. */
  full: { src: "/brand/arbi-logo-full.webp", width: 720, height: 538 },
  /** Full lockup in white ink (red kept), for dark backgrounds like the footer. */
  white: { src: "/brand/arbi-logo-white.webp", width: 720, height: 538 },
};

type LogoProps = {
  className?: string;
  priority?: boolean;
  variant?: keyof typeof VARIANTS;
};

export function Logo({ className, priority = false, variant = "default" }: LogoProps) {
  const v = VARIANTS[variant];
  return (
    // eslint-disable-next-line @next/next/no-img-element -- static export; image optimisation is off
    <img
      src={assetPath(v.src)}
      alt="ARBI"
      width={v.width}
      height={v.height}
      className={className}
      fetchPriority={priority ? "high" : undefined}
      loading={priority ? undefined : "lazy"}
      decoding="async"
    />
  );
}
