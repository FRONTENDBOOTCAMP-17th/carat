"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import CollectionCard from "./CollectionCard";
import { fadeUp, staggerContainer, transition, viewport } from "@/lib/motion";

const collections = [
  { title: "Ring 01", price: "₩10,000,000" },
  { title: "Ring 01", price: "₩10,000,000" },
  { title: "Ring 01", price: "₩10,000,000" },
  { title: "Ring 01", price: "₩10,000,000" },
  { title: "Ring 01", price: "₩10,000,000" },
];

export default function Collections() {
  return (
    <section className="w-full bg-surface-darkest" aria-labelledby="collections-heading">
      <div className="max-w-container mx-auto px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          transition={transition}
        >
          <p className="mb-3 text-2xs tracking-descriptor text-content-faint">
            현대적인 조형성과 정교한 소재가 만나는 곳,
          </p>
          <p className="mb-3 text-2xs tracking-descriptor text-content-faint">
            PRISME의 컬렉션을 만나보세요.
          </p>
          <h2
            id="collections-heading"
            className="mb-8 text-3xl tracking-heading text-content-primary lg:mb-14 lg:text-4xl"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            COLLECTIONS
          </h2>
        </motion.div>

        <motion.ul
          className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:mb-12 lg:grid-cols-5 lg:gap-6"
          aria-label="컬렉션 목록"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          {collections.map((c, i) => (
            <motion.li
              key={i}
              variants={fadeUp}
              transition={transition}
            >
              <CollectionCard id={`collection-${i}`} title={c.title} price={c.price} />
            </motion.li>
          ))}
        </motion.ul>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          transition={{ ...transition, delay: 0.2 }}
        >
          <Link
            href="/collections"
            className="text-xs tracking-link text-content-muted hover:text-content-primary transition-colors"
          >
            전체 컬렉션 보기 →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
