"use client";

import { useAuth } from "@/context/AuthContext";

type CollectionCardProps = {
  id: string;
  title: string;
  price: string;
};

const HeartIcon = ({ filled }: { filled: boolean }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

export default function CollectionCard({ id, title, price }: CollectionCardProps) {
  const { user, wishlist, toggleWishlist, openLoginModal } = useAuth();
  const inWishlist = wishlist.some((w) => w.id === id);

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      openLoginModal("login");
      return;
    }
    toggleWishlist({ id, name: title, price, category: "RING" });
  };

  return (
    <article
      className="group cursor-pointer"
      aria-label={`${title}, ${price}`}
    >
      <div className="relative mb-4">
        <div
          className="aspect-4/5 bg-surface-elevated"
          role="img"
          aria-label={`${title} 컬렉션 이미지`}
        />
        <button
          onClick={handleWishlist}
          className={`absolute top-2 right-2 size-11 flex items-center justify-center transition-[opacity,color] duration-200 ${
            inWishlist
              ? "opacity-100 text-content-primary"
              : "opacity-0 group-hover:opacity-100 text-content-tertiary hover:text-content-primary"
          }`}
          aria-label={inWishlist ? "위시리스트에서 제거" : "위시리스트에 추가"}
          aria-pressed={inWishlist}
        >
          <HeartIcon filled={inWishlist} />
        </button>
      </div>
      <p className="mb-1 text-2xs tracking-link text-content-faint">RING</p>
      <h3 className="mb-1 text-sm font-light text-content-primary">{title}</h3>
      <p className="text-sm text-content-faint">{price}</p>
    </article>
  );
}
