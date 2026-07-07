import productsData from "@/data/products.json";

// 카탈로그의 각 상품은 자체 `image`를 가짐 (사진의 주얼리 종류에 맞춰 할당됨 — src/data/products.json
// 참고). 이 함수는 id → 이미지를 매칭해주며, 카탈로그에 없는 항목(예: Essential 반지)에 대해서는
// 결정적(deterministic) 해시 폴백을 사용함.
const byId: Record<string, string> = {
  essential: "/images/Jewelries/IRIS_Thumbnail.webp",
};
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
