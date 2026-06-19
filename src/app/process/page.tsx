import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const STEPS = [
  {
    step: "01",
    title: "DESIGN",
    sub: "디자인 스케치",
    desc: "모든 작품은 손으로 그린 스케치에서 시작됩니다. 조형적 균형, 착용감, 빛의 반사각을 고려한 설계도가 완성되기까지 수차례의 수정을 거칩니다.",
  },
  {
    step: "02",
    title: "WAX MODELING",
    sub: "왁스 조형",
    desc: "스케치를 바탕으로 왁스를 정밀 조각합니다. 0.1mm 단위의 세부 디테일까지 수공으로 다듬어, 실제 금속 주조 전 최종 형태를 확인합니다.",
  },
  {
    step: "03",
    title: "CASTING",
    sub: "주조",
    desc: "완성된 왁스 모형을 석고에 매립하고 고온으로 소성한 뒤, 용융 금속을 주입합니다. 주조 후에는 기포와 표면 결함을 전수 검사합니다.",
  },
  {
    step: "04",
    title: "SETTING",
    sub: "세팅",
    desc: "다이아몬드 또는 원석을 설정된 포지션에 정밀 세팅합니다. 프롱(Prong), 베젤(Bezel), 파베(Pavé) 등 작품 디자인에 최적화된 방식으로 고정합니다.",
  },
  {
    step: "05",
    title: "POLISHING",
    sub: "폴리싱",
    desc: "여러 단계의 연마 과정을 통해 표면을 완성합니다. 하이폴리시, 새틴, 헤어라인 등 각 작품에 지정된 마감 처리를 수작업으로 진행합니다.",
  },
  {
    step: "06",
    title: "QUALITY CHECK",
    sub: "품질 검수",
    desc: "출하 전 중량, 치수, 세팅 안정성, 표면 상태를 최종 점검합니다. 기준을 충족하지 못한 제품은 재작업하며, 합격 인증 후에만 포장됩니다.",
  },
];

export default function ProcessPage() {
  return (
    <main id="main-content" className="min-h-screen bg-surface-darkest flex flex-col">
      <Navbar />

      <section className="flex-1 w-full" aria-labelledby="process-heading">
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
              id="process-heading"
              className="mb-6 text-4xl sm:text-5xl text-content-primary font-light"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              PROCESS
            </h1>
            <p className="max-w-xl text-xs leading-relaxed text-content-muted">
              하나의 반지가 완성되기까지, PRISME의 아틀리에에서는 여섯 단계의
              손길이 더해집니다. 어떤 단계도 기계로 대체하지 않습니다.
            </p>
          </header>

          <ol className="space-y-px" aria-label="제작 공정">
            {STEPS.map((s) => (
              <li
                key={s.step}
                className="grid grid-cols-[auto_1fr] gap-8 bg-surface-raised px-8 py-10 sm:grid-cols-[80px_auto_1fr] sm:gap-12"
              >
                <span
                  className="text-4xl font-light text-surface-elevated"
                  aria-hidden="true"
                  style={{ fontFamily: "var(--font-cinzel)" }}
                >
                  {s.step}
                </span>
                <div className="flex flex-col gap-1 sm:justify-center">
                  <p className="text-2xs tracking-label text-content-faint">{s.sub}</p>
                  <h2 className="text-base tracking-heading text-content-primary" style={{ fontFamily: "var(--font-cinzel)" }}>
                    {s.title}
                  </h2>
                </div>
                <p className="col-span-2 text-xs leading-relaxed text-content-muted sm:col-span-1 sm:self-center">
                  {s.desc}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <Footer />
    </main>
  );
}
