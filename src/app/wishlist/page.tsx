import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthGuard from "@/components/AuthGuard";

export default function WishlistPage() {
  return (
    <AuthGuard>
      <main id="main-content" className="min-h-screen bg-surface-darkest flex flex-col">
        <Navbar />

        <div className="flex-1 flex flex-col px-4 pt-12 pb-24 sm:px-6 lg:px-8">
          <header>
            <h1
              className="mb-3 text-3xl tracking-heading text-content-primary"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              WISHLIST
            </h1>
            <p className="mb-16 text-xs leading-relaxed text-content-faint">
              저장한 컬렉션을 확인하세요.
            </p>
          </header>

          {/* Empty state */}
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" className="text-content-subtle">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <p className="text-xs tracking-link text-content-dimmed">저장된 아이템이 없습니다.</p>
          </div>
        </div>

        <Footer />
      </main>
    </AuthGuard>
  );
}
