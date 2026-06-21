import { unstable_setRequestLocale } from "next-intl/server";
import PlanDetailClient from "@/components/organisms/plan-detail-client";
import { plansDatabase } from "@/database/plans";
import { routing } from "@/i18n/routing";

type Props = {
  params: { locale: string; planId: string };
};

export function generateStaticParams() {
  const locales = routing.locales;
  return plansDatabase.flatMap((plan) =>
    locales.map((locale) => ({ locale, planId: plan.plan }))
  );
}

export default function PlanPage({ params: { locale, planId } }: Props) {
  unstable_setRequestLocale(locale);
  return <PlanDetailClient planId={planId} locale={locale} />;
}
