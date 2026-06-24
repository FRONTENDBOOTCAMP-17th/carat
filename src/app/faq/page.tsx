"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLang } from "@/context/LanguageContext";

export default function FaqPage() {
  const { t } = useLang();
  const p = t.pages.faq;

  return (
    <main
      id="main-content"
      className="min-h-screen bg-surface-darkest flex flex-col"
    >
      <Navbar />

      <section className="flex-1 w-full" aria-labelledby="faq-heading">
        <div className="max-w-container mx-auto px-4 pt-12 pb-24 sm:px-6 lg:px-8">
          <nav aria-label={p.backNav}>
            <Link
              href="/"
              className="text-xs tracking-label text-content-secondary hover:text-content-primary transition-colors"
            >
              ← PRISME
            </Link>
          </nav>

          <header className="mt-10 mb-16">
            <p className="mb-3 text-xs tracking-label text-content-faint font-normal">
              {p.section}
            </p>
            <h1
              id="faq-heading"
              className="mb-6 text-4xl sm:text-5xl text-content-primary font-light"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              {p.title}
            </h1>
            <p className="max-w-xl text-xs leading-relaxed text-content-secondary">
              {p.intro}{" "}
              <Link
                href="/contact"
                className="underline underline-offset-2 hover:text-content-primary transition-colors"
              >
                {p.introLink}
              </Link>{" "}
              {p.introSuffix}
            </p>
          </header>

          <div className="max-w-2xl divide-y divide-surface-elevated">
            {p.items.map((faq, i) => (
              <details key={i} className="group py-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 [&::-webkit-details-marker]:hidden [&::marker]:hidden">
                  <span className="text-sm text-content-primary">{faq.q}</span>
                  <span
                    className="shrink-0 flex items-center justify-center size-11 text-lg leading-none text-content-faint transition-transform duration-200 group-open:rotate-45"
                    aria-hidden="true"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-4 text-xs leading-relaxed text-content-secondary">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
