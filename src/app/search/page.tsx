import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { searchProducts } from "@/lib/search";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  const { direct, related, suggestion } = query
    ? searchProducts(query)
    : { direct: [], related: [], suggestion: null };

  return (
    <main
      id="main-content"
      className="min-h-screen bg-surface-darkest flex flex-col"
    >
      <Navbar />

      <div className="flex-1 w-full max-w-container mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24">
        {/* Header */}
        <header className="mb-12">
          <p className="mb-3 text-2xs tracking-descriptor text-content-faint">
            SEARCH
          </p>
          <h1
            className="text-3xl sm:text-4xl tracking-heading text-content-primary font-light"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            {query ? `"${query}"` : "SEARCH"}
          </h1>
          {query && (
            <p className="mt-3 text-xs text-content-subtle">
              {direct.length > 0
                ? `${direct.length}개의 상품을 찾았습니다.`
                : "검색 결과를 찾지 못했습니다."}
            </p>
          )}
        </header>

        {/* 오타 교정 제안 */}
        {suggestion && (
          <div className="mb-10 px-4 py-3 border border-surface-elevated">
            <p className="text-xs text-content-muted">
              혹시{" "}
              <Link
                href={`/search?q=${encodeURIComponent(suggestion)}`}
                className="text-content-primary underline underline-offset-2 hover:no-underline transition-all"
              >
                &ldquo;{suggestion}&rdquo;
              </Link>
              {" "}을/를 찾으셨나요?
            </p>
          </div>
        )}

        {/* 직접 매치 */}
        {direct.length > 0 && (
          <section aria-labelledby="search-direct-heading" className="mb-16">
            <h2
              id="search-direct-heading"
              className="mb-8 text-2xs tracking-label text-content-faint"
            >
              검색 결과
            </h2>
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 lg:gap-6">
              {direct.map((p) => (
                <li key={p.id}>
                  <ProductCard
                    id={p.id}
                    name={p.name}
                    description={p.description}
                    price={p.price}
                    category={p.categoryLabel}
                    href={p.href}
                  />
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* 연관 상품 */}
        {related.length > 0 && (
          <section aria-labelledby="search-related-heading">
            <h2
              id="search-related-heading"
              className="mb-8 text-2xs tracking-label text-content-faint"
            >
              {direct.length > 0 ? "연관 상품" : "혹시 이걸 찾으셨나요?"}
            </h2>
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 lg:gap-6">
              {related.map((p) => (
                <li key={p.id}>
                  <ProductCard
                    id={p.id}
                    name={p.name}
                    description={p.description}
                    price={p.price}
                    category={p.categoryLabel}
                    href={p.href}
                  />
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* 결과 없음 */}
        {query && direct.length === 0 && related.length === 0 && !suggestion && (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <p className="text-sm text-content-muted">
              &ldquo;{query}&rdquo;에 대한 결과가 없습니다.
            </p>
            <p className="text-xs text-content-subtle">
              다른 검색어를 시도해 보세요.
            </p>
            <Link
              href="/collections"
              className="mt-4 text-2xs tracking-link text-content-muted hover:text-content-primary transition-colors underline underline-offset-4"
            >
              전체 컬렉션 보기 →
            </Link>
          </div>
        )}

        {/* 쿼리 없음 */}
        {!query && (
          <p className="text-xs text-content-subtle text-center py-24">
            검색어를 입력하면 관련 상품이 표시됩니다.
          </p>
        )}
      </div>

      <Footer />
    </main>
  );
}
