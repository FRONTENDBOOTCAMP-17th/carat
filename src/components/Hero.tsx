"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
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

function Ring({ progress }: { progress: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const smooth = useRef(0);
  const { viewport } = useThree();

  useFrame(() => {
    if (!meshRef.current) return;

    smooth.current += (progress - smooth.current) * 0.06;
    const p = smooth.current;

    const revealP = easeOutCubic(Math.min(Math.max(p / 0.55, 0), 1));
    const moveP = easeOutCubic(Math.min(Math.max((p - 0.5) / 0.4, 0), 1));

    // 반지 회전 애니메이션 영역
    // end: rotX ≈ 47deg (overhead tilt showing ring face), rotY ≈ 40deg (3/4 side view)
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
  const [, force] = useState(0);
  const mouseRef = useRef<MousePos>({ x: 0, y: 0 });

  useEffect(() => {
    const onScroll = () => {
      const maxScroll = window.innerHeight * 3;
      target.current = window.scrollY / maxScroll;
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

    window.addEventListener("scroll", onScroll);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
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
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  const progress = smooth.current;

  const heroFade = Math.min(progress / 0.3, 1);
  const heroOpacity = 1 - heroFade;
  const heroY = heroFade * -40;

  const essentialP = Math.min(Math.max((progress - 0.6) / 0.25, 0), 1);
  const essentialEase = easeOutCubic(essentialP);
  const essentialOpacity = essentialEase;
  const essentialX = -essentialEase * 20;

  return (
    <section className="relative h-[400vh] bg-black" aria-label="PRISME 메인 히어로">
      <div className="sticky top-0 h-screen overflow-hidden">
        <Canvas
          className="absolute inset-0"
          camera={{ position: [0, 0, 4], fov: 45 }}
          role="img"
          aria-label="스크롤에 반응하는 반지 3D 애니메이션"
        >
          <Lights mouseRef={mouseRef} />
          <Ring progress={progress} />
        </Canvas>

        <div
          className="absolute inset-0 bg-black"
          style={{ opacity: heroOpacity * 0.4 }}
          aria-hidden="true"
        />

        {/* Initial centered hero text */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center text-white"
          style={{
            opacity: heroOpacity,
            transform: `translateY(${heroY}px)`,
          }}
        >
          <h1
            className="mb-5 text-5xl sm:text-6xl lg:text-7xl font-[500]"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            PRISME
          </h1>
          <p className="text-[8px] sm:text-[10px] tracking-[0.3em] sm:tracking-[0.35em] text-white/70 uppercase">
            Shaped through balance, defined by elegance
          </p>
          <p className="text-[8px] sm:text-[10px] tracking-[0.3em] sm:tracking-[0.35em] text-white/70 uppercase">
            Contemporary jewelry dedicated to the essential expression
          </p>
        </div>

        {/* ESSENTIAL COLLECTION — full-bleed, no 1440px constraint */}
        <div
          className="absolute top-0 bottom-0 left-[6%] sm:left-[7%] lg:left-[8%] flex flex-col text-white"
          style={{
            opacity: essentialOpacity,
            transform: `translateX(${essentialX}px)`,
          }}
        >
          <div className="mt-[13%]">
            <p className="mb-2 sm:mb-3 text-[9px] sm:text-[10px] tracking-[0.4em] text-white/50">
              COLLECTION
            </p>
            <h2
              className="mb-8 sm:mb-10 leading-none font-light"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              <span className="block text-4xl sm:text-5xl lg:text-7xl xl:text-8xl">
                ESSENTIAL
              </span>
              <span className="block text-4xl sm:text-5xl lg:text-7xl xl:text-8xl pl-8 sm:pl-10 lg:pl-16 xl:pl-20">
                COLLECTION
              </span>
            </h2>
            <p className="max-w-[160px] sm:max-w-[220px] md:max-w-[300px] text-xs sm:text-sm leading-relaxed text-white/60">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation
            </p>
          </div>

          <div className="flex-1" />

          <a
            href="#"
            className="mb-[10%] text-[10px] sm:text-xs tracking-[0.3em] text-white/80 hover:text-white transition-colors"
          >
            더 알아보기 &gt;
          </a>
        </div>
      </div>
    </section>
  );
}
