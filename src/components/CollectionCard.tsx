"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useLang } from "@/context/LanguageContext";

type CollectionCardProps = {
  id: string;
  title: string;
  price: string;
  category?: string;
};

const HeartIcon = ({ filled }: { filled: boolean }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

export default function CollectionCard({ id, title, price, category }: CollectionCardProps) {
  const router = useRouter();
  const { user, wishlist, toggleWishlist, openLoginModal } = useAuth();
  const { t } = useLang();
  const inWishlist = wishlist.some((w) => w.id === id);

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) { openLoginModal("login"); return; }
    toggleWishlist({ id, name: title, price, category });
  };

  return (
    <article
      className="group cursor-pointer"
      aria-label={`${title}, ${price}`}
      role="link"
      tabIndex={0}
      onClick={() => router.push(`/products/${id}`)}
      onKeyDown={(e) => { if (e.key === "Enter") router.push(`/products/${id}`); }}
    >
      <div className="relative mb-4">
        <div className="aspect-4/5 bg-surface-elevated" role="img" aria-label={t.productCard.collectionImageAlt(title)} />
        <button
          onClick={handleWishlist}
          className={`absolute top-2 right-2 size-11 flex items-center justify-center transition-[opacity,color] duration-200 ${
            inWishlist
              ? "opacity-100 text-content-primary"
              : "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 focus-visible:opacity-100 text-content-tertiary hover:text-content-primary"
          }`}
          aria-label={inWishlist ? t.productCard.removeFromWishlist : t.productCard.addToWishlist}
          aria-pressed={inWishlist}
        >
          <HeartIcon filled={inWishlist} />
        </button>
      </div>
      {category && <p className="mb-1 text-2xs tracking-label text-content-faint">{category}</p>}
      <h3 className="mb-1 text-sm font-light text-content-primary">{title}</h3>
      <p className="text-sm text-content-faint">{price}</p>
    </article>
  );
}
