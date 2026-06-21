"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WishlistButton from "@/components/WishlistButton";
import BackButton from "@/components/BackButton";
import { useLang } from "@/context/LanguageContext";

const SWATCHES = {
  silver:    { swatch: "#C8C8C8", tint: "rgba(200, 200, 210, 0.12)" },
  gold:      { swatch: "#C9A84C", tint: "rgba(201, 168, 76, 0.12)" },
  "rose-gold": { swatch: "#B76E79", tint: "rgba(183, 110, 121, 0.12)" },
} as const;

type ColorId = keyof typeof SWATCHES;

export default function EssentialPage() {
  const [selected, setSelected] = useState<ColorId>("gold");
  const { t } = useLang();
  const p = t.pages.essential;

  const colors = p.colors as ReadonlyArray<{ id: string; label: string; sublabel: string; material: string }>;
  const color = colors.find((c) => c.id === selected) ?? colors[0];
  const swatch = SWATCHES[selected] ?? SWATCHES[colors[0]?.id as ColorId];
  if (!color || !swatch) return null;

  const wishlistItem = {
    id: `essential-${selected}`,
    name: p.wishlistItemName(color.label),
    price: "₩ 10,000,000",
    category: "essential",
    description: color.sublabel,
  };

  return (
    <main
      id="main-content"
      className="min-h-screen bg-surface-darkest flex flex-col"
    >
      <Navbar />

      <div className="flex-1 w-full max-w-container mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24">
        <nav aria-label={p.backNav}>
          <BackButton href="/" label="PRISME" />
        </nav>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Image */}
          <div className="relative aspect-square bg-surface-input overflow-hidden">
            <div
              className="absolute inset-0 transition-colors duration-700"
              style={{ backgroundColor: swatch.tint }}
              aria-hidden="true"
            />
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <p className="mb-3 text-2xs tracking-label text-content-faint font-normal">
              {p.sectionLabel}
            </p>
            <h1
              className="mb-2 text-4xl sm:text-5xl text-content-primary font-light"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              {p.title}
            </h1>

            <p className="mb-10 text-xs leading-relaxed text-content-secondary max-w-sm">
              {p.desc}
            </p>

            {/* Color Selection */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <p className="text-2xs tracking-label text-content-secondary">
                  {p.materialSelect}
                </p>
                <p className="text-2xs text-content-secondary transition-all duration-200">
                  {color.sublabel}
                </p>
              </div>

              <div
                className="flex gap-2"
                role="radiogroup"
                aria-label={p.colorGroup}
              >
                {colors.map((c) => (
                  <button
                    key={c.id}
                    role="radio"
                    aria-checked={selected === c.id}
                    aria-label={c.label}
                    onClick={() => setSelected(c.id as ColorId)}
                    className="flex flex-col items-center gap-1.5 group w-16"
                  >
                    <span
                      className={`rounded-full p-0.75 transition-colors duration-200 ${
                        selected === c.id
                          ? "border border-content-secondary"
                          : "border border-transparent group-hover:border-content-subtle"
                      }`}
                    >
                      <span
                        className="block size-6 rounded-full"
                        style={{ backgroundColor: SWATCHES[c.id as ColorId]?.swatch }}
                      />
                    </span>
                    <span
                      className={`block w-full text-center text-xs transition-colors duration-200 ${
                        selected === c.id
                          ? "text-content-primary"
                          : "text-content-muted group-hover:text-content-secondary"
                      }`}
                    >
                      {c.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <dl className="mb-8 space-y-3">
              <div className="flex gap-8">
                <dt className="text-xs tracking-label text-content-secondary shrink-0 w-16">
                  {p.material}
                </dt>
                <dd className="text-xs text-content-secondary transition-all duration-200">
                  {color.material}
                </dd>
              </div>
              <div className="flex gap-8">
                <dt className="text-xs tracking-label text-content-secondary shrink-0 w-16">
                  {p.dimensions}
                </dt>
                <dd className="text-xs text-content-secondary">{p.dimensionValue}</dd>
              </div>
            </dl>

            <p className="mb-8 text-xl text-content-primary">₩ 10,000,000</p>

            <WishlistButton item={wishlistItem} />

            <Link
              href="/collections"
              className="mt-5 text-center text-2xs tracking-label text-content-secondary hover:text-content-primary transition-colors"
            >
              {p.viewAll}
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
