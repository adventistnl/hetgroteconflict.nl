"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef, useMemo, type SetStateAction } from "react";
import {
  BookOpen, Clock, CheckCircle2, PlayCircle, ArrowLeft, ArrowRight,
  Lock, ChevronDown, ChevronUp, Bookmark, X,
} from "lucide-react";
import { plansDatabase, PlanDay } from "@/database/plans";
import { getLocalizedPlan } from "@/utils/get-localized-plans";
import { useReadAloud } from "@/hooks/use-read-aloud";
import { useProgress } from "@/contexts/progress-context";
import { useTranslations } from "next-intl";
import { AuthModal } from "@/components/atoms/auth-modal";
import { ReadAloudPlayer } from "@/components/atoms/read-aloud-player";
import { HighlightedText } from "@/components/molecules/highlighted-text";
import { languages } from "@/config/languages";
import { getVideoEmbedUrl } from "@/utils/get-video-embed-url";
import { track } from "@vercel/analytics";
import { SelectLanguage } from "@/components/molecules/select-language";
import { LanguageObj, languagesList } from "@/utils/languages-list";

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

// public/book/*.json filenames don't follow a uniform `${locale}.the-great-controversy-chapters.json`
// pattern (legacy exports use different suffixes/codes per language), so map explicitly.
const LOCALE_TO_BOOK_FILE: Record<string, string> = {
  ar: "ar.the-great-controversy.json",
  cz: "cs.the-great-controversy.json",
  de: "de.the-great-controversy.json",
  en: "en.the-great-controversy-chapters.json",
  es: "es.the-great-controversy.json",
  fr: "fr.the-great-controversy_.json",
  nl: "nl.the-great-controversy.json",
  pt: "pt-brasil.the-great-controversy.json",
  ru: "ru.the-great-controversy.json",
  tw: "twi.the-great-controversy.json",
  zh: "zh.the-great-controversy.json",
};

// In-memory cache for the current session + a persisted Cache Storage copy
// (`BOOK_CACHE_NAME`) so a plan already opened once while online keeps
// working offline. No service worker required — we read/write the Cache
// Storage API directly from the page.
const BOOK_CACHE_NAME = "gc-book-cache-v1";
const _bookMemCache: Record<string, BookData> = {};
const _bookInflight: Record<string, Promise<BookData> | undefined> = {};

async function fetchAndPersist(url: string): Promise<BookData> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Book fetch failed: ${url} (${res.status})`);
  if (typeof caches !== "undefined") {
    try {
      const cache = await caches.open(BOOK_CACHE_NAME);
      await cache.put(url, res.clone());
    } catch { /* Cache Storage unavailable (e.g. private browsing) — best-effort only */ }
  }
  return (await res.json()) as BookData;
}

async function readPersisted(url: string): Promise<BookData | null> {
  if (typeof caches === "undefined") return null;
  try {
    const cache = await caches.open(BOOK_CACHE_NAME);
    const cached = await cache.match(url);
    return cached ? ((await cached.json()) as BookData) : null;
  } catch {
    return null;
  }
}

/**
 * Loads book content for a locale: network first (for freshness), falling
 * back to the persisted offline copy, then to English (network, then its
 * own offline copy). Throws only if nothing is available anywhere.
 */
async function getBookData(locale = "en"): Promise<BookData> {
  if (_bookMemCache[locale]) return _bookMemCache[locale];
  if (_bookInflight[locale]) return _bookInflight[locale];

  const fileName = LOCALE_TO_BOOK_FILE[locale] ?? LOCALE_TO_BOOK_FILE.en;
  const url = `/book/${fileName}`;
  const enUrl = `/book/${LOCALE_TO_BOOK_FILE.en}`;

  const promise = (async () => {
    try {
      return await fetchAndPersist(url);
    } catch {
      const cached = await readPersisted(url);
      if (cached) return cached;

      if (locale !== "en") {
        try {
          return await fetchAndPersist(enUrl);
        } catch {
          const cachedEn = await readPersisted(enUrl);
          if (cachedEn) return cachedEn;
        }
      }
      throw new Error("Book content unavailable — offline and not yet downloaded.");
    }
  })().then((data) => { _bookMemCache[locale] = data; return data; });

  _bookInflight[locale] = promise;
  try {
    return await promise;
  } finally {
    delete _bookInflight[locale];
  }
}

/** Fire-and-forget preload so content (and its offline copy) is ready before the reader opens. */
function prefetchBookData(locale: string) {
  void getBookData(locale).catch(() => { /* surfaced later if the reader is actually opened */ });
}

// ── Chapter resolution ──────────────────────────────────────────────────────
// Translated editions don't always mirror the 42-chapter EN structure the
// plans are numbered against: front/back matter gets renamed, reordered, or
// dropped, and es.the-great-controversy.json inserts an extra chapter
// ("El despertar de España", ch. 13) not present in the EN edition, shifting
// every following chapter number by +1. Verified against EN by content-length
// correlation (r=0.999 for this mapping vs r=0.293 unshifted); every other
// locale's numbered chapters correlate 1:1 with EN with no remap needed.
const NUMBERED_CHAPTER_REMAP: Partial<Record<string, (n: number) => number>> = {
  es: (n) => (n >= 13 ? n + 1 : n),
};

function resolveChapterNumber(locale: string, chapterNumber: number): number {
  return NUMBERED_CHAPTER_REMAP[locale]?.(chapterNumber) ?? chapterNumber;
}

/** Which front/back-matter slot a null-chapter_number day maps to. Only the
 *  "Introduction" plan (Preface, Introduction) and "Appendix" plan use this. */
interface NullChapterRole { group: "front" | "back"; position: "first" | "last" }

function getNullChapterRole(planId: string, day: number): NullChapterRole | null {
  if (planId === "Introduction") return { group: "front", position: day === 1 ? "first" : "last" };
  if (planId === "Appendix") return { group: "back", position: "last" };
  return null;
}

/**
 * Front/back matter is matched by position, not title — translated editions
 * rename, merge, reorder, or drop it entirely (e.g. several locales have no
 * separate Appendix chapter). Returns undefined if that side has no
 * front/back matter at all, so the caller can fall back to English.
 */
function findNullChapterByPosition(data: BookData, role: NullChapterRole): BookChapter | undefined {
  const firstNumberedIdx = data.chapters.findIndex((c) => c.chapter_number !== null);
  let lastNumberedIdx = -1;
  for (let i = data.chapters.length - 1; i >= 0; i--) {
    if (data.chapters[i].chapter_number !== null) { lastNumberedIdx = i; break; }
  }

  const group = (
    role.group === "front"
      ? data.chapters.slice(0, firstNumberedIdx === -1 ? data.chapters.length : firstNumberedIdx)
      : data.chapters.slice(lastNumberedIdx + 1)
  ).filter((c) => c.chapter_number === null);

  if (group.length === 0) return undefined;
  return role.position === "first" ? group[0] : group[group.length - 1];
}

function findChapter(
  data: BookData,
  locale: string,
  chapterNumber: number | null,
  nullChapterRole: NullChapterRole | null
): BookChapter | undefined {
  if (chapterNumber !== null) {
    const mapped = resolveChapterNumber(locale, chapterNumber);
    return data.chapters.find((c) => c.chapter_number === mapped);
  }
  return nullChapterRole ? findNullChapterByPosition(data, nullChapterRole) : undefined;
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

function readerProgressKey(bookLocale: string, chapterNumber: number | null, chapterTitle: string) {
  return `gc_rp_${bookLocale}_${chapterNumber ?? chapterTitle.replace(/\W+/g, "_").slice(0, 25)}`;
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

// ── Reading-language preference (independent of the site UI locale) ──────────

const BOOK_LOCALE_KEY = "gc_book_locale";

function loadPreferredBookLocale(): string | null {
  if (typeof window === "undefined") return null;
  try { return localStorage.getItem(BOOK_LOCALE_KEY); } catch { return null; }
}

function savePreferredBookLocale(bookLocale: string) {
  try { localStorage.setItem(BOOK_LOCALE_KEY, bookLocale); } catch { /* noop */ }
}

// ── Cross-language position mapping ───────────────────────────────────────────
// Pages are paginated by character count, and translations have very
// different lengths, so "page 5" in English and "page 5" in Portuguese are
// not the same content. Instead we track *where in the chapter* (as a 0–1
// fraction of its total characters) the reader currently is, and re-derive
// the matching page once the new language's content has loaded.

function pageCharLength(page: string[]): number {
  return page.reduce((sum, p) => sum + p.length, 0);
}

function totalParagraphChars(paragraphs: string[]): number {
  return paragraphs.reduce((sum, p) => sum + p.length, 0);
}

function charOffsetBeforePage(pages: string[][], pageIndex: number): number {
  let sum = 0;
  for (let i = 0; i < pageIndex; i++) sum += pageCharLength(pages[i]);
  return sum;
}

function pageForFraction(pages: string[][], fraction: number): number {
  const total = pages.reduce((sum, p) => sum + pageCharLength(p), 0);
  if (total === 0 || pages.length === 0) return 0;
  const target = fraction * total;
  let cumulative = 0;
  for (let i = 0; i < pages.length; i++) {
    cumulative += pageCharLength(pages[i]);
    if (cumulative >= target) return i;
  }
  return pages.length - 1;
}

// ── Immersive Reader ──────────────────────────────────────────────────────────

const BOOK_LANGUAGE_OPTIONS = languages.filter((l) => l.routeLocale in LOCALE_TO_BOOK_FILE);

// The reader's language switcher reuses the same <SelectLanguage> widget as
// the download picker (BookLanguageContainer) instead of a bespoke dropdown,
// so "pick a language" looks and behaves the same everywhere on the site.
// SelectLanguage speaks in languagesList's { label, value: englishName }
// shape rather than route-locale codes, so these bridge the two.
function routeLocaleToLanguageObj(routeLocale: string): LanguageObj {
  const name = BOOK_LANGUAGE_OPTIONS.find((l) => l.routeLocale === routeLocale)?.name ?? "English";
  return languagesList.find((l) => l.value === name) ?? { label: "English", value: "English" };
}

function languageObjToRouteLocale(lang: LanguageObj): string {
  return BOOK_LANGUAGE_OPTIONS.find((l) => l.name === lang.value)?.routeLocale ?? "en";
}

function ImmersiveReader({
  chapterNumber, chapterTitle, nullChapterRole, locale, onClose, onComplete,
}: {
  chapterNumber: number | null;
  chapterTitle: string;
  nullChapterRole: NullChapterRole | null;
  /** Site UI locale — used as the default reading language until the reader overrides it. */
  locale: string;
  onClose: () => void;
  onComplete: () => void;
}) {
  const t = useTranslations("reading-plan");
  // Reading language is independent of the site UI locale so readers can
  // switch the book's language without changing the whole app.
  const [bookLocale, setBookLocale] = useState(() => loadPreferredBookLocale() ?? locale);
  const [paragraphs, setParagraphs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [englishFallback, setEnglishFallback] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [resumedFrom, setResumedFrom] = useState<number | null>(null);
  const readAloud = useReadAloud();
  const contentRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  // Set right before switching languages: the 0–1 fraction of the chapter
  // the reader was at, so the next load can jump to the equivalent spot.
  const fractionOverrideRef = useRef<number | null>(null);

  const progressKey = readerProgressKey(bookLocale, chapterNumber, chapterTitle);
  const pages = useMemo(() => buildPages(paragraphs), [paragraphs]);
  const safePage = Math.min(currentPage, Math.max(0, pages.length - 1));
  const isLastPage = safePage === pages.length - 1 && pages.length > 0;
  const currentPageParas = useMemo(() => pages[safePage] ?? [], [pages, safePage]);
  const currentPageText = useMemo(() => currentPageParas.join("\n\n"), [currentPageParas]);
  const paraOffsets = useMemo(
    () => currentPageParas.map((_, i) =>
      currentPageParas.slice(0, i).reduce((sum, p) => sum + p.length + 2, 0)
    ),
    [currentPageParas]
  );

  // Load chapter + restore saved page
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadError(false);
    setEnglishFallback(false);

    (async () => {
      try {
        const data = await getBookData(bookLocale);
        let ch = findChapter(data, bookLocale, chapterNumber, nullChapterRole);
        let usedEnglish = false;

        // Structural gap in this locale's book (e.g. no Appendix chapter,
        // or fewer front-matter sections than the plan expects) — fall back
        // to the English edition rather than showing an error.
        if (!ch && bookLocale !== "en") {
          const enData = await getBookData("en");
          ch = findChapter(enData, "en", chapterNumber, nullChapterRole);
          usedEnglish = true;
        }

        if (cancelled) return;
        if (ch) {
          const newParagraphs = parseContent(ch.content);
          setParagraphs(newParagraphs);
          setEnglishFallback(usedEnglish);

          const fraction = fractionOverrideRef.current;
          fractionOverrideRef.current = null;
          if (fraction !== null) {
            // Explicit language switch — resume at the equivalent position
            // in the new language rather than any page saved for it before.
            const target = pageForFraction(buildPages(newParagraphs), fraction);
            setCurrentPage(target);
            saveReaderPage(progressKey, target);
            setResumedFrom(target > 0 ? target : null);
          } else {
            const saved = loadReaderPage(progressKey);
            setCurrentPage(saved);
            setResumedFrom(saved > 0 ? saved : null);
          }
        } else {
          setLoadError(true);
        }
        setLoading(false);
      } catch {
        if (cancelled) return;
        setLoadError(true);
        setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [chapterNumber, chapterTitle, nullChapterRole, bookLocale, progressKey, reloadToken]);

  // Save progress on page change
  useEffect(() => {
    if (!loading && !loadError && pages.length > 0) saveReaderPage(progressKey, safePage);
  }, [safePage, loading, loadError, pages.length, progressKey]);

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

  function switchBookLocale(newLocale: string) {
    if (newLocale === bookLocale) return;
    const fraction = totalParagraphChars(paragraphs) > 0
      ? Math.min(1, charOffsetBeforePage(pages, safePage) / totalParagraphChars(paragraphs))
      : 0;
    fractionOverrideRef.current = fraction;
    readAloud.stop();
    savePreferredBookLocale(newLocale);
    setBookLocale(newLocale);
  }

  const selectedLanguageObj = routeLocaleToLanguageObj(bookLocale);

  function handleSelectLanguage(update: SetStateAction<LanguageObj>) {
    const resolved = typeof update === "function" ? update(selectedLanguageObj) : update;
    switchBookLocale(languageObjToRouteLocale(resolved));
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#F6F2EB]">

      {/* Header */}
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-y-2 border-b border-black/10 bg-[#F6F2EB] px-5 py-3">
        <div className="min-w-0">
          <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-black/30">{t("book-label")}</p>
          <p className="mt-0.5 max-w-[220px] truncate text-xs font-semibold text-black/55 sm:max-w-sm">{chapterTitle}</p>
        </div>
        <div className="flex items-center gap-2">
          {!loading && !loadError && pages.length > 0 && (
            <span className="mr-2 text-[10px] tabular-nums text-black/35">{safePage + 1}&nbsp;/&nbsp;{pages.length}</span>
          )}

          {/* Reading-language switcher — same <SelectLanguage> widget used
              for the book-download language picker, so choosing a language
              looks and works the same everywhere on the site. */}
          <SelectLanguage selectedLanguage={selectedLanguageObj} setSelectedLanguage={handleSelectLanguage} />

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

      {/* English-fallback notice */}
      {!loading && !loadError && englishFallback && (
        <div className="shrink-0 border-b border-black/[0.08] bg-black/[0.03] px-5 py-2">
          <p className="text-[11px] text-black/45">{t("chapter-english-fallback")}</p>
        </div>
      )}

      {/* TTS player */}
      {!loading && !loadError && pages.length > 0 && (
        <div className="shrink-0 border-b border-black/[0.08] bg-[#F6F2EB] px-5 py-2.5">
          <ReadAloudPlayer text={currentPageText} lang={bookLocale} readAloud={readAloud} />
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
        ) : loadError ? (
          <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
            <p className="max-w-xs text-sm text-black/50">{t("chapter-unavailable-offline")}</p>
            <button
              onClick={() => setReloadToken((n) => n + 1)}
              className="rounded-xl border border-black/15 px-4 py-2 text-xs font-semibold text-black/70 transition hover:border-[#4fa6c2]/50 hover:text-[#4fa6c2]"
            >
              {t("retry")}
            </button>
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
      {!loading && !loadError && pages.length > 0 && (
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
                    setVideoTitle(t("watch-chapter-preview"));
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
                    <p className="text-xs font-semibold text-primary">{t("watch-chapter-preview")}</p>
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
                      <p className="text-xs font-semibold text-primary">{t("read-the-chapter")}</p>
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
                      nullChapterRole={getNullChapterRole(planId, day.day)}
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
  const plan = getLocalizedPlan(locale, planId);
  if (!plan) notFound();

  const {
    isLoggedIn,
    getPlanEntry,
    getEnrollment,
    startPlan,
    markDayComplete,
    savePlan,
    awardPlanXp,
  } = useProgress();

  const dbEnrollment = getEnrollment(planId);
  const lsEntry = getPlanEntry(planId);

  const [showAuth, setShowAuth] = useState(false);
  const [authVariant, setAuthVariant] = useState<"default" | "save-progress">("default");
  const [focusDay, setFocusDay] = useState<number | null>(null);

  // Preload this locale's book content (and persist it for offline reading)
  // as soon as the plan page opens, so the reader has no wait on first click.
  // Also preload the reader's last-picked language, if different, so a
  // returning reader who switched languages doesn't wait on that either.
  useEffect(() => {
    prefetchBookData(locale);
    const preferred = loadPreferredBookLocale();
    if (preferred && preferred !== locale) prefetchBookData(preferred);
  }, [locale]);

  const completedDays: number[] = isLoggedIn
    ? (dbEnrollment?.completed_days ?? [])
    : (lsEntry?.completedDays ?? []);
  const isStarted   = isLoggedIn ? !!dbEnrollment          : !!lsEntry;
  const isCompleted = isLoggedIn ? !!dbEnrollment?.completed_at : !!lsEntry?.completedAt;
  const isSaved     = dbEnrollment?.is_saved ?? false;

  const totalDays   = plan.daily_breakdown_standard.length;
  const progressPct = totalDays > 0 ? Math.round((completedDays.length / totalDays) * 100) : 0;
  const upNextDay   = completedDays.length < totalDays ? completedDays.length + 1 : null;
  const nextPlan    = plan.next_plan ? getLocalizedPlan(locale, plan.next_plan) : null;
  const t = useTranslations("reading-plan");

  function handleStart() {
    startPlan(planId);
    setFocusDay(1);
    track("readingPlan_start", { planId });
  }

  function handleMarkComplete(day: number) {
    const willFinishPlan =
      !completedDays.includes(day) &&
      completedDays.length + 1 >= totalDays &&
      !isCompleted;

    markDayComplete(planId, day, totalDays);

    if (willFinishPlan) {
      awardPlanXp(planId);
      // Anonymous users finishing a plan lose their progress if they never sign in —
      // prompt them right away, while the win is fresh, explaining why it matters.
      if (!isLoggedIn) {
        setAuthVariant("save-progress");
        setShowAuth(true);
      }
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

        {isLoggedIn && (
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
            {!isLoggedIn && (
              <button onClick={() => { setAuthVariant("default"); setShowAuth(true); }}
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
              <p className="text-sm font-semibold text-primary">
                {t("all-plans-completed", { book: t("book-label") })}
              </p>
            )}
          </div>
        )}

        {!isCompleted && nextPlan && (
          <p className="mt-8 text-center text-xs text-primary/40">
            {t("next-plan-teaser", { title: nextPlan.title })}
          </p>
        )}
      </div>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} variant={authVariant} />}
    </div>
  );
}
