"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { ArrowDown } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import {
  ClearColor,
  Lights,
  RingModel,
  useRingNodes,
  useSceneEnvironment,
  useStudioEnvMaps,
  supportsWebGL,
  type MousePos,
} from "@/components/RingScene";

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

// Gentle symmetric ease — smooth accel/decel without the flat, snappy feel of cubic at the ends.
function easeInOutSine(t: number) {
  return -(Math.cos(Math.PI * t) - 1) / 2;
}

function Ring({
  progressRef,
  mouseRef,
  envMap,
}: {
  progressRef: React.RefObject<number>;
  mouseRef: React.RefObject<MousePos>;
  envMap: THREE.Texture;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const tiltRef = useRef<THREE.Group>(null);
  const spinRef = useRef<THREE.Group>(null);
  const rollRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Group>(null);
  const smooth = useRef(0);
  const mouseSmooth = useRef<MousePos>({ x: 0, y: 0 });
  const { viewport } = useThree();
  const nodes = useRingNodes();

  useFrame((state) => {
    if (
      !innerRef.current ||
      !groupRef.current ||
      !tiltRef.current ||
      !spinRef.current ||
      !rollRef.current
    )
      return;
    smooth.current += (progressRef.current - smooth.current) * 0.055;
    const p = smooth.current;
    const t = state.clock.elapsedTime;

    // One graceful journey: hero pose (lower-left, screen-filling) → settled beside ESSENTIAL
    // COLLECTION on the right. Spread across most of the scroll and eased in-out so the move is slow
    // and continuous rather than snapping. j drives position, Z roll and scale together.
    const j = easeInOutSine(Math.min(Math.max((p - 0.05) / 0.85, 0), 1));

    // Gentle position float so it's never dead-still (the turntable spin does most of the work).
    const idleBob = Math.sin(t * 0.5) * 0.03;

    // Scale: fills the screen at the hero, eases down to base size as it travels.
    const baseScale = Math.max(0.4, Math.min(1, viewport.width / 4.0));
    const heroScale = Math.max(baseScale * 2.7, viewport.height / 2.4);
    groupRef.current.scale.setScalar(heroScale + (baseScale - heroScale) * j);

    // Mouse parallax on the OUTER tilt group (screen space) — applied above the roll/pitch below, so
    // "mouse up → ring leans back toward the cursor" stays intuitive no matter how the journey has
    // rolled/pitched the ring. Tilting it shifts which facets catch the bright env panels, so
    // brilliance travels across the stones (they're refraction-based and ignore lights).
    mouseSmooth.current.x +=
      (mouseRef.current.x - mouseSmooth.current.x) * 0.07;
    mouseSmooth.current.y +=
      (mouseRef.current.y - mouseSmooth.current.y) * 0.07;
    tiltRef.current.rotation.x = -mouseSmooth.current.y * 0.12;
    tiltRef.current.rotation.y = mouseSmooth.current.x * 0.18;

    // Scroll-driven turntable around the vertical (Y) axis, applied ABOVE the static roll/lean so the
    // first frame keeps the exact reference composition (spin = 0 there), then the whole ring swings
    // round so the stones turn to face screen-left as it settles.
    spinRef.current.rotation.set(0, j * Math.PI * -0.45, 0);

    // Static first-frame pose (the reference composition): Z roll = diagonal / crown up-right, held
    // through the journey; X lean = look slightly down onto the crown.
    rollRef.current.rotation.set(0, 0, 0.6 + Math.PI);
    innerRef.current.rotation.set(Math.PI * -0.4, 0, 0);

    // Position: hero → settled on the RIGHT, while the gems turn to face left (toward the text) — so
    // the ring sits right of centre looking back across the composition.
    const ringExtent = 1.35 * baseScale;
    const maxPosX = Math.max(0, viewport.width * 0.5 - ringExtent);
    const settledX = Math.min(viewport.width * 0.22, maxPosX);
    groupRef.current.position.x = -0.7 + (settledX + 0.7) * j;
    groupRef.current.position.y =
      -1.2 + (-0.15 * baseScale + 1.2) * j + idleBob;
  });

  return (
    // groupRef: scale + position (scroll) · tiltRef: mouse parallax (screen space) · rollRef: Z roll
    // (scroll) · innerRef: pitch (scroll). Split so parallax sits above the roll/pitch = screen-intuitive.
    <group ref={groupRef}>
      <group ref={tiltRef}>
        <group ref={spinRef}>
          <group ref={rollRef}>
            <group ref={innerRef}>
              <RingModel nodes={nodes} envMap={envMap} />
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}

// Scene lives inside <Canvas> (client-only), so the env map — which touches `document` — is built
// here rather than during SSR. The same studio env feeds both the metal reflections and the gems.
function Scene({
  progressRef,
  mouseRef,
}: {
  progressRef: React.RefObject<number>;
  mouseRef: React.RefObject<MousePos>;
}) {
  const { gemEnv, metalEnv } = useStudioEnvMaps();
  useSceneEnvironment(metalEnv);
  return (
    <>
      <ClearColor />
      <Lights mouseRef={mouseRef} />
      <Ring progressRef={progressRef} mouseRef={mouseRef} envMap={gemEnv} />
    </>
  );
}

export default function Hero() {
  const { t } = useLang();
  const hasWebGL = useMemo(() => supportsWebGL(), []);
  const target = useRef(0);
  const smooth = useRef(0);
  const progressRef = useRef(0);
  const mouseRef = useRef<MousePos>({ x: 0, y: 0 });
  const navRevealedRef = useRef(false);
  const sectionRef = useRef<HTMLElement>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const essentialTextRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  // The ring's per-pixel raytraced refraction has no reason to keep costing a frame budget once the
  // 400vh section has fully scrolled past — without this the Canvas rAF loop (frameloop="always")
  // runs forever for the rest of the page.
  const [inView, setInView] = useState(true);

  // Cheap, always-on: keeps target/mouseRef fresh so the scene doesn't jump when the rAF loop
  // below resumes after re-entering view.
  useEffect(() => {
    const onScroll = () => {
      target.current = window.scrollY / (window.innerHeight * 3);
    };
    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      };
    };
    const onTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      mouseRef.current = {
        x: (touch.clientX / window.innerWidth) * 2 - 1,
        y: -(touch.clientY / window.innerHeight) * 2 + 1,
      };
    };
    window.addEventListener("scroll", onScroll);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "50% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Short cross-fade so the ring's relight on theme toggle reads as an intentional transition
  // rather than a pop, even though the env maps themselves now swap almost instantly.
  useEffect(() => {
    const el = canvasWrapRef.current;
    if (!el) return;
    let timeout: ReturnType<typeof setTimeout>;
    const onThemeChange = () => {
      el.style.opacity = "0";
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        el.style.opacity = "1";
      }, 120);
    };
    const observer = new MutationObserver(onThemeChange);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => {
      observer.disconnect();
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    if (!inView) return;

    let isMobile = window.innerWidth < 640;
    const onResize = () => {
      isMobile = window.innerWidth < 640;
    };
    window.addEventListener("resize", onResize, { passive: true });

    let frame: number;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      if (!navRevealedRef.current) {
        navRevealedRef.current = true;
        window.dispatchEvent(new Event("prisme:nav-reveal"));
      }
    } else {
      const animate = () => {
        smooth.current += (target.current - smooth.current) * 0.08;
        const p = smooth.current;
        progressRef.current = p;
        const heroFade = Math.min(p / 0.3, 1);
        if (overlayRef.current) {
          // Dark mode: a real scrim (0.4). Light mode: a bright scrim on the bright page looks cheap,
          // so keep it barely-there (~5%) and let the (also-reduced) text halo carry legibility.
          const isLight = document.documentElement.dataset.theme === "light";
          overlayRef.current.style.opacity = String(
            heroFade * (isLight ? 0.02 : 0.4),
          );
        }
        if (heroTextRef.current) {
          heroTextRef.current.style.opacity = String(1 - heroFade);
          heroTextRef.current.style.transform = `translateY(${heroFade * -40}px)`;
        }
        if (essentialTextRef.current) {
          const essentialP = Math.min(Math.max((p - 0.6) / 0.25, 0), 1);
          if (essentialP >= 1 && !navRevealedRef.current) {
            navRevealedRef.current = true;
            window.dispatchEvent(new Event("prisme:nav-reveal"));
          }
          const essentialEase = easeOutCubic(essentialP);
          essentialTextRef.current.style.opacity = String(essentialEase);
          essentialTextRef.current.style.transform = `translateX(${isMobile ? 0 : -essentialEase * 20}px)`;
        }
        if (scrollHintRef.current)
          scrollHintRef.current.style.opacity = String(
            Math.max(0, 1 - p / 0.04),
          );
        frame = requestAnimationFrame(animate);
      };
      animate();
    }

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(frame);
    };
  }, [inView]);

  const [desc1, desc2] = t.hero.essentialDesc.split("\n");

  return (
    <section
      ref={sectionRef}
      className="relative h-[400vh] bg-surface-base"
      aria-label={t.hero.sectionLabel}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <div
          ref={canvasWrapRef}
          className="absolute inset-0 transition-opacity duration-300 ease-out"
        >
          {hasWebGL ? (
            <Canvas
              className="absolute inset-0"
              camera={{ position: [0, 0, 4], fov: 45 }}
              // alpha:false → Three.js가 transmission 패스를 흰색으로 클리어하는 milky 버그를 근본 차단.
              // 배경은 ClearColor가 테마별 surface 색으로 채워 화면상 동일하게 유지.
              // powerPreference: hybrid-GPU 노트북에서 브라우저가 내장 GPU를 고르면 이 정도의
              // per-pixel raymarched refraction은 렉이 심해진다 — 디스크리트 GPU를 명시적으로 요청.
              gl={{ alpha: false, powerPreference: "high-performance" }}
              dpr={[1, 2]}
              performance={{ min: 0.5 }}
              frameloop={inView ? "always" : "never"}
              role="img"
              aria-label={t.hero.canvasLabel}
              onCreated={({ gl }) => {
                // Neutral (Khronos PBR Neutral) instead of ACES: ACES rolls off highlights hard,
                // compressing the extreme white↔black contrast that makes the stones & polished metal
                // pop. Neutral preserves that punch — better for product/jewelry.
                gl.toneMapping = THREE.NeutralToneMapping;
                gl.toneMappingExposure = 1.1;
                window.dispatchEvent(new Event("prisme:hero-ready"));
              }}
            >
              <Scene progressRef={progressRef} mouseRef={mouseRef} />
            </Canvas>
          ) : (
            // WebGL unavailable fallback — replace /images/ring-hero.webp with a still render export.
            // 데코레이션용 fallback(WebGL 미지원 시에만 노출)이라 next/image 최적화 대상이 아님.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src="/images/ring-hero.webp"
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none"
            />
          )}
        </div>

        {/* Scrim: a soft radial of the page-surface colour (auto light/dark), strongest behind the
            centred text and fading to transparent before the frame edges — keeps the ring's impact
            at the edges while lifting text contrast. Opacity is scroll-driven in animate(). */}
        <div
          ref={overlayRef}
          className="absolute inset-0"
          style={{
            opacity: 0,
            background:
              "radial-gradient(ellipse 75% 75% at 50% 45%, var(--color-surface-base) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />

        {/* Initial centered hero text */}
        <div
          ref={heroTextRef}
          className="absolute inset-0 flex flex-col items-center justify-center text-content-primary"
          style={{
            textShadow: "var(--hero-text-halo)",
          }}
        >
          <h1
            className="mb-5 text-6xl sm:text-7xl lg:text-8xl font-medium"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            PRISME
          </h1>
          <div className="flex justify-center flex-col">
            <span className="block text-center text-lg">{t.hero.tagline1}</span>
          </div>
        </div>

        {/* Essential Collection overlay */}
        <div
          ref={essentialTextRef}
          className="absolute top-0 bottom-0 left-4 sm:left-[7%] lg:left-[8%] right-4 sm:right-6 lg:right-8 flex flex-col text-content-primary"
          style={{
            opacity: 0,
            textShadow: "var(--hero-text-halo)",
          }}
        >
          <div className="mt-[13vh]">
            <p className="mb-2 sm:mb-3 text-xs tracking-descriptor text-content-secondary">
              {t.hero.collectionLabel}
            </p>
            <h2
              className="mb-8 sm:mb-10 leading-none font-light"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              <span className="block text-4xl sm:text-5xl lg:text-7xl xl:text-8xl">
                {t.hero.essentialLine1}
              </span>
              <span className="block text-4xl sm:text-5xl lg:text-7xl xl:text-8xl pl-4 sm:pl-10 lg:pl-16 xl:pl-20">
                {t.hero.essentialLine2}
              </span>
            </h2>
            <p className="max-w-40 sm:max-w-55 md:max-w-75 text-xs sm:text-sm leading-relaxed text-content-secondary">
              {desc1}
              <br />
              {desc2}
            </p>
          </div>
          <div className="flex-1" />
          <a
            href="/essential"
            className="mb-[10%] text-xs tracking-link text-content-secondary hover:text-content-primary transition-colors"
          >
            {t.hero.cta}
          </a>
        </div>

        {/* Scroll hint */}
        <div
          ref={scrollHintRef}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-content-muted pointer-events-none"
          aria-hidden="true"
        >
          <span className="text-xs tracking-link">{t.hero.scroll}</span>
          <ArrowDown
            size={16}
            strokeWidth={1}
            className="motion-safe:animate-bounce"
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  );
}
