"use client";

import { Loader2, Pause, Play, Square, Volume2 } from "lucide-react";
import type { UseReadAloudReturn } from "@/hooks/use-read-aloud";

const SPEED_OPTIONS = [0.75, 1, 1.25, 1.5] as const;

interface Props {
  text: string;
  /** App locale code to select the right voice, e.g. "en", "pt", "de". */
  lang?: string;
  readAloud: UseReadAloudReturn;
}

export function ReadAloudPlayer({ text, lang = "en", readAloud }: Props) {
  const {
    state, usingFallback, error,
    playbackRate, setPlaybackRate,
    play, pause, resume, stop,
  } = readAloud;

  function handlePlayPause() {
    if (state === "idle" || state === "error") void play(text, lang);
    else if (state === "playing") pause();
    else if (state === "paused") resume();
  }

  const isActive = state === "playing" || state === "paused";

  return (
    <div
      role="toolbar"
      aria-label="Read aloud controls"
      className="flex items-center gap-2 rounded-xl border border-primary/15 bg-primary/5 px-3 py-2"
    >
      {/* Play / Pause */}
      <button
        onClick={handlePlayPause}
        disabled={state === "loading"}
        aria-label={state === "playing" ? "Pause" : "Play read-aloud"}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#4fa6c2] text-white transition hover:bg-[#3d91ad] disabled:opacity-60"
      >
        {state === "loading" ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
        ) : state === "playing" ? (
          <Pause className="h-3.5 w-3.5" aria-hidden />
        ) : (
          <Play className="h-3.5 w-3.5" aria-hidden />
        )}
      </button>

      {/* Stop */}
      {isActive && (
        <button
          onClick={stop}
          aria-label="Stop read-aloud"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-primary/40 transition hover:bg-primary/10 hover:text-primary"
        >
          <Square className="h-3 w-3" aria-hidden />
        </button>
      )}

      {/* Status label */}
      <div className="flex min-w-0 flex-1 items-center gap-1.5">
        <Volume2 className="h-3.5 w-3.5 shrink-0 text-[#4fa6c2]" aria-hidden />
        <span className="truncate text-xs font-medium text-primary/70">
          {state === "loading" && "Preparing audio…"}
          {state === "playing" && "Reading…"}
          {state === "paused" && "Paused"}
          {state === "error" && (error ?? "Audio unavailable")}
          {state === "idle" && "Read aloud"}
        </span>
        {usingFallback && (
          <span className="shrink-0 text-[10px] text-primary/40">· device voice</span>
        )}
      </div>

      {/* Speed selector */}
      <div className="flex items-center gap-0.5" role="group" aria-label="Playback speed">
        {SPEED_OPTIONS.map((rate) => (
          <button
            key={rate}
            onClick={() => setPlaybackRate(rate)}
            aria-pressed={playbackRate === rate}
            aria-label={`${rate}× speed`}
            className={`rounded px-1.5 py-0.5 text-[10px] font-semibold transition ${
              playbackRate === rate
                ? "bg-[#4fa6c2]/20 text-[#4fa6c2]"
                : "text-primary/40 hover:text-primary/70"
            }`}
          >
            {rate}×
          </button>
        ))}
      </div>
    </div>
  );
}
