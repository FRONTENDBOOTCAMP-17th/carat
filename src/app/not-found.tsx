"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useLang } from "@/context/LanguageContext";

export default function NotFound() {
  const { t } = useLang();
  const p = t.pages.notFound;
  const [descLine1, descLine2] = p.desc.split("\n");

  return (
    <main id="main-content" className="min-h-screen bg-surface-darkest flex flex-col">
      <Navbar />

      <div className="flex flex-1 flex-col items-center justify-center px-4 text-center">
        <p className="mb-4 text-xs tracking-label text-content-faint font-normal">
          {p.tag}
        </p>
        <h1
          className="mb-6 text-3xl tracking-label text-content-primary sm:text-4xl"
          style={{ fontFamily: "var(--font-cinzel)" }}
        >
          {p.title}
        </h1>
        <p className="mb-10 max-w-sm text-xs leading-relaxed text-content-secondary">
          {descLine1}
          <br />
          {descLine2}
        </p>

        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <Link
            href="/"
            className="text-xs tracking-label text-content-secondary transition-colors hover:text-content-primary"
          >
            {p.home}
          </Link>
          <span className="hidden text-content-faint sm:inline" aria-hidden="true">
            /
          </span>
          <Link
            href="/collections"
            className="text-xs tracking-label text-content-secondary transition-colors hover:text-content-primary"
          >
            {p.collections}
          </Link>
        </div>
      </div>
    </main>
  );
}
