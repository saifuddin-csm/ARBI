import { assetPath } from "@/lib/utils";

// Intrinsic size of public/brand/arbi-logo.webp; keeps aspect ratio and avoids layout shift.
const LOGO_WIDTH = 816;
const LOGO_HEIGHT = 497;

type LogoProps = {
  className?: string;
  priority?: boolean;
};

export function Logo({ className, priority = false }: LogoProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- static export; image optimisation is off
    <img
      src={assetPath("/brand/arbi-logo.webp")}
      alt="ARBI"
      width={LOGO_WIDTH}
      height={LOGO_HEIGHT}
      className={className}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
    />
  );
}
