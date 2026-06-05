"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "chapter-progress";

export interface ChapterProgressState {
  /** Highest chapter number the user has visited (as string, e.g. "3") */
  lastChapter: string | null;
  /** Set of chapter numbers the user has visited */
  visitedChapters: Set<string>;
}

function readFromStorage(): ChapterProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { lastChapter: null, visitedChapters: new Set() };
    const parsed = JSON.parse(raw) as { lastChapter: string | null; visitedChapters: string[] };
    return {
      lastChapter: parsed.lastChapter ?? null,
      visitedChapters: new Set(parsed.visitedChapters ?? []),
    };
  } catch {
    return { lastChapter: null, visitedChapters: new Set() };
  }
}

function writeToStorage(state: ChapterProgressState) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        lastChapter: state.lastChapter,
        visitedChapters: Array.from(state.visitedChapters),
      })
    );
  } catch {
    // localStorage not available (SSR / private browsing)
  }
}

export function useChapterProgress() {
  const [progress, setProgress] = useState<ChapterProgressState>({
    lastChapter: null,
    visitedChapters: new Set(),
  });

  // Hydrate from localStorage once on the client
  useEffect(() => {
    setProgress(readFromStorage());
  }, []);

  const markChapterVisited = useCallback((chapterNumber: string) => {
    setProgress((prev) => {
      const visited = new Set(prev.visitedChapters);
      visited.add(chapterNumber);
      const next: ChapterProgressState = { lastChapter: chapterNumber, visitedChapters: visited };
      writeToStorage(next);
      return next;
    });
  }, []);

  const clearProgress = useCallback(() => {
    const empty: ChapterProgressState = { lastChapter: null, visitedChapters: new Set() };
    writeToStorage(empty);
    setProgress(empty);
  }, []);

  return { progress, markChapterVisited, clearProgress };
}
