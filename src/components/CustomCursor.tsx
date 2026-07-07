"use client";

import { useEffect, useRef } from "react";

const SCALE_DEFAULT = 1;
const SCALE_HOVER = 30 / 28; // ≈ 1.071
const DEAD_ZONE = 10; // px — 이 반경 이내에서는 스크롤 안 함
const MAX_SPEED = 20; // 프레임당 px

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const autoScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    const autoScroll = autoScrollRef.current;
    if (!dot || !ring || !autoScroll) return;

    const isFirefox = navigator.userAgent.includes("Firefox");
    const isPointerFine = window.matchMedia("(pointer: fine)").matches;
    // Firefox는 중간 휠 클릭 오토스크롤을 브라우저가 네이티브로 가로채므로,
    // 커스텀 오토스크롤 커서와 충돌한다. 터치/펜 디바이스도 불필요하므로 제외.
    if (isFirefox || !isPointerFine) return;

    document.documentElement.classList.add("has-custom-cursor");

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const halfDot = dot.offsetWidth / 2;
    const halfRing = ring.offsetWidth / 2;
    const halfAuto = autoScroll.offsetWidth / 2;

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    let currentScale = SCALE_DEFAULT;
    let targetScale = SCALE_DEFAULT;
    let rafId: number;
    let scrollRafId: number;
    let initialized = false;
    let wasHovering = false;
    let isAutoScrolling = false;
    let originY = 0;

    const showNormalCursors = () => {
      if (!initialized) return;
      dot.style.opacity = "1";
      ring.style.opacity = "1";
    };

    const hideNormalCursors = () => {
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };

    const stopAutoScroll = () => {
      isAutoScrolling = false;
      cancelAnimationFrame(scrollRafId);
      autoScroll.style.opacity = "0";
      autoScroll.removeAttribute("data-up");
      autoScroll.removeAttribute("data-down");
      showNormalCursors();
    };

    const startAutoScroll = (x: number, y: number) => {
      originY = y;
      isAutoScrolling = true;
      autoScroll.style.transform = `translate(${x - halfAuto}px, ${y - halfAuto}px)`;
      autoScroll.style.opacity = "1";
      hideNormalCursors();

      const scrollLoop = () => {
        if (!isAutoScrolling) return;
        const dy = mouseY - originY;

        autoScroll.toggleAttribute("data-up", dy < -DEAD_ZONE);
        autoScroll.toggleAttribute("data-down", dy > DEAD_ZONE);

        const vy = Math.abs(dy) > DEAD_ZONE
          ? Math.sign(dy) * Math.min((Math.abs(dy) - DEAD_ZONE) * 0.08, MAX_SPEED)
          : 0;

        window.scrollBy(0, vy);
        scrollRafId = requestAnimationFrame(scrollLoop);
      };

      scrollRafId = requestAnimationFrame(scrollLoop);
    };

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX - halfDot}px, ${mouseY - halfDot}px)`;
      if (!initialized) {
        initialized = true;
        if (!isAutoScrolling) {
          dot.style.opacity = "1";
          ring.style.opacity = "1";
        }
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

    const onMouseDown = (e: MouseEvent) => {
      if (isAutoScrolling) {
        stopAutoScroll();
        // 중간 휠로 종료 시 새 auto-scroll 시작 안 함
        if (e.button === 1) return;
      }
      if (e.button === 1) {
        e.preventDefault();
        startAutoScroll(e.clientX, e.clientY);
      }
    };

    const onKeyDown = () => {
      if (isAutoScrolling) stopAutoScroll();
    };

    const animate = () => {
      if (reducedMotion) {
        ringX = mouseX;
        ringY = mouseY;
        currentScale = targetScale;
      } else {
        const dx = mouseX - ringX;
        const dy = mouseY - ringY;
        const ds = targetScale - currentScale;
        ringX = Math.abs(dx) < 0.08 ? mouseX : ringX + dx * 0.12;
        ringY = Math.abs(dy) < 0.08 ? mouseY : ringY + dy * 0.12;
        currentScale = Math.abs(ds) < 0.0008 ? targetScale : currentScale + ds * 0.15;
      }

      ring.style.transform = `translate(${ringX - halfRing}px, ${ringY - halfRing}px) scale(${currentScale})`;
      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      cancelAnimationFrame(rafId);
      cancelAnimationFrame(scrollRafId);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("keydown", onKeyDown);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" style={{ opacity: 0 }} aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" style={{ opacity: 0 }} aria-hidden="true" />
      <div ref={autoScrollRef} className="cursor-autoscroll" style={{ opacity: 0 }} aria-hidden="true">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="2.5" fill="currentColor" />
          <g data-dir="up">
            <line x1="12" y1="9" x2="12" y2="4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <polyline points="9.5,7 12,4.5 14.5,7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </g>
          <g data-dir="down">
            <line x1="12" y1="15" x2="12" y2="19.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <polyline points="9.5,17 12,19.5 14.5,17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </g>
        </svg>
      </div>
    </>
  );
}
