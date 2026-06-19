import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WishlistButton from "@/components/WishlistButton";
import { getProductById } from "@/lib/products";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) notFound();

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
        <nav aria-label="이전 페이지로 돌아가기">
          <Link
            href={product.backHref}
            className="text-2xs tracking-link text-content-subtle hover:text-content-primary transition-colors"
          >
            ← {product.categoryLabel}
          </Link>
        </nav>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <div
            className="aspect-square bg-surface-input w-full"
            role="img"
            aria-label={`${product.name} 상품 이미지`}
          />

          <div className="flex flex-col">
            <p className="mb-3 text-2xs tracking-link text-content-faint">
              {product.categoryLabel}
            </p>
            <h1
              className="mb-6 text-4xl sm:text-5xl tracking-heading text-content-primary font-light"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              {product.name}
            </h1>
            <p className="mb-8 text-xs leading-relaxed text-content-muted">
              {product.description}
            </p>

            <dl className="mb-8 space-y-3">
              <div className="flex gap-8">
                <dt className="text-2xs tracking-link text-content-subtle shrink-0 w-8">
                  소재
                </dt>
                <dd className="text-2xs text-content-secondary">{product.material}</dd>
              </div>
              <div className="flex gap-8">
                <dt className="text-2xs tracking-link text-content-subtle shrink-0 w-8">
                  규격
                </dt>
                <dd className="text-2xs text-content-secondary">{product.dimensions}</dd>
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
