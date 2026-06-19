"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

/* ── Types ──────────────────────────────────────────────── */
type FieldKey = "name" | "email" | "password" | "confirmPassword";
type FieldErrors = Partial<Record<FieldKey, string>>;
type Touched = Partial<Record<FieldKey, boolean>>;

/* ── Validation ─────────────────────────────────────────── */
function validateField(
  field: FieldKey,
  value: string,
  { isSignup, password }: { isSignup: boolean; password: string }
): string | undefined {
  switch (field) {
    case "name":
      if (!isSignup) return undefined;
      return value.trim() ? undefined : "이름을 입력해주세요. (예: 홍길동)";
    case "email":
      if (!value) return "이메일 주소를 입력해주세요.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
        return "올바른 이메일 형식으로 입력해주세요. (예: name@domain.com)";
      return undefined;
    case "password":
      if (!value) return "비밀번호를 입력해주세요.";
      if (isSignup && value.length < 8) return "비밀번호는 8자 이상으로 설정해주세요. (예: mypass123)";
      return undefined;
    case "confirmPassword":
      if (!isSignup) return undefined;
      if (!value) return "비밀번호 확인을 입력해주세요.";
      if (value !== password) return "비밀번호가 일치하지 않습니다. 다시 확인해주세요.";
      return undefined;
  }
}

/* ── Input class helper ─────────────────────────────────── */
const BASE =
  "w-full bg-surface-input text-content-primary text-sm px-3 py-2.5 border focus:outline-none transition-colors placeholder:text-content-muted";

function inputCls(hasError: boolean, extra?: string) {
  return [
    BASE,
    hasError
      ? "border-red-700 focus:border-red-500"
      : "border-surface-elevated focus:border-content-tertiary",
    extra,
  ]
    .filter(Boolean)
    .join(" ");
}

/* ── Icons ──────────────────────────────────────────────── */
const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const EyeOffIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

/* ── Component ──────────────────────────────────────────── */
export default function LoginModal() {
  const { isLoginModalOpen, modalMode, closeLoginModal, login, signup } = useAuth();

  const [mode, setMode] = useState(modalMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Touched>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmClose, setShowConfirmClose] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const confirmCancelRef = useRef<HTMLButtonElement>(null);
  const prevShowConfirmRef = useRef(false);

  const isLogin = mode === "login";
  const ctx = { isSignup: !isLogin, password };
  const isDirty = name !== "" || email !== "" || password !== "" || confirmPassword !== "";

  useEffect(() => {
    if (isLoginModalOpen) {
      setMode(modalMode);
      setName(""); setEmail(""); setPassword(""); setConfirmPassword("");
      setShowPassword(false); setShowConfirmPassword(false);
      setFieldErrors({}); setTouched({}); setServerError(null);
      setShowConfirmClose(false);
    }
  }, [isLoginModalOpen, modalMode]);

  // 모달 열릴 때 첫 번째 입력 필드로 포커스 (애니메이션 후)
  useEffect(() => {
    if (!isLoginModalOpen) return;
    const timer = setTimeout(() => {
      panelRef.current?.querySelector<HTMLInputElement>("input:not([disabled])")?.focus();
    }, 320);
    return () => clearTimeout(timer);
  }, [isLoginModalOpen]);

  // 닫기 확인 오버레이가 나타나면 "계속 작성하기"로 포커스,
  // 사라지면 X 닫기 버튼으로 포커스 복원
  useEffect(() => {
    if (showConfirmClose) {
      confirmCancelRef.current?.focus();
    } else if (prevShowConfirmRef.current && isLoginModalOpen) {
      closeButtonRef.current?.focus();
    }
    prevShowConfirmRef.current = showConfirmClose;
  }, [showConfirmClose, isLoginModalOpen]);

  const reset = () => {
    setName(""); setEmail(""); setPassword(""); setConfirmPassword("");
    setShowPassword(false); setShowConfirmPassword(false);
    setFieldErrors({}); setTouched({}); setServerError(null);
    setShowConfirmClose(false);
  };

  const handleClose = () => { closeLoginModal(); reset(); };

  const attemptClose = () => {
    if (isLoading) return;
    if (isDirty) { setShowConfirmClose(true); } else { handleClose(); }
  };

  const switchMode = () => {
    setMode((m) => (m === "login" ? "signup" : "login"));
    setFieldErrors({}); setTouched({}); setServerError(null);
  };

  const handleBlur = (field: FieldKey, value: string) => {
    setTouched((t) => ({ ...t, [field]: true }));
    setFieldErrors((prev) => ({ ...prev, [field]: validateField(field, value, ctx) }));
  };

  const handleChange = (field: FieldKey, value: string) => {
    const setters: Record<FieldKey, () => void> = {
      name: () => setName(value),
      email: () => setEmail(value),
      password: () => setPassword(value),
      confirmPassword: () => setConfirmPassword(value),
    };
    setters[field]();

    const updates: FieldErrors = {};

    if (touched[field]) {
      const fieldCtx = field === "password" ? { ...ctx, password: value } : ctx;
      updates[field] = validateField(field, value, fieldCtx);
    }
    // confirmPassword 재검증 — password 변경 시
    if (field === "password" && touched.confirmPassword) {
      updates.confirmPassword = validateField("confirmPassword", confirmPassword, {
        ...ctx,
        password: value,
      });
    }

    if (Object.keys(updates).length) setFieldErrors((prev) => ({ ...prev, ...updates }));
    if (serverError) setServerError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError(null);

    const keys: FieldKey[] = isLogin
      ? ["email", "password"]
      : ["name", "email", "password", "confirmPassword"];
    const vals: Record<FieldKey, string> = { name, email, password, confirmPassword };

    const newErrors: FieldErrors = {};
    let hasError = false;
    for (const k of keys) {
      const err = validateField(k, vals[k], ctx);
      if (err) { newErrors[k] = err; hasError = true; }
    }
    if (hasError) {
      setFieldErrors(newErrors);
      setTouched(Object.fromEntries(keys.map((k) => [k, true])) as Touched);
      return;
    }

    setIsLoading(true);
    const { error } = isLogin
      ? await login(email, password)
      : await signup(email, password, name);
    setIsLoading(false);

    if (error) setServerError(error);
    else { closeLoginModal(); reset(); }
  };

  // touched된 필드의 에러만 노출
  const err = (field: FieldKey) => (touched[field] ? fieldErrors[field] : undefined);

  // 포커스 트랩 + Escape 핸들러 (WCAG 2.1 — keyboard accessible)
  const handlePanelKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      if (showConfirmClose) { setShowConfirmClose(false); } else { attemptClose(); }
      return;
    }
    if (e.key !== "Tab" || !panelRef.current) return;
    const focusable = Array.from(
      panelRef.current.querySelectorAll<HTMLElement>(
        "button:not([disabled]), input:not([disabled]), a[href]"
      )
    ).filter((el) => !el.closest("[inert]"));
    if (focusable.length < 2) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  };

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
            onClick={attemptClose}
          >
            <div
              ref={panelRef}
              className="relative w-full max-w-sm bg-surface-raised p-8"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={handlePanelKeyDown}
            >
              {/* Confirm-close overlay — 오버레이가 활성화된 동안 아래 폼은 inert */}
              {showConfirmClose && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-6 bg-surface-raised px-8">
                  <p className="text-center text-sm leading-relaxed text-content-primary">
                    입력 중인 내용이 사라져요.
                    <br />
                    그래도 닫으시겠어요?
                  </p>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      ref={confirmCancelRef}
                      onClick={() => setShowConfirmClose(false)}
                      className="text-xs tracking-link text-content-secondary transition-colors hover:text-content-primary"
                    >
                      계속 작성하기
                    </button>
                    <button
                      type="button"
                      onClick={handleClose}
                      className="text-xs tracking-link text-content-faint transition-colors hover:text-content-primary"
                    >
                      닫기
                    </button>
                  </div>
                </div>
              )}

              {/* 헤더 + 폼 — 오버레이 활성화 시 inert로 키보드/스크린리더 접근 차단 */}
              <div inert={showConfirmClose || undefined}>
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
                  ref={closeButtonRef}
                  onClick={attemptClose}
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
                {/* Name — signup only */}
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
                      onChange={(e) => handleChange("name", e.target.value)}
                      onBlur={(e) => handleBlur("name", e.target.value)}
                      className={inputCls(!!err("name"))}
                      placeholder="홍길동"
                      required
                      aria-invalid={!!err("name")}
                      aria-describedby={err("name") ? "error-name" : undefined}
                    />
                    {err("name") && (
                      <p id="error-name" className="text-xs text-red-400" role="alert">
                        {err("name")}
                      </p>
                    )}
                  </div>
                )}

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="auth-email" className="text-2xs tracking-label text-content-faint">
                    EMAIL
                  </label>
                  <input
                    id="auth-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    onBlur={(e) => handleBlur("email", e.target.value)}
                    className={inputCls(!!err("email"))}
                    placeholder="name@domain.com"
                    required
                    aria-invalid={!!err("email")}
                    aria-describedby={err("email") ? "error-email" : undefined}
                  />
                  {err("email") && (
                    <p id="error-email" className="text-xs text-red-400" role="alert">
                      {err("email")}
                    </p>
                  )}
                </div>

                {/* Password */}
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
                      onChange={(e) => handleChange("password", e.target.value)}
                      onBlur={(e) => handleBlur("password", e.target.value)}
                      className={inputCls(!!err("password"), "pr-10")}
                      placeholder="••••••••"
                      required
                      aria-invalid={!!err("password")}
                      aria-describedby={err("password") ? "error-password" : undefined}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-content-subtle hover:text-content-primary transition-colors"
                      aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 표시"}
                    >
                      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                  {err("password") && (
                    <p id="error-password" className="text-xs text-red-400" role="alert">
                      {err("password")}
                    </p>
                  )}
                </div>

                {/* Confirm password — signup only */}
                {!isLogin && (
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="signup-confirm" className="text-2xs tracking-label text-content-faint">
                      CONFIRM PASSWORD
                    </label>
                    <div className="relative">
                      <input
                        id="signup-confirm"
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(e) => handleChange("confirmPassword", e.target.value)}
                        onBlur={(e) => handleBlur("confirmPassword", e.target.value)}
                        className={inputCls(!!err("confirmPassword"), "pr-10")}
                        placeholder="••••••••"
                        required
                        aria-invalid={!!err("confirmPassword")}
                        aria-describedby={err("confirmPassword") ? "error-confirm" : undefined}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-content-subtle hover:text-content-primary transition-colors"
                        aria-label={showConfirmPassword ? "비밀번호 확인 숨기기" : "비밀번호 확인 표시"}
                      >
                        {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                      </button>
                    </div>
                    {err("confirmPassword") && (
                      <p id="error-confirm" className="text-xs text-red-400" role="alert">
                        {err("confirmPassword")}
                      </p>
                    )}
                  </div>
                )}

                {/* Server error */}
                {serverError && (
                  <p className="text-xs text-red-400" role="alert">{serverError}</p>
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

                {/* Mode switch */}
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
              </div>{/* /inert wrapper */}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
