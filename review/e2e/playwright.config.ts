import { defineConfig } from "@playwright/test";

// 리뷰 전용 Playwright 설정 (carat 3차)
// 학생이 작성한 테스트가 아니라, 강사 리뷰용으로 별도 작성한 것입니다.
export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  use: {
    baseURL: "http://localhost:3501",
  },
  reporter: [["list"]],
  // Playwright가 dev 서버를 직접 띄우고 내립니다 (포트 3501).
  webServer: {
    command: "PORT=3501 npm run dev",
    cwd: "../../",
    url: "http://localhost:3501",
    timeout: 120_000,
    reuseExistingServer: true,
  },
});
