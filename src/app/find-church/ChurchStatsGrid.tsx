import { COLOR, FONT, MAP_STATS } from "./theme";

export function ChurchStatsGrid() {
  return (
    <div
      className="mx-auto mt-16 grid grid-cols-2 gap-y-10 px-6 sm:grid-cols-4 sm:px-10"
      style={{ maxWidth: "800px" }}
    >
      {MAP_STATS.map(({ value, label }) => (
        <div key={label} className="flex flex-col items-center gap-1">
          <span
            style={{
              fontFamily: FONT.heading,
              fontSize: "2.5rem",
              fontWeight: 300,
              lineHeight: 1,
              color: COLOR.accent,
            }}
          >
            {value}
          </span>
          <span style={{ fontFamily: FONT.body, fontSize: "13px", color: COLOR.body }}>
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
