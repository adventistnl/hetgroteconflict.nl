"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { track } from "@vercel/analytics";

interface Props {
  locale: string;
  chapterNumber: string;
  chapterTitle: string;
  onContinue: () => void;
  onDismiss: () => void;
}

export function StudyGuideContinueBanner({
  locale,
  chapterNumber,
  chapterTitle,
  onContinue,
  onDismiss,
}: Props) {
  const t = useTranslations("study-guide");

  return (
    <div className="relative z-10 mx-auto mt-6 w-full max-w-6xl px-4">
      <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-[#2a2a3a] p-5 shadow-lg sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <p
            className="text-xs font-semibold uppercase tracking-widest text-white/50"
            style={{ fontFamily: "var(--font-rubik)" }}
          >
            {t("continueLabel")}
          </p>
          <p
            className="text-base font-bold text-white"
            style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}
          >
            {t("chapter")} {chapterNumber} — {chapterTitle}
          </p>
        </div>

        <div className="flex flex-row gap-3">
          <Link
            href={`/${locale}/guide/chapter/${chapterNumber}`}
            onClick={() => {
              track("studyGuide_continuedFromBanner", { chapter: chapterNumber });
              onContinue();
            }}
            className="rounded-full bg-[#4fa6c2] px-5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-80"
            style={{ fontFamily: "var(--font-rubik)" }}
          >
            {t("continueButton")}
          </Link>
          <button
            onClick={onDismiss}
            className="rounded-full border border-white/20 px-4 py-2 text-sm text-white/60 transition-colors hover:border-white/40 hover:text-white"
            style={{ fontFamily: "var(--font-rubik)" }}
          >
            {t("dismissButton")}
          </button>
        </div>
      </div>
    </div>
  );
}
