"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/context/LanguageContext";

const MIN_DISPLAY_MS = 1600;
const CANVAS_TIMEOUT_MS = 8000;

export default function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const { t } = useLang();

  useEffect(() => {
    const isHomepage = window.location.pathname === "/";
    let fallbackTimer: ReturnType<typeof setTimeout>;
    let cancelled = false;

    const minDelay = new Promise<void>((r) => setTimeout(r, MIN_DISPLAY_MS));
    const canvasReady = isHomepage
      ? new Promise<void>((r) => {
          fallbackTimer = setTimeout(r, CANVAS_TIMEOUT_MS);
          window.addEventListener("prisme:hero-ready", () => { clearTimeout(fallbackTimer); r(); }, { once: true });
        })
      : Promise.resolve();

    Promise.all([minDelay, canvasReady]).then(() => {
      if (!cancelled) setIsVisible(false);
    });

    return () => { cancelled = true; clearTimeout(fallbackTimer); };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[200] bg-surface-base flex flex-col items-center justify-center"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          aria-label={t.loading.label}
          aria-live="polite"
        >
          <motion.p
            className="text-content-primary text-2xl mb-4"
            style={{ fontFamily: "var(--font-cinzel)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            PRISME
          </motion.p>
          <div className="w-36 h-px bg-surface-elevated overflow-hidden">
            <motion.div
              className="h-full bg-content-primary"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
