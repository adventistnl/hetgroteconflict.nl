"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { track } from "@vercel/analytics";
import { useChapterProgress } from "@/hooks/use-chapter-progress";
import { StudyGuideChapterCard } from "../molecules/study-guide-chapter-card";
import { Footer } from "../molecules/footer";
import { PageHero } from "../molecules/page-hero";

const ITEMS_PER_PAGE = 6;

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
  const t = useTranslations("study-guide");
  const { progress, clearProgress } = useChapterProgress();
  const [currentPage, setCurrentPage] = useState(1);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (progress.lastChapter) {
      track("studyGuide_returnVisit", { lastChapter: progress.lastChapter });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const lastChapterData = chapters.find(
    (c) => c.chapterNumber === progress.lastChapter
  );
  // Hero always shows a video: last watched chapter OR chapter 1 as default
  const heroChapter = lastChapterData ?? chapters[0];
  const hasProgress = !!lastChapterData;
  const bgVideoUrl = heroChapter ? getBgVideoUrl(heroChapter.videoUrl) : "";

  // Pagination
  const totalPages = Math.ceil(chapters.length / ITEMS_PER_PAGE);
  const paginatedChapters = chapters.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  const goToPage = (page: number) => {
    setCurrentPage(page);
    gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-secondary">
      <PageHero
        variant="study-guide"
        chapter={heroChapter}
        locale={locale}
        hasProgress={hasProgress}
        bgVideoUrl={bgVideoUrl}
      />
      {/* ── Chapters grid ── */}
      <section ref={gridRef} className="mx-auto w-full max-w-6xl px-4 py-12">
        {/* Mobile: horizontal scroll-snap carousel (1 chapter at a time) */}
        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 sm:hidden">
          {chapters.map((chapter) => (
            <div
              key={chapter.chapterNumber}
              className="w-[calc(100vw-2.5rem)] shrink-0 snap-start"
            >
              <StudyGuideChapterCard
                chapterNumber={chapter.chapterNumber}
                title={chapter.title}
                description={chapter.description}
                videoCover={chapter.videoCover}
                locale={locale}
                isVisited={progress.visitedChapters.has(chapter.chapterNumber)}
                isLast={progress.lastChapter === chapter.chapterNumber}
              />
            </div>
          ))}
        </div>

        {/* Tablet / Desktop: paginated grid */}
        <div className="hidden gap-8 sm:grid sm:grid-cols-2 lg:grid-cols-3">
          {paginatedChapters.map((chapter) => (
            <StudyGuideChapterCard
              key={chapter.chapterNumber}
              chapterNumber={chapter.chapterNumber}
              title={chapter.title}
              description={chapter.description}
              videoCover={chapter.videoCover}
              locale={locale}
              isVisited={progress.visitedChapters.has(chapter.chapterNumber)}
              isLast={progress.lastChapter === chapter.chapterNumber}
            />
          ))}
        </div>

        {/* Pagination — desktop only */}
        {totalPages > 1 && (
          <div className="mt-12 hidden flex-col items-center gap-4 sm:flex">
            <div className="flex flex-row flex-wrap items-center justify-center gap-2">
              {/* Prev */}
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Previous page"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/20 text-primary transition-all hover:border-primary/60 hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Page numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold transition-all ${
                    currentPage === page
                      ? "border-[#4fa6c2] bg-[#4fa6c2] text-white shadow-md"
                      : "border-primary/20 text-primary hover:border-primary/60 hover:bg-primary/10"
                  }`}
                >
                  {page}
                </button>
              ))}

              {/* Next */}
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Next page"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/20 text-primary transition-all hover:border-primary/60 hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            <p
              className="text-xs text-primary/50"
              style={{ fontFamily: "var(--font-rubik)" }}
            >
              {currentPage} / {totalPages}
            </p>
          </div>
        )}
      </section>

      {/* Reset progress */}
      {progress.visitedChapters.size > 0 && (
        <div className="mb-6 flex justify-center">
          <button
            onClick={() => {
              clearProgress();
              track("studyGuide_progressReset");
            }}
            className="text-xs text-white/30 underline-offset-2 hover:text-white/60 hover:underline"
            style={{ fontFamily: "var(--font-rubik)" }}
          >
            {t("resetProgress")}
          </button>
        </div>
      )}

      <Footer />
    </div>
  );
};
