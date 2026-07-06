"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF, MeshRefractionMaterial } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

// Shared building blocks for every scene that shows the Hero_Ring model — the scroll-driven Hero
// journey (Hero.tsx) and the drag-to-orbit Essential Collection viewer (EssentialRingViewer.tsx)
// both mount these instead of duplicating the studio lighting / material / geometry setup.

// base/input hex duplicated from globals.css's --c-surface-base / --c-surface-input (light/dark)
// rather than read live via getComputedStyle — CSS var lookups here would need to invert
// getComputedStyle's oklch() serialization back into something THREE.Color.setStyle() can parse,
// which isn't guaranteed across browsers. Hardcoding matches buildStudioEquirect's own convention.
// stage: NOT a design-system token. surface-input is Tailwind's zinc family, which carries a faint
// cool/blue cast — fine for form-field chrome, but reads as an unfinished "bluish grey" behind a
// product shot. True R=G=B neutral (zero hue/saturation) avoids favoring any one metal tone and
// matches the ecommerce-photography convention of a deliberately distinct, colorless product stage.
const CLEAR_COLORS = {
  base: { light: "#fafafa", dark: "#09090b" },
  input: { light: "#d4d4d8", dark: "#3f3f46" },
  stage: { light: "#d9d9d9", dark: "#2b2b2b" },
} as const;

// With gl={{ alpha:false }} the canvas is opaque, so its clear color shows as the background.
// variant="base" (default, Hero): matches bg-surface-base so the section blends into the page.
// variant="stage" (Essential viewer): a deliberately distinct warm-neutral backdrop rather than
// blending with the page (common product-photo convention).
export function ClearColor({
  variant = "base",
}: {
  variant?: keyof typeof CLEAR_COLORS;
} = {}) {
  const { gl } = useThree();
  useEffect(() => {
    const update = () => {
      const isLight = document.documentElement.dataset.theme === "light";
      const { light, dark } = CLEAR_COLORS[variant];
      gl.setClearColor(new THREE.Color(isLight ? light : dark), 1);
    };
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, [gl, variant]);
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
export function buildStudioEquirect(isLight: boolean, forMetal: boolean) {
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

  // Dark mode was #0a0a0a — near-total black between sparkle blobs made the facets read as a flat
  // black hole rather than a cut stone. Lifted just enough to keep the facet structure legible while
  // the blobs still land as clearly brighter sparkle points.
  ctx.fillStyle = isLight ? "#bebebe" : "#181818";
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

// Must run inside <Canvas> (client-only) so `document` is available. Builds BOTH themes' env maps
// once at mount instead of rebuilding on every toggle: swapping to an already-baked texture is a
// plain reference assignment, versus redrawing the equirect canvas and re-baking a fresh PMREM each
// time the theme flips — that rebake (see metalEnv below) is what caused a visible relight lag.
export function useStudioEnvMaps(
  // The dark-theme gem env is a near-black surround by design (Hero wants crisp sparkle contrast
  // against a dark page) — but a standalone product shot isn't ambient page decor, so the Essential
  // viewer pins gemTheme to "light" regardless of the page theme so stones read clear/bright rather
  // than going near-black. Metal still follows the real page theme (silver/gold/rose-gold band tone).
  gemTheme?: "light" | "dark",
) {
  const { gl } = useThree();
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

  // Raw equirect canvases for both themes — cheap enough to just build all four once and keep them.
  const raw = useMemo(
    () => ({
      gemDark: buildStudioEquirect(false, false),
      gemLight: buildStudioEquirect(true, false),
      metalDark: buildStudioEquirect(false, true),
      metalLight: buildStudioEquirect(true, true),
    }),
    [],
  );

  // The metal band reads its reflections from scene.environment. drei's <Environment> re-bakes this
  // (PMREM) every time the source map changes, which is the actually-expensive part of the toggle —
  // baking both themes once up front turns the toggle into a plain texture swap.
  const pmrem = useMemo(() => {
    const generator = new THREE.PMREMGenerator(gl);
    generator.compileEquirectangularShader();
    const dark = generator.fromEquirectangular(raw.metalDark).texture;
    const light = generator.fromEquirectangular(raw.metalLight).texture;
    generator.dispose();
    return { dark, light };
  }, [gl, raw]);

  useEffect(
    () => () => {
      Object.values(raw).forEach((tex) => tex.dispose());
      pmrem.dark.dispose();
      pmrem.light.dispose();
    },
    [raw, pmrem],
  );

  const gemIsLight = gemTheme ? gemTheme === "light" : isLight;
  return {
    gemEnv: gemIsLight ? raw.gemLight : raw.gemDark,
    metalEnv: isLight ? pmrem.light : pmrem.dark,
  };
}

// Syncs scene.environment every frame instead of assigning it directly in an effect — the latter
// would mutate useThree()'s returned `scene`, which react-hooks/immutability (React Compiler rule)
// forbids. Mount once per scene, alongside useStudioEnvMaps().
export function useSceneEnvironment(metalEnv: THREE.Texture) {
  useFrame((state) => {
    if (state.scene.environment !== metalEnv) {
      state.scene.environment = metalEnv;
    }
  });
}

// Returns false during SSR (window absent) — treated as "supported" until client confirms otherwise.
export function supportsWebGL(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

// Whether to mount the live 3D ring at all, vs. fall back to the static still / tint.
// Gecko Firefox on Android reports WebGL2 support, but the gems' MeshRefractionMaterial — which
// packs its BVH into float/integer textures and ray-traces them in the fragment shader — renders
// blown-out white there, while the plain-material band looks fine. Rather than ship visibly broken
// stones to that engine, treat it like a no-WebGL client so the fallback shows instead.
// The UA test is deliberately narrow: "Firefox/" + "Android" catches Gecko on Android (mobile and
// tablet) while excluding desktop Firefox (no "Android", renders correctly) and iOS Firefox (reports
// "FxiOS", not "Firefox/" — it's WebKit under the hood, a separate engine).
export function canRenderRingScene(): boolean {
  if (typeof window === "undefined") return true;
  if (!supportsWebGL()) return false;
  const ua = navigator.userAgent;
  const isGeckoAndroid = /Firefox\//.test(ua) && /Android/.test(ua);
  return !isGeckoAndroid;
}

export type MousePos = { x: number; y: number };

export function Lights({
  mouseRef,
}: {
  mouseRef: React.RefObject<MousePos>;
}) {
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
export function Diamond({
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

export type RingGLTFNodes = {
  Band: THREE.Mesh;
  MainStone: THREE.Mesh;
  SideStone: THREE.Mesh;
  SideStoneRight: THREE.Mesh;
  MainStoneHousing: THREE.Mesh;
  PaveLeft: THREE.Mesh;
  PaveRight: THREE.Mesh;
};

export function useRingNodes() {
  const { nodes } = useGLTF("/models/Hero_Ring.glb") as unknown as {
    nodes: RingGLTFNodes;
  };
  return nodes;
}
useGLTF.preload("/models/Hero_Ring.glb");

// The GLB's own coordinate system normalized to a sane unit scale, centered, standing upright to
// face the camera — shared by every scene that shows this ring (Hero's scroll journey wraps this in
// its own animated transform groups; the Essential viewer wraps it in OrbitControls instead).
export function RingModel({
  nodes,
  envMap,
  metalColor = "#cfcfcf",
  // The achromatic studio env (buildStudioEquirect) was tuned for a neutral platinum/silver mirror,
  // where a razor-sharp roughness=0 reflection reads as "expensive chrome." Tinting that same mirror
  // gold/rose-gold exposes the trick — a colored perfect mirror on a colorless env reads as "plastic
  // with a color filter." A touch of roughness breaks the hard mirror edge and reads as genuine
  // polished metal instead. Left at 0 by default so Hero's tuned silver look is unaffected.
  roughness = 0,
}: {
  nodes: RingGLTFNodes;
  envMap: THREE.Texture;
  metalColor?: string;
  roughness?: number;
}) {
  return (
    // base orientation: Hero_Ring lies flat in the XZ plane; stand it up to face the camera
    <group rotation={[Math.PI / 2, 0, 0]}>
      {/* normalize: model spans ≈12.77 GLB units across → bring it to ≈2.7 (matches the reveal scale math) */}
      <group scale={0.21}>
        {/* centering offset: GLB global bbox center is at approx (19.245, 0, 0.769) */}
        <group position={[-19.245, 0, -0.769]}>
          {/* Band & housing — bright polished metal, near-mirror by default. The model's own chamfer
              (not roughness) handles the edge softening for the neutral Hero look. */}
          <mesh geometry={nodes.Band.geometry}>
            <meshStandardMaterial
              color={metalColor}
              metalness={1}
              roughness={roughness}
              envMapIntensity={1}
            />
          </mesh>
          <mesh geometry={nodes.MainStoneHousing.geometry}>
            <meshStandardMaterial
              color={metalColor}
              metalness={1}
              roughness={roughness}
              envMapIntensity={1}
            />
          </mesh>
          {/* Transmission stones — verts carry their own placement (identity node transform).
              Color intentionally NOT tied to metalColor — switching metal finish shouldn't tint
              the stones themselves. */}
          <Diamond geometry={nodes.MainStone.geometry} envMap={envMap} />
          <Diamond geometry={nodes.SideStone.geometry} envMap={envMap} />
          <Diamond geometry={nodes.SideStoneRight.geometry} envMap={envMap} />
          {/* Pave — node carries its own translation+quaternion in GLB local space. Calmed down
              (fewer bounces, no chromatic aberration) so the dense melee doesn't out-sparkle and
              clash with the low-poly marquises. */}
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
  );
}
