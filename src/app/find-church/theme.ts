/**
 * find-church/theme.ts
 * ─────────────────────────────────────────────────────────
 * Centralizes all design tokens used across the Find-a-Church
 * page components. Edit here to update colors/fonts everywhere.
 * ─────────────────────────────────────────────────────────
 */

// ── Typography ────────────────────────────────────────────
export const FONT = {
  heading: "var(--font-plus-jakarta-sans)",
  body: "var(--font-rubik)",
  mono: "var(--font-rubik)", // monospaced labels use rubik
} as const;

// ── Colors ────────────────────────────────────────────────
// All CSS-variable-based so they automatically adapt to the
// global theme in globals.css / tailwind.config.ts.
export const COLOR = {
  // Text
  heading:     "hsl(var(--primary))",
  body:        "hsl(var(--gray))",
  accent:      "#4fa6c2",          // primary blue of the website
  accentAmber: "#d97706",          // amber for days badges
  muted:       "hsl(var(--muted-foreground))",

  // Surfaces
  cardBg:   "#ffffff",
  pageBg:   "hsl(var(--secondary))",

  // Borders
  cardBorder:   "hsl(var(--primary) / 0.1)",
  inputBorder:  "hsl(var(--primary) / 0.2)",
} as const;

// ── Stats shown at the bottom of the map section ─────────
export const MAP_STATS = [
  { value: "64+", label: "Churches" },
  { value: "12",  label: "Provinces" },
  { value: "Sat", label: "Main Day" },
  { value: "NL",  label: "Country" },
] as const;
