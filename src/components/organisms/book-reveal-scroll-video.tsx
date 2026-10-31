"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { HiOutlineCloudDownload as CloudIcon } from "react-icons/hi";
import { PlayCircle } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { IconAndInfoSection } from "@/components/atoms/icon-and-info-section";
import { BookDownloadContainer } from "@/components/molecules/book-download-container";
import { MagicText } from "@/components/atoms/magic-text";
import { WorldAgeVideoSection } from "./world-age-video-section";
import { track } from "@vercel/analytics";

const FIRST_CHAPTER = "1";

// Extra scroll distance (beyond one viewport height) the section is pinned
// for while the video scrubs from its first to its last frame, opening the
// book.
const SCRUB_VH = 180;

// Extra scroll distance, right after the scrub, during which the World Age
// section slides up to cover this one while the book video scrubs the same
// footage in reverse — closing the book back up in lockstep with how far
// the cover has climbed, in either scroll direction.
const COVER_VH = 100;

const TOTAL_PIN_VH = SCRUB_VH + COVER_VH;

// Fraction of the whole pin (scrub + cover) taken up by the scrub itself —
// the point, in terms of the combined scrollYProgress, where the cover
// phase takes over.
const SCRUB_END = SCRUB_VH / TOTAL_PIN_VH;

// Splits the scrub's own timeline — not the whole pin — into two equal
// halves: first half of the video's runtime belongs to the intro panel,
// second half to the Resumo panel.
const MIDPOINT = 0.5;

type Stage = "intro" | "outro";

const PANEL_TRANSITION = "transition-all duration-500 ease-in-out";

/**
 * The page's hero: a pinned, scroll-scrubbed video of the book opening,
 * immediately followed — in the same continuous pin — by the World Age
 * trailer sliding up to cover it.
 *
 * One combined scroll range (SCRUB_VH + COVER_VH) drives everything. Over
 * its scrub fraction (0 to SCRUB_END) the video scrubs open and the intro/
 * Resumo panels crossfade at the scrub's own midpoint, exactly as before:
 * stage is tracked as plain state — not scroll-scrubbed opacity — so the two
 * panels are never both partially visible at once, however long a scroll
 * gesture pauses; only the 500ms ease-in-out crossfade at the exact crossing
 * point ever shows a blend. Once progress crosses SCRUB_END into the cover
 * fraction, the World Age section — rendered as a second sticky layer
 * stacked on top, parked one viewport below the fold until then — slides up
 * to fully cover this one, while the book video simultaneously scrubs the
 * same footage in reverse, closing the book back up in lockstep with how
 * far the cover has climbed. Both directions are driven straight off scroll
 * position, so scrolling back up re-opens the book exactly as far as the
 * cover has receded. Once the pin's scroll range is used up, both layers
 * release together and the page continues scrolling normally from the
 * World Age section onward.
 *
 * Rendered right after GlobeScrollDemo, whose globe is `position: fixed`
 * at z-10 so it stays glued to the viewport for the whole page — not just
 * within its own section. This section needs a z-index above that (with
 * its own opaque background) so it fully covers the fixed globe once
 * scrolled into view, instead of the globe bleeding through on top of it.
 * Pinned at z-[12] specifically — above the globe's z-10 but below the
 * site header (z-[15]) and mobile bottom nav (z-[20]) in MainContainer, so
 * neither of those gets covered in turn.
 */
export function BookRevealScrollVideo() {
  const locale = useLocale();
  const tHero = useTranslations("home-page-container");
  const tCover = useTranslations("book-cover-container");
  const tSummary = useTranslations("summary-container");
  const tChapter = useTranslations("chapter-page");

  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const [stage, setStage] = useState<Stage>("intro");
  const stageRef = useRef<Stage>("intro");

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    const video = videoRef.current;

    // Local progress within the scrub itself (0→1), clamped once the cover
    // phase takes over so the panel stage settles on "outro" and stays
    // there for the rest of the pin.
    const scrubProgress = Math.min(progress, SCRUB_END) / SCRUB_END;

    if (video && video.duration) {
      // Scrub fraction: play forward. Cover fraction: play the same footage
      // in reverse, in lockstep with how far the cover has climbed.
      const bookProgress =
        progress <= SCRUB_END ? scrubProgress : 1 - (progress - SCRUB_END) / (1 - SCRUB_END);
      video.currentTime = bookProgress * video.duration;
    }

    const nextStage: Stage = scrubProgress < MIDPOINT ? "intro" : "outro";
    if (nextStage !== stageRef.current) {
      stageRef.current = nextStage;
      setStage(nextStage);
    }
  });

  // The Resumo panel sits inside this pinned section, so it never scrolls
  // through the viewport on its own — MagicText's own scroll measurement
  // would never fire. Drive its word-by-word reveal from this same pin
  // timeline instead, over the stretch of scroll right after the panel
  // takes over from the intro, scaled into the scrub's own fraction of the
  // combined scrollYProgress.
  const resumoRevealProgress = useTransform(
    scrollYProgress,
    [SCRUB_END * MIDPOINT, SCRUB_END * (MIDPOINT + 0.2)],
    [0, 1],
  );

  // Drives the World Age layer's cover: parked one viewport below the fold
  // for the whole scrub, then climbing into place over the cover fraction,
  // and staying put once the pin releases. Its own caption also lives
  // inside that pinned layer — same problem as the Resumo panel above, so
  // it's driven off this same 0→1 slice rather than the caption's own
  // (non-firing) scroll measurement.
  const coverProgress = useTransform(scrollYProgress, [SCRUB_END, 1], [0, 1], { clamp: true });
  const coverY = useTransform(coverProgress, [0, 1], ["100%", "0%"]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onLoaded = () => setReady(true);
    if (video.readyState >= 1) setReady(true);
    else video.addEventListener("loadedmetadata", onLoaded);
    return () => video.removeEventListener("loadedmetadata", onLoaded);
  }, []);

  // "Baixar" in the intro panel can't scroll to the download options the
  // normal way — they live inside this same pinned section, further along
  // its own scroll-jacked timeline — so it fast-forwards the pin instead,
  // landing comfortably past the crossfade but still inside the scrub (not
  // into the cover phase).
  function jumpToDownload() {
    const el = sectionRef.current;
    if (!el) return;
    const targetProgress = SCRUB_END * 0.8;
    const extraScrollPx = (TOTAL_PIN_VH / 100) * window.innerHeight;
    window.scrollTo({ top: el.offsetTop + extraScrollPx * targetProgress, behavior: "smooth" });
    track("bookReveal_download", {});
  }

  return (
    <div
      ref={sectionRef}
      className="relative z-[12] w-full bg-secondary"
      style={{ height: `calc(100vh + ${TOTAL_PIN_VH}vh)` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-secondary">
        {/* Full-bleed cover — the book is anchored toward the right of frame,
            so bias the crop that way rather than centering it. */}
        <video
          ref={videoRef}
          className={`h-full w-full object-cover object-[70%_center] transition-opacity duration-500 ${ready ? "opacity-100" : "opacity-0"}`}
          src="/videos/book-reveal-scrub.mp4"
          poster="/videos/book-reveal-poster.jpg"
          muted
          playsInline
          preload="auto"
        />

        {/* Blend the video into the page background at the seams instead of a hard cut. */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[14vh] bg-gradient-to-b from-secondary to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[14vh] bg-gradient-to-t from-secondary to-transparent" />

        {/* Intro panel: title + download + watch CTAs — first half of the
            video's timeline. Positioned in the video's own empty left space,
            same box as the Resumo panel, so both line up with the book. A
            light editorial card — bold headline, italic dek, thin dividers,
            a closing pull-quote — floats over the video at every breakpoint,
            rather than only backing the text on mobile. */}
        <div
          className={`absolute inset-x-4 inset-y-4 flex max-w-md flex-col justify-center gap-4 overflow-y-auto rounded-2xl bg-white/95 p-6 shadow-2xl ring-1 ring-black/5 backdrop-blur-md tablet:inset-x-auto tablet:inset-y-[8%] tablet:left-[8%] tablet:w-[38%] tablet:max-w-none tablet:p-8 ${PANEL_TRANSITION} ${
            stage === "intro" ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-6 opacity-0"
          }`}
        >
          <div>
            <h1 className="font-secondary text-3xl font-bold leading-tight tracking-tight text-primary lg:text-4xl">
              {tHero("title")}
            </h1>
            <p className="mt-3 text-sm italic leading-relaxed text-gray lg:text-base">{tHero("subtitle")}</p>
          </div>

          <div className="flex flex-col items-start gap-3">
            <Button variant="specialGray" size="lg" className="self-start" onClick={jumpToDownload}>
              {tChapter("download")}
              <div className="rounded-full bg-white p-1">
                <CloudIcon className="text-2xl text-primary" />
              </div>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="justify-between self-start border-primary/20 text-primary hover:bg-primary/5"
            >
              <Link
                href={`/${locale}/guide/chapter/${FIRST_CHAPTER}?autoplay=1`}
                onClick={() => track("bookReveal_watchNow", { chapter: FIRST_CHAPTER })}
              >
                {tChapter("watch-now")}
                <div className="rounded-full bg-primary/10 p-1">
                  <PlayCircle className="h-6 w-6 text-primary" />
                </div>
              </Link>
            </Button>
          </div>

          <div className="flex flex-row gap-6 border-t border-primary/10 pt-4">
            <IconAndInfoSection icon="/cloud-icon.svg" title="10k +" text={tCover("downloads")} />
            <IconAndInfoSection icon="/translation-icon.svg" title="100 +" text={tCover("languages")} />
          </div>

          <div className="border-t border-primary/10 pt-4">
            <blockquote
              className={`text-sm leading-relaxed text-primary/90 lg:text-base ${
                ["ar", "zh"].includes(locale) ? "" : "italic"
              }`}
            >
              “{tHero("quote")}”
            </blockquote>
            <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-primary">Ellen G. White</p>
            <p className="text-xs text-gray">{tHero("quote-citation")}</p>
          </div>
        </div>

        {/* Resumo panel: summary text + full download options — second half
            of the video's timeline, replacing the intro panel once the book
            has finished opening. Same responsive treatment as the intro
            panel: a translucent backing on mobile, where the full-bleed crop
            can eat into the video's empty margin, and no backing from tablet
            up, where that margin is reliably clear. */}
        <div
          className={`absolute inset-x-4 inset-y-0 flex max-w-md flex-col justify-center gap-4 overflow-y-auto rounded-2xl bg-secondary/90 p-6 shadow-xl backdrop-blur-sm tablet:inset-x-auto tablet:left-[8%] tablet:w-[38%] tablet:max-w-none tablet:rounded-none tablet:bg-transparent tablet:p-0 tablet:shadow-none tablet:backdrop-blur-none ${PANEL_TRANSITION} ${
            stage === "outro" ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
          }`}
        >
          <h2 className="text-2xl font-bold leading-tight text-primary lg:text-3xl">
            {tSummary("summary")}
          </h2>
          <div className="mt-3 max-w-md">
            <MagicText
              text={tSummary("paragraph-1")}
              progress={resumoRevealProgress}
              className="text-sm font-normal text-gray lg:text-base"
            />
          </div>
          <div className="mt-4">
            <BookDownloadContainer />
          </div>
        </div>
      </div>

      {/* World Age trailer, stacked as a second sticky layer — parked one
          viewport below the fold for the whole scrub — so it can climb up
          and cover the book reveal above during the cover phase instead of
          just following it in normal flow. */}
      <WorldAgeVideoSection style={{ y: coverY }} captionProgress={coverProgress} />
    </div>
  );
}
