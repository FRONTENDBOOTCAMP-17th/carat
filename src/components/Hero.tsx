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
  canRenderRingScene,
  type MousePos,
} from "@/components/RingScene";

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

// 완만하고 대칭적인 이징 — 양 끝에서 cubic 특유의 뚝뚝 끊기는 느낌 없이 부드럽게 가속/감속한다.
function easeInOutSine(t: number) {
  return -(Math.cos(Math.PI * t) - 1) / 2;
}

function Ring({
  progressRef,
  mouseRef,
  isMobileRef,
  envMap,
}: {
  progressRef: React.RefObject<number>;
  mouseRef: React.RefObject<MousePos>;
  isMobileRef: React.RefObject<boolean>;
  envMap: THREE.Texture;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const tiltRef = useRef<THREE.Group>(null);
  const spinRef = useRef<THREE.Group>(null);
  const rollRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Group>(null);
  const smooth = useRef(0);
  const mouseSmooth = useRef<MousePos>({ x: 0, y: 0 });
  const { viewport, size } = useThree();
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

    // 하나의 우아한 여정: 히어로 포즈(좌하단, 화면을 가득 채움) → IRIS ORIGINAL 옆(우측)에 안착.
    // 스크롤 대부분에 걸쳐 펼쳐지고 in-out으로 이징해서 뚝뚝 끊기지 않고 느리고 연속적으로 움직인다.
    // j가 아래 모든 히어로→안착 보간(scale · position · rotation)을 함께 구동한다.
    const j = easeInOutSine(Math.min(Math.max((p - 0.05) / 0.85, 0), 1));

    // 완전히 정지해 보이지 않도록 위치를 살짝 띄운다 (턴테이블 회전이 대부분의 역할을 함).
    const idleBob = Math.sin(t * 0.5) * 0.03;

    const isMobile = isMobileRef.current;

    // 안착 크기(scale이 j=1일 때 도달하는 값). 모바일(레이아웃 B): 반지가 풀와이드 오버레이 텍스트
    // 아래 중앙 배경으로 물러나므로 상한을 좁게 잡고, 안착 시 살짝 더 작게 만들어 경쟁하는 주인공이
    // 아니라 배경처럼 읽히게 한다.
    const baseScale = isMobile
      ? 1.25 * Math.max(0.4, Math.min(0.85, viewport.width / 3.4))
      : Math.max(0.4, Math.min(1.6, viewport.width / 4.0));
    const ringExtent = 1.35 * baseScale;
    // edgeMargin: maxPosX 그대로면 반지 오른쪽 끝이 뷰포트 끝에 정확히 닿아 애매하게 걸친 것처럼
    // 보인다 — 안착 시 안정적으로 프레임 안에 들어오도록 살짝 더 안쪽으로 당긴다.
    const edgeMargin = 0.35;
    const maxPosX = Math.max(0, viewport.width * 0.5 - ringExtent - edgeMargin);
    // px→world 변환: viewport.width 월드 단위가 size.width CSS px에 대응하므로, 오른쪽으로 20px는 이만큼이다.
    const px20 = (20 / size.width) * viewport.width;

    // ── 히어로 포즈 vs 안착 포즈 값을 모바일/데스크톱별로 한곳에 모음 ──
    // heroScale/heroX/heroRollZ/heroPitchX: 스크롤 시작(j=0), 화면을 가득 채운 첫인상.
    // settledX/settledY/settledRollZ/settledPitchX: 스크롤 끝(j=1), IRIS ORIGINAL 옆에 자리 잡은 모습.
    // scale은 baseScale(위)과 더 이상 연동하지 않는 독립 다이얼이라, 안착 크기를 조정해도
    // 히어로 크기는 안 변함(반대도 마찬가지) — heroScale만 별도로 조정.
    const cfg = isMobile
      ? {
          heroScale: Math.min(viewport.height / 2.6, viewport.width * 1.05),
          heroX: -0.25,
          // 안착 시 가로(X) 위치 — 모바일은 아래쪽 우측에 안착, 화면 정중앙 배경처럼 안 보이게.
          settledX: viewport.width * 0.14 + px20,
          // 안착 시 세로(Y) 위치
          settledY: -0.32,
          heroRollZ: 0.6 + Math.PI,
          settledRollZ: 0.6 + Math.PI,
          heroPitchX: Math.PI * -0.4,
          settledPitchX: Math.PI * -0.4,
        }
      : {
          // baseScale의 상한(위 1.6)을 올릴 경우, 이 하한(2.5)도 그보다 충분히 크게 유지할 것.
          heroScale: Math.max(2.5, viewport.height / 2.4),
          heroX: -0.7,
          // 안착 시 가로(X) 위치 — 우측에 안착, 보석이 텍스트를 향해 왼쪽을 보도록 회전.
          settledX: Math.min(viewport.width * 0.24, maxPosX),
          // 안착 시 세로(Y) 위치
          settledY: -0.15 * baseScale,
          heroRollZ: 0.6 + Math.PI, // 대각선/크라운이 우측 상단을 향함
          settledRollZ: 0.6 + Math.PI, // 안착 시 Z roll(대각선 기울기) — 여기만 바꾸면 안착 각도만 변경됨
          heroPitchX: Math.PI * -0.4, // 크라운을 살짝 내려다보는 각도
          settledPitchX: Math.PI * -0.5, // 안착 시 X lean(내려다보는 각도) — 여기만 바꾸면 안착 각도만 변경됨
        };

    groupRef.current.scale.setScalar(
      cfg.heroScale + (baseScale - cfg.heroScale) * j,
    );

    // 가장 바깥 tilt 그룹(화면 좌표계)에 마우스 패럴랙스를 적용 — 아래 roll/pitch보다 위에 적용해서,
    // 여정 중 반지가 얼마나 회전/기울어졌든 "마우스를 위로 → 반지가 커서 쪽으로 기운다"는 감각이
    // 항상 직관적으로 유지된다. 기울이면 밝은 환경맵 패널을 반사하는 면이 바뀌면서
    // 광채가 보석 표면을 옮겨다닌다(보석은 굴절 기반이라 조명을 무시함).
    mouseSmooth.current.x +=
      (mouseRef.current.x - mouseSmooth.current.x) * 0.07;
    mouseSmooth.current.y +=
      (mouseRef.current.y - mouseSmooth.current.y) * 0.07;
    tiltRef.current.rotation.x = -mouseSmooth.current.y * 0.12;
    tiltRef.current.rotation.y = mouseSmooth.current.x * 0.18;

    // 스크롤에 따라 수직(Y)축으로 도는 턴테이블 회전 — 아래의 roll/lean보다 위에 적용해서
    // 첫 프레임은 기준 구도를 그대로 유지하고(그 지점에서 spin = 0), 이후 반지 전체가 돌아가면서
    // 안착할 때 보석이 화면 왼쪽을 향하게 된다.
    spinRef.current.rotation.set(0, j * Math.PI * -0.45, 0);

    // Z roll · X lean: 히어로 값 → 안착 값으로 j에 따라 보간(scale·position과 동일한 패턴).
    rollRef.current.rotation.set(
      0,
      0,
      cfg.heroRollZ + (cfg.settledRollZ - cfg.heroRollZ) * j,
    );
    innerRef.current.rotation.set(
      cfg.heroPitchX + (cfg.settledPitchX - cfg.heroPitchX) * j,
      0,
      0,
    );

    // 위치: 히어로(화면 밖 좌하단) → 안착(cfg.settledX/settledY). 반지가 오른쪽 가장자리 밖으로
    // 살짝 삐져나가는 것은 의도된 것이다.
    groupRef.current.position.x = cfg.heroX + (cfg.settledX - cfg.heroX) * j;
    groupRef.current.position.y = -1.2 + (cfg.settledY + 1.2) * j + idleBob;
  });

  return (
    // groupRef: scale + position(스크롤) · tiltRef: 마우스 패럴랙스(화면 좌표계) · rollRef: Z roll
    // (스크롤) · innerRef: pitch(스크롤). 패럴랙스가 roll/pitch보다 위에 오도록 분리해서 화면 기준으로 직관적이게 함.
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

// Scene은 <Canvas> 안(클라이언트 전용)에 있으므로, document를 다루는 환경맵을
// SSR 중이 아니라 여기서 만든다. 같은 스튜디오 환경맵이 금속 반사와 보석에 모두 쓰인다.
function Scene({
  progressRef,
  mouseRef,
  isMobileRef,
}: {
  progressRef: React.RefObject<number>;
  mouseRef: React.RefObject<MousePos>;
  isMobileRef: React.RefObject<boolean>;
}) {
  const { gemEnv, metalEnv } = useStudioEnvMaps();
  useSceneEnvironment(metalEnv);
  return (
    <>
      <ClearColor />
      <Lights mouseRef={mouseRef} />
      <Ring
        progressRef={progressRef}
        mouseRef={mouseRef}
        isMobileRef={isMobileRef}
        envMap={gemEnv}
      />
    </>
  );
}

export default function Hero() {
  const { t } = useLang();
  const hasWebGL = useMemo(() => canRenderRingScene(), []);
  const target = useRef(0);
  const smooth = useRef(0);
  const progressRef = useRef(0);
  const mouseRef = useRef<MousePos>({ x: 0, y: 0 });
  // Canvas의 Ring(안무 담당)과 아래 DOM 스크림/텍스트가 함께 참조 — ref로 유지해서
  // rAF 루프가 리사이즈마다 재구독하지 않고도 최신 값을 읽는다.
  const isMobileRef = useRef(false);
  const navRevealedRef = useRef(false);
  const sectionRef = useRef<HTMLElement>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const essentialTextRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  // 반지의 픽셀 단위 레이트레이싱 굴절은 400vh 섹션을 완전히 지나간 뒤에는
  // 프레임 예산을 계속 쓸 이유가 없다 — 이게 없으면 Canvas의 rAF 루프(frameloop="always")가
  // 페이지 나머지 부분에서도 영원히 돌아간다.
  const [inView, setInView] = useState(true);

  // 가볍고 항상 켜져 있음: target/mouseRef를 최신 상태로 유지해서, 화면에 다시 들어와
  // 아래 rAF 루프가 재개될 때 장면이 튀지 않게 한다.
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
    const onResize = () => {
      isMobileRef.current = window.innerWidth < 640;
    };
    window.addEventListener("scroll", onScroll);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    onScroll();
    onResize();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("resize", onResize);
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

  // 테마 전환 시 반지 재조명이 뚝 끊기지 않고 의도된 전환처럼 보이도록 짧게 크로스페이드 —
  // 환경맵 자체는 거의 즉시 바뀌지만 그렇다.
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
        smooth.current += (target.current - smooth.current) * 0.055;
        const p = smooth.current;
        progressRef.current = p;
        const heroFade = Math.min(p / 0.3, 1);
        if (overlayRef.current) {
          // 다크 모드: 확실한 스크림(0.4). 라이트 모드: 밝은 페이지 위의 밝은 스크림은 싸구려처럼 보여서
          // 거의 안 보이게(~5%) 두고 (역시 줄어든) 텍스트 halo가 가독성을 담당하게 한다.
          // 모바일(레이아웃 B): 풀와이드 텍스트가 중앙 반지 위에 겹치므로, 스크림이 실제로
          // 가독성을 책임져야 해서 두 테마 모두에서 데스크톱보다 훨씬 강하게 넣는다.
          const isLight = document.documentElement.dataset.theme === "light";
          const scrimMax = isMobileRef.current
            ? isLight
              ? 0.32
              : 0.62
            : isLight
              ? 0.02
              : 0.4;
          overlayRef.current.style.opacity = String(heroFade * scrimMax);
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
          essentialTextRef.current.style.transform = `translateX(${isMobileRef.current ? 0 : -essentialEase * 20}px)`;
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
                // ACES 대신 Neutral(Khronos PBR Neutral): ACES는 하이라이트를 강하게 눌러서
                // 보석과 폴리시드 메탈을 돋보이게 하는 극단적인 흑백 대비를 뭉갠다.
                // Neutral은 그 대비를 살려준다 — 제품/주얼리 촬영에 더 적합.
                gl.toneMapping = THREE.NeutralToneMapping;
                gl.toneMappingExposure = 1.1;
                window.dispatchEvent(new Event("prisme:hero-ready"));
              }}
            >
              <Scene
                progressRef={progressRef}
                mouseRef={mouseRef}
                isMobileRef={isMobileRef}
              />
            </Canvas>
          ) : (
            // 정적 폴백(WebGL 미지원 클라이언트 + 안드로이드 Gecko, canRenderRingScene 참고).
            // 데코레이션용 fallback이라 next/image 최적화 대상이 아님.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src="/images/hero-fallback.webp"
              alt=""
              aria-hidden="true"
              // 20% 확대 + 우하단으로 이동시켜 반지 우측 ~15%가 프레임 밖으로 크롭되게(부모의
              // overflow-hidden이 잘라냄) — 화면을 꽉 채운 정적 이미지가 밋밋해 보이지 않도록.
              className="absolute inset-0 w-full h-full object-contain pointer-events-none scale-[1.2] translate-x-[8%] translate-y-[6%]"
              // WebGL 폴백 경로에서도 Canvas의 onCreated와 동일하게 준비 신호를 보낸다 —
              // 이게 없으면 로딩 화면이 hero-ready를 못 받아 8초 타임아웃까지 그대로 노출된다.
              // 로드 실패(onError) 시에도 로딩 화면이 걸리지 않도록 같은 신호를 쏜다.
              onLoad={() => window.dispatchEvent(new Event("prisme:hero-ready"))}
              onError={() => window.dispatchEvent(new Event("prisme:hero-ready"))}
            />
          )}
        </div>

        {/* 스크림: 페이지 배경색(라이트/다크 자동)의 부드러운 radial — 중앙 텍스트 뒤에서 가장 진하고
            화면 가장자리 전에 투명해진다 — 가장자리에서는 반지의 임팩트를 살리면서 텍스트 대비는 높인다.
            불투명도는 animate()에서 스크롤에 따라 구동된다. */}
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

        {/* 초기 중앙 정렬 히어로 텍스트 */}
        <div
          ref={heroTextRef}
          className="absolute inset-0 flex flex-col items-center justify-center text-content-primary"
          style={{
            textShadow: "var(--hero-text-halo)",
          }}
        >
          <h1
            className="mb-5 text-5xl sm:text-7xl lg:text-8xl font-medium"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            PRISME
          </h1>
          <div className="flex justify-center flex-col">
            <span className="block text-center text-sm sm:text-lg">
              {t.hero.tagline1}
            </span>
          </div>
        </div>

        {/* IRIS ORIGINAL 오버레이 */}
        <div
          ref={essentialTextRef}
          className="absolute top-0 bottom-0 left-4 sm:left-[7%] lg:left-[8%] right-4 sm:right-6 lg:right-8 flex flex-col text-content-primary"
          style={{
            opacity: 0,
            textShadow: "var(--hero-text-halo)",
          }}
        >
          {/* 모바일: 고정 헤더(Navbar py-5 + 로고 h-11 ≈ 84px = pt-21)를 피해서 네비가 드러났을 때
              IRIS ORIGINAL이 안 겹치게 한다 — 13vh 기준값은 헤더 도입 전에 잡은 것.
              margin + padding을 쌓아서 calc() 임의값을 피함; 데스크톱에서는 이 여백을 뺀다. */}
          <div className="mt-[13vh] pt-21 sm:pt-0">
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

        {/* 스크롤 힌트 */}
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
