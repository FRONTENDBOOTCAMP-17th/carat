import { test, expect } from "@playwright/test";

// carat 일일 E2E (리뷰 전용) — 2026-06-16
// 핵심 목적: 지난 [필수] "모바일 반응형 깨짐"이 실제로 고쳐졌는지 화면으로 검증.
// 랜딩은 단일 페이지 "/" (Hero/SeasonalBanner/BestPieces/Collections/Footer).
// 3D Hero(react-three-fiber)는 렌더/애니메이션에 시간이 필요하므로
// networkidle 대신 domcontentloaded + waitForTimeout 사용.

const IMG = "../images/2026-06-17";

// 3D 캔버스가 한 프레임 이상 그려질 시간을 확보
async function settle(page: import("@playwright/test").Page) {
  await page.waitForTimeout(2500);
}

test.describe("carat 랜딩 반응형 검증", () => {
  test("desktop 1280 — 전체 + 히어로", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await settle(page);

    // 히어로 above-the-fold (뷰포트만)
    await page.screenshot({ path: `${IMG}/carat-D4-hero-desktop.png` });

    // 전체 페이지
    await page.screenshot({ path: `${IMG}/carat-D1-desktop.png`, fullPage: true });
  });

  test("tablet 768 — 전체", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await settle(page);
    await page.screenshot({ path: `${IMG}/carat-D2-tablet.png`, fullPage: true });
  });

  test("mobile 390 — 전체 + 히어로 + 가로 오버플로 측정", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await settle(page);

    // 히어로 above-the-fold
    await page.screenshot({ path: `${IMG}/carat-D5-hero-mobile.png` });

    // 전체 페이지
    await page.screenshot({ path: `${IMG}/carat-D3-mobile.png`, fullPage: true });

    // 가로 스크롤(오버플로) 측정 — true 면 가로 스크롤 없음 = 좋은 반응형
    const noHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth + 1,
    );
    const metrics = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
    }));
    console.log(
      `[MOBILE 390] noHorizontalOverflow=${noHorizontalOverflow} ` +
        `(scrollWidth=${metrics.scrollWidth}, innerWidth=${metrics.innerWidth})`,
    );

    // 반응형이 의도대로면 가로 오버플로는 없어야 함
    expect(noHorizontalOverflow).toBeTruthy();
  });

  test("Navbar — 서브페이지(collections)에서 확인", async ({ page }) => {
    // Navbar 는 홈("/")이 아니라 collections 등 서브페이지에 렌더됨.
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/collections", { waitUntil: "domcontentloaded" });
    await settle(page);

    const nav = page.locator('nav[aria-label="주요 내비게이션"]');
    const hasNav = await nav.count();
    if (hasNav > 0) {
      await nav.screenshot({ path: `${IMG}/carat-D6-navbar-mobile.png` });
      // 햄버거(메뉴 열기) 버튼 존재 여부
      const hamburger = page.locator('button[aria-label="메뉴 열기"]');
      const hasHamburger = (await hamburger.count()) > 0;
      console.log(`[NAVBAR /collections] present=true hamburger=${hasHamburger}`);
    } else {
      console.log("[NAVBAR /collections] present=false");
    }
  });
});
