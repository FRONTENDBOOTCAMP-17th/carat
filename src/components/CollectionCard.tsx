"use client";

import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLang } from "@/context/LanguageContext";

type CollectionCardProps = {
  id: string;
  title: string;
  category?: string;
};

export default function CollectionCard({ id, title, category }: CollectionCardProps) {
  const router = useRouter();
  const { user, wishlist, toggleWishlist, openLoginModal } = useAuth();
  const { t } = useLang();
  const inWishlist = wishlist.some((w) => w.id === id);

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) { openLoginModal("login"); return; }
    toggleWishlist({ id, name: title, category });
  };

  return (
    <article
      className="group cursor-pointer"
      aria-label={title}
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
          <Heart size={18} strokeWidth={1.5} fill={inWishlist ? "currentColor" : "none"} aria-hidden="true" />
        </button>
      </div>
      {category && <p className="mb-1 text-xs tracking-label text-content-faint">{category}</p>}
      <h3 className="text-sm font-light text-content-primary">{title}</h3>
    </article>
  );
}
