"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "gc_plan_progress_v1";

export interface PlanEntry {
  startedAt: number;
  completedDays: number[];
  completedAt?: number;
}

export interface PlanProgressState {
  [planId: string]: PlanEntry;
}

function readFromStorage(): PlanProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as PlanProgressState;
  } catch {
    return {};
  }
}

function writeToStorage(state: PlanProgressState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage not available (SSR / private browsing)
  }
}

export function usePlanProgress() {
  const [progress, setProgress] = useState<PlanProgressState>({});

  useEffect(() => {
    setProgress(readFromStorage());
  }, []);

  const startPlan = useCallback((planId: string) => {
    setProgress((prev) => {
      if (prev[planId]) return prev;
      const next = { ...prev, [planId]: { startedAt: Date.now(), completedDays: [] } };
      writeToStorage(next);
      return next;
    });
  }, []);

  const markDayComplete = useCallback((planId: string, day: number, totalDays: number) => {
    setProgress((prev) => {
      const entry = prev[planId] ?? { startedAt: Date.now(), completedDays: [] };
      if (entry.completedDays.includes(day)) return prev;
      const completedDays = [...entry.completedDays, day];
      const completedAt =
        completedDays.length >= totalDays ? Date.now() : entry.completedAt;
      const next = {
        ...prev,
        [planId]: { ...entry, completedDays, ...(completedAt ? { completedAt } : {}) },
      };
      writeToStorage(next);
      return next;
    });
  }, []);

  const resetPlan = useCallback((planId: string) => {
    setProgress((prev) => {
      const next = { ...prev };
      delete next[planId];
      writeToStorage(next);
      return next;
    });
  }, []);

  const getPlanEntry = useCallback(
    (planId: string): PlanEntry | null => progress[planId] ?? null,
    [progress]
  );

  return { progress, startPlan, markDayComplete, resetPlan, getPlanEntry };
}
