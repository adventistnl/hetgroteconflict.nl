"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { track } from "@vercel/analytics";

interface Props {
  chapterNumber: string;
  title: string;
  description: string;
  videoCover: string;
  locale: string;
  isVisited: boolean;
  isLast: boolean;
}

export function StudyGuideChapterCard({
  chapterNumber,
  title,
  description,
  videoCover,
  locale,
  isVisited,
  isLast,
}: Props) {
  const t = useTranslations("study-guide");

  return (
    <Link
      href={`/${locale}/guide/chapter/${chapterNumber}`}
      onClick={() => track("studyGuide_chapterClick", { chapter: chapterNumber })}
      className="group flex flex-col gap-4 text-primary transition-all duration-500 hover:scale-105"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden rounded-xl">
        <Image
          src={videoCover}
          alt={`Chapter ${chapterNumber} thumbnail`}
          fill
          className="cursor-pointer object-cover transition-all duration-500 ease-in-out"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Play overlay */}
        <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4fa6c2]">
            <svg className="ml-0.5 h-4 w-4 fill-current text-white" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        {/* Progress badges */}
        {isLast && (
          <span className="absolute left-3 top-3 rounded-full bg-[#4fa6c2] px-3 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
            {t("lastWatched")}
          </span>
        )}
        {isVisited && !isLast && (
          <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-black/50 px-3 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
            {t("watched")}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1.5">
        <span
          className="text-xs font-semibold uppercase tracking-widest text-[#4fa6c2]"
          style={{ fontFamily: "var(--font-rubik)" }}
        >
          {t("chapter")} {chapterNumber}
        </span>
        <p className="line-clamp-2 text-sm font-semibold leading-snug">{title}</p>
        <p
          className="mt-0.5 line-clamp-2 text-xs text-primary/50"
          style={{ fontFamily: "var(--font-rubik)" }}
        >
          {description}
        </p>
      </div>

      {/* Watch button */}
      <span className="inline-flex items-center justify-center rounded-full border border-primary/30 bg-primary/5 px-4 py-2 text-xs font-semibold transition-colors group-hover:bg-primary/15">
        {t("watchButton")} →
      </span>
    </Link>
  );
}
