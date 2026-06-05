"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { languages, routeLocaleToFlagCode } from "@/config/languages";
import { captureLeadAction } from "@/app/actions";

const BOOK_COVER_MAP: Record<string, string> = {
  english: "/book-covers/english.avif",
  german: "/book-covers/german.avif",
  spanish: "/book-covers/spanish.avif",
  twi: "/book-covers/twi.avif",
};

export function ExitIntentModal({ forceOpen = false }: { forceOpen?: boolean } = {}) {
  const locale = useLocale();
  const t = useTranslations("exit-intent");
  const [isVisible, setIsVisible] = useState(forceOpen);
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [source, setSource] = useState<"exit-intent" | "1min-trigger">("exit-intent");
  const hasShown = useRef(false);

  // Determine book cover — use locale-specific if available, else English
  const flagCode = routeLocaleToFlagCode[locale.toLowerCase()] || locale.toLowerCase();
  const lang = languages.find((l) => l.flagCode === flagCode);
  const langName = lang?.name?.toLowerCase() ?? "english";
  const bookCover = BOOK_COVER_MAP[langName] ?? BOOK_COVER_MAP["english"];

  const trigger = (triggerSource: "exit-intent" | "1min-trigger") => {
    if (hasShown.current) return;
    if (sessionStorage.getItem("exit-intent-shown")) return;
    hasShown.current = true;
    sessionStorage.setItem("exit-intent-shown", "1");
    setSource(triggerSource);
    setIsVisible(true);
  };

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY < 20) trigger("exit-intent");
    };

    // Mobile fallback: rapid scroll up
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const delta = lastScrollY - window.scrollY;
      if (delta > 80) trigger("exit-intent");
      lastScrollY = window.scrollY;
    };

    // 1-minute time-on-page trigger
    const timer = setTimeout(() => trigger("1min-trigger"), 60_000);

    document.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(t("error-email"));
      return;
    }
    if (!consent) {
      setError(t("error-consent"));
      return;
    }

    setLoading(true);
    try {
      await captureLeadAction(email, source, locale);
      setSubmitted(true);
    } catch {
      setError(t("error-generic"));
    } finally {
      setLoading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={() => setIsVisible(false)}
    >
      <div
        className="relative flex w-full max-w-[780px] overflow-hidden rounded-2xl shadow-2xl"
        style={{ backgroundColor: "hsl(120, 1%, 91%)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/10 text-gray-700 transition-colors hover:bg-black/20"
          aria-label="Close"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Left — Book cover (dark panel) */}
        <div className="relative hidden flex-shrink-0 bg-[#1e1e2e] md:flex md:w-[220px] lg:w-[260px]">
          <Image
            src={bookCover}
            alt="The Great Controversy book cover"
            fill
            className="object-cover"
            sizes="260px"
          />
          {/* Gradient blending into right panel */}
          <div
            className="absolute inset-y-0 right-0 w-12 bg-gradient-to-r from-transparent"
            style={{ "--tw-gradient-to": "hsl(120, 1%, 91%)" } as React.CSSProperties}
          />
        </div>

        {/* Right — CTA content */}
        <div className="flex flex-1 flex-col justify-center gap-5 px-8 py-10 lg:px-10">
          {submitted ? (
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#4fa6c2]/15">
                <svg className="h-7 w-7 text-[#4fa6c2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2
                className="text-2xl font-bold text-primary"
                style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}
              >
                {t("success-title")}
              </h2>
              <p
                className="text-sm leading-relaxed text-primary/60"
                style={{ fontFamily: "var(--font-rubik)" }}
              >
                {t("success-body")}
              </p>
              <button
                onClick={() => setIsVisible(false)}
                className="mt-2 rounded-full bg-[#4fa6c2] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#3d91ad]"
                style={{ fontFamily: "var(--font-rubik)" }}
              >
                {t("success-button")}
              </button>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-2">
                <span
                  className="text-xs font-semibold uppercase tracking-widest text-[#4fa6c2]"
                  style={{ fontFamily: "var(--font-rubik)" }}
                >
                  {t("badge")}
                </span>
                <h2
                  className="text-2xl font-bold leading-snug text-primary lg:text-3xl"
                  style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}
                >
                  {t("title")}
                </h2>
                <p
                  className="text-sm leading-relaxed  text-primary"
                  style={{ fontFamily: "var(--font-rubik)" }}
                >
                  {t("body")}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("placeholder")}
                  className="w-full rounded-xl border border-black/10 bg-white/70 px-4 py-3 text-sm text-primary outline-none transition-all focus:border-[#4fa6c2] focus:ring-2 focus:ring-[#4fa6c2]/20"
                  style={{ fontFamily: "var(--font-rubik)" }}
                  required
                />

                <label
                  className="flex cursor-pointer items-start gap-3 text-xs leading-relaxed  text-primary"
                  style={{ fontFamily: "var(--font-rubik)" }}
                >
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-0.5 h-4 w-4 flex-shrink-0 cursor-pointer accent-[#4fa6c2]"
                  />
                  <span>{t("consent")}</span>
                </label>

                {error && (
                  <p
                    className="text-xs font-medium text-red-600"
                    style={{ fontFamily: "var(--font-rubik)" }}
                  >
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full bg-[#4fa6c2] py-3 text-sm font-bold text-white transition-all hover:bg-[#3d91ad] disabled:opacity-60"
                  style={{ fontFamily: "var(--font-rubik)" }}
                >
                  {loading ? "…" : t("submit")}
                </button>
              </form>

              <button
                onClick={() => setIsVisible(false)}
                className="text-center text-xs  text-primary underline-offset-2 transition-colors hover:text-primary/70 hover:underline"
                style={{ fontFamily: "var(--font-rubik)" }}
              >
                {t("skip")}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
