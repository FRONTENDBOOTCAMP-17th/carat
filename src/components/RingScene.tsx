"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF, MeshRefractionMaterial } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

// Hero_Ring 모델을 보여주는 모든 씬이 공유하는 빌딩 블록 — 스크롤로 구동되는 Hero 여정(Hero.tsx)과
// 드래그로 회전시키는 IRIS ORIGINAL 뷰어(EssentialRingViewer.tsx) 둘 다 스튜디오 조명/재질/지오메트리
// 설정을 중복 구현하는 대신 이 모듈을 마운트해서 사용한다.

// base/input 헥스 값은 globals.css의 --c-surface-base / --c-surface-input (light/dark)에서 그대로
// 복사해온 것 — getComputedStyle로 실시간 읽는 대신 이렇게 한 이유는, CSS 변수를 여기서 읽으려면
// getComputedStyle의 oklch() 직렬화 결과를 THREE.Color.setStyle()이 파싱 가능한 형태로 역변환해야
// 하는데 이게 브라우저마다 보장되지 않기 때문. 하드코딩은 buildStudioEquirect 자체 관례와도 일치한다.
// stage: 디자인 시스템 토큰이 아님. surface-input은 Tailwind의 zinc 계열이라 옅은 청색 기운이 있는데,
// 폼 필드 크롬에는 괜찮지만 제품 사진 뒤에서는 미완성된 "푸르스름한 회색"처럼 보인다. 진짜 R=G=B
// 중립색(색조/채도 0)은 특정 금속 톤에 치우치지 않으며, 의도적으로 페이지와 구별되는 무채색 제품
// 스테이지를 쓰는 이커머스 상품사진 관례와도 맞는다.
const CLEAR_COLORS = {
  base: { light: "#fafafa", dark: "#09090b" },
  input: { light: "#d4d4d8", dark: "#3f3f46" },
  stage: { light: "#d9d9d9", dark: "#2b2b2b" },
} as const;

// gl={{ alpha:false }}이므로 캔버스가 불투명해서 clear color가 그대로 배경으로 보인다.
// variant="base"(기본값, Hero): bg-surface-base와 맞춰서 섹션이 페이지에 자연스럽게 녹아든다.
// variant="stage"(Essential 뷰어): 페이지와 섞이지 않고 의도적으로 구별되는 웜뉴트럴 배경을 사용
// (일반적인 제품사진 관례).
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

// 프로시저럴 무채색 스튜디오 환경맵(equirectangular 캔버스), 재질별 필요에 맞게 튜닝됨:
//   - 보석(forMetal=false): 거의 검은색 배경 + 부드러운 흰색 소프트박스 덩어리. MeshRefractionMaterial이
//     이걸 선명하게 레이트레이싱함 → 밝은/어두운 면 대비 = 반짝임. 라이트 모드에서는 어두운 반사체를
//     추가해서 밝은 페이지 위에서도 면이 어두운 쪽을 유지하게 한다.
//   - 금속(forMetal=true): 수직 스튜디오 "스윕" 그라디언트 + 각진(SHARP) 사각형 소프트박스. 단색을
//     비추는 거의 완전한 거울은 값싼 회색 플라스틱처럼 보인다(변화가 없어서); 그라디언트는 곡면 밴드에
//     밝음→어두움 스윕을 주고, 각진 사각형은 실제 폴리시드 메탈 하이라이트 줄무늬로 보이게 한다.
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
    // 부드럽지만 윤곽이 뚜렷한 사각형 소프트박스 → 폴리시드 밴드에 선명한 반사 줄무늬
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
      // 강한 어두운 반사체 → 폴리시드 밴드에 균일한 흰 면이 아니라 짙은 어두운 반사 영역(대비/형태감)이
      // 생김. 이게 없으면 밝은 환경맵 위의 거울은 흰 플라스틱처럼 보인다.
      box(720, 430, 600, 300, "rgba(0,0,0,0.8)");
      box(150, 640, 480, 320, "rgba(0,0,0,0.72)");
      box(1560, 790, 400, 260, "rgba(0,0,0,0.74)");
    }
    // 선명하고 얇은 바(각진 가장자리는 밴드를 가로지르는 밝은 선처럼 보임)
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(120, 700, 1000, 9);
    ctx.fillRect(1280, 640, 620, 7);
    return finish();
  }

  // 다크 모드는 원래 #0a0a0a였음 — 스파클 덩어리 사이가 거의 완전한 검은색이라 면이 컷팅된 보석이
  // 아니라 평평한 블랙홀처럼 보였음. 면 구조가 읽힐 정도로만 살짝 밝게 올리되, 덩어리들은 여전히
  // 확실히 밝은 스파클 포인트로 보이도록 유지.
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
  // 밝은 key/fill 소프트박스 + 작은 스파클 소스 (두 테마 모두)
  blob(540, 300, 340, 1);
  blob(1460, 350, 300, 0.9);
  blob(1024, 150, 520, 0.7);
  blob(300, 640, 120, 1);
  blob(1780, 560, 130, 0.95);
  blob(1180, 760, 90, 1);
  blob(760, 820, 70, 0.9);
  // 라이트 모드 전용: 강한 어두운 반사체를 넣어 밝은 배경 위에서도 면이 짙은 어두운 쪽을 갖게 함 —
  // 없으면 무채색 보석이 밝은 톤만 굴절해서 흰 플라스틱처럼 보인다.
  if (isLight) {
    blob(760, 380, 320, 0.92, true);
    blob(1450, 560, 340, 0.88, true);
    blob(320, 720, 260, 0.85, true);
    blob(1780, 240, 240, 0.82, true);
  }
  return finish();
}

// <Canvas> 내부(클라이언트 전용)에서만 실행되어야 함 — `document`를 사용하기 때문. 토글할 때마다
// 다시 만드는 대신 마운트 시 두 테마의 환경맵을 한 번에 미리 구워둔다: 이미 구운 텍스처로 바꾸는
// 건 단순 참조 할당이지만, 테마가 바뀔 때마다 equirect 캔버스를 다시 그리고 PMREM을 새로 굽는 건
// (아래 metalEnv 참고) 눈에 보이는 재조명 지연을 만들었던 원인이다.
export function useStudioEnvMaps(
  // 다크 테마 보석 환경맵은 의도적으로 거의 검은 배경임(Hero는 어두운 페이지 위에서 선명한 스파클
  // 대비를 원함) — 하지만 독립된 제품 사진에는 페이지의 앰비언트 장식이 어울리지 않으므로, Essential
  // 뷰어는 페이지 테마와 무관하게 gemTheme을 "light"로 고정해서 보석이 거의 검게 죽지 않고 맑고
  // 밝게 보이게 한다. 금속은 여전히 실제 페이지 테마(실버/골드/로즈골드 밴드 톤)를 따른다.
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

  // 두 테마의 원본 equirect 캔버스 — 네 개 모두 한 번씩만 만들어 유지해도 비용이 저렴함.
  const raw = useMemo(
    () => ({
      gemDark: buildStudioEquirect(false, false),
      gemLight: buildStudioEquirect(true, false),
      metalDark: buildStudioEquirect(false, true),
      metalLight: buildStudioEquirect(true, true),
    }),
    [],
  );

  // 금속 밴드는 scene.environment에서 반사를 읽어온다. drei의 <Environment>는 소스 맵이 바뀔 때마다
  // 이걸 다시 굽는데(PMREM), 이게 토글에서 실제로 비용이 큰 부분이다 — 두 테마를 미리 한 번씩 구워두면
  // 토글이 단순 텍스처 교체가 된다.
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

// 이펙트 안에서 직접 대입하는 대신 매 프레임 scene.environment를 동기화한다 — 직접 대입하면
// useThree()가 반환하는 `scene`을 변조하게 되는데, 이는 react-hooks/immutability(React Compiler
// 규칙)에서 금지하는 패턴이다. useStudioEnvMaps()와 함께 씬마다 한 번씩 마운트할 것.
export function useSceneEnvironment(metalEnv: THREE.Texture) {
  useFrame((state) => {
    if (state.scene.environment !== metalEnv) {
      state.scene.environment = metalEnv;
    }
  });
}

// SSR 중에는 false를 반환(window가 없으므로) — 클라이언트가 확인해주기 전까지는 "지원됨"으로 취급.
export function supportsWebGL(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

// 실시간 3D 링을 마운트할지, 아니면 정적 스틸컷/틴트로 폴백할지 결정.
// 안드로이드의 Gecko Firefox는 WebGL2를 지원한다고 보고하지만, 보석에 쓰이는
// MeshRefractionMaterial(BVH를 float/integer 텍스처에 담아 프래그먼트 셰이더에서 레이트레이싱함)은
// 거기서 하얗게 날아간 화면을 렌더링한다. 단순 재질을 쓰는 밴드는 괜찮다. 그 엔진에 눈에 띄게
// 깨진 보석을 노출하느니, WebGL 미지원 클라이언트처럼 취급해서 폴백이 대신 뜨게 한다.
// UA 판별은 일부러 좁게 잡음: "Firefox/" + "Android"는 안드로이드(모바일·태블릿)의 Gecko만 잡아내고,
// 데스크톱 Firefox("Android" 없음, 정상 렌더링됨)와 iOS Firefox("FxiOS"로 표시되고 "Firefox/"는
// 아님 — 내부는 WebKit이라 별개 엔진임)는 제외한다.
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

  // 금속은 몸체 톤과 반사를 metalEnv에서 얻는다; 이 라이트들은 은은하게 움직이는 스펙큘러만 더해준다.
  // 앰비언트 라이트는 의도적으로 없음 — 평평한 앰비언트는 금속의 검은 영역을 들뜨게 해서 대비를 죽인다.
  return (
    <>
      {/* Key — 전면 좌측 */}
      <pointLight
        ref={keyRef}
        position={[-2.5, 4, 2]}
        intensity={9}
        color="#ffffff"
      />
      {/* Fill — 전면 우측 */}
      <pointLight position={[3, 1, 3]} intensity={4} color="#ffffff" />
      {/* Rim — 밴드 가장자리 분리 */}
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

// 다이아몬드 전용 재질. 버퍼 기반 transmission(작은 면에서는 흐릿해지고, 보석 뒤에 밝은 지오메트리가
// 필요함)과 달리, MeshRefractionMaterial은 envMap을 보석의 BVH를 통해 레이트레이싱한다 — 배경 없이도
// 스튜디오 환경맵에서 바로 선명한 면별 광채가 나온다. drei 래퍼가 이 메시의 지오메트리로부터 BVH를
// 자동으로 만들어준다.
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
  // 작은 파베 멜레는 큼직한 마퀴즈보다 훨씬 밀도 높은 브릴리언트 컷이라, bounces와 aberration을
  // 최대로 쓰면 너무 산만하게 반짝이며 충돌한다. 값을 낮춰서 차분하게 만든다.
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

// GLB 자체 좌표계를 합리적인 유닛 스케일로 정규화하고, 중심을 맞추고, 카메라를 향해 똑바로 세운 것 —
// 이 링을 보여주는 모든 씬이 공유한다(Hero의 스크롤 여정은 이걸 자체 애니메이션 트랜스폼 그룹으로
// 감싸고, Essential 뷰어는 대신 OrbitControls로 감싼다).
export function RingModel({
  nodes,
  envMap,
  metalColor = "#cfcfcf",
  // 무채색 스튜디오 환경맵(buildStudioEquirect)은 중립적인 백금/실버 거울에 맞춰 튜닝되어서,
  // roughness=0의 아주 날카로운 반사가 "고급스러운 크롬"처럼 보인다. 같은 거울에 골드/로즈골드
  // 색을 입히면 이 트릭이 드러난다 — 무채색 환경맵 위의 색이 있는 완전 거울은 "색 필터를 씌운
  // 플라스틱"처럼 보인다. roughness를 살짝 주면 거울의 날카로운 가장자리가 깨지면서 진짜 폴리시드
  // 메탈처럼 보인다. 기본값은 0으로 두어 Hero의 튜닝된 실버 룩에는 영향이 없게 함.
  roughness = 0,
}: {
  nodes: RingGLTFNodes;
  envMap: THREE.Texture;
  metalColor?: string;
  roughness?: number;
}) {
  return (
    // 기본 방향: Hero_Ring은 XZ 평면에 눕혀져 있음; 카메라를 향하도록 세운다
    <group rotation={[Math.PI / 2, 0, 0]}>
      {/* 정규화: 모델은 GLB 유닛 기준 가로 폭이 약 12.77 → 약 2.7로 축소(reveal scale 계산과 맞춤) */}
      <group scale={0.21}>
        {/* 센터링 오프셋: GLB 전역 bbox 중심은 대략 (19.245, 0, 0.769) */}
        <group position={[-19.245, 0, -0.769]}>
          {/* 밴드 & 하우징 — 밝은 폴리시드 메탈, 기본값은 거의 거울에 가까움. 모델 자체의 챔퍼(모따기,
              roughness 아님)가 뉴트럴한 Hero 룩을 위한 가장자리 부드러움을 담당한다. */}
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
          {/* Transmission 보석들 — 각 버텍스가 자체 배치를 담고 있음(identity node transform).
              색상은 의도적으로 metalColor와 연동하지 않음 — 금속 마감을 바꾼다고 보석 자체가
              물들면 안 되기 때문. */}
          <Diamond geometry={nodes.MainStone.geometry} envMap={envMap} />
          <Diamond geometry={nodes.SideStone.geometry} envMap={envMap} />
          <Diamond geometry={nodes.SideStoneRight.geometry} envMap={envMap} />
          {/* Pave — 노드가 GLB 로컬 공간에서 자체 이동+회전(quaternion)을 담고 있음. 밀도 높은 멜레가
              각진 저폴리곤 마퀴즈보다 과하게 반짝이며 충돌하지 않도록 차분하게 조정(bounces를 줄이고
              색수차 없앰). */}
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
