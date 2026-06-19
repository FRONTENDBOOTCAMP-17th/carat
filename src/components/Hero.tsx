"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

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
      <pointLight ref={keyRef} position={[-2.5, 4, 2]} intensity={30} color="#ffffff" />
      <pointLight position={[3, 0, 2]} intensity={1.2} color="#c8d8ff" />
      <pointLight ref={rimMainRef} position={[0, 2, -4]} intensity={20} color="#ffffff" />
      <pointLight ref={rimSideRef} position={[2, 1, -3]} intensity={10} color="#ddeeff" />
    </>
  );
}

// progressRef를 prop으로 받아 useFrame 안에서 직접 읽음 — 부모 리렌더 불필요
function Ring({ progressRef }: { progressRef: React.RefObject<number> }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const smooth = useRef(0);
  const { viewport } = useThree();

  useFrame(() => {
    if (!meshRef.current) return;

    smooth.current += (progressRef.current - smooth.current) * 0.06;
    const p = smooth.current;

    const revealP = easeOutCubic(Math.min(Math.max(p / 0.55, 0), 1));
    const moveP = easeOutCubic(Math.min(Math.max((p - 0.5) / 0.4, 0), 1));

    const rotX = Math.PI * 0.32 - revealP * Math.PI * 0.2;
    const rotY = revealP * Math.PI * 0.1 + moveP * Math.PI * 0.12;
    const rotZ = Math.sin(revealP * Math.PI) * 0.06;

    const scaleFactor = Math.min(1, viewport.width / 5.0);
    const scale = Math.max(0.4, scaleFactor);
    const ringExtent = 1.35 * scale;
    const maxPosX = Math.max(0, viewport.width * 0.5 - ringExtent);
    const posX = Math.min(moveP * viewport.width * 0.3, maxPosX);
    const posY = -moveP * 0.15 * scale;

    meshRef.current.scale.setScalar(scale);
    meshRef.current.rotation.x = rotX;
    meshRef.current.rotation.y = rotY;
    meshRef.current.rotation.z = rotZ;
    meshRef.current.position.x = posX;
    meshRef.current.position.y = posY;
  });

  return (
    <mesh ref={meshRef}>
      <torusGeometry args={[1, 0.4, 64, 128]} />
      <meshStandardMaterial metalness={0.95} roughness={0.06} color="#ffffff" />
    </mesh>
  );
}

export default function Hero() {
  const target = useRef(0);
  const smooth = useRef(0);
  const progressRef = useRef(0);
  const mouseRef = useRef<MousePos>({ x: 0, y: 0 });
  const navRevealedRef = useRef(false);

  // HTML 오버레이 요소 — React 리렌더 없이 직접 style 조작
  const overlayRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const essentialTextRef = useRef<HTMLDivElement>(null);

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
      const t = e.touches[0];
      mouseRef.current = {
        x: (t.clientX / window.innerWidth) * 2 - 1,
        y: -(t.clientY / window.innerHeight) * 2 + 1,
      };
    };

    // resize마다 재계산해서 클로저 변수로 유지 — 60fps 읽기 제거
    let isMobile = window.innerWidth < 640;
    const onResize = () => { isMobile = window.innerWidth < 640; };

    window.addEventListener("scroll", onScroll);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    onScroll();

    let frame: number;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      window.dispatchEvent(new Event("prisme:nav-reveal"));
    } else {
      const animate = () => {
        smooth.current += (target.current - smooth.current) * 0.08;
        const p = smooth.current;
        progressRef.current = p;

        const heroFade = Math.min(p / 0.3, 1);

        // React setState 없이 DOM style 직접 변경 — compositor 속성만 건드림
        if (overlayRef.current) {
          overlayRef.current.style.opacity = String(heroFade * 0.4);
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

  return (
    <section
      className="relative h-[400vh] bg-surface-base"
      aria-label="PRISME 메인 히어로"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <Canvas
          className="absolute inset-0"
          camera={{ position: [0, 0, 4], fov: 45 }}
          role="img"
          aria-label="스크롤에 반응하는 반지 3D 애니메이션"
          onCreated={() => window.dispatchEvent(new Event("prisme:hero-ready"))}
        >
          <Lights mouseRef={mouseRef} />
          <Ring progressRef={progressRef} />
        </Canvas>

        <div
          ref={overlayRef}
          className="absolute inset-0 bg-surface-base"
          style={{ opacity: 0.4 }}
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
          <div className="flex justify-center items flex-col">
            <span className="block text-center">
              Shaped through balance, defined by elegance.
            </span>
            <span className="block text-center">
              Contemporary jewelry reduced to its essential expression.
            </span>
          </div>
        </div>

        {/* ESSENTIAL COLLECTION — full-bleed, no 1440px constraint */}
        <div
          ref={essentialTextRef}
          className="absolute top-0 bottom-0 left-4 sm:left-[7%] lg:left-[8%] right-4 sm:right-6 lg:right-8 flex flex-col text-content-primary"
          style={{ opacity: 0 }}
        >
          <div className="mt-[13vh]">
            <p className="mb-2 sm:mb-3 text-2xs tracking-descriptor text-content-subtle">
              COLLECTION
            </p>
            <h2
              className="mb-8 sm:mb-10 leading-none font-light"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              <span className="block text-4xl sm:text-5xl lg:text-7xl xl:text-8xl">
                ESSENTIAL
              </span>
              <span className="block text-4xl sm:text-5xl lg:text-7xl xl:text-8xl pl-4 sm:pl-10 lg:pl-16 xl:pl-20">
                COLLECTION
              </span>
            </h2>
            <p className="max-w-40 sm:max-w-55 md:max-w-75 text-xs sm:text-sm leading-relaxed text-content-muted">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation
            </p>
          </div>

          <div className="flex-1" />

          <a
            href="/essential"
            className="mb-[10%] text-2xs sm:text-xs tracking-link text-content-secondary hover:text-content-primary transition-colors"
          >
            컬렉션 살펴보기 →
          </a>
        </div>
      </div>
    </section>
  );
}
