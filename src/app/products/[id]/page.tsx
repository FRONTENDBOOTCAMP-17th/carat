import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import PageShell from "@/components/PageShell";
import WishlistButton from "@/components/WishlistButton";
import BackButton from "@/components/BackButton";
import RelatedScroll from "@/components/RelatedScroll";
import Breadcrumb from "@/components/Breadcrumb";
import { getProductById, getProductsByCategory } from "@/lib/products";
import { productImage } from "@/lib/productImages";
import { translations } from "@/lib/translations";
import type { CategoryKey } from "@/lib/products";
import type { Lang } from "@/lib/translations";

async function getLang(): Promise<Lang> {
  const cookieStore = await cookies();
  const v = cookieStore.get("prisme_lang")?.value;
  return v === "ko" || v === "en" ? v : "ko";
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const lang = await getLang();
  const product = getProductById(id, lang);
  return { title: product?.name ?? "Product" };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lang = await getLang();
  const t = translations[lang];
  const product = getProductById(id, lang);

  if (!product) notFound();

  const p = t.pages.product;

  const related = product.category
    ? getProductsByCategory(product.category as CategoryKey, lang).filter((r) => r.id !== product.id)
    : [];

  const wishlistItem = {
    id: product.id,
    name: product.name,
    category: product.category,
    description: product.description ?? "",
  };

  return (
    <PageShell>
      <div className="flex-1 w-full max-w-container mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24">
        <div className="hidden sm:block">
          <Breadcrumb
            items={[
              { label: "PRISME", href: "/" },
              { label: product.categoryLabel, href: product.backHref },
              { label: product.name },
            ]}
          />
        </div>
        <nav aria-label={p.backNav} className="sm:hidden">
          <BackButton href={product.backHref} label={product.categoryLabel} />
        </nav>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <div className="relative aspect-square bg-surface-input w-full overflow-hidden">
            <Image
              src={productImage(product.id)}
              alt={t.productCard.imageAlt(product.name)}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
              priority
            />
          </div>

          <div className="flex flex-col">
            <p className="mb-3 text-xs tracking-label text-content-faint">
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
                <dt className="text-xs tracking-label text-content-secondary shrink-0 w-16">
                  {p.material}
                </dt>
                <dd className="text-xs text-content-secondary">{p.materialValue}</dd>
              </div>
              <div className="flex gap-8">
                <dt className="text-xs tracking-label text-content-secondary shrink-0 w-16">
                  {p.dimensions}
                </dt>
                <dd className="text-xs text-content-secondary">{p.dimensionsValue}</dd>
              </div>
            </dl>

            <div className="mb-8 pt-6 border-t border-surface-elevated flex gap-6">
              <Link
                href="/materials"
                className="text-xs tracking-label text-content-secondary hover:text-content-primary transition-colors"
              >
                {p.materialsLink} →
              </Link>
              <Link
                href="/care-guide"
                className="text-xs tracking-label text-content-secondary hover:text-content-primary transition-colors"
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
    </PageShell>
  );
}
