"use client";

import { useState, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useSpring,
} from "framer-motion";
import { iChurchs } from "@/database/churchs";
import { COLOR, FONT } from "./theme";

// ── Types ─────────────────────────────────────────────────
interface NearestChurch extends iChurchs {
  distance: number;
}

interface Props {
  church: NearestChurch;
  visible: boolean;
  onViewOnMap: () => void;
}

// ── ActionButton ──────────────────────────────────────────
function ActionButton({
  href,
  onClick,
  children,
}: {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  const base =
    "inline-flex items-center gap-1.5 rounded-lg border border-primary/20 bg-transparent px-4 py-2 text-xs font-medium text-primary transition-colors hover:border-primary/50 hover:bg-primary/8";

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={base} style={{ fontFamily: FONT.body }}>
        {children}
      </a>
    );
  }
  return (
    <button onClick={onClick} className={base} style={{ fontFamily: FONT.body }}>
      {children}
    </button>
  );
}

// ── MapThumbnail (SVG street grid) ────────────────────────
function MapThumbnail() {
  return (
    <motion.div
      className="absolute inset-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, delay: 0.1 }}
    >
      {/* Street background */}
      <div className="absolute inset-0 rounded-b-2xl" style={{ background: "#e8eaed" }} />

      {/* SVG streets */}
      <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
        {/* Horizontal main roads */}
        {[32, 62].map((y, i) => (
          <motion.line
            key={`h-main-${i}`}
            x1="0%" y1={`${y}%`} x2="100%" y2={`${y}%`}
            stroke="white" strokeWidth="5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, delay: 0.15 + i * 0.1 }}
          />
        ))}
        {/* Vertical main roads */}
        {[28, 68].map((x, i) => (
          <motion.line
            key={`v-main-${i}`}
            x1={`${x}%`} y1="0%" x2={`${x}%`} y2="100%"
            stroke="white" strokeWidth="5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.7, delay: 0.3 + i * 0.1 }}
          />
        ))}
        {/* Secondary streets */}
        {[18, 48, 80].map((y, i) => (
          <motion.line
            key={`h-sec-${i}`}
            x1="0%" y1={`${y}%`} x2="100%" y2={`${y}%`}
            stroke="white" strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.55 + i * 0.08 }}
          />
        ))}
        {[13, 47, 55, 83].map((x, i) => (
          <motion.line
            key={`v-sec-${i}`}
            x1={`${x}%`} y1="0%" x2={`${x}%`} y2="100%"
            stroke="white" strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.65 + i * 0.08 }}
          />
        ))}
      </svg>

      {/* City blocks */}
      {[
        { top: "38%", left: "8%",  w: "17%", h: "20%" },
        { top: "12%", left: "33%", w: "13%", h: "16%" },
        { top: "68%", left: "72%", w: "20%", h: "18%" },
        { top: "18%", right: "8%", w: "11%", h: "24%" },
        { top: "52%", left: "4%",  w: "9%",  h: "12%" },
        { top: "6%",  left: "72%", w: "15%", h: "11%" },
      ].map((pos, i) => (
        <motion.div
          key={i}
          className="absolute rounded-sm"
          style={{ ...pos, background: "#cbd2d9", border: "1px solid #b0b8c1" }}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, delay: 0.4 + i * 0.07 }}
        />
      ))}

      {/* Destination pin */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        initial={{ scale: 0, y: -20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 420, damping: 22, delay: 0.25 }}
      >
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" style={{ filter: `drop-shadow(0 0 10px ${COLOR.accent}99)` }}>
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill={COLOR.accent} />
          <circle cx="12" cy="9" r="2.5" fill="white" />
        </svg>
      </motion.div>

      {/* Bottom gradient fade */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 rounded-b-2xl bg-gradient-to-t from-white via-white/60 to-transparent" />
    </motion.div>
  );
}

// ── NearestChurchCard ─────────────────────────────────────
export function NearestChurchCard({ church, visible, onViewOnMap }: Props) {
  const [isHovered, setIsHovered]   = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // 3-D tilt spring
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-50, 50], [6, -6]);
  const rotateY = useTransform(mouseX, [-50, 50], [-6, 6]);
  const springX = useSpring(rotateX, { stiffness: 300, damping: 30 });
  const springY = useSpring(rotateY, { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - (rect.left + rect.width / 2));
    mouseY.set(e.clientY - (rect.top + rect.height / 2));
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 20 }}
      transition={{ duration: 0.4 }}
    >
      {/* 3-D tilt wrapper */}
      <div
        ref={containerRef}
        style={{ perspective: 1000 }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          className="relative overflow-hidden rounded-2xl border bg-white shadow-sm"
          style={{
            rotateX: springX,
            rotateY: springY,
            transformStyle: "preserve-3d",
            borderColor: COLOR.cardBorder,
          }}
          animate={{ boxShadow: isHovered ? "0 20px 50px rgba(0,0,0,0.12)" : "0 1px 8px rgba(0,0,0,0.06)" }}
          transition={{ duration: 0.3 }}
        >
          {/* Map thumbnail — revealed when expanded */}
          <AnimatePresence>
            {isExpanded && (
              <div className="absolute inset-x-0 top-0 h-28">
                <MapThumbnail />
              </div>
            )}
          </AnimatePresence>

          {/* Grid pattern (collapsed only) */}
          <motion.div
            className="pointer-events-none absolute inset-0"
            animate={{ opacity: isExpanded ? 0 : 0.04 }}
            transition={{ duration: 0.3 }}
          >
            <svg className="absolute inset-0 h-full w-full">
              <defs>
                <pattern id="church-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#church-grid)" />
            </svg>
          </motion.div>

          {/* Card content */}
          <motion.div
            className="relative z-10 flex flex-col gap-0 px-7 pb-6"
            animate={{ paddingTop: isExpanded ? "112px" : "24px" }}
            transition={{ type: "spring", stiffness: 400, damping: 35 }}
          >
            {/* Top row: distance badge + expand toggle */}
            <div className="flex items-center justify-between">
              <motion.p
                className="flex items-center gap-1.5 text-xs font-medium"
                style={{ fontFamily: FONT.mono, color: COLOR.accent }}
                animate={{ x: isHovered ? 2 : 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <span>📍</span>
                {church.distance.toFixed(1)} km away
                {/* Live dot */}
                <span className="ml-1 flex items-center gap-1 rounded-full border border-black/5 bg-black/5 px-2 py-0.5">
                  <span
                    className="inline-block h-1.5 w-1.5 rounded-full"
                    style={{ background: COLOR.accent }}
                  />
                  <span className="text-[10px] uppercase tracking-wide text-gray-500">Nearest</span>
                </span>
              </motion.p>

              {/* Expand / collapse */}
              <motion.button
                onClick={() => setIsExpanded((v) => !v)}
                className="rounded-full border border-black/10 bg-black/5 p-1.5 text-gray-500 transition-colors hover:bg-black/10"
                whileTap={{ scale: 0.9 }}
                aria-label={isExpanded ? "Collapse map" : "Expand map"}
              >
                <motion.svg
                  width="14" height="14" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round"
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <polyline points="18 15 12 9 6 15" />
                </motion.svg>
              </motion.button>
            </div>

            {/* Church name */}
            <motion.h3
              className="mt-2 leading-snug"
              style={{ fontFamily: FONT.heading, fontSize: "16px", fontWeight: 600, color: COLOR.heading }}
              animate={{ x: isHovered ? 3 : 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              {church.name}
            </motion.h3>

            {/* Animated underline */}
            <motion.div
              className="mt-1 h-px origin-left"
              style={{ background: `linear-gradient(to right, ${COLOR.accent}80, transparent)` }}
              animate={{ scaleX: isHovered || isExpanded ? 1 : 0.25 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />

            {/* Address */}
            {church.address && (
              <p className="mt-2 text-sm" style={{ fontFamily: FONT.body, color: COLOR.body }}>
                {church.address}
              </p>
            )}

            {/* Coordinates (expanded only) */}
            <AnimatePresence>
              {isExpanded && church.lat && (
                <motion.p
                  className="mt-1 font-mono text-xs"
                  style={{ color: COLOR.accent, fontFamily: FONT.mono }}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  {church.lat.toFixed(4)}° N, {church.lng.toFixed(4)}° E
                </motion.p>
              )}
            </AnimatePresence>

            {/* Days badges */}
            {church.days && church.days.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {church.days.map((day) => (
                  <span
                    key={day}
                    className="rounded-md border px-2.5 py-0.5 text-xs"
                    style={{
                      fontFamily: FONT.body,
                      borderColor: `${COLOR.accentAmber}66`,
                      background: `${COLOR.accentAmber}18`,
                      color: COLOR.accentAmber,
                    }}
                  >
                    {day}
                  </span>
                ))}
              </div>
            )}

            {/* Action buttons */}
            <div className="mt-4 flex flex-wrap gap-2">
              <ActionButton onClick={onViewOnMap}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                Ver no Mapa
              </ActionButton>

              {church.website && (
                <ActionButton href={church.website}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                  Abrir Website
                </ActionButton>
              )}

              {church.phoneNumber && (
                <ActionButton href={`tel:${church.phoneNumber.replace(/\s/g, "")}`}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.5 2 2 0 0 1 3.6 1.32h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.5 16.92z"/>
                  </svg>
                  Ligar
                </ActionButton>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Hint tooltip */}
      <AnimatePresence>
        {isHovered && !isExpanded && (
          <motion.p
            className="mt-2 text-center text-[10px] text-gray-400"
            style={{ fontFamily: FONT.body }}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.2 }}
          >
            Click ↑ to expand map
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
