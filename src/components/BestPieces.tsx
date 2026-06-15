import Link from "next/link";
import ProductCard from "./ProductCard";

const products = [
  { name: "Ring 01", category: "RING", price: "₩10,000,000" },
  { name: "Ring 01", category: "RING", price: "₩10,000,000" },
  { name: "Ring 01", category: "RING", price: "₩10,000,000" },
  { name: "Ring 01", category: "RING", price: "₩10,000,000" },
  { name: "Ring 01", category: "RING", price: "₩10,000,000" },
];

export default function BestPieces() {
  return (
    <section
      className="max-w-[1440px] mx-auto bg-zinc-950 py-20"
      aria-labelledby="best-pieces-heading"
    >
      <p className="mb-3 text-[10px] tracking-[0.4em] text-zinc-500">
        현대적인 조형성과 정교한 소재가 만나는 곳,
      </p>
      <p className="mb-3 text-[10px] tracking-[0.4em] text-zinc-500">
        PRISME의 컬렉션을 만나보세요.
      </p>

      <h2
        id="best-pieces-heading"
        className="mb-14 text-4xl tracking-[0.25em] text-white"
        style={{ fontFamily: "var(--font-cinzel)" }}
      >
        BEST PIECES
      </h2>

      <ul
        className="mb-12 grid grid-cols-5 gap-8"
        aria-label="베스트 상품 목록"
      >
        {products.map((p, i) => (
          <li key={i}>
            <ProductCard name={p.name} category={p.category} price={p.price} />
          </li>
        ))}
      </ul>

      <Link
        href="/best-pieces"
        className="text-xs tracking-[0.3em] text-white/60 hover:text-white transition-colors"
      >
        더 알아보기 &gt;
      </Link>
    </section>
  );
}
