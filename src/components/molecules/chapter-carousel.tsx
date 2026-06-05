"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { StudyGuideChapterCard } from "./study-guide-chapter-card";
import { useChapterProgress } from "@/hooks/use-chapter-progress";
import { getLocalizedChapters } from "@/utils/get-chapters";

const AUTOPLAY_INTERVAL = 4000;

function useVisibleCount() {
  const [count, setCount] = useState(3);
  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 640) setCount(1);
      else if (window.innerWidth < 1024) setCount(2);
      else setCount(3);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return count;
}

interface Props {
  currentChapterNumber: string;
  locale: string;
}

export function ChapterCarousel({ currentChapterNumber, locale }: Props) {
  const t = useTranslations("study-guide");
  const { progress } = useChapterProgress();
  const chaptersData = getLocalizedChapters(locale);
  const visibleCount = useVisibleCount();

  const currentIndex = chaptersData.findIndex(
    (c) => c.chapterNumber === currentChapterNumber
  );

  const orderedChapters = [
    ...chaptersData.slice(currentIndex + 1),
    ...chaptersData.slice(0, currentIndex),
  ];

  const items = orderedChapters.map((chapter, idx) => ({
    chapterNumber: chapter.chapterNumber,
    title: chapter.title,
    description: chapter.description,
    videoCover: chapter.videoCover,
    locale,
    isVisited: progress.visitedChapters.has(chapter.chapterNumber),
    isLast: progress.lastChapter === chapter.chapterNumber,
    isNext: idx === 0,
  }));

  const total = items.length;
  const [offset, setOffset] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const next = useCallback(() => {
    setOffset((o) => (o + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    setOffset((o) => (o - 1 + total) % total);
  }, [total]);

  // autoplay
  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(next, AUTOPLAY_INTERVAL);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [paused, next]);

  // build visible window (wrapping)
  const visible = Array.from({ length: visibleCount }, (_, i) =>
    items[(offset + i) % total]
  );

  return (
    <div
      className="mx-auto w-full max-w-6xl px-4"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <span
            className="text-xs font-semibold uppercase tracking-widest text-[#4fa6c2]"
            style={{ fontFamily: "var(--font-rubik)" }}
          >
            {t("upNext")}
          </span>
          <h2
            className="text-xl font-bold text-primary"
            style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}
          >
            {t("chapter")} {items[offset % total]?.chapterNumber} — {items[offset % total]?.title}
          </h2>
        </div>

        {/* Arrows — hidden on mobile */}
        <div className="hidden items-center gap-2 sm:flex">
          <button
            onClick={() => { prev(); setPaused(true); }}
            aria-label="Previous"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/20 text-primary transition-all hover:border-[#4fa6c2] hover:text-[#4fa6c2]"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => { next(); setPaused(true); }}
            aria-label="Next"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/20 text-primary transition-all hover:border-[#4fa6c2] hover:text-[#4fa6c2]"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-6 h-0.5 w-full overflow-hidden rounded-full bg-primary/10">
        <div
          key={offset}
          className="h-full rounded-full bg-[#4fa6c2]"
          style={{
            animation: paused ? "none" : `progress-bar ${AUTOPLAY_INTERVAL}ms linear forwards`,
          }}
        />
      </div>

      {/* Mobile: scroll-snap, no arrows */}
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

      {/* Desktop: animated sliding window */}
      <div className="hidden gap-6 sm:grid sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((item, i) => (
          <div
            key={`${item.chapterNumber}-${offset}-${i}`}
            className="animate-fade-in"
          >
            <StudyGuideChapterCard {...item} />
          </div>
        ))}
      </div>

      {/* Dot indicators */}
      <div className="mt-6 flex items-center justify-center gap-1.5">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => { setOffset(i); setPaused(true); }}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === offset % total
                ? "w-6 bg-[#4fa6c2]"
                : "w-1.5 bg-primary/20 hover:bg-primary/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
