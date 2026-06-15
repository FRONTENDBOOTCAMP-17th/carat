import { test, expect } from "@playwright/test";
import path from "node:path";

// ── 리뷰 전용 E2E (carat / 5조) ────────────────────────────────────────────
// 아직 create-next-app 템플릿 단계라, 첫 화면 렌더와 기본 metadata만 확인한다.

const IMG = (name: string) => path.join(__dirname, "..", "..", "images", name);

test("01 홈 화면 렌더 + 기본 metadata 확인", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("body")).toBeVisible();
  await page.screenshot({ path: IMG("01-home.png"), fullPage: true });

  // 템플릿 기본값이 그대로인지(리뷰의 [필수] 근거) 확인용 로그
  const title = await page.title();
  const lang = await page.locator("html").getAttribute("lang");
  console.log(`title="${title}"  html lang="${lang}"`);
});
