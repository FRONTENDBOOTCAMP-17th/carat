"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function AuthGuard({
  children,
  fallback = null,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const { user, openLoginModal } = useAuth();

  useEffect(() => {
    if (!user) openLoginModal();
  }, [user, openLoginModal]);

  if (!user) return <>{fallback}</>;
  return <>{children}</>;
}
