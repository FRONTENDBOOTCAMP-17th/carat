import type { Metadata } from "next";
import { Cinzel } from "next/font/google";
import localFont from "next/font/local";
import { cookies } from "next/headers";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";
import LoginModal from "@/components/LoginModal";
import SkipLink from "@/components/SkipLink";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";
import type { Lang } from "@/lib/translations";

/* -----------------------------
   Cinzel (헤드라인용)
------------------------------*/
const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-cinzel",
  display: "block",
});

/* -----------------------------
   Pretendard (로컬 - 고정 경로)
------------------------------*/
const pretendard = localFont({
  src: [
    {
      path: "../fonts/Pretendard-Thin.woff2",
      weight: "100",
      style: "normal",
    },
    {
      path: "../fonts/Pretendard-ExtraLight.woff2",
      weight: "200",
      style: "normal",
    },
    {
      path: "../fonts/Pretendard-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../fonts/Pretendard-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/Pretendard-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/Pretendard-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../fonts/Pretendard-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../fonts/Pretendard-ExtraBold.woff2",
      weight: "800",
      style: "normal",
    },
    {
      path: "../fonts/Pretendard-Black.woff2",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-pretendard",
  display: "swap",
});

const SITE_URL = "https://project-carat.vercel.app";
const SITE_DESCRIPTION =
  "가상의 주얼리 브랜드 PRISME — 스크롤 중심 에디토리얼 레이아웃과 3D 인터랙션으로 브랜드 경험을 전달하는 프론트엔드 프로젝트.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "PRISME", template: "%s | PRISME" },
  description: SITE_DESCRIPTION,
  openGraph: {
    title: "PRISME",
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: "PRISME",
    images: [{ url: "/images/README-Cover.webp", width: 2547, height: 1236 }],
    locale: "ko_KR",
    type: "website",
  },
  icons: {
    icon: [
      // icon.svg가 자체 prefers-color-scheme 미디어쿼리로 다크/라이트를 처리하지만,
      // Firefox는 SVG 파비콘 내부의 미디어쿼리를 반영하지 않으므로 PNG를 폴백으로 명시.
      { url: "/icons/icon-light.png", type: "image/png", media: "(prefers-color-scheme: light)" },
      { url: "/icons/icon-dark.png", type: "image/png", media: "(prefers-color-scheme: dark)" },
    ],
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const storedLang = cookieStore.get("prisme_lang")?.value;
  const initialLang: Lang = storedLang === "ko" || storedLang === "en" ? storedLang : "ko";

  return (
    <html
      lang={initialLang}
      className={`${cinzel.variable} ${pretendard.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* 깜빡임 방지: React 하이드레이션 전에 data-theme을 설정 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('prisme_theme');var t=s==='light'||s==='dark'?s:(window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <LanguageProvider initialLang={initialLang}>
          <ThemeProvider>
            <AuthProvider>
              <CustomCursor />
              <LoginModal />
              <SkipLink />
              {children}
            </AuthProvider>
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
