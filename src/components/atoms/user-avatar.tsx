"use client";

import { useState } from "react";
import { User, LogOut, Star, Trophy } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useXp } from "@/hooks/use-xp";

export function UserAvatar() {
  const { user, loading, signOut } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const locale = useLocale();
  const router = useRouter();
  const { totalXp, skills, levelInfo } = useXp();

  if (loading) {
    return (
      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/10 bg-primary/5">
        <div className="h-3 w-3 animate-pulse rounded-full bg-primary/20" />
      </div>
    );
  }

  if (!user) {
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
          <div className="absolute right-0 top-11 z-40 w-72 overflow-hidden rounded-2xl border border-primary/10 bg-secondary shadow-xl">

            {/* User info */}
            <div className="flex items-center gap-3 border-b border-primary/10 px-4 py-3">
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
                    Level {levelInfo.level} · {levelInfo.label}
                  </span>
                </div>
                <span className="text-xs font-bold text-[#4fa6c2]">{totalXp} XP</span>
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
                  {levelInfo.xpInLevel} / {levelInfo.xpForNext} XP → Level {levelInfo.level + 1}
                </p>
              ) : (
                <p className="mt-1.5 text-[10px] font-semibold text-[#4fa6c2]">Max level reached 🏆</p>
              )}
            </div>

            {/* Skills */}
            <div className="border-b border-primary/10 px-4 py-3">
              <div className="mb-2 flex items-center gap-1.5">
                <Trophy className="h-3 w-3 text-primary/40" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary/40">
                  Skills Earned ({skills.length})
                </p>
              </div>
              {skills.length === 0 ? (
                <p className="text-[11px] italic text-primary/30">
                  Complete a plan to earn your first skill!
                </p>
              ) : (
                <div className="flex max-h-[140px] flex-col gap-1 overflow-y-auto">
                  {[...skills].reverse().map((skill) => (
                    <div
                      key={skill.planId}
                      className="flex items-center justify-between gap-2 rounded-lg bg-primary/5 px-2.5 py-1.5"
                    >
                      <span className="text-xs text-primary">{skill.badge}</span>
                      <span className="shrink-0 text-[10px] font-bold text-[#4fa6c2]">+{skill.xp} XP</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sign out */}
            <button
              onClick={async () => { await signOut(); setShowMenu(false); }}
              className="flex w-full items-center gap-2 px-4 py-3 text-sm text-primary transition hover:bg-primary/10"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </button>
          </div>
        </>
      )}
    </div>
  );
}
