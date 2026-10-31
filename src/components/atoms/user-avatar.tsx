"use client";

import { useState } from "react";
import { User, LogOut, Star, Trophy } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useProgress } from "@/contexts/progress-context";
import { TIER_CONFIG } from "@/database/insignia";
import { getLocalizedInsignia } from "@/utils/get-localized-insignia";

export function UserAvatar({ compact = false }: { compact?: boolean }) {
  const { user, loading, signOut } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const locale = useLocale();
  const router = useRouter();
  const { totalXp, skills, levelInfo } = useProgress();
  const t = useTranslations("xp");
  const tAuth = useTranslations("auth");

  if (loading) {
    return (
      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/10 bg-primary/5">
        <div className="h-3 w-3 animate-pulse rounded-full bg-primary/20" />
      </div>
    );
  }

  if (!user) {
    if (compact) {
      return (
        <button
          onClick={() => router.push(`/${locale}/auth`)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/20 bg-primary/5 text-primary/60 transition hover:border-[#4fa6c2]/50 hover:text-[#4fa6c2]"
          aria-label="Sign in"
        >
          <User className="h-4 w-4" />
        </button>
      );
    }

    return (
      <button
        onClick={() => router.push(`/${locale}/auth?mode=sign-up`)}
        className="inline-flex items-center gap-2 rounded-full bg-[#4fa6c2] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#3d91ad] active:scale-[0.97]"
      >
        <User className="h-3.5 w-3.5" />
        {tAuth("btn-create-account")}
      </button>
    );
  }

  const fullName = user.user_metadata?.full_name as string | undefined;
  const initials = fullName
    ?.split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) ?? user.email?.[0].toUpperCase() ?? "U";

  const avatarUrl = user.user_metadata?.avatar_url as string | undefined;

  return (
    <div className="relative">
      {/* Avatar button with level badge */}
      <button
        onClick={() => setShowMenu((v) => !v)}
        className="relative flex h-9 w-9 items-center justify-center overflow-visible rounded-full border-2 border-[#4fa6c2]/60 bg-[#4fa6c2]/20 text-xs font-bold text-[#4fa6c2] transition hover:border-[#4fa6c2]"
        aria-label="User menu"
      >
        <span className="flex h-full w-full items-center justify-center overflow-hidden rounded-full">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarUrl} alt="avatar" className="h-full w-full object-cover" />
          ) : (
            initials
          )}
        </span>
        {/* Level badge */}
        <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#4fa6c2] text-[9px] font-black text-white ring-2 ring-secondary">
          {levelInfo.level}
        </span>
      </button>

      {showMenu && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setShowMenu(false)} />
          <div className="absolute right-0 top-11 z-40 w-72 rounded-2xl border border-primary/10 bg-secondary shadow-xl">

            {/* User info */}
            <div className="flex items-center gap-3 overflow-hidden rounded-t-2xl border-b border-primary/10 px-4 py-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-[#4fa6c2]/60 bg-[#4fa6c2]/20 text-xs font-bold text-[#4fa6c2]">
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarUrl} alt="avatar" className="h-full w-full object-cover" />
                ) : (
                  initials
                )}
              </div>
              <div className="min-w-0">
                {fullName && <p className="truncate text-sm font-semibold text-primary">{fullName}</p>}
                <p className="truncate text-xs text-primary/40">{user.email}</p>
              </div>
            </div>

            {/* XP & Level */}
            <div className="border-b border-primary/10 px-4 py-3">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Star className="h-3.5 w-3.5 text-[#4fa6c2]" fill="currentColor" />
                  <span className="text-xs font-bold text-primary">
                    {t("level-label", { level: levelInfo.level, label: t(`level-${levelInfo.level}` as `level-${1|2|3|4|5|6|7}`) })}
                  </span>
                </div>
                <span className="text-xs font-bold text-[#4fa6c2]">{t("xp-count", { xp: totalXp })}</span>
              </div>
              {/* Progress bar */}
              <div className="h-1.5 overflow-hidden rounded-full bg-primary/10">
                <div
                  className="h-full rounded-full bg-[#4fa6c2] transition-all duration-700"
                  style={{ width: `${levelInfo.progressPct}%` }}
                />
              </div>
              {levelInfo.xpForNext !== null ? (
                <p className="mt-1.5 text-[10px] text-primary/35">
                  {t("xp-to-next", { current: levelInfo.xpInLevel, total: levelInfo.xpForNext, next: levelInfo.level + 1 })}
                </p>
              ) : (
                <p className="mt-1.5 text-[10px] font-semibold text-[#4fa6c2]">{t("max-level")}</p>
              )}
            </div>

            {/* Skills */}
            <div className="border-b border-primary/10 px-4 py-3">
              <div className="mb-2.5 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Trophy className="h-3 w-3 text-primary/40" />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-primary/40">
                    {t("skills-title", { count: skills.length })}
                  </p>
                </div>
                {skills.length > 0 && (
                  <span className="text-[10px] font-bold text-[#4fa6c2]">
                    +{skills.reduce((s, k) => s + k.xp, 0)} XP
                  </span>
                )}
              </div>
              {skills.length === 0 ? (
                <p className="text-[11px] italic text-primary/30">{t("no-skills")}</p>
              ) : (() => {
                  const MAX_VISIBLE = 6;
                  const sorted = [...skills].reverse();
                  const visible = sorted.slice(0, MAX_VISIBLE);
                  const overflow = sorted.length - MAX_VISIBLE;
                  return (
                    <div className="flex -space-x-2.5">
                      {visible.map((skill) => {
                        const ins = getLocalizedInsignia(locale, skill.planId);
                        const tier = ins ? TIER_CONFIG[ins.tier] : null;
                        return (
                          <div
                            key={skill.planId}
                            className="group/badge relative flex shrink-0"
                          >
                            {/* Icon circle */}
                            <div
                              className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#4fa6c2]/60 bg-secondary text-base ring-2 ring-secondary transition-transform group-hover/badge:z-10 group-hover/badge:scale-110"
                            >
                              {ins?.icon ?? "🏅"}
                            </div>

                            {/* Tooltip */}
                            <div className="pointer-events-none absolute bottom-full left-0 z-[60] mb-2 scale-95 opacity-0 transition-all duration-150 group-hover/badge:scale-100 group-hover/badge:opacity-100">
                              <div className="min-w-[130px] rounded-xl border border-primary/10 bg-secondary px-3 py-2 shadow-lg">
                                <p className="text-left text-[11px] font-semibold leading-tight text-primary">
                                  {ins?.badge ?? skill.badge}
                                </p>
                                {tier && ins && (
                                  <p className={`mt-0.5 text-left text-[9px] font-bold uppercase tracking-widest ${tier.color}`}>
                                    {t(`tier-${ins.tier}` as "tier-bronze" | "tier-silver" | "tier-gold")}
                                  </p>
                                )}
                                <p className="mt-1 text-left text-[10px] font-bold text-[#4fa6c2]">
                                  +{skill.xp} XP
                                </p>
                              </div>
                              {/* Arrow */}
                              <div className="absolute left-4 top-full border-4 border-transparent border-t-secondary" />
                            </div>
                          </div>
                        );
                      })}
                      {overflow > 0 && (
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-primary/20 bg-primary/10 text-[10px] font-bold text-primary/60 ring-2 ring-secondary">
                          +{overflow}
                        </div>
                      )}
                    </div>
                  );
                })()
              }
            </div>

            {/* Sign out */}
            <button
              onClick={async () => { await signOut(); setShowMenu(false); }}
              className="flex w-full items-center gap-2 rounded-b-2xl px-4 py-3 text-sm text-primary transition hover:bg-primary/10"
            >
              <LogOut className="h-3.5 w-3.5" />
              {t("sign-out")}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
