"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Search, User, Menu } from "lucide-react";
import NavDrawer from "./NavDrawer";
import SearchModal from "./SearchModal";
import { useAuth } from "@/context/AuthContext";
import { useLang } from "@/context/LanguageContext";

export default function Navbar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, openLoginModal, logout } = useAuth();
  const { lang, setLang, t } = useLang();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const userButtonRef = useRef<HTMLButtonElement>(null);
  const wishlistLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    // 로그아웃(user 변경) 시 열려 있던 유저 메뉴를 닫는 의도적 동기화
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!user) setIsUserMenuOpen(false);
  }, [user]);

  useEffect(() => {
    if (!isUserMenuOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!userMenuRef.current?.contains(e.target as Node))
        setIsUserMenuOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [isUserMenuOpen]);

  useEffect(() => {
    if (!isUserMenuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsUserMenuOpen(false);
        userButtonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isUserMenuOpen]);

  useEffect(() => {
    if (!isUserMenuOpen) return;
    const timer = setTimeout(() => wishlistLinkRef.current?.focus(), 50);
    return () => clearTimeout(timer);
  }, [isUserMenuOpen]);

  const handleUserClick = () => {
    if (user) {
      setIsUserMenuOpen((v) => !v);
    } else {
      openLoginModal();
    }
  };

  return (
    <>
      <nav aria-label={t.nav.primaryNav} className="w-full bg-surface-base">
        <div className="max-w-container mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-5">
          {/* 로고 */}
          <Link
            href="/"
            aria-label={t.nav.homeLabel}
            className="flex items-center w-[88px] h-11 opacity-100 hover:opacity-70 transition-opacity"
          >
            <svg
              width="100%"
              viewBox="0 0 43 9"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M1.884 0.215997H3.42C3.996 0.215997 4.476 0.311997 4.86 0.503997C5.252 0.687997 5.548 0.955997 5.748 1.308C5.956 1.652 6.06 2.06 6.06 2.532C6.068 2.908 5.996 3.252 5.844 3.564C5.7 3.868 5.504 4.124 5.256 4.332C5.008 4.54 4.724 4.696 4.404 4.8C4.092 4.896 3.768 4.928 3.432 4.896C3.096 4.864 2.768 4.756 2.448 4.572V4.452C2.448 4.452 2.508 4.46 2.628 4.476C2.756 4.484 2.916 4.48 3.108 4.464C3.308 4.448 3.512 4.4 3.72 4.32C3.936 4.24 4.136 4.104 4.32 3.912C4.512 3.72 4.656 3.46 4.752 3.132C4.776 3.036 4.796 2.924 4.812 2.796C4.828 2.66 4.832 2.532 4.824 2.412C4.816 1.876 4.672 1.444 4.392 1.116C4.12 0.787997 3.732 0.623997 3.228 0.623997H2.004C2.004 0.623997 1.992 0.591997 1.968 0.527997C1.952 0.455997 1.932 0.387997 1.908 0.323997C1.892 0.251997 1.884 0.215997 1.884 0.215997ZM2.04 0.215997V8.616H0.923996V0.215997H2.04ZM0.959996 7.74V8.616H-3.62098e-06V8.496C-3.62098e-06 8.496 0.0239964 8.496 0.0719964 8.496C0.127996 8.496 0.155996 8.496 0.155996 8.496C0.363996 8.496 0.539996 8.424 0.683996 8.28C0.835996 8.128 0.915996 7.948 0.923996 7.74H0.959996ZM0.959996 1.092H0.923996C0.923996 0.883997 0.847996 0.707997 0.695996 0.563997C0.543996 0.411997 0.363996 0.335997 0.155996 0.335997C0.155996 0.335997 0.131996 0.335997 0.0839964 0.335997C0.0359964 0.335997 0.0119964 0.335997 0.0119964 0.335997L-3.62098e-06 0.215997H0.959996V1.092ZM2.004 7.74H2.04C2.048 7.948 2.124 8.128 2.268 8.28C2.42 8.424 2.6 8.496 2.808 8.496C2.816 8.496 2.844 8.496 2.892 8.496C2.94 8.496 2.964 8.496 2.964 8.496V8.616H2.004V7.74ZM9.06759 0.215997H10.7116C11.0716 0.215997 11.4076 0.263997 11.7196 0.359997C12.0316 0.455997 12.2956 0.599997 12.5116 0.791997C12.7356 0.975997 12.9116 1.208 13.0396 1.488C13.1676 1.768 13.2316 2.096 13.2316 2.472C13.2316 2.84 13.1476 3.2 12.9796 3.552C12.8116 3.896 12.5756 4.18 12.2716 4.404C11.9756 4.628 11.6236 4.748 11.2156 4.764C11.3916 4.828 11.5676 4.952 11.7436 5.136C11.9196 5.32 12.0716 5.5 12.1996 5.676C12.1996 5.684 12.2476 5.76 12.3436 5.904C12.4476 6.048 12.5756 6.228 12.7276 6.444C12.8796 6.652 13.0316 6.86 13.1836 7.068C13.3436 7.276 13.4836 7.448 13.6036 7.584C13.7636 7.776 13.9196 7.94 14.0716 8.076C14.2316 8.204 14.3996 8.308 14.5756 8.388C14.7596 8.46 14.9636 8.496 15.1876 8.496V8.616H14.3476C13.9636 8.616 13.6236 8.568 13.3276 8.472C13.0316 8.368 12.7756 8.232 12.5596 8.064C12.3436 7.888 12.1596 7.7 12.0076 7.5C11.9756 7.444 11.9076 7.34 11.8036 7.188C11.7076 7.036 11.5956 6.864 11.4676 6.672C11.3476 6.472 11.2276 6.276 11.1076 6.084C10.9876 5.892 10.8836 5.728 10.7956 5.592C10.7076 5.448 10.6516 5.356 10.6276 5.316C10.4916 5.1 10.3396 4.916 10.1716 4.764C10.0036 4.604 9.81959 4.52 9.61959 4.512V4.392C9.62759 4.392 9.68359 4.396 9.78759 4.404C9.89959 4.404 10.0276 4.4 10.1716 4.392C10.3796 4.384 10.5996 4.348 10.8316 4.284C11.0716 4.22 11.2876 4.096 11.4796 3.912C11.6796 3.728 11.8276 3.456 11.9236 3.096C11.9476 3.016 11.9636 2.916 11.9716 2.796C11.9876 2.676 11.9916 2.552 11.9836 2.424C11.9756 1.872 11.8356 1.444 11.5636 1.14C11.2996 0.827997 10.9516 0.663997 10.5196 0.647997C10.3356 0.631997 10.1436 0.627997 9.94359 0.635997C9.74359 0.635997 9.57159 0.635997 9.42759 0.635997C9.28359 0.635997 9.20359 0.635997 9.18759 0.635997C9.18759 0.627997 9.17559 0.591997 9.15159 0.527997C9.13559 0.455997 9.11559 0.387997 9.09159 0.323997C9.07559 0.251997 9.06759 0.215997 9.06759 0.215997ZM9.22359 0.215997V8.616H8.10759V0.215997H9.22359ZM8.14359 7.74V8.616H7.18359V8.496C7.18359 8.496 7.20759 8.496 7.25559 8.496C7.31159 8.496 7.33959 8.496 7.33959 8.496C7.54759 8.496 7.72359 8.424 7.86759 8.28C8.01959 8.128 8.09959 7.948 8.10759 7.74H8.14359ZM8.14359 1.092H8.10759C8.09959 0.883997 8.01959 0.707997 7.86759 0.563997C7.72359 0.411997 7.54759 0.335997 7.33959 0.335997C7.33959 0.335997 7.31159 0.335997 7.25559 0.335997C7.20759 0.335997 7.18359 0.335997 7.18359 0.335997V0.215997H8.14359V1.092ZM9.18759 7.74H9.22359C9.22359 7.948 9.29959 8.128 9.45159 8.28C9.60359 8.424 9.78359 8.496 9.99159 8.496C9.99959 8.496 10.0236 8.496 10.0636 8.496C10.1116 8.496 10.1356 8.496 10.1356 8.496V8.616H9.18759V7.74ZM17.321 0.215997V8.616H16.205V0.215997H17.321ZM16.241 7.74V8.616H15.281V8.496C15.281 8.496 15.305 8.496 15.353 8.496C15.409 8.496 15.437 8.496 15.437 8.496C15.645 8.496 15.821 8.424 15.965 8.28C16.117 8.128 16.197 7.948 16.205 7.74H16.241ZM16.241 1.092H16.205C16.197 0.883997 16.117 0.707997 15.965 0.563997C15.821 0.411997 15.645 0.335997 15.437 0.335997C15.437 0.335997 15.409 0.335997 15.353 0.335997C15.305 0.335997 15.281 0.335997 15.281 0.335997V0.215997H16.241V1.092ZM17.285 7.74H17.321C17.329 7.948 17.405 8.128 17.549 8.28C17.701 8.424 17.881 8.496 18.089 8.496C18.089 8.496 18.113 8.496 18.161 8.496C18.209 8.496 18.237 8.496 18.245 8.496V8.616H17.285V7.74ZM17.285 1.092V0.215997H18.245V0.335997C18.237 0.335997 18.209 0.335997 18.161 0.335997C18.113 0.335997 18.089 0.335997 18.089 0.335997C17.881 0.335997 17.701 0.411997 17.549 0.563997C17.405 0.707997 17.329 0.883997 17.321 1.092H17.285ZM21.9952 0.0479968C22.1312 0.0479968 22.2872 0.0559969 22.4632 0.0719972C22.6392 0.087997 22.8152 0.111997 22.9912 0.143997C23.1752 0.167997 23.3352 0.195997 23.4712 0.227997C23.6152 0.251997 23.7192 0.279997 23.7832 0.311997L23.7352 1.74H23.6272C23.6272 1.348 23.4872 1.036 23.2072 0.803997C22.9272 0.571997 22.5752 0.455997 22.1512 0.455997C21.7032 0.455997 21.3392 0.587997 21.0592 0.851997C20.7872 1.108 20.6512 1.412 20.6512 1.764C20.6432 1.94 20.6872 2.128 20.7832 2.328C20.8872 2.52 21.0432 2.7 21.2512 2.868L23.5912 4.824C23.8712 5.04 24.0672 5.292 24.1792 5.58C24.2992 5.86 24.3552 6.152 24.3472 6.456C24.3312 7.16 24.0952 7.724 23.6392 8.148C23.1832 8.572 22.5672 8.784 21.7912 8.784C21.5432 8.784 21.2752 8.76 20.9872 8.712C20.7072 8.664 20.4432 8.592 20.1952 8.496C19.9472 8.392 19.7472 8.26 19.5952 8.1C19.5552 7.956 19.5352 7.78 19.5352 7.572C19.5432 7.356 19.5672 7.136 19.6072 6.912C19.6552 6.688 19.7152 6.488 19.7872 6.312H19.8952C19.8552 6.72 19.9112 7.084 20.0632 7.404C20.2232 7.724 20.4512 7.972 20.7472 8.148C21.0512 8.316 21.3992 8.392 21.7912 8.376C22.2632 8.36 22.6512 8.216 22.9552 7.944C23.2672 7.664 23.4232 7.3 23.4232 6.852C23.4232 6.62 23.3712 6.408 23.2672 6.216C23.1632 6.024 23.0032 5.852 22.7872 5.7L20.5552 3.804C20.2512 3.58 20.0352 3.316 19.9072 3.012C19.7792 2.708 19.7232 2.404 19.7392 2.1C19.7552 1.74 19.8512 1.404 20.0272 1.092C20.2032 0.771997 20.4552 0.519997 20.7832 0.335997C21.1192 0.143997 21.5232 0.0479968 21.9952 0.0479968ZM23.7832 0.167997V0.419997H22.7032V0.167997H23.7832ZM34.0286 0.0479968L34.1246 1.02L30.9326 7.548C30.9326 7.548 30.8966 7.62 30.8246 7.764C30.7606 7.9 30.6926 8.064 30.6206 8.256C30.5566 8.448 30.5166 8.632 30.5006 8.808H30.3806L30.1166 7.956L34.0286 0.0479968ZM26.3966 7.74V8.616H25.0646V8.496C25.0726 8.496 25.1046 8.496 25.1606 8.496C25.2246 8.496 25.2566 8.496 25.2566 8.496C25.4726 8.496 25.6646 8.432 25.8326 8.304C26.0006 8.168 26.1006 7.98 26.1326 7.74H26.3966ZM26.8046 7.932C26.8046 7.94 26.8046 7.948 26.8046 7.956C26.8046 7.964 26.8046 7.976 26.8046 7.992C26.8046 8.12 26.8486 8.24 26.9366 8.352C27.0326 8.456 27.1446 8.508 27.2726 8.508H27.4526V8.616H26.7206V7.932H26.8046ZM27.0686 0.0479968H27.1766L27.4766 0.923997L26.7446 8.616H26.0246L27.0686 0.0479968ZM27.1766 0.0479968L30.7886 7.176L30.3806 8.808L26.9246 1.896L27.1766 0.0479968ZM34.1366 0.0479968L35.2046 8.616H33.9326L33.2966 1.932L34.0286 0.0479968H34.1366ZM34.8446 7.74H35.0966C35.1366 7.98 35.2406 8.168 35.4086 8.304C35.5766 8.432 35.7646 8.496 35.9726 8.496C35.9726 8.496 36.0046 8.496 36.0686 8.496C36.1326 8.496 36.1646 8.496 36.1646 8.496V8.616H34.8446V7.74ZM33.8726 7.932H33.9566V8.616H33.2246V8.508H33.4046C33.5406 8.508 33.6526 8.456 33.7406 8.352C33.8286 8.24 33.8726 8.12 33.8726 7.992C33.8726 7.976 33.8726 7.964 33.8726 7.956C33.8726 7.948 33.8726 7.94 33.8726 7.932ZM38.9303 0.215997V8.616H37.8143V0.215997H38.9303ZM42.1463 8.196L42.2423 8.616H38.8943V8.196H42.1463ZM41.6543 4.272V4.68H38.8943V4.272H41.6543ZM42.1943 0.215997V0.635997H38.8943V0.215997H42.1943ZM42.9263 6.504L42.2783 8.616H40.1663L40.5983 8.196C41.0143 8.196 41.3623 8.128 41.6423 7.992C41.9223 7.848 42.1543 7.648 42.3383 7.392C42.5223 7.136 42.6783 6.84 42.8063 6.504H42.9263ZM41.6543 4.656V5.568H41.5343V5.412C41.5343 5.212 41.4663 5.04 41.3303 4.896C41.1943 4.752 41.0223 4.68 40.8143 4.68V4.656H41.6543ZM41.6543 3.384V4.296H40.8143V4.272C41.0223 4.264 41.1943 4.188 41.3303 4.044C41.4663 3.9 41.5343 3.728 41.5343 3.528V3.384H41.6543ZM42.1943 0.599997V1.704H42.0743V1.512C42.0743 1.264 41.9903 1.056 41.8223 0.887997C41.6623 0.719997 41.4543 0.631997 41.1983 0.623997V0.599997H42.1943ZM42.1943 -3.33786e-06V0.347997L40.7303 0.215997C40.9063 0.215997 41.0903 0.203997 41.2823 0.179997C41.4823 0.155997 41.6663 0.127997 41.8343 0.0959969C42.0023 0.0639968 42.1223 0.0319967 42.1943 -3.33786e-06ZM37.8503 7.74V8.616H36.8903V8.496C36.8903 8.496 36.9143 8.496 36.9623 8.496C37.0183 8.496 37.0463 8.496 37.0463 8.496C37.2543 8.496 37.4303 8.424 37.5743 8.28C37.7263 8.128 37.8063 7.948 37.8143 7.74H37.8503ZM37.8503 1.092H37.8143C37.8143 0.883997 37.7383 0.707997 37.5863 0.563997C37.4343 0.411997 37.2543 0.335997 37.0463 0.335997C37.0463 0.335997 37.0223 0.335997 36.9743 0.335997C36.9263 0.335997 36.9023 0.335997 36.9023 0.335997L36.8903 0.215997H37.8503V1.092Z"
                fill="currentColor"
              />
            </svg>
          </Link>

          {/* 우측: 언어 + 검색 + 유저 + 메뉴 */}
          <div className="flex items-center gap-1">
            {/* 언어 토글 */}
            <div
              className="flex items-center mr-1"
              role="group"
              aria-label="Language"
            >
              <button
                onClick={() => setLang("ko")}
                className={`text-xs tracking-label px-1.5 py-1 transition-colors ${
                  lang === "ko"
                    ? "text-content-primary"
                    : "text-content-muted hover:text-content-secondary"
                }`}
                aria-pressed={lang === "ko"}
                aria-label="한국어"
              >
                KO
              </button>
              <span
                className="text-xs text-content-secondary"
                aria-hidden="true"
              >
                |
              </span>
              <button
                onClick={() => setLang("en")}
                className={`text-xs tracking-label px-1.5 py-1 transition-colors ${
                  lang === "en"
                    ? "text-content-primary"
                    : "text-content-muted hover:text-content-secondary"
                }`}
                aria-pressed={lang === "en"}
                aria-label="English"
              >
                EN
              </button>
            </div>

            {/* 검색 */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center justify-center size-11 text-content-tertiary hover:text-content-primary transition-colors"
              aria-label={t.nav.search}
              aria-haspopup="dialog"
              aria-expanded={isSearchOpen}
            >
              <Search size={18} strokeWidth={1.5} aria-hidden="true" />
            </button>

            {/* 유저 */}
            <div ref={userMenuRef} className="relative">
              <button
                ref={userButtonRef}
                onClick={handleUserClick}
                className="relative flex items-center justify-center size-11 text-content-tertiary hover:text-content-primary transition-colors"
                aria-label={user ? t.nav.account : t.nav.signIn}
                aria-haspopup={user ? "menu" : "dialog"}
                aria-expanded={user ? isUserMenuOpen : undefined}
              >
                <User size={18} strokeWidth={1.5} aria-hidden="true" />
                {user && (
                  <span
                    className="absolute bottom-3.25 right-3.25 w-1.5 h-1.5 rounded-full bg-content-primary"
                    aria-hidden="true"
                  />
                )}
              </button>

              {isUserMenuOpen && user && (
                <div className="absolute top-11 right-0 z-50 w-44 bg-surface-raised border border-surface-elevated py-3">
                  <p className="px-4 py-1 text-xs text-content-faint truncate">
                    {user.email}
                  </p>
                  <div className="my-2 h-px bg-surface-elevated" />

                  <Link
                    ref={wishlistLinkRef}
                    href="/wishlist"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center min-h-11 px-4 text-xs tracking-label text-content-secondary hover:text-content-primary transition-colors"
                  >
                    {t.auth.wishlist}
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsUserMenuOpen(false);
                    }}
                    className="flex items-center w-full min-h-11 px-4 text-xs tracking-label text-content-secondary hover:text-content-primary transition-colors"
                  >
                    {t.auth.logout}
                  </button>
                </div>
              )}
            </div>

            {/* 메뉴 */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="flex items-center justify-center size-11 -mr-4 text-content-tertiary hover:text-content-primary transition-colors"
              aria-label={t.nav.menuOpen}
              aria-haspopup="dialog"
              aria-expanded={isDrawerOpen}
              aria-controls="primary-menu"
            >
              <Menu size={18} strokeWidth={1.5} aria-hidden="true" />
            </button>
          </div>
        </div>
      </nav>

      <NavDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}
