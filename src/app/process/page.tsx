"use client";

import PageShell from "@/components/PageShell";
import BackButton from "@/components/BackButton";
import { useLang } from "@/context/LanguageContext";

export default function ProcessPage() {
  const { t, lang } = useLang();
  const p = t.pages.process;

  return (
    <PageShell>
      <section className="flex-1 w-full" aria-labelledby="process-heading">
        <div className="max-w-container mx-auto px-4 pt-12 pb-24 sm:px-6 lg:px-8">
          <nav aria-label={p.backNav}>
            <BackButton href="/" label="PRISME" />
          </nav>

          <header className="mt-10 mb-16">
            <p className="mb-3 text-xs tracking-label text-content-faint font-normal">
              {p.section}
            </p>
            <h1
              id="process-heading"
              className="mb-6 text-4xl sm:text-5xl text-content-primary font-light"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              {p.title}
            </h1>
            <p className="max-w-xl text-xs leading-relaxed text-content-secondary">
              {p.desc}
            </p>
          </header>

          <ol className="divide-y divide-surface-darkest" aria-label={p.listLabel}>
            {p.steps.map((s) => (
              <li
                key={s.step}
                className="grid grid-cols-1 gap-4 bg-surface-raised px-8 py-10 sm:grid-cols-[200px_1fr] sm:items-start sm:gap-12"
              >
                <div className="flex flex-col gap-1">
                  <p className="text-xs tracking-label text-content-faint font-medium" lang={lang === "ko" ? "en" : "ko"}>{s.step}. {s.sub}</p>
                  <h2 className="text-base tracking-label text-content-primary" style={{ fontFamily: "var(--font-cinzel)" }}>
                    {s.title}
                  </h2>
                </div>
                <p className="text-sm leading-relaxed text-content-secondary self-start">
                  {s.desc}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </PageShell>
  );
}
