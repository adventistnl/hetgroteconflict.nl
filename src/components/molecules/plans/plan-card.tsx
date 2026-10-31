"use client";

import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, PlayCircle } from "lucide-react";
import { Plan } from "@/database/plans";
import { useProgress } from "@/contexts/progress-context";
import { useTranslations } from "next-intl";
import { languages } from "@/config/languages";
import { track } from "@vercel/analytics";

// ── Book cover per locale ─────────────────────────────────────────────────────

const LOCALE_TO_COVER: Record<string, string> = Object.fromEntries(
  languages.map((l) => [
    l.routeLocale,
    `/book-covers/${l.name.toLowerCase()}.${l.bookCoverExtension}`,
  ])
);

function getBookCover(locale: string): string {
  return LOCALE_TO_COVER[locale] ?? "/book-covers/english.avif";
}

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  plan: Plan;
  locale: string;
}

export function PlanCard({ plan, locale }: Props) {
  const { getPlanEntry, startPlan } = useProgress();
  const t = useTranslations("reading-plan");
  const entry = getPlanEntry(plan.plan);

  const isStarted = !!entry;
  const isCompleted = !!entry?.completedAt;
  const totalDays = plan.daily_breakdown_standard.length;
  const completedDays = entry?.completedDays.length ?? 0;
  const progressPct =
    totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;

  // Use the first chapter's video thumbnail; fall back to locale book cover
  const videoCover = plan.chapters.find((c) => c.videoCover)?.videoCover ?? null;
  const coverSrc = videoCover ?? getBookCover(locale);

  return (
    <Link
      href={`/${locale}/guide/plan/${plan.plan}`}
      onClick={() => {
        if (!isStarted) startPlan(plan.plan);
        track("readingPlan_click", { planId: plan.plan });
      }}
      className="group flex flex-col gap-4 rounded-2xl border border-transparent p-3 text-primary transition-all duration-300 hover:border-[#4fa6c2]/40 hover:bg-primary/[0.03]"
    >
      {/* Thumbnail — same aspect-video + rounded-xl as StudyGuideChapterCard */}
      <div className="relative aspect-video w-full overflow-hidden rounded-xl">
        <Image
          src={coverSrc}
          alt={`${plan.title} — cover`}
          fill
          className="cursor-pointer object-cover transition-all duration-500 ease-in-out"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Hover play overlay */}
        <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4fa6c2]">
            <svg
              className="ml-0.5 h-4 w-4 fill-current text-white"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        {/* Status badges — mirrors isLast / isVisited badges */}
        {isCompleted && (
          <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-[#4fa6c2] px-3 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white shadow-lg">
            <CheckCircle2 className="h-3 w-3" />
            Completed
          </span>
        )}
        {isStarted && !isCompleted && (
          <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-black/50 px-3 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
            <PlayCircle className="h-3 w-3 text-[#4fa6c2]" />
            {progressPct}%
          </span>
        )}

        {/* Progress bar at image bottom */}
        {isStarted && !isCompleted && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
            <div
              className="h-full bg-[#4fa6c2] transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        )}
      </div>

      {/* Info — identical structure to StudyGuideChapterCard info block */}
      <div className="flex flex-col gap-1.5">
        <span
          className="text-xs font-semibold uppercase tracking-widest text-[#4fa6c2]"
          style={{ fontFamily: "var(--font-rubik)" }}
        >
          {t("plan-order", { order: plan.order })}
        </span>
        <p className="line-clamp-2 text-sm font-semibold leading-snug">
          {plan.title}
        </p>
        <p
          className="mt-0.5 line-clamp-2 text-xs text-primary/50"
          style={{ fontFamily: "var(--font-rubik)" }}
        >
          {plan.card_subtitle}
        </p>
      </div>

      {/* CTA — mirrors "Watch →" button */}
      <span className="inline-flex items-center justify-center rounded-full border border-primary/30 bg-primary/5 px-4 py-2 text-xs font-semibold transition-all duration-300 group-hover:border-[#4fa6c2] group-hover:bg-[#4fa6c2] group-hover:text-white">
        {isCompleted ? t("card-review") : isStarted ? t("card-continue") : t("card-start")}
      </span>
    </Link>
  );
}
