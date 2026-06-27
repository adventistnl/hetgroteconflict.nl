"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { TtsSuccessResponse, TtsErrorResponse } from "@/app/api/tts/route";

// ── Types ──────────────────────────────────────────────────────────────────────

export type ReadAloudState = "idle" | "loading" | "playing" | "paused" | "error";

export interface UseReadAloudReturn {
  play: (text: string, lang?: string) => Promise<void>;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  state: ReadAloudState;
  /** Absolute char index of the word currently being spoken (−1 = none). */
  currentCharIndex: number;
  error: string | null;
  /** true when using the browser Web Speech API instead of Edge TTS */
  usingFallback: boolean;
  playbackRate: number;
  setPlaybackRate: (rate: number) => void;
}

// Max chars per API call. Callers should chunk longer texts.
const CHUNK_SIZE = 3500;

// ── Chunking helper ────────────────────────────────────────────────────────────

function splitIntoChunks(text: string): Array<{ text: string; startOffset: number }> {
  if (text.length <= CHUNK_SIZE) return [{ text, startOffset: 0 }];

  const paragraphs = text.split(/\n+/).filter((p) => p.trim());
  const chunks: Array<{ text: string; startOffset: number }> = [];
  let current = "";
  let currentStart = 0;
  let offset = 0;

  for (const para of paragraphs) {
    const sep = current ? "\n" : "";
    if ((current + sep + para).length > CHUNK_SIZE) {
      if (current) {
        chunks.push({ text: current, startOffset: currentStart });
        offset += current.length + 1;
        currentStart = offset;
        current = para;
      } else {
        // Single paragraph over CHUNK_SIZE — split by sentences
        const sentences = para.match(/[^.!?]+[.!?]+\s*/g) ?? [para];
        let buf = "";
        for (const sen of sentences) {
          if ((buf + sen).length > CHUNK_SIZE) {
            if (buf) {
              chunks.push({ text: buf.trim(), startOffset: currentStart });
              offset += buf.length;
              currentStart = offset;
            }
            buf = sen;
          } else {
            buf += sen;
          }
        }
        current = buf;
      }
    } else {
      current = current + sep + para;
    }
  }
  if (current.trim()) chunks.push({ text: current.trim(), startOffset: currentStart });
  return chunks;
}

// ── Hook ───────────────────────────────────────────────────────────────────────

export function useReadAloud(): UseReadAloudReturn {
  const [state, setState] = useState<ReadAloudState>("idle");
  const [currentCharIndex, setCurrentCharIndex] = useState(-1);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);
  const [playbackRate, setPlaybackRateState] = useState(1);

  // Mutable refs so callbacks don't go stale
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const boundariesRef = useRef<TtsSuccessResponse["boundaries"]>([]);
  const chunkOffsetRef = useRef(0);
  const rateRef = useRef(1);
  const abortRef = useRef(false); // set to true when stop() is called

  rateRef.current = playbackRate;

  // ── Stop / cleanup ──────────────────────────────────────────────────────────

  const stopInternal = useCallback(() => {
    abortRef.current = true;
    if (audioRef.current) {
      audioRef.current.pause();
      if (audioRef.current.src.startsWith("blob:")) {
        URL.revokeObjectURL(audioRef.current.src);
      }
      audioRef.current = null;
    }
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    boundariesRef.current = [];
    chunkOffsetRef.current = 0;
    setCurrentCharIndex(-1);
  }, []);

  const stop = useCallback(() => {
    stopInternal();
    setState("idle");
  }, [stopInternal]);

  const pause = useCallback(() => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
      setState("paused");
    } else if (usingFallback && typeof window !== "undefined") {
      window.speechSynthesis.pause();
      setState("paused");
    }
  }, [usingFallback]);

  const resume = useCallback(() => {
    if (audioRef.current?.paused) {
      void audioRef.current.play();
      setState("playing");
    } else if (usingFallback && typeof window !== "undefined") {
      window.speechSynthesis.resume();
      setState("playing");
    }
  }, [usingFallback]);

  const setPlaybackRate = useCallback((rate: number) => {
    setPlaybackRateState(rate);
    rateRef.current = rate;
    if (audioRef.current) audioRef.current.playbackRate = rate;
  }, []);

  // ── Web Speech fallback ─────────────────────────────────────────────────────

  const playWithFallback = useCallback((text: string, lang: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setError("Speech synthesis not supported in this browser.");
      setState("error");
      return;
    }
    setUsingFallback(true);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = rateRef.current;
    utterance.onboundary = (e) => {
      if (e.name === "word") setCurrentCharIndex(e.charIndex);
    };
    utterance.onstart = () => setState("playing");
    utterance.onend = () => { setState("idle"); setCurrentCharIndex(-1); };
    utterance.onerror = () => { setState("error"); setError("Speech synthesis error."); };
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }, []);

  // ── Play one audio chunk ────────────────────────────────────────────────────

  const playAudioChunk = useCallback(
    (audioBase64: string, boundaries: TtsSuccessResponse["boundaries"], chunkOffset: number): Promise<void> => {
      return new Promise((resolve, reject) => {
        const binaryStr = atob(audioBase64);
        const bytes = new Uint8Array(binaryStr.length);
        for (let i = 0; i < binaryStr.length; i++) bytes[i] = binaryStr.charCodeAt(i);
        const blob = new Blob([bytes], { type: "audio/mpeg" });
        const url = URL.createObjectURL(blob);

        const audio = new Audio(url);
        audio.playbackRate = rateRef.current;
        audioRef.current = audio;
        boundariesRef.current = boundaries;
        chunkOffsetRef.current = chunkOffset;

        audio.addEventListener("timeupdate", () => {
          if (abortRef.current) return;
          const ms = audio.currentTime * 1000;
          const bs = boundariesRef.current;
          if (!bs.length) return;
          let idx = bs.findIndex((b) => b.offsetMs > ms);
          if (idx === -1) idx = bs.length;
          const b = bs[Math.max(0, idx - 1)];
          if (b) setCurrentCharIndex(chunkOffsetRef.current + b.charIndex);
        });

        audio.addEventListener("ended", () => {
          URL.revokeObjectURL(url);
          resolve();
        });

        audio.addEventListener("error", () => {
          URL.revokeObjectURL(url);
          reject(new Error("Audio playback error"));
        });

        void audio.play();
        setState("playing");
      });
    },
    []
  );

  // ── Main play ───────────────────────────────────────────────────────────────

  const play = useCallback(
    async (text: string, lang = "en") => {
      stopInternal();
      abortRef.current = false;
      setError(null);
      setUsingFallback(false);
      setCurrentCharIndex(-1);
      setState("loading");

      const chunks = splitIntoChunks(text);

      try {
        for (const chunk of chunks) {
          if (abortRef.current) break;

          const res = await fetch("/api/tts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: chunk.text, lang }),
          });

          const data = (await res.json()) as TtsSuccessResponse | TtsErrorResponse;

          if (!res.ok || "fallbackToWebSpeech" in data) {
            const errData = data as TtsErrorResponse;
            if (errData.fallbackToWebSpeech) {
              playWithFallback(text, lang);
            } else {
              setError(errData.error);
              setState("error");
            }
            return;
          }

          const ttsData = data as TtsSuccessResponse;
          if (abortRef.current) break;

          await playAudioChunk(ttsData.audioBase64, ttsData.boundaries, chunk.startOffset);
        }

        if (!abortRef.current) {
          setState("idle");
          setCurrentCharIndex(-1);
        }
      } catch (err) {
        if (abortRef.current) return; // user stopped
        console.warn("[useReadAloud] Edge TTS failed, falling back:", err);
        playWithFallback(text, lang);
      }
    },
    [stopInternal, playWithFallback, playAudioChunk]
  );

  // Cleanup on unmount
  useEffect(() => () => stopInternal(), [stopInternal]);

  return {
    play,
    pause,
    resume,
    stop,
    state,
    currentCharIndex,
    error,
    usingFallback,
    playbackRate,
    setPlaybackRate,
  };
}
