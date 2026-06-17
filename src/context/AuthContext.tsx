"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

type User = { email: string; name: string };

type AuthContextType = {
  user: User | null;
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem("prisme_user");
    return stored ? (JSON.parse(stored) as User) : null;
  });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const openLoginModal = useCallback(() => setIsLoginModalOpen(true), []);
  const closeLoginModal = useCallback(() => setIsLoginModalOpen(false), []);

  const login = useCallback(async (email: string, password: string) => {
    await new Promise((r) => setTimeout(r, 700));
    if (!email.includes("@") || password.length < 4) {
      return { error: "이메일 또는 비밀번호를 확인해주세요." };
    }
    const newUser: User = { email, name: email.split("@")[0] };
    setUser(newUser);
    localStorage.setItem("prisme_user", JSON.stringify(newUser));
    setIsLoginModalOpen(false);
    return { error: null };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("prisme_user");
  }, []);

  const value = useMemo(
    () => ({ user, isLoginModalOpen, openLoginModal, closeLoginModal, login, logout }),
    [user, isLoginModalOpen, openLoginModal, closeLoginModal, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
