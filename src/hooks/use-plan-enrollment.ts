"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

export interface PlanEnrollment {
  plan_id: string;
  started_at: string;
  completed_at: string | null;
  is_saved: boolean;
  completed_days: number[];
}

export function usePlanEnrollment(userId: string | null) {
  const supabase = createClient();
  const [enrollments, setEnrollments] = useState<Record<string, PlanEnrollment>>({});
  const [loading, setLoading] = useState(true);

  const fetchEnrollments = useCallback(async () => {
    if (!userId) { setLoading(false); return; }

    const [{ data: plans }, { data: days }] = await Promise.all([
      supabase.from("plan_enrollments").select("*").eq("user_id", userId),
      supabase.from("plan_day_completions").select("plan_id, day_number").eq("user_id", userId),
    ]);

    const dayMap: Record<string, number[]> = {};
    (days ?? []).forEach(({ plan_id, day_number }) => {
      dayMap[plan_id] = [...(dayMap[plan_id] ?? []), day_number];
    });

    const map: Record<string, PlanEnrollment> = {};
    (plans ?? []).forEach((p) => {
      map[p.plan_id] = { ...p, completed_days: dayMap[p.plan_id] ?? [] };
    });

    setEnrollments(map);
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => { fetchEnrollments(); }, [fetchEnrollments]);

  const startPlan = useCallback(
    async (planId: string) => {
      if (!userId || enrollments[planId]) return;
      await supabase.from("plan_enrollments").insert({
        user_id: userId,
        plan_id: planId,
      });
      await fetchEnrollments();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [userId, enrollments, fetchEnrollments]
  );

  const savePlan = useCallback(
    async (planId: string, saved: boolean) => {
      if (!userId) return;
      await supabase
        .from("plan_enrollments")
        .upsert({ user_id: userId, plan_id: planId, is_saved: saved }, { onConflict: "user_id,plan_id" });
      await fetchEnrollments();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [userId, fetchEnrollments]
  );

  const markDayComplete = useCallback(
    async (planId: string, day: number, totalDays: number) => {
      if (!userId) return;

      // Ensure enrolled first
      if (!enrollments[planId]) await startPlan(planId);

      await supabase.from("plan_day_completions").upsert(
        { user_id: userId, plan_id: planId, day_number: day },
        { onConflict: "user_id,plan_id,day_number" }
      );

      // Check if all days done → mark plan completed
      const current = enrollments[planId]?.completed_days ?? [];
      const allDone = new Set([...current, day]).size >= totalDays;
      if (allDone) {
        await supabase
          .from("plan_enrollments")
          .update({ completed_at: new Date().toISOString() })
          .eq("user_id", userId)
          .eq("plan_id", planId);
      }

      await fetchEnrollments();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [userId, enrollments, startPlan, fetchEnrollments]
  );

  const getEnrollment = useCallback(
    (planId: string): PlanEnrollment | null => enrollments[planId] ?? null,
    [enrollments]
  );

  return {
    enrollments,
    loading,
    startPlan,
    savePlan,
    markDayComplete,
    getEnrollment,
    refresh: fetchEnrollments,
  };
}
