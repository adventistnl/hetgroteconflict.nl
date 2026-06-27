"use client";

import { useMemo, useEffect, useRef } from "react";

interface WordToken {
  text: string;
  startIndex: number;
  isWord: boolean;
}

interface Props {
  text: string;
  /** Absolute char index of the word currently being spoken (−1 = none). */
  currentCharIndex: number;
  className?: string;
}

function tokenize(text: string): WordToken[] {
  const tokens: WordToken[] = [];
  const regex = /\S+|\s+/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    tokens.push({
      text: match[0],
      startIndex: match.index,
      isWord: /\S/.test(match[0]),
    });
  }
  return tokens;
}

export function HighlightedText({ text, currentCharIndex, className }: Props) {
  const tokens = useMemo(() => tokenize(text), [text]);
  const highlightRef = useRef<HTMLSpanElement | null>(null);
  const lastScrollMs = useRef(0);

  // Find which token is active
  const activeIdx = useMemo(() => {
    if (currentCharIndex < 0) return -1;
    for (let i = tokens.length - 1; i >= 0; i--) {
      if (tokens[i].isWord && tokens[i].startIndex <= currentCharIndex) return i;
    }
    return -1;
  }, [tokens, currentCharIndex]);

  // Scroll the highlighted word into view (300 ms debounce)
  useEffect(() => {
    if (!highlightRef.current) return;
    const now = Date.now();
    if (now - lastScrollMs.current < 300) return;
    lastScrollMs.current = now;
    highlightRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [activeIdx]);

  return (
    <span className={className}>
      {tokens.map((token, i) => {
        const isActive = i === activeIdx && token.isWord;
        return (
          <span
            key={i}
            ref={isActive ? highlightRef : undefined}
            className={
              isActive
                ? "rounded bg-[#4fa6c2]/25 text-[#2a7a96] transition-colors duration-100"
                : undefined
            }
          >
            {token.text}
          </span>
        );
      })}
    </span>
  );
}
