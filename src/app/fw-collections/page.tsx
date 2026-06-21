"use client";

import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";
import { getProductsByCategory } from "@/lib/products";
import { useLang } from "@/context/LanguageContext";

export default function FwCollectionsPage() {
  const { lang, t } = useLang();
  const products = getProductsByCategory("fw-collections", lang);
  const p = t.pages.fwCollections;

  return (
    <main id="main-content" className="min-h-screen bg-surface-darkest flex flex-col">
      <Navbar />

      <section className="flex-1 w-full" aria-labelledby="fw-collections-heading">
        <div className="max-w-container mx-auto px-4 pt-12 pb-24 sm:px-6 lg:px-8">
          <header>
            <h1
              id="fw-collections-heading"
              className="mb-3 text-3xl tracking-label text-content-primary"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              {p.title}
            </h1>
            <p className="mb-16 text-xs leading-relaxed text-content-faint whitespace-pre-line">
              {p.desc}
            </p>
          </header>

          <ul className="grid grid-cols-2 gap-x-4 gap-y-12 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
            {products.map((item) => (
              <li key={item.id}>
                <ProductCard
                  id={item.id}
                  name={item.name}
                  description={item.description}
                  price={item.price}
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
