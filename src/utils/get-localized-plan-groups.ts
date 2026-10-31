import { PLAN_GROUPS, type PlanGroup } from "@/components/molecules/plans/plan-groups";
import groupsI18n from "@/database/plan-groups-i18n.json";

type GroupsI18nData = typeof groupsI18n;
type LocaleKey = keyof GroupsI18nData;
type GroupI18nEntry = GroupsI18nData["en"][keyof GroupsI18nData["en"]];

/** Returns the plan groups with label/subtitle resolved for the given locale. */
export function getLocalizedPlanGroups(locale: string): PlanGroup[] {
  const key = (locale in groupsI18n ? locale : "en") as LocaleKey;
  const localeMap = groupsI18n[key] as Record<string, GroupI18nEntry>;
  const fallbackMap = groupsI18n.en as Record<string, GroupI18nEntry>;
  return PLAN_GROUPS.map((g) => {
    const t = localeMap[g.id] ?? fallbackMap[g.id];
    return { ...g, label: t.label, subtitle: t.subtitle };
  });
}
