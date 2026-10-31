// ── Globe Scroll Config ─────────────────────────────────────────────────────
// Backs the ScrollGlobe hero section (components/ui/landing-page.tsx +
// components/ui/globe.tsx). Sizing, timing, and all section copy live in
// globe-scroll.json so they can be tweaked without touching component code;
// this file just types that JSON and turns it into the shapes the
// components expect. Action `onClick`s can't live in JSON (functions aren't
// serializable) — each action carries an `id` instead, resolved against
// GLOBE_SCROLL_ACTION_HANDLERS below.

import raw from "@/database/globe-scroll.json";

export interface GlobeVisualConfig {
  /** Diameter cap in viewport-height units, e.g. 46 → "46vh". */
  sizeVh: number;
  /** Diameter cap in viewport-width units, e.g. 29 → "29vw". */
  sizeVw: number;
  transitionDurationMs: number;
  transitionEasing: string;
  /** One backdrop-opacity value per section, indexed by section position. */
  opacityBySection: number[];
}

export interface GlobePosition {
  top: string;
  left: string;
  scale: number;
}

export type SectionAlign = "left" | "center" | "right";

export interface GlobeSectionAction {
  id: string;
  label: string;
  variant: "primary" | "secondary";
}

export interface GlobeSectionFeature {
  title: string;
  description: string;
}

export interface GlobeSectionContent {
  id: string;
  badge?: string;
  title: string;
  subtitle?: string;
  description: string;
  align?: SectionAlign;
  features?: GlobeSectionFeature[];
  actions?: GlobeSectionAction[];
}

interface GlobeScrollConfigShape {
  globe: GlobeVisualConfig;
  positions: GlobePosition[];
  sections: GlobeSectionContent[];
}

const config = raw as GlobeScrollConfigShape;

export const GLOBE_VISUAL_CONFIG: GlobeVisualConfig = config.globe;

/** CSS `min()` size expression for the Globe component's `size` prop. */
export const GLOBE_SIZE_CSS = `min(${GLOBE_VISUAL_CONFIG.sizeVh}vh,${GLOBE_VISUAL_CONFIG.sizeVw}vw)`;

export const GLOBE_SCROLL_POSITIONS: GlobePosition[] = config.positions;

export const GLOBE_SCROLL_SECTIONS: GlobeSectionContent[] = config.sections;

/**
 * Real click behaviour for each action `id` declared in globe-scroll.json.
 * Add an entry here whenever a new action `id` is added to the JSON.
 */
export const GLOBE_SCROLL_ACTION_HANDLERS: Record<string, () => void> = {
  "begin-journey": () => console.log("Get started clicked"),
  "learn-more": () => console.log("Learn more clicked"),
  "join-movement": () => console.log("Join clicked"),
  "explore-more": () => console.log("Explore clicked"),
};
