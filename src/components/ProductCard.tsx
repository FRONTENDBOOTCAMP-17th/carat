"use client";

import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLang } from "@/context/LanguageContext";

type ProductCardProps = {
  id: string;
  name: string;
  description?: string;
  category?: string;
  href?: string;
};

export default function ProductCard({ id, name, description, category, href }: ProductCardProps) {
  const router = useRouter();
  const { user, wishlist, toggleWishlist, openLoginModal } = useAuth();
  const { t } = useLang();
  const inWishlist = wishlist.some((w) => w.id === id);
  const navigateTo = href ?? `/products/${id}`;

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) { openLoginModal("login"); return; }
    toggleWishlist({ id, name, category, description });
  };

  return (
    <article
      className="group cursor-pointer"
      aria-label={`${name}${category ? `, ${category}` : ""}`}
      role="link"
      tabIndex={0}
      onClick={() => router.push(navigateTo)}
      onKeyDown={(e) => { if (e.key === "Enter") router.push(navigateTo); }}
    >
      <div className="relative mb-4">
        <div className="aspect-square bg-surface-input" role="img" aria-label={t.productCard.imageAlt(name)} />
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
      <h3 className="mb-0.5 text-sm font-light text-content-primary">{name}</h3>
      {description && <p className="mb-0.5 text-xs text-content-faint">{description}</p>}
    </article>
  );
}
