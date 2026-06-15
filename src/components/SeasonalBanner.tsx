import Link from "next/link";

export default function SeasonalBanner() {
  return (
    <section className="relative w-full aspect-4/3 overflow-hidden bg-zinc-900" aria-label="2026 F/W 컬렉션 배너">
      {/* Background image */}
      <img
        src="/images/fw-2026.jpg"
        className="absolute inset-0 h-full w-full object-cover aspect-square"
        alt="2026 F/W Collection"
      />

      <div className="absolute inset-0 bg-black/50" aria-hidden="true" />

      {/* Content */}
      <div className="relative z-10 flex h-full justify-center">
        <div className="w-full max-w-[1440px] flex flex-col gap-y-180 py-32">
          <h2
            className=" text-white text-5xl"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            2026 F/W COLLECTIONS
          </h2>

          <div className="flex flex-col items-start">
            <p className="mb-6 max-w-2xl text-sm leading-relaxed text-white/60">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim
              ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
              aliquip ex ea commodo consequat.
            </p>
            <Link
              href="/fw-collections"
              className="text-xs tracking-[0.3em] text-white/80 transition-colors hover:text-white"
            >
              더 알아보기 &gt;
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
