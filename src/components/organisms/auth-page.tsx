"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";

// ── Google icon ────────────────────────────────────────────────────────────────

function GoogleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
      <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
      <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
      <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.022 35.026 44 30.038 44 24c0-1.341-.138-2.65-.389-3.917z" />
    </svg>
  );
}

// ── Field wrapper ─────────────────────────────────────────────────────────────

function Field({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl border border-primary/15 bg-primary/5 transition-colors focus-within:border-[#4fa6c2]/60 focus-within:bg-[#4fa6c2]/5">
      {children}
    </div>
  );
}

// ── AuthPage ──────────────────────────────────────────────────────────────────

type Mode = "sign-in" | "sign-up";

export function AuthPage({ defaultMode = "sign-in" }: { defaultMode?: Mode }) {
  const { signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("auth");

  const searchParams = useSearchParams();

  const [mode, setMode] = useState<Mode>(defaultMode);
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [success, setSuccess]   = useState<string | null>(null);

  useEffect(() => {
    if (searchParams.get("error") === "oauth") {
      setError(t("error-oauth"));
    }
    if (searchParams.get("mode") === "sign-up") {
      setMode("sign-up");
    }
  }, [searchParams, t]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (mode === "sign-in") {
      const { error } = await signInWithEmail(email, password);
      if (error) setError(error.message);
      else router.push(`/${locale}/guide`);
    } else {
      const { error } = await signUpWithEmail(email, password, fullName);
      if (error) setError(error.message);
      else setSuccess(t("success-verify"));
    }
    setLoading(false);
  }

  async function handleGoogle() {
    setError(null);
    setLoading(true);
    const { error } = await signInWithGoogle(`/${locale}/guide`);
    if (error) {
      setError(error.message);
      setLoading(false);
    }
    // em caso de sucesso o browser navega para o OAuth — não resetar loading
  }

  return (
    <div className="flex min-h-[100dvh] flex-col bg-secondary md:flex-row">

      {/* ── Left: form ── */}
      <section className="flex flex-1 items-center justify-center px-6 py-12 md:px-12">
        <div className="w-full max-w-md">

          {/* Back */}
          <Link href={`/${locale}/guide`}
                className="mb-8 inline-flex items-center gap-1.5 text-xs font-semibold text-primary/50 transition hover:text-primary">
            <ArrowLeft className="h-3.5 w-3.5" />
            {t("back-to-guide")}
          </Link>

          {/* Heading */}
          <h1 className="mb-1 text-3xl font-bold leading-tight text-primary md:text-4xl"
              style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}>
            {mode === "sign-in" ? t("sign-in-title") : t("sign-up-title")}
          </h1>
          <p className="mb-8 text-sm text-primary/55">
            {mode === "sign-in" ? t("sign-in-subtitle") : t("sign-up-subtitle")}
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {mode === "sign-up" && (
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-primary/60">{t("field-name")}</label>
                <Field>
                  <div className="flex items-center">
                    <User className="ml-4 h-4 w-4 shrink-0 text-primary/30" />
                    <input
                      type="text" value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={t("field-name-placeholder")}
                      className="flex-1 bg-transparent px-3 py-3.5 text-sm text-primary placeholder:text-primary/30 focus:outline-none"
                    />
                  </div>
                </Field>
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-primary/60">{t("field-email")}</label>
              <Field>
                <div className="flex items-center">
                  <Mail className="ml-4 h-4 w-4 shrink-0 text-primary/30" />
                  <input
                    type="email" value={email} required
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="flex-1 bg-transparent px-3 py-3.5 text-sm text-primary placeholder:text-primary/30 focus:outline-none"
                  />
                </div>
              </Field>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-primary/60">{t("field-password")}</label>
              <Field>
                <div className="flex items-center">
                  <Lock className="ml-4 h-4 w-4 shrink-0 text-primary/30" />
                  <input
                    type={showPw ? "text" : "password"} value={password} required
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="flex-1 bg-transparent px-3 py-3.5 text-sm text-primary placeholder:text-primary/30 focus:outline-none"
                  />
                  <button type="button" onClick={() => setShowPw((v) => !v)}
                          className="mr-3 text-primary/30 transition hover:text-primary/70">
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </Field>
            </div>

            {/* Error / success */}
            {error   && <p className="rounded-xl bg-red-50 px-4 py-3 text-xs font-medium text-red-600">{error}</p>}
            {success && <p className="rounded-xl bg-green-50 px-4 py-3 text-xs font-medium text-green-700">{success}</p>}

            <button
              type="submit" disabled={loading}
              className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-[#4fa6c2] py-3.5 text-sm font-bold text-white transition hover:bg-[#3d91ad] active:scale-[0.98] disabled:opacity-60"
            >
              {loading ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              ) : mode === "sign-in" ? t("btn-sign-in") : t("btn-create-account")}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-5 flex items-center">
            <div className="flex-1 border-t border-primary/10" />
            <span className="mx-4 text-xs text-primary/40">{t("divider")}</span>
            <div className="flex-1 border-t border-primary/10" />
          </div>

          {/* Google */}
          <button
            onClick={handleGoogle}
            disabled={loading}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-primary/15 bg-primary/5 py-3.5 text-sm font-semibold text-primary transition hover:border-[#4fa6c2]/40 hover:bg-[#4fa6c2]/5 disabled:opacity-60"
          >
            {loading ? (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-primary/20 border-t-primary/70" />
            ) : (
              <GoogleIcon />
            )}
            {t("btn-google")}
          </button>

          {/* Toggle mode */}
          <p className="mt-6 text-center text-sm text-primary/50">
            {mode === "sign-in" ? t("no-account") : t("have-account")}{" "}
            <button
              onClick={() => { setMode(mode === "sign-in" ? "sign-up" : "sign-in"); setError(null); setSuccess(null); }}
              className="font-semibold text-[#4fa6c2] hover:underline"
            >
              {mode === "sign-in" ? t("btn-create-account") : t("btn-sign-in")}
            </button>
          </p>
        </div>
      </section>

      {/* ── Right: hero ── */}
      <section className="relative hidden overflow-hidden md:flex md:flex-1">
        <Image
          src="/book-covers/english.avif"
          alt="The Great Controversy"
          fill
          className="object-cover object-center"
          priority
          sizes="50vw"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/20 to-black/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {/* Quote overlay */}
        <div className="absolute bottom-0 left-0 max-w-sm p-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#4fa6c2]">{t("hero-eyebrow")}</p>
          <h2 className="mt-2 text-2xl font-bold leading-snug text-white"
              style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}>
            {t("hero-title")}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-white/60">
            {t("hero-subtitle")}
          </p>
          <div className="mt-6 flex gap-6 text-center">
            <div>
              <p className="text-2xl font-bold text-white">14</p>
              <p className="text-xs text-white/50">{t("hero-reading-plans")}</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">42</p>
              <p className="text-xs text-white/50">{t("hero-chapters")}</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">11</p>
              <p className="text-xs text-white/50">Languages</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
