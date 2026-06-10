"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

/* -----------------------------
   easing
------------------------------*/
function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

/* -----------------------------
   Ring
------------------------------*/
function Ring({ progress }: { progress: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const smooth = useRef(0);

  useFrame(() => {
    if (!meshRef.current) return;

    // smooth scroll (핵심)
    smooth.current += (progress - smooth.current) * 0.06;

    const p = smooth.current;

    // rotation phase
    const rotateP = Math.min(Math.max((p - 0.3) / 0.3, 0), 1);
    const moveP = Math.min(Math.max((p - 0.6) / 0.25, 0), 1);

    const rot = easeOutCubic(rotateP) * Math.PI * 0.35;
    const x = easeOutCubic(moveP) * 1.2;

    meshRef.current.rotation.y = rot;
    meshRef.current.position.x = x;
  });

  return (
    <mesh ref={meshRef} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[1, 0.3, 64, 128]} />
      <meshStandardMaterial metalness={1} roughness={0.15} color="#d4d4d4" />
    </mesh>
  );
}

/* -----------------------------
   Hero
------------------------------*/
export default function Hero() {
  const target = useRef(0);
  const smooth = useRef(0);
  const [, force] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const maxScroll = window.innerHeight * 3;
      target.current = window.scrollY / maxScroll;
    };

    window.addEventListener("scroll", onScroll);
    onScroll();

    let frame: number;

    const animate = () => {
      smooth.current += (target.current - smooth.current) * 0.08;

      force(smooth.current);

      frame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  const progress = smooth.current;

  /* -----------------------------
     HERO → ESSENTIAL
  ------------------------------*/
  const heroFade = Math.min(progress / 0.3, 1);
  const heroOpacity = 1 - heroFade;
  const heroY = heroFade * -40;

  const essentialP = Math.min(Math.max((progress - 0.6) / 0.25, 0), 1);

  const essentialEase = easeOutCubic(essentialP);

  const essentialOpacity = essentialEase;
  const essentialY = (1 - essentialEase) * 0;
  const essentialX = -essentialEase * 30;

  /* -----------------------------
     BEST PIECES reveal (placeholder)
  ------------------------------*/
  const bestP = Math.min(Math.max((progress - 0.75) / 0.25, 0), 1);

  const bestEase = easeOutCubic(bestP);

  return (
    <section className="relative h-[400vh] bg-black">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* 3D */}
        <Canvas
          className="absolute inset-0"
          camera={{ position: [0, 0, 4], fov: 45 }}
        >
          <ambientLight intensity={1.5} />
          <directionalLight position={[5, 5, 5]} intensity={3} />
          <Ring progress={progress} />
        </Canvas>

        {/* DIM */}
        <div
          className="absolute inset-0 bg-black"
          style={{ opacity: heroOpacity * 0.4 }}
        />

        {/* HERO */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center text-white"
          style={{
            opacity: heroOpacity,
            transform: `translateY(${heroY}px)`,
          }}
        >
          <p className="mb-4 text-sm tracking-[0.4em]">JEWELRY COLLECTION</p>
          <h1 className="text-7xl font-light tracking-[0.2em]">PRISME</h1>
        </div>

        {/* ESSENTIAL COLLECTION */}
        <div
          className="absolute left-96 top-1/2 text-white"
          style={{
            opacity: essentialOpacity,
            transform: `translate(-50%, ${essentialY}px) translateX(${essentialX}px)`,
          }}
        >
          <p className="mb-4 text-sm tracking-[0.4em]">COLLECTION</p>

          <h2 className="mb-6 text-6xl font-light">
            ESSENTIAL
            <br />
            COLLECTION
          </h2>

          <p className="max-w-md text-white/70">
            Every form begins with simplicity. Refined through balance and
            proportion.
          </p>
        </div>
      </div>
    </section>
  );
}
