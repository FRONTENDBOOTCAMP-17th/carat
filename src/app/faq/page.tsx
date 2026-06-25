"use client";

import { useState } from "react";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BackButton from "@/components/BackButton";
import { useLang } from "@/context/LanguageContext";

function FaqItem({ q, a, id }: { q: string; a: string; id: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="py-6">
      <button
        className="flex w-full items-center justify-between gap-6 text-left"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={id}
      >
        <span className="text-sm text-content-primary">{q}</span>
        <span
          className={`shrink-0 flex items-center justify-center size-11 text-lg leading-none text-content-faint transition-transform duration-[450ms] ${open ? "rotate-45" : ""}`}
          aria-hidden="true"
        >
          +
        </span>
      </button>
      <div
        id={id}
        className={`grid transition-[grid-template-rows] duration-[450ms] ease-in-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden">
          <p className="mt-4 text-xs leading-relaxed text-content-secondary">{a}</p>
        </div>
      </div>
    </div>
  );
}

export default function FaqPage() {
  const { t } = useLang();
  const p = t.pages.faq;

  return (
    <PageShell>
      <section className="flex-1 w-full" aria-labelledby="faq-heading">
        <div className="max-w-container mx-auto px-4 pt-12 pb-24 sm:px-6 lg:px-8">
          <nav aria-label={p.backNav}>
            <BackButton href="/" label="PRISME" />
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
              <FaqItem key={i} q={faq.q} a={faq.a} id={`faq-${i}`} />
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
