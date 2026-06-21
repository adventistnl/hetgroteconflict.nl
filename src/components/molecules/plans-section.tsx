"use client";

import Link from "next/link";
import { BookOpen, Clock, ChevronRight, CheckCircle2, PlayCircle } from "lucide-react";
import { Plan } from "@/database/plans";
import { usePlanProgress } from "@/hooks/use-plan-progress";
import { track } from "@vercel/analytics";

// ── PlanCard ─────────────────────────────────────────────

interface PlanCardProps {
  plan: Plan;
  locale: string;
}

function PlanCard({ plan, locale }: PlanCardProps) {
  const { getPlanEntry, startPlan } = usePlanProgress();
  const entry = getPlanEntry(plan.plan);

  const totalDays = plan.daily_breakdown_standard.length;
  const completedDays = entry?.completedDays.length ?? 0;
  const isStarted = !!entry;
  const isCompleted = !!entry?.completedAt;
  const progressPct = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;

  const href = `/${locale}/guide/plan/${plan.plan}`;

  return (
    <Link
      href={href}
      onClick={() => {
        if (!isStarted) startPlan(plan.plan);
        track("readingPlan_click", { planId: plan.plan });
      }}
      className="group relative flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 transition-all duration-300 hover:border-[#4fa6c2]/50 hover:bg-white/8 hover:shadow-lg hover:shadow-[#4fa6c2]/10"
      style={{ minWidth: 260 }}
    >
      {/* Badge */}
      <span className="text-2xl">{plan.badge.split(" ")[0]}</span>

      {/* Title */}
      <div className="flex flex-col gap-1">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-[#4fa6c2]">
          Plan {plan.order}
        </p>
        <h3 className="font-plus-jakarta text-base font-bold leading-snug text-white group-hover:text-[#4fa6c2] transition-colors duration-200">
          {plan.title}
        </h3>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-white/50">
          {plan.description}
        </p>
      </div>

      {/* Stats */}
      <div className="flex flex-wrap gap-3 text-[11px] text-white/40">
        <span className="flex items-center gap-1">
          <BookOpen className="h-3 w-3" />
          {plan.total_chapters} {plan.total_chapters === 1 ? "chapter" : "chapters"}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          ~{plan.total_time_minutes_estimate} min
        </span>
      </div>

      {/* Progress bar / status */}
      {isCompleted ? (
        <div className="flex items-center gap-2 rounded-lg bg-[#4fa6c2]/10 px-3 py-2">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-[#4fa6c2]" />
          <span className="text-xs font-medium text-[#4fa6c2]">{plan.badge}</span>
        </div>
      ) : isStarted ? (
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-[11px] text-white/40">
            <span className="flex items-center gap-1">
              <PlayCircle className="h-3 w-3 text-[#4fa6c2]" />
              In progress
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
      ) : (
        <div className="flex items-center gap-1 text-xs font-medium text-[#4fa6c2] opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          Start plan <ChevronRight className="h-3.5 w-3.5" />
        </div>
      )}
    </Link>
  );
}

// ── PlansSection ─────────────────────────────────────────

interface PlansSectionProps {
  plans: Plan[];
  locale: string;
}

export function PlansSection({ plans, locale }: PlansSectionProps) {
  const sorted = [...plans].sort((a, b) => a.order - b.order);

  return (
    <section className="flex flex-col gap-6">
      {/* Heading */}
      <div className="flex flex-col gap-1">
        <h2 className="font-plus-jakarta text-xl font-bold text-white sm:text-2xl">
          Reading Plans
        </h2>
        <p className="text-sm text-white/50">
          Guided journeys through The Great Controversy — one plan at a time.
        </p>
      </div>

      {/* Horizontal scroll on mobile, wrap on desktop */}
      <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:overflow-visible sm:px-0">
        <div className="flex gap-4 pb-2 sm:grid sm:grid-cols-2 sm:pb-0 lg:grid-cols-3 xl:grid-cols-4">
          {sorted.map((plan) => (
            <PlanCard key={plan.plan} plan={plan} locale={locale} />
          ))}
        </div>
      </div>
    </section>
  );
}
