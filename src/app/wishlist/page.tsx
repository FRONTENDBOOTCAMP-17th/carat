"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthGuard from "@/components/AuthGuard";
import ProductCard from "@/components/ProductCard";
import { useAuth } from "@/context/AuthContext";
import { useLang } from "@/context/LanguageContext";

function WishlistContent() {
  const { wishlist } = useAuth();
  const { t } = useLang();
  const p = t.pages.wishlist;

  return (
    <main id="main-content" className="min-h-screen bg-surface-darkest flex flex-col">
      <Navbar />

      <div className="flex-1 flex flex-col px-4 pt-12 pb-24 sm:px-6 lg:px-8 max-w-container mx-auto w-full">
        <header>
          <h1
            className="mb-3 text-3xl tracking-heading text-content-primary"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            {p.title}
          </h1>
          <p className="mb-16 text-xs leading-relaxed text-content-faint">
            {p.desc}
          </p>
        </header>

        {wishlist.length > 0 ? (
          <ul className="grid grid-cols-2 gap-x-4 gap-y-12 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
            {wishlist.map((item) => (
              <li key={item.id}>
                <ProductCard
                  id={item.id}
                  name={item.name}
                  price={item.price}
                  category={item.category}
                  description={item.description}
                />
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              className="text-content-subtle"
              aria-label={p.heartLabel}
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <p className="text-xs tracking-link text-content-faint">{p.emptyTitle}</p>
            <p className="text-2xs text-content-subtle">{p.emptySub}</p>
            <Link
              href="/collections"
              className="mt-2 text-2xs tracking-link text-content-muted hover:text-content-primary transition-colors underline underline-offset-4"
            >
              {p.browseLink}
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}

export default function WishlistPage() {
  return (
    <AuthGuard>
      <WishlistContent />
    </AuthGuard>
  );
}
