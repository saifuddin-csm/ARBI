import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";

import { SocialLinks } from "@/components/ui/Icons";
import { Logo } from "@/components/ui/Logo";
import type { NavLink, Navigation, SiteSettings } from "@/types";

import { Newsletter } from "./Newsletter";
import { TrustStrip } from "./TrustStrip";

function LinkColumn({ title, links }: { title: string; links: NavLink[] }) {
  return (
    <div>
      <h2 className="mb-4 label-caps text-xs">{title}</h2>
      <ul className="space-y-3">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-sm text-text/75 hover:text-text hover:underline">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SiteFooter({ navigation, site }: { navigation: Navigation; site: SiteSettings }) {
  const tel = (n: string) => n.replace(/[^\d+]/g, "");
  return (
    <footer className="mt-auto border-t border-line bg-bg">
      <div className="container-page border-b border-line py-12 lg:py-16">
        <TrustStrip badges={site.trustBadges} />
      </div>

      <div className="container-page grid gap-12 py-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1.3fr] lg:gap-8 lg:py-16">
        <div className="space-y-6">
          <Link href="/" aria-label="ARBI home" className="inline-block">
            <Logo className="h-12 w-auto" />
          </Link>
          <Newsletter />
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:contents">
          <LinkColumn title="Quick links" links={navigation.footer.quickLinks} />
          <LinkColumn title="Policies" links={navigation.footer.policies} />
          <LinkColumn title="Shop by collection" links={navigation.footer.collections} />
        </div>
        <div>
          <h2 className="mb-4 label-caps text-xs">Customer support</h2>
          <ul className="space-y-3 text-sm text-text/75">
            <li className="flex gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden />
              <span>{site.support.address}</span>
            </li>
            <li>
              <a
                href={`mailto:${site.support.email}`}
                className="flex gap-2 hover:text-text hover:underline"
              >
                <Mail className="mt-0.5 size-4 shrink-0" aria-hidden />
                {site.support.email}
              </a>
            </li>
            <li>
              <a
                href={`tel:${tel(site.support.phone)}`}
                className="flex gap-2 hover:text-text hover:underline"
              >
                <Phone className="mt-0.5 size-4 shrink-0" aria-hidden />
                {site.support.phone}
              </a>
            </li>
            <li>
              <a
                href={`https://wa.me/${tel(site.support.whatsapp).replace("+", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-2 hover:text-text hover:underline"
              >
                <MessageCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
                WhatsApp {site.support.whatsapp}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
            <li className="text-xs text-muted">{site.support.hours}</li>
          </ul>
          <SocialLinks socials={site.socials} className="mt-6 -ml-2 flex gap-1" />
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-page flex flex-col gap-4 py-6 text-xs text-muted lg:flex-row lg:items-center lg:justify-between">
          <p>© {new Date().getFullYear()} ARBI. All rights reserved.</p>
          <ul className="flex flex-wrap gap-2" aria-label="Accepted payment methods">
            {site.paymentMethods.map((m) => (
              <li key={m} className="border border-line px-2 py-1 text-[11px] text-text/80">
                {m}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
