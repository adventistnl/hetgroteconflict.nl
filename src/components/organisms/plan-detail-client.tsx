"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef, useMemo } from "react";
import {
  BookOpen, Clock, CheckCircle2, PlayCircle, ArrowLeft, ArrowRight,
  Lock, ChevronDown, ChevronUp, Bookmark, X,
} from "lucide-react";
import { plansDatabase, PlanDay } from "@/database/plans";
import { usePlanProgress } from "@/hooks/use-plan-progress";
import { useAuth } from "@/hooks/use-auth";
import { usePlanEnrollment } from "@/hooks/use-plan-enrollment";
import { useReadAloud } from "@/hooks/use-read-aloud";
import { useXp, xpForPlan } from "@/hooks/use-xp";
import { useTranslations } from "next-intl";
import { AuthModal } from "@/components/atoms/auth-modal";
import { ReadAloudPlayer } from "@/components/atoms/read-aloud-player";
import { HighlightedText } from "@/components/molecules/highlighted-text";
import { languages } from "@/config/languages";
import { getVideoEmbedUrl } from "@/utils/get-video-embed-url";
import { track } from "@vercel/analytics";

// ── Helpers ───────────────────────────────────────────────────────────────────

const LOCALE_TO_COVER: Record<string, string> = Object.fromEntries(
  languages.map((l) => [l.routeLocale, `/book-covers/${l.name.toLowerCase()}.${l.bookCoverExtension}`])
);
const getBookCover = (locale: string) => LOCALE_TO_COVER[locale] ?? "/book-covers/english.avif";

function formatMinutes(min: number) {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m > 0 ? `${h}h ${m}min` : `${h}h`;
}

// ── Book data cache (locale-aware, falls back to English) ────────────────────

interface BookChapter { chapter_number: number | null; title: string; content: string; }
interface BookData { chapters: BookChapter[]; }
const _bookCache: Record<string, BookData> = {};
async function getBookData(locale = "en"): Promise<BookData> {
  if (_bookCache[locale]) return _bookCache[locale];
  // Try locale-specific file first, fall back to English
  try {
    const res = await fetch(`/book/${locale}.the-great-controversy-chapters.json`);
    if (res.ok) { _bookCache[locale] = await res.json() as BookData; return _bookCache[locale]; }
  } catch { /* fall through */ }
  if (!_bookCache["en"]) {
    const res = await fetch("/book/en.the-great-controversy-chapters.json");
    _bookCache["en"] = await res.json() as BookData;
  }
  return _bookCache["en"];
}

function parseContent(raw: string): string[] {
  // Split by double newline (paragraph breaks)
  const blocks = raw.split(/\n\s*\n/).filter((b) => b.trim().length > 0);
  return blocks.map((block) =>
    block
      .replace(/-\n\s*/g, "")        // rejoin hyphenated line breaks
      .replace(/\n\s*/g, " ")        // collapse soft line breaks
      .replace(/\s+/g, " ")          // normalize whitespace
      .trim()
  ).filter((p) => p.length > 0);
}

// ── Paged reader helpers ──────────────────────────────────────────────────────

const TARGET_PAGE_CHARS = 1100;

function buildPages(paragraphs: string[]): string[][] {
  const pages: string[][] = [];
  let current: string[] = [];
  let len = 0;
  for (const para of paragraphs) {
    if (len > 0 && len + para.length > TARGET_PAGE_CHARS) {
      pages.push(current);
      current = [para];
      len = para.length;
    } else {
      current.push(para);
      len += para.length;
    }
  }
  if (current.length) pages.push(current);
  return pages.length ? pages : [[]];
}

function readerProgressKey(chapterNumber: number | null, chapterTitle: string) {
  return `gc_rp_${chapterNumber ?? chapterTitle.replace(/\W+/g, "_").slice(0, 25)}`;
}

function loadReaderPage(key: string): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = localStorage.getItem(key);
    return raw ? ((JSON.parse(raw) as { page?: number }).page ?? 0) : 0;
  } catch { return 0; }
}

function saveReaderPage(key: string, page: number) {
  try { localStorage.setItem(key, JSON.stringify({ page, ts: Date.now() })); } catch { /* noop */ }
}

// ── Immersive Reader ──────────────────────────────────────────────────────────

function ImmersiveReader({
  chapterNumber, chapterTitle, locale, onClose, onComplete,
}: {
  chapterNumber: number | null;
  chapterTitle: string;
  locale: string;
  onClose: () => void;
  onComplete: () => void;
}) {
  const t = useTranslations("reading-plan");
  const [paragraphs, setParagraphs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [resumedFrom, setResumedFrom] = useState<number | null>(null);
  const readAloud = useReadAloud();
  const contentRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);

  const progressKey = readerProgressKey(chapterNumber, chapterTitle);
  const pages = useMemo(() => buildPages(paragraphs), [paragraphs]);
  const safePage = Math.min(currentPage, Math.max(0, pages.length - 1));
  const isLastPage = safePage === pages.length - 1 && pages.length > 0;
  const currentPageParas = pages[safePage] ?? [];
  const currentPageText = useMemo(() => currentPageParas.join("\n\n"), [currentPageParas]);
  const paraOffsets = currentPageParas.map((_, i) =>
    currentPageParas.slice(0, i).reduce((sum, p) => sum + p.length + 2, 0)
  );

  // Load chapter + restore saved page
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getBookData(locale).then((data) => {
      if (cancelled) return;
      const ch = chapterNumber !== null
        ? data.chapters.find((c) => c.chapter_number === chapterNumber)
        : data.chapters.find((c) => c.title === chapterTitle);
      if (ch) {
        setParagraphs(parseContent(ch.content));
        const saved = loadReaderPage(progressKey);
        if (saved > 0) {
          setCurrentPage(saved);
          setResumedFrom(saved);
        }
      }
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [chapterNumber, chapterTitle, progressKey]);

  // Save progress on page change
  useEffect(() => {
    if (!loading && pages.length > 0) saveReaderPage(progressKey, safePage);
  }, [safePage, loading, pages.length, progressKey]);

  // Scroll content to top on page change
  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [safePage]);

  // Keyboard navigation
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight" || e.key === "PageDown") gotoNext();
      if (e.key === "ArrowLeft"  || e.key === "PageUp")   gotoPrev();
      if (e.key === "Escape") { readAloud.stop(); onClose(); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safePage, pages.length]);

  function gotoNext() {
    if (safePage < pages.length - 1) {
      readAloud.stop();
      setCurrentPage((p) => p + 1);
      setResumedFrom(null);
    }
  }

  function gotoPrev() {
    if (safePage > 0) {
      readAloud.stop();
      setCurrentPage((p) => p - 1);
      setResumedFrom(null);
    }
  }

  function gotoPage(p: number) {
    readAloud.stop();
    setCurrentPage(p);
    setResumedFrom(null);
  }

  function handleComplete() {
    saveReaderPage(progressKey, 0);
    readAloud.stop();
    onComplete();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#F6F2EB]">

      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-black/10 bg-[#F6F2EB] px-5 py-3">
        <div className="min-w-0">
          <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-black/30">{t("book-label")}</p>
          <p className="mt-0.5 max-w-[220px] truncate text-xs font-semibold text-black/55 sm:max-w-sm">{chapterTitle}</p>
        </div>
        <div className="flex items-center gap-4">
          {!loading && pages.length > 0 && (
            <span className="text-[10px] tabular-nums text-black/35">{safePage + 1}&nbsp;/&nbsp;{pages.length}</span>
          )}
          <button
            onClick={() => { readAloud.stop(); onClose(); }}
            aria-label="Close reader"
            className="rounded-full p-1.5 text-black/40 transition hover:bg-black/10 hover:text-black/70"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Resume banner */}
      {resumedFrom !== null && (
        <div className="flex shrink-0 items-center justify-between border-b border-amber-200 bg-amber-50 px-5 py-2.5">
          <p className="text-xs text-amber-700">
          {t("continuing-from", { page: resumedFrom + 1 })}
          </p>
          <button
            onClick={() => { setResumedFrom(null); gotoPage(0); }}
            className="text-[11px] font-semibold text-amber-600 hover:underline"
          >
            {t("start-from-beginning")}
          </button>
        </div>
      )}

      {/* TTS player */}
      {!loading && pages.length > 0 && (
        <div className="shrink-0 border-b border-black/[0.08] bg-[#F6F2EB] px-5 py-2.5">
          <ReadAloudPlayer text={currentPageText} lang="en" readAloud={readAloud} />
        </div>
      )}

      {/* Content */}
      <div
        ref={contentRef}
        className="flex-1 overflow-y-auto"
        onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          const delta = touchStartX.current - e.changedTouches[0].clientX;
          if (Math.abs(delta) > 50) delta > 0 ? gotoNext() : gotoPrev();
        }}
      >
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-black/10 border-t-[#4fa6c2]" />
          </div>
        ) : (
          <div className="mx-auto max-w-[62ch] px-6 py-10 sm:py-14">
            {currentPageParas.map((para, i) => {
              const relIdx =
                readAloud.currentCharIndex >= paraOffsets[i]
                  ? readAloud.currentCharIndex - paraOffsets[i]
                  : -1;
              return (
                <p
                  key={i}
                  className="mb-6 text-[17px] leading-[1.9] text-[#1C1C1C]"
                  style={{ fontFamily: "var(--font-rubik)", fontWeight: 400 }}
                >
                  <HighlightedText text={para} currentCharIndex={relIdx} />
                </p>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom nav */}
      {!loading && pages.length > 0 && (
        <div className="shrink-0 border-t border-black/10 bg-[#F6F2EB] px-5 pb-6 pt-4">
          {/* Progress bar */}
          <div className="mb-4 h-0.5 overflow-hidden rounded-full bg-black/10">
            <div
              className="h-full rounded-full bg-[#4fa6c2] transition-all duration-500"
              style={{ width: `${((safePage + 1) / pages.length) * 100}%` }}
            />
          </div>

          <div className="flex items-center justify-between">
            {/* Prev */}
            <button
              onClick={gotoPrev}
              disabled={safePage === 0}
              aria-label="Previous page"
              className="flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold text-black/45 transition hover:bg-black/[0.08] hover:text-black/70 disabled:opacity-25"
            >
              <ArrowLeft className="h-4 w-4" /> {t("previous")}
            </button>

            {/* Page dots (≤ 9 pages) or counter */}
            {pages.length <= 9 ? (
              <div className="flex items-center gap-1.5">
                {pages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => gotoPage(i)}
                    aria-label={`Page ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === safePage ? "w-4 bg-[#4fa6c2]" : "w-1.5 bg-black/20 hover:bg-black/40"
                    }`}
                  />
                ))}
              </div>
            ) : (
              <span className="text-xs tabular-nums text-black/35">{safePage + 1}&nbsp;/&nbsp;{pages.length}</span>
            )}

            {/* Next or Complete */}
            {isLastPage ? (
              <button
                onClick={handleComplete}
                className="flex items-center gap-1.5 rounded-xl bg-[#4fa6c2] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#3d91ad] active:scale-[0.98]"
              >
                <CheckCircle2 className="h-4 w-4" /> {t("complete")}
              </button>
            ) : (
              <button
                onClick={gotoNext}
                aria-label="Next page"
                className="flex items-center gap-1.5 rounded-xl bg-[#4fa6c2] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#3d91ad] active:scale-[0.98]"
              >
                {t("next")} <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Video Modal ───────────────────────────────────────────────────────────────

function VideoModal({
  videoUrl, locale, title, onClose, onComplete, isCompleted,
}: {
  videoUrl: string;
  locale: string;
  title: string;
  onClose: () => void;
  onComplete: () => void;
  isCompleted: boolean;
}) {
  const t = useTranslations("reading-plan");
  const embedUrl = getVideoEmbedUrl(videoUrl, locale);
  const autoplayUrl = embedUrl + (embedUrl.includes("?") ? "&" : "?") + "autoplay=1";

  // Close on backdrop click or Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="flex w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-[#0f0f0f] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div className="flex items-center gap-2">
            <PlayCircle className="h-4 w-4 text-[#4fa6c2]" />
            <span className="text-xs font-semibold text-white/70">{title}</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close video"
            className="rounded-full p-1 text-white/40 transition hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Video */}
        <div className="relative aspect-video w-full bg-black">
          <iframe
            src={autoplayUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            className="h-full w-full"
          />
        </div>

        {/* Complete footer */}
        {!isCompleted && (
          <div className="border-t border-white/10 px-4 py-4">
            <button
              onClick={() => { onComplete(); onClose(); }}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#4fa6c2] py-3 text-sm font-bold text-white transition hover:bg-[#3d91ad] active:scale-[0.98]"
            >
              <CheckCircle2 className="h-4 w-4" /> {t("mark-complete")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Journey Map ───────────────────────────────────────────────────────────────

function JourneyMap({
  totalDays, completedDays, upNextDay, onDayClick,
}: {
  totalDays: number; completedDays: number[]; upNextDay: number | null;
  onDayClick: (day: number) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!upNextDay || !scrollRef.current) return;
    const el = scrollRef.current.querySelector<HTMLElement>(`[data-day="${upNextDay}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [upNextDay]);

  return (
    <div ref={scrollRef} className="flex items-center overflow-x-auto px-1 py-2 scrollbar-none">
      {Array.from({ length: totalDays }, (_, i) => i + 1).map((day, idx) => {
        const done   = completedDays.includes(day);
        const isNext = day === upNextDay;
        const locked = !done && !isNext && day > (upNextDay ?? 1);
        return (
          <div key={day} className="flex shrink-0 items-center">
            <button
              data-day={day}
              onClick={() => onDayClick(day)}
              className={`relative flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold transition-all ${
                done   ? "bg-[#4fa6c2] text-white shadow-md shadow-[#4fa6c2]/30"
                : isNext ? "bg-[#4fa6c2]/20 text-[#4fa6c2] ring-2 ring-[#4fa6c2] ring-offset-2 ring-offset-secondary"
                : locked ? "bg-primary/10 text-primary/50"
                         : "bg-primary/15 text-primary"
              }`}
            >
              {done ? <CheckCircle2 className="h-4 w-4" /> : locked ? <Lock className="h-3 w-3" /> : day}
            </button>
            {idx < totalDays - 1 && (
              <div className={`h-px w-6 shrink-0 ${done ? "bg-[#4fa6c2]/60" : "bg-primary/25"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── DayCard ───────────────────────────────────────────────────────────────────

type DayState = "completed" | "up-next" | "unlocked" | "locked";

function DayCard({
  day, locale, planId, state, autoOpen, onMarkComplete,
}: {
  day: PlanDay; locale: string; planId: string;
  state: DayState; autoOpen?: boolean;
  onMarkComplete: (day: number) => void;
}) {
  const [expanded, setExpanded] = useState(autoOpen ?? false);
  const [readerOpen, setReaderOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoTitle, setVideoTitle] = useState("");
  const isCompleted = state === "completed";
  const isLocked    = state === "locked";
  const t = useTranslations("reading-plan");

  useEffect(() => { if (autoOpen) setExpanded(true); }, [autoOpen]);

  function handleMarkComplete() {
    setReaderOpen(false);
    onMarkComplete(day.day);
    track("readingPlan_dayComplete", { planId, day: day.day });
  }

  return (
    <div className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
      isCompleted   ? "border-[#4fa6c2]/30 bg-[#4fa6c2]/5"
      : state === "up-next" ? "border-[#4fa6c2]/50 bg-primary/5 shadow-lg shadow-[#4fa6c2]/10"
      : isLocked    ? "border-primary/10 bg-primary/[0.02] opacity-50"
                    : "border-primary/15 bg-primary/5"
    }`}>
      {/* Header row */}
      <button
        className="flex w-full items-center gap-4 p-4 text-left disabled:cursor-not-allowed"
        onClick={() => !isLocked && setExpanded((v) => !v)}
        disabled={isLocked}
      >
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
          isCompleted   ? "bg-[#4fa6c2] text-white"
          : state === "up-next" ? "bg-[#4fa6c2]/20 text-[#4fa6c2] ring-2 ring-[#4fa6c2]"
          : isLocked    ? "bg-primary/10 text-primary/30"
                        : "bg-primary/15 text-primary"
        }`}>
          {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : isLocked ? <Lock className="h-4 w-4" /> : day.day}
        </div>

        <div className="flex flex-1 flex-col gap-0.5 min-w-0">
          {state === "up-next" && (
            <span className="mb-0.5 flex w-fit items-center gap-1 rounded-full bg-[#4fa6c2] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
              <PlayCircle className="h-2.5 w-2.5" /> {t("up-next")}
            </span>
          )}
          <p className={`truncate text-sm font-semibold ${isLocked ? "text-primary/40" : "text-primary"}`}>{day.title}</p>
          <p className="text-[11px] text-primary/50">{day.pages} pages · {formatMinutes(day.total_minutes_estimate)}</p>
        </div>

        {!isLocked && !isCompleted && (
          expanded ? <ChevronUp className="h-4 w-4 shrink-0 text-primary/40" />
                   : <ChevronDown className="h-4 w-4 shrink-0 text-primary/40" />
        )}
      </button>

      {/* Expanded body */}
      {expanded && !isLocked && (
        <div className="flex flex-col gap-4 border-t border-primary/10 px-4 pb-5 pt-4">
          {day.steps.map((step) => (
            <div key={step.step}>
              {/* Watch step */}
              {step.action === "watch" && step.videoUrl && step.videoCover ? (
                <button
                  className="flex w-full items-center gap-4 rounded-xl border border-primary/15 bg-primary/5 p-4 text-left transition hover:border-[#4fa6c2]/50"
                  onClick={() => {
                    setVideoUrl(step.videoUrl!);
                    setVideoTitle(step.label ?? day.title);
                    track("readingPlan_watchVideo", { planId, day: day.day });
                  }}
                >
                  <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg">
                    <Image src={step.videoCover} alt="thumbnail" fill className="object-cover" sizes="96px" unoptimized />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <PlayCircle className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-primary">{step.label}</p>
                    <p className="mt-1 text-[11px] text-primary/50">{step.duration_minutes} min · {t("watch-cta")}</p>
                  </div>
                  <PlayCircle className="h-5 w-5 shrink-0 text-[#4fa6c2]" />
                </button>

              /* Read step — inline reader */
              ) : step.action === "read" ? (
                <div className="flex flex-col gap-2">
                  {/* Read CTA button */}
                  <button
                    className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition ${
                      readerOpen
                        ? "border-[#4fa6c2]/50 bg-[#4fa6c2]/5"
                        : "border-primary/15 bg-primary/5 hover:border-[#4fa6c2]/40"
                    }`}
                    onClick={() => {
                      setReaderOpen((v) => !v);
                      if (!readerOpen) track("readingPlan_readChapter", { planId, day: day.day });
                    }}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#4fa6c2]/10">
                      <BookOpen className="h-5 w-5 text-[#4fa6c2]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-primary">{step.label}</p>
                      <p className="mt-1 text-[11px] text-primary/50">
                        <Clock className="mr-0.5 inline h-2.5 w-2.5" />
                        {step.duration_minutes} min · {step.pages} pages
                      </p>
                    </div>
                    <span className={`shrink-0 text-[10px] font-semibold uppercase tracking-wide ${readerOpen ? "text-[#4fa6c2]" : "text-primary/40"}`}>
                      {readerOpen ? t("close") : t("read")}
                    </span>
                  </button>

                  {/* Inline reader panel */}
                  {readerOpen && (
                    <ImmersiveReader
                      chapterNumber={day.chapter_number}
                      chapterTitle={day.title}
                      locale={locale}
                      onClose={() => setReaderOpen(false)}
                      onComplete={handleMarkComplete}
                    />
                  )}
                </div>
              ) : null}
            </div>
          ))}

          {/* Mark complete button (when reader is not open) */}
          {!isCompleted && !readerOpen && (
            <button
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-[#4fa6c2]/50 bg-[#4fa6c2]/10 py-4 text-sm font-semibold text-[#4fa6c2] transition hover:bg-[#4fa6c2]/20 active:scale-[0.98]"
              onClick={handleMarkComplete}
            >
              <CheckCircle2 className="h-4 w-4" /> {t("mark-day-complete", { day: day.day })}
            </button>
          )}
        </div>
      )}

      {/* Video modal */}
      {videoUrl && (
        <VideoModal
          videoUrl={videoUrl}
          locale={locale}
          title={videoTitle}
          onClose={() => setVideoUrl(null)}
          onComplete={handleMarkComplete}
          isCompleted={isCompleted}
        />
      )}
    </div>
  );
}

// ── PlanDetailClient ──────────────────────────────────────────────────────────

export default function PlanDetailClient({ planId, locale }: { planId: string; locale: string }) {
  const plan = plansDatabase.find((p) => p.plan === planId);
  if (!plan) notFound();

  const { user } = useAuth();
  const { getEnrollment, startPlan: dbStartPlan, markDayComplete: dbMarkDay, savePlan } = usePlanEnrollment(user?.id ?? null);
  const dbEnrollment = getEnrollment(planId);

  const { addSkill } = useXp();
  const { progress, getPlanEntry, startPlan: lsStartPlan, markDayComplete: lsMarkDay } = usePlanProgress();
  const [lsEntry, setLsEntry] = useState<ReturnType<typeof getPlanEntry>>(null);
  useEffect(() => { setLsEntry(getPlanEntry(planId)); }, [getPlanEntry, planId, progress]);

  const [showAuth, setShowAuth] = useState(false);
  const [focusDay, setFocusDay] = useState<number | null>(null);

  const completedDays: number[] = user ? (dbEnrollment?.completed_days ?? []) : (lsEntry?.completedDays ?? []);
  const isStarted   = user ? !!dbEnrollment           : !!lsEntry;
  const isCompleted = user ? !!dbEnrollment?.completed_at : !!lsEntry?.completedAt;
  const isSaved     = dbEnrollment?.is_saved ?? false;

  const totalDays   = plan.daily_breakdown_standard.length;
  const progressPct = totalDays > 0 ? Math.round((completedDays.length / totalDays) * 100) : 0;
  const upNextDay   = completedDays.length < totalDays ? completedDays.length + 1 : null;
  const nextPlan    = plan.next_plan ? plansDatabase.find((p) => p.plan === plan.next_plan) : null;
  const t = useTranslations("reading-plan");

  function handleStart() {
    if (user) dbStartPlan(planId); else lsStartPlan(planId);
    setFocusDay(1);
    track("readingPlan_start", { planId });
  }

  function handleMarkComplete(day: number) {
    // Check before mutating state whether this completion finishes the whole plan
    const willFinishPlan =
      !completedDays.includes(day) &&
      completedDays.length + 1 >= totalDays &&
      !isCompleted;

    if (user) dbMarkDay(planId, day, totalDays); else lsMarkDay(planId, day, totalDays);

    if (willFinishPlan && plan) {
      addSkill(planId, plan.badge, plan.title, xpForPlan(plan.total_pages));
    }

    setFocusDay(null);
  }

  function getDayState(day: number): DayState {
    if (completedDays.includes(day)) return "completed";
    if (day === upNextDay)            return "up-next";
    if (day < (upNextDay ?? 1))       return "unlocked";
    return "locked";
  }

  return (
    <div className="min-h-screen bg-secondary">

      {/* ── Hero ── */}
      <div className="relative h-[55vw] max-h-72 min-h-44 w-full overflow-hidden">
        <Image src={getBookCover(locale)} alt={plan.title} fill className="object-cover object-top" priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-secondary via-transparent to-transparent" />

        <Link href={`/${locale}/guide`}
              className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm transition hover:bg-black/60 sm:left-6 sm:top-6">
          <ArrowLeft className="h-3.5 w-3.5" /> {t("back-to-plans")}
        </Link>

        <div className="absolute bottom-0 left-0 p-5 sm:p-8">
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-[#4fa6c2]">{t("plan-count", { order: plan.order, total: plansDatabase.length })}</p>
          <h1 className="text-xl font-bold leading-tight text-white sm:text-3xl" style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}>{plan.title}</h1>
          <div className="mt-2 flex flex-wrap gap-3 text-xs text-white/50">
            <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" />{t("chapters", { count: plan.total_chapters })}</span>
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" />~{formatMinutes(plan.total_time_minutes_estimate)}</span>
          </div>
        </div>

        {user && (
          <button onClick={() => savePlan(planId, !isSaved)}
                  className="absolute right-4 top-4 rounded-full bg-black/40 p-2.5 text-white backdrop-blur-sm transition hover:bg-black/60 sm:right-6 sm:top-6">
            <Bookmark className="h-4 w-4" fill={isSaved ? "currentColor" : "none"} />
          </button>
        )}
      </div>

      {/* ── Body ── */}
      <div className="mx-auto max-w-2xl px-4 pb-24 sm:px-6">

        {/* Progress bar */}
        {isStarted && (
          <div className="pt-5">
            <div className="mb-1.5 flex justify-between text-xs text-primary/60">
              <span>{t("progress", { done: completedDays.length, total: totalDays })}</span>
              <span>{progressPct}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-primary/15">
              <div className="h-full rounded-full bg-[#4fa6c2] transition-all duration-700" style={{ width: `${progressPct}%` }} />
            </div>
          </div>
        )}

        <p className="mt-5 text-sm leading-relaxed text-primary/65">{plan.description}</p>

        {/* Start / sign-in CTA */}
        {!isStarted && (
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button onClick={handleStart}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#4fa6c2] py-3.5 text-sm font-bold text-white transition hover:bg-[#3d91ad] active:scale-[0.98]">
              <PlayCircle className="h-4 w-4" /> {t("start")}
            </button>
            {!user && (
              <button onClick={() => setShowAuth(true)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-primary/15 py-3.5 text-sm font-semibold text-primary/65 transition hover:border-primary/40 hover:text-primary">
                {t("sign-in-save")}
              </button>
            )}
          </div>
        )}

        {/* Journey Map */}
        <div className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-primary/55">{t("journey-map", { total: totalDays })}</h2>
            {upNextDay && <span className="text-xs font-medium text-[#4fa6c2]">{t("day-up-next", { day: upNextDay })}</span>}
          </div>
          <JourneyMap totalDays={totalDays} completedDays={completedDays} upNextDay={upNextDay}
                      onDayClick={(d) => setFocusDay(focusDay === d ? null : d)} />
        </div>

        {/* Day cards */}
        <div className="mt-6 flex flex-col gap-3">
          {plan.daily_breakdown_standard.map((day) => (
            <DayCard key={day.day} day={day} locale={locale} planId={planId}
                     state={getDayState(day.day)}
                     autoOpen={day.day === focusDay || (!focusDay && day.day === upNextDay && isStarted)}
                     onMarkComplete={(d) => {
                       if (!isStarted) handleStart();
                       handleMarkComplete(d);
                     }} />
          ))}
        </div>

        {/* Completion banner */}
        {isCompleted && (
          <div className="mt-8 flex flex-col items-center gap-4 rounded-2xl border border-[#4fa6c2]/30 bg-[#4fa6c2]/10 p-6 text-center">
            <span className="text-4xl">{plan.badge.split(" ")[0]}</span>
            <div>
              <p className="text-lg font-bold text-[#4fa6c2]">{plan.badge.split(" ").slice(1).join(" ")}</p>
              <p className="mt-1 text-sm text-primary/65">{plan.completion_message}</p>
            </div>
            {nextPlan ? (
              <Link href={`/${locale}/guide/plan/${nextPlan.plan}`}
                    className="flex items-center gap-2 rounded-xl bg-[#4fa6c2] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#3d91ad]">
                {t("next-plan", { title: nextPlan.title })} <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <p className="text-sm font-semibold text-primary">{plan.next_plan_cta}</p>
            )}
          </div>
        )}

        {!isCompleted && plan.next_plan && (
          <p className="mt-8 text-center text-xs text-primary/40">{plan.next_plan_cta}</p>
        )}
      </div>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </div>
  );
}
