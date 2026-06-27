"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import {
  BookOpen, Clock, CheckCircle2, PlayCircle, ArrowLeft, ArrowRight,
  Lock, ChevronDown, ChevronUp, Bookmark, ExternalLink,
} from "lucide-react";
import { plansDatabase, PlanDay } from "@/database/plans";
import { usePlanProgress } from "@/hooks/use-plan-progress";
import { useAuth } from "@/hooks/use-auth";
import { usePlanEnrollment } from "@/hooks/use-plan-enrollment";
import { AuthModal } from "@/components/atoms/auth-modal";
import { languages } from "@/config/languages";
import { track } from "@vercel/analytics";

// ── Helpers ───────────────────────────────────────────────────────────────────

const LOCALE_TO_COVER: Record<string, string> = Object.fromEntries(
  languages.map((l) => [l.routeLocale, `/book-covers/${l.name.toLowerCase()}.${l.bookCoverExtension}`])
);
const getBookCover = (locale: string) => LOCALE_TO_COVER[locale] ?? "/book-covers/english.avif";

function formatMinutes(min: number) {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m > 0 ? `${h}h ${m}min` : `${h}h`;
}

// ── Journey Map ───────────────────────────────────────────────────────────────

function JourneyMap({
  totalDays, completedDays, upNextDay, onDayClick,
}: {
  totalDays: number; completedDays: number[]; upNextDay: number | null;
  onDayClick: (day: number) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!upNextDay || !scrollRef.current) return;
    const el = scrollRef.current.querySelector<HTMLElement>(`[data-day="${upNextDay}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [upNextDay]);

  return (
    <div ref={scrollRef} className="flex items-center overflow-x-auto pb-1 scrollbar-none">
      {Array.from({ length: totalDays }, (_, i) => i + 1).map((day, idx) => {
        const done   = completedDays.includes(day);
        const isNext = day === upNextDay;
        const locked = !done && !isNext && day > (upNextDay ?? 1);
        return (
          <div key={day} className="flex shrink-0 items-center">
            <button
              data-day={day}
              onClick={() => onDayClick(day)}
              className={`relative flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
                done   ? "bg-[#4fa6c2] text-white shadow-md shadow-[#4fa6c2]/30"
                : isNext ? "bg-[#4fa6c2]/20 text-[#4fa6c2] ring-2 ring-[#4fa6c2] ring-offset-2 ring-offset-secondary"
                : locked ? "bg-primary/5 text-primary/20"
                         : "bg-primary/10 text-primary/60"
              }`}
            >
              {done ? <CheckCircle2 className="h-4 w-4" /> : locked ? <Lock className="h-3 w-3" /> : day}
            </button>
            {idx < totalDays - 1 && (
              <div className={`h-px w-4 shrink-0 ${done ? "bg-[#4fa6c2]/50" : "bg-primary/10"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── DayCard ───────────────────────────────────────────────────────────────────

type DayState = "completed" | "up-next" | "unlocked" | "locked";

function DayCard({
  day, locale, planId, state, autoOpen, onMarkComplete,
}: {
  day: PlanDay; locale: string; planId: string;
  state: DayState; autoOpen?: boolean;
  onMarkComplete: (day: number) => void;
}) {
  const [expanded, setExpanded] = useState(autoOpen ?? false);
  const isCompleted = state === "completed";
  const isLocked    = state === "locked";

  useEffect(() => { if (autoOpen) setExpanded(true); }, [autoOpen]);

  return (
    <div className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
      isCompleted   ? "border-[#4fa6c2]/30 bg-[#4fa6c2]/5"
      : state === "up-next" ? "border-[#4fa6c2]/50 bg-primary/5 shadow-lg shadow-[#4fa6c2]/10"
      : isLocked    ? "border-primary/5 bg-primary/[0.02] opacity-50"
                    : "border-primary/10 bg-primary/5"
    }`}>
      <button
        className="flex w-full items-center gap-4 p-4 text-left disabled:cursor-not-allowed"
        onClick={() => !isLocked && setExpanded((v) => !v)}
        disabled={isLocked}
      >
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
          isCompleted   ? "bg-[#4fa6c2] text-white"
          : state === "up-next" ? "bg-[#4fa6c2]/20 text-[#4fa6c2] ring-2 ring-[#4fa6c2]"
          : isLocked    ? "bg-primary/5 text-primary/20"
                        : "bg-primary/10 text-primary"
        }`}>
          {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : isLocked ? <Lock className="h-4 w-4" /> : day.day}
        </div>

        <div className="flex flex-1 flex-col gap-0.5 min-w-0">
          {state === "up-next" && (
            <span className="mb-0.5 flex w-fit items-center gap-1 rounded-full bg-[#4fa6c2] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
              <PlayCircle className="h-2.5 w-2.5" /> Up Next
            </span>
          )}
          <p className={`truncate text-sm font-semibold ${isLocked ? "text-primary/30" : "text-primary"}`}>{day.title}</p>
          <p className="text-[11px] text-primary/30">{day.pages} pages · {formatMinutes(day.total_minutes_estimate)}</p>
        </div>

        {!isLocked && !isCompleted && (
          expanded ? <ChevronUp className="h-4 w-4 shrink-0 text-primary/30" />
                   : <ChevronDown className="h-4 w-4 shrink-0 text-primary/30" />
        )}
      </button>

      {expanded && !isLocked && (
        <div className="flex flex-col gap-3 border-t border-primary/10 px-4 pb-4 pt-3">
          {day.steps.map((step) => (
            <div key={step.step}>
              {step.action === "watch" && step.videoUrl && step.videoCover ? (
                <a href={step.videoUrl} target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-3 rounded-xl border border-primary/10 bg-primary/5 p-3 transition hover:border-[#4fa6c2]/50"
                   onClick={() => track("readingPlan_watchVideo", { planId, day: day.day })}>
                  <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg">
                    <Image src={step.videoCover} alt="thumbnail" fill className="object-cover" sizes="80px" unoptimized />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <PlayCircle className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-primary">{step.label}</p>
                    <p className="mt-0.5 text-[11px] text-primary/40">{step.duration_minutes} min · YouTube <ExternalLink className="inline h-2.5 w-2.5 ml-0.5" /></p>
                  </div>
                </a>
              ) : step.action === "read" && day.chapter_number != null ? (
                <Link href={`/${locale}/guide/chapter/${day.chapter_number}`}
                      className="group flex items-center gap-3 rounded-xl border border-primary/10 bg-primary/5 p-3 transition hover:border-[#4fa6c2]/50"
                      onClick={() => track("readingPlan_readChapter", { planId, day: day.day })}>
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#4fa6c2]/10">
                    <BookOpen className="h-4 w-4 text-[#4fa6c2]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-primary">{step.label}</p>
                    <p className="mt-0.5 text-[11px] text-primary/40"><Clock className="mr-0.5 inline h-2.5 w-2.5" />{step.duration_minutes} min · {step.pages} pages</p>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-primary/20 transition group-hover:text-[#4fa6c2]" />
                </Link>
              ) : step.action === "read" ? (
                <div className="flex items-center gap-3 rounded-xl border border-primary/10 bg-primary/5 p-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#4fa6c2]/10">
                    <BookOpen className="h-4 w-4 text-[#4fa6c2]" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-primary">{step.label}</p>
                    <p className="mt-0.5 text-[11px] text-primary/40">{step.duration_minutes} min · {step.pages} pages</p>
                  </div>
                </div>
              ) : null}
            </div>
          ))}

          {!isCompleted && (
            <button
              className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl border border-[#4fa6c2]/50 bg-[#4fa6c2]/10 py-3 text-sm font-semibold text-[#4fa6c2] transition hover:bg-[#4fa6c2]/20 active:scale-[0.98]"
              onClick={() => { onMarkComplete(day.day); track("readingPlan_dayComplete", { planId, day: day.day }); }}
            >
              <CheckCircle2 className="h-4 w-4" /> Mark day {day.day} as complete
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ── PlanDetailClient ──────────────────────────────────────────────────────────

export default function PlanDetailClient({ planId, locale }: { planId: string; locale: string }) {
  const plan = plansDatabase.find((p) => p.plan === planId);
  if (!plan) notFound();

  const { user } = useAuth();
  const { getEnrollment, startPlan: dbStartPlan, markDayComplete: dbMarkDay, savePlan } = usePlanEnrollment(user?.id ?? null);
  const dbEnrollment = getEnrollment(planId);

  const { progress, getPlanEntry, startPlan: lsStartPlan, markDayComplete: lsMarkDay } = usePlanProgress();
  const [lsEntry, setLsEntry] = useState<ReturnType<typeof getPlanEntry>>(null);
  useEffect(() => { setLsEntry(getPlanEntry(planId)); }, [getPlanEntry, planId, progress]);

  const [showAuth, setShowAuth] = useState(false);
  const [focusDay, setFocusDay] = useState<number | null>(null);

  const completedDays: number[] = user ? (dbEnrollment?.completed_days ?? []) : (lsEntry?.completedDays ?? []);
  const isStarted   = user ? !!dbEnrollment           : !!lsEntry;
  const isCompleted = user ? !!dbEnrollment?.completed_at : !!lsEntry?.completedAt;
  const isSaved     = dbEnrollment?.is_saved ?? false;

  const totalDays   = plan.daily_breakdown_standard.length;
  const progressPct = totalDays > 0 ? Math.round((completedDays.length / totalDays) * 100) : 0;
  const upNextDay   = completedDays.length < totalDays ? completedDays.length + 1 : null;
  const nextPlan    = plan.next_plan ? plansDatabase.find((p) => p.plan === plan.next_plan) : null;

  function handleStart() {
    if (user) dbStartPlan(planId); else lsStartPlan(planId);
    setFocusDay(1);
    track("readingPlan_start", { planId });
  }

  function handleMarkComplete(day: number) {
    if (user) dbMarkDay(planId, day, totalDays); else lsMarkDay(planId, day, totalDays);
    setFocusDay(null);
  }

  function getDayState(day: number): DayState {
    if (completedDays.includes(day)) return "completed";
    if (day === upNextDay)            return "up-next";
    if (day < (upNextDay ?? 1))       return "unlocked";
    return "locked";
  }

  return (
    <div className="min-h-screen bg-secondary">

      {/* ── Hero ── */}
      <div className="relative h-[55vw] max-h-72 min-h-44 w-full overflow-hidden">
        <Image src={getBookCover(locale)} alt={plan.title} fill className="object-cover object-top" priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-secondary via-transparent to-transparent" />

        <Link href={`/${locale}/guide`}
              className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm transition hover:bg-black/60 sm:left-6 sm:top-6">
          <ArrowLeft className="h-3.5 w-3.5" /> Plans
        </Link>

        <div className="absolute bottom-0 left-0 p-5 sm:p-8">
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-[#4fa6c2]">Plan {plan.order} of {plansDatabase.length}</p>
          <h1 className="text-xl font-bold leading-tight text-white sm:text-3xl" style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}>{plan.title}</h1>
          <div className="mt-2 flex flex-wrap gap-3 text-xs text-white/50">
            <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" />{plan.total_chapters} chapters</span>
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" />~{formatMinutes(plan.total_time_minutes_estimate)}</span>
          </div>
        </div>

        {user && (
          <button onClick={() => savePlan(planId, !isSaved)}
                  className="absolute right-4 top-4 rounded-full bg-black/40 p-2.5 text-white backdrop-blur-sm transition hover:bg-black/60 sm:right-6 sm:top-6">
            <Bookmark className="h-4 w-4" fill={isSaved ? "currentColor" : "none"} />
          </button>
        )}
      </div>

      {/* ── Body ── */}
      <div className="mx-auto max-w-2xl px-4 pb-24 sm:px-6">

        {isStarted && (
          <div className="pt-5">
            <div className="mb-1.5 flex justify-between text-xs text-primary/40">
              <span>{completedDays.length}/{totalDays} days complete</span>
              <span>{progressPct}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-primary/10">
              <div className="h-full rounded-full bg-[#4fa6c2] transition-all duration-700" style={{ width: `${progressPct}%` }} />
            </div>
          </div>
        )}

        <p className="mt-5 text-sm leading-relaxed text-primary/50">{plan.description}</p>

        {!isStarted && (
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button onClick={handleStart}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#4fa6c2] py-3.5 text-sm font-bold text-white transition hover:bg-[#3d91ad] active:scale-[0.98]">
              <PlayCircle className="h-4 w-4" /> Start this plan
            </button>
            {!user && (
              <button onClick={() => setShowAuth(true)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-primary/10 py-3.5 text-sm font-semibold text-primary/60 transition hover:border-primary/30 hover:text-primary">
                Sign in to save progress
              </button>
            )}
          </div>
        )}

        {/* Journey Map */}
        <div className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-primary/40">Journey Map · {totalDays} days</h2>
            {upNextDay && <span className="text-xs text-[#4fa6c2]">Day {upNextDay} up next</span>}
          </div>
          <JourneyMap totalDays={totalDays} completedDays={completedDays} upNextDay={upNextDay}
                      onDayClick={(d) => setFocusDay(focusDay === d ? null : d)} />
        </div>

        {/* Day cards */}
        <div className="mt-6 flex flex-col gap-3">
          {plan.daily_breakdown_standard.map((day) => (
            <DayCard key={day.day} day={day} locale={locale} planId={planId}
                     state={getDayState(day.day)}
                     autoOpen={day.day === focusDay || (!focusDay && day.day === upNextDay && isStarted)}
                     onMarkComplete={(d) => {
                       if (!isStarted) handleStart();
                       handleMarkComplete(d);
                     }} />
          ))}
        </div>

        {/* Completion banner */}
        {isCompleted && (
          <div className="mt-8 flex flex-col items-center gap-4 rounded-2xl border border-[#4fa6c2]/30 bg-[#4fa6c2]/10 p-6 text-center">
            <span className="text-4xl">{plan.badge.split(" ")[0]}</span>
            <div>
              <p className="text-lg font-bold text-[#4fa6c2]">{plan.badge.split(" ").slice(1).join(" ")}</p>
              <p className="mt-1 text-sm text-primary/60">{plan.completion_message}</p>
            </div>
            {nextPlan ? (
              <Link href={`/${locale}/guide/plan/${nextPlan.plan}`}
                    className="flex items-center gap-2 rounded-xl bg-[#4fa6c2] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#3d91ad]">
                Next: {nextPlan.title} <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <p className="text-sm font-semibold text-primary">{plan.next_plan_cta}</p>
            )}
          </div>
        )}

        {!isCompleted && plan.next_plan && (
          <p className="mt-8 text-center text-xs text-primary/20">{plan.next_plan_cta}</p>
        )}
      </div>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </div>
  );
}
