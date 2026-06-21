"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { track } from "@vercel/analytics";

// YouTube background: looping, muted, no controls
const BG_VIDEO_URL =
  "https://www.youtube.com/embed/cAa9ly6SAhU?autoplay=1&mute=1&loop=1&playlist=cAa9ly6SAhU&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1";

const YT_WATCH_URL = "https://www.youtube.com/watch?v=cAa9ly6SAhU";

export function HeroSection() {
  const locale = useLocale();

  return (
    <section className="relative flex min-h-[520px] w-full items-center bg-[#1e1e2e] lg:min-h-[600px]">
      {/* ── Background video iframe ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <iframe
          src={BG_VIDEO_URL}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "max(100%, calc(100vh * 16 / 9))",
            height: "max(100%, calc(100vw * 9 / 16))",
            transform: "translate(-50%, -50%)",
          }}
          allow="autoplay; encrypted-media"
          title="Church background video"
        />
      </div>
      <div className="absolute inset-0 bg-black/65" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/10" />

      {/* ── Content ── */}
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center gap-10 px-6 py-20 pt-36 lg:flex-row lg:items-center lg:gap-16 lg:py-24 lg:pt-40">
        {/* Left column */}
        <div className="flex flex-1 flex-col gap-5 text-center lg:text-left">
          {/* Badge */}
          <span
            className="mx-auto w-fit rounded-full border border-white/20 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-white/60 lg:mx-0"
            style={{ fontFamily: "var(--font-rubik)" }}
          >
            Seventh-day Adventist
          </span>

          {/* Eyebrow */}
          <p
            className="text-xs font-semibold uppercase tracking-widest text-[#4fa6c2]"
            style={{ fontFamily: "var(--font-rubik)" }}
          >
            Find a Church Near You
          </p>

          {/* Title */}
          <h1
            className="max-w-xl text-3xl font-bold text-white md:text-4xl lg:text-5xl"
            style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}
          >
            Find Your Nearest Church
          </h1>

          {/* Description */}
          <p
            className="max-w-md text-sm leading-relaxed text-gray-300 lg:text-base"
            style={{ fontFamily: "var(--font-rubik)" }}
          >
            Discover Seventh-day Adventist communities across the Netherlands —
            allow location access to find the closest one, or explore all churches on the map.
          </p>

          {/* CTAs */}
          <div className="flex flex-row flex-wrap justify-center gap-3 lg:justify-start">
            {/* Primary: scroll down to map */}
            <a
              href="#church-map"
              onClick={() => track("findChurch_heroExplore")}
              className="inline-flex items-center gap-2 rounded-full bg-[#4fa6c2] px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-[#3d91ad] hover:shadow-[#4fa6c2]/30"
              style={{ fontFamily: "var(--font-rubik)" }}
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
              Explore Map
            </a>

            {/* Secondary: go to study guide */}
            <Link
              href={`/${locale}/guide`}
              onClick={() => track("findChurch_heroStudyGuide")}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-white/20"
              style={{ fontFamily: "var(--font-rubik)" }}
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Start Study Guide
            </Link>
          </div>
        </div>

        {/* Right column: play button → opens YouTube */}
        <div className="flex flex-shrink-0 items-center justify-center">
          <a
            href={YT_WATCH_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("findChurch_heroPlay")}
            className="group relative flex h-24 w-24 items-center justify-center rounded-full border-2 border-white/30 bg-white/10 shadow-2xl backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:border-[#4fa6c2] hover:bg-[#4fa6c2]/20 lg:h-28 lg:w-28"
            aria-label="Watch on YouTube"
          >
            <span className="absolute inset-0 animate-ping rounded-full bg-white/10" />
            <svg className="relative ml-1 h-10 w-10 fill-current text-white lg:h-12 lg:w-12" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
