"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

export default function LoginModal() {
  const { isLoginModalOpen, modalMode, closeLoginModal, login, signup } = useAuth();

  const [mode, setMode] = useState(modalMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 모달이 열릴 때 컨텍스트의 초기 모드를 동기화
  useEffect(() => {
    if (isLoginModalOpen) setMode(modalMode);
  }, [isLoginModalOpen, modalMode]);

  const reset = () => {
    setError(null);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setName("");
    setShowPassword(false);
  };

  const handleClose = () => {
    closeLoginModal();
    reset();
  };

  const switchMode = () => {
    setMode((m) => (m === "login" ? "signup" : "login"));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === "signup" && password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setIsLoading(true);
    const { error: err } =
      mode === "login"
        ? await login(email, password)
        : await signup(email, password, name);
    setIsLoading(false);
    if (err) setError(err);
    else reset();
  };

  const isLogin = mode === "login";

  const eyeIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
  const eyeOffIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );

  return (
    <AnimatePresence>
      {isLoginModalOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 z-[150] bg-surface-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={handleClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={isLogin ? "로그인" : "회원가입"}
            className="fixed inset-0 z-[160] flex items-center justify-center px-4"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="w-full max-w-sm bg-surface-raised p-8">
              {/* Header */}
              <div className="flex items-start justify-between mb-8">
                <div>
                  <p className="text-2xs tracking-label text-content-faint mb-2">PRISME</p>
                  <h2
                    className="text-2xl tracking-heading text-content-primary"
                    style={{ fontFamily: "var(--font-cinzel)" }}
                  >
                    {isLogin ? "LOGIN" : "SIGN UP"}
                  </h2>
                </div>
                <button
                  onClick={handleClose}
                  className="flex items-center justify-center size-11 -mr-3 -mt-2 text-content-tertiary hover:text-content-primary transition-colors"
                  aria-label="닫기"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <line x1="1" y1="1" x2="13" y2="13" />
                    <line x1="13" y1="1" x2="1" y2="13" />
                  </svg>
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
                {/* 이름 — 회원가입 전용 */}
                {!isLogin && (
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="signup-name" className="text-2xs tracking-label text-content-faint">
                      NAME
                    </label>
                    <input
                      id="signup-name"
                      type="text"
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-surface-input text-content-primary text-sm px-3 py-2.5 border border-surface-elevated focus:outline-none focus:border-content-tertiary transition-colors placeholder:text-content-muted"
                      placeholder="홍길동"
                      required
                    />
                  </div>
                )}

                {/* 이메일 */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="auth-email" className="text-2xs tracking-label text-content-faint">
                    EMAIL
                  </label>
                  <input
                    id="auth-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-surface-input text-content-primary text-sm px-3 py-2.5 border border-surface-elevated focus:outline-none focus:border-content-tertiary transition-colors placeholder:text-content-muted"
                    placeholder="your@email.com"
                    required
                  />
                </div>

                {/* 비밀번호 */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="auth-password" className="text-2xs tracking-label text-content-faint">
                    PASSWORD
                  </label>
                  <div className="relative">
                    <input
                      id="auth-password"
                      type={showPassword ? "text" : "password"}
                      autoComplete={isLogin ? "current-password" : "new-password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-surface-input text-content-primary text-sm px-3 py-2.5 pr-10 border border-surface-elevated focus:outline-none focus:border-content-tertiary transition-colors placeholder:text-content-muted"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-content-subtle hover:text-content-primary transition-colors"
                      aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 표시"}
                    >
                      {showPassword ? eyeOffIcon : eyeIcon}
                    </button>
                  </div>
                </div>

                {/* 비밀번호 확인 — 회원가입 전용 */}
                {!isLogin && (
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="signup-confirm" className="text-2xs tracking-label text-content-faint">
                      CONFIRM PASSWORD
                    </label>
                    <input
                      id="signup-confirm"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-surface-input text-content-primary text-sm px-3 py-2.5 border border-surface-elevated focus:outline-none focus:border-content-tertiary transition-colors placeholder:text-content-muted"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                )}

                {error && (
                  <p className="text-xs text-red-400" role="alert">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="mt-1 w-full py-3 text-xs tracking-link bg-content-primary text-surface-base hover:bg-content-secondary disabled:opacity-50 transition-colors"
                >
                  {isLoading
                    ? (isLogin ? "LOGGING IN..." : "SIGNING UP...")
                    : (isLogin ? "LOGIN" : "SIGN UP")}
                </button>

                {/* 모드 전환 */}
                <p className="text-center text-2xs text-content-faint">
                  {isLogin ? "계정이 없으신가요?" : "이미 계정이 있으신가요?"}
                  {" "}
                  <button
                    type="button"
                    onClick={switchMode}
                    className="text-content-muted hover:text-content-primary underline underline-offset-2 transition-colors"
                  >
                    {isLogin ? "회원가입" : "로그인"}
                  </button>
                </p>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
