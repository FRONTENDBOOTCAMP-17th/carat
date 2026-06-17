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
    <main id="main-content" className="min-h-screen bg-surface-darkest flex flex-col">
      <Navbar />

      <section className="flex-1 w-full" aria-labelledby="best-pieces-heading">
        <div className="max-w-container mx-auto px-4 pt-12 pb-24 sm:px-6 lg:px-8">
          <header>
            <h1
              id="best-pieces-heading"
              className="mb-3 text-3xl tracking-heading text-content-primary"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              BEST PIECES
            </h1>
            <p className="mb-16 text-xs leading-relaxed text-content-faint">
              가장 많은 사랑을 받은 PRISME의 시그니처 피스를 만나보세요.
            </p>
          </header>

          <ul className="grid grid-cols-2 gap-x-4 gap-y-12 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
            {products.map((p, i) => (
              <li key={i}>
                <ProductCard
                  id={`best-pieces-${i}`}
                  name={p.name}
                  description={p.description}
                  price={p.price}
                />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Footer />
    </main>
  );
}
