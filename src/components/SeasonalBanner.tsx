import Image from "next/image";
import Link from "next/link";

export default function SeasonalBanner() {
  return (
    <section className="relative w-full aspect-video md:aspect-4/3 overflow-hidden bg-surface-raised" aria-label="2026 F/W 컬렉션 배너">
      <Image
        src="/images/fw-2026.jpg"
        alt="2026 F/W 시즌 컬렉션"
        fill
        className="object-cover"
        priority
      />

      <div className="absolute inset-0 bg-surface-overlay" aria-hidden="true" />

      {/* Content */}
      <div className="relative z-10 flex h-full justify-center">
        <div className="w-full max-w-container flex flex-col justify-between px-4 py-12 sm:px-6 lg:px-8 lg:py-32">
          <h2
            className="text-content-primary text-2xl sm:text-3xl lg:text-5xl"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            2026 F/W COLLECTIONS
          </h2>

          <div className="flex flex-col items-start">
            <p className="mb-6 max-w-2xl text-sm leading-relaxed text-content-muted">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim
              ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
              aliquip ex ea commodo consequat.
            </p>
            <Link
              href="/fw-collections"
              className="text-xs tracking-link text-content-secondary transition-colors hover:text-content-primary"
            >
              더 알아보기 &gt;
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
