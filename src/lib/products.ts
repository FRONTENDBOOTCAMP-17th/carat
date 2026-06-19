import productsData from "@/data/products.json";
import type { WishlistItem } from "@/context/AuthContext";

export type RawProduct = {
  id: string;
  name: string;
  description: string;
  price: string;
};

export type Product = WishlistItem & {
  categoryLabel: string;
  backHref: string;
  material: string;
  dimensions: string;
};

const CATEGORY_META = {
  "best-pieces": { label: "BEST PIECES", href: "/best-pieces" },
  collections: { label: "COLLECTIONS", href: "/collections" },
  "fw-collections": { label: "FW COLLECTIONS", href: "/fw-collections" },
} as const;

type CategoryKey = keyof typeof CATEGORY_META;

export function getProductsByCategory(category: CategoryKey): RawProduct[] {
  return productsData[category] as RawProduct[];
}

export function getProductById(id: string): Product | null {
  for (const [category, products] of Object.entries(productsData)) {
    const raw = (products as RawProduct[]).find((p) => p.id === id);
    if (!raw) continue;
    const meta = CATEGORY_META[category as CategoryKey];
    return {
      ...raw,
      category,
      categoryLabel: meta.label,
      backHref: meta.href,
      material: "18K 옐로우 골드 / 다이아몬드",
      dimensions: "내경 16.5mm",
    };
  }
  return null;
}
