"use client";

import { useCallback, useEffect, useState } from "react";

const XP_STORAGE_KEY = "gc_xp_v1";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface XpSkill {
  planId: string;
  badge: string;      // e.g. "🔑 Seeker of Truth"
  planTitle: string;  // e.g. "Why This Battle Matters to You"
  xp: number;
  earnedAt: number;   // Unix timestamp
}

export interface XpState {
  totalXp: number;
  skills: XpSkill[];
}

// ── Level definitions ─────────────────────────────────────────────────────────
// Calibrated so completing all plans (~2500 XP total) reaches Level 7.

export const XP_LEVELS = [
  { level: 1, label: "Reader",     minXp: 0    },
  { level: 2, label: "Scholar",    minXp: 100  },
  { level: 3, label: "Seeker",     minXp: 250  },
  { level: 4, label: "Historian",  minXp: 500  },
  { level: 5, label: "Theologian", minXp: 900  },
  { level: 6, label: "Prophet",    minXp: 1500 },
  { level: 7, label: "Overcomer",  minXp: 2500 },
] as const;

export function getLevelInfo(xp: number) {
  const current =
    [...XP_LEVELS].reverse().find((l) => xp >= l.minXp) ?? XP_LEVELS[0];
  const nextIdx = XP_LEVELS.findIndex((l) => l.level === current.level) + 1;
  const next = XP_LEVELS[nextIdx] as (typeof XP_LEVELS)[number] | undefined;
  return {
    level: current.level,
    label: current.label,
    xpInLevel: xp - current.minXp,
    xpForNext: next ? next.minXp - current.minXp : null,
    progressPct: next
      ? Math.min(100, Math.round(((xp - current.minXp) / (next.minXp - current.minXp)) * 100))
      : 100,
  };
}

/** XP awarded on plan completion: 5 XP per page, minimum 50. */
export function xpForPlan(totalPages: number): number {
  return Math.max(50, totalPages * 5);
}

// ── Storage ───────────────────────────────────────────────────────────────────

function readXp(): XpState {
  try {
    const raw = localStorage.getItem(XP_STORAGE_KEY);
    if (!raw) return { totalXp: 0, skills: [] };
    return JSON.parse(raw) as XpState;
  } catch {
    return { totalXp: 0, skills: [] };
  }
}

function writeXp(state: XpState) {
  try { localStorage.setItem(XP_STORAGE_KEY, JSON.stringify(state)); } catch { /* noop */ }
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useXp() {
  const [xpState, setXpState] = useState<XpState>({ totalXp: 0, skills: [] });

  useEffect(() => {
    setXpState(readXp());
  }, []);

  const addSkill = useCallback(
    (planId: string, badge: string, planTitle: string, xp: number) => {
      setXpState((prev) => {
        // Idempotent: never award the same plan twice
        if (prev.skills.some((s) => s.planId === planId)) return prev;
        const next: XpState = {
          totalXp: prev.totalXp + xp,
          skills: [
            ...prev.skills,
            { planId, badge, planTitle, xp, earnedAt: Date.now() },
          ],
        };
        writeXp(next);
        return next;
      });
    },
    []
  );

  return {
    totalXp: xpState.totalXp,
    skills: xpState.skills,
    levelInfo: getLevelInfo(xpState.totalXp),
    addSkill,
  };
}
