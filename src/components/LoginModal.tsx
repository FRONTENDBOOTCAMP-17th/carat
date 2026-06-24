"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useLang } from "@/context/LanguageContext";

type FieldKey = "name" | "email" | "password" | "confirmPassword";
type FieldErrors = Partial<Record<FieldKey, string>>;
type Touched = Partial<Record<FieldKey, boolean>>;

const BASE = "w-full bg-surface-input text-content-primary text-sm px-3 py-2.5 border focus:outline-none transition-colors placeholder:text-content-muted";

function inputCls(hasError: boolean, extra?: string) {
  return [BASE, hasError ? "border-red-700 focus:border-red-500" : "border-surface-elevated focus:border-content-tertiary", extra]
    .filter(Boolean).join(" ");
}

import { Eye, EyeOff, X } from "lucide-react";

export default function LoginModal() {
  const { isLoginModalOpen, modalMode, closeLoginModal, login, signup } = useAuth();
  const { t } = useLang();
  const a = t.auth;

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

  function validateField(field: FieldKey, value: string, { isSignup, password: pw }: { isSignup: boolean; password: string }): string | undefined {
    switch (field) {
      case "name": return isSignup && !value.trim() ? a.errors.nameRequired : undefined;
      case "email":
        if (!value) return a.errors.emailRequired;
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return a.errors.emailInvalid;
        return undefined;
      case "password":
        if (!value) return a.errors.passwordRequired;
        if (isSignup && value.length < 8) return a.errors.passwordTooShort;
        return undefined;
      case "confirmPassword":
        if (!isSignup) return undefined;
        if (!value) return a.errors.confirmPasswordRequired;
        if (value !== pw) return a.errors.confirmPasswordMismatch;
        return undefined;
    }
  }

  useEffect(() => {
    if (isLoginModalOpen) {
      setMode(modalMode);
      setName(""); setEmail(""); setPassword(""); setConfirmPassword("");
      setShowPassword(false); setShowConfirmPassword(false);
      setFieldErrors({}); setTouched({}); setServerError(null);
      setShowConfirmClose(false);
    }
  }, [isLoginModalOpen, modalMode]);

  useEffect(() => {
    if (!isLoginModalOpen) return;
    const timer = setTimeout(() => {
      panelRef.current?.querySelector<HTMLInputElement>("input:not([disabled])")?.focus();
    }, 320);
    return () => clearTimeout(timer);
  }, [isLoginModalOpen]);

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
  const attemptClose = () => { if (isLoading) return; if (isDirty) setShowConfirmClose(true); else handleClose(); };
  const switchMode = () => { setMode((m) => (m === "login" ? "signup" : "login")); setFieldErrors({}); setTouched({}); setServerError(null); };

  const handleBlur = (field: FieldKey, value: string) => {
    setTouched((t) => ({ ...t, [field]: true }));
    setFieldErrors((prev) => ({ ...prev, [field]: validateField(field, value, ctx) }));
  };

  const handleChange = (field: FieldKey, value: string) => {
    const setters: Record<FieldKey, () => void> = {
      name: () => setName(value), email: () => setEmail(value),
      password: () => setPassword(value), confirmPassword: () => setConfirmPassword(value),
    };
    setters[field]();
    const updates: FieldErrors = {};
    if (touched[field]) {
      const fieldCtx = field === "password" ? { ...ctx, password: value } : ctx;
      updates[field] = validateField(field, value, fieldCtx);
    }
    if (field === "password" && touched.confirmPassword) {
      updates.confirmPassword = validateField("confirmPassword", confirmPassword, { ...ctx, password: value });
    }
    if (Object.keys(updates).length) setFieldErrors((prev) => ({ ...prev, ...updates }));
    if (serverError) setServerError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError(null);
    const keys: FieldKey[] = isLogin ? ["email", "password"] : ["name", "email", "password", "confirmPassword"];
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
    const { error } = isLogin ? await login(email, password) : await signup(email, password, name);
    setIsLoading(false);
    if (error) {
      const key = error as keyof typeof a.errors;
      setServerError(a.errors[key] ?? a.errors.loginFailed);
    } else {
      closeLoginModal(); reset();
    }
  };

  const err = (field: FieldKey) => (touched[field] ? fieldErrors[field] : undefined);

  const handlePanelKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      if (showConfirmClose) setShowConfirmClose(false); else attemptClose();
      return;
    }
    if (e.key !== "Tab" || !panelRef.current) return;
    const focusable = Array.from(
      panelRef.current.querySelectorAll<HTMLElement>("button:not([disabled]), input:not([disabled]), a[href]")
    ).filter((el) => !el.closest("[inert]"));
    if (focusable.length < 2) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };

  return (
    <AnimatePresence>
      {isLoginModalOpen && (
        <>
          <motion.div className="fixed inset-0 z-[150] bg-surface-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} aria-hidden="true" />
          <motion.div
            role="dialog" aria-modal="true" aria-label={isLogin ? a.modalLogin : a.modalSignup}
            className="fixed inset-0 z-[160] flex items-center justify-center px-4"
            initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={attemptClose}
          >
            <div ref={panelRef} className="relative w-full max-w-sm bg-surface-raised p-8" onClick={(e) => e.stopPropagation()} onKeyDown={handlePanelKeyDown}>
              {/* Confirm-close overlay */}
              {showConfirmClose && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-6 bg-surface-raised px-8">
                  <p className="text-center text-sm leading-relaxed text-content-primary" style={{ whiteSpace: "pre-line" }}>
                    {a.confirmCloseBody}
                  </p>
                  <div className="flex gap-4">
                    <button type="button" ref={confirmCancelRef} onClick={() => setShowConfirmClose(false)} className="text-xs tracking-label text-content-secondary transition-colors hover:text-content-primary">
                      {a.continueEditing}
                    </button>
                    <button type="button" onClick={handleClose} className="text-xs tracking-label text-content-faint transition-colors hover:text-content-primary">
                      {a.close}
                    </button>
                  </div>
                </div>
              )}

              <div inert={showConfirmClose || undefined}>
                {/* Header */}
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <p className="text-xs tracking-label text-content-faint font-normal mb-2">PRISME</p>
                    <h2 className="text-2xl tracking-label text-content-primary">
                      {isLogin ? a.modalLogin : a.modalSignup}
                    </h2>
                  </div>
                  <button ref={closeButtonRef} onClick={attemptClose} className="flex items-center justify-center size-11 -mr-3 -mt-2 text-content-tertiary hover:text-content-primary transition-colors" aria-label={a.modalClose}>
                    <X size={14} strokeWidth={1.5} aria-hidden="true" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
                  {/* Name — signup only */}
                  {!isLogin && (
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="signup-name" className="text-xs tracking-label text-content-faint font-normal">NAME</label>
                      <input id="signup-name" type="text" autoComplete="name" value={name} onChange={(e) => handleChange("name", e.target.value)} onBlur={(e) => handleBlur("name", e.target.value)} className={inputCls(!!err("name"))} placeholder={a.namePlaceholder} required aria-invalid={!!err("name")} aria-describedby={err("name") ? "error-name" : undefined} />
                      {err("name") && <p id="error-name" className="text-xs text-red-400" role="alert">{err("name")}</p>}
                    </div>
                  )}

                  {/* Email */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="auth-email" className="text-xs tracking-label text-content-faint font-normal">EMAIL</label>
                    <input id="auth-email" type="email" autoComplete="email" value={email} onChange={(e) => handleChange("email", e.target.value)} onBlur={(e) => handleBlur("email", e.target.value)} className={inputCls(!!err("email"))} placeholder="name@domain.com" required aria-invalid={!!err("email")} aria-describedby={err("email") ? "error-email" : undefined} />
                    {err("email") && <p id="error-email" className="text-xs text-red-400" role="alert">{err("email")}</p>}
                  </div>

                  {/* Password */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="auth-password" className="text-xs tracking-label text-content-faint font-normal">PASSWORD</label>
                    <div className="relative">
                      <input id="auth-password" type={showPassword ? "text" : "password"} autoComplete={isLogin ? "current-password" : "new-password"} value={password} onChange={(e) => handleChange("password", e.target.value)} onBlur={(e) => handleBlur("password", e.target.value)} className={inputCls(!!err("password"), "pr-10")} placeholder="••••••••" required aria-invalid={!!err("password")} aria-describedby={err("password") ? "error-password" : undefined} />
                      <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-content-secondary hover:text-content-primary transition-colors" aria-label={showPassword ? a.hidePassword : a.showPassword}>
                        {showPassword ? <EyeOff size={16} strokeWidth={1.5} aria-hidden="true" /> : <Eye size={16} strokeWidth={1.5} aria-hidden="true" />}
                      </button>
                    </div>
                    {err("password") && <p id="error-password" className="text-xs text-red-400" role="alert">{err("password")}</p>}
                  </div>

                  {/* Confirm password — signup only */}
                  {!isLogin && (
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="signup-confirm" className="text-xs tracking-label text-content-faint font-normal">CONFIRM PASSWORD</label>
                      <div className="relative">
                        <input id="signup-confirm" type={showConfirmPassword ? "text" : "password"} autoComplete="new-password" value={confirmPassword} onChange={(e) => handleChange("confirmPassword", e.target.value)} onBlur={(e) => handleBlur("confirmPassword", e.target.value)} className={inputCls(!!err("confirmPassword"), "pr-10")} placeholder="••••••••" required aria-invalid={!!err("confirmPassword")} aria-describedby={err("confirmPassword") ? "error-confirm" : undefined} />
                        <button type="button" onClick={() => setShowConfirmPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-content-secondary hover:text-content-primary transition-colors" aria-label={showConfirmPassword ? a.hideConfirmPassword : a.showConfirmPassword}>
                          {showConfirmPassword ? <EyeOff size={16} strokeWidth={1.5} aria-hidden="true" /> : <Eye size={16} strokeWidth={1.5} aria-hidden="true" />}
                        </button>
                      </div>
                      {err("confirmPassword") && <p id="error-confirm" className="text-xs text-red-400" role="alert">{err("confirmPassword")}</p>}
                    </div>
                  )}

                  {serverError && <p className="text-xs text-red-400" role="alert">{serverError}</p>}

                  <button type="submit" disabled={isLoading} className="mt-1 w-full py-3 text-xs tracking-label bg-content-primary text-surface-base hover:bg-content-secondary disabled:opacity-50 transition-colors">
                    {isLoading ? (isLogin ? a.loggingIn : a.signingUp) : (isLogin ? a.login : a.signup)}
                  </button>

                  <p className="text-center text-xs text-content-faint">
                    {isLogin ? a.noAccount : a.hasAccount}{" "}
                    <button type="button" onClick={switchMode} className="text-content-secondary hover:text-content-primary underline underline-offset-2 transition-colors">
                      {isLogin ? a.signUpLink : a.loginLink}
                    </button>
                  </p>
                </form>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
