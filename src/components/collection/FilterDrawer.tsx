"use client";

import { Check } from "lucide-react";
import { useId, useState } from "react";

import { AccordionItem } from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { Swatch } from "@/components/ui/Swatch";
import {
  EMPTY_FILTERS,
  type FilterOptions,
  type Filters,
  categoryLabel,
  filterProducts,
} from "@/lib/utils/catalog";
import { cn } from "@/lib/utils/cn";
import type { ProductSummary } from "@/types";

type FilterDrawerProps = {
  open: boolean;
  onClose: () => void;
  products: ProductSummary[];
  options: FilterOptions;
  value: Filters;
  onApply: (filters: Filters) => void;
};

const toggle = <T,>(list: T[], item: T) =>
  list.includes(item) ? list.filter((x) => x !== item) : [...list, item];

function CheckList<T extends string>({
  legend,
  items,
  selected,
  onToggle,
  label = (x) => x,
}: {
  legend: string;
  items: T[];
  selected: T[];
  onToggle: (item: T) => void;
  label?: (item: T) => string;
}) {
  return (
    <fieldset>
      <legend className="sr-only">{legend}</legend>
      <ul className="space-y-1">
        {items.map((item) => {
          const checked = selected.includes(item);
          return (
            <li key={item}>
              <label className="flex min-h-10 cursor-pointer items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggle(item)}
                  className="peer sr-only"
                />
                <span
                  aria-hidden
                  className={cn(
                    "flex size-5 items-center justify-center border peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-text",
                    checked ? "border-text bg-text text-bg" : "border-muted",
                  )}
                >
                  {checked && <Check className="size-3.5" />}
                </span>
                {label(item)}
              </label>
            </li>
          );
        })}
      </ul>
    </fieldset>
  );
}

/** Filter drawer: edits a draft, shows the live result count, and applies on "View N products". */
export function FilterDrawer({
  open,
  onClose,
  products,
  options,
  value,
  onApply,
}: FilterDrawerProps) {
  const [draft, setDraft] = useState<Filters>(value);
  const id = useId();

  // Start each opening from the applied filters.
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setDraft(value);
  }

  const count = filterProducts(products, draft).length;
  const set = (patch: Partial<Filters>) => setDraft((d) => ({ ...d, ...patch }));
  const priceInput =
    "h-11 w-full border border-line bg-bg px-3 text-sm outline-none focus:border-text";

  return (
    <Drawer
      open={open}
      onClose={onClose}
      side="left"
      title="Filter"
      footer={
        <div className="grid grid-cols-2 gap-3">
          <Button variant="secondary" onClick={() => setDraft(EMPTY_FILTERS)}>
            Clear all
          </Button>
          <Button
            onClick={() => {
              onApply(draft);
              onClose();
            }}
          >
            View {count}
          </Button>
        </div>
      }
    >
      <div className="px-5">
        <AccordionItem title="Availability" defaultOpen>
          <fieldset>
            <legend className="sr-only">Availability</legend>
            {(
              [
                [undefined, "All"],
                ["in", "In stock"],
                ["out", "Out of stock"],
              ] as const
            ).map(([v, label]) => (
              <label
                key={label}
                className="flex min-h-10 cursor-pointer items-center gap-3 text-sm"
              >
                <input
                  type="radio"
                  name={`${id}-availability`}
                  checked={draft.availability === v}
                  onChange={() => set({ availability: v })}
                  className="size-4 accent-text"
                />
                {label}
              </label>
            ))}
          </fieldset>
        </AccordionItem>

        <AccordionItem title="Price" defaultOpen>
          <fieldset>
            <legend className="mb-3 text-xs text-muted">
              Range ৳{options.priceRange.min.toLocaleString("en-US")} – ৳
              {options.priceRange.max.toLocaleString("en-US")}
            </legend>
            <div className="flex items-center gap-3">
              <label className="flex-1">
                <span className="mb-1 block text-xs">From (৳)</span>
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  placeholder={String(options.priceRange.min)}
                  value={draft.minPrice ?? ""}
                  onChange={(e) =>
                    set({ minPrice: e.target.value === "" ? undefined : Number(e.target.value) })
                  }
                  className={priceInput}
                />
              </label>
              <label className="flex-1">
                <span className="mb-1 block text-xs">To (৳)</span>
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  placeholder={String(options.priceRange.max)}
                  value={draft.maxPrice ?? ""}
                  onChange={(e) =>
                    set({ maxPrice: e.target.value === "" ? undefined : Number(e.target.value) })
                  }
                  className={priceInput}
                />
              </label>
            </div>
          </fieldset>
        </AccordionItem>

        {options.sizes.length > 1 && (
          <AccordionItem title="Size" defaultOpen>
            <fieldset>
              <legend className="sr-only">Size</legend>
              <ul className="flex flex-wrap gap-2">
                {options.sizes.map((s) => {
                  const checked = draft.sizes.includes(s);
                  return (
                    <li key={s}>
                      <label
                        className={cn(
                          "flex h-10 min-w-12 cursor-pointer items-center justify-center border px-3 text-sm has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-text",
                          checked ? "border-text bg-text text-bg" : "border-line hover:border-text",
                        )}
                      >
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={checked}
                          onChange={() => set({ sizes: toggle(draft.sizes, s) })}
                        />
                        {s}
                      </label>
                    </li>
                  );
                })}
              </ul>
            </fieldset>
          </AccordionItem>
        )}

        {options.colors.length > 1 && (
          <AccordionItem title="Colour">
            <fieldset>
              <legend className="sr-only">Colour</legend>
              <ul className="grid grid-cols-2 gap-1">
                {options.colors.map((c) => {
                  const checked = draft.colors.includes(c.name);
                  return (
                    <li key={c.name}>
                      <label className="group/swatch flex min-h-10 cursor-pointer items-center gap-3 text-sm has-[:focus-visible]:underline">
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={checked}
                          onChange={() => set({ colors: toggle(draft.colors, c.name) })}
                        />
                        <Swatch hex={c.hex} selected={checked} />
                        {c.name}
                      </label>
                    </li>
                  );
                })}
              </ul>
            </fieldset>
          </AccordionItem>
        )}

        {options.categories.length > 1 && (
          <AccordionItem title="Category">
            <CheckList
              legend="Category"
              items={options.categories}
              selected={draft.categories}
              onToggle={(c) => set({ categories: toggle(draft.categories, c) })}
              label={categoryLabel}
            />
          </AccordionItem>
        )}

        {options.fabrics.length > 1 && (
          <AccordionItem title="Fabric">
            <CheckList
              legend="Fabric"
              items={options.fabrics}
              selected={draft.fabrics}
              onToggle={(f) => set({ fabrics: toggle(draft.fabrics, f) })}
            />
          </AccordionItem>
        )}

        {options.genders.length > 1 && (
          <AccordionItem title="Gender">
            <CheckList
              legend="Gender"
              items={options.genders}
              selected={draft.genders}
              onToggle={(g) => set({ genders: toggle(draft.genders, g) })}
              label={(g) => (g === "men" ? "Men" : g === "women" ? "Women" : "Unisex")}
            />
          </AccordionItem>
        )}
      </div>
    </Drawer>
  );
}
