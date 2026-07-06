"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type Theme = "dark" | "light";

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

function detectOsTheme(): Theme {
  try {
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  } catch {
    return "dark";
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");

  // 마운트 시 1회만: SSR 초기값("dark")을 localStorage/OS 감지값으로 보정하는 초기화 패턴
  useEffect(() => {
    const stored = localStorage.getItem("prisme_theme") as Theme | null;
    const hasUserPref = stored === "light" || stored === "dark";
    const resolved = hasUserPref ? stored : detectOsTheme();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setThemeState(resolved);
    document.documentElement.setAttribute("data-theme", resolved);

    // OS 테마 변경을 실시간으로 반영 (사용자가 명시적으로 선택하지 않은 경우에만)
    const mq = window.matchMedia("(prefers-color-scheme: light)");
    const onOsChange = (e: MediaQueryListEvent) => {
      if (localStorage.getItem("prisme_theme")) return;
      const next: Theme = e.matches ? "light" : "dark";
      setThemeState(next);
      document.documentElement.setAttribute("data-theme", next);
    };
    mq.addEventListener("change", onOsChange);
    return () => mq.removeEventListener("change", onOsChange);
  }, []);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    localStorage.setItem("prisme_theme", t);
    document.documentElement.setAttribute("data-theme", t);
  }, []);

  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
