"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

type User = { email: string; name: string };

export type ModalMode = "login" | "signup";

type AuthContextType = {
  user: User | null;
  isLoginModalOpen: boolean;
  modalMode: ModalMode;
  openLoginModal: (mode?: ModalMode) => void;
  closeLoginModal: () => void;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  signup: (email: string, password: string, name: string) => Promise<{ error: string | null }>;
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
  const [modalMode, setModalMode] = useState<ModalMode>("login");

  const openLoginModal = useCallback((mode: ModalMode = "login") => {
    setModalMode(mode);
    setIsLoginModalOpen(true);
  }, []);

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

  const signup = useCallback(async (email: string, password: string, name: string) => {
    await new Promise((r) => setTimeout(r, 700));
    if (!email.includes("@")) return { error: "올바른 이메일 주소를 입력해주세요." };
    if (password.length < 8) return { error: "비밀번호는 8자 이상이어야 합니다." };
    if (!name.trim()) return { error: "이름을 입력해주세요." };
    const newUser: User = { email, name: name.trim() };
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
    () => ({ user, isLoginModalOpen, modalMode, openLoginModal, closeLoginModal, login, signup, logout }),
    [user, isLoginModalOpen, modalMode, openLoginModal, closeLoginModal, login, signup, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
