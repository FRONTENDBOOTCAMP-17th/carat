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
    <section className="w-full bg-surface-darkest" aria-labelledby="best-pieces-heading">
      <div className="max-w-container mx-auto px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
      <p className="mb-3 text-2xs tracking-descriptor text-content-dimmed">
        현대적인 조형성과 정교한 소재가 만나는 곳,
      </p>
      <p className="mb-3 text-2xs tracking-descriptor text-content-dimmed">
        PRISME의 컬렉션을 만나보세요.
      </p>

      <h2
        id="best-pieces-heading"
        className="mb-8 text-3xl tracking-heading text-content-primary lg:mb-14 lg:text-4xl"
        style={{ fontFamily: "var(--font-cinzel)" }}
      >
        BEST PIECES
      </h2>

      <ul
        className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:mb-12 lg:grid-cols-5 lg:gap-6"
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
        className="text-xs tracking-link text-content-muted hover:text-content-primary transition-colors"
      >
        더 알아보기 &gt;
      </Link>
      </div>
    </section>
  );
}
