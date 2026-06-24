"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLang } from "@/context/LanguageContext";

export default function ShippingPage() {
  const { t } = useLang();
  const p = t.pages.shipping;

  return (
    <main
      id="main-content"
      className="min-h-screen bg-surface-darkest flex flex-col"
    >
      <Navbar />

      <section className="flex-1 w-full" aria-labelledby="shipping-heading">
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
              id="shipping-heading"
              className="mb-6 text-3xl sm:text-4xl text-content-primary font-light"
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

          <div className="max-w-2xl space-y-14">
            {p.sections.map((sec) => (
              <section key={sec.title} aria-labelledby={`section-${sec.title}`}>
                <h2
                  id={`section-${sec.title}`}
                  className="mb-6 text-xs tracking-label text-content-primary border-b border-surface-elevated pb-4"
                >
                  {sec.title}
                </h2>
                <dl className="space-y-5">
                  {sec.items.map((item) => (
                    <div
                      key={item.label}
                      className="grid grid-cols-[120px_1fr] gap-6 sm:grid-cols-[160px_1fr]"
                    >
                      <dt className="text-xs tracking-normal text-content-primary shrink-0">
                        {item.label}
                      </dt>
                      <dd className="text-xs leading-relaxed text-content-secondary">
                        {item.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
