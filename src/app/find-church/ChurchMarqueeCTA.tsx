"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { track } from "@vercel/analytics";
import { churchsDatabase } from "@/database/churchs";
import { FONT } from "./theme";

// YouTube looping background (same pattern as HeroSection)
const BG_VIDEO_URL =
  "https://www.youtube.com/embed/cAa9ly6SAhU?autoplay=1&mute=1&loop=1&playlist=cAa9ly6SAhU&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1";

// ── CTA Button (dark-bg variant) ───────────────────
function CTAButton({
  text,
  href,
  primary = false,
  onClick,
}: {
  text: string;
  href?: string;
  primary?: boolean;
  onClick?: (() => void);
}) {
  const cls = primary
    ? "inline-flex items-center gap-2 rounded-full bg-[#4fa6c2] px-7 py-3 text-sm font-bold text-white shadow-lg"
    : "inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-7 py-3 text-sm font-semibold text-white backdrop-blur-sm";

  if (href) {
    return (
      <Link href={href} className={cls} style={{ fontFamily: FONT.body }}>
        {text}
      </Link>
    );
  }
  return (
    <button className={cls} style={{ fontFamily: FONT.body }} onClick={onClick}>
      {text}
    </button>
  );
}

// ── Church card — glass style for dark background ────────
function ChurchCard({ name, city }: { name: string; city?: string }) {
  return (
    <div className="flex w-56 shrink-0 flex-col gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 py-5 shadow backdrop-blur-sm sm:w-64 sm:px-6">
      {/* Icon */}
      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#4fa6c2]/30 sm:h-8 sm:w-8">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#4fa6c2"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      </div>
      {/* Name */}
      <p
        className="line-clamp-2 text-xs font-semibold leading-snug text-white sm:text-sm"
        style={{ fontFamily: FONT.heading }}
      >
        {name}
      </p>
      {/* City */}
      {city && (
        <p
          className="text-xs text-white/60"
          style={{ fontFamily: FONT.body }}
        >
          {city}
        </p>
      )}
    </div>
  );
}

// ── Extract city from address string ────────────────────
function extractCity(address?: string): string | undefined {
  if (!address) return undefined;
  const parts = address.split(",");
  const firstPart = parts[0]?.trim() ?? "";
  const words = firstPart.split(" ");
  const cityWords: string[] = [];
  let pastNumber = false;
  for (const w of words) {
    if (/^\d/.test(w)) { pastNumber = true; continue; }
    if (pastNumber) cityWords.push(w);
  }
  return cityWords.join(" ") || parts[1]?.trim();
}

// ── Marquee row ──────────────────────────────────────────
type MarqueeSpeed = "normal" | "reverse" | "slow";
function MarqueeRow({
  items,
  speed = "normal",
}: {
  items: typeof churchsDatabase;
  speed?: MarqueeSpeed;
}) {
  const cls =
    speed === "reverse"
      ? "animate-marquee-rev"
      : speed === "slow"
      ? "animate-marquee-cta-slow"
      : "animate-marquee-cta";

  return (
    <div className="flex overflow-hidden">
      {/* Copy 1 */}
      <div className={`flex min-w-full shrink-0 items-center gap-3 sm:gap-4 ${cls}`}>
        {items.map((c) => (
          <ChurchCard key={c.id} name={c.name} city={extractCity(c.address)} />
        ))}
      </div>
      {/* Copy 2 — seamless loop */}
      <div
        className={`flex min-w-full shrink-0 items-center gap-3 sm:gap-4 ${cls}`}
        aria-hidden="true"
      >
        {items.map((c) => (
          <ChurchCard key={`dup-${c.id}`} name={c.name} city={extractCity(c.address)} />
        ))}
      </div>
    </div>
  );
}

// ── Main component ───────────────────────────────────────
export function ChurchMarqueeCTA() {
  const locale = useLocale();
  const t = useTranslations("find-church");

  // Split churches into 3 rows
  const total = churchsDatabase.length;
  const third = Math.ceil(total / 3);
  const row1  = churchsDatabase.slice(0, third);
  const row2  = churchsDatabase.slice(third, third * 2);
  const row3  = churchsDatabase.slice(third * 2);

  const scrollToMap = () => {
    document.getElementById("church-map")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="relative min-h-[580px] w-full overflow-hidden bg-[#1e1e2e] lg:min-h-[680px]">
      {/* ── Video background ── */}
      <div className="pointer-events-none absolute inset-0">
        <iframe
          src={BG_VIDEO_URL}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "max(100%, calc(100vh * 16 / 9))",
            height: "max(100%, calc(100vw * 9 / 16))",
            transform: "translate(-50%, -50%)",
          }}
          allow="autoplay; encrypted-media"
          title="Church community background"
        />
      </div>

      {/* ── Overlays ── */}
      <div className="absolute inset-0 bg-black/70" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />

      {/* ── Content ── */}
      <div className="relative z-10 flex min-h-[580px] flex-col lg:min-h-[680px] lg:flex-row">
        {/* Text column — above marquee on mobile, left column on desktop */}
        <div className="relative z-10 flex flex-col justify-center gap-5 px-6 py-20 pt-32 sm:px-10 sm:pt-36 lg:order-1 lg:w-5/12 lg:px-14 lg:py-28 lg:pt-40 xl:w-2/5">
          {/* Eyebrow */}
          <p
            className="text-xs font-semibold uppercase tracking-widest text-[#4fa6c2]"
            style={{ fontFamily: FONT.body }}
          >
            {t("hero.eyebrow")}
          </p>

          {/* Badge */}
          <span
            className="w-fit rounded-full border border-white/20 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-white/60"
            style={{ fontFamily: FONT.body }}
          >
            {t("hero.badge")}
          </span>

          {/* Title */}
          <h1
            className="max-w-xl text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl"
            style={{ fontFamily: FONT.heading }}
          >
            {t("hero.title")}
          </h1>

          {/* Subtitle */}
          <p
            className="max-w-sm text-sm leading-relaxed text-gray-300 sm:text-base"
            style={{ fontFamily: FONT.body }}
          >
            {t("hero.subtitle")}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3 pt-1">
            <CTAButton
              text={t("hero.exploreMap")}
              primary
              onClick={() => { track("findChurch_heroExplore"); scrollToMap(); }}
            />
            <CTAButton
              text={t("hero.studyGuide")}
              href={`/${locale}/guide`}
              onClick={() => track("findChurch_heroStudyGuide")}
            />
          </div>
        </div>

        {/* Marquee — absolute behind text on mobile, right column on desktop */}
        <div
          className="absolute inset-0 flex flex-col justify-center gap-3 overflow-hidden opacity-[0.18] lg:relative lg:inset-auto lg:order-2 lg:flex-1 lg:py-24 lg:opacity-100"
          style={{
            WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 28%)",
            maskImage: "linear-gradient(to right, transparent 0%, black 28%)",
          }}
        >
          <MarqueeRow items={row1} speed="normal" />
          <MarqueeRow items={row2} speed="reverse" />
          <MarqueeRow items={row3} speed="slow" />
        </div>
      </div>
    </section>
  );
}
