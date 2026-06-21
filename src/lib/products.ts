import productsData from "@/data/products.json";
import type { WishlistItem } from "@/context/AuthContext";
import type { Lang } from "@/lib/translations";

export type RawProduct = {
  id: string;
  name: string;
  description: string;
  descriptionEn?: string;
  price: string;
};

export type Product = WishlistItem & {
  categoryLabel: string;
  backHref: string;
  material: string;
  dimensions: string;
};

const CATEGORY_META = {
  "best-pieces":    { label: "BEST PIECES",    href: "/best-pieces" },
  collections:      { label: "COLLECTIONS",    href: "/collections" },
  "fw-collections": { label: "FW COLLECTIONS", href: "/fw-collections" },
} as const;

type CategoryKey = keyof typeof CATEGORY_META;

export function getProductsByCategory(category: CategoryKey, lang: Lang = "ko"): RawProduct[] {
  const raw = productsData[category] as (RawProduct & { descriptionEn?: string })[];
  if (lang === "en") {
    return raw.map((p) => ({ ...p, description: p.descriptionEn ?? p.description }));
  }
  return raw;
}

export function getProductById(id: string, lang: Lang = "ko"): Product | null {
  for (const [category, products] of Object.entries(productsData)) {
    const raw = (products as (RawProduct & { descriptionEn?: string })[]).find((p) => p.id === id);
    if (!raw) continue;
    const meta = CATEGORY_META[category as CategoryKey];
    return {
      ...raw,
      description: lang === "en" ? (raw.descriptionEn ?? raw.description) : raw.description,
      category,
      categoryLabel: meta.label,
      backHref: meta.href,
      material: "18K 옐로우 골드 / 다이아몬드",
      dimensions: "내경 16.5mm",
    };
  }
  return null;
}
