"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import type { RawProduct } from "@/lib/products";

export default function RelatedScroll({
  items,
  label,
}: {
  items: RawProduct[];
  label: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const update = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 1);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [update, items]);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" });
  };

  return (
    <div>
      <p className="mb-8 text-xs tracking-label text-content-faint">{label}</p>
      <div className="relative">
        {/* Left chevron — absolute overlay, opacity만 전환해서 layout shift 없음 */}
        <button
          onClick={() => scroll("left")}
          className={`absolute left-0 top-22 -translate-y-1/2 z-10 size-9 flex items-center justify-center text-content-secondary hover:text-content-primary transition-[opacity,color] duration-200 ${
            canScrollLeft ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          aria-label="이전"
          tabIndex={canScrollLeft ? 0 : -1}
          aria-hidden={canScrollLeft ? undefined : true}
        >
          <ChevronLeft size={16} strokeWidth={1.5} aria-hidden="true" />
        </button>

        {/* Left edge gradient — oklch 보간으로 hue shift 없이 매끄럽게 페이드 */}
        <div
          className={`absolute left-0 top-0 h-full w-16 z-5 pointer-events-none transition-opacity duration-200 ${
            canScrollLeft ? "opacity-100" : "opacity-0"
          }`}
          style={{ background: "linear-gradient(in oklch to right, var(--color-surface-darkest), transparent)" }}
          aria-hidden="true"
        />

        {/* Scroll container */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-4"
          style={{ scrollbarWidth: "none", scrollSnapType: "x mandatory" }}
        >
          {items.map((item) => (
            <div key={item.id} className="shrink-0 w-44" style={{ scrollSnapAlign: "start" }}>
              <ProductCard
                id={item.id}
                name={item.name}

              />
            </div>
          ))}
        </div>

        {/* Right edge gradient */}
        <div
          className={`absolute right-0 top-0 h-full w-16 z-5 pointer-events-none transition-opacity duration-200 ${
            canScrollRight ? "opacity-100" : "opacity-0"
          }`}
          style={{ background: "linear-gradient(in oklch to left, var(--color-surface-darkest), transparent)" }}
          aria-hidden="true"
        />

        {/* Right chevron */}
        <button
          onClick={() => scroll("right")}
          className={`absolute right-0 top-22 -translate-y-1/2 z-10 size-9 flex items-center justify-center text-content-secondary hover:text-content-primary transition-[opacity,color] duration-200 ${
            canScrollRight ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          aria-label="다음"
          tabIndex={canScrollRight ? 0 : -1}
          aria-hidden={canScrollRight ? undefined : true}
        >
          <ChevronRight size={16} strokeWidth={1.5} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
