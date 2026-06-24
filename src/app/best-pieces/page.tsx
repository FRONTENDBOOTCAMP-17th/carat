"use client";

import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";
import BackButton from "@/components/BackButton";
import { getProductsByCategory } from "@/lib/products";
import { useLang } from "@/context/LanguageContext";

export default function BestPiecesPage() {
  const { lang, t } = useLang();
  const products = getProductsByCategory("best-pieces", lang);
  const p = t.pages.bestPieces;

  return (
    <main id="main-content" className="min-h-screen bg-surface-darkest flex flex-col">
      <Navbar />

      <section className="flex-1 w-full" aria-labelledby="best-pieces-heading">
        <div className="max-w-container mx-auto px-4 pt-16 pb-24 sm:px-6 lg:px-8">
          <nav aria-label={p.backNav} className="mb-10">
            <BackButton href="/" label="PRISME" />
          </nav>

          <header className="mb-16">
            <p className="mb-6 text-xs tracking-label text-content-faint">{p.section}</p>
            <div className="flex items-end justify-between mb-8">
              <h1
                id="best-pieces-heading"
                className="text-5xl sm:text-6xl lg:text-7xl font-light leading-none text-content-primary"
                style={{ fontFamily: "var(--font-cinzel)" }}
              >
                {p.title}
              </h1>
              <span className="text-xs tracking-label text-content-faint pb-2 shrink-0 ml-6">
                {products.length} PIECES
              </span>
            </div>
            <div className="border-t border-surface-elevated pt-6">
              <p className="text-xs leading-relaxed text-content-secondary max-w-md">
                {p.desc}
              </p>
            </div>
          </header>

          <ul className="grid grid-cols-2 gap-x-4 gap-y-12 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
            {products.map((item) => (
              <li key={item.id}>
                <ProductCard
                  id={item.id}
                  name={item.name}

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
