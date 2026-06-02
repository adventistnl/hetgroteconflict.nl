"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { TalkToUsContainer } from "./talk-to-us-container";
import { Footer } from "../molecules/footer";
import TalkToUsFormData from "@/app/interfaces/talk-to-us-form-data";
import { MdKeyboardArrowDown as ArrowIcon } from "react-icons/md";

import { CompaniesContainer } from "../molecules/companies-container";
import { getVideoEmbedUrl } from "@/utils/get-video-embed-url";
import { downloadList } from "@/utils/download-list";
import { useLocale } from "next-intl";
import {
  languages,
  isoToFlagCode,
  flagCodeToEmoji,
  isoToBookCoverExtension,
  routeLocaleToFlagCode,
} from "@/config/languages";

interface LanguageInfo {
  name: string;
  code: string;
  cover: string;
  pdfUrl?: string;
  epubUrl?: string;
  audioUrl?: string;
  videoUrl?: string;
}

interface ChapterData {
  chapterNumber: string;
  title: string;
  description: string;
  videoUrl: string;
  videoCover: string;
}

interface Props {
  chapter: ChapterData;
  talkToUsFunctions: (formData: TalkToUsFormData) => Promise<null>;
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

export const ChapterPageContainer = ({ chapter, talkToUsFunctions }: Props) => {
  const locale = useLocale();

  const flagCode = routeLocaleToFlagCode[locale.toLowerCase()] || locale.toLowerCase();
  const defaultLanguage = globalLanguages.find(
    (lang) => lang.code.toLowerCase() === flagCode
  ) || globalLanguages.find((lang) => lang.code === "nl") || globalLanguages[0];

  const [showVideo, setShowVideo] = useState(false);
  const [heroLanguage, setHeroLanguage] = useState<LanguageInfo>(defaultLanguage);
  const [openHeroLangDropdown, setOpenHeroLangDropdown] = useState(false);
  const [openHeroFormatDropdown, setOpenHeroFormatDropdown] = useState(false);
  const heroLangRef = useRef<HTMLDivElement>(null);
  const heroFormatRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (heroLangRef.current && !heroLangRef.current.contains(event.target as Node)) {
        setOpenHeroLangDropdown(false);
      }
      if (heroFormatRef.current && !heroFormatRef.current.contains(event.target as Node)) {
        setOpenHeroFormatDropdown(false);
      }

    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.key === "Backspace") {
        setShowVideo(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const hasFormats = (lang: LanguageInfo) => {
    return !!(lang.pdfUrl || lang.epubUrl || lang.audioUrl);
  };

  const videoLink = heroLanguage.videoUrl || chapter.videoUrl || "";
  const isYouTube = videoLink.includes("youtube.com") || videoLink.includes("youtu.be");
  const isVimeo = videoLink.includes("vimeo.com");

  return (
    <div className="flex w-full flex-col items-center">
      {/* 1. Hero & Video Section (Matches Figma Split Layout) */}
      <section className="relative flex w-full flex-col lg:flex-row items-stretch bg-[#262633]">
        {/* Left Side: Chapter Information & Book Download Controls */}
        <div className="z-10 flex flex-col justify-center gap-6 w-full lg:w-1/2 text-white px-6 py-12 pt-[120px] lg:py-20 lg:pt-[140px] lg:pl-16 lg:pr-12 xl:pl-24 xl:pr-16">
          <span
            className="text-[18px] font-normal"
            style={{
              fontFamily: "var(--font-rubik)",
              lineHeight: "150%",
            }}
          >
            Chapter {chapter.chapterNumber}
          </span>
          <h1
            className="text-4xl font-bold leading-tight font-plus-jakarta-sans text-white md:text-5xl lg:text-6xl"
          >
            {chapter.title}
          </h1>
          <p
            className="text-base leading-relaxed text-gray-300 font-rubik max-w-[600px]"
          >
            {chapter.description}
          </p>

          {/* Download & Language Controls */}
          <div className="flex flex-col gap-5 mt-6 max-w-[500px]">
            {/* Language Selection Row */}
            <div className="flex flex-row items-center gap-3 relative" ref={heroLangRef}>
              <span className="text-sm text-gray-300 font-rubik min-w-[75px]">Language:</span>
              <button
                onClick={() => setOpenHeroLangDropdown(!openHeroLangDropdown)}
                className="flex flex-row items-center justify-between gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/5 text-sm font-medium hover:bg-white/15 transition-colors text-white"
              >
                {flagCodeToEmoji[heroLanguage.code.toLowerCase()]}
                <span>
                  {heroLanguage.name}
                </span>
                <ArrowIcon className="text-white text-lg" />
              </button>

              {/* Language Selector Dropdown */}
              {openHeroLangDropdown && (
                <div className="absolute top-11 left-[85px] z-20 w-[180px] max-h-[220px] overflow-y-auto rounded-xl bg-[#2a2a38] border border-white/10 shadow-2xl p-1.5 flex flex-col gap-1">
                  {globalLanguages.map((lang, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setHeroLanguage(lang);
                        setOpenHeroLangDropdown(false);
                      }}
                      className={`flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg text-sm transition-colors hover:bg-white/10 ${heroLanguage.name === lang.name ? "bg-[#CCF0FF] text-[#123644] font-semibold" : "text-white"
                        }`}
                    >
                      {flagCodeToEmoji[lang.code.toLowerCase()]}
                      <span>
                        {lang.name}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Available Formats Row */}
            <div className="flex flex-row items-center gap-3">
              <span className="text-sm text-gray-300 font-rubik min-w-[75px]">Available:</span>
              <div className="flex flex-row flex-wrap items-center gap-2">
                {heroLanguage.pdfUrl && (
                  <Link
                    href={heroLanguage.pdfUrl}
                    target="_blank"
                    className="px-3.5 py-1.5 text-xs font-semibold rounded-full bg-white/10 text-white hover:bg-[#CCF0FF] hover:text-[#123644] transition-colors"
                  >
                    PDF
                  </Link>
                )}
                {heroLanguage.epubUrl && (
                  <Link
                    href={heroLanguage.epubUrl}
                    target="_blank"
                    className="px-3.5 py-1.5 text-xs font-semibold rounded-full bg-white/10 text-white hover:bg-[#CCF0FF] hover:text-[#123644] transition-colors"
                  >
                    ePub
                  </Link>
                )}
                {heroLanguage.audioUrl && (
                  <Link
                    href={heroLanguage.audioUrl}
                    target="_blank"
                    className="px-3.5 py-1.5 text-xs font-semibold rounded-full bg-white/10 text-white hover:bg-[#CCF0FF] hover:text-[#123644] transition-colors"
                  >
                    Audio
                  </Link>
                )}
                {!hasFormats(heroLanguage) && (
                  <span className="text-xs text-gray-400 font-medium">No files available</span>
                )}
              </div>
            </div>

            {/* Main Download Button Dropdown */}
            {hasFormats(heroLanguage) && (
              <div className="relative mt-2" ref={heroFormatRef}>
                <button
                  onClick={() => setOpenHeroFormatDropdown(!openHeroFormatDropdown)}
                  className="flex flex-row items-center justify-between gap-3 px-6 py-3 rounded-full bg-white/10 border border-white/20 text-white font-bold text-sm hover:bg-white/20 transition-all w-full max-w-[200px]"
                >
                  Download
                  <ArrowIcon className="text-xl" />
                </button>

                {openHeroFormatDropdown && (
                  <div className="absolute top-12 left-0 z-20 w-[200px] rounded-xl bg-white border border-gray-200 shadow-2xl p-1.5 flex flex-col gap-1">
                    {heroLanguage.pdfUrl && (
                      <Link
                        href={heroLanguage.pdfUrl}
                        target="_blank"
                        className="w-full text-left px-4 py-2 rounded-lg text-sm text-[#123644] hover:bg-[#CCF0FF]/30 transition-colors font-medium"
                        onClick={() => setOpenHeroFormatDropdown(false)}
                      >
                        Download PDF
                      </Link>
                    )}
                    {heroLanguage.epubUrl && (
                      <Link
                        href={heroLanguage.epubUrl}
                        target="_blank"
                        className="w-full text-left px-4 py-2 rounded-lg text-sm text-[#123644] hover:bg-[#CCF0FF]/30 transition-colors font-medium"
                        onClick={() => setOpenHeroFormatDropdown(false)}
                      >
                        Download ePub
                      </Link>
                    )}
                    {heroLanguage.audioUrl && (
                      <Link
                        href={heroLanguage.audioUrl}
                        target="_blank"
                        className="w-full text-left px-4 py-2 rounded-lg text-sm text-[#123644] hover:bg-[#CCF0FF]/30 transition-colors font-medium"
                        onClick={() => setOpenHeroFormatDropdown(false)}
                      >
                        Download Audio
                      </Link>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Video Thumbnail & Play Button (Figma Style) */}
        <div
          onClick={() => setShowVideo(true)}
          className="relative w-full lg:w-1/2 aspect-video lg:aspect-auto min-h-[300px] lg:min-h-0 bg-black cursor-pointer overflow-hidden group"
        >
          <Image
            src={chapter.videoCover || "/video-cover.svg"}
            alt="Video Cover"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {/* Overlay play button */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/25 group-hover:bg-black/45 transition-colors duration-300">
            <div className="w-16 h-16 rounded-full bg-[#4fa6c2] hover:bg-[#3d91ad] flex items-center justify-center transition-all duration-300 transform group-hover:scale-110 shadow-xl">
              <svg className="w-6 h-6 text-white fill-current ml-1" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <span className="text-sm font-semibold tracking-wider text-white select-none drop-shadow-md">
              Watch now
            </span>
          </div>
        </div>
      </section>

      {/* 3. Video Overlay Modal */}
      {showVideo && (
        <div
          onClick={() => setShowVideo(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative flex flex-col w-full max-w-[850px] rounded-2xl overflow-hidden bg-[#1e1e24] shadow-2xl border border-gray-800"
          >
            {/* Close Button */}
            <button
              onClick={() => setShowVideo(false)}
              className="absolute top-3 right-3 z-30 p-2 rounded-full bg-black/60 text-white hover:bg-black/85 hover:scale-105 active:scale-95 transition-all"
              aria-label="Close video player"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="w-full aspect-video">
              <iframe
                key={heroLanguage.code}
                title="video-player"
                src={getVideoEmbedUrl(videoLink, heroLanguage.code)}
                className="w-full h-full"
                allowFullScreen
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              />
            </div>

            {/* Direct watch bar below video */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 bg-[#141419] border-t border-white/5">
              <span className="text-sm font-medium text-gray-300">
                Chapter {chapter.chapterNumber}: {chapter.title}
              </span>

              {isYouTube && (
                <a
                  href={videoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 active:scale-98 transition-all rounded-full shadow-md"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                  Watch on YouTube Playlist
                </a>
              )}

              {isVimeo && (
                <a
                  href={videoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 active:scale-98 transition-all rounded-full shadow-md"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M22.396 7.117c-.074 1.614-1.199 3.822-3.375 6.626-2.257 2.915-4.17 4.372-5.744 4.372-1.012 0-1.85-.925-2.52-2.775L8.71 7.747c-.503-1.834-.997-2.751-1.48-2.751-.112 0-.503.236-1.171.71l-.707-.887c.725-.634 1.543-1.277 2.454-1.922 1.263-1.07 2.179-1.625 2.75-1.666 1.34-.094 2.167.822 2.483 2.75.342 2.083.58 3.375.714 3.882.385 1.53.791 2.296 1.217 2.296.326 0 .825-.506 1.498-1.517.674-1.012 1.037-1.782 1.09-2.31.112-.996-.264-1.492-1.13-1.492-.416 0-.895.093-1.442.28 1.055-3.447 3.076-5.112 6.062-4.996 2.2.083 3.256 1.503 3.176 4.26z" />
                  </svg>
                  Watch on Vimeo
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. Sponsor/Partner logos */}
      <section className="flex w-full flex-col items-center justify-center bg-transparent py-6 opacity-80">
        <CompaniesContainer />
      </section>

      {/* 5. Contact/Talk to Us Section */}
      <section id="talk-to-us" className="w-full bg-[#191919] py-12">
        <TalkToUsContainer talkToUsFunctions={talkToUsFunctions} />
      </section>

      {/* 6. Footer */}
      <section className="w-full bg-transparent">
        <Footer />
      </section>
    </div>
  );
};
