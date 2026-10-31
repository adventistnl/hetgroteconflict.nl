"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { motion, type MotionStyle, type MotionValue } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { MagicText } from "@/components/atoms/magic-text";
import { elapsedSinceCreation, type ElapsedSinceCreation } from "@/utils/days-since-creation";
import { track } from "@vercel/analytics";

// Cache Storage (not the browser's plain HTTP cache) so the trailer keeps
// playing offline on a later visit, the same way book chapters do — see
// getBookData in plan-detail-client.tsx for the original pattern.
const TRAILER_CACHE_NAME = "gc-trailer-cache-v1";
const TRAILER_URL = "/videos/great-conflict-trailer.mp4";

/** Fire-and-forget: persists a copy of the trailer for offline playback, without delaying this visit's playback. */
function prefetchTrailer() {
  if (typeof caches === "undefined") return;
  void (async () => {
    try {
      const cache = await caches.open(TRAILER_CACHE_NAME);
      if (await cache.match(TRAILER_URL)) return;
      const res = await fetch(TRAILER_URL);
      if (res.ok) await cache.put(TRAILER_URL, res);
    } catch {
      /* best-effort — offline playback just won't be available yet */
    }
  })();
}

/** Reads the persisted copy back out as a blob: URL the <video> element can play with no network. */
async function getOfflineTrailerSrc(): Promise<string | null> {
  if (typeof caches === "undefined") return null;
  try {
    const cache = await caches.open(TRAILER_CACHE_NAME);
    const cached = await cache.match(TRAILER_URL);
    if (!cached) return null;
    return URL.createObjectURL(await cached.blob());
  } catch {
    return null;
  }
}

function pad(n: number | undefined): string {
  return n === undefined ? "–" : String(n).padStart(2, "0");
}

function TimeSegment({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="font-mono text-2xl font-black tabular-nums text-white drop-shadow-lg sm:text-4xl lg:text-5xl">
        {value}
      </span>
      <span className="mt-1 text-[8px] uppercase tracking-widest text-white/50 sm:text-[10px] lg:text-xs">{label}</span>
    </div>
  );
}

function Colon() {
  return <span className="pb-3.5 text-lg font-light text-white/25 sm:pb-4 sm:text-2xl lg:pb-5 lg:text-3xl">:</span>;
}

/**
 * Trailer video — autoplaying, looping, muted by default (the only way
 * autoplay is allowed by any browser), with a tap-to-unmute toggle for
 * sound. Loading starts the moment this component mounts: the native
 * `autoPlay`/`preload="auto"` attributes make the browser fetch and buffer
 * the video immediately, same as page access, with the poster shown
 * instantly in the meantime. An imperative `.play()` call backs up the HTML
 * attribute for browsers that are stricter about autoplay from a
 * React-mounted element. Caching a copy to Cache Storage for offline
 * playback only starts once real playback begins, so it never competes
 * with this initial load for bandwidth; if the network request ever fails
 * outright (e.g. opening the page offline), playback falls back to that
 * cached copy automatically.
 *
 * Floating on top of the video is a live days:hours:minutes:seconds count
 * of the time elapsed since the traditional Ussher creation date — ticking
 * up every second, so the story it's counting through keeps visibly
 * advancing toward its end for as long as the section is on screen. The
 * whole band is bookended by dark gradients — the video already has its
 * own dark vignette at the edges, so fading through secondary→black (not
 * secondary→transparent) avoids a pale haze washing out over it.
 *
 * Rendered by BookRevealScrollVideo as a second sticky layer stacked over
 * its own — `style` is where that parent hands down the scroll-driven `y`
 * transform that slides this section up to cover the book reveal, and
 * `captionProgress` the matching 0→1 value for the caption's own reveal
 * (see MagicText's `progress` prop — this text lives inside that same
 * pinned layer, so its own scroll measurement never fires). Left at its
 * natural height (video, counter and caption all layered over it) rather
 * than stretched to a full viewport, so it stays compact instead of
 * leaving dead space below on tall screens.
 */
export function WorldAgeVideoSection({
  style,
  captionProgress,
}: {
  style?: MotionStyle;
  captionProgress?: MotionValue<number>;
}) {
  const locale = useLocale();
  const t = useTranslations("world-age-section");

  const videoRef = useRef<HTMLVideoElement>(null);
  const objectUrlRef = useRef<string | null>(null);
  const hasPrefetchedRef = useRef(false);
  const [src, setSrc] = useState(TRAILER_URL);
  const [muted, setMuted] = useState(true);

  // Starts null so server and first client render match exactly (avoids a
  // hydration mismatch on a value that depends on the current second); the
  // real, ticking value only ever appears client-side after mount.
  const [elapsed, setElapsed] = useState<ElapsedSinceCreation | null>(null);

  useEffect(() => {
    setElapsed(elapsedSinceCreation());
    const id = setInterval(() => setElapsed(elapsedSinceCreation()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    // Already offline on arrival — skip straight to the cached copy instead
    // of waiting on a network request that's just going to fail. This is
    // just a Cache Storage lookup, not a fetch, so it doesn't compete with
    // the video's own loading.
    if (typeof navigator !== "undefined" && navigator.onLine === false) {
      void getOfflineTrailerSrc().then((offlineSrc) => {
        if (offlineSrc) {
          objectUrlRef.current = offlineSrc;
          setSrc(offlineSrc);
        }
      });
    }

    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  // Belt-and-braces: the `autoPlay` attribute alone can be inconsistent for
  // a <video> that React mounts (vs. one already present in parsed HTML),
  // so also kick playback off imperatively once a source is set.
  useEffect(() => {
    videoRef.current?.play().catch(() => {
      /* Autoplay was blocked — the poster stays visible; the mute button still lets the user start it manually. */
    });
  }, [src]);

  function handlePlaying() {
    // Only start persisting a copy for offline use once real playback has
    // begun, so this never competes with the initial load for bandwidth.
    if (!hasPrefetchedRef.current) {
      hasPrefetchedRef.current = true;
      prefetchTrailer();
    }
  }

  async function handleNetworkError() {
    if (objectUrlRef.current) return; // already on the cached copy — a real playback error, not a network one
    const offlineSrc = await getOfflineTrailerSrc();
    if (offlineSrc) {
      objectUrlRef.current = offlineSrc;
      setSrc(offlineSrc);
    }
  }

  function toggleMute() {
    setMuted((m) => !m);
    track("worldAge_toggleTrailerSound", {});
  }

  return (
    <motion.div
      style={style}
      className="sticky top-0 z-10 w-full overflow-hidden rounded-t-[2.5rem] bg-black shadow-[0_-40px_80px_-20px_rgba(0,0,0,0.45)]"
    >
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[14vh] bg-gradient-to-t from-secondary to-black" />

      {/* Trailer */}
      <div className="relative aspect-video w-full">
        <video
          ref={videoRef}
          key={src}
          className="h-full w-full object-cover"
          src={src}
          poster="/videos/great-conflict-trailer-poster.jpg"
          autoPlay
          loop
          muted={muted}
          playsInline
          preload="auto"
          onPlaying={handlePlaying}
          onError={handleNetworkError}
        />

        {/* Floating live counter — centered over the video, with a scrim
            behind it to keep the digits legible over whatever the footage
            underneath is doing. Everything is capped at a max-width and
            centered so the row of numbers stays a tight, readable cluster
            instead of stretching edge-to-edge on wide/ultrawide screens. */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/35 px-4 text-center sm:px-8">
          <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/60 sm:text-xs">
              {t("eyebrow")}
            </p>

            <h2 className="max-w-xs text-xl font-black leading-tight text-white drop-shadow-lg sm:max-w-lg sm:text-3xl lg:max-w-2xl lg:text-4xl">
              {t("hook")}
            </h2>

            <div className="flex w-full flex-wrap items-end justify-center gap-x-1.5 gap-y-3 sm:flex-nowrap sm:gap-x-4 lg:gap-x-8">
              <TimeSegment value={elapsed ? elapsed.years.toLocaleString(locale) : "–"} label={t("years")} />
              <Colon />
              <TimeSegment value={pad(elapsed?.months)} label={t("months")} />
              <Colon />
              <TimeSegment value={pad(elapsed?.days)} label={t("days")} />
              <Colon />
              <TimeSegment value={pad(elapsed?.hours)} label={t("hours")} />
              <Colon />
              <TimeSegment value={pad(elapsed?.minutes)} label={t("minutes")} />
              <Colon />
              <TimeSegment value={pad(elapsed?.seconds)} label={t("seconds")} />
            </div>
            <p className="text-[10px] uppercase tracking-widest text-white/40 sm:text-xs">{t("days-label")}</p>

            <div className="mt-2 max-w-2xl text-center">
              <MagicText
                text={t("caption")}
                progress={captionProgress}
                center
                className="text-sm font-normal text-white/70 sm:text-base"
              />
            </div>
          </div>
        </div>

        <button
          onClick={toggleMute}
          aria-label={muted ? t("unmute-trailer") : t("mute-trailer")}
          className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-sm transition hover:border-white/40 hover:bg-black/60"
        >
          {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </button>
      </div>
    </motion.div>
  );
}
