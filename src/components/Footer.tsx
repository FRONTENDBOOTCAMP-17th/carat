"use client";

import Link from "next/link";
import { useLang } from "@/context/LanguageContext";

export default function Footer() {
  const { t } = useLang();
  const f = t.footer;

  return (
    <footer className="w-full bg-surface-darkest">
      <nav aria-label="Footer navigation" className="max-w-container mx-auto grid grid-cols-2 gap-x-4 gap-y-8 px-4 py-10 sm:grid-cols-4 sm:px-6 lg:gap-x-6 lg:gap-y-10 lg:px-8 lg:py-14">
        <section aria-labelledby="footer-collections" className="w-fit">
          <h2 id="footer-collections" className="mb-5 text-2xs tracking-label text-content-primary">{f.collections}</h2>
          <ul className="space-y-3 text-xs text-content-faint">
            <li><Link href="/essential" className="hover:text-content-primary transition-colors">{f.essentialRing}</Link></li>
            <li><Link href="/best-pieces" className="hover:text-content-primary transition-colors">{f.bestPieces}</Link></li>
            <li><Link href="/collections" className="hover:text-content-primary transition-colors">{f.allCollections}</Link></li>
          </ul>
        </section>

        <section aria-labelledby="footer-explore" className="w-fit">
          <h2 id="footer-explore" className="mb-5 text-2xs tracking-label text-content-primary">{f.explore}</h2>
          <ul className="space-y-3 text-xs text-content-faint">
            <li><Link href="/materials" className="hover:text-content-primary transition-colors">{f.materials}</Link></li>
            <li><Link href="/process" className="hover:text-content-primary transition-colors">{f.process}</Link></li>
            <li><Link href="/archive" className="hover:text-content-primary transition-colors">{f.archive}</Link></li>
          </ul>
        </section>

        <section aria-labelledby="footer-support" className="w-fit">
          <h2 id="footer-support" className="mb-5 text-2xs tracking-label text-content-primary">{f.support}</h2>
          <ul className="space-y-3 text-xs text-content-faint">
            <li><Link href="/faq" className="hover:text-content-primary transition-colors">{f.faq}</Link></li>
            <li><Link href="/shipping" className="hover:text-content-primary transition-colors">{f.shippingReturns}</Link></li>
            <li><Link href="/care-guide" className="hover:text-content-primary transition-colors">{f.careGuide}</Link></li>
          </ul>
        </section>

        <section aria-labelledby="footer-contact" className="w-fit">
          <h2 id="footer-contact" className="mb-5 text-2xs tracking-label text-content-primary">{f.contact}</h2>
          <ul className="space-y-3 text-xs text-content-faint">
            <li><Link href="/contact" className="hover:text-content-primary transition-colors">{f.email}</Link></li>
            <li>
              <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="hover:text-content-primary transition-colors">
                {f.instagram}
              </a>
            </li>
          </ul>
        </section>
      </nav>
    </footer>
  );
}
