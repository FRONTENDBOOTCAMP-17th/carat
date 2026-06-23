import { test } from "@playwright/test";
import fs from "node:fs";

// carat(PRISME) 데일리 E2E (2026-06-23) — 정적 디자인 쇼케이스 스모크
const DATE = "2026-06-23";
const IMG = `../images/${DATE}`;
test.beforeAll(() => fs.mkdirSync(IMG, { recursive: true }));

async function visit(page: any, path: string, name: string) {
  const r = await page.goto(path, { waitUntil: "domcontentloaded" });
  console.log(`[${path}] HTTP ${r?.status()}`);
  await page.waitForTimeout(2500);
  await page.screenshot({ path: `${IMG}/carat-${name}.png`, fullPage: false });
}

test("디자인 쇼케이스: 홈→컬렉션→위시리스트", async ({ page }) => {
  await visit(page, "/", "01-home");
  await visit(page, "/collections", "02-collections");
  await visit(page, "/wishlist", "03-wishlist");

  // 모바일 뷰(390px) — 반응형 회귀
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: `${IMG}/carat-04-home-mobile.png`, fullPage: false });
});
