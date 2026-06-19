import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";
import { getProductsByCategory } from "@/lib/products";

const products = getProductsByCategory("fw-collections");

export default function FwCollectionsPage() {
  return (
    <main id="main-content" className="min-h-screen bg-surface-darkest flex flex-col">
      <Navbar />

      <section className="flex-1 w-full" aria-labelledby="fw-collections-heading">
        <div className="max-w-container mx-auto px-4 pt-12 pb-24 sm:px-6 lg:px-8">
          <header>
            <h1
              id="fw-collections-heading"
              className="mb-3 text-3xl tracking-heading text-content-primary"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              2026 F/W COLLECTIONS
            </h1>
            <p className="mb-16 text-xs leading-relaxed text-content-faint">
              2026 가을·겨울 시즌의 새로운 컬렉션,
              <br />
              PRISME가 제안하는 계절의 정수를 만나보세요.
            </p>
          </header>

          <ul className="grid grid-cols-2 gap-x-4 gap-y-12 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
            {products.map((p) => (
              <li key={p.id}>
                <ProductCard
                  id={p.id}
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
