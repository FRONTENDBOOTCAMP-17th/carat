import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const MATERIALS = [
  {
    name: "18K 옐로우 골드",
    sub: "18K Yellow Gold",
    desc: "75% 순금에 구리·은을 합금해 제작됩니다. 따뜻한 황금빛이 오랜 시간이 지나도 변색 없이 유지되며, PRISME 시그니처 컬렉션 대부분에 사용됩니다.",
  },
  {
    name: "18K 화이트 골드",
    sub: "18K White Gold",
    desc: "순금에 팔라듐 또는 니켈을 합금하고 로듐 도금을 더해 차가운 실버 톤을 완성합니다. 다이아몬드와 함께했을 때 빛의 반사를 극대화합니다.",
  },
  {
    name: "18K 로즈 골드",
    sub: "18K Rose Gold",
    desc: "구리 함량을 높여 따뜻하고 은은한 핑크 빛을 냅니다. 피부 톤과 자연스럽게 어우러지는 색감으로 에센셜 라인에서 즐겨 사용됩니다.",
  },
  {
    name: "스털링 실버",
    sub: "Sterling Silver",
    desc: "은 함량 92.5%의 스털링 실버를 사용합니다. 섬세한 조형 표현에 적합하며, 시간이 지날수록 고유한 산화 패티나가 더해져 독특한 질감을 형성합니다.",
  },
  {
    name: "다이아몬드",
    sub: "Diamond",
    desc: "GIA 인증 기준에 따라 선별된 다이아몬드만을 사용합니다. 컷·컬러·클래리티·캐럿(4C)을 기준으로 엄격하게 심사하여, 최적의 광채를 발산하는 원석을 선택합니다.",
  },
  {
    name: "천연 원석",
    sub: "Precious Gemstones",
    desc: "에메랄드, 루비, 사파이어 등 천연 원석을 시즌 리미티드 컬렉션에 한정 적용합니다. 원석 특유의 내포물과 불균일성은 결함이 아닌 자연의 흔적입니다.",
  },
];

export default function MaterialsPage() {
  return (
    <main id="main-content" className="min-h-screen bg-surface-darkest flex flex-col">
      <Navbar />

      <section className="flex-1 w-full" aria-labelledby="materials-heading">
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
              EXPLORE
            </p>
            <h1
              id="materials-heading"
              className="mb-6 text-4xl sm:text-5xl text-content-primary font-light"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              MATERIALS
            </h1>
            <p className="max-w-xl text-xs leading-relaxed text-content-muted">
              PRISME는 소재 선택에서부터 완성까지, 모든 과정을 정직하게 다룹니다.
              사용하는 귀금속과 원석 하나하나가 작품의 품격을 결정한다고 믿기 때문입니다.
            </p>
          </header>

          <ul className="grid grid-cols-1 gap-px bg-surface-elevated sm:grid-cols-2 lg:grid-cols-3">
            {MATERIALS.map((m) => (
              <li key={m.name} className="flex flex-col gap-3 bg-surface-darkest p-8">
                <p className="text-2xs tracking-label text-content-faint">{m.sub}</p>
                <h2 className="text-lg text-content-primary font-light">{m.name}</h2>
                <p className="text-xs leading-relaxed text-content-muted">{m.desc}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Footer />
    </main>
  );
}
