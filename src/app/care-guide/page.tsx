import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const TIPS = [
  {
    category: "일상 관리",
    items: [
      "화장품, 향수, 헤어 제품을 바른 뒤 주얼리를 착용하세요. 화학 성분이 금속 표면을 손상시킬 수 있습니다.",
      "수영장, 온천, 사우나 등 강한 화학 물질이나 고온 환경에서는 반드시 제거하세요.",
      "운동 중 착용은 피하세요. 땀의 산성 성분과 충격이 금속과 세팅에 영향을 줍니다.",
      "취침 시에는 주얼리를 빼두세요. 침구와의 마찰이 표면을 긁을 수 있습니다.",
    ],
  },
  {
    category: "세척 방법",
    items: [
      "미온수에 중성 세제(주방 세제 가능)를 희석해 부드러운 솔로 살살 닦아주세요.",
      "세척 후에는 깨끗한 물로 헹구고, 보풀 없는 천으로 가볍게 두드려 말립니다.",
      "초음파 세척기는 다이아몬드 세팅 제품에 사용 가능하나, 컬러 원석이 세팅된 제품에는 사용하지 마세요.",
      "염소 계열 세정제나 아세톤이 포함된 제품은 절대 사용하지 마세요.",
    ],
  },
  {
    category: "보관 방법",
    items: [
      "각 제품을 개별 파우치나 케이스에 따로 보관하세요. 금속끼리 맞닿으면 서로 긁힐 수 있습니다.",
      "직사광선과 고온 다습한 환경을 피해 서늘하고 건조한 곳에 보관하세요.",
      "스털링 실버는 공기 중 산화가 빠르므로, 지퍼백에 넣어 밀봉 보관하면 산화 속도를 늦출 수 있습니다.",
      "PRISME 시그니처 박스는 보관용으로도 최적화되어 있습니다.",
    ],
  },
  {
    category: "로듐 도금 (화이트 골드)",
    items: [
      "18K 화이트 골드 제품은 로듐 도금 처리되어 있으며, 착용 빈도에 따라 도금이 마모될 수 있습니다.",
      "도금이 벗겨지면 노란빛이 돌 수 있으나, 이는 자연스러운 현상입니다.",
      "재도금은 당사 A/S 센터에서 유상으로 제공합니다. contact@prisme.co로 문의해 주세요.",
    ],
  },
];

export default function CareGuidePage() {
  return (
    <main id="main-content" className="min-h-screen bg-surface-darkest flex flex-col">
      <Navbar />

      <section className="flex-1 w-full" aria-labelledby="care-heading">
        <div className="max-w-container mx-auto px-4 pt-12 pb-24 sm:px-6 lg:px-8">
          <nav aria-label="메인으로 돌아가기">
            <Link
              href="/"
              className="text-2xs tracking-link text-content-subtle hover:text-content-primary transition-colors"
            >
              ← PRISME
            </Link>
          </nav>

          <header className="mt-10 mb-16">
            <p className="mb-3 text-2xs tracking-descriptor text-content-faint">
              SUPPORT
            </p>
            <h1
              id="care-heading"
              className="mb-6 text-4xl sm:text-5xl text-content-primary font-light"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              CARE GUIDE
            </h1>
            <p className="max-w-xl text-xs leading-relaxed text-content-muted">
              PRISME 주얼리를 오래도록 아름답게 유지하기 위한 관리 방법을 안내합니다.
            </p>
          </header>

          <div className="max-w-2xl space-y-14">
            {TIPS.map((section) => (
              <section key={section.category} aria-labelledby={`care-${section.category}`}>
                <h2
                  id={`care-${section.category}`}
                  className="mb-6 text-xs tracking-label text-content-primary border-b border-surface-elevated pb-4"
                >
                  {section.category}
                </h2>
                <ul className="space-y-4">
                  {section.items.map((tip, i) => (
                    <li key={i} className="flex gap-4">
                      <span className="mt-0.5 shrink-0 text-2xs text-surface-input" aria-hidden="true">—</span>
                      <p className="text-xs leading-relaxed text-content-muted">{tip}</p>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
