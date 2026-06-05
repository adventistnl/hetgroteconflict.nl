"use client";

import Carousel from "./caroussel";
import { StudyGuideChapterCard } from "./study-guide-chapter-card";
import { useChapterProgress } from "@/hooks/use-chapter-progress";
import { getLocalizedChapters } from "@/utils/get-chapters";

interface Props {
  currentChapterNumber: string;
  locale: string;
}

export function ChapterCarousel({ currentChapterNumber, locale }: Props) {
  const { progress } = useChapterProgress();
  const chaptersData = getLocalizedChapters(locale);

  const currentIndex = chaptersData.findIndex(
    (c) => c.chapterNumber === currentChapterNumber
  );

  // Chapters after the current one first, then wrap around from the beginning
  const orderedChapters = [
    ...chaptersData.slice(currentIndex + 1),
    ...chaptersData.slice(0, currentIndex),
  ];

  const items = orderedChapters.map((chapter, i) => ({
    chapterNumber: chapter.chapterNumber,
    title: chapter.title,
    description: chapter.description,
    videoCover: chapter.videoCover,
    locale,
    isVisited: progress.visitedChapters.has(chapter.chapterNumber),
    isLast: progress.lastChapter === chapter.chapterNumber,
    isNext: i === 0,
  }));

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-10">
      {/* Header alinhado ao container interno do carrossel */}
      <div className="flex items-center gap-3 px-0 sm:px-0 pb-4">
        <div className="h-px flex-1 bg-primary/10" />
        {/* <h2
          className="shrink-0 text-lg font-bold uppercase tracking-widest text-primary/60"
          style={{ fontFamily: "var(--font-rubik)" }}
        >
          {t("upNext")}
        </h2> */}
        <div className="h-px flex-1 bg-primary/10" />
      </div>

      <Carousel ItemComponent={StudyGuideChapterCard} items={items} />
    </div>
  );
}

