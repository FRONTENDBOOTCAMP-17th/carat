"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

const PRIMARY_LINKS = [
  { label: "Collections", href: "/collections" },
  { label: "Best Pieces", href: "/best-pieces" },
  { label: "FW Collections", href: "/fw-collections" },
];

const SECONDARY_LINKS = [
  { label: "Materials", href: "/materials" },
  { label: "Process", href: "/process" },
  { label: "Archive", href: "/archive" },
];

interface NavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NavDrawer({ isOpen, onClose }: NavDrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    closeBtnRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const panel = panelRef.current;
    if (!panel) return;
    const focusable = panel.querySelectorAll<HTMLElement>(
      'a[href], button, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const trap = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    panel.addEventListener("keydown", trap);
    return () => panel.removeEventListener("keydown", trap);
  }, [isOpen]);

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-surface-overlay transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        id="primary-menu"
        role="dialog"
        aria-label="내비게이션 메뉴"
        aria-modal="true"
        className={`fixed top-0 right-0 z-50 h-full w-72 sm:w-80 bg-surface-raised flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5">
          <span
            className="text-sm tracking-logo text-content-primary"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            PRISME
          </span>
          <button
            ref={closeBtnRef}
            onClick={onClose}
            className="text-content-tertiary hover:text-content-primary transition-colors"
            aria-label="메뉴 닫기"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="1" y1="1" x2="15" y2="15" />
              <line x1="15" y1="1" x2="1" y2="15" />
            </svg>
          </button>
        </div>

        <div className="mx-6 h-px bg-surface-elevated" aria-hidden="true" />

        {/* Primary nav */}
        <nav aria-label="주요 메뉴" className="px-6 pt-10 pb-6">
          <ul className="space-y-7">
            {PRIMARY_LINKS.map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={onClose}
                  className="text-2xl tracking-heading text-content-primary hover:text-content-secondary transition-colors"
                  style={{ fontFamily: "var(--font-cinzel)" }}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mx-6 h-px bg-surface-elevated" aria-hidden="true" />

        {/* Secondary nav */}
        <nav aria-label="탐색" className="px-6 pt-7">
          <ul className="space-y-4">
            {SECONDARY_LINKS.map(({ label, href }) => (
              <li key={label}>
                <Link
                  href={href}
                  onClick={onClose}
                  className="text-xs tracking-link text-content-faint hover:text-content-primary transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom */}
        <div className="mt-auto px-6 pb-8">
          <div className="h-px bg-surface-elevated mb-6" aria-hidden="true" />
          <Link
            href="/contact"
            onClick={onClose}
            className="text-2xs tracking-label text-content-subtle hover:text-content-primary transition-colors"
          >
            CONTACT
          </Link>
        </div>
      </div>
    </>
  );
}
