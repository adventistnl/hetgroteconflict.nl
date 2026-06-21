"use client";

import dynamic from "next/dynamic";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useTranslations } from "next-intl";
import { churchsDatabase, iChurchs } from "@/database/churchs";
import { haversineDistance } from "@/utils/haversine";
import { ChurchMapHeader } from "./ChurchMapHeader";
import { ChurchesDirectorySection } from "./ChurchesDirectorySection";
import { COLOR, FONT } from "./theme";

// ── Types ─────────────────────────────────────────────────
interface NearestChurch extends iChurchs {
  distance: number;
}

// ── Lazy-loaded map (Leaflet requires browser APIs) ───────
const ChurchMap = dynamic(() => import("@/components/ChurchMap"), {
  ssr: false,
  loading: () => (
    <div
      className="flex h-full w-full items-center justify-center"
      style={{ background: COLOR.pageBg }}
    >
      <span className="text-sm" style={{ color: COLOR.body }}>
        {"Loading map\u2026"}
      </span>
    </div>
  ),
});

// ── Helpers ───────────────────────────────────────────────
function findNearest(
  coords: { lat: number; lng: number },
): NearestChurch | null {
  let nearest: NearestChurch | null = null;
  let minDist = Infinity;
  for (const church of churchsDatabase) {
    const d = haversineDistance(coords.lat, coords.lng, church.lat, church.lng);
    if (d < minDist) {
      minDist = d;
      nearest = { ...church, distance: d };
    }
  }
  return nearest;
}

// ── StaticMapThumbnail ────────────────────────────────────
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

// ── RegionChurchCard ─────────────────────────────────────────
interface RegionChurch extends iChurchs { distance: number; }

interface RouteTarget {
  church: RegionChurch;
  mapsUrl: string;
  wazeUrl: string;
}

function RegionChurchCard({
  church,
  isNearest = false,
  onGetDirections,
  t,
}: {
  church: RegionChurch;
  isNearest?: boolean;
  onGetDirections: () => void;
  t: ReturnType<typeof useTranslations<"find-church">>;
}) {
  const bg         = isNearest ? COLOR.accent : "white";
  const textHead   = isNearest ? "#fff" : COLOR.heading;
  const textSub    = isNearest ? "rgba(255,255,255,0.8)" : COLOR.body;
  const textAccent = isNearest ? "rgba(255,255,255,0.9)" : COLOR.accent;
  const borderTop  = isNearest ? "rgba(255,255,255,0.25)" : COLOR.cardBorder;

  return (
    <div
      className="flex min-w-[190px] flex-1 flex-col rounded-2xl border shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
      style={{
        borderColor: isNearest ? "transparent" : COLOR.cardBorder,
        background: bg,
        boxShadow: isNearest ? `0 4px 24px ${COLOR.accent}55` : "0 1px 4px rgba(0,0,0,0.04)",
      }}
    >
      {/* Map thumbnail */}
      <div className="relative h-28 flex-shrink-0 overflow-hidden rounded-t-2xl">
        <StaticMapThumbnail accent={isNearest ? "white" : COLOR.accent} />
        {isNearest && (
          <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 backdrop-blur-sm">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
            <span className="text-[9px] font-semibold uppercase tracking-wide text-white">{t("region.nearest")}</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        {/* Distance */}
        <p
          className="flex items-center gap-1 text-[10px] font-medium"
          style={{ fontFamily: FONT.mono, color: textAccent }}
        >
          <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
          {church.distance.toFixed(1)} km
        </p>

        {/* Name */}
        <h4
          className="line-clamp-2 text-sm font-semibold leading-snug"
          style={{ fontFamily: FONT.heading, color: textHead }}
        >
          {church.name}
        </h4>

        {/* Address */}
        {church.address && (
          <p
            className="line-clamp-2 text-[10px] leading-relaxed"
            style={{ fontFamily: FONT.body, color: textSub }}
          >
            {church.address}
          </p>
        )}

        {/* Days */}
        {church.days && church.days.length > 0 && (
          <span
            className="mt-0.5 inline-block w-fit rounded-md border px-1.5 py-0.5 text-[9px]"
            style={
              isNearest
                ? { borderColor: "rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.15)", color: "white", fontFamily: FONT.body }
                : { borderColor: `${COLOR.accentAmber}55`, background: `${COLOR.accentAmber}14`, color: COLOR.accentAmber, fontFamily: FONT.body }
            }
          >
            {church.days[0]}
          </span>
        )}

        <div className="flex-1" />

        {/* Footer */}
        <div
          className="mt-3 flex flex-col gap-2 border-t pt-3"
          style={{ borderColor: borderTop }}
        >
          <div className="flex gap-2">
          {church.website ? (
            <a
              href={church.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center gap-1 rounded-lg py-1.5 text-[11px] font-medium transition-colors"
              style={{ background: isNearest ? "rgba(255,255,255,0.2)" : `${COLOR.accent}10`, color: isNearest ? "white" : COLOR.accent, fontFamily: FONT.body }}
            >
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              {t("region.website")}
            </a>
          ) : (
            <span
              className="flex flex-1 items-center justify-center gap-1 rounded-lg py-1.5 text-[11px] font-medium cursor-not-allowed opacity-35"
              style={{ background: isNearest ? "rgba(255,255,255,0.1)" : `${COLOR.accent}06`, color: isNearest ? "white" : COLOR.accent, fontFamily: FONT.body }}
            >
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              {t("region.website")}
            </span>
          )}
          {church.phoneNumber ? (
            <a
              href={`tel:${church.phoneNumber.replace(/\s/g, "")}`}
              className="flex flex-1 items-center justify-center gap-1 rounded-lg py-1.5 text-[11px] font-medium transition-colors"
              style={{ background: isNearest ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.04)", color: isNearest ? "white" : COLOR.body, fontFamily: FONT.body }}
            >
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.5 2 2 0 0 1 3.6 1.32h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.5 16.92z" />
              </svg>
              {t("region.call")}
            </a>
          ) : (
            <span
              className="flex flex-1 items-center justify-center gap-1 rounded-lg py-1.5 text-[11px] font-medium cursor-not-allowed opacity-35"
              style={{ background: isNearest ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.02)", color: isNearest ? "white" : COLOR.body, fontFamily: FONT.body }}
            >
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.5 2 2 0 0 1 3.6 1.32h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.5 16.92z" />
              </svg>
              {t("region.call")}
            </span>
          )}
          </div>

          {/* Get Directions */}
          <button
            onClick={onGetDirections}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg py-1.5 text-[11px] font-semibold transition-colors"
            style={{
              background: isNearest ? "rgba(255,255,255,0.15)" : `${COLOR.accent}14`,
              color: isNearest ? "white" : COLOR.accent,
              fontFamily: FONT.body,
            }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="3 11 22 2 13 21 11 13 3 11" />
            </svg>
            {t("region.getDirections")}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── LocationPermissionCard ────────────────────────────────
function LocationPermissionCard({
  status,
  onRequest,
  t,
}: {
  status: "idle" | "requesting" | "denied" | "unsupported";
  onRequest: () => void;
  t: ReturnType<typeof useTranslations<"find-church">>;
}) {
  const isDenied = status === "denied" || status === "unsupported";
  const isRequesting = status === "requesting";

  return (
    <div
      className="flex max-w-sm flex-col gap-5 rounded-2xl border p-6 shadow-sm"
      style={{
        borderColor: isDenied ? "#fca5a5" : COLOR.cardBorder,
        background: isDenied ? "#fff8f8" : "white",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
      }}
    >
      {/* Icon */}
      <div
        className="flex h-11 w-11 items-center justify-center rounded-xl"
        style={{ background: isDenied ? "#fee2e2" : `${COLOR.accent}18` }}
      >
        <svg
          width="20" height="20" viewBox="0 0 24 24" fill="none"
          stroke={isDenied ? "#ef4444" : COLOR.accent}
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        >
          {isDenied ? (
            <>
              <circle cx="12" cy="12" r="10" />
              <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
            </>
          ) : (
            <>
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
            </>
          )}
        </svg>
      </div>

      {/* Title + message */}
      <div className="flex flex-col gap-1.5">
        <h4
          className="text-sm font-semibold leading-snug"
          style={{ fontFamily: FONT.heading, color: isDenied ? "#dc2626" : COLOR.heading }}
        >
          {isDenied ? t("locationPrompt.deniedTitle") : t("locationPrompt.title")}
        </h4>
        <p
          className="text-[11px] leading-relaxed"
          style={{ fontFamily: FONT.body, color: COLOR.body }}
        >
          {isDenied ? t("locationPrompt.deniedMessage") : t("locationPrompt.subtitle")}
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2">
        <button
          onClick={onRequest}
          disabled={isRequesting}
          className="flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-semibold disabled:opacity-60"
          style={{
            background: isDenied ? `${COLOR.accent}14` : COLOR.accent,
            color: isDenied ? COLOR.accent : "white",
            fontFamily: FONT.body,
          }}
        >
          {isRequesting ? (
            <>
              <svg className="animate-spin" width="12" height="12" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
              {t("locationPrompt.requesting")}
            </>
          ) : (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
              </svg>
              {isDenied ? t("locationPrompt.retryButton") : t("locationPrompt.allowButton")}
            </>
          )}
        </button>

        {isDenied && (
          <button
            onClick={() => window.location.reload()}
            className="flex w-full items-center justify-center gap-1.5 rounded-xl border py-2.5 text-xs font-medium"
            style={{ fontFamily: FONT.body, borderColor: COLOR.cardBorder, color: COLOR.body }}
          >
            {t("locationPrompt.reloadButton")}
          </button>
        )}
      </div>
    </div>
  );
}

// ── Location cache (client-only) ─────────────────────────
const GEO_KEY = "fc_geo_v1";
const GEO_TTL = 10 * 60 * 1000; // 10 min

type CachedGeo = { lat: number; lng: number; ts: number };

function readCache(): CachedGeo | null {
  try {
    const raw = localStorage.getItem(GEO_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CachedGeo;
    if (Date.now() - parsed.ts > GEO_TTL) { localStorage.removeItem(GEO_KEY); return null; }
    return parsed;
  } catch { return null; }
}

function writeCache(lat: number, lng: number) {
  try { localStorage.setItem(GEO_KEY, JSON.stringify({ lat, lng, ts: Date.now() })); } catch { /* quota */ }
}

// ── MapSection ────────────────────────────────────────────
export function MapSection() {
  const t = useTranslations("find-church");

  // ── State — always start as "idle"/null to match SSR ───
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [geoStatus, setGeoStatus]   = useState<"idle" | "requesting" | "granted" | "denied" | "unsupported">("idle");
  const [flyToTrigger, setFlyToTrigger] = useState(0);
  const [flyToLat, setFlyToLat] = useState<number | undefined>(undefined);
  const [flyToLng, setFlyToLng] = useState<number | undefined>(undefined);
  const [routeTarget, setRouteTarget] = useState<RouteTarget | null>(null);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) { setGeoStatus("unsupported"); return; }
    setGeoStatus("requesting");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        writeCache(lat, lng);
        setUserCoords({ lat, lng });
        setGeoStatus("granted");
      },
      () => setGeoStatus("denied"),
    );
  }, []);

  useEffect(() => {
    // 1. Try cache first — no browser dialog needed
    const cached = readCache();
    if (cached) {
      setUserCoords({ lat: cached.lat, lng: cached.lng });
      setGeoStatus("granted");
      return;
    }

    // 2. No cache — check current permission state
    if (!navigator.geolocation) { setGeoStatus("unsupported"); return; }
    if (navigator.permissions) {
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
        if (result.state === "granted") {
          requestLocation();
        } else if (result.state === "denied") {
          setGeoStatus("denied");
        }
        // "prompt" → leave as "idle" so our Allow button appears
        result.addEventListener("change", () => {
          if (result.state === "granted") requestLocation();
          else if (result.state === "denied") setGeoStatus("denied");
        });
      }).catch(() => requestLocation());
    } else {
      requestLocation();
    }
  }, [requestLocation]);

  // Compute nearest church whenever user position changes
  const nearestChurch = useMemo(
    () => (userCoords ? findNearest(userCoords) : null),
    [userCoords],
  );

  // Compute nearby churches (next 4 after nearest)
  const nearbyChurches = useMemo(
    () => {
      if (!userCoords || !nearestChurch) return [];
      return churchsDatabase
        .filter((c) => c.id !== nearestChurch.id)
        .map((c) => ({
          ...c,
          distance: haversineDistance(userCoords.lat, userCoords.lng, c.lat, c.lng),
        }))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 4);
    },
    [userCoords, nearestChurch],
  );

  // Centre the map on the nearest church on load
  const handleGetDirections = useCallback((church: RegionChurch) => {
    const mapsUrl = userCoords
      ? `https://www.google.com/maps/dir/?api=1&origin=${userCoords.lat},${userCoords.lng}&destination=${church.lat},${church.lng}`
      : `https://www.google.com/maps/dir/?api=1&destination=${church.lat},${church.lng}`;
    const wazeUrl = `https://waze.com/ul?ll=${church.lat},${church.lng}&navigate=yes`;
    setRouteTarget({ church, mapsUrl, wazeUrl });
    // If no user coords, fly to the church so the user sees it
    if (!userCoords) {
      setFlyToLat(church.lat);
      setFlyToLng(church.lng);
      setFlyToTrigger((n) => n + 1);
    }
    document.getElementById("church-map")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [userCoords]);

  return (
    <>
      {/* Header */}
      <ChurchMapHeader
        communityCount={churchsDatabase.length}
      />

      {/* Map */}
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-10">
        <div
          id="church-map"
          className="h-[400px] overflow-hidden rounded-2xl sm:h-[600px]"
          style={{ border: `1px solid ${COLOR.cardBorder}`, isolation: "isolate" }}
        >
          <ChurchMap
            churches={churchsDatabase}
            nearestId={nearestChurch?.id}
            userLocation={userCoords ?? undefined}
            flyToLat={flyToLat}
            flyToLng={flyToLng}
            flyToTrigger={flyToTrigger}
            routeFrom={routeTarget && userCoords ? userCoords : undefined}
            routeTo={routeTarget ? { lat: routeTarget.church.lat, lng: routeTarget.church.lng } : undefined}
            routeOverlay={routeTarget ? {
              name: routeTarget.church.name,
              address: routeTarget.church.address,
              mapsUrl: routeTarget.mapsUrl,
              wazeUrl: routeTarget.wazeUrl,
              onClose: () => setRouteTarget(null),
            } : undefined}
          />
        </div>
      </div>

      {/* Region section — permission card or nearest-church cards */}
      <div className="mx-auto mt-8 w-full max-w-[1400px]">
        <p
          className="mb-3 px-4 text-[10px] font-semibold uppercase tracking-widest sm:px-10"
          style={{ fontFamily: FONT.body, color: COLOR.accent }}
        >
          {t("region.label")}
        </p>

        {geoStatus !== "granted" ? (
          /* Location permission / blocked card */
          <div className="px-4 sm:px-10">
            <LocationPermissionCard status={geoStatus} onRequest={requestLocation} t={t} />
          </div>
        ) : nearestChurch ? (
          /* Church cards — mobile: snap carousel | desktop: auto-fit grid */
          <div
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 pl-4 pr-4 sm:grid sm:overflow-visible sm:pb-0 sm:pl-10 sm:pr-10"
            style={{
              scrollbarWidth: "none",
              gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
            }}
          >
            <div className="w-[78vw] max-w-[260px] flex-shrink-0 snap-start sm:contents">
              <RegionChurchCard church={nearestChurch} isNearest onGetDirections={() => handleGetDirections(nearestChurch)} t={t} />
            </div>
            {nearbyChurches.map((c) => (
              <div key={c.id} className="w-[78vw] max-w-[260px] flex-shrink-0 snap-start sm:contents">
                <RegionChurchCard church={c} onGetDirections={() => handleGetDirections(c)} t={t} />
              </div>
            ))}
          </div>
        ) : null}
      </div>

      {/* Churches directory */}
      <ChurchesDirectorySection
        userCoords={userCoords}
        nearestId={nearestChurch?.id}
      />
    </>
  );
}
