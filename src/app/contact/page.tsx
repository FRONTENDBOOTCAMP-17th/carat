"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLang } from "@/context/LanguageContext";

type FormState = { name: string; email: string; message: string };
type Errors = Partial<FormState>;

const BASE =
  "w-full bg-surface-input text-content-primary text-sm px-3 py-2.5 border focus:outline-none transition-colors placeholder:text-content-muted";

function inputCls(hasError: boolean) {
  return `${BASE} ${
    hasError
      ? "border-red-700 focus:border-red-500"
      : "border-surface-elevated focus:border-content-tertiary"
  }`;
}

export default function ContactPage() {
  const { t } = useLang();
  const p = t.pages.contact;

  const [form, setForm] = useState<FormState>({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormState, boolean>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function validate({ name, email, message }: FormState): Errors {
    const errs: Errors = {};
    if (!name.trim()) errs.name = p.errors.nameRequired;
    if (!email.trim()) errs.email = p.errors.emailRequired;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = p.errors.emailInvalid;
    if (!message.trim()) errs.message = p.errors.messageRequired;
    return errs;
  }

  const err = (field: keyof FormState) => (touched[field] ? errors[field] : undefined);

  const handleChange = (field: keyof FormState, value: string) => {
    const next = { ...form, [field]: value };
    setForm(next);
    if (touched[field]) setErrors(validate(next));
  };

  const handleBlur = (field: keyof FormState) => {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors(validate(form));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, message: true });
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsLoading(false);
    setSubmitted(true);
  };


  return (
    <main id="main-content" className="min-h-screen bg-surface-darkest flex flex-col">
      <Navbar />

      <div className="flex-1 w-full max-w-container mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24">
        <nav aria-label={p.backNav}>
          <Link
            href="/"
            className="text-xs tracking-label text-content-secondary hover:text-content-primary transition-colors"
          >
            ← PRISME
          </Link>
        </nav>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Info */}
          <div>
            <p className="mb-3 text-xs tracking-label text-content-faint font-normal">
              {p.section}
            </p>
            <h1
              className="mb-8 text-4xl sm:text-5xl text-content-primary font-light"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              {p.title}
            </h1>
            <p className="mb-12 text-xs leading-relaxed text-content-secondary max-w-xs">
              {p.desc}
            </p>

            <dl className="space-y-6">
              <div>
                <dt className="mb-1 text-xs tracking-label text-content-secondary">{p.labelEmail}</dt>
                <dd className="text-xs text-content-secondary">contact@prisme.co</dd>
              </div>
              <div>
                <dt className="mb-1 text-xs tracking-label text-content-secondary">{p.labelLocation}</dt>
                <dd className="text-xs text-content-secondary">{p.location}</dd>
              </div>
              <div>
                <dt className="mb-1 text-xs tracking-label text-content-secondary">{p.labelHours}</dt>
                <dd className="text-xs text-content-secondary whitespace-pre-line">{p.hours}</dd>
              </div>
            </dl>
          </div>

          {/* Form */}
          <div>
            {submitted ? (
              <div className="flex flex-col justify-center h-full min-h-64 gap-4">
                <p
                  className="text-2xl text-content-primary font-light"
                  style={{ fontFamily: "var(--font-cinzel)" }}
                >
                  {p.thankYou}
                </p>
                <p className="text-xs leading-relaxed text-content-secondary whitespace-pre-line">{p.successMsg}</p>
                <button
                  onClick={() => {
                    setForm({ name: "", email: "", message: "" });
                    setTouched({});
                    setErrors({});
                    setSubmitted(false);
                  }}
                  className="mt-4 self-start text-xs tracking-label text-content-secondary hover:text-content-primary transition-colors"
                >
                  {p.newInquiry}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="contact-name" className="text-xs tracking-label text-content-faint font-normal">
                    NAME
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    autoComplete="name"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    onBlur={() => handleBlur("name")}
                    className={inputCls(!!err("name"))}
                    placeholder={p.namePlaceholder}
                    aria-invalid={!!err("name")}
                    aria-describedby={err("name") ? "error-contact-name" : undefined}
                  />
                  {err("name") && (
                    <p id="error-contact-name" className="text-xs text-red-400" role="alert">
                      {err("name")}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="contact-email" className="text-xs tracking-label text-content-faint font-normal">
                    EMAIL
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    onBlur={() => handleBlur("email")}
                    className={inputCls(!!err("email"))}
                    placeholder="name@domain.com"
                    aria-invalid={!!err("email")}
                    aria-describedby={err("email") ? "error-contact-email" : undefined}
                  />
                  {err("email") && (
                    <p id="error-contact-email" className="text-xs text-red-400" role="alert">
                      {err("email")}
                    </p>
                  )}
                </div>

                {/* Message */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="contact-message" className="text-xs tracking-label text-content-faint font-normal">
                    MESSAGE
                  </label>
                  <textarea
                    id="contact-message"
                    rows={5}
                    value={form.message}
                    onChange={(e) => handleChange("message", e.target.value)}
                    onBlur={() => handleBlur("message")}
                    className={`${inputCls(!!err("message"))} resize-none`}
                    placeholder={p.msgPlaceholder}
                    aria-invalid={!!err("message")}
                    aria-describedby={err("message") ? "error-contact-message" : undefined}
                  />
                  {err("message") && (
                    <p id="error-contact-message" className="text-xs text-red-400" role="alert">
                      {err("message")}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="mt-1 w-full py-3 text-xs tracking-label bg-content-secondary text-surface-darkest hover:bg-content-faint disabled:opacity-50 transition-colors duration-200"
                >
                  {isLoading ? p.sending : p.submit}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
