"use client";

import { useAuth } from "@/context/AuthContext";
import type { WishlistItem } from "@/context/AuthContext";

export default function WishlistButton({ item }: { item: WishlistItem }) {
  const { user, wishlist, toggleWishlist, openLoginModal } = useAuth();
  const inWishlist = wishlist.some((w) => w.id === item.id);

  const handleClick = () => {
    if (!user) {
      openLoginModal("login");
      return;
    }
    toggleWishlist(item);
  };

  return (
    <button
      onClick={handleClick}
      className={`w-full py-4 text-xs tracking-link border transition-colors duration-200 ${
        inWishlist
          ? "bg-content-secondary text-surface-darkest border-content-secondary hover:bg-content-faint hover:border-content-faint"
          : "bg-transparent text-content-primary border-content-subtle hover:bg-content-secondary hover:text-surface-darkest hover:border-content-secondary"
      }`}
      aria-label={inWishlist ? "위시리스트에서 제거" : "위시리스트에 추가"}
      aria-pressed={inWishlist}
    >
      {inWishlist ? "위시리스트에서 제거" : "위시리스트에 추가"}
    </button>
  );
}
