import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";

const products = Array.from({ length: 12 }, (_, i) => ({
  name: `Ring ${String(i + 1).padStart(2, "0")}`,
  description: "Lorem ipsum dolor sit amet",
  price: "₩ 10,000,000",
}));

export default function BestPiecesPage() {
  return (
    <main id="main-content" className="min-h-screen bg-surface-base">
      <Navbar />

      <div className="px-8 pt-12 pb-24">
        <header>
          <h1
            className="mb-3 text-3xl tracking-heading text-content-primary"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            BEST PIECES
          </h1>
          <p className="mb-16 text-xs leading-relaxed text-content-faint">
            현대적인 조형성과 정교한 소재가 만나는 곳,
            <br />
            PRISME의 컬렉션을 만나보세요.
          </p>
        </header>

        <ul className="grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p, i) => (
            <li key={i}>
              <ProductCard
                name={p.name}
                description={p.description}
                price={p.price}
              />
            </li>
          ))}
        </ul>
      </div>

      <Footer />
    </main>
  );
}
