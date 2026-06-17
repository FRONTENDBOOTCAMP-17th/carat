"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import ProductCard from "./ProductCard";
import { fadeUp, staggerContainer, transition, viewport } from "@/lib/motion";

const products = [
  { name: "Ring 01", category: "RING", price: "₩10,000,000" },
  { name: "Ring 01", category: "RING", price: "₩10,000,000" },
  { name: "Ring 01", category: "RING", price: "₩10,000,000" },
  { name: "Ring 01", category: "RING", price: "₩10,000,000" },
  { name: "Ring 01", category: "RING", price: "₩10,000,000" },
];

export default function BestPieces() {
  return (
    <section className="w-full bg-surface-darkest" aria-labelledby="best-pieces-heading">
      <div className="max-w-container mx-auto px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          transition={transition}
        >
          <p className="mb-3 text-2xs tracking-descriptor text-content-faint">
            가장 많은 사랑을 받은,
          </p>
          <p className="mb-3 text-2xs tracking-descriptor text-content-faint">
            PRISME의 시그니처 피스입니다.
          </p>
          <h2
            id="best-pieces-heading"
            className="mb-8 text-3xl tracking-heading text-content-primary lg:mb-14 lg:text-4xl"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            BEST PIECES
          </h2>
        </motion.div>

        <motion.ul
          className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:mb-12 lg:grid-cols-5 lg:gap-6"
          aria-label="베스트 상품 목록"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          {products.map((p, i) => (
            <motion.li
              key={i}
              variants={fadeUp}
              transition={transition}
            >
              <ProductCard id={`best-${i}`} name={p.name} category={p.category} price={p.price} />
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
            href="/best-pieces"
            className="text-xs tracking-link text-content-muted hover:text-content-primary transition-colors"
          >
            전체 상품 보기 →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
