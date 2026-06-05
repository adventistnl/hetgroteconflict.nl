import { unstable_setRequestLocale } from "next-intl/server";
import { StudyGuidePageContainer } from "@/components/organisms/study-guide-page-container";
import { getLocalizedChapters } from "@/utils/get-chapters";

type Props = {
  params: { locale: string };
};

export default async function StudyGuidePage({ params: { locale } }: Props) {
  unstable_setRequestLocale(locale);
  const chapters = getLocalizedChapters(locale);
  return <StudyGuidePageContainer chapters={chapters} />;
}
