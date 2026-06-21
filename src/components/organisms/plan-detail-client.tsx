"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
  BookOpen,
  Clock,
  CheckCircle2,
  PlayCircle,
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { plansDatabase, PlanDay } from "@/database/plans";
import { usePlanProgress } from "@/hooks/use-plan-progress";
import { track } from "@vercel/analytics";

// ── helpers ──────────────────────────────────────────────

function formatMinutes(min: number) {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m > 0 ? `${h}h ${m}min` : `${h}h`;
}

// ── DayCard ───────────────────────────────────────────────

function DayCard({
  day,
  locale,
  planId,
  isCompleted,
  onMarkComplete,
}: {
  day: PlanDay;
  locale: string;
  planId: string;
  isCompleted: boolean;
  onMarkComplete: (day: number) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`rounded-2xl border transition-all duration-300 ${
        isCompleted
          ? "border-[#4fa6c2]/40 bg-[#4fa6c2]/5"
          : "border-white/10 bg-white/5"
      }`}
    >
      {/* Day header */}
      <button
        className="flex w-full items-center gap-4 p-5 text-left"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-white">
          {day.day}
        </span>
        <div className="flex flex-1 flex-col gap-0.5 min-w-0">
          <p className="truncate text-sm font-semibold text-white">{day.title}</p>
          <p className="text-[11px] text-white/40">
            {day.pages} pages · {formatMinutes(day.total_minutes_estimate)}
          </p>
        </div>
        {isCompleted ? (
          <CheckCircle2 className="h-5 w-5 shrink-0 text-[#4fa6c2]" />
        ) : (
          <span className="shrink-0 text-white/30">
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </span>
        )}
      </button>

      {/* Expanded steps */}
      {expanded && (
        <div className="flex flex-col gap-3 border-t border-white/10 px-5 pb-5 pt-4">
          {day.steps.map((step) => (
            <div key={step.step} className="flex flex-col gap-3">
              {step.action === "watch" && step.videoUrl && step.videoCover ? (
                <a
                  href={step.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3 transition hover:border-[#4fa6c2]/50"
                  onClick={() =>
                    track("readingPlan_watchVideo", { planId, day: day.day })
                  }
                >
                  {/* Thumbnail */}
                  <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src={step.videoCover}
                      alt={step.label}
                      fill
                      className="object-cover"
                      sizes="96px"
                      unoptimized
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <PlayCircle className="h-7 w-7 text-white" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-xs font-semibold text-white">{step.label}</p>
                    <p className="text-[11px] text-white/40">
                      <Clock className="mr-0.5 inline h-3 w-3" />
                      {step.duration_minutes} min · YouTube
                    </p>
                  </div>
                </a>
              ) : step.action === "read" ? (
                day.chapter_number != null ? (
                  <Link
                    href={`/${locale}/guide/chapter/${day.chapter_number}`}
                    className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3 transition hover:border-[#4fa6c2]/50"
                    onClick={() =>
                      track("readingPlan_readChapter", { planId, day: day.day, chapter: day.chapter_number })
                    }
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#4fa6c2]/10">
                      <BookOpen className="h-5 w-5 text-[#4fa6c2]" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-xs font-semibold text-white">{step.label}</p>
                      <p className="text-[11px] text-white/40">
                        <Clock className="mr-0.5 inline h-3 w-3" />
                        {step.duration_minutes} min · {step.pages} pages
                      </p>
                    </div>
                    <ArrowRight className="ml-auto h-4 w-4 text-white/30 transition group-hover:text-[#4fa6c2]" />
                  </Link>
                ) : (
                  <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#4fa6c2]/10">
                      <BookOpen className="h-5 w-5 text-[#4fa6c2]" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-xs font-semibold text-white">{step.label}</p>
                      <p className="text-[11px] text-white/40">
                        <Clock className="mr-0.5 inline h-3 w-3" />
                        {step.duration_minutes} min · {step.pages} pages
                      </p>
                    </div>
                  </div>
                )
              ) : null}
            </div>
          ))}

          {!isCompleted && (
            <button
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-[#4fa6c2]/50 bg-[#4fa6c2]/10 py-2.5 text-sm font-semibold text-[#4fa6c2] transition hover:bg-[#4fa6c2]/20"
              onClick={() => {
                onMarkComplete(day.day);
                track("readingPlan_dayComplete", { planId, day: day.day });
              }}
            >
              <CheckCircle2 className="h-4 w-4" />
              Mark day {day.day} as complete
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ── PlanDetailClient (main page component) ────────────────

export default function PlanDetailClient({
  planId,
  locale,
}: {
  planId: string;
  locale: string;
}) {
  const plan = plansDatabase.find((p) => p.plan === planId);
  if (!plan) notFound();

  const { progress, getPlanEntry, startPlan, markDayComplete } = usePlanProgress();
  const [entry, setEntry] = useState<ReturnType<typeof getPlanEntry>>(null);

  // Hydrate from localStorage
  useEffect(() => {
    setEntry(getPlanEntry(planId));
  }, [getPlanEntry, planId]);

  // Keep entry in sync after mutations
  useEffect(() => {
    setEntry(getPlanEntry(planId));
  }, [getPlanEntry, planId, progress]);

  const totalDays = plan.daily_breakdown_standard.length;
  const completedDays = entry?.completedDays ?? [];
  const isCompleted = !!entry?.completedAt;
  const progressPct = totalDays > 0 ? Math.round((completedDays.length / totalDays) * 100) : 0;

  function handleMarkComplete(day: number) {
    if (!entry) startPlan(planId);
    markDayComplete(planId, day, totalDays);
  }

  const nextPlan = plan.next_plan
    ? plansDatabase.find((p) => p.plan === plan.next_plan)
    : null;

  return (
    <div className="min-h-screen bg-secondary">
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">

        {/* Back */}
        <Link
          href={`/${locale}/guide`}
          className="mb-8 flex items-center gap-2 text-sm text-white/40 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          All reading plans
        </Link>

        {/* Plan header */}
        <div className="mb-8 flex flex-col gap-3">
          <span className="text-4xl">{plan.badge.split(" ")[0]}</span>
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-[#4fa6c2]">
              Plan {plan.order} of {plansDatabase.length}
            </p>
            <h1 className="font-plus-jakarta text-2xl font-bold text-white sm:text-3xl">
              {plan.title}
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-white/50">{plan.description}</p>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap gap-4 pt-1 text-sm text-white/40">
            <span className="flex items-center gap-1.5">
              <BookOpen className="h-4 w-4" />
              {plan.total_chapters} {plan.total_chapters === 1 ? "chapter" : "chapters"}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              ~{formatMinutes(plan.total_time_minutes_estimate)}
            </span>
            <span className="text-white/30">|</span>
            <span>{plan.card_subtitle}</span>
          </div>

          {/* Progress */}
          {entry && (
            <div className="mt-2 flex flex-col gap-1.5">
              <div className="flex justify-between text-xs text-white/40">
                <span>
                  {completedDays.length} / {totalDays} days complete
                </span>
                <span>{progressPct}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-[#4fa6c2] transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          )}

          {/* Start CTA if not started */}
          {!entry && (
            <button
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#4fa6c2] py-3 text-sm font-semibold text-white transition hover:bg-[#3d8fa8]"
              onClick={() => {
                startPlan(planId);
                track("readingPlan_start", { planId });
              }}
            >
              <PlayCircle className="h-4 w-4" />
              Start this plan
            </button>
          )}
        </div>

        {/* Completion banner */}
        {isCompleted && (
          <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-[#4fa6c2]/40 bg-[#4fa6c2]/10 p-6 text-center">
            <p className="text-3xl">{plan.badge.split(" ")[0]}</p>
            <p className="text-lg font-bold text-[#4fa6c2]">
              {plan.badge.split(" ").slice(1).join(" ")}
            </p>
            <p className="text-sm text-white/60">{plan.completion_message}</p>
            {nextPlan && (
              <Link
                href={`/${locale}/guide/plan/${nextPlan.plan}`}
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-[#4fa6c2] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#3d8fa8]"
              >
                Next: {nextPlan.title}
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
            {!nextPlan && (
              <p className="mt-1 text-sm font-semibold text-white">{plan.next_plan_cta}</p>
            )}
          </div>
        )}

        {/* Day list */}
        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-white/40">
            Daily Breakdown · {totalDays} days
          </h2>
          {plan.daily_breakdown_standard.map((day) => (
            <DayCard
              key={day.day}
              day={day}
              locale={locale}
              planId={planId}
              isCompleted={completedDays.includes(day.day)}
              onMarkComplete={handleMarkComplete}
            />
          ))}
        </div>

        {/* Next plan nudge (if not completed yet) */}
        {!isCompleted && plan.next_plan_cta && (
          <p className="mt-8 text-center text-xs text-white/30">{plan.next_plan_cta}</p>
        )}
      </div>
    </div>
  );
}
