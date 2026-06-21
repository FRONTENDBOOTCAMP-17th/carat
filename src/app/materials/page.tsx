"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLang } from "@/context/LanguageContext";

export default function MaterialsPage() {
  const { t } = useLang();
  const p = t.pages.materials;
  const [descLine1, descLine2] = p.desc.split("\n");

  return (
    <main id="main-content" className="min-h-screen bg-surface-darkest flex flex-col">
      <Navbar />

      <section className="flex-1 w-full" aria-labelledby="materials-heading">
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
              id="materials-heading"
              className="mb-6 text-4xl sm:text-5xl text-content-primary font-light"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              {p.title}
            </h1>
            <p className="max-w-xl text-xs leading-relaxed text-content-muted">
              {descLine1}
              <br />
              {descLine2}
            </p>
          </header>

          <ul className="grid grid-cols-1 gap-px bg-surface-elevated sm:grid-cols-2 lg:grid-cols-3">
            {p.items.map((m) => (
              <li key={m.sub} className="flex flex-col gap-3 bg-surface-darkest p-8">
                <p className="text-2xs tracking-label text-content-faint">{m.sub}</p>
                <h2 className="text-lg text-content-primary font-light">{m.name}</h2>
                <p className="text-xs leading-relaxed text-content-muted">{m.desc}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Footer />
    </main>
  );
}
