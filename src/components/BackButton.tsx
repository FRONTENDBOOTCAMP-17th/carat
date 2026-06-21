"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

type BackButtonProps = {
  href: string;
  label: string;
};

export default function BackButton({ href, label }: BackButtonProps) {
  const router = useRouter();

  return (
    <Link
      href={href}
      onClick={(e) => {
        // 같은 사이트 내에서 탐색해 온 경우 브라우저 히스토리를 따름
        if (
          typeof window !== "undefined" &&
          document.referrer &&
          document.referrer.includes(window.location.host)
        ) {
          e.preventDefault();
          router.back();
        }
        // 직접 URL 접근·외부 유입의 경우 href(카테고리 페이지)로 이동
      }}
      className="text-2xs tracking-label text-content-secondary hover:text-content-primary transition-colors"
    >
      ← {label}
    </Link>
  );
}
