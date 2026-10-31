"use client";

import { createContext, useContext, useCallback, useEffect, type ReactNode } from "react";
import { useLocale } from "next-intl";
import { usePlanProgress, type PlanEntry } from "@/hooks/use-plan-progress";
import { useXp, getLevelInfo, type XpSkill, xpForPlan } from "@/hooks/use-xp";
import { usePlanEnrollment, type PlanEnrollment } from "@/hooks/use-plan-enrollment";
import { useAuth } from "@/hooks/use-auth";
import { plansDatabase } from "@/database/plans";
import { type Insignia } from "@/database/insignia";
import { getLocalizedPlan } from "@/utils/get-localized-plans";
import { getLocalizedInsignia } from "@/utils/get-localized-insignia";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ChapterPlanInfo {
  planId: string;
  planTitle: string;
  /** 0-100 */
  progressPct: number;
  isCompleted: boolean;
  badge: string;
  insignia: Insignia | null;
}

interface ProgressContextValue {
  // ── Auth ───────────────────────────────────────────────────────────────────
  isLoggedIn: boolean;

  // ── Plan progress (DB when logged in, localStorage otherwise) ─────────────
  startPlan: (planId: string) => void;
  markDayComplete: (planId: string, day: number, totalDays: number) => void;
  resetPlan: (planId: string) => void;
  getPlanEntry: (planId: string) => PlanEntry | null;
  /** Full enrollment record — only available when logged in */
  getEnrollment: (planId: string) => PlanEnrollment | null;
  savePlan: (planId: string, saved: boolean) => Promise<void>;
  enrollmentLoading: boolean;

  // ── XP & insignia ─────────────────────────────────────────────────────────
  totalXp: number;
  skills: XpSkill[];
  levelInfo: ReturnType<typeof getLevelInfo>;
  /** Awards XP for a plan; idempotent — safe to call multiple times */
  awardPlanXp: (planId: string) => void;

  // ── Helpers ────────────────────────────────────────────────────────────────
  /** Returns plan progress for the first active/completed plan that owns this chapter number */
  getChapterPlanInfo: (chapterNumber: string | number | null) => ChapterPlanInfo | null;
}

// ── Context ───────────────────────────────────────────────────────────────────

const ProgressContext = createContext<ProgressContextValue | null>(null);

// ── Provider ──────────────────────────────────────────────────────────────────

export function ProgressProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const locale = useLocale();
  const planProgress = usePlanProgress();
  const xp = useXp();
  const db = usePlanEnrollment(user?.id ?? null);

  // ── XP reconciliation ─────────────────────────────────────────────────────
  // Runs whenever the DB enrollments load or change.
  // Awards XP for every plan already marked `completed_at` in the DB that
  // doesn't yet have a matching entry in the local XP store.
  useEffect(() => {
    if (!user || db.loading) return;

    Object.values(db.enrollments).forEach((enrollment) => {
      if (!enrollment.completed_at) return;
      // addSkill is idempotent — won't double-award the same planId
      const plan = getLocalizedPlan(locale, enrollment.plan_id);
      if (!plan) return;
      xp.addSkill(enrollment.plan_id, plan.badge, plan.title, xpForPlan(plan.total_pages));
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, db.loading, db.enrollments, locale]);

  // ── Unified startPlan / markDayComplete ───────────────────────────────────

  const startPlan = useCallback(
    (planId: string) => {
      if (user) db.startPlan(planId);
      else planProgress.startPlan(planId);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, db.startPlan, planProgress.startPlan]
  );

  const markDayComplete = useCallback(
    (planId: string, day: number, totalDays: number) => {
      if (user) db.markDayComplete(planId, day, totalDays);
      else planProgress.markDayComplete(planId, day, totalDays);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, db.markDayComplete, planProgress.markDayComplete]
  );

  // ── getPlanEntry: unifies DB + localStorage ───────────────────────────────

  const getPlanEntry = useCallback(
    (planId: string): PlanEntry | null => {
      if (user) {
        const e = db.getEnrollment(planId);
        if (!e) return null;
        return {
          startedAt: new Date(e.started_at).getTime(),
          completedDays: e.completed_days,
          completedAt: e.completed_at ? new Date(e.completed_at).getTime() : undefined,
        };
      }
      return planProgress.getPlanEntry(planId);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, db.getEnrollment, planProgress.getPlanEntry]
  );

  // ── awardPlanXp ───────────────────────────────────────────────────────────

  const awardPlanXp = useCallback(
    (planId: string) => {
      const plan = getLocalizedPlan(locale, planId);
      if (!plan) return;
      xp.addSkill(planId, plan.badge, plan.title, xpForPlan(plan.total_pages));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [xp.addSkill, locale]
  );

  // ── getChapterPlanInfo ────────────────────────────────────────────────────

  const getChapterPlanInfo = useCallback(
    (chapterNumber: string | number | null): ChapterPlanInfo | null => {
      if (chapterNumber === null) return null;
      const chNum =
        typeof chapterNumber === "string" ? parseInt(chapterNumber, 10) : chapterNumber;
      if (isNaN(chNum)) return null;

      for (const plan of plansDatabase) {
        const ownsChapter = plan.chapters.some((c) => c.chapter_number === chNum);
        if (!ownsChapter) continue;

        const entry = getPlanEntry(plan.plan);
        if (!entry) continue;

        const totalDays = plan.daily_breakdown_standard.length;
        const progressPct =
          totalDays > 0
            ? Math.round((entry.completedDays.length / totalDays) * 100)
            : 0;

        const localizedPlan = getLocalizedPlan(locale, plan.plan) ?? plan;

        return {
          planId: plan.plan,
          planTitle: localizedPlan.title,
          progressPct,
          isCompleted: !!entry.completedAt,
          badge: localizedPlan.badge,
          insignia: getLocalizedInsignia(locale, plan.plan),
        };
      }
      return null;
    },
    [getPlanEntry, locale]
  );

  return (
    <ProgressContext.Provider
      value={{
        isLoggedIn: !!user,
        startPlan,
        markDayComplete,
        resetPlan: planProgress.resetPlan,
        getPlanEntry,
        getEnrollment: db.getEnrollment,
        savePlan: db.savePlan,
        enrollmentLoading: db.loading,
        totalXp: xp.totalXp,
        skills: xp.skills,
        levelInfo: xp.levelInfo,
        awardPlanXp,
        getChapterPlanInfo,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

// ── Consumer hook ─────────────────────────────────────────────────────────────

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used inside <ProgressProvider>");
  return ctx;
}


