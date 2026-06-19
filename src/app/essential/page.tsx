"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WishlistButton from "@/components/WishlistButton";
import BackButton from "@/components/BackButton";

const COLORS = [
  {
    id: "silver",
    label: "실버",
    sublabel: "Sterling Silver",
    material: "스털링 실버 / 다이아몬드",
    swatch: "#C8C8C8",
    tint: "rgba(200, 200, 210, 0.12)",
  },
  {
    id: "gold",
    label: "골드",
    sublabel: "18K Yellow Gold",
    material: "18K 옐로우 골드 / 다이아몬드",
    swatch: "#C9A84C",
    tint: "rgba(201, 168, 76, 0.12)",
  },
  {
    id: "rose-gold",
    label: "로즈 골드",
    sublabel: "18K Rose Gold",
    material: "18K 로즈 골드 / 다이아몬드",
    swatch: "#B76E79",
    tint: "rgba(183, 110, 121, 0.12)",
  },
] as const;

type ColorId = (typeof COLORS)[number]["id"];

export default function EssentialPage() {
  const [selected, setSelected] = useState<ColorId>("gold");
  const color = COLORS.find((c) => c.id === selected)!;

  const wishlistItem = {
    id: `essential-${selected}`,
    name: `Essential Ring — ${color.label}`,
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
        <nav aria-label="이전 페이지로 돌아가기">
          <BackButton href="/" label="PRISME" />
        </nav>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Image */}
          <div className="relative aspect-square bg-surface-input overflow-hidden">
            <div
              className="absolute inset-0 transition-colors duration-700"
              style={{ backgroundColor: color.tint }}
              aria-hidden="true"
            />
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <p className="mb-3 text-2xs tracking-descriptor text-content-faint">
              ESSENTIAL COLLECTION
            </p>
            <h1
              className="mb-2 text-4xl sm:text-5xl text-content-primary font-light"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              ESSENTIAL RING
            </h1>

            <p className="mb-10 text-xs leading-relaxed text-content-muted max-w-sm">
              균형을 통해 형성되고 우아함으로 정의된 반지. PRISME의 시그니처
              피스로, 현대적인 조형성과 정교한 소재가 만나는 가장 순수한
              표현입니다.
            </p>

            {/* Color Selection */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <p className="text-2xs tracking-link text-content-subtle">
                  소재 선택
                </p>
                <p className="text-2xs text-content-secondary transition-all duration-200">
                  {color.sublabel}
                </p>
              </div>

              <div
                className="flex gap-2"
                role="radiogroup"
                aria-label="색상 선택"
              >
                {COLORS.map((c) => (
                  <button
                    key={c.id}
                    role="radio"
                    aria-checked={selected === c.id}
                    aria-label={c.label}
                    onClick={() => setSelected(c.id)}
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
                        style={{ backgroundColor: c.swatch }}
                      />
                    </span>
                    <span
                      className={`block w-full text-center text-xs transition-colors duration-200 ${
                        selected === c.id
                          ? "text-content-primary"
                          : "text-content-subtle group-hover:text-content-secondary"
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
                <dt className="text-xs tracking-link text-content-subtle shrink-0 w-8">
                  소재
                </dt>
                <dd className="text-xs text-content-secondary transition-all duration-200">
                  {color.material}
                </dd>
              </div>
              <div className="flex gap-8">
                <dt className="text-xs tracking-link text-content-subtle shrink-0 w-8">
                  규격
                </dt>
                <dd className="text-xs text-content-secondary">내경 16.5mm</dd>
              </div>
            </dl>

            <p className="mb-8 text-xl text-content-primary">₩ 10,000,000</p>

            <WishlistButton item={wishlistItem} />

            <Link
              href="/collections"
              className="mt-5 text-center text-2xs tracking-link text-content-subtle hover:text-content-primary transition-colors"
            >
              컬렉션 전체 보기 →
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
