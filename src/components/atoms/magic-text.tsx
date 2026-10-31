"use client";

import * as React from "react";
import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

export interface MagicTextProps {
  text: string;
  /** Typography applied to each word — defaults to the original demo's large quote style. */
  className?: string;
  /**
   * Drive the reveal from an external 0–1 motion value instead of the
   * component's own scroll measurement — needed when the text lives inside
   * a pinned/sticky region that doesn't move through the viewport on its
   * own, so `useScroll` on its ref would never see it "enter" the page.
   */
  progress?: MotionValue<number>;
  /** Centers the wrapped words as a block instead of the default left-aligned flow. */
  center?: boolean;
}

interface WordProps {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  className: string;
}

const Word: React.FC<WordProps> = ({ children, progress, range, className }) => {
  const opacity = useTransform(progress, range, [0, 1]);

  return (
    <span className={`relative mr-1 mt-[12px] ${className}`}>
      <span className="absolute opacity-20">{children}</span>
      <motion.span style={{ opacity }}>{children}</motion.span>
    </span>
  );
};

/**
 * Reveals a block of text word by word as its container scrolls through the
 * viewport — each word fades from 20% to full opacity in its own slice of
 * the scroll range, so the whole sentence "writes itself in" while scrolling.
 */
export const MagicText: React.FC<MagicTextProps> = ({
  text,
  className = "text-3xl font-semibold",
  progress: externalProgress,
  center = false,
}) => {
  const container = useRef<HTMLParagraphElement>(null);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start 0.9", "start 0.25"],
  });

  const progress = externalProgress ?? scrollYProgress;
  const words = text.split(" ");

  return (
    <p ref={container} className={`flex flex-wrap leading-[0.5] ${center ? "justify-center" : ""}`}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;

        return (
          <Word key={i} progress={progress} range={[start, end]} className={className}>
            {word}
          </Word>
        );
      })}
    </p>
  );
};
