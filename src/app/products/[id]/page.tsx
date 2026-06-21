"use client";

import { notFound } from "next/navigation";
import { use } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WishlistButton from "@/components/WishlistButton";
import BackButton from "@/components/BackButton";
import { getProductById } from "@/lib/products";
import { useLang } from "@/context/LanguageContext";

export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { lang, t } = useLang();
  const product = getProductById(id, lang);

  if (!product) notFound();

  const p = t.pages.product;

  const wishlistItem = {
    id: product.id,
    name: product.name,
    price: product.price,
    category: product.category,
    description: product.description,
  };

  return (
    <main id="main-content" className="min-h-screen bg-surface-darkest flex flex-col">
      <Navbar />

      <div className="flex-1 w-full max-w-container mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24">
        <nav aria-label={p.backNav}>
          <BackButton href={product.backHref} label={product.categoryLabel} />
        </nav>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <div
            className="aspect-square bg-surface-input w-full"
            role="img"
            aria-label={t.productCard.imageAlt(product.name)}
          />

          <div className="flex flex-col">
            <p className="mb-3 text-2xs tracking-label text-content-faint">
              {product.categoryLabel}
            </p>
            <h1
              className="mb-6 text-4xl sm:text-5xl tracking-label text-content-primary font-light"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              {product.name}
            </h1>
            <p className="mb-8 text-xs leading-relaxed text-content-secondary">
              {product.description}
            </p>

            <dl className="mb-8 space-y-3">
              <div className="flex gap-8">
                <dt className="text-2xs tracking-label text-content-secondary shrink-0 w-16">
                  {p.material}
                </dt>
                <dd className="text-2xs text-content-secondary">{p.materialValue}</dd>
              </div>
              <div className="flex gap-8">
                <dt className="text-2xs tracking-label text-content-secondary shrink-0 w-16">
                  {p.dimensions}
                </dt>
                <dd className="text-2xs text-content-secondary">{p.dimensionsValue}</dd>
              </div>
            </dl>

            <p className="mb-8 text-xl text-content-primary">{product.price}</p>

            <WishlistButton item={wishlistItem} />
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
