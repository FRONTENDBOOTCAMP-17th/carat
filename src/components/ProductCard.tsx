"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLang } from "@/context/LanguageContext";
import { productImage } from "@/lib/productImages";
import { blurFor } from "@/lib/blurData";

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
  const imgSrc = productImage(id);
  const blur = blurFor(imgSrc);

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
        <div className="relative aspect-square bg-surface-input overflow-hidden">
          <Image
            src={imgSrc}
            alt={t.productCard.imageAlt(name)}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            placeholder={blur ? "blur" : "empty"}
            blurDataURL={blur}
          />
        </div>
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
