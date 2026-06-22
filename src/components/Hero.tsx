"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useLang } from "@/context/LanguageContext";

// Returns false during SSR (window absent) — treated as "supported" until client confirms otherwise.
function supportsWebGL(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

type MousePos = { x: number; y: number };

function Lights({ mouseRef }: { mouseRef: React.RefObject<MousePos> }) {
  const keyRef = useRef<THREE.PointLight>(null);
  const rimMainRef = useRef<THREE.PointLight>(null);
  const rimSideRef = useRef<THREE.PointLight>(null);
  const smooth = useRef<MousePos>({ x: 0, y: 0 });

  useFrame(() => {
    smooth.current.x += (mouseRef.current.x - smooth.current.x) * 0.06;
    smooth.current.y += (mouseRef.current.y - smooth.current.y) * 0.06;
    const mx = smooth.current.x;
    const my = smooth.current.y;
    keyRef.current?.position.set(-2.5 + mx * 2, 4 + my * 2, 2);
    rimMainRef.current?.position.set(-mx * 1.5, 2 - my * 0.5, -4);
    rimSideRef.current?.position.set(2 - mx * 0.8, 1 + my * 0.3, -3);
  });

  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight
        ref={keyRef}
        position={[-2.5, 4, 2]}
        intensity={30}
        color="#ffffff"
      />
      <pointLight position={[3, 0, 2]} intensity={1.2} color="#c8d8ff" />
      <pointLight
        ref={rimMainRef}
        position={[0, 2, -4]}
        intensity={20}
        color="#ffffff"
      />
      <pointLight
        ref={rimSideRef}
        position={[2, 1, -3]}
        intensity={10}
        color="#ddeeff"
      />
    </>
  );
}

function Ring({ progressRef }: { progressRef: React.RefObject<number> }) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const smooth = useRef(0);
  const { viewport } = useThree();

  useFrame(() => {
    if (!meshRef.current || !groupRef.current) return;
    smooth.current += (progressRef.current - smooth.current) * 0.06;
    const p = smooth.current;
    const revealP = easeOutCubic(Math.min(Math.max(p / 0.55, 0), 1));
    const moveP = easeOutCubic(Math.min(Math.max((p - 0.5) / 0.4, 0), 1));
    // 회전: 초기엔 가파르게 누운 각도 → 정면에 가까운 각도
    const rotX = Math.PI * -0.78 - revealP * Math.PI * 0.3;
    const rotY = revealP * Math.PI * 0.1 + moveP * Math.PI * 0.12;
    // 화면 평면(시선축) 기울기 — 양수 = 반시계. group에 적용해야 보임
    const tiltZ = 0.6 + Math.sin(revealP * Math.PI) * 0.06;
    // 크기: 초기엔 화면 가득(heroScale) → 기준 크기(baseScale)로 축소
    const baseScale = Math.max(0.4, Math.min(1, viewport.width / 4.0));
    const heroScale = Math.max(baseScale * 1.8, viewport.height / 3.0);
    const scale = heroScale + (baseScale - heroScale) * revealP;
    // 이동: 축소가 끝난 뒤(baseScale 기준) 오른쪽으로 이동
    const ringExtent = 1.35 * baseScale;
    const maxPosX = Math.max(0, viewport.width * 0.5 - ringExtent);
    const posX = Math.min(moveP * viewport.width * 0.3, maxPosX);
    // 초기 세로 위치 보정: 화면 가득일 때 아래로 내려 중앙에 맞춤 → revealP 진행 시 0으로
    const heroOffsetY = -1.2 * (1 - revealP);
    const posY = heroOffsetY - moveP * 0.15 * baseScale;
    // 반지 포즈(눕힘/좌우)는 mesh에
    meshRef.current.rotation.x = rotX;
    meshRef.current.rotation.y = rotY;
    // 화면 평면 기울기·크기·위치는 group에
    groupRef.current.rotation.z = tiltZ;
    groupRef.current.scale.setScalar(scale);
    groupRef.current.position.x = posX;
    groupRef.current.position.y = posY;
  });

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef}>
        <torusGeometry args={[1, 0.4, 64, 128]} />
        {/* dithering: Three.js built-in Bayer 4×4 — eliminates quantization bands at near-zero cost */}
        <meshStandardMaterial
          metalness={0.95}
          roughness={0.06}
          color="#ffffff"
          dithering
        />
      </mesh>
    </group>
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
  const overlayRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const essentialTextRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);

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
    let isMobile = window.innerWidth < 640;
    const onResize = () => {
      isMobile = window.innerWidth < 640;
    };
    window.addEventListener("scroll", onScroll);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    onScroll();

    let frame: number;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      window.dispatchEvent(new Event("prisme:nav-reveal"));
    } else {
      const animate = () => {
        smooth.current += (target.current - smooth.current) * 0.08;
        const p = smooth.current;
        progressRef.current = p;
        const heroFade = Math.min(p / 0.3, 1);
        if (overlayRef.current) {
          const isLight = document.documentElement.dataset.theme === "light";
          overlayRef.current.style.opacity = isLight
            ? "0"
            : String(heroFade * 0.4);
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
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(frame);
    };
  }, []);

  const [desc1, desc2] = t.hero.essentialDesc.split("\n");

  return (
    <section
      className="relative h-[400vh] bg-surface-base"
      aria-label={t.hero.sectionLabel}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {hasWebGL ? (
          <Canvas
            className="absolute inset-0"
            camera={{ position: [0, 0, 4], fov: 45 }}
            gl={{ alpha: true }}
            dpr={[1, 2]}
            performance={{ min: 0.5 }}
            role="img"
            aria-label={t.hero.canvasLabel}
            onCreated={({ gl }) => {
              gl.toneMapping = THREE.ACESFilmicToneMapping;
              gl.toneMappingExposure = 1.2;
              window.dispatchEvent(new Event("prisme:hero-ready"));
            }}
          >
            <Lights mouseRef={mouseRef} />
            <Ring progressRef={progressRef} />
          </Canvas>
        ) : (
          // WebGL unavailable fallback — replace /images/ring-hero.webp with a still render export
          <img
            src="/images/ring-hero.webp"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-contain pointer-events-none"
          />
        )}

        <div
          ref={overlayRef}
          className="absolute inset-0 bg-surface-base"
          style={{ opacity: 0 }}
          aria-hidden="true"
        />

        {/* Initial centered hero text */}
        <div
          ref={heroTextRef}
          className="absolute inset-0 flex flex-col items-center justify-center text-content-primary"
        >
          <h1
            className="mb-5 text-5xl sm:text-6xl lg:text-7xl font-medium"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            PRISME
          </h1>
          <div className="flex justify-center flex-col">
            <span className="block text-center">{t.hero.tagline1}</span>
          </div>
        </div>

        {/* Essential Collection overlay */}
        <div
          ref={essentialTextRef}
          className="absolute top-0 bottom-0 left-4 sm:left-[7%] lg:left-[8%] right-4 sm:right-6 lg:right-8 flex flex-col text-content-primary"
          style={{ opacity: 0 }}
        >
          <div className="mt-[13vh]">
            <p className="mb-2 sm:mb-3 text-2xs tracking-descriptor text-content-secondary">
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
            className="mb-[10%] text-2xs sm:text-xs tracking-link text-content-secondary hover:text-content-primary transition-colors"
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
          <span className="text-2xs tracking-link">{t.hero.scroll}</span>
          <svg
            width="14"
            height="20"
            viewBox="0 0 14 22"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="motion-safe:animate-bounce"
          >
            <line x1="7" y1="0" x2="7" y2="16" />
            <polyline points="2,12 7,17 12,12" />
          </svg>
        </div>
      </div>
    </section>
  );
}
