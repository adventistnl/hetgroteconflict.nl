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

  const items = orderedChapters.map((chapter) => ({
    chapterNumber: chapter.chapterNumber,
    title: chapter.title,
    description: chapter.description,
    videoCover: chapter.videoCover,
    locale,
    isVisited: progress.visitedChapters.has(chapter.chapterNumber),
    isLast: progress.lastChapter === chapter.chapterNumber,
  }));

  return (
    <div>
      <h2 className="pl-24 text-2xl text-primary">Up Next</h2>
      <Carousel ItemComponent={StudyGuideChapterCard} items={items} />
    </div>
  );
}
