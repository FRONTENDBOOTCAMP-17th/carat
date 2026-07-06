"use client";

import { useState } from "react";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import WishlistButton from "@/components/WishlistButton";
import BackButton from "@/components/BackButton";
import EssentialRingViewer from "@/components/EssentialRingViewer";
import { useLang } from "@/context/LanguageContext";

// swatch: 색상 선택 UI의 동그란 스와치 점 색 (원래 채도 유지 — 옵션 구분용이라 선명해야 함).
// metal: 3D 뷰어 금속 재질에 실제로 먹이는 색 (metalness=1 → 이 색이 곧 반사색). 채도를 너무 높이면
// 무채색 환경맵 위에서 "색 필터 씌운 거울"처럼 싸구려로 보이고(그래서 골드/로즈골드는 원래 채도의
// 40%선), 반대로 명도를 너무 올리면(90%대) 반사에 색이 거의 안 남아 정반대로 색이 죽어버림 — PBR
// 금속은 명도를 중간톤(약 70% 선)에 두고 채도로 색감을 살리는 쪽이 정석. 실버는 원래 무채색이라 그대로.
// roughness는 별개 축 — swatch/metal과 무관하게 유지.
const SWATCHES = {
  silver:    { swatch: "#C8C8C8", metal: "#C8C8C8", tint: "rgba(200, 200, 210, 0.12)", roughness: 0 },
  gold:      { swatch: "#C9A84C", metal: "#CDBF98", tint: "rgba(201, 168, 76, 0.12)", roughness: 0.12 },
  "rose-gold": { swatch: "#B76E79", metal: "#DBBDC2", tint: "rgba(183, 110, 121, 0.12)", roughness: 0.12 },
} as const;

type ColorId = keyof typeof SWATCHES;

export default function EssentialPage() {
  const [selected, setSelected] = useState<ColorId>("silver");
  const { t } = useLang();
  const p = t.pages.essential;

  const colors = p.colors as ReadonlyArray<{ id: string; label: string; sublabel: string; material: string }>;
  const color = colors.find((c) => c.id === selected) ?? colors[0];
  const swatch = SWATCHES[selected] ?? SWATCHES[colors[0]?.id as ColorId];
  if (!color || !swatch) return null;

  const wishlistItem = {
    id: `essential-${selected}`,
    name: p.wishlistItemName(color.label),
    category: "essential",
    description: color.sublabel,
  };

  return (
    <PageShell>
      <div className="flex-1 w-full max-w-container mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24">
        <nav aria-label={p.backNav}>
          <BackButton href="/" label="PRISME" />
        </nav>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* 3D model */}
          <div className="relative aspect-square bg-surface-stage overflow-hidden">
            <EssentialRingViewer
              metalColor={swatch.metal}
              roughness={swatch.roughness}
              fallbackTint={swatch.tint}
              canvasLabel={p.viewerLabel(color.label)}
            />
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <p className="mb-3 text-xs tracking-label text-content-faint font-normal">
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
                <p className="text-xs tracking-label text-content-secondary">
                  {p.materialSelect}
                </p>
                <p className="text-xs text-content-secondary transition-all duration-200">
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

            <div className="mb-8">
              <p className="mb-2 text-xs tracking-label text-content-secondary">
                {p.originLabel}
              </p>
              <p className="text-xs leading-relaxed text-content-secondary max-w-sm">
                {p.origin}
              </p>
            </div>

            <WishlistButton item={wishlistItem} />

            <Link
              href="/collections"
              className="mt-5 text-center text-xs tracking-label text-content-secondary hover:text-content-primary transition-colors"
            >
              {p.viewAll}
            </Link>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
