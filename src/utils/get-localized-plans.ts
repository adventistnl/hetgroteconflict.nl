import { plansDatabase, Plan } from "@/database/plans";
import plansI18n from "@/database/plans-i18n.json";
import chaptersI18n from "@/database/chapters-i18n.json";

type PlansI18nData = typeof plansI18n;
type PlanLocaleKey = keyof PlansI18nData;
interface PlanI18nEntry {
  title: string;
  description: string;
  badge: string;
  completion_message: string;
  card_subtitle: string;
  nullChapterTitles?: string[];
}

type ChaptersI18nData = typeof chaptersI18n;
type ChapterLocaleKey = keyof ChaptersI18nData;

/**
 * Resolves every chapter title for a plan in the given locale: numbered
 * chapters pull from chapters-i18n.json (shared with the study guide),
 * front/back-matter chapters (chapter_number === null) pull from the
 * plan's own nullChapterTitles, in the order they appear in the plan.
 */
function resolveChapterTitles(locale: string, plan: Plan, planI18n: PlanI18nEntry): string[] {
  const chKey = (locale in chaptersI18n ? locale : "en") as ChapterLocaleKey;
  const chLocaleData = chaptersI18n[chKey];
  const chFallback = chaptersI18n.en;
  const nullTitles = planI18n.nullChapterTitles ?? [];

  let nullIdx = 0;
  return plan.chapters.map((c) => {
    if (c.chapter_number !== null) {
      const idx = c.chapter_number - 1;
      return chLocaleData.titles[idx] ?? chFallback.titles[idx] ?? c.title;
    }
    const title = nullTitles[nullIdx] ?? c.title;
    nullIdx += 1;
    return title;
  });
}

function applyLocale(locale: string, base: Plan): Plan {
  const planKey = (locale in plansI18n ? locale : "en") as PlanLocaleKey;
  const localeMap = plansI18n[planKey] as Record<string, PlanI18nEntry>;
  const fallbackMap = plansI18n.en as Record<string, PlanI18nEntry>;
  const t = localeMap[base.plan] ?? fallbackMap[base.plan];

  const chapterTitles = resolveChapterTitles(locale, base, t);

  return {
    ...base,
    title: t.title,
    description: t.description,
    badge: t.badge,
    completion_message: t.completion_message,
    card_subtitle: t.card_subtitle,
    chapters: base.chapters.map((c, i) => ({ ...c, title: chapterTitles[i] })),
    daily_breakdown_standard: base.daily_breakdown_standard.map((d, i) => ({ ...d, title: chapterTitles[i] })),
  };
}

/** Returns a single plan with all display text resolved for the given locale. */
export function getLocalizedPlan(locale: string, planId: string): Plan | undefined {
  const base = plansDatabase.find((p) => p.plan === planId);
  if (!base) return undefined;
  return applyLocale(locale, base);
}

/** Returns the full plan list with all display text resolved for the given locale. */
export function getLocalizedPlans(locale: string): Plan[] {
  return plansDatabase.map((p) => applyLocale(locale, p));
}
