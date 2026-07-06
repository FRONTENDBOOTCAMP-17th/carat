"use client";

import { useRef, useState, useEffect, useMemo, useId } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Search } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import { searchProducts } from "@/lib/search";
import type { SearchableProduct } from "@/lib/search";

export default function SearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxId = useId();
  const router = useRouter();
  const { t } = useLang();

  const results: SearchableProduct[] = useMemo(() => {
    const q = query.trim();
    if (!q) return [];
    const { direct, related } = searchProducts(q);
    return [...direct, ...related].slice(0, 6);
  }, [query]);

  // 쿼리 바뀌면 선택 초기화 (의도적 리셋)
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setActiveIndex(-1); }, [query]);

  // 열릴 때 포커스, 닫힐 때 상태 초기화 (의도적 리셋)
  useEffect(() => {
    if (!isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQuery("");
      setActiveIndex(-1);
      return;
    }
    const timer = setTimeout(() => inputRef.current?.focus(), 80);
    return () => clearTimeout(timer);
  }, [isOpen]);

  // 키보드: Esc · ↑↓ · Enter
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) => Math.min(prev + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) => Math.max(prev - 1, -1));
      } else if (e.key === "Enter" && activeIndex >= 0) {
        e.preventDefault();
        router.push(results[activeIndex].href);
        onClose();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose, results, activeIndex, router]);

  const handleSubmit = (e: { preventDefault(): void }) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
    onClose();
  };

  const handleSelect = (href: string) => {
    router.push(href);
    onClose();
  };

  const activeOptionId = activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-200 flex flex-col items-center justify-center bg-surface-base/95 px-6 py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={t.search.label}
        >
          <motion.div
            className="w-full max-w-lg"
            initial={{ y: -12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -12, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleSubmit} role="search">
              <label htmlFor="site-search" className="sr-only">{t.search.label}</label>

              {/* 입력 행 */}
              <div className="relative flex items-center border-b border-surface-elevated pb-3">
                <input
                  ref={inputRef}
                  id="site-search"
                  type="search"
                  autoComplete="off"
                  spellCheck={false}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t.search.placeholder}
                  className="flex-1 bg-transparent text-xl text-content-primary placeholder:text-content-muted outline-none"
                  style={{ fontFamily: "var(--font-pretendard)" }}
                  role="combobox"
                  aria-expanded={results.length > 0}
                  aria-controls={listboxId}
                  aria-activedescendant={activeOptionId}
                  aria-autocomplete="list"
                />
                <button
                  type="submit"
                  aria-label={t.search.submit}
                  className="ml-4 text-content-tertiary hover:text-content-primary transition-colors"
                >
                  <Search size={18} strokeWidth={1.5} aria-hidden="true" />
                </button>
              </div>

              {/* 인라인 결과 */}
              {results.length > 0 && (
                <ul
                  id={listboxId}
                  role="listbox"
                  aria-label={t.search.label}
                  className="mt-1 border border-surface-elevated divide-y divide-surface-elevated"
                >
                  {results.map((item, i) => (
                    <li
                      key={item.id}
                      id={`${listboxId}-option-${i}`}
                      role="option"
                      aria-selected={i === activeIndex}
                      onMouseEnter={() => setActiveIndex(i)}
                      onClick={() => handleSelect(item.href)}
                      className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-colors ${
                        i === activeIndex
                          ? "bg-surface-elevated text-content-primary"
                          : "text-content-secondary"
                      }`}
                    >
                      <span className="text-sm">{item.name}</span>
                      <span className="text-xs tracking-label text-content-faint shrink-0 ml-4">
                        {item.categoryLabel}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              <p className="mt-3 text-xs text-content-secondary tracking-label">{t.search.escHint}</p>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
