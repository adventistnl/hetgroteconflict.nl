"use client";

import { ChevronRight } from "lucide-react";
import { Plan } from "@/database/plans";
import { PlanCard } from "./plan-card";
import { PlanGroup } from "./plan-groups";

interface Props {
  group: PlanGroup;
  plans: Plan[];
  locale: string;
}

export function PlanGroupRow({ group, plans, locale }: Props) {
  if (plans.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      {/* Row heading */}
      <div className="flex items-center gap-1.5">
        <h3
          className="text-sm font-bold text-primary sm:text-base"
          style={{ fontFamily: "var(--font-rubik)" }}
        >
          {group.label}
        </h3>
        <ChevronRight className="h-3.5 w-3.5 shrink-0 text-primary/30" />
        <span
          className="hidden text-xs text-primary/40 sm:block"
          style={{ fontFamily: "var(--font-rubik)" }}
        >
          {group.subtitle}
        </span>
      </div>

      {/* Horizontal carousel
          Mobile:  one card fills the screen (same as chapter snap-carousel)
          Desktop: fixed-width cards, peek at next item to hint scrollability */}
      <div className="-mx-4 overflow-x-auto px-4 sm:-mx-0 sm:px-0">
        <div className="flex gap-4 pb-2">
          {plans.map((plan) => (
            <div
              key={plan.plan}
              className="w-[calc(100vw-2.5rem)] shrink-0 sm:w-[calc(50%-8px)] lg:w-[calc(33.333%-11px)]"
            >
              <PlanCard plan={plan} locale={locale} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
