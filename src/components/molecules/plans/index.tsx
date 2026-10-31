"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { Plan } from "@/database/plans";
import { useProgress } from "@/contexts/progress-context";
import { useTranslations } from "next-intl";
import { getLocalizedPlanGroups } from "@/utils/get-localized-plan-groups";
import { PlanGroupRow } from "./plan-group-row";
import { PlanCard } from "./plan-card";

type Tab = "all" | "in-progress" | "completed";

interface Props {
  plans: Plan[];
  locale: string;
}

export function PlansSection({ plans, locale }: Props) {
  const [tab, setTab] = useState<Tab>("all");
  const { getPlanEntry } = useProgress();
  const t = useTranslations("reading-plan");

  const TABS: { id: Tab; label: string }[] = [
    { id: "all",         label: t("tab-all")         },
    { id: "in-progress", label: t("tab-in-progress") },
    { id: "completed",   label: t("tab-completed")   },
  ];

  const inProgress = plans.filter((p) => {
    const e = getPlanEntry(p.plan);
    return !!e && !e.completedAt;
  });

  const completed = plans.filter((p) => {
    const e = getPlanEntry(p.plan);
    return !!e?.completedAt;
  });

  return (
    <section className="flex flex-col gap-6">
      {/* Header + tabs */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-1.5">
          <h2
            className="text-base font-bold text-primary sm:text-lg"
            style={{ fontFamily: "var(--font-rubik)" }}
          >
            {t("plans-title")}
          </h2>
          <ChevronRight className="h-4 w-4 text-primary/30" />
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 rounded-full border border-primary/10 bg-primary/5 p-1">
          {TABS.map((t) => {
            const count =
              t.id === "in-progress" ? inProgress.length :
              t.id === "completed"   ? completed.length  : null;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
                  tab === t.id
                    ? "bg-[#4fa6c2] text-white shadow-sm"
                    : "text-primary/50 hover:text-primary"
                }`}
              >
                {t.label}
                {count !== null && count > 0 && (
                  <span
                    className={`flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-black ${
                      tab === t.id ? "bg-white/20 text-white" : "bg-primary/10 text-primary/60"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* All Plans — grouped carousels */}
      {tab === "all" && (
        <div className="flex flex-col gap-10">
          {getLocalizedPlanGroups(locale).map((group) => {
            const groupPlans = group.planIds
              .map((id) => plans.find((p) => p.plan === id))
              .filter((p): p is Plan => p !== undefined);
            return (
              <PlanGroupRow
                key={group.id}
                group={group}
                plans={groupPlans}
                locale={locale}
              />
            );
          })}
        </div>
      )}

      {/* In Progress — flat grid */}
      {tab === "in-progress" && (
        inProgress.length === 0 ? (
          <p className="py-6 text-center text-sm italic text-primary/30">
            {t("empty-in-progress")}
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {inProgress.map((plan) => (
              <PlanCard key={plan.plan} plan={plan} locale={locale} />
            ))}
          </div>
        )
      )}

      {/* Completed — flat grid */}
      {tab === "completed" && (
        completed.length === 0 ? (
          <p className="py-6 text-center text-sm italic text-primary/30">
            {t("empty-completed")}
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {completed.map((plan) => (
              <PlanCard key={plan.plan} plan={plan} locale={locale} />
            ))}
          </div>
        )
      )}
    </section>
  );
}
