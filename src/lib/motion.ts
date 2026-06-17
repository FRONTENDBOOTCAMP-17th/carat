import type { Variants, Transition, UseInViewOptions } from "framer-motion";

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

export const transition: Transition = { duration: 0.65, ease: "easeOut" };

export const viewport: UseInViewOptions = { once: true, margin: "-60px" };
