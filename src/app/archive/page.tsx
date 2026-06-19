import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const SEASONS = [
  {
    year: "2026",
    season: "F/W",
    name: "COLLECTIONS",
    desc: "현대적인 조형성과 정교한 소재가 만나는 PRISME의 2026 가을·겨울 컬렉션. 계절의 깊이를 담아낸 시그니처 피스들.",
    href: "/fw-collections",
    status: "current",
  },
  {
    year: "2026",
    season: "S/S",
    name: "FORME",
    desc: "빛과 형태의 관계를 탐구한 컬렉션. 기하학적 구조 위에 유기적인 선을 더해, 착용자의 움직임에 따라 변화하는 작품들을 선보였습니다.",
    href: null,
    status: "closed",
  },
  {
    year: "2025",
    season: "F/W",
    name: "LUMIÈRE",
    desc: "빛의 굴절과 산란에서 영감을 받아, 금속 표면의 마감 방식만으로 빛의 다양한 표정을 담아낸 시즌 컬렉션입니다.",
    href: null,
    status: "closed",
  },
  {
    year: "2025",
    season: "S/S",
    name: "ÉCLAT",
    desc: "여백의 미를 주제로, 최소한의 선과 면으로 구성된 데뷔 컬렉션. PRISME의 미학적 언어가 처음으로 제시된 시즌입니다.",
    href: null,
    status: "closed",
  },
];

export default function ArchivePage() {
  return (
    <main id="main-content" className="min-h-screen bg-surface-darkest flex flex-col">
      <Navbar />

      <section className="flex-1 w-full" aria-labelledby="archive-heading">
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
              id="archive-heading"
              className="mb-6 text-4xl sm:text-5xl text-content-primary font-light"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              ARCHIVE
            </h1>
            <p className="max-w-xl text-xs leading-relaxed text-content-muted">
              PRISME가 걸어온 시즌별 컬렉션의 기록입니다.
            </p>
          </header>

          <ul className="divide-y divide-surface-elevated" aria-label="시즌 목록">
            {SEASONS.map((s) => (
              <li key={`${s.year}-${s.season}`} className="group py-10">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-12">
                  <div className="shrink-0 sm:w-28">
                    <p className="text-2xs tracking-label text-content-faint">{s.year} {s.season}</p>
                  </div>

                  <div className="flex flex-1 flex-col gap-3">
                    <div className="flex items-center gap-4">
                      <h2
                        className="text-xl tracking-heading text-content-primary"
                        style={{ fontFamily: "var(--font-cinzel)" }}
                      >
                        {s.name}
                      </h2>
                      {s.status === "current" && (
                        <span className="text-2xs tracking-label text-content-faint border border-surface-elevated px-2 py-0.5">
                          NOW
                        </span>
                      )}
                    </div>
                    <p className="max-w-xl text-xs leading-relaxed text-content-muted">{s.desc}</p>
                    {s.href ? (
                      <Link
                        href={s.href}
                        className="mt-1 self-start text-xs tracking-link text-content-subtle hover:text-content-primary transition-colors"
                      >
                        컬렉션 보기 →
                      </Link>
                    ) : (
                      <span className="mt-1 text-2xs tracking-link text-surface-input">
                        종료된 컬렉션
                      </span>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Footer />
    </main>
  );
}
