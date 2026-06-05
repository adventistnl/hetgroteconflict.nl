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
      {/* Divider */}
      <div className="flex items-center gap-3 pb-4">
        <div className="h-px flex-1 bg-primary/10" />
        <div className="h-px flex-1 bg-primary/10" />
      </div>

      {/* Mobile: native horizontal scroll-snap */}
      <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 sm:hidden">
        {items.map((item) => (
          <div
            key={item.chapterNumber}
            className="w-[calc(100vw-2.5rem)] shrink-0 snap-start"
          >
            <StudyGuideChapterCard {...item} />
          </div>
        ))}
      </div>

      {/* Tablet / Desktop: arrow carousel */}
      <div className="hidden sm:block">
        <Carousel ItemComponent={StudyGuideChapterCard} items={items} />
      </div>
    </div>
  );
}

