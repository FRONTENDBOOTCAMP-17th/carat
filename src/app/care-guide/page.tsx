"use client";

import PageShell from "@/components/PageShell";
import BackButton from "@/components/BackButton";
import { useLang } from "@/context/LanguageContext";

export default function CareGuidePage() {
  const { t } = useLang();
  const p = t.pages.careGuide;

  return (
    <PageShell>
      <section className="flex-1 w-full" aria-labelledby="care-heading">
        <div className="max-w-container mx-auto px-4 pt-12 pb-24 sm:px-6 lg:px-8">
          <nav aria-label={p.backNav}>
            <BackButton href="/" label="PRISME" />
          </nav>

          <header className="mt-10 mb-16">
            <p className="mb-3 text-xs tracking-label text-content-faint font-normal">
              {p.section}
            </p>
            <h1
              id="care-heading"
              className="mb-6 text-4xl sm:text-5xl text-content-primary font-light"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              {p.title}
            </h1>
            <p className="max-w-xl text-xs leading-relaxed text-content-secondary">
              {p.desc}
            </p>
          </header>

          <div className="max-w-2xl space-y-14">
            {p.tips.map((section) => (
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
                      <span className="mt-0.5 shrink-0 text-xs text-surface-input" aria-hidden="true">—</span>
                      <p className="text-xs leading-relaxed text-content-secondary">{tip}</p>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
