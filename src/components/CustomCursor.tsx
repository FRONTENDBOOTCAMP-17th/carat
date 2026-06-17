"use client";

import { useEffect, useRef } from "react";

const SCALE_DEFAULT = 1;
const SCALE_HOVER = 30 / 28; // ≈ 1.071

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    document.documentElement.classList.add("has-custom-cursor");

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const halfDot = dot.offsetWidth / 2;
    const halfRing = ring.offsetWidth / 2;

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    let currentScale = SCALE_DEFAULT;
    let targetScale = SCALE_DEFAULT;
    let rafId: number;
    let initialized = false;
    let wasHovering = false;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX - halfDot}px, ${mouseY - halfDot}px)`;
      if (!initialized) {
        initialized = true;
        dot.style.opacity = "1";
        ring.style.opacity = "1";
      }
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isHovering = !!target.closest("a, button, [role='button']");
      if (isHovering !== wasHovering) {
        wasHovering = isHovering;
        targetScale = isHovering ? SCALE_HOVER : SCALE_DEFAULT;
        // border-color 전환은 CSS transition에 위임
        ring.classList.toggle("is-hover", isHovering);
      }
    };

    const animate = () => {
      if (reducedMotion) {
        ringX = mouseX;
        ringY = mouseY;
        currentScale = targetScale;
      } else {
        ringX += (mouseX - ringX) * 0.12;
        ringY += (mouseY - ringY) * 0.12;
        currentScale += (targetScale - currentScale) * 0.15;
      }

      ring.style.transform = `translate(${ringX - halfRing}px, ${ringY - halfRing}px) scale(${currentScale})`;
      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="cursor-dot"
        style={{ opacity: 0 }}
        aria-hidden="true"
      />
      <div
        ref={ringRef}
        className="cursor-ring"
        style={{ opacity: 0 }}
        aria-hidden="true"
      />
    </>
  );
}
