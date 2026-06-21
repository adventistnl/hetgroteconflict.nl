"use client";

import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { iChurchs } from "@/database/churchs";

// Light tile — CartoDB Positron (clean, light mode, always)
const DEFAULT_TILE = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
const DEFAULT_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';
const DARK_ATTRIBUTION = DEFAULT_ATTRIBUTION;

// ── Lucide Church icon paths (raw SVG, no React dependency needed here) ──────
const CHURCH_SVG_PATHS = `
  <path d="m18 7 4 2v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9l4-2" stroke="white" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M14 22v-4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v4" stroke="white" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M18 22V5l-6-3-6 3v17" stroke="white" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M12 7v5" stroke="white" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M10 9h4" stroke="white" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
`;

// Pin shape: teardrop (circle top + triangular pointer bottom)
function makePinHtml(color: string, size: number, glow?: string): string {
  const r = size / 2;
  const totalH = size + size * 0.55; // circle height + pointer
  // Icon is padded: occupies ~50% of the circle diameter, centred in the circle
  const padding = size * 0.25;
  const iconSize = size - padding * 2;
  const iconOffset = padding;
  return `
    <div style="position:relative;width:${size}px;height:${totalH}px;filter:${glow ?? "none"}">
      <svg width="${size}" height="${totalH}" viewBox="0 0 ${size} ${totalH}" xmlns="http://www.w3.org/2000/svg">
        <!-- Drop shadow -->
        <ellipse cx="${r}" cy="${totalH - 2}" rx="${r * 0.45}" ry="${r * 0.18}" fill="rgba(0,0,0,0.25)"/>
        <!-- Pin body -->
        <path d="M${r},${totalH - 1} Q${size * 0.1},${size * 0.78} ${size * 0.05},${r} A${r},${r} 0 1 1 ${size * 0.95},${r} Q${size * 0.9},${size * 0.78} ${r},${totalH - 1}Z"
          fill="${color}" />
        <!-- Inner circle highlight -->
        <circle cx="${r}" cy="${r}" r="${r * 0.55}" fill="rgba(255,255,255,0.2)"/>
        <!-- Church icon — padded to fit inside the circle -->
        <svg x="${iconOffset}" y="${iconOffset}" width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24">
          ${CHURCH_SVG_PATHS}
        </svg>
      </svg>
    </div>`;
}

const PIN_SIZE_NORMAL  = 28;
const PIN_SIZE_NEAREST = 36;

const NORMAL_PIN = L.divIcon({
  className: "",
  html: makePinHtml("#4fa6c2", PIN_SIZE_NORMAL),
  iconSize:   [PIN_SIZE_NORMAL,  PIN_SIZE_NORMAL + PIN_SIZE_NORMAL * 0.55],
  iconAnchor: [PIN_SIZE_NORMAL / 2, PIN_SIZE_NORMAL + PIN_SIZE_NORMAL * 0.55 - 1],
  popupAnchor:[0, -(PIN_SIZE_NORMAL + PIN_SIZE_NORMAL * 0.55)],
});

const NEAREST_PIN = L.divIcon({
  className: "",
  html: makePinHtml(
    "#4fa6c2",
    PIN_SIZE_NEAREST,
    `drop-shadow(0 0 8px rgba(79,166,194,0.9))`,
  ),
  iconSize:   [PIN_SIZE_NEAREST, PIN_SIZE_NEAREST + PIN_SIZE_NEAREST * 0.55],
  iconAnchor: [PIN_SIZE_NEAREST / 2, PIN_SIZE_NEAREST + PIN_SIZE_NEAREST * 0.55 - 1],
  popupAnchor:[0, -(PIN_SIZE_NEAREST + PIN_SIZE_NEAREST * 0.55)],
});

const USER_PIN = L.divIcon({
  className: "",
  html: `<div style="width:16px;height:16px;border-radius:50%;background:#1e40af;border:3px solid white;box-shadow:0 0 0 4px rgba(30,64,175,0.25);"></div>`,
  iconSize:   [16, 16],
  iconAnchor: [8, 8],
});

// ─── FlyToController ────────────────────────────────────────────────────────
// Uses useMap() to programmatically fly the map to the given coordinates.
// `trigger` increments each time the parent wants to re-fly (even to the same coords).
interface FlyToProps {
  lat?: number;
  lng?: number;
  trigger: number;
}

function FlyToController({ lat, lng, trigger }: FlyToProps) {
  const map = useMap();
  useEffect(() => {
    if (lat !== undefined && lng !== undefined && trigger > 0) {
      map.setView([lat, lng], 15, { animate: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);
  return null;
}

// ─── UserFocusButton ────────────────────────────────────────────────────────────────────────
function UserFocusButton({ userLocation }: { userLocation?: { lat: number; lng: number } }) {
  const map = useMap();
  return (
    <button
      onClick={() => {
        if (userLocation) {
          map.setView([userLocation.lat, userLocation.lng], 14, { animate: true });
        }
      }}
      disabled={!userLocation}
      title={userLocation ? "Focar na minha localização" : "Localização não disponível"}
      style={{
        position: "absolute",
        top: "12px",
        right: "12px",
        zIndex: 800,
        background: userLocation ? "white" : "rgba(255,255,255,0.6)",
        border: "none",
        borderRadius: "10px",
        width: "36px",
        height: "36px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: userLocation ? "pointer" : "not-allowed",
        boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
        color: userLocation ? "#4fa6c2" : "#aaa",
        opacity: userLocation ? 1 : 0.5,
        transition: "box-shadow 0.15s",
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
        <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" fill="#4fa6c2" fillOpacity="0.15" stroke="none" />
      </svg>
    </button>
  );
}

// ─── RouteLayer ────────────────────────────────────────────────────────────────────────
function RouteLayer({
  from,
  to,
}: {
  from: { lat: number; lng: number };
  to: { lat: number; lng: number };
}) {
  const map = useMap();
  const [points, setPoints] = useState<[number, number][]>([]);

  useEffect(() => {
    setPoints([]);
    const url =
      `https://router.project-osrm.org/route/v1/driving/` +
      `${from.lng},${from.lat};${to.lng},${to.lat}` +
      `?overview=full&geometries=geojson`;

    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        if (data.routes?.[0]) {
          const pts: [number, number][] = data.routes[0].geometry.coordinates.map(
            ([lng, lat]: [number, number]) => [lat, lng],
          );
          setPoints(pts);
        }
      })
      .catch(() => {
        setPoints([[from.lat, from.lng], [to.lat, to.lng]]);
      })
      .finally(() => {
        map.fitBounds(
          L.latLngBounds([[from.lat, from.lng], [to.lat, to.lng]]),
          { padding: [80, 80], maxZoom: 15, animate: true },
        );
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from.lat, from.lng, to.lat, to.lng]);

  if (!points.length) return null;
  return (
    <Polyline
      positions={points}
      pathOptions={{ color: "#4fa6c2", weight: 5, opacity: 0.88 }}
    />
  );
}

// ─── ChurchMap ───────────────────────────────────────────────────────────────
export interface ChurchMapProps {
  churches: iChurchs[];
  nearestId?: string;
  userLocation?: { lat: number; lng: number };
  /** Pass the dark CartoDB tile URL to enable dark mode tiles. Defaults to OSM. */
  tileUrl?: string;
  flyToLat?: number;
  flyToLng?: number;
  /** Increment this to re-fly the map to flyToLat/flyToLng */
  flyToTrigger?: number;
  /** Route: draw a polyline from user to destination */
  routeFrom?: { lat: number; lng: number };
  routeTo?: { lat: number; lng: number };
  /** Floating panel shown on the map with Waze/Maps buttons */
  routeOverlay?: {
    name: string;
    address?: string;
    mapsUrl: string;
    wazeUrl: string;
    onClose: () => void;
  };
}

export default function ChurchMap({
  churches,
  nearestId,
  userLocation,
  tileUrl,
  flyToLat,
  flyToLng,
  flyToTrigger = 0,
  routeFrom,
  routeTo,
  routeOverlay,
}: ChurchMapProps) {
  const tile = tileUrl ?? DEFAULT_TILE;
  const attribution = tileUrl ? DARK_ATTRIBUTION : DEFAULT_ATTRIBUTION;

  return (
    <div style={{ position: "relative", height: "100%", width: "100%" }}>
      <MapContainer
        center={[52.3, 5.3]}
        zoom={7}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom
      >
        <TileLayer url={tile} attribution={attribution} />
        <FlyToController lat={flyToLat} lng={flyToLng} trigger={flyToTrigger} />

        {/* Route polyline */}
        {routeFrom && routeTo && <RouteLayer from={routeFrom} to={routeTo} />}

        {/* Focus on user button (rendered inside MapContainer for useMap access) */}
        <UserFocusButton userLocation={userLocation} />

        {/* User location pin */}
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={USER_PIN}>
            <Popup>
              <strong>Your location</strong>
            </Popup>
          </Marker>
        )}

        {/* Church pins */}
        {churches.map((church) => (
          <Marker
            key={church.id}
            position={[church.lat, church.lng]}
            icon={church.id === nearestId ? NEAREST_PIN : NORMAL_PIN}
          >
            <Popup>
              <strong style={{ fontWeight: 600, fontSize: "13px" }}>{church.name}</strong>
              {church.address && (
                <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#555" }}>
                  {church.address}
                </p>
              )}
              {church.website && (
                <a
                  href={church.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "block", marginTop: "6px", fontSize: "12px", color: "#4fa6c2" }}
                >
                  Visit website →
                </a>
              )}
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* ── Route overlay ── */}
      {routeOverlay && (
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1000,
            background: "white",
            borderRadius: "16px",
            padding: "10px 14px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            maxWidth: "calc(100% - 32px)",
            minWidth: "260px",
          }}
        >
          {/* Pin icon */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#4fa6c2" style={{ flexShrink: 0 }}>
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>

          {/* Church info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontWeight: 700, fontSize: "12px", margin: 0, color: "#1a1a2e", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {routeOverlay.name}
            </p>
            {routeOverlay.address && (
              <p style={{ fontSize: "10px", color: "#888", margin: "1px 0 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {routeOverlay.address}
              </p>
            )}
          </div>

          {/* Google Maps */}
          <a
            href={routeOverlay.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "flex", alignItems: "center", gap: "4px", background: "#4285F418", color: "#1A73E8", border: "1px solid #4285F430", borderRadius: "8px", padding: "5px 10px", fontSize: "11px", fontWeight: 700, textDecoration: "none", flexShrink: 0 }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
            Maps
          </a>

          {/* Waze */}
          <a
            href={routeOverlay.wazeUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "flex", alignItems: "center", gap: "4px", background: "#05C8F818", color: "#05A8E4", border: "1px solid #05C8F830", borderRadius: "8px", padding: "5px 10px", fontSize: "11px", fontWeight: 700, textDecoration: "none", flexShrink: 0 }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0zm-8 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
            </svg>
            Waze
          </a>

          {/* Close */}
          <button
            onClick={routeOverlay.onClose}
            style={{ background: "rgba(0,0,0,0.06)", border: "none", borderRadius: "8px", width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#888", fontSize: "14px", flexShrink: 0 }}
            aria-label="Fechar rota"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
