"use client";

import Link from "next/link";
import PageShell from "@/components/PageShell";
import BackButton from "@/components/BackButton";
import { useLang } from "@/context/LanguageContext";

export default function ArchivePage() {
  const { t } = useLang();
  const p = t.pages.archive;

  return (
    <PageShell>
      <section className="flex-1 w-full" aria-labelledby="archive-heading">
        <div className="max-w-container mx-auto px-4 pt-12 pb-24 sm:px-6 lg:px-8">
          <nav aria-label={p.backNav}>
            <BackButton href="/" label="PRISME" />
          </nav>

          <header className="mt-10 mb-16">
            <p className="mb-3 text-xs tracking-label text-content-faint font-normal">
              {p.section}
            </p>
            <h1
              id="archive-heading"
              className="mb-6 text-4xl sm:text-5xl text-content-primary font-light"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              {p.title}
            </h1>
            <p className="max-w-xl text-xs leading-relaxed text-content-secondary">
              {p.desc}
            </p>
          </header>

          <ul className="divide-y divide-surface-elevated" aria-label={p.listLabel}>
            {p.seasons.map((s) => (
              <li key={`${s.year}-${s.season}`} className="group py-10">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-12">
                  <div className="shrink-0 sm:w-28">
                    <p className="text-xs tracking-label text-content-faint font-normal">{s.year} {s.season}</p>
                  </div>

                  <div className="flex flex-1 flex-col gap-3">
                    <div className="flex items-center gap-4">
                      <h2
                        className={`text-xl tracking-label leading-none ${s.status === "current" ? "text-content-primary" : "text-content-faint"}`}
                        style={{ fontFamily: "var(--font-cinzel)" }}
                      >
                        {s.name}
                      </h2>
                      {s.status === "current" && (
                        <span className="text-xs tracking-label text-content-faint font-normal border border-surface-elevated px-2 py-0.5">
                          {p.now}
                        </span>
                      )}
                    </div>
                    <p className={`max-w-xl text-xs leading-relaxed ${s.status === "current" ? "text-content-secondary" : "text-content-faint"}`}>{s.desc}</p>
                    {s.href ? (
                      <Link
                        href={s.href}
                        className="mt-1 self-start text-xs tracking-label font-medium text-content-secondary hover:text-content-primary transition-colors"
                      >
                        {p.viewCollection}
                      </Link>
                    ) : (
                      <span className="mt-1 text-xs tracking-label text-content-faint font-medium">
                        {p.closed}
                      </span>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

    </PageShell>
  );
}
