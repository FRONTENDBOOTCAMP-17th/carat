"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function easeInOutCubic(t: number) {
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function Ring({ progress }: { progress: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!meshRef.current) return;

    // 0.3 ~ 0.6
    const rotateProgress = Math.min(
      Math.max((progress - 0.3) / 0.3, 0),
      1
    );

    const easedRotation = easeOutCubic(rotateProgress);

    meshRef.current.rotation.y =
      easedRotation * Math.PI * 0.3;

    // 0.6 ~ 0.8
    const moveProgress = Math.min(
      Math.max((progress - 0.6) / 0.2, 0),
      1
    );

    const easedMove = easeInOutCubic(moveProgress);

    meshRef.current.position.x =
      easedMove * 2.5;
  });

  return (
    <mesh
      ref={meshRef}
      rotation={[Math.PI / 2, 0, 0]}
    >
      <torusGeometry args={[1, 0.3, 64, 128]} />

      <meshStandardMaterial
        metalness={1}
        roughness={0.15}
        color="#d4d4d4"
      />
    </mesh>
  );
}

export default function Hero() {
  const targetProgress = useRef(0);

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const maxScroll = window.innerHeight * 3;

      targetProgress.current = Math.min(
        Math.max(window.scrollY / maxScroll, 0),
        1
      );
    };

    window.addEventListener("scroll", onScroll);

    onScroll();

    let frame: number;

    const animate = () => {
      setProgress((prev) => {
        return (
          prev +
          (targetProgress.current - prev) * 0.08
        );
      });

      frame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener(
        "scroll",
        onScroll
      );

      cancelAnimationFrame(frame);
    };
  }, []);

  const fadeProgress = Math.min(
    progress / 0.3,
    1
  );

  const heroOpacity = 1 - fadeProgress;

  const heroTranslateY =
    fadeProgress * -40;

  const collectionProgress =
    progress < 0.8
      ? 0
      : Math.min(
          (progress - 0.8) / 0.2,
          1
        );

  const collectionOpacity =
    easeOutCubic(collectionProgress);

  const collectionTranslateY =
    40 * (1 - collectionOpacity);

  return (
    <section className="relative h-[400vh]">
      <div className="sticky top-0 h-screen overflow-hidden bg-black">

        {/* 3D */}

        <Canvas
          className="absolute inset-0"
          camera={{
            position: [0, 0, 4],
            fov: 45,
          }}
        >
          <ambientLight intensity={1.5} />

          <directionalLight
            position={[5, 5, 5]}
            intensity={3}
          />

          <Ring progress={progress} />
        </Canvas>

        {/* DIM */}

        <div
          className="absolute inset-0 bg-black"
          style={{
            opacity:
              heroOpacity * 0.4,
          }}
        />

        {/* HERO */}

        <div
          className="absolute inset-0 flex flex-col items-center justify-center text-white"
          style={{
            opacity: heroOpacity,
            transform: `translateY(${heroTranslateY}px)`,
          }}
        >
          <p className="mb-4 text-sm tracking-[0.4em]">
            JEWELRY COLLECTION
          </p>

          <h1 className="text-7xl font-light tracking-[0.2em]">
            PRISME
          </h1>
        </div>

        {/* ESSENTIAL COLLECTION */}

        <div
          className="absolute left-24 top-1/2 text-white"
          style={{
            opacity:
              collectionOpacity,
            transform: `translateY(calc(-50% + ${collectionTranslateY}px))`,
          }}
        >
          <p className="mb-4 text-sm tracking-[0.4em]">
            COLLECTION
          </p>

          <h2 className="mb-6 text-6xl font-light">
            ESSENTIAL
            <br />
            COLLECTION
          </h2>

          <p className="max-w-md text-white/70">
            Every form begins with
            simplicity.
            <br />
            Refined through balance
            and proportion.
          </p>
        </div>
      </div>
    </section>
  );
}