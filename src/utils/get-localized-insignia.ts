import { INSIGNIA, INSIGNIA_BY_PLAN, type Insignia } from "@/database/insignia";
import insigniaI18n from "@/database/insignia-i18n.json";

type InsigniaI18nData = typeof insigniaI18n;
type LocaleKey = keyof InsigniaI18nData;
type InsigniaI18nEntry = InsigniaI18nData["en"][keyof InsigniaI18nData["en"]];

function applyLocale(locale: string, base: Insignia): Insignia {
  const key = (locale in insigniaI18n ? locale : "en") as LocaleKey;
  const localeMap = insigniaI18n[key] as Record<string, InsigniaI18nEntry>;
  const fallbackMap = insigniaI18n.en as Record<string, InsigniaI18nEntry>;
  const t = localeMap[base.planId] ?? fallbackMap[base.planId];
  return { ...base, badge: t.badge, rewardTitle: t.rewardTitle, rewardDescription: t.rewardDescription };
}

/** Returns a single plan's insignia with badge/reward text resolved for the given locale. */
export function getLocalizedInsignia(locale: string, planId: string): Insignia | null {
  const base = INSIGNIA_BY_PLAN[planId];
  if (!base) return null;
  return applyLocale(locale, base);
}

/** Returns every insignia, keyed by planId, with text resolved for the given locale. */
export function getLocalizedInsigniaByPlan(locale: string): Record<string, Insignia> {
  return Object.fromEntries(INSIGNIA.map((i) => [i.planId, applyLocale(locale, i)]));
}
