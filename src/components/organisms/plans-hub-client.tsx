"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  BookOpen, CheckCircle2, Bookmark, Compass, ListChecks, Clock, PlayCircle
} from "lucide-react";
import { Plan, plansDatabase } from "@/database/plans";
import { useAuth } from "@/hooks/use-auth";
import { usePlanEnrollment } from "@/hooks/use-plan-enrollment";
import { AuthModal } from "@/components/atoms/auth-modal";
import { PLAN_GROUPS } from "@/components/molecules/plans/plan-groups";
import { languages } from "@/config/languages";
import { Footer } from "@/components/molecules/footer";
import { track } from "@vercel/analytics";

// ── helpers ──────────────────────────────────────────────────────────────────

const LOCALE_TO_COVER: Record<string, string> = Object.fromEntries(
  languages.map((l) => [l.routeLocale, `/book-covers/${l.name.toLowerCase()}.${l.bookCoverExtension}`])
);
const getBookCover = (locale: string) => LOCALE_TO_COVER[locale] ?? "/book-covers/english.avif";

type Tab = "my-plans" | "discover" | "saved" | "completed";

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "my-plans",  label: "My Plans",  icon: ListChecks },
  { id: "discover",  label: "Discover",  icon: Compass },
  { id: "saved",     label: "Saved",     icon: Bookmark },
  { id: "completed", label: "Completed", icon: CheckCircle2 },
];

// ── PlanRow card ──────────────────────────────────────────────────────────────

function PlanRow({
  plan, locale, completedDays, isCompleted, isSaved, isStarted, progressPct,
  onSave, onStart, requireAuth,
}: {
  plan: Plan; locale: string;
  completedDays: number; isCompleted: boolean; isSaved: boolean; isStarted: boolean;
  progressPct: number;
  onSave: () => void; onStart: () => void; requireAuth: () => void;
}) {
  const totalDays = plan.daily_breakdown_standard.length;
  const nextDay = completedDays < totalDays ? completedDays + 1 : null;

  return (
    <div className="flex gap-4 rounded-2xl border border-primary/10 bg-primary/5 p-4 transition hover:border-[#4fa6c2]/30">
      {/* Thumbnail */}
      <Link href={`/${locale}/guide/plan/${plan.plan}`} className="shrink-0">
        <div className="relative h-20 w-32 overflow-hidden rounded-xl sm:h-24 sm:w-40">
          <Image src={getBookCover(locale)} alt={plan.title} fill className="object-cover" sizes="160px" />
          {isCompleted && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <CheckCircle2 className="h-8 w-8 text-[#4fa6c2]" />
            </div>
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-1.5 min-w-0">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-[#4fa6c2]">
          Plan {plan.order}
        </span>
        <Link href={`/${locale}/guide/plan/${plan.plan}`}>
          <p className="font-semibold leading-snug text-primary hover:text-[#4fa6c2] transition-colors">
            {plan.title}
          </p>
        </Link>
        <p className="text-xs text-primary/40">{plan.card_subtitle}</p>

        {/* Progress */}
        {isStarted && !isCompleted && (
          <div className="flex flex-col gap-1 pt-1">
            <div className="flex justify-between text-[11px] text-primary/40">
              <span className="flex items-center gap-1">
                <PlayCircle className="h-3 w-3 text-[#4fa6c2]" />
                Day {completedDays}/{totalDays}
              </span>
              <span>{progressPct}%</span>
            </div>
            <div className="h-1 overflow-hidden rounded-full bg-primary/10">
              <div className="h-full bg-[#4fa6c2] transition-all" style={{ width: `${progressPct}%` }} />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-auto flex items-center gap-2 pt-2">
          {isStarted && nextDay ? (
            <Link
              href={`/${locale}/guide/plan/${plan.plan}`}
              className="flex items-center gap-1.5 rounded-full bg-[#4fa6c2] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#3d91ad]"
              onClick={() => track("plansHub_continue", { planId: plan.plan })}
            >
              <PlayCircle className="h-3 w-3" />
              Day {nextDay} →
            </Link>
          ) : !isStarted ? (
            <button
              onClick={() => { onStart(); track("plansHub_start", { planId: plan.plan }); }}
              className="flex items-center gap-1.5 rounded-full border border-[#4fa6c2]/50 px-3 py-1.5 text-xs font-semibold text-[#4fa6c2] transition hover:bg-[#4fa6c2]/10"
            >
              Start plan
            </button>
          ) : (
            <Link
              href={`/${locale}/guide/plan/${plan.plan}`}
              className="flex items-center gap-1.5 rounded-full border border-[#4fa6c2]/50 px-3 py-1.5 text-xs font-semibold text-[#4fa6c2] transition hover:bg-[#4fa6c2]/10"
            >
              Review
            </Link>
          )}

          <button
            onClick={() => { requireAuth(); onSave(); }}
            className={`flex h-7 w-7 items-center justify-center rounded-full border transition ${
              isSaved ? "border-[#4fa6c2]/50 bg-[#4fa6c2]/10 text-[#4fa6c2]" : "border-primary/20 text-primary/30 hover:text-[#4fa6c2]"
            }`}
            title={isSaved ? "Remove from saved" : "Save for later"}
          >
            <Bookmark className="h-3.5 w-3.5" fill={isSaved ? "currentColor" : "none"} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── PlansHubClient ────────────────────────────────────────────────────────────

interface Props { plans: Plan[]; locale: string; }

export function PlansHubClient({ plans, locale }: Props) {
  const { user } = useAuth();
  const { enrollments, loading, startPlan, savePlan, getEnrollment } = usePlanEnrollment(user?.id ?? null);
  const [activeTab, setActiveTab] = useState<Tab>("discover");
  const [showAuth, setShowAuth] = useState(false);

  function requireAuth(cb?: () => void) {
    if (!user) { setShowAuth(true); return false; }
    cb?.(); return true;
  }

  // Filtered plan lists
  const myPlans    = plans.filter((p) => !!getEnrollment(p.plan));
  const savedPlans = plans.filter((p) => getEnrollment(p.plan)?.is_saved);
  const completed  = plans.filter((p) => !!getEnrollment(p.plan)?.completed_at);

  const planListByTab: Record<Tab, Plan[]> = {
    "my-plans":  myPlans,
    "discover":  plans,
    "saved":     savedPlans,
    "completed": completed,
  };

  const visiblePlans = planListByTab[activeTab];

  return (
    <div className="min-h-screen bg-secondary">
      {/* ── Hero ── */}
      <div className="relative overflow-hidden bg-secondary pb-0 pt-14">
        <div className="mx-auto max-w-3xl px-4 py-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#4fa6c2]">
            The Great Controversy
          </p>
          <h1
            className="text-3xl font-bold text-white sm:text-4xl"
            style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}
          >
            Reading Plans
          </h1>
          <p className="mt-2 text-sm text-primary/50">
            {user
              ? `${myPlans.length} plan${myPlans.length !== 1 ? "s" : ""} in progress · ${completed.length} completed`
              : "Sign in to track your progress across devices."}
          </p>

          {!user && (
            <button
              onClick={() => setShowAuth(true)}
              className="mt-4 rounded-full bg-[#4fa6c2] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#3d91ad]"
            >
              Sign in to start →
            </button>
          )}
        </div>

        {/* Stats strip */}
        {user && !loading && (
          <div className="mx-auto flex max-w-3xl gap-6 px-4 pb-6">
            {[
              { icon: PlayCircle,   label: "In Progress", value: myPlans.filter((p) => !getEnrollment(p.plan)?.completed_at).length },
              { icon: CheckCircle2, label: "Completed",   value: completed.length },
              { icon: Bookmark,     label: "Saved",       value: savedPlans.length },
              { icon: BookOpen,     label: "Total Plans", value: plans.length },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex flex-col gap-0.5">
                <span className="text-xl font-bold text-white">{value}</span>
                <span className="flex items-center gap-1 text-[11px] text-primary/40">
                  <Icon className="h-3 w-3" /> {label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Tabs ── */}
      <div className="sticky top-0 z-10 border-b border-primary/10 bg-secondary/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl gap-1 overflow-x-auto px-4 py-2 scrollbar-none">
          {TABS.map(({ id, label, icon: Icon }) => {
            const count = planListByTab[id].length;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                  activeTab === id
                    ? "bg-[#4fa6c2] text-white"
                    : "bg-primary/5 text-primary/50 hover:bg-primary/10 hover:text-primary"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
                {count > 0 && (
                  <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${activeTab === id ? "bg-white/20" : "bg-primary/10"}`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="mx-auto max-w-3xl px-4 py-6">

        {/* Discover: grouped by PLAN_GROUPS */}
        {activeTab === "discover" && (
          <div className="flex flex-col gap-10">
            {PLAN_GROUPS.map((group) => {
              const groupPlans = group.planIds
                .map((id) => plans.find((p) => p.plan === id))
                .filter((p): p is Plan => p !== undefined);
              return (
                <div key={group.id} className="flex flex-col gap-3">
                  <div>
                    <h2 className="text-sm font-bold text-primary">{group.label}</h2>
                    <p className="text-xs text-primary/40">{group.subtitle}</p>
                  </div>
                  <div className="flex flex-col gap-3">
                    {groupPlans.map((plan) => {
                      const e = getEnrollment(plan.plan);
                      const totalDays = plan.daily_breakdown_standard.length;
                      const completedDays = e?.completed_days.length ?? 0;
                      const progressPct = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;
                      return (
                        <PlanRow
                          key={plan.plan}
                          plan={plan}
                          locale={locale}
                          completedDays={completedDays}
                          isCompleted={!!e?.completed_at}
                          isSaved={e?.is_saved ?? false}
                          isStarted={!!e}
                          progressPct={progressPct}
                          onSave={() => requireAuth(() => savePlan(plan.plan, !(e?.is_saved ?? false)))}
                          onStart={() => requireAuth(() => startPlan(plan.plan))}
                          requireAuth={() => requireAuth()}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Other tabs: flat list */}
        {activeTab !== "discover" && (
          <div className="flex flex-col gap-3">
            {visiblePlans.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-16 text-center">
                {activeTab === "my-plans" && <PlayCircle className="h-10 w-10 text-primary/20" />}
                {activeTab === "saved" && <Bookmark className="h-10 w-10 text-primary/20" />}
                {activeTab === "completed" && <CheckCircle2 className="h-10 w-10 text-primary/20" />}
                <p className="text-sm text-primary/40">
                  {activeTab === "my-plans" && (user ? "Start your first plan below." : "Sign in to track your plans.")}
                  {activeTab === "saved" && "Bookmark plans to find them here."}
                  {activeTab === "completed" && "Completed plans will appear here."}
                </p>
                {activeTab === "my-plans" && (
                  <button
                    onClick={() => setActiveTab("discover")}
                    className="mt-2 rounded-full bg-[#4fa6c2] px-5 py-2 text-xs font-semibold text-white hover:bg-[#3d91ad]"
                  >
                    Browse plans
                  </button>
                )}
              </div>
            ) : (
              visiblePlans.map((plan) => {
                const e = getEnrollment(plan.plan);
                const totalDays = plan.daily_breakdown_standard.length;
                const completedDays = e?.completed_days.length ?? 0;
                const progressPct = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;
                return (
                  <PlanRow
                    key={plan.plan}
                    plan={plan}
                    locale={locale}
                    completedDays={completedDays}
                    isCompleted={!!e?.completed_at}
                    isSaved={e?.is_saved ?? false}
                    isStarted={!!e}
                    progressPct={progressPct}
                    onSave={() => requireAuth(() => savePlan(plan.plan, !(e?.is_saved ?? false)))}
                    onStart={() => requireAuth(() => startPlan(plan.plan))}
                    requireAuth={() => requireAuth()}
                  />
                );
              })
            )}
          </div>
        )}
      </div>

      <Footer />

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </div>
  );
}
