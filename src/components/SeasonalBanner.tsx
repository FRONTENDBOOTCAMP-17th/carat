export default function SeasonalBanner() {
  return (
    <section className="w-full bg-black">
      <div className="relative mx-auto aspect-square w-full max-w-[1920px]">
        <div className="absolute inset-0 bg-zinc-900" />
        <img src="/images/fw-2026.jpg" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/40" />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <h2 className="text-center text-6xl font-light tracking-[0.2em]">
            2026 F/W
            <br />
            COLLECTION
          </h2>
        </div>
      </div>
    </section>
  );
}
