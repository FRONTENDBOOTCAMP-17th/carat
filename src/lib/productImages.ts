import productsData from "@/data/products.json";

// Each catalogue product carries its own `image` (assigned to match the photo's jewelry type — see
// src/data/products.json). This resolves an id → its image, with a deterministic hash fallback for
// anything not in the catalogue (e.g. the Essential ring).
const byId: Record<string, string> = {};
for (const items of Object.values(productsData)) {
  for (const p of items as { id: string; image?: string }[]) {
    if (p.image) byId[p.id] = p.image;
  }
}

const COUNT = 34;

export function productImage(id: string): string {
  const known = byId[id];
  if (known) return known;
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return `/images/Jewelries/jewelry-${String((h % COUNT) + 1).padStart(2, "0")}.webp`;
}
