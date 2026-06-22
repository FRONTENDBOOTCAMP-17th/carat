import { test, expect } from "@playwright/test";

// carat 일일 E2E (리뷰 전용) — 2026-06-16
// 핵심 목적: 지난 [필수] "모바일 반응형 깨짐"이 실제로 고쳐졌는지 화면으로 검증.
// 랜딩은 단일 페이지 "/" (Hero/SeasonalBanner/BestPieces/Collections/Footer).
// 3D Hero(react-three-fiber)는 렌더/애니메이션에 시간이 필요하므로
// networkidle 대신 domcontentloaded + waitForTimeout 사용.

const IMG = "../images/2026-06-22";

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
    await page.screenshot({
      path: `${IMG}/carat-D1-desktop.png`,
      fullPage: true,
    });
  });

  test("tablet 768 — 전체", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await settle(page);
    await page.screenshot({
      path: `${IMG}/carat-D2-tablet.png`,
      fullPage: true,
    });
  });

  test("mobile 390 — 전체 + 히어로 + 가로 오버플로 측정", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await settle(page);

    // 히어로 above-the-fold
    await page.screenshot({ path: `${IMG}/carat-D5-hero-mobile.png` });

    // 전체 페이지
    await page.screenshot({
      path: `${IMG}/carat-D3-mobile.png`,
      fullPage: true,
    });

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
      console.log(
        `[NAVBAR /collections] present=true hamburger=${hasHamburger}`,
      );
    } else {
      console.log("[NAVBAR /collections] present=false");
    }
  });

  // ===== 8차 신규: 리스트 페이지·로그인/회원가입 모달·위시리스트 =====

  test("D7 리스트 페이지(best-pieces·collections·fw-collections) 데스크톱/모바일", async ({
    page,
  }) => {
    for (const path of ["/best-pieces", "/collections", "/fw-collections"]) {
      const name = path.replace("/", "");
      await page.setViewportSize({ width: 1280, height: 900 });
      await page.goto(path, { waitUntil: "domcontentloaded" });
      await settle(page);
      await page.screenshot({
        path: `${IMG}/carat-D7-${name}-desktop.png`,
        fullPage: true,
      });
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(path, { waitUntil: "domcontentloaded" });
      await settle(page);
      const noOverflow = await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth + 1,
      );
      console.log(`[D7 ${path}] mobile noHorizontalOverflow=${noOverflow}`);
      await page.screenshot({
        path: `${IMG}/carat-D7-${name}-mobile.png`,
        fullPage: true,
      });
    }
  });

  test("D8 로그인/회원가입 모달(서브페이지 Navbar에서)", async ({ page }) => {
    // 로그인 트리거는 서브페이지 Navbar의 "로그인" 버튼이다.
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/collections", { waitUntil: "domcontentloaded" });
    await settle(page);

    const trigger = page.getByRole("button", { name: "로그인" }).first();
    const hasTrigger = (await trigger.count()) > 0;
    console.log(`[D8] login trigger present=${hasTrigger}`);
    if (hasTrigger) {
      await trigger.click().catch(() => {});
      await page.waitForTimeout(700);
    }
    // 로그인 모달
    await page.screenshot({ path: `${IMG}/carat-D8a-login-modal-desktop.png` });

    // 회원가입으로 전환
    const toSignup = page.getByRole("button", { name: "회원가입" }).first();
    if (await toSignup.count()) {
      await toSignup.click().catch(() => {});
      await page.waitForTimeout(500);
    }
    await page.screenshot({
      path: `${IMG}/carat-D8b-signup-modal-desktop.png`,
    });

    // 모바일 로그인 모달
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/collections", { waitUntil: "domcontentloaded" });
    await settle(page);
    const mTrigger = page.getByRole("button", { name: "로그인" }).first();
    if (await mTrigger.count()) {
      await mTrigger.click().catch(() => {});
      await page.waitForTimeout(700);
    }
    await page.screenshot({ path: `${IMG}/carat-D8c-login-modal-mobile.png` });
  });

  test("D9 위시리스트(신규) — 비로그인 가드 + 로그인 시드 후", async ({
    page,
  }) => {
    // 비로그인: AuthGuard 동작 확인
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/wishlist", { waitUntil: "domcontentloaded" });
    await settle(page);
    await page.screenshot({
      path: `${IMG}/carat-D9a-wishlist-guest.png`,
      fullPage: true,
    });

    // localStorage 기반 인증을 시드해 로그인 상태 재현
    await page.evaluate(() => {
      localStorage.setItem(
        "prisme_user",
        JSON.stringify({ email: "review@prisme.test", name: "리뷰" }),
      );
      localStorage.setItem("prisme_wishlist", JSON.stringify([]));
    });
    await page.goto("/wishlist", { waitUntil: "domcontentloaded" });
    await settle(page);
    await page.screenshot({
      path: `${IMG}/carat-D9b-wishlist-loggedin.png`,
      fullPage: true,
    });
    const noOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth + 1,
    );
    console.log(`[D9] wishlist desktop noHorizontalOverflow=${noOverflow}`);
  });
});
