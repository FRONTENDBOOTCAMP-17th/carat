import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function NotFound() {
  return (
    <main id="main-content" className="min-h-screen bg-surface-darkest flex flex-col">
      <Navbar />

      <div className="flex flex-1 flex-col items-center justify-center px-4 text-center">
        <p className="mb-4 text-2xs tracking-descriptor text-content-faint">
          PAGE NOT FOUND
        </p>
        <h1
          className="mb-6 text-3xl tracking-heading text-content-primary sm:text-4xl"
          style={{ fontFamily: "var(--font-cinzel)" }}
        >
          페이지를 찾을 수 없어요
        </h1>
        <p className="mb-10 max-w-sm text-xs leading-relaxed text-content-muted">
          주소가 잘못 입력되었거나, 페이지가 이동되었을 수 있어요.
          <br />
          아래 링크에서 원하는 컬렉션을 찾아보세요.
        </p>

        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <Link
            href="/"
            className="text-xs tracking-link text-content-secondary transition-colors hover:text-content-primary"
          >
            홈으로 돌아가기 →
          </Link>
          <span className="hidden text-content-faint sm:inline" aria-hidden="true">
            /
          </span>
          <Link
            href="/collections"
            className="text-xs tracking-link text-content-secondary transition-colors hover:text-content-primary"
          >
            컬렉션 둘러보기 →
          </Link>
        </div>
      </div>
    </main>
  );
}
