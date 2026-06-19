"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, openLoginModal } = useAuth();

  useEffect(() => {
    if (!user) openLoginModal();
  }, [user, openLoginModal]);

  if (!user) return null;
  return <>{children}</>;
}
