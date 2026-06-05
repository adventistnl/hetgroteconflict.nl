"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { MdKeyboardArrowDown as ArrowIcon } from "react-icons/md";
import { useTranslations } from "next-intl";
import {
  languages,
  isoToFlagCode,
  flagCodeToEmoji,
  isoToBookCoverExtension,
  routeLocaleToFlagCode,
} from "@/config/languages";
import { getVideoEmbedUrl } from "@/utils/get-video-embed-url";
import { downloadList } from "@/utils/download-list";
import { track } from "@vercel/analytics";

export interface ChapterData {
  chapterNumber: string;
  title: string;
  description: string;
  videoUrl: string;
  videoCover: string;
}

interface LanguageInfo {
  name: string;
  code: string;
  cover: string;
  pdfUrl?: string;
  epubUrl?: string;
  audioUrl?: string;
  videoUrl?: string;
}

const globalLanguages: LanguageInfo[] = languages.map((lang) => {
  const flagCode = isoToFlagCode[lang.isoCode] || lang.isoCode.toLowerCase();
  const extension = isoToBookCoverExtension[lang.isoCode] ?? "webp";
  return {
    name: lang.name,
    code: flagCode,
    cover: `/book-covers/${lang.name.toLowerCase()}.${extension}`,
    pdfUrl: downloadList.pdf[lang.name] || "",
    epubUrl: downloadList.epub[lang.name] || "",
    audioUrl: downloadList.audio[lang.name] || "",
  };
});

interface PageHeroProps {
  variant: "study-guide" | "chapter";
  chapter: ChapterData;
  locale: string;
  /** study-guide only: whether user has watched chapters before */
  hasProgress?: boolean;
  /** study-guide only: pre-computed looping background video URL */
  bgVideoUrl?: string;
}

export function PageHero({
  variant,
  chapter,
  locale,
  hasProgress = false,
  bgVideoUrl,
}: PageHeroProps) {
  const tStudy = useTranslations("study-guide");
  const tChapter = useTranslations("chapter-page");

  const flagCode = routeLocaleToFlagCode[locale.toLowerCase()] || locale.toLowerCase();
  const defaultLanguage =
    globalLanguages.find((lang) => lang.code.toLowerCase() === flagCode) ||
    globalLanguages.find((lang) => lang.code === "nl") ||
    globalLanguages[0];

  const [showVideo, setShowVideo] = useState(false);
  const [heroLanguage, setHeroLanguage] = useState<LanguageInfo>(defaultLanguage);
  const [openLangDropdown, setOpenLangDropdown] = useState(false);
  const [openFormatDropdown, setOpenFormatDropdown] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const formatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node))
        setOpenLangDropdown(false);
      if (formatRef.current && !formatRef.current.contains(event.target as Node))
        setOpenFormatDropdown(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowVideo(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const isChapter = variant === "chapter";
  const hasFormats = (lang: LanguageInfo) =>
    !!(lang.pdfUrl || lang.epubUrl || lang.audioUrl);
  const videoLink =
    (isChapter ? heroLanguage.videoUrl : undefined) || chapter.videoUrl || "";
  const isYouTube =
    videoLink.includes("youtube.com") || videoLink.includes("youtu.be");
  const isVimeo = videoLink.includes("vimeo.com");

  return (
    <>
      <section className="relative flex min-h-[520px] w-full items-center bg-[#1e1e2e] lg:min-h-[600px]">
        {/* ── Background ── */}
        {bgVideoUrl ? (
          <>
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <iframe
                src={bgVideoUrl}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: "max(100%, calc(100vh * 16 / 9))",
                  height: "max(100%, calc(100vw * 9 / 16))",
                  transform: "translate(-50%, -50%)",
                }}
                allow="autoplay; encrypted-media"
                title="background video"
              />
            </div>
            <div className="absolute inset-0 bg-black/65" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/10" />
          </>
        ) : (
          <>
            <div className="pointer-events-none absolute inset-0">
              <Image
                src={chapter.videoCover || "/video-cover.svg"}
                alt={chapter.title}
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-[#262633]/90 via-[#1a1a2e]/75 to-[#262633]/60" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          </>
        )}

        {/* ── Content ── */}
        <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center gap-10 px-6 py-20 pt-36 lg:flex-row lg:items-center lg:gap-16 lg:py-24 lg:pt-40">
          {/* Left column */}
          <div className="flex flex-1 flex-col gap-5 text-center lg:text-left">
            {/* Badge — study-guide only */}
            {!isChapter && (
              <span
                className="mx-auto w-fit rounded-full border border-white/20 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-white/60 lg:mx-0"
                style={{ fontFamily: "var(--font-rubik)" }}
              >
                {tStudy("badge")}
              </span>
            )}

            {/* Chapter label */}
            <p
              className="text-xs font-semibold uppercase tracking-widest text-[#4fa6c2]"
              style={{ fontFamily: "var(--font-rubik)" }}
            >
              {!isChapter && hasProgress
                ? tStudy("continueLabel")
                : isChapter
                ? tChapter("chapter")
                : tStudy("chapter")}{" "}
              {chapter.chapterNumber}
            </p>

            {/* Title */}
            <h1
              className="max-w-xl text-3xl font-bold text-white md:text-4xl lg:text-5xl"
              style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}
            >
              {chapter.title}
            </h1>

            {/* Description */}
            <p
              className="line-clamp-2 max-w-md text-sm leading-relaxed text-gray-300 lg:text-base"
              style={{ fontFamily: "var(--font-rubik)" }}
            >
              {chapter.description}
            </p>

            {/* Study-guide: CTA button */}
            {!isChapter && (
              <div className="flex flex-row flex-wrap justify-center gap-3 lg:justify-start">
                <Link
                  href={`/${locale}/guide/chapter/${chapter.chapterNumber}`}
                  onClick={() =>
                    track(
                      hasProgress ? "studyGuide_heroContinue" : "studyGuide_heroStart",
                      { chapter: chapter.chapterNumber }
                    )
                  }
                  className="inline-flex items-center gap-2 rounded-full bg-[#4fa6c2] px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-[#3d91ad] hover:shadow-[#4fa6c2]/30"
                  style={{ fontFamily: "var(--font-rubik)" }}
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  {hasProgress ? tStudy("continueButton") : tStudy("startButton")}
                </Link>
              </div>
            )}

            {/* Chapter: download controls */}
            {isChapter && (
              <div className="flex flex-col gap-4 mt-2 max-w-[500px]">
                {/* Language selector */}
                <div className="relative flex flex-row items-center gap-3" ref={langRef}>
                  <span className="min-w-[75px] text-sm text-gray-300 font-rubik">
                    {tChapter("language")}
                  </span>
                  <button
                    onClick={() => setOpenLangDropdown(!openLangDropdown)}
                    className="flex flex-row items-center justify-between gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-white/15"
                  >
                    {flagCodeToEmoji[heroLanguage.code.toLowerCase()]}
                    <span>{heroLanguage.name}</span>
                    <ArrowIcon className="text-lg text-white" />
                  </button>
                  {openLangDropdown && (
                    <div className="absolute left-[85px] top-11 z-[60] flex max-h-[220px] w-[180px] flex-col gap-1 overflow-y-auto rounded-xl border border-white/10 bg-[#2a2a38] p-1.5 shadow-2xl">
                      {globalLanguages.map((lang, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setHeroLanguage(lang);
                            setOpenLangDropdown(false);
                          }}
                          className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-white/10 ${
                            heroLanguage.name === lang.name
                              ? "bg-[#CCF0FF] font-semibold text-[#123644]"
                              : "text-white"
                          }`}
                        >
                          {flagCodeToEmoji[lang.code.toLowerCase()]}
                          <span>{lang.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Format pills */}
                <div className="flex flex-row items-center gap-3">
                  <span className="min-w-[75px] text-sm text-gray-300 font-rubik">
                    {tChapter("available")}
                  </span>
                  <div className="flex flex-row flex-wrap gap-2">
                    {heroLanguage.pdfUrl && (
                      <Link
                        href={heroLanguage.pdfUrl}
                        target="_blank"
                        className="rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#CCF0FF] hover:text-[#123644]"
                      >
                        PDF
                      </Link>
                    )}
                    {heroLanguage.epubUrl && (
                      <Link
                        href={heroLanguage.epubUrl}
                        target="_blank"
                        className="rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#CCF0FF] hover:text-[#123644]"
                      >
                        ePub
                      </Link>
                    )}
                    {heroLanguage.audioUrl && (
                      <Link
                        href={heroLanguage.audioUrl}
                        target="_blank"
                        className="rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#CCF0FF] hover:text-[#123644]"
                      >
                        Audio
                      </Link>
                    )}
                    {!hasFormats(heroLanguage) && (
                      <span className="text-xs font-medium text-gray-400">
                        {tChapter("no-files")}
                      </span>
                    )}
                  </div>
                </div>

                {/* Download dropdown */}
                {hasFormats(heroLanguage) && (
                  <div className="relative" ref={formatRef}>
                    <button
                      onClick={() => setOpenFormatDropdown(!openFormatDropdown)}
                      className="flex w-full max-w-[200px] flex-row items-center justify-between gap-3 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-white/20"
                    >
                      {tChapter("download")}
                      <ArrowIcon className="text-xl" />
                    </button>
                    {openFormatDropdown && (
                      <div className="absolute left-0 top-12 z-[60] flex w-[200px] flex-col gap-1 rounded-xl border border-gray-200 bg-white p-1.5 shadow-2xl">
                        {heroLanguage.pdfUrl && (
                          <Link
                            href={heroLanguage.pdfUrl}
                            target="_blank"
                            className="w-full rounded-lg px-4 py-2 text-left text-sm font-medium text-[#123644] transition-colors hover:bg-[#CCF0FF]/30"
                            onClick={() => setOpenFormatDropdown(false)}
                          >
                            {tChapter("download-pdf")}
                          </Link>
                        )}
                        {heroLanguage.epubUrl && (
                          <Link
                            href={heroLanguage.epubUrl}
                            target="_blank"
                            className="w-full rounded-lg px-4 py-2 text-left text-sm font-medium text-[#123644] transition-colors hover:bg-[#CCF0FF]/30"
                            onClick={() => setOpenFormatDropdown(false)}
                          >
                            {tChapter("download-epub")}
                          </Link>
                        )}
                        {heroLanguage.audioUrl && (
                          <Link
                            href={heroLanguage.audioUrl}
                            target="_blank"
                            className="w-full rounded-lg px-4 py-2 text-left text-sm font-medium text-[#123644] transition-colors hover:bg-[#CCF0FF]/30"
                            onClick={() => setOpenFormatDropdown(false)}
                          >
                            {tChapter("download-audio")}
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right column: animated play button — both variants */}
          <div className="flex flex-shrink-0 items-center justify-center">
            <button
              onClick={() => {
                setShowVideo(true);
                track(isChapter ? "chapter_heroPlay" : "studyGuide_heroPlay", {
                  chapter: chapter.chapterNumber,
                });
              }}
              className="group relative flex h-24 w-24 items-center justify-center rounded-full border-2 border-white/30 bg-white/10 shadow-2xl backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:border-[#4fa6c2] hover:bg-[#4fa6c2]/20 lg:h-28 lg:w-28"
              aria-label={isChapter ? tChapter("watch-now") : tStudy("watchButton")}
            >
              <span className="absolute inset-0 animate-ping rounded-full bg-white/10" />
              <svg
                className="relative ml-1 h-10 w-10 fill-current text-white lg:h-12 lg:w-12"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* ── Video Modal ── */}
      {showVideo && (
        <div
          onClick={() => setShowVideo(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative flex w-full max-w-[850px] flex-col overflow-hidden rounded-2xl border border-gray-800 bg-[#1e1e24] shadow-2xl"
          >
            <div className="aspect-video w-full">
              <iframe
                key={isChapter ? heroLanguage.code : locale}
                src={getVideoEmbedUrl(
                  videoLink,
                  isChapter ? heroLanguage.code : locale
                )}
                className="h-full w-full"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                title={chapter.title}
              />
            </div>
            <div className="flex flex-col items-center justify-between gap-3 border-t border-white/5 bg-[#141419] px-6 py-4 sm:flex-row">
              <span className="text-sm font-medium text-gray-300">
                {isChapter ? tChapter("chapter") : tStudy("chapter")}{" "}
                {chapter.chapterNumber}: {chapter.title}
              </span>
              {isYouTube && (
                <a
                  href={videoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-full bg-red-600 px-4 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:bg-red-700"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                  {tChapter("watch-youtube")}
                </a>
              )}
              {isVimeo && (
                <a
                  href={videoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-full bg-sky-600 px-4 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:bg-sky-700"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M22.396 7.117c-.074 1.614-1.199 3.822-3.375 6.626-2.257 2.915-4.17 4.372-5.744 4.372-1.012 0-1.85-.925-2.52-2.775L8.71 7.747c-.503-1.834-.997-2.751-1.48-2.751-.112 0-.503.236-1.171.71l-.707-.887c.725-.634 1.543-1.277 2.454-1.922 1.263-1.07 2.179-1.625 2.75-1.666 1.34-.094 2.167.822 2.483 2.75.342 2.083.58 3.375.714 3.882.385 1.53.791 2.296 1.217 2.296.326 0 .825-.506 1.498-1.517.674-1.012 1.037-1.782 1.09-2.31.112-.996-.264-1.492-1.13-1.492-.416 0-.895.093-1.442.28 1.055-3.447 3.076-5.112 6.062-4.996 2.2.083 3.256 1.503 3.176 4.26z" />
                  </svg>
                  {tChapter("watch-vimeo")}
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
