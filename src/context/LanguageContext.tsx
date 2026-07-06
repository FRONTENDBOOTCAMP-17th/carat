"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { translations, type Lang, type T } from "@/lib/translations";

type LanguageContextType = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: T;
};

const LanguageContext = createContext<LanguageContextType | null>(null);

function detectOsLang(): Lang {
  try {
    return navigator.language.toLowerCase().startsWith("ko") ? "ko" : "en";
  } catch {
    return "ko";
  }
}

export function LanguageProvider({
  children,
  initialLang = "ko",
}: {
  children: React.ReactNode;
  initialLang?: Lang;
}) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  // 마운트 시 1회만: SSR 초기값(initialLang)을 localStorage/OS 감지값으로 보정하는 초기화 패턴
  useEffect(() => {
    const stored = localStorage.getItem("prisme_lang") as Lang | null;
    const resolved = stored === "ko" || stored === "en" ? stored : detectOsLang();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (resolved !== lang) setLangState(resolved);
    document.documentElement.setAttribute("lang", resolved);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem("prisme_lang", l);
    document.cookie = `prisme_lang=${l}; path=/; max-age=31536000`;
    document.documentElement.setAttribute("lang", l);
  }, []);

  const t = useMemo(() => translations[lang], [lang]);

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used within LanguageProvider");
  return ctx;
}
