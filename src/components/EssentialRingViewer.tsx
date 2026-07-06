"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import {
  ClearColor,
  Lights,
  RingModel,
  useRingNodes,
  useSceneEnvironment,
  useStudioEnvMaps,
  canRenderRingScene,
  type MousePos,
} from "@/components/RingScene";

// Never updated — the light rig (built for Hero's mouse-parallax) just settles at its base position,
// which reads as a normal fixed 3-point studio rig here since OrbitControls owns the interaction.
const STATIC_MOUSE: MousePos = { x: 0, y: 0 };

function ViewerScene({
  metalColor,
  roughness,
}: {
  metalColor: string;
  roughness: number;
}) {
  const nodes = useRingNodes();
  const { gemEnv, metalEnv } = useStudioEnvMaps("light");
  useSceneEnvironment(metalEnv);
  const mouseRef = useRef<MousePos>(STATIC_MOUSE);
  return (
    <>
      <ClearColor variant="stage" />
      <Lights mouseRef={mouseRef} />
      {/* Rolled back to Hero's exact reference pose — a reduced-tilt attempt visually tipped the
          ring onto a "/" diagonal instead (X/Z Euler rotation don't decompose independently, so a
          smaller tweak isn't just "a bit less tilt"). Revisit only with visual feedback in hand;
          in the meantime OrbitControls' free drag already lets the user reorient it themselves. */}
      <group rotation={[Math.PI * 0.4, 0, 0.6 + Math.PI]} scale={0.96}>
        <RingModel
          nodes={nodes}
          envMap={gemEnv}
          metalColor={metalColor}
          roughness={roughness}
        />
      </group>
    </>
  );
}

export default function EssentialRingViewer({
  metalColor,
  roughness = 0,
  fallbackTint,
  canvasLabel,
}: {
  metalColor: string;
  // See RingModel's roughness comment — colored metals on this achromatic env need a touch of
  // roughness to read as real polished metal instead of a tinted mirror. Pass per-swatch from the
  // page (silver: 0, gold/rose-gold: a small nonzero value).
  roughness?: number;
  fallbackTint: string;
  canvasLabel: string;
}) {
  const hasWebGL = useMemo(() => canRenderRingScene(), []);
  const wrapRef = useRef<HTMLDivElement>(null);
  // Pause rendering the moment this leaves view — same reasoning as Hero's Canvas: the per-pixel
  // raytraced refraction has no reason to keep costing a frame budget while scrolled past.
  const [inView, setInView] = useState(true);
  // Convention: auto-rotate invites interaction on load, but stops for good the moment the user
  // grabs it — it should stay exactly where they leave it, not resume spinning underneath them.
  const [autoRotate, setAutoRotate] = useState(true);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "50% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className="absolute inset-0">
      {hasWebGL ? (
        <Canvas
          className="absolute inset-0"
          camera={{ position: [0, 0, 4], fov: 45 }}
          gl={{ alpha: false, powerPreference: "high-performance" }}
          dpr={[1, 2]}
          performance={{ min: 0.5 }}
          frameloop={inView ? "always" : "never"}
          role="img"
          aria-label={canvasLabel}
          onCreated={({ gl }) => {
            gl.toneMapping = THREE.NeutralToneMapping;
            gl.toneMappingExposure = 1.1;
          }}
        >
          <Suspense fallback={null}>
            <ViewerScene metalColor={metalColor} roughness={roughness} />
          </Suspense>
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableDamping
            dampingFactor={0.08}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI - Math.PI / 3}
            autoRotate={autoRotate}
            autoRotateSpeed={1.2}
            onStart={() => setAutoRotate(false)}
          />
        </Canvas>
      ) : (
        // WebGL unavailable fallback — no photographed still exists yet for this piece, so fall
        // back to the swatch tint wash rather than nothing.
        <div
          className="absolute inset-0 transition-colors duration-700"
          style={{ backgroundColor: fallbackTint }}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
