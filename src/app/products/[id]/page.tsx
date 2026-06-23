"use client";

import { notFound } from "next/navigation";
import { use } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import WishlistButton from "@/components/WishlistButton";
import BackButton from "@/components/BackButton";
import RelatedScroll from "@/components/RelatedScroll";
import Breadcrumb from "@/components/Breadcrumb";
import { getProductById, getProductsByCategory } from "@/lib/products";
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

  type CategoryKey = "best-pieces" | "collections" | "fw-collections";
  const related = product.category
    ? getProductsByCategory(product.category as CategoryKey, lang).filter((r) => r.id !== product.id)
    : [];

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
        {/* 데스크탑: 전체 계층 breadcrumb */}
        <div className="hidden sm:block">
          <Breadcrumb
            items={[
              { label: "PRISME", href: "/" },
              { label: product.categoryLabel, href: product.backHref },
              { label: product.name },
            ]}
          />
        </div>
        {/* 모바일: back button만 — 터치 타겟 및 공간 이슈 */}
        <nav aria-label={p.backNav} className="sm:hidden">
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
              className="mb-8 text-3xl sm:text-4xl tracking-label text-content-primary font-light"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              {product.name}
            </h1>

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

            <div className="mb-8 pt-6 border-t border-surface-elevated flex gap-6">
              <Link
                href="/materials"
                className="text-2xs tracking-label text-content-secondary hover:text-content-primary transition-colors"
              >
                {p.materialsLink} →
              </Link>
              <Link
                href="/care-guide"
                className="text-2xs tracking-label text-content-secondary hover:text-content-primary transition-colors"
              >
                {p.careLink} →
              </Link>
            </div>

            <WishlistButton item={wishlistItem} />
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="w-full border-t border-surface-elevated">
          <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16">
            <RelatedScroll items={related} label={p.fromCollection} />
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
