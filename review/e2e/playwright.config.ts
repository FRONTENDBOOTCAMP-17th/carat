import { defineConfig, devices } from "@playwright/test";

// 리뷰 전용 E2E 설정. 개발 서버(포트 3500)를 사용한다. carat은 템플릿 단계라 백엔드 불필요.
export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  fullyParallel: false,
  retries: 0,
  reporter: [["list"]],
  use: {
    baseURL: process.env.BASE_URL ?? "http://localhost:3500",
    headless: true,
    viewport: { width: 1280, height: 900 },
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
