"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import bannerImage from "../../public/images/SeasonalBanner.webp";
import { fadeUp, transition, viewport } from "@/lib/motion";
import { useLang } from "@/context/LanguageContext";

export default function SeasonalBanner() {
  const { t } = useLang();
  const s = t.seasonalBanner;
  const [descLine1, descLine2] = s.desc.split("\n");

  return (
    <section className="relative w-full aspect-3/4 md:aspect-4/3 overflow-hidden bg-surface-raised" aria-label={s.sectionLabel}>
      <Image
        src={bannerImage}
        alt={s.imageAlt}
        fill
        className="object-cover"
        priority
        sizes="100vw"
        placeholder="blur"
        quality={85}
      />
      <div className="absolute inset-0 dark:bg-surface-overlay" aria-hidden="true" />

      <div className="relative z-10 flex h-full justify-center">
        <div className="w-full max-w-container flex flex-col justify-between px-4 py-12 sm:px-6 lg:px-8 lg:py-32">
          <motion.h2
            className="text-content-primary text-2xl sm:text-3xl lg:text-5xl"
            style={{ fontFamily: "var(--font-cinzel)" }}
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport} transition={transition}
          >
            2026 F/W COLLECTIONS
          </motion.h2>

          <motion.div
            className="flex flex-col items-start"
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport}
            transition={{ ...transition, delay: 0.15 }}
          >
            <p className="mb-6 max-w-2xl text-sm leading-relaxed text-content-secondary">
              {descLine1}<br />{descLine2}
            </p>
            <Link href="/fw-collections" className="text-xs tracking-label text-content-secondary transition-colors hover:text-content-primary">
              {s.cta}
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
