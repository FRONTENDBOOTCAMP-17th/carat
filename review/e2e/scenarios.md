# carat E2E 시나리오 (리뷰 전용)

랜딩은 단일 페이지 `/` (Hero · SeasonalBanner · BestPieces · Collections · Footer).
Navbar 는 홈이 아니라 `/collections` 등 서브페이지에서 렌더됨.
3D Hero(react-three-fiber)는 렌더에 시간이 필요해 `domcontentloaded` + 2.5s 대기로 캡처.

| ID | 시나리오 | 기대 | 최근결과 (2026-06-16) |
|----|----------|------|------------------------|
| D1 | desktop 1280 `/` 전체 캡처 | 섹션 정상 배치, 레이아웃 깨짐 없음 | 통과 |
| D2 | tablet 768 `/` 전체 캡처 | 중간 뷰포트에서 여백/그리드 정상 | 통과 |
| D3 | mobile 390 `/` 전체 캡처 | 텍스트 겹침/그리드 찌그러짐 없음, 여백 일관 | 통과 |
| D4 | desktop 히어로 above-the-fold | 3D 히어로 렌더, 카피 정상 | 통과 |
| D5 | mobile 히어로 above-the-fold | 히어로가 모바일 폭에 맞게 표시 | 통과 |
| D3-overflow | mobile 390 가로 오버플로 측정 | `scrollWidth <= innerWidth+1` (가로 스크롤 없음) | 통과 (아래 측정값) |
| D6 | Navbar (`/collections`, mobile) | 내비 렌더 + 햄버거 버튼 존재 | 통과 |

## 발견 (2026-06-16) — 반응형 검증 중심

- **반응형 OK.** 모바일 390 가로 오버플로 없음: `scrollWidth=390, innerWidth=390` (가로 스크롤 0).
- **그리드가 뷰포트별로 단계적으로 접힘** (지난 [필수] "모바일 깨짐"이 실제로 해결됨):
  - BEST PIECES: desktop 4열 → tablet 3열 → mobile 2열
  - COLLECTIONS: desktop 5열 → tablet 3열 → mobile 2열
  - 텍스트 겹침/그리드 찌그러짐 없음, 섹션 좌우 여백 일관.
- **3D 히어로** 데스크탑/모바일 모두 정상 렌더, 카피("PRISME" + 서브카피) 모바일 폭 안에서 깔끔히 줄바꿈.
- **Navbar**(`/collections`): 렌더됨 + 햄버거(메뉴 열기) 버튼 존재. 단 홈("/")에는 Navbar 미렌더(서브페이지에만 있음).
- **[버그] SeasonalBanner 이미지 404**: `SeasonalBanner.tsx`가 `/images/fw-2026.jpg`를 참조하나
  `public/images/` 디렉터리 자체가 없음(SVG만 public 루트에 존재).
  콘솔: `The requested resource isn't a valid image for /images/fw-2026.jpg received null`.
  → 2026 F/W 배너가 검은 빈 영역으로 표시됨(D1/D2/D3 중단부 큰 여백). 이미지 추가 또는 경로 수정 필요.
- 빌드: `tsc --noEmit` 통과, `next build` 통과(모든 라우트 Static ○).

<<<<<<< HEAD
## 8차 추가 (2026-06-18) — 인증·위시리스트·리스트 페이지
| ID | 시나리오 | 대상 | 기대 | 결과 |
|----|----------|------|------|------|
| D7 | 리스트 3종 데스크톱/모바일 | /best-pieces·/collections·/fw-collections | 렌더, 오버플로 없음 | pass(모바일390 오버플로0) |
| D8 | 로그인 모달(신규) | / → 로그인 트리거 | 모달 | 홈 트리거 미발견(서브 Navbar), D9a로 확인 |
| D9a | 위시리스트 비로그인 가드 | /wishlist | 로그인 모달 | pass(LOGIN 모달) |
| D9b | 위시리스트 로그인(시드) | localStorage prisme_user 시드 | 빈상태 화면 | pass |

발견(8차):
- [필수·이월] SeasonalBanner.png 34MB 그대로 — 리사이즈+WebP 권장.
- [칭찬] 인증/위시리스트 가드(AuthGuard), 리스트 완성도, 접근성(색상대비·터치타겟), 반응형 우수.
- [제안] 인증 localStorage 전용(데모) — AuthContext 인터페이스 유지로 백엔드 전환 용이.
- tsc 0(framer-motion 6건은 강사 로컬 stale node_modules, install 후 0). env 불필요.
<<<<<<< Updated upstream
## 7차 (2026-06-17)
- D1~D6 통과. 6차 [필수] SeasonalBanner 404 해소(이미지 추가→F/W COLLECTIONS 배너 정상). 모바일390 가로오버플로 0(반응형 유지). tsc 0.
- 새 [필수]: SeasonalBanner.png 34MB(과대) → 최적화 필요. [사소] next.config images.qualities 미설정(Next16 quality 85 경고).
=======
=======
## 7차 (2026-06-17)
- D1~D6 통과. 6차 [필수] SeasonalBanner 404 해소(이미지 추가→F/W COLLECTIONS 배너 정상). 모바일390 가로오버플로 0(반응형 유지). tsc 0.
- 새 [필수]: SeasonalBanner.png 34MB(과대) → 최적화 필요. [사소] next.config images.qualities 미설정(Next16 quality 85 경고).
>>>>>>> main
>>>>>>> Stashed changes
