import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        primary: ["var(--font-primary)", "ui-sans-serif", "system-ui", "sans-serif"],
        secondary: ["var(--font-secondary)", "ui-sans-serif", "system-ui", "sans-serif"],
        "display-accent": ["var(--font-display-accent)", "serif"],
        // Legacy names — kept so the many existing `font-rubik` /
        // `font-plus-jakarta-sans` class references (already wired through
        // the same CSS variables) keep working under the new type system.
        rubik: ["var(--font-rubik)", "ui-sans-serif", "system-ui", "sans-serif"],
        "plus-jakarta-sans": ["var(--font-plus-jakarta-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      fontSize: {
        // Typography scale tokens — display/h1/h2/h3 use the primary font
        // at a light-to-medium weight with slightly negative tracking, per
        // the editorial/Swiss-neo-grotesk direction; body copy stays
        // roomier (1.5–1.65 line-height) for readability.
        display: ["3.5rem", { lineHeight: "1.05", letterSpacing: "-0.04em", fontWeight: "500" }],
        h1: ["2.75rem", { lineHeight: "1.1", letterSpacing: "-0.035em", fontWeight: "500" }],
        h2: ["2rem", { lineHeight: "1.15", letterSpacing: "-0.03em", fontWeight: "500" }],
        h3: ["1.5rem", { lineHeight: "1.25", letterSpacing: "-0.02em", fontWeight: "500" }],
        body: ["1rem", { lineHeight: "1.6", letterSpacing: "0em", fontWeight: "400" }],
        "body-small": ["0.875rem", { lineHeight: "1.55", letterSpacing: "0em", fontWeight: "400" }],
        caption: ["0.75rem", { lineHeight: "1.5", letterSpacing: "0.01em", fontWeight: "400" }],
        button: ["0.875rem", { lineHeight: "1", letterSpacing: "-0.01em", fontWeight: "600" }],
        label: ["0.8125rem", { lineHeight: "1.4", letterSpacing: "0em", fontWeight: "500" }],
      },
      colors: {
        gray: "hsl(var(--gray))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        deep_blue: "hsl(var(--deep-blue))",
        black: "hsl(var(--black))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      screens: {
        smMobile: "320px",
        mdMobile: "360px",
        mobile: "375px",
        lgMobile: "414",
        tablet: "768px",
        laptop: "1024px",
        desktop: "1280px",
        largeDesktop: "1480px",
        extraLargeDesktop: "1920px",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
