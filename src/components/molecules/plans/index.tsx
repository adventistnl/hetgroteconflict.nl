"use client";

import { ChevronRight } from "lucide-react";
import { Plan } from "@/database/plans";
import { PLAN_GROUPS } from "./plan-groups";
import { PlanGroupRow } from "./plan-group-row";

interface Props {
  plans: Plan[];
  locale: string;
}

export function PlansSection({ plans, locale }: Props) {
  return (
    <section className="flex flex-col gap-8">
      {/* Section heading */}
      <div className="flex items-center gap-1.5">
        <h2
          className="text-base font-bold text-primary sm:text-lg"
          style={{ fontFamily: "var(--font-rubik)" }}
        >
          Reading Plans
        </h2>
        <ChevronRight className="h-4 w-4 text-primary/30" />
      </div>

      {/* One carousel row per group */}
      <div className="flex flex-col gap-10">
        {PLAN_GROUPS.map((group) => {
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
    </section>
  );
}
