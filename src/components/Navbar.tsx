import Link from "next/link";

export default function Navbar() {
  return (
    <nav aria-label="주요 내비게이션" className="max-w-container mx-auto flex items-center justify-between px-8 py-5 bg-surface-base">
      {/* Search */}
      <button className="text-content-tertiary hover:text-content-primary transition-colors" aria-label="검색">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      </button>

      {/* Logo */}
      <Link
        href="/"
        className="text-content-primary text-base tracking-logo hover:text-content-secondary transition-colors"
        style={{ fontFamily: "var(--font-cinzel)" }}
      >
        PRISME
      </Link>

      {/* Menu */}
      <button className="text-content-tertiary hover:text-content-primary transition-colors" aria-label="메뉴 열기" aria-haspopup="menu" aria-expanded="false" aria-controls="primary-menu">
        <svg width="20" height="14" viewBox="0 0 20 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <line x1="0" y1="1" x2="20" y2="1" />
          <line x1="0" y1="7" x2="20" y2="7" />
          <line x1="0" y1="13" x2="20" y2="13" />
        </svg>
      </button>
    </nav>
  );
}
