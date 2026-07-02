import { test, expect } from "@playwright/test";
import fs from "node:fs";

// carat(PRISME) 데일리 E2E — 리스트·상세·검색 신규 UI 포함
// 16차(2026-07-01): 제품 상세 서버 컴포넌트 전환(generateMetadata per-page title),
//                    SearchModal 키보드 네비(combobox/listbox ARIA), 컬렉션 컴포넌트 추출
const DATE = "2026-07-02";
const IMG = `../images/${DATE}`;
test.beforeAll(() => fs.mkdirSync(IMG, { recursive: true }));

const DESKTOP = { width: 1280, height: 800 };
const MOBILE  = { width: 390,  height: 844 };

async function screenshot(page: any, name: string) {
  await page.screenshot({ path: `${IMG}/carat-${name}.png`, fullPage: false });
}

/** 가로 overflow 측정: scrollWidth > innerWidth 이면 px 반환, 없으면 0 */
async function measureOverflow(page: any): Promise<number> {
  return page.evaluate(() => {
    const sw = document.documentElement.scrollWidth;
    const iw = window.innerWidth;
    return sw > iw ? sw - iw : 0;
  });
}

// ────────────────────────────────────────────────
// 시나리오 01: 홈(3D 히어로) 데스크탑·모바일
// ────────────────────────────────────────────────
test("01 홈 — 3D 히어로, 데스크탑·모바일", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  const r = await page.goto("/", { waitUntil: "domcontentloaded" });
  console.log(`[/] HTTP ${r?.status()}`);
  await page.waitForTimeout(3000); // 3D canvas 렌더링 대기
  // h1은 hero 타이틀 (footer의 PRISME는 h3)
  const heroH1 = page.locator("h1", { hasText: /PRISME/i }).first();
  console.log(`[home] hero h1 count: ${await page.locator("h1").count()}`);
  await screenshot(page, "01-home-desktop");

  // 모바일
  await page.setViewportSize(MOBILE);
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2500);
  const mobileOverflow = await measureOverflow(page);
  console.log(`[home mobile] overflow: ${mobileOverflow}px`);
  await screenshot(page, "01-home-mobile");
});

// ────────────────────────────────────────────────
// 시나리오 02: 컬렉션 리스트 페이지 (신규 UI) — 데스크탑·모바일
// ────────────────────────────────────────────────
test("02 컬렉션 리스트 — 신규 UI, 데스크탑·모바일", async ({ page }) => {
  // 데스크탑
  await page.setViewportSize(DESKTOP);
  const r = await page.goto("/collections", { waitUntil: "domcontentloaded" });
  console.log(`[/collections] HTTP ${r?.status()}`);
  await page.waitForTimeout(1500);

  const heading = page.locator("h1");
  console.log(`[collections] h1 text: ${await heading.textContent()}`);
  // 제품 카드 수 확인
  const cards = page.locator("article");
  console.log(`[collections] product cards: ${await cards.count()}`);
  await screenshot(page, "02-list-desktop");

  // 모바일
  await page.setViewportSize(MOBILE);
  await page.goto("/collections", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1200);
  const listMobileOverflow = await measureOverflow(page);
  console.log(`[collections mobile] overflow: ${listMobileOverflow}px`);
  await screenshot(page, "02-list-mobile");
  expect(listMobileOverflow, "컬렉션 리스트 모바일 가로 overflow").toBe(0);
});

// ────────────────────────────────────────────────
// 시나리오 02b: Best Pieces 리스트 페이지
// ────────────────────────────────────────────────
test("02b Best Pieces 리스트 — 모바일", async ({ page }) => {
  await page.setViewportSize(MOBILE);
  const r = await page.goto("/best-pieces", { waitUntil: "domcontentloaded" });
  console.log(`[/best-pieces] HTTP ${r?.status()}`);
  await page.waitForTimeout(1200);
  const overflow = await measureOverflow(page);
  console.log(`[best-pieces mobile] overflow: ${overflow}px`);
  await screenshot(page, "02b-best-pieces-mobile");
  expect(overflow, "Best Pieces 모바일 가로 overflow").toBe(0);
});

// ────────────────────────────────────────────────
// 시나리오 03: 상품 상세 페이지 (신규 Breadcrumb + RelatedScroll)
// ────────────────────────────────────────────────
test("03 상품 상세 — Breadcrumb·RelatedScroll, 데스크탑·모바일", async ({ page }) => {
  // collections 첫 번째 상품
  await page.setViewportSize(DESKTOP);
  const r = await page.goto("/products/collections-0", { waitUntil: "domcontentloaded" });
  console.log(`[/products/collections-0] HTTP ${r?.status()}`);
  await page.waitForTimeout(1500);

  // Breadcrumb 확인 — nav[aria-label="Breadcrumb"]
  const breadcrumbNav = page.locator("nav[aria-label='Breadcrumb']");
  const breadcrumbVisible = await breadcrumbNav.isVisible().catch(() => false);
  console.log(`[detail] Breadcrumb visible (desktop): ${breadcrumbVisible}`);

  // 상품 h1
  const detailH1 = page.locator("h1");
  console.log(`[detail] h1 text: ${await detailH1.textContent()}`);

  // RelatedScroll 영역 존재 여부
  const related = page.locator("[class*='overflow-x-auto']");
  console.log(`[detail] RelatedScroll container count: ${await related.count()}`);

  await screenshot(page, "03-detail-desktop");

  // 모바일
  await page.setViewportSize(MOBILE);
  await page.goto("/products/collections-0", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);

  // 모바일에서 Breadcrumb는 숨겨지고 BackButton만 노출
  const breadcrumbMobile = page.locator("nav[aria-label='Breadcrumb']");
  const breadcrumbMobileVisible = await breadcrumbMobile.isVisible().catch(() => false);
  console.log(`[detail] Breadcrumb visible (mobile): ${breadcrumbMobileVisible}`);

  const detailOverflow = await measureOverflow(page);
  console.log(`[detail mobile] overflow: ${detailOverflow}px`);
  await screenshot(page, "03-detail-mobile");
  expect(detailOverflow, "상품 상세 모바일 가로 overflow").toBe(0);
});

// ────────────────────────────────────────────────
// 시나리오 04: RelatedScroll 스크롤 영역 캡처
// ────────────────────────────────────────────────
test("04 RelatedScroll — 데스크탑 스크롤 영역", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto("/products/collections-0", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);

  // RelatedScroll 섹션까지 스크롤
  const relatedSection = page.locator("[class*='border-t']").last();
  await relatedSection.scrollIntoViewIfNeeded().catch(() => {});
  await page.waitForTimeout(500);
  await screenshot(page, "04-related-scroll");

  // 스크롤 버튼 aria-label 확인
  const nextBtn = page.locator("button[aria-label='다음']");
  const prevBtn = page.locator("button[aria-label='이전']");
  console.log(`[related] 다음 버튼 count: ${await nextBtn.count()}`);
  console.log(`[related] 이전 버튼 count: ${await prevBtn.count()}`);

  // 첫 상태에서 이전 버튼은 숨김(tabIndex -1), 다음 버튼은 표시
  const nextTabIndex = await nextBtn.first().getAttribute("tabindex").catch(() => null);
  const prevTabIndex = await prevBtn.first().getAttribute("tabindex").catch(() => null);
  console.log(`[related] 다음 tabIndex: ${nextTabIndex}, 이전 tabIndex: ${prevTabIndex}`);
});

// ────────────────────────────────────────────────
// 시나리오 05: 위시리스트 페이지 — 기존 기능 유지 확인
// ────────────────────────────────────────────────
test("05 위시리스트 페이지 — 빈 상태", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  const r = await page.goto("/wishlist", { waitUntil: "domcontentloaded" });
  console.log(`[/wishlist] HTTP ${r?.status()}`);
  await page.waitForTimeout(1200);
  await screenshot(page, "05-wishlist-desktop");

  // 모바일
  await page.setViewportSize(MOBILE);
  await page.goto("/wishlist", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1000);
  const wishOverflow = await measureOverflow(page);
  console.log(`[wishlist mobile] overflow: ${wishOverflow}px`);
  await screenshot(page, "05-wishlist-mobile");
});

// ────────────────────────────────────────────────
// 시나리오 06: FW Collections + 상세 (Breadcrumb)
// ────────────────────────────────────────────────
test("06 FW Collections 리스트·상세", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  const r = await page.goto("/fw-collections", { waitUntil: "domcontentloaded" });
  console.log(`[/fw-collections] HTTP ${r?.status()}`);
  await page.waitForTimeout(1200);
  await screenshot(page, "06-fw-collections-desktop");

  // fw-collections 첫 상품 상세
  await page.goto("/products/fw-collections-0", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);
  const breadcrumb = page.locator("nav[aria-label='Breadcrumb']");
  const crumbText = await breadcrumb.textContent().catch(() => "");
  console.log(`[fw detail] breadcrumb text: ${crumbText}`);
  await screenshot(page, "06-fw-detail-desktop");
});

// ────────────────────────────────────────────────
// 시나리오 07(신규): 상품 상세 per-page <title> — 서버 컴포넌트 전환 검증
// ────────────────────────────────────────────────
test("07 상품 상세 — generateMetadata per-page title", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  const r = await page.goto("/products/collections-0", { waitUntil: "domcontentloaded" });
  console.log(`[/products/collections-0] HTTP ${r?.status()}`);
  const title = await page.title();
  const h1 = await page.locator("h1").first().textContent();
  console.log(`[detail] <title>: "${title}" | h1: "${h1}"`);
  // 서버 컴포넌트 전환 후 상세는 제품명이 <title>에 들어와야 함(홈 default "PRISME"가 아님)
  expect(title, "상세 <title>이 제품명 반영").not.toBe("PRISME");
  await screenshot(page, "07-detail-title");
});

// ────────────────────────────────────────────────
// 시나리오 08(신규): 검색 모달 — 인라인 결과 + 키보드 네비(↓↓ Enter)
// ────────────────────────────────────────────────
test("08 검색 모달 — 키보드 네비게이션", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto("/collections", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(800);

  // Navbar의 검색 트리거(aria-label에 검색/search 포함) 클릭
  const searchTrigger = page
    .locator("button[aria-label*='검색'], button[aria-label*='Search' i]")
    .first();
  const hasTrigger = await searchTrigger.count();
  console.log(`[search] trigger count: ${hasTrigger}`);
  if (hasTrigger === 0) {
    console.log("[search] 트리거 미발견 — Navbar 열기 시도 후 재탐색");
  }
  await searchTrigger.click({ timeout: 5000 }).catch((e) => console.log(`[search] click 실패: ${e}`));
  await page.waitForTimeout(400);

  const input = page.locator("input[role='combobox']");
  await input.fill("ring").catch(() => input.fill("링"));
  await page.waitForTimeout(400);

  const options = page.locator("li[role='option']");
  const optCount = await options.count();
  console.log(`[search] 인라인 결과 수: ${optCount}`);
  await screenshot(page, "08-search-results");

  // 키보드 네비: 아래로 두 번 → 첫 옵션 aria-selected 확인
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("ArrowDown");
  const selected = page.locator("li[role='option'][aria-selected='true']");
  const selText = await selected.first().textContent().catch(() => "(none)");
  console.log(`[search] 선택된 옵션: ${selText}`);
  await screenshot(page, "08-search-keyboard-selected");

  // Enter로 이동
  await page.keyboard.press("Enter");
  await page.waitForTimeout(800);
  console.log(`[search] Enter 후 URL: ${page.url()}`);
});
