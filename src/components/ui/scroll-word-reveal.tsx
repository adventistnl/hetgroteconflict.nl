"use client";

import { Fragment, useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";

const REST_OPACITY = 0.15;
const REVEAL_SPAN = 0.8;
const WORD_WINDOW = 0.2;

function getWordRange(index: number, count: number) {
  const start = count <= 1 ? 0 : (index / (count - 1)) * REVEAL_SPAN;
  return { start, end: Math.min(1, start + WORD_WINDOW) };
}

export function getWordOpacity(
  progress: number,
  { start, end }: { start: number; end: number },
  rest = REST_OPACITY
) {
  if (progress <= start) return rest;
  if (progress >= end) return 1;
  const t = (progress - start) / (end - start);
  return rest + (1 - rest) * t;
}

function Word({
  children,
  progress,
  index,
  count,
  reducedMotion,
}: {
  children: string;
  progress: MotionValue<number>;
  index: number;
  count: number;
  reducedMotion: boolean;
}) {
  const range = getWordRange(index, count);
  const opacity = useTransform(progress, (value) => getWordOpacity(value, range));

  return (
    <motion.span aria-hidden="true" style={reducedMotion ? undefined : { opacity }}>
      {children}
    </motion.span>
  );
}

interface ScrollWordRevealProps {
  text: string;
  className?: string;
}

/**
 * Word-by-word opacity reveal driven by the PAGE's own scroll — not a
 * nested scroll container (the original widget this was adapted from used
 * `useScroll({ container })`, which traps the wheel inside its own box).
 * Here `target` is the paragraph itself, so scrollYProgress tracks its
 * natural position as the surrounding page scrolls, exactly like the rest
 * of ScrollGlobe's section tracking.
 */
export function ScrollWordReveal({ text, className }: ScrollWordRevealProps) {
  const targetRef = useRef<HTMLParagraphElement>(null);
  const reducedMotion = useReducedMotion();
  // Progress reaches 1 well before the paragraph leaves the viewport (start
  // 85% -> start 25% of viewport height) so every word has settled to full
  // opacity while there's still time to read it, not right as it scrolls out.
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start 85%", "start 25%"],
  });
  const words = text.split(" ");

  return (
    <p ref={targetRef} className={className} aria-label={text}>
      {words.map((word, index) => (
        <Fragment key={`${word}-${index}`}>
          <Word progress={scrollYProgress} index={index} count={words.length} reducedMotion={!!reducedMotion}>
            {word}
          </Word>
          {index < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </p>
  );
}

export default ScrollWordReveal;
