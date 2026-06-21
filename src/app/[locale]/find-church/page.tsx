import { unstable_setRequestLocale } from "next-intl/server";
import { ChurchMarqueeCTA } from "@/app/find-church/ChurchMarqueeCTA";
import { MapSection } from "@/app/find-church/MapSection";

type Props = { params: { locale: string } };

export default async function FindChurchPage({ params: { locale } }: Props) {
  unstable_setRequestLocale(locale);
  return (
    <>
      <ChurchMarqueeCTA />
      <MapSection />
    </>
  );
}
