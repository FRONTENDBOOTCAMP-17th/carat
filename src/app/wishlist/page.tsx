"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import PageShell from "@/components/PageShell";
import AuthGuard from "@/components/AuthGuard";
import ProductCard from "@/components/ProductCard";
import { useAuth } from "@/context/AuthContext";
import { useLang } from "@/context/LanguageContext";

function WishlistHeader() {
  const { t } = useLang();
  const p = t.pages.wishlist;
  return (
    <header>
      <h1
        className="mb-3 text-3xl tracking-label text-content-primary"
        style={{ fontFamily: "var(--font-cinzel)" }}
      >
        {p.title}
      </h1>
      <p className="mb-16 text-xs leading-relaxed text-content-faint">
        {p.desc}
      </p>
    </header>
  );
}

function WishlistItems() {
  const { wishlist } = useAuth();
  const { t } = useLang();
  const p = t.pages.wishlist;

  return wishlist.length > 0 ? (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-12 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
      {wishlist.map((item) => (
        <li key={item.id}>
          <ProductCard
            id={item.id}
            name={item.name}
            category={item.category}
            description={item.description}
          />
        </li>
      ))}
    </ul>
  ) : (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
      <Heart size={32} strokeWidth={1} className="text-content-secondary" aria-label={p.heartLabel} />
      <p className="text-xs tracking-label text-content-faint">{p.emptyTitle}</p>
      <p className="text-xs text-content-secondary">{p.emptySub}</p>
      <Link
        href="/collections"
        className="mt-2 text-xs tracking-label text-content-secondary hover:text-content-primary transition-colors underline underline-offset-4"
      >
        {p.browseLink}
      </Link>
    </div>
  );
}

function SignInPrompt() {
  const { openLoginModal } = useAuth();
  const { t } = useLang();
  const p = t.pages.wishlist;

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
      <p className="text-xs tracking-label text-content-faint">{p.signInTitle}</p>
      <p className="text-xs text-content-secondary">{p.signInSub}</p>
      <button
        onClick={() => openLoginModal("login")}
        className="mt-2 text-xs tracking-label text-content-secondary hover:text-content-primary transition-colors underline underline-offset-4"
      >
        {p.signInCta}
      </button>
    </div>
  );
}

export default function WishlistPage() {
  return (
    <PageShell>
      <div className="flex-1 flex flex-col px-4 pt-12 pb-24 sm:px-6 lg:px-8 max-w-container mx-auto w-full">
        <WishlistHeader />
        <AuthGuard fallback={<SignInPrompt />}>
          <WishlistItems />
        </AuthGuard>
      </div>
    </PageShell>
  );
}
