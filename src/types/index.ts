// Shared data model. Mirrors docs/BUILD_PLAN.md "Data model"; the same shapes back the
// mock JSON in Phase 1 and the backend in Phase 2.

export type Gender = "men" | "women" | "unisex";
export type ProductBadge = "new" | "sale" | "bestseller";

/** An image as authored in content JSON: a real path under /images plus alt text. */
export type MediaInput = {
  src: string;
  alt: string;
  /** Placeholder label; defaults to alt. */
  label?: string;
  /** Placeholder background colour; defaults to a neutral grey. */
  tone?: string;
  width?: number;
  height?: number;
};

/** An image after resolution: src is either the uploaded file or its generated placeholder. */
export type Media = {
  src: string;
  alt: string;
  width: number;
  height: number;
  placeholder: boolean;
};

export type ProductColor = { name: string; hex: string };

export type Variant = { sku: string; size: string; stock: number };

export type Product = {
  id: string;
  slug: string;
  title: string;
  styleGroup: string;
  color: ProductColor;
  gender: Gender;
  category: string;
  style?: string;
  fabric: string;
  fit?: string;
  tags: string[];
  /** Whole taka, VAT-inclusive. */
  price: number;
  compareAtPrice?: number;
  images: Media[];
  shortDescription: string;
  description: string;
  details: { label: string; value: string }[];
  care: string[];
  sizeChartId?: string;
  variants: Variant[];
  collections: string[];
  badges?: ProductBadge[];
  rating?: number;
  reviewCount?: number;
  createdAt: string;
  bestSellerRank?: number;
};

/** A colour sibling of a product (same styleGroup), used for swatches and colour dots. */
export type ColorLink = { slug: string; color: ProductColor; current: boolean };

/** The trimmed product shape used by cards, grids, search and carousels. */
export type ProductSummary = {
  id: string;
  slug: string;
  title: string;
  styleGroup: string;
  color: ProductColor;
  gender: Gender;
  category: string;
  fabric: string;
  price: number;
  compareAtPrice?: number;
  images: Media[];
  colors: ColorLink[];
  variants: Variant[];
  badges: ProductBadge[];
  rating?: number;
  reviewCount?: number;
  createdAt: string;
  bestSellerRank?: number;
  inStock: boolean;
};

export type CollectionFilter =
  | { gender?: Gender; category?: string[]; tag?: string; badge?: ProductBadge }
  | { productSlugs: string[] };

export type Collection = {
  slug: string;
  title: string;
  description?: string;
  tagline?: string;
  banner?: { mobile: Media; desktop: Media };
  card?: Media;
  filter: CollectionFilter;
};

export type SizeChart = {
  id: string;
  name: string;
  unit: "cm";
  columns: string[];
  rows: { size: string; values: number[] }[];
  howToMeasure: { title: string; text: string }[];
  faqs: { question: string; answer: string }[];
  image?: Media;
};

export type CartItem = {
  sku: string;
  productId: string;
  size: string;
  qty: number;
  /** Display snapshot so the cart renders without refetching (Phase 2 re-validates server-side). */
  slug: string;
  title: string;
  colorName: string;
  price: number;
  image: Media;
  maxQty: number;
};

export type NavLink = { label: string; href: string };
export type NavGroup = { title: string; links: NavLink[] };
export type NavItem = {
  label: string;
  href: string;
  groups?: NavGroup[];
  feature?: { title: string; href: string; image: Media };
};

export type Navigation = {
  main: NavItem[];
  secondary: NavLink[];
  footer: { quickLinks: NavLink[]; policies: NavLink[]; collections: NavLink[] };
};

export type SocialLink = { network: "instagram" | "facebook" | "youtube" | "tiktok"; href: string };

export type TrustBadge = {
  icon: "truck" | "returns" | "secure" | "support" | "cod" | "clock";
  title: string;
  text: string;
};

export type SiteSettings = {
  name: string;
  announcement: { id: string; messages: string[] } | null;
  brandStatement: string;
  freeShippingThreshold: number;
  shippingRates: { insideDhaka: number; outsideDhaka: number };
  deliveryEstimate: string;
  support: { address: string; email: string; phone: string; whatsapp: string; hours: string };
  socials: SocialLink[];
  paymentMethods: string[];
  trustBadges: TrustBadge[];
  productTrustBadges: TrustBadge[];
};

export type HeroData = {
  heading: string;
  subheading?: string;
  cta: NavLink;
  image: Media;
  mobileImage: Media;
  video?: { mp4?: string; webm?: string };
};

// The home page is an overview of the brand and its categories: no product names, prices,
// ratings or colours (those live on collection and product pages).
export type HomeSection =
  | { type: "hero"; data: HeroData }
  | {
      type: "categoryTiles";
      data: { eyebrow?: string; heading: string; collections: Collection[] };
    }
  | {
      type: "banner";
      data: {
        eyebrow?: string;
        heading: string;
        text?: string;
        cta: NavLink;
        mobile: Media;
        desktop: Media;
      };
    }
  | {
      type: "editorial";
      data: { eyebrow?: string; heading: string; text: string; image: Media; cta?: NavLink };
    }
  | {
      type: "collectionCards";
      data: { eyebrow?: string; heading: string; collections: Collection[] };
    }
  | {
      type: "lookbook";
      data: { eyebrow?: string; heading: string; text?: string; images: Media[]; cta?: NavLink };
    }
  | { type: "brandStatement"; data: { text: string } }
  | { type: "trustStrip"; data: { badges: TrustBadge[] } };

export type HomeSectionType = HomeSection["type"];

export type ContentPage = {
  slug: string;
  title: string;
  intro?: string;
  draft?: boolean;
  updated?: string;
  sections: { heading?: string; paragraphs: string[]; list?: string[] }[];
};

export type FaqGroup = { title: string; items: { question: string; answer: string }[] };

export type Store = {
  id: string;
  name: string;
  address: string;
  city: string;
  phone?: string;
  email?: string;
  hours?: string;
  lat: number;
  lng: number;
};

export type OrderStatus = "placed" | "confirmed" | "packed" | "shipped" | "delivered" | "cancelled";

export type Order = {
  number: string;
  email: string;
  phone: string;
  placedAt: string;
  status: OrderStatus;
  history: { status: OrderStatus; at: string; note?: string }[];
  items: {
    title: string;
    size: string;
    colorName: string;
    qty: number;
    price: number;
    slug: string;
  }[];
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: string;
  address: string;
};

export type Review = {
  id: string;
  author: string;
  rating: number;
  title: string;
  body: string;
  date: string;
};

export type SearchEntry = {
  slug: string;
  title: string;
  colorName: string;
  category: string;
  gender: Gender;
  price: number;
  compareAtPrice?: number;
  image: Media;
  keywords: string;
};
