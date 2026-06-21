import { useTranslations } from "next-intl";
import { COLOR, FONT } from "./theme";

interface Props {
  communityCount: number;
  geoError?: string | null;
}

export function ChurchMapHeader({ communityCount, geoError }: Props) {
  const t = useTranslations("find-church.map");
  return (
    <div className="mx-auto flex max-w-[800px] flex-col items-center px-6 pb-12 pt-20 text-center">
      {/* Community count label */}
      <span
        className="mb-4"
        style={{ fontFamily: FONT.mono, fontSize: "13px", color: COLOR.accent }}
      >
        {"{ "}
        {t("communities", { count: communityCount })}
        {" }"}
      </span>

      {/* Section title */}
      <h2
        style={{
          fontFamily: FONT.heading,
          fontSize: "clamp(1.8rem, 4vw, 3rem)",
          fontWeight: 300,
          lineHeight: 1.2,
          color: COLOR.heading,
        }}
      >
        {t("heading")}
      </h2>

      {/* Subtitle */}
      <p
        className="mt-4 max-w-[500px]"
        style={{ fontFamily: FONT.body, fontSize: "1rem", color: COLOR.body }}
      >
        {t("subtitle")}
      </p>

      {/* Geo permission error */}
      {geoError && (
        <p
          className="mt-3"
          style={{ fontFamily: FONT.body, fontSize: "13px", color: COLOR.accentAmber }}
        >
          {geoError}
        </p>
      )}
    </div>
  );
}
