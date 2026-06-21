"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLang } from "@/context/LanguageContext";

export default function ProcessPage() {
  const { t } = useLang();
  const p = t.pages.process;

  return (
    <main id="main-content" className="min-h-screen bg-surface-darkest flex flex-col">
      <Navbar />

      <section className="flex-1 w-full" aria-labelledby="process-heading">
        <div className="max-w-container mx-auto px-4 pt-12 pb-24 sm:px-6 lg:px-8">
          <nav aria-label={p.backNav}>
            <Link
              href="/"
              className="text-2xs tracking-link text-content-subtle hover:text-content-primary transition-colors"
            >
              ← PRISME
            </Link>
          </nav>

          <header className="mt-10 mb-16">
            <p className="mb-3 text-2xs tracking-descriptor text-content-faint">
              {p.section}
            </p>
            <h1
              id="process-heading"
              className="mb-6 text-4xl sm:text-5xl text-content-primary font-light"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              {p.title}
            </h1>
            <p className="max-w-xl text-xs leading-relaxed text-content-muted">
              {p.desc}
            </p>
          </header>

          <ol className="space-y-px" aria-label={p.listLabel}>
            {p.steps.map((s) => (
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
