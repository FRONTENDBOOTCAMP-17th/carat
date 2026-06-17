"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, openLoginModal } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      openLoginModal();
      router.replace("/");
    }
  }, [user, openLoginModal, router]);

  if (!user) return null;
  return <>{children}</>;
}
