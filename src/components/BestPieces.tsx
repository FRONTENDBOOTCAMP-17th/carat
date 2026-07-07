"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import ProductCard from "./ProductCard";
import { fadeUp, staggerContainer, transition, viewport } from "@/lib/motion";
import { getProductsByCategory } from "@/lib/products";
import { useLang } from "@/context/LanguageContext";

export default function BestPieces() {
  const { lang, t } = useLang();
  const products = getProductsByCategory("best-pieces", lang).slice(0, 5);
  const s = t.bestPiecesSection;

  return (
    <section className="w-full bg-surface-darkest" aria-labelledby="best-pieces-heading">
      <div className="max-w-container mx-auto px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport} transition={transition}>
          <h2 id="best-pieces-heading" className="mb-3 text-3xl tracking-label text-content-primary lg:text-4xl" style={{ fontFamily: "var(--font-cinzel)" }}>
            BEST PIECES
          </h2>
          <p className="mb-8 text-xs tracking-label text-content-faint font-normal lg:mb-14">{s.sub}</p>
        </motion.div>

        <motion.ul
          className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:mb-12 lg:grid-cols-5 lg:gap-6"
          aria-label={s.listLabel}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          {products.map((p) => (
            <motion.li key={p.id} variants={fadeUp} transition={transition}>
              <ProductCard id={p.id} name={p.name} />
            </motion.li>
          ))}
        </motion.ul>

        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport} transition={{ ...transition, delay: 0.2 }}>
          <Link href="/best-pieces" className="text-xs tracking-label text-content-secondary hover:text-content-primary transition-colors">
            {s.viewAll}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
