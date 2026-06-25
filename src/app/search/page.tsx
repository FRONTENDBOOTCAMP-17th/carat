"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import PageShell from "@/components/PageShell";
import ProductCard from "@/components/ProductCard";
import { searchProducts } from "@/lib/search";
import { useLang } from "@/context/LanguageContext";

function SearchContent() {
  const searchParams = useSearchParams();
  const { t } = useLang();
  const p = t.pages.search;

  const query = searchParams.get("q")?.trim() ?? "";
  const { direct, related, suggestion } = query
    ? searchProducts(query)
    : { direct: [], related: [], suggestion: null };

  return (
    <PageShell>
      <div className="flex-1 w-full max-w-container mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24">
        {/* Header */}
        <header className="mb-12">
          <p className="mb-3 text-xs tracking-label text-content-faint font-normal">
            {p.section}
          </p>
          <h1
            className="text-3xl sm:text-4xl tracking-label text-content-primary font-light"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            {query ? `"${query}"` : "SEARCH"}
          </h1>
          {query && (
            <p className="mt-3 text-xs text-content-secondary">
              {direct.length > 0 ? p.resultCount(direct.length) : p.noResults}
            </p>
          )}
        </header>

        {/* Typo suggestion */}
        {suggestion && (
          <div className="mb-10 px-4 py-3 border border-surface-elevated">
            <p className="text-xs text-content-secondary">
              {p.suggestionPrefix}
              <Link
                href={`/search?q=${encodeURIComponent(suggestion)}`}
                className="text-content-primary underline underline-offset-2 hover:no-underline transition-all"
              >
                &ldquo;{suggestion}&rdquo;
              </Link>
              {p.suggestionSuffix}
            </p>
          </div>
        )}

        {/* Direct matches */}
        {direct.length > 0 && (
          <section aria-labelledby="search-direct-heading" className="mb-16">
            <h2
              id="search-direct-heading"
              className="mb-8 text-xs tracking-label text-content-faint font-normal"
            >
              {p.sectionDirect}
            </h2>
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 lg:gap-6">
              {direct.map((item) => (
                <li key={item.id}>
                  <ProductCard
                    id={item.id}
                    name={item.name}
                    description={item.description}
                    category={item.categoryLabel}
                    href={item.href}
                  />
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Related */}
        {related.length > 0 && (
          <section aria-labelledby="search-related-heading">
            <h2
              id="search-related-heading"
              className="mb-8 text-xs tracking-label text-content-faint font-normal"
            >
              {direct.length > 0 ? p.sectionRelated : p.sectionRelatedNoExact}
            </h2>
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 lg:gap-6">
              {related.map((item) => (
                <li key={item.id}>
                  <ProductCard
                    id={item.id}
                    name={item.name}
                    description={item.description}
                    category={item.categoryLabel}
                    href={item.href}
                  />
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* No results */}
        {query && direct.length === 0 && related.length === 0 && !suggestion && (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <p className="text-sm text-content-secondary">{p.noMatch(query)}</p>
            <p className="text-xs text-content-secondary">{p.tryOther}</p>
            <Link
              href="/collections"
              className="mt-4 text-xs tracking-label text-content-secondary hover:text-content-primary transition-colors underline underline-offset-4"
            >
              {p.viewAll}
            </Link>
          </div>
        )}

        {/* Empty query */}
        {!query && (
          <p className="text-xs text-content-secondary text-center py-24">
            {p.emptyQuery}
          </p>
        )}
      </div>
    </PageShell>
  );
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchContent />
    </Suspense>
  );
}
