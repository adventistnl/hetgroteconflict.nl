"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { churchsDatabase, iChurchs } from "@/database/churchs";
import { haversineDistance } from "@/utils/haversine";
import { COLOR, FONT } from "./theme";

// ── Types ──────────────────────────────────────────────────
interface ChurchWithDistance extends iChurchs {
  distance?: number;
}

type SortMode = "proximity" | "az";

interface Props {
  userCoords?: { lat: number; lng: number } | null;
  nearestId?: string;
}

// ── Constants ────────────────────────────────────────────
const ITEMS_PER_PAGE = 12;

// ── Small helpers ──────────────────────────────────────────
function DayBadge({ day }: { day: string }) {
  return (
    <span
      className="rounded-md border px-2 py-0.5 text-[10px] font-medium"
      style={{
        fontFamily: FONT.body,
        borderColor: `${COLOR.accentAmber}55`,
        background: `${COLOR.accentAmber}14`,
        color: COLOR.accentAmber,
      }}
    >
      {day}
    </span>
  );
}

// ── StaticMapThumbnail ─────────────────────────────────────
function StaticMapThumbnail({ accent = COLOR.accent }: { accent?: string }) {
  return (
    <div className="absolute inset-0" style={{ background: "#e8eaed" }}>
      <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
        <line x1="0%" y1="32%" x2="100%" y2="32%" stroke="white" strokeWidth="5" />
        <line x1="0%" y1="62%" x2="100%" y2="62%" stroke="white" strokeWidth="5" />
        <line x1="28%" y1="0%" x2="28%" y2="100%" stroke="white" strokeWidth="5" />
        <line x1="68%" y1="0%" x2="68%" y2="100%" stroke="white" strokeWidth="5" />
        <line x1="0%" y1="18%" x2="100%" y2="18%" stroke="white" strokeWidth="2" />
        <line x1="0%" y1="48%" x2="100%" y2="48%" stroke="white" strokeWidth="2" />
        <line x1="13%" y1="0%" x2="13%" y2="100%" stroke="white" strokeWidth="2" />
        <line x1="47%" y1="0%" x2="47%" y2="100%" stroke="white" strokeWidth="2" />
      </svg>
      <div className="absolute rounded-sm" style={{ top: "38%", left: "8%", width: "17%", height: "20%", background: "#cbd2d9" }} />
      <div className="absolute rounded-sm" style={{ top: "12%", left: "33%", width: "13%", height: "16%", background: "#cbd2d9" }} />
      <div className="absolute rounded-sm" style={{ top: "6%", left: "72%", width: "15%", height: "11%", background: "#cbd2d9" }} />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ filter: `drop-shadow(0 2px 4px ${accent}88)` }}>
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill={accent} />
          <circle cx="12" cy="9" r="2.5" fill="white" />
        </svg>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white via-white/60 to-transparent" />
    </div>
  );
}

// ── SearchBar ─────────────────────────────────────────────
function SearchBar({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div className="relative flex-1">
      <svg
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke={COLOR.accent}
        strokeWidth="2"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border py-2.5 pl-9 pr-4 text-sm outline-none transition-all focus:ring-2"
        style={{
          fontFamily: FONT.body,
          borderColor: COLOR.cardBorder,
          background: COLOR.cardBg,
          color: COLOR.heading,
          // @ts-expect-error custom property
          "--tw-ring-color": `${COLOR.accent}40`,
        }}
      />
    </div>
  );
}

// ── SortToggle ──────────────────────────────────────────────
function SortToggle({
  mode,
  hasLocation,
  onChange,
  labelProximity,
  labelAZ,
  tooltipProximity,
}: {
  mode: SortMode;
  hasLocation: boolean;
  onChange: (m: SortMode) => void;
  labelProximity: string;
  labelAZ: string;
  tooltipProximity: string;
}) {
  const options: { value: SortMode; label: string; icon: React.ReactNode }[] = [
    {
      value: "proximity",
      label: labelProximity,
      icon: (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
        </svg>
      ),
    },
    {
      value: "az",
      label: labelAZ,
      icon: (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="15" y2="12" />
          <line x1="3" y1="18" x2="9" y2="18" />
        </svg>
      ),
    },
  ];

  return (
    <div
      className="flex overflow-hidden rounded-xl border"
      style={{ borderColor: COLOR.cardBorder }}
    >
      {options.map((opt) => {
        const active = mode === opt.value;
        const disabled = opt.value === "proximity" && !hasLocation;
        return (
          <button
            key={opt.value}
            onClick={() => !disabled && onChange(opt.value)}
            disabled={disabled}
            title={disabled ? tooltipProximity : undefined}
            className="flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium transition-all disabled:cursor-not-allowed disabled:opacity-40"
            style={{
              fontFamily: FONT.body,
              background: active ? COLOR.accent : "transparent",
              color: active ? "#fff" : COLOR.body,
            }}
          >
            {opt.icon}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

// ── ChurchCard ─────────────────────────────────────────────
function ChurchCard({
  church,
  isNearest,
  isNearby,
  rank,
  userCoords,
  t,
}: {
  church: ChurchWithDistance;
  isNearest: boolean;
  isNearby: boolean;
  rank?: number;
  userCoords?: { lat: number; lng: number } | null;
  t: ReturnType<typeof useTranslations<"find-church">>;
}) {
  const [showDirections, setShowDirections] = useState(false);

  const borderColor = isNearest
    ? COLOR.accent
    : isNearby
    ? `${COLOR.accent}55`
    : COLOR.cardBorder;

  const mapsUrl = userCoords
    ? `https://www.google.com/maps/dir/?api=1&origin=${userCoords.lat},${userCoords.lng}&destination=${church.lat},${church.lng}`
    : `https://www.google.com/maps/dir/?api=1&destination=${church.lat},${church.lng}`;
  const wazeUrl = `https://waze.com/ul?ll=${church.lat},${church.lng}&navigate=yes`;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
      className="relative flex flex-col rounded-2xl border bg-white"
      style={{
        borderColor,
        boxShadow: isNearest
          ? `0 0 0 1px ${COLOR.accent}30, 0 4px 20px ${COLOR.accent}18`
          : `0 1px 4px rgba(0,0,0,0.04)`,
      }}
    >
      {/* Map thumbnail */}
      <div className="relative h-28 flex-shrink-0 overflow-hidden rounded-t-2xl">
        <StaticMapThumbnail accent={isNearest ? COLOR.accent : undefined} />
        {isNearest && (
          <div
            className="absolute inset-x-0 bottom-0 h-1"
            style={{ background: `linear-gradient(to right, ${COLOR.accent}, ${COLOR.accent}88)` }}
          />
        )}
        {rank !== undefined && rank <= 5 && (
          <div
            className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold shadow-sm"
            style={{
              background: isNearest ? COLOR.accent : "white",
              color:      isNearest ? "#fff"       : COLOR.accent,
              fontFamily: FONT.mono,
              border:     isNearest ? "none"       : `1px solid ${COLOR.accent}44`,
            }}
          >
            {rank}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        {/* Badges */}
        {isNearest && (
          <span
            className="inline-flex w-fit items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
            style={{ background: `${COLOR.accent}18`, color: COLOR.accent, fontFamily: FONT.mono }}
          >
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: COLOR.accent }} />
            {t("directory.nearest")}
          </span>
        )}
        {isNearby && !isNearest && (
          <span
            className="inline-flex w-fit items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide"
            style={{ background: `${COLOR.accent}0d`, color: `${COLOR.accent}bb`, fontFamily: FONT.mono }}
          >
            {t("directory.nearby")}
          </span>
        )}

        {/* Name */}
        <h3
          className="leading-snug"
          style={{ fontFamily: FONT.heading, fontSize: "14px", fontWeight: 600, color: COLOR.heading }}
        >
          {church.name}
        </h3>

        {/* Address */}
        {church.address && (
          <p className="line-clamp-2 text-xs leading-relaxed" style={{ fontFamily: FONT.body, color: COLOR.body }}>
            {church.address}
          </p>
        )}

        {/* Distance */}
        {church.distance !== undefined && (
          <p className="flex items-center gap-1 text-xs font-medium" style={{ fontFamily: FONT.mono, color: COLOR.accent }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
            {church.distance.toFixed(1)} km
          </p>
        )}

        {/* Days */}
        {church.days && church.days.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {church.days.map((d) => <DayBadge key={d} day={d} />)}
          </div>
        )}

        <div className="flex-1" />

        {/* Footer */}
        <div className="mt-2 flex flex-col gap-2 border-t pt-3" style={{ borderColor: COLOR.cardBorder }}>
          <div className="flex gap-2">
          {church.website ? (
            <a
              href={church.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center gap-1 rounded-lg py-1.5 text-[11px] font-medium transition-colors hover:opacity-80"
              style={{ background: `${COLOR.accent}10`, color: COLOR.accent, fontFamily: FONT.body }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              {t("directory.website")}
            </a>
          ) : (
            <span
              className="flex flex-1 items-center justify-center gap-1 rounded-lg py-1.5 text-[11px] font-medium cursor-not-allowed opacity-35"
              style={{ background: `${COLOR.accent}06`, color: COLOR.accent, fontFamily: FONT.body }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              {t("directory.website")}
            </span>
          )}
          {church.phoneNumber ? (
            <a
              href={`tel:${church.phoneNumber.replace(/\s/g, "")}`}
              className="flex flex-1 items-center justify-center gap-1 rounded-lg py-1.5 text-[11px] font-medium transition-colors hover:opacity-80"
              style={{ background: "rgba(0,0,0,0.04)", color: COLOR.body, fontFamily: FONT.body }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.5 2 2 0 0 1 3.6 1.32h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.5 16.92z" />
              </svg>
              {t("directory.call")}
            </a>
          ) : (
            <span
              className="flex flex-1 items-center justify-center gap-1 rounded-lg py-1.5 text-[11px] font-medium cursor-not-allowed opacity-35"
              style={{ background: "rgba(0,0,0,0.02)", color: COLOR.body, fontFamily: FONT.body }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.5 2 2 0 0 1 3.6 1.32h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.5 16.92z" />
              </svg>
              {t("directory.call")}
            </span>
          )}          </div>

          {/* Get Directions */}
          {!showDirections ? (
            <button
              onClick={() => setShowDirections(true)}
              className="flex w-full items-center justify-center gap-1.5 rounded-lg py-1.5 text-[11px] font-semibold transition-colors"
              style={{
                background: `${COLOR.accent}14`,
                color: COLOR.accent,
                fontFamily: FONT.body,
              }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="3 11 22 2 13 21 11 13 3 11" />
              </svg>
              {t("directory.getDirections")}
            </button>
          ) : (
            <div className="flex gap-1.5">
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setShowDirections(false)}
                className="flex flex-1 items-center justify-center gap-1 rounded-lg py-1.5 text-[11px] font-semibold transition-colors"
                style={{
                  background: "#4285F418",
                  color: "#1A73E8",
                  fontFamily: FONT.body,
                  border: "1px solid #4285F430",
                }}
              >
                <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                {t("directory.maps")}
              </a>
              <a
                href={wazeUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setShowDirections(false)}
                className="flex flex-1 items-center justify-center gap-1 rounded-lg py-1.5 text-[11px] font-semibold transition-colors"
                style={{
                  background: "#05C8F818",
                  color: "#05A8E4",
                  fontFamily: FONT.body,
                  border: "1px solid #05C8F830",
                }}
              >
                <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0zm-8 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
                </svg>
                {t("directory.waze")}
              </a>
              <button
                onClick={() => setShowDirections(false)}
                className="flex items-center justify-center rounded-lg px-2.5 text-xs transition-colors"
                style={{ background: "rgba(0,0,0,0.05)", color: COLOR.body }}
                aria-label="Fechar"
              >
                ✕
              </button>
            </div>
          )}        </div>
      </div>
    </motion.div>
  );
}

// ── Pagination ─────────────────────────────────────────────
function Pagination({
  current,
  total,
  onChange,
  labelPrev,
  labelNext,
}: {
  current: number;
  total: number;
  onChange: (p: number) => void;
  labelPrev: string;
  labelNext: string;
}) {
  if (total <= 1) return null;

  const pages: (number | "...")[] = [];
  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    pages.push(1);
    if (current > 3) pages.push("...");
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
      pages.push(i);
    }
    if (current < total - 2) pages.push("...");
    pages.push(total);
  }

  return (
    <div className="mt-10 flex flex-wrap items-center justify-center gap-1">
      <button
        onClick={() => onChange(current - 1)}
        disabled={current === 1}
        className="flex items-center gap-1 rounded-lg border px-3 py-2 text-xs font-medium transition-colors hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-40"
        style={{ fontFamily: FONT.body, borderColor: COLOR.cardBorder, color: COLOR.body }}
      >
        {labelPrev}
      </button>
      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`ell-${i}`} className="px-1 text-sm text-gray-400">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p as number)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium transition-all"
            style={{
              fontFamily: FONT.mono,
              background: current === p ? COLOR.accent : "transparent",
              color:      current === p ? "#fff"       : COLOR.body,
              border:     current === p ? "none"       : `1px solid ${COLOR.cardBorder}`,
            }}
          >
            {p}
          </button>
        ),
      )}
      <button
        onClick={() => onChange(current + 1)}
        disabled={current === total}
        className="flex items-center gap-1 rounded-lg border px-3 py-2 text-xs font-medium transition-colors hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-40"
        style={{ fontFamily: FONT.body, borderColor: COLOR.cardBorder, color: COLOR.body }}
      >
        {labelNext}
      </button>
    </div>
  );
}

// ── ChurchesDirectorySection ───────────────────────────────
export function ChurchesDirectorySection({ userCoords, nearestId }: Props) {
  const t = useTranslations("find-church");
  const [query, setQuery]             = useState("");
  const [sort, setSort]               = useState<SortMode>(userCoords ? "proximity" : "az");
  const [currentPage, setCurrentPage] = useState(1);

  const hasLocation = !!userCoords;

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [query, sort]);

  // Enrich each church with distance
  const enriched = useMemo<ChurchWithDistance[]>(() => {
    if (!userCoords) return churchsDatabase;
    return churchsDatabase.map((c) => ({
      ...c,
      distance: haversineDistance(userCoords.lat, userCoords.lng, c.lat, c.lng),
    }));
  }, [userCoords]);

  // Filter by query (name or city)
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return enriched;
    return enriched.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.address ?? "").toLowerCase().includes(q),
    );
  }, [enriched, query]);

  // Sort
  const sorted = useMemo(() => {
    if (sort === "proximity" && hasLocation) {
      return [...filtered].sort((a, b) => (a.distance ?? 9999) - (b.distance ?? 9999));
    }
    return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
  }, [filtered, sort, hasLocation]);

  // Nearby threshold: 50 km
  const nearbyThreshold = 50;

  // Pagination
  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE);
  const paginated  = sorted.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <section
      id="churches-directory"
      className="w-full pb-24 pt-16"
      style={{ background: COLOR.pageBg }}
    >
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-10">
        {/* Section header */}
        <div className="mb-8 flex flex-col gap-2">
          <p
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ fontFamily: FONT.body, color: COLOR.accent }}
          >
            {t("directory.label")}
          </p>
          <h2
            className="text-2xl font-bold md:text-3xl"
            style={{ fontFamily: FONT.heading, color: COLOR.heading }}
          >
            {t("directory.heading")}
          </h2>
          <p
            className="max-w-xl text-sm leading-relaxed"
            style={{ fontFamily: FONT.body, color: COLOR.body }}
          >
            {hasLocation
              ? t("directory.subtitleWithLocation")
              : t("directory.subtitleNoLocation")}
          </p>
        </div>

        {/* Search & filter bar */}
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder={t("directory.searchPlaceholder")}
          />
          <SortToggle
            mode={sort}
            hasLocation={hasLocation}
            onChange={setSort}
            labelProximity={t("directory.sortProximity")}
            labelAZ={t("directory.sortAZ")}
            tooltipProximity={t("directory.locationTooltip")}
          />
        </div>

        {/* Results count */}
        <p
          className="mb-5 text-xs"
          style={{ fontFamily: FONT.mono, color: COLOR.body }}
        >
          {sorted.length === 1
            ? t("directory.results", { count: sorted.length })
            : t("directory.resultsPlural", { count: sorted.length })}
          {query && ` ${t("directory.resultsFor", { query })}`}
          {totalPages > 1 && ` · ${t("directory.page", { current: currentPage, total: totalPages })}`}
        </p>

        {/* Cards grid */}
        <motion.div
          layout
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          <AnimatePresence mode="popLayout">
            {paginated.map((church, idx) => {
              const globalIdx = (currentPage - 1) * ITEMS_PER_PAGE + idx;
              const isNearest = church.id === nearestId;
              const isNearby  =
                hasLocation &&
                !isNearest &&
                church.distance !== undefined &&
                church.distance <= nearbyThreshold;
              const rank =
                sort === "proximity" && hasLocation ? globalIdx + 1 : undefined;

              return (
                <ChurchCard
                  key={church.id}
                  church={church}
                  isNearest={isNearest}
                  isNearby={isNearby}
                  rank={rank}
                  userCoords={userCoords}
                  t={t}
                />
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Empty state */}
        {sorted.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-20 text-center">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={COLOR.accent} strokeWidth="1.5">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <p style={{ fontFamily: FONT.body, color: COLOR.body, fontSize: "14px" }}>
              {t("directory.noResults", { query })}
            </p>
            <button
              onClick={() => setQuery("")}
              className="text-xs underline"
              style={{ fontFamily: FONT.body, color: COLOR.accent }}
            >
              {t("directory.clearSearch")}
            </button>
          </div>
        )}

        {/* Pagination */}
        <Pagination
          current={currentPage}
          total={totalPages}
          labelPrev={t("directory.prev")}
          labelNext={t("directory.next")}
          onChange={(p) => {
            setCurrentPage(p);
            document.getElementById("churches-directory")?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
        />
      </div>
    </section>
  );
}
