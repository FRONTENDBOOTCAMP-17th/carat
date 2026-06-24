"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import CollectionCard from "./CollectionCard";
import { fadeUp, staggerContainer, transition, viewport } from "@/lib/motion";
import { getProductsByCategory } from "@/lib/products";
import { useLang } from "@/context/LanguageContext";

export default function Collections() {
  const { lang, t } = useLang();
  const collections = getProductsByCategory("collections", lang).slice(0, 5);
  const s = t.collectionsSection;

  return (
    <section className="w-full bg-surface-darkest" aria-labelledby="collections-heading">
      <div className="max-w-container mx-auto px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport} transition={transition}>
          <p className="mb-3 text-xs tracking-label text-content-faint font-normal">{s.sub}</p>
          <h2 id="collections-heading" className="mb-8 text-3xl tracking-label text-content-primary lg:mb-14 lg:text-4xl" style={{ fontFamily: "var(--font-cinzel)" }}>
            COLLECTIONS
          </h2>
        </motion.div>

        <motion.ul
          className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:mb-12 lg:grid-cols-5 lg:gap-6"
          aria-label={s.listLabel}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          {collections.map((c) => (
            <motion.li key={c.id} variants={fadeUp} transition={transition}>
              <CollectionCard id={c.id} title={c.name} price={c.price} />
            </motion.li>
          ))}
        </motion.ul>

        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport} transition={{ ...transition, delay: 0.2 }}>
          <Link href="/collections" className="text-xs tracking-label text-content-secondary hover:text-content-primary transition-colors">
            {s.viewAll}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
