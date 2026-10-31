"use client";

import { useLocale } from "next-intl";
import { useChapterProgress } from "@/hooks/use-chapter-progress";
import { PlansSection } from "../molecules/plans";
import { Footer } from "../molecules/footer";
import { PageHero } from "../molecules/page-hero";
import { getLocalizedPlans } from "@/utils/get-localized-plans";

interface ChapterData {
  chapterNumber: string;
  title: string;
  description: string;
  videoUrl: string;
  videoCover: string;
}

interface Props {
  chapters: ChapterData[];
}

function getBgVideoUrl(videoUrl: string): string {
  if (!videoUrl) return "";
  const ytMatch = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s?]+)/);
  if (ytMatch) {
    const id = ytMatch[1];
    return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1`;
  }
  const vimeoMatch = videoUrl.match(/(?:vimeo\.com\/)(\d+)/);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1&muted=1&loop=1&background=1`;
  }
  return "";
}

export const StudyGuidePageContainer = ({ chapters }: Props) => {
  const locale = useLocale();
  const { progress } = useChapterProgress();

  const lastChapterData = chapters.find(
    (c) => c.chapterNumber === progress.lastChapter
  );

  const heroChapter = lastChapterData ?? chapters[0];
  const hasProgress = !!lastChapterData;
  const bgVideoUrl = heroChapter ? getBgVideoUrl(heroChapter.videoUrl) : "";

  return (
    <div className="flex min-h-screen w-full flex-col bg-secondary">
      <PageHero
        variant="study-guide"
        chapter={heroChapter}
        locale={locale}
        hasProgress={hasProgress}
        bgVideoUrl={bgVideoUrl}
      />

      {/* ── Reading Plans ── */}
      <section className="mx-auto w-full max-w-6xl px-4 py-12">
        <PlansSection plans={getLocalizedPlans(locale)} locale={locale} />
      </section>

      <Footer />
    </div>
  );
};
