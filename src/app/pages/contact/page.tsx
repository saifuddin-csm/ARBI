import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import type { Metadata } from "next";

import { ContactForm } from "@/components/content/ContactForm";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SocialLinks } from "@/components/ui/Icons";
import { getSite } from "@/lib/api";

export const metadata: Metadata = { title: "Contact us" };

export default async function ContactPage() {
  const { support, socials } = await getSite();
  const tel = (n: string) => n.replace(/[^\d+]/g, "");
  return (
    <div className="container-page py-10 lg:py-16">
      <Breadcrumb
        className="mb-8"
        items={[
          { label: "Home", href: "/" },
          { label: "Contact", href: "/pages/contact/" },
        ]}
      />
      <div className="grid gap-12 lg:grid-cols-[1fr_22rem] lg:gap-20">
        <div>
          <h1 className="text-3xl font-light sm:text-4xl">Contact us</h1>
          <p className="mt-3 mb-8 max-w-lg text-sm text-muted">
            Questions about sizing, an order or a return? Send us a message and we&apos;ll get back
            to you within one working day.
          </p>
          <ContactForm />
        </div>
        <aside className="h-fit space-y-6 bg-line/40 p-6 text-sm" aria-label="Contact details">
          <h2 className="label-caps text-sm">Customer support</h2>
          <ul className="space-y-4">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden />
              {support.address}
            </li>
            <li>
              <a href={`mailto:${support.email}`} className="flex gap-3 hover:underline">
                <Mail className="mt-0.5 size-4 shrink-0" aria-hidden />
                {support.email}
              </a>
            </li>
            <li>
              <a href={`tel:${tel(support.phone)}`} className="flex gap-3 hover:underline">
                <Phone className="mt-0.5 size-4 shrink-0" aria-hidden />
                {support.phone}
              </a>
            </li>
            <li>
              <a
                href={`https://wa.me/${tel(support.whatsapp).replace("+", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-3 hover:underline"
              >
                <MessageCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
                WhatsApp {support.whatsapp}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
            <li className="flex gap-3">
              <Clock className="mt-0.5 size-4 shrink-0" aria-hidden />
              {support.hours}
            </li>
          </ul>
          <SocialLinks socials={socials} className="-ml-2 flex gap-1" />
        </aside>
      </div>
    </div>
  );
}
