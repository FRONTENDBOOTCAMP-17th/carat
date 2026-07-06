"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  useGLTF,
  Environment,
  MeshRefractionMaterial,
} from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
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

// Procedural achromatic studio envs (equirectangular canvas), tuned per material need:
//   - Gems (forMetal=false): near-black surround + soft white softbox blobs. MeshRefractionMaterial
//     ray-traces this crisply → bright/dark facet contrast = sparkle. Light mode adds dark reflectors
//     so facets keep a dark side against the bright page.
//   - Metal (forMetal=true): a vertical studio "sweep" gradient + SHARP-edged rectangular softboxes.
//     A near-mirror reflecting a single flat colour reads as cheap grey plastic (no variation); the
//     gradient gives the curved band a light→dark sweep and the crisp rectangles land as real
//     polished-metal highlight streaks.
function buildStudioEquirect(isLight: boolean, forMetal: boolean) {
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d")!;

  const finish = () => {
    const tex = new THREE.CanvasTexture(canvas);
    tex.mapping = THREE.EquirectangularReflectionMapping;
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  };

  if (forMetal) {
    const grad = ctx.createLinearGradient(0, 0, 0, 1024);
    if (isLight) {
      grad.addColorStop(0, "#eeeeee");
      grad.addColorStop(0.5, "#c2c2c2");
      grad.addColorStop(1, "#8c8c8c");
    } else {
      grad.addColorStop(0, "#565656");
      grad.addColorStop(0.5, "#262626");
      grad.addColorStop(1, "#0d0d0d");
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 2048, 1024);
    // soft-but-defined rectangular softboxes → crisp reflection streaks on the polished band
    const box = (x: number, y: number, w: number, h: number, style: string) => {
      ctx.save();
      ctx.filter = "blur(7px)";
      ctx.fillStyle = style;
      ctx.fillRect(x, y, w, h);
      ctx.restore();
    };
    box(180, 110, 560, 300, "#ffffff");
    box(1180, 170, 660, 240, "#ffffff");
    box(770, 470, 520, 110, "#ffffff");
    if (isLight) {
      // strong dark reflectors → the polished band shows deep dark reflection zones (contrast/form)
      // instead of a uniform white field. Without these, a mirror on a bright env = white plastic.
      box(720, 430, 600, 300, "rgba(0,0,0,0.8)");
      box(150, 640, 480, 320, "rgba(0,0,0,0.72)");
      box(1560, 790, 400, 260, "rgba(0,0,0,0.74)");
    }
    // crisp thin bars (hard edges read as bright lines sweeping across the band)
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(120, 700, 1000, 9);
    ctx.fillRect(1280, 640, 620, 7);
    return finish();
  }

  ctx.fillStyle = isLight ? "#bebebe" : "#0a0a0a";
  ctx.fillRect(0, 0, 2048, 1024);
  const blob = (x: number, y: number, r: number, a: number, dark = false) => {
    const c = dark ? "0,0,0" : "255,255,255";
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, `rgba(${c},${a})`);
    g.addColorStop(1, `rgba(${c},0)`);
    ctx.fillStyle = g;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  };
  // bright key/fill softboxes + small sparkle sources (both themes)
  blob(540, 300, 340, 1);
  blob(1460, 350, 300, 0.9);
  blob(1024, 150, 520, 0.7);
  blob(300, 640, 120, 1);
  blob(1780, 560, 130, 0.95);
  blob(1180, 760, 90, 1);
  blob(760, 820, 70, 0.9);
  // light mode only: strong dark reflectors so facets get a deep dark side against the bright
  // surround — otherwise the colorless stones refract only light tones and read as white plastic.
  if (isLight) {
    blob(760, 380, 320, 0.92, true);
    blob(1450, 560, 340, 0.88, true);
    blob(320, 720, 260, 0.85, true);
    blob(1780, 240, 240, 0.82, true);
  }
  return finish();
}

// Must run inside <Canvas> (client-only) so `document` is available. Rebuilds on theme switch.
// Returns two envs: a dark one the gems refract (crisp), a brighter one the metal reflects.
function useStudioEnvMaps() {
  const [isLight, setIsLight] = useState(
    () =>
      typeof document !== "undefined" &&
      document.documentElement.dataset.theme === "light",
  );
  useEffect(() => {
    const update = () =>
      setIsLight(document.documentElement.dataset.theme === "light");
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);
  const gemEnv = useMemo(() => buildStudioEquirect(isLight, false), [isLight]);
  const metalEnv = useMemo(() => buildStudioEquirect(isLight, true), [isLight]);
  useEffect(
    () => () => {
      gemEnv.dispose();
      metalEnv.dispose();
    },
    [gemEnv, metalEnv],
  );
  return { gemEnv, metalEnv };
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

// Gentle symmetric ease — smooth accel/decel without the flat, snappy feel of cubic at the ends.
function easeInOutSine(t: number) {
  return -(Math.cos(Math.PI * t) - 1) / 2;
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

  // The metal gets its body tone + reflections from metalEnv; these just add subtle moving speculars.
  // No ambient light on purpose — a flat ambient lifts the metal's blacks and flattens the contrast.
  return (
    <>
      {/* Key — front-left */}
      <pointLight
        ref={keyRef}
        position={[-2.5, 4, 2]}
        intensity={9}
        color="#ffffff"
      />
      {/* Fill — front-right */}
      <pointLight position={[3, 1, 3]} intensity={4} color="#ffffff" />
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

// Diamond-specific material. Unlike buffer-based transmission (soft/hazy on tiny facets, and needs
// bright geometry behind the gem), MeshRefractionMaterial ray-traces the envMap through the stone's
// BVH — crisp per-facet brilliance straight from the studio env, no backdrop required. The drei
// wrapper builds the BVH from this mesh's geometry automatically.
function Diamond({
  geometry,
  position,
  quaternion,
  envMap,
  bounces = 3,
  aberrationStrength = 0.02,
}: {
  geometry: THREE.BufferGeometry;
  position?: THREE.Vector3;
  quaternion?: THREE.Quaternion;
  envMap: THREE.Texture;
  // The tiny pave melee are a much denser brilliant cut than the chunky marquises, so at full
  // bounces + aberration they scintillate far too busily and clash. Lower values calm them down.
  bounces?: number;
  aberrationStrength?: number;
}) {
  return (
    <mesh geometry={geometry} position={position} quaternion={quaternion}>
      <MeshRefractionMaterial
        envMap={envMap}
        bounces={bounces}
        ior={2.42}
        fresnel={1}
        aberrationStrength={aberrationStrength}
        fastChroma
        color="#ffffff"
      />
    </mesh>
  );
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
              {/* base orientation: Hero_Ring lies flat in the XZ plane; stand it up to face the camera */}
              <group rotation={[Math.PI / 2, 0, 0]}>
                {/* normalize: model spans ≈12.77 GLB units across → bring it to ≈2.7 (matches the reveal scale math) */}
                <group scale={0.21}>
                  {/* centering offset: GLB global bbox center is at approx (19.245, 0, 0.769) */}
                  <group position={[-19.245, 0, -0.769]}>
                    {/* Band & housing — bright polished platinum, near-mirror (roughness 0.03). Roughness
                  blurs the env and washes the reflection contrast out, so we keep it minimal; the
                  metalEnv's mid-grey floor gives the body tone and the bright panels read as crisp
                  streaks. The model's own chamfer (not roughness) handles the edge softening now. */}
                    <mesh geometry={nodes.Band.geometry}>
                      <meshStandardMaterial
                        color="#cfcfcf"
                        metalness={1}
                        roughness={0}
                        envMapIntensity={1}
                      />
                    </mesh>
                    <mesh geometry={nodes.MainStoneHousing.geometry}>
                      <meshStandardMaterial
                        color="#cfcfcf"
                        metalness={1}
                        roughness={0}
                        envMapIntensity={1}
                      />
                    </mesh>
                    {/* Transmission stones — verts carry their own placement (identity node transform) */}
                    <Diamond
                      geometry={nodes.MainStone.geometry}
                      envMap={envMap}
                    />
                    <Diamond
                      geometry={nodes.SideStone.geometry}
                      envMap={envMap}
                    />
                    <Diamond
                      geometry={nodes.SideStoneRight.geometry}
                      envMap={envMap}
                    />
                    {/* Pave — node carries its own translation+quaternion in GLB local space.
                      Calmed down (fewer bounces, no chromatic aberration) so the dense melee doesn't
                      out-sparkle and clash with the low-poly marquises. */}
                    <Diamond
                      geometry={nodes.PaveLeft.geometry}
                      position={nodes.PaveLeft.position}
                      quaternion={nodes.PaveLeft.quaternion}
                      envMap={envMap}
                      bounces={2}
                      aberrationStrength={0.01}
                    />
                    <Diamond
                      geometry={nodes.PaveRight.geometry}
                      position={nodes.PaveRight.position}
                      quaternion={nodes.PaveRight.quaternion}
                      envMap={envMap}
                      bounces={2}
                      aberrationStrength={0.01}
                    />
                  </group>
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/models/Hero_Ring.glb");

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
  return (
    <>
      <ClearColor />
      {/* metalEnv (mid-grey) drives the band's reflections via scene.environment; the gems refract
          their own darker env for crisp contrast. background={false} keeps the page surface visible. */}
      <Environment map={metalEnv} background={false} />
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
