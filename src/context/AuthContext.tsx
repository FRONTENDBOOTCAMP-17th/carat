"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

type User = { id: string; email: string; name: string };

export type WishlistItem = {
  id: string;
  name: string;
  category?: string;
  description?: string;
};

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
  wishlist: WishlistItem[];
  toggleWishlist: (item: WishlistItem) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

function getOrCreateUserId(email: string): string {
  const key = `prisme_uid_${email}`;
  const existing = localStorage.getItem(key);
  if (existing) return existing;
  const id = crypto.randomUUID();
  localStorage.setItem(key, id);
  return id;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem("prisme_user");
    return stored ? (JSON.parse(stored) as User) : null;
  });

  const [wishlist, setWishlist] = useState<WishlistItem[]>(() => {
    if (typeof window === "undefined") return [];
    const userStored = localStorage.getItem("prisme_user");
    if (!userStored) return [];
    const { id } = JSON.parse(userStored) as User;
    const stored = localStorage.getItem(`prisme_wishlist_${id}`);
    return stored ? (JSON.parse(stored) as WishlistItem[]) : [];
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
      return { error: "loginFailed" };
    }
    const id = getOrCreateUserId(email);
    const newUser: User = { id, email, name: email.split("@")[0] };
    setUser(newUser);
    localStorage.setItem("prisme_user", JSON.stringify(newUser));
    const stored = localStorage.getItem(`prisme_wishlist_${id}`);
    setWishlist(stored ? (JSON.parse(stored) as WishlistItem[]) : []);
    return { error: null };
  }, []);

  const signup = useCallback(async (email: string, password: string, name: string) => {
    await new Promise((r) => setTimeout(r, 700));
    if (!email.includes("@")) return { error: "emailInvalidSignup" };
    if (password.length < 8) return { error: "passwordTooShortSignup" };
    if (!name.trim()) return { error: "nameRequiredSignup" };
    const id = getOrCreateUserId(email);
    const newUser: User = { id, email, name: name.trim() };
    setUser(newUser);
    localStorage.setItem("prisme_user", JSON.stringify(newUser));
    return { error: null };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setWishlist([]);
    localStorage.removeItem("prisme_user");
  }, []);

  const toggleWishlist = useCallback((item: WishlistItem) => {
    setWishlist((prev) => {
      const exists = prev.some((w) => w.id === item.id);
      return exists ? prev.filter((w) => w.id !== item.id) : [...prev, item];
    });
  }, []);

  // wishlist → localStorage 동기화 (초기 마운트 스킵, 유저별 키 사용)
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    if (user) {
      localStorage.setItem(`prisme_wishlist_${user.id}`, JSON.stringify(wishlist));
    }
  }, [wishlist, user]);

  const value = useMemo(
    () => ({
      user, isLoginModalOpen, modalMode,
      openLoginModal, closeLoginModal,
      login, signup, logout,
      wishlist, toggleWishlist,
    }),
    [user, isLoginModalOpen, modalMode, openLoginModal, closeLoginModal, login, signup, logout, wishlist, toggleWishlist]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
