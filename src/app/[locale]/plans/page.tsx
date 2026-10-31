import { unstable_setRequestLocale } from "next-intl/server";
import { PlansHubClient } from "@/components/organisms/plans-hub-client";
import { getLocalizedPlans } from "@/utils/get-localized-plans";

type Props = { params: { locale: string } };

export default function PlansPage({ params: { locale } }: Props) {
  unstable_setRequestLocale(locale);
  return <PlansHubClient plans={getLocalizedPlans(locale)} locale={locale} />;
}
