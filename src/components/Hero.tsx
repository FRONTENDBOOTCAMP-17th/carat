"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Environment, Lightformer } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { ArrowDown } from "lucide-react";
import { useLang } from "@/context/LanguageContext";

// With gl={{ alpha:false }} the canvas is opaque, so its clear color shows as the background.
// Keep it in sync with bg-surface-base per theme so the section looks seamless.
function ClearColor() {
  const { gl } = useThree();
  useEffect(() => {
    const update = () => {
      const isLight = document.documentElement.dataset.theme === "light";
      gl.setClearColor(new THREE.Color(isLight ? "#fafafa" : "#09090b"), 1);
    };
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, [gl]);
  return null;
}

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

  // The Environment (HDRI) is the primary light — it already provides key+fill. Stacking strong
  // direct lights on top blows the metal out to flat white, so these are kept low: just small
  // mouse-tracked speculars that add a moving glint on the band. Neutral white per the brief.
  return (
    <>
      {/* Key glint — front-left */}
      <pointLight
        ref={keyRef}
        position={[-2.5, 4, 2]}
        intensity={8}
        color="#ffffff"
      />
      {/* Rim — edge separation on the band */}
      <pointLight
        ref={rimMainRef}
        position={[0, 2, -4]}
        intensity={6}
        color="#ffffff"
      />
      <pointLight
        ref={rimSideRef}
        position={[2, 1, -3]}
        intensity={3}
        color="#ffffff"
      />
    </>
  );
}

// Shared diamond material for all transmission stones. GLB loader chain is unreliable for
// KHR_materials_transmission, so we drive meshPhysicalMaterial directly (ior matches the GLB's 2.42).
function Diamond({
  geometry,
  position,
  quaternion,
}: {
  geometry: THREE.BufferGeometry;
  position?: THREE.Vector3;
  quaternion?: THREE.Quaternion;
}) {
  return (
    <mesh geometry={geometry} position={position} quaternion={quaternion}>
      <meshPhysicalMaterial
        transmission={1}
        ior={2.417}
        roughness={0}
        metalness={0}
        thickness={0.5}
        dispersion={4}
        envMapIntensity={1.5}
        color="#ffffff"
        side={THREE.FrontSide}
      />
    </mesh>
  );
}

function Ring({ progressRef }: { progressRef: React.RefObject<number> }) {
  const groupRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Group>(null);
  const smooth = useRef(0);
  const { viewport } = useThree();
  const { nodes } = useGLTF("/models/Hero_Ring.glb") as unknown as {
    nodes: {
      Band: THREE.Mesh;
      MainStone: THREE.Mesh;
      SideStone: THREE.Mesh;
      SideStoneRight: THREE.Mesh;
      MainStoneHousing: THREE.Mesh;
      PaveLeft: THREE.Mesh;
      PaveRight: THREE.Mesh;
    };
  };

  useFrame(() => {
    if (!innerRef.current || !groupRef.current) return;
    smooth.current += (progressRef.current - smooth.current) * 0.06;
    const p = smooth.current;
    const revealP = easeOutCubic(Math.min(Math.max(p / 0.55, 0), 1));
    const moveP = easeOutCubic(Math.min(Math.max((p - 0.5) / 0.4, 0), 1));
    // 회전: 초기엔 가파르게 누운 각도 → 정면에 가까운 각도
    const rotX = Math.PI * -0.4 - revealP * Math.PI * 0.3;
    const rotY = revealP * Math.PI * 0.1 + moveP * Math.PI * 0.12;
    // 화면 평면(시선축) 기울기 — 양수 = 반시계. group에 적용해야 보임
    // crownRoll: 첫 프레임에서 크라운(스톤)이 우상단을 향하도록 주는 초기 롤. revealP 진행 시 0으로 페이드해 essential 최종 포즈는 그대로.
    const crownRoll = Math.PI;
    const tiltZ =
      0.6 + Math.sin(revealP * Math.PI) * 0.06 + crownRoll * (1 - revealP);
    // 크기: 초기엔 화면 가득(heroScale) → 기준 크기(baseScale)로 축소
    const baseScale = Math.max(0.4, Math.min(1, viewport.width / 4.0));
    const heroScale = Math.max(baseScale * 2.7, viewport.height / 2.4);
    const scale = heroScale + (baseScale - heroScale) * revealP;
    // 이동: 축소가 끝난 뒤(baseScale 기준) 오른쪽으로 이동
    const ringExtent = 1.35 * baseScale;
    const maxPosX = Math.max(0, viewport.width * 0.5 - ringExtent);
    // 첫 프레임(hero)에서 반지 몸통을 좌하단으로 배치 — revealP 진행 시 0으로 사라짐
    const heroOffsetX = -0.7 * (1 - revealP);
    const heroOffsetY = -1.2 * (1 - revealP);
    const posX = Math.min(moveP * viewport.width * 0.3, maxPosX) + heroOffsetX;
    const posY = heroOffsetY - moveP * 0.15 * baseScale;
    // 반지 포즈(눕힘/좌우)는 inner group에
    innerRef.current.rotation.x = rotX;
    innerRef.current.rotation.y = rotY;
    // 화면 평면 기울기·크기·위치는 outer group에
    groupRef.current.rotation.z = tiltZ;
    groupRef.current.scale.setScalar(scale);
    groupRef.current.position.x = posX;
    groupRef.current.position.y = posY;
  });

  return (
    <group ref={groupRef}>
      <group ref={innerRef}>
        {/* base orientation: Hero_Ring lies flat in the XZ plane; stand it up to face the camera */}
        <group rotation={[Math.PI / 2, 0, 0]}>
          {/* normalize: model spans ≈12.77 GLB units across → bring it to ≈2.7 (matches the reveal scale math) */}
          <group scale={0.21}>
            {/* centering offset: GLB global bbox center is at approx (19.245, 0, 0.769) */}
            <group position={[-19.245, 0, -0.769]}>
              {/* Band & housing — keep GLB metallic materials as-is */}
              <mesh
                geometry={nodes.Band.geometry}
                material={nodes.Band.material}
              />
              <mesh
                geometry={nodes.MainStoneHousing.geometry}
                material={nodes.MainStoneHousing.material}
              />
              {/* Transmission stones — verts carry their own placement (identity node transform) */}
              <Diamond geometry={nodes.MainStone.geometry} />
              <Diamond geometry={nodes.SideStone.geometry} />
              <Diamond geometry={nodes.SideStoneRight.geometry} />
              {/* Pave — node carries its own translation+quaternion in GLB local space */}
              <Diamond
                geometry={nodes.PaveLeft.geometry}
                position={nodes.PaveLeft.position}
                quaternion={nodes.PaveLeft.quaternion}
              />
              <Diamond
                geometry={nodes.PaveRight.geometry}
                position={nodes.PaveRight.position}
                quaternion={nodes.PaveRight.quaternion}
              />
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/models/Hero_Ring.glb");

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
            // alpha:false → Three.js가 transmission 패스를 흰색으로 클리어하는 milky 버그를 근본 차단.
            // 배경은 ClearColor가 테마별 surface 색으로 채워 화면상 동일하게 유지.
            gl={{ alpha: false }}
            dpr={[1, 2]}
            performance={{ min: 0.5 }}
            role="img"
            aria-label={t.hero.canvasLabel}
            onCreated={({ gl }) => {
              gl.toneMapping = THREE.ACESFilmicToneMapping;
              gl.toneMappingExposure = 1.1;
              window.dispatchEvent(new Event("prisme:hero-ready"));
            }}
          >
            <ClearColor />
            {/* Neutral-white studio env (real-jewelry-lighting research):
                - A light-grey surround = clean lightbox base. Transmission reads as *clear* only
                  when there's bright neutral light BEHIND the gem to refract; a near-black surround
                  made the diamond show black through it (looked opaque).
                - Pure-white softboxes act as the key/fill "panels"; being brighter than the grey
                  surround they still give crisp facet highlights (sparkle) without color cast.
                - The darker gaps between panels are the "black-card" negative fill that adds the
                  dark facets diamonds need for contrast.
                Lightformers auto-face the origin, so only position/scale matter. */}
            <Environment resolution={512} background={false}>
              {/* Mid-grey surround (not near-black, not bright): dark enough that the mirror-polished
                  band reflects *structure* instead of a flat white field, light enough that the gems
                  still transmit a clean neutral tone. Bright white panels below are the actual key/fill. */}
              <color attach="background" args={["#565656"]} />
              {/* Key softbox — large, front-left */}
              <Lightformer
                form="rect"
                intensity={2.2}
                color="#ffffff"
                position={[-5, 4, 3]}
                scale={[8, 10, 1]}
              />
              {/* Fill softbox — front-right, softer (≈half the key) */}
              <Lightformer
                form="rect"
                intensity={1.2}
                color="#ffffff"
                position={[5, 2, 3]}
                scale={[6, 8, 1]}
              />
              {/* Overhead strip — top highlight rolling across the crown */}
              <Lightformer
                form="rect"
                intensity={2}
                color="#ffffff"
                position={[0, 6, 1]}
                scale={[10, 2, 1]}
              />
              {/* Back light-table — sits behind the gems so refracted rays reach a bright source,
                  which is what makes the transmission read as *clear* rather than dark/opaque. */}
              <Lightformer
                form="rect"
                intensity={1.8}
                color="#ffffff"
                position={[0, 0, -6]}
                scale={[12, 12, 1]}
              />
              {/* Small bright accents → crisp point-source sparkle on facets */}
              <Lightformer
                form="ring"
                intensity={4}
                color="#ffffff"
                position={[3, -1, 4]}
                scale={1.2}
              />
              <Lightformer
                form="circle"
                intensity={3}
                color="#ffffff"
                position={[-3, 0, 4]}
                scale={1}
              />
            </Environment>
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
