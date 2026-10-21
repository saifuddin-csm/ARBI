import { Clock, MapPin, Phone } from "lucide-react";
import type { Metadata } from "next";

import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { getStores } from "@/lib/api";

export const metadata: Metadata = { title: "Store locator" };

/** OpenStreetMap embed centred on a store (no API key, loads only when scrolled into view). */
function mapSrc(lat: number, lng: number) {
  const d = 0.01;
  const bbox = [lng - d, lat - d, lng + d, lat + d].join(",");
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;
}

export default async function StoreLocatorPage() {
  const stores = await getStores();
  return (
    <div className="container-page py-10 lg:py-16">
      <Breadcrumb
        className="mb-8"
        items={[
          { label: "Home", href: "/" },
          { label: "Store locator", href: "/pages/store-locator/" },
        ]}
      />
      <h1 className="text-3xl font-light sm:text-4xl">Find a store</h1>
      <p className="mt-3 max-w-xl text-sm text-muted">
        Sample stores shown for the preview build — replace with ARBI&apos;s real locations, or hide
        this page if ARBI sells online only.
      </p>
      <ul className="mt-10 grid gap-10 lg:grid-cols-3">
        {stores.map((s) => (
          <li key={s.id} className="flex flex-col">
            <div className="aspect-[4/3] overflow-hidden bg-line">
              <iframe
                title={`Map showing ${s.name}`}
                src={mapSrc(s.lat, s.lng)}
                loading="lazy"
                className="size-full border-0"
                referrerPolicy="no-referrer"
              />
            </div>
            <h2 className="mt-4 text-lg font-light">{s.name}</h2>
            <ul className="mt-3 space-y-2 text-sm text-text/80">
              <li className="flex gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden />
                {s.address}, {s.city}
              </li>
              <li className="flex gap-2">
                <Clock className="mt-0.5 size-4 shrink-0" aria-hidden />
                {s.hours}
              </li>
              <li>
                <a
                  href={`tel:${s.phone.replace(/[^\d+]/g, "")}`}
                  className="flex gap-2 hover:underline"
                >
                  <Phone className="mt-0.5 size-4 shrink-0" aria-hidden />
                  {s.phone}
                </a>
              </li>
            </ul>
            <a
              href={`https://www.openstreetmap.org/?mlat=${s.lat}&mlon=${s.lng}#map=16/${s.lat}/${s.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 label-caps text-xs underline underline-offset-4"
            >
              Get directions<span className="sr-only"> to {s.name} (opens in a new tab)</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
