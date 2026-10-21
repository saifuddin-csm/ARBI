import {
  Banknote,
  Clock,
  Headset,
  type LucideProps,
  RotateCcw,
  ShieldCheck,
  Truck,
} from "lucide-react";

import type { ReactNode } from "react";

import type { SocialLink, TrustBadge } from "@/types";

const TRUST_ICONS = {
  truck: Truck,
  returns: RotateCcw,
  secure: ShieldCheck,
  support: Headset,
  cod: Banknote,
  clock: Clock,
} satisfies Record<TrustBadge["icon"], unknown>;

export function TrustIcon({ icon, ...props }: { icon: TrustBadge["icon"] } & LucideProps) {
  const Icon = TRUST_ICONS[icon];
  return <Icon strokeWidth={1.25} aria-hidden {...props} />;
}

// Simple line-drawn social glyphs (Lucide no longer ships brand icons).
const SOCIAL_PATHS: Record<SocialLink["network"], ReactNode> = {
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
    </>
  ),
  facebook: <path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8.5a.5.5 0 0 1 .5-.5Z" />,
  youtube: (
    <>
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
      <path d="m10 9 5 3-5 3Z" fill="currentColor" />
    </>
  ),
  tiktok: <path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5M14 3c.5 2.5 2.5 4.5 5 4.5" />,
};

export const SOCIAL_LABELS: Record<SocialLink["network"], string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  youtube: "YouTube",
  tiktok: "TikTok",
};

export function SocialIcon({
  network,
  className,
}: {
  network: SocialLink["network"];
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {SOCIAL_PATHS[network]}
    </svg>
  );
}

export function SocialLinks({ socials, className }: { socials: SocialLink[]; className?: string }) {
  return (
    <ul className={className ?? "flex gap-2"}>
      {socials.map((s) => (
        <li key={s.network}>
          <a
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex size-10 items-center justify-center hover:opacity-70"
            aria-label={`ARBI on ${SOCIAL_LABELS[s.network]} (opens in a new tab)`}
          >
            <SocialIcon network={s.network} className="size-5" />
          </a>
        </li>
      ))}
    </ul>
  );
}
