import { test, expect } from "@playwright/test";
import path from "path";

// carat 3차 리뷰 E2E
// 메인 페이지(PRISME 주얼리 랜딩) 렌더 + 반응형(모바일 390 / 데스크톱 1280) 캡처.
// 로그인 없는 화면이라 가벼운 렌더/스크롤 캡처 위주입니다.

const imagesDir = path.resolve(__dirname, "../../images");

test("데스크톱 1280 — 히어로 + 스크롤 후 콘텐츠 캡처", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");

  // 히어로의 브랜드 타이틀(h1)이 보이는지. footer에도 PRISME(h3)가 있어 h1으로 좁힙니다.
  await expect(page.locator("h1", { hasText: "PRISME" })).toBeVisible();

  // 히어로 첫 화면
  await page.screenshot({
    path: path.join(imagesDir, "3rd-desktop-hero.png"),
  });

  // 3D 히어로가 sticky h-[400vh]라 한참 스크롤해야 아래 섹션이 나옵니다.
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(800);

  await expect(
    page.getByRole("heading", { name: "BEST PIECES" })
  ).toBeVisible();

  await page.screenshot({
    path: path.join(imagesDir, "3rd-desktop-content.png"),
    fullPage: true,
  });
});

test("모바일 390 — 반응형 확인 캡처", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  await expect(page.locator("h1", { hasText: "PRISME" })).toBeVisible();

  await page.screenshot({
    path: path.join(imagesDir, "3rd-mobile-hero.png"),
  });

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(800);

  await page.screenshot({
    path: path.join(imagesDir, "3rd-mobile-content.png"),
    fullPage: true,
  });

  // 모바일에서 가로 스크롤(넘침)이 생기는지 — px-24 고정폭이라 확인용
  const overflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth;
  });
  console.log("[mobile] horizontal overflow:", overflow);
});
