import { cn } from "@/lib/utils/cn";

const SIZES = { sm: "size-[18px] p-[2px]", md: "size-7 p-[3px]", lg: "size-10 p-[3px]" };

type SwatchProps = {
  hex: string;
  selected?: boolean;
  size?: keyof typeof SIZES;
  className?: string;
};

/**
 * Square colour swatch: a soft frame around the colour with a hairline inset so light
 * colours stay visible. Put it inside an element with the `group/swatch` class for hover states.
 */
export function Swatch({ hex, selected, size = "md", className }: SwatchProps) {
  return (
    <span
      aria-hidden
      className={cn(
        "block shrink-0 rounded-[3px] border transition-[border-color,translate,box-shadow] duration-300 ease-out",
        SIZES[size],
        selected
          ? "border-text shadow-[0_2px_8px_-2px_rgba(0,0,0,0.25)]"
          : "border-line group-hover/swatch:-translate-y-0.5 group-hover/swatch:border-muted",
        className,
      )}
    >
      <span
        className="block size-full rounded-[2px] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)]"
        style={{ backgroundColor: hex }}
      />
    </span>
  );
}
