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

// 절대 업데이트되지 않음 — Hero의 마우스 패럴랙스용으로 만들어진 조명 리그가 그냥 기본 위치에
// 고정되는데, 여기서는 OrbitControls가 인터랙션을 담당하므로 일반적인 고정 3점 스튜디오 조명처럼 보인다.
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
      {/* Hero의 정확한 기준 포즈로 되돌림 — 기울기를 줄이려던 시도가 오히려 링을 "/" 대각선으로
          기울어 보이게 만들었음(X/Z 오일러 회전은 독립적으로 분해되지 않아서, 살짝 조정한다고
          "기울기가 조금 덜한" 결과가 나오지 않음). 시각적 피드백을 직접 보면서만 다시 손댈 것;
          그 동안은 OrbitControls의 자유 드래그로 사용자가 직접 방향을 조정할 수 있음. */}
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
  // RingModel의 roughness 주석 참고 — 이 무채색 환경맵 위에서 색이 있는 금속은 색 필터를 씌운
  // 거울이 아니라 진짜 폴리시드 메탈처럼 보이려면 약간의 roughness가 필요함. 페이지에서 스와치별로
  // 전달함(silver: 0, gold/rose-gold: 작은 0이 아닌 값).
  roughness?: number;
  fallbackTint: string;
  canvasLabel: string;
}) {
  const hasWebGL = useMemo(() => canRenderRingScene(), []);
  const wrapRef = useRef<HTMLDivElement>(null);
  // 화면 밖으로 나가는 즉시 렌더링을 일시정지 — Hero의 Canvas와 같은 이유: 스크롤을 지나친 뒤에도
  // 픽셀 단위 레이트레이싱 굴절이 계속 프레임 예산을 쓸 이유가 없음.
  const [inView, setInView] = useState(true);
  // 관례: 자동 회전은 로드 시 인터랙션을 유도하지만, 사용자가 한 번 잡으면 영구적으로 멈춘다 —
  // 사용자가 놓은 위치 그대로 있어야지, 밑에서 다시 돌기 시작하면 안 됨.
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
        // WebGL 미지원 시 폴백 — 이 제품은 아직 촬영된 스틸컷이 없어서, 아무것도 없는 대신
        // 스와치 틴트 워시로 대체함.
        <div
          className="absolute inset-0 transition-colors duration-700"
          style={{ backgroundColor: fallbackTint }}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
