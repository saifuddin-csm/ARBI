import { assetPath } from "@/lib/utils";

// Intrinsic sizes of the logo files; keep the aspect ratio and avoid layout shift.
const VARIANTS = {
  /** Black logo on white, for light backgrounds. */
  default: { src: "/brand/arbi-logo.webp", width: 816, height: 497 },
  /** White logo on transparent (red signature kept), for dark backgrounds like the footer. */
  white: { src: "/brand/arbi-logo-white.webp", width: 400, height: 244 },
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
