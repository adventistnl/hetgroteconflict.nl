"use client";

import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, PlayCircle, ChevronRight } from "lucide-react";
import { Plan } from "@/database/plans";
import { usePlanProgress } from "@/hooks/use-plan-progress";
import { languages } from "@/config/languages";
import { track } from "@vercel/analytics";

// ── Book cover map: locale → /book-covers/{name}.{ext} ───────────────────────

const LOCALE_TO_COVER: Record<string, string> = Object.fromEntries(
  languages.map((l) => [
    l.routeLocale,
    `/book-covers/${l.name.toLowerCase()}.${l.bookCoverExtension}`,
  ])
);

function getBookCover(locale: string): string {
  return LOCALE_TO_COVER[locale] ?? "/book-covers/english.avif";
}

// ── PlanCard — mirrors StudyGuideChapterCard exactly ─────────────────────────

interface PlanCardProps {
  plan: Plan;
  locale: string;
}

function PlanCard({ plan, locale }: PlanCardProps) {
  const { getPlanEntry, startPlan } = usePlanProgress();
  const entry = getPlanEntry(plan.plan);

  const isStarted = !!entry;
  const isCompleted = !!entry?.completedAt;
  const totalDays = plan.daily_breakdown_standard.length;
  const completedDays = entry?.completedDays.length ?? 0;
  const progressPct = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;

  const bookCover = getBookCover(locale);
  const href = `/${locale}/guide/plan/${plan.plan}`;

  return (
    <Link
      href={href}
      onClick={() => {
        if (!isStarted) startPlan(plan.plan);
        track("readingPlan_click", { planId: plan.plan });
      }}
      className="group flex flex-col gap-4 text-primary transition-all duration-500 hover:scale-105"
    >
      {/* Book cover thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden rounded-xl">
        <Image
          src={bookCover}
          alt={`${plan.title} — book cover`}
          fill
          className="cursor-pointer object-cover transition-all duration-500 ease-in-out"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4fa6c2]">
            <svg className="ml-0.5 h-4 w-4 fill-current text-white" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        {/* Status badges — same pattern as chapter card */}
        {isCompleted && (
          <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-[#4fa6c2] px-3 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white shadow-lg">
            <CheckCircle2 className="h-3 w-3" />
            Completed
          </span>
        )}
        {isStarted && !isCompleted && (
          <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-black/50 px-3 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
            <PlayCircle className="h-3 w-3 text-[#4fa6c2]" />
            {progressPct}% done
          </span>
        )}

        {/* Progress bar overlay at bottom */}
        {isStarted && !isCompleted && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/40">
            <div
              className="h-full bg-[#4fa6c2] transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        )}
      </div>

      {/* Info — identical layout to chapter card */}
      <div className="flex flex-col gap-1.5">
        <span
          className="text-xs font-semibold uppercase tracking-widest text-[#4fa6c2]"
          style={{ fontFamily: "var(--font-rubik)" }}
        >
          Plan {plan.order}
        </span>
        <p className="line-clamp-2 text-sm font-semibold leading-snug">{plan.title}</p>
        <p
          className="mt-0.5 line-clamp-2 text-xs text-primary/50"
          style={{ fontFamily: "var(--font-rubik)" }}
        >
          {plan.card_subtitle}
        </p>
      </div>

      {/* CTA button — mirrors "Watch →" */}
      <span className="inline-flex items-center justify-center rounded-full border border-primary/30 bg-primary/5 px-4 py-2 text-xs font-semibold transition-colors group-hover:bg-primary/15">
        {isStarted && !isCompleted ? "Continue →" : isCompleted ? "Review →" : "Start plan →"}
      </span>
    </Link>
  );
}

// ── PlansSection ─────────────────────────────────────────────────────────────

interface PlansSectionProps {
  plans: Plan[];
  locale: string;
}

export function PlansSection({ plans, locale }: PlansSectionProps) {
  const sorted = [...plans].sort((a, b) => a.order - b.order);

  return (
    <section className="flex flex-col gap-4">
      {/* Heading — style matches reference "Psalm ›" row */}
      <div className="flex items-center gap-1.5">
        <h2
          className="text-base font-bold text-primary sm:text-lg"
          style={{ fontFamily: "var(--font-rubik)" }}
        >
          Reading Plans
        </h2>
        <ChevronRight className="h-4 w-4 text-primary/40" />
      </div>

      {/* Horizontal scroll — same negative-margin trick as mobile chapter carousel */}
      <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:overflow-visible sm:px-0">
        <div className="flex gap-4 pb-2 sm:grid sm:grid-cols-2 sm:pb-0 lg:grid-cols-3 xl:grid-cols-4">
          {sorted.map((plan) => (
            <div key={plan.plan} className="w-[calc(100vw-5rem)] shrink-0 sm:w-auto">
              <PlanCard plan={plan} locale={locale} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
