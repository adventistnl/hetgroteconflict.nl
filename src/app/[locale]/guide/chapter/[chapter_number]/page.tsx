import { getTranslations } from "next-intl/server";

type Props = {
  params: {
    locale: string;
    chapter_number: string;
  };
};

export default async function ChapterPage({ params }: Props) {
  const { locale, chapter_number } = params;
  const t = await getTranslations({ locale, namespace: "chapter-page" });

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-secondary">

      {/* Concentric circles — mirrors the home page decoration */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {[160, 280, 400, 520, 640, 760, 880].map((r) => (
          <circle
            key={r}
            cx="50%"
            cy="50%"
            r={r}
            fill="none"
            stroke="#b0b0b0"
            strokeWidth="1"
            opacity="0.4"
          />
        ))}
      </svg>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-7 px-6 text-center" style={{ maxWidth: "520px" }}>

        {/* Chapter badge */}
        <span
          className="rounded-full px-4 py-1 text-xs font-semibold uppercase text-primary"
          style={{
            fontFamily: "var(--font-rubik)",
            letterSpacing: "0.18em",
            border: "1px solid rgba(59,59,59,0.25)",
          }}
        >
          {t("chapter")} {chapter_number}
        </span>

        {/* Main heading */}
        <h1
          className="text-5xl font-bold leading-tight text-primary"
          style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}
        >
          {t("coming-soon")}
        </h1>

        {/* Ornamental divider */}
        <div className="flex items-center gap-3" style={{ color: "rgba(59,59,59,0.3)" }}>
          <div className="h-px w-12" style={{ backgroundColor: "currentColor" }} />
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <circle cx="8" cy="8" r="2" />
            <circle cx="2" cy="8" r="1.2" />
            <circle cx="14" cy="8" r="1.2" />
          </svg>
          <div className="h-px w-12" style={{ backgroundColor: "currentColor" }} />
        </div>

        {/* Description */}
        <p
          className="text-base leading-relaxed"
          style={{ fontFamily: "var(--font-rubik)", color: "rgba(59,59,59,0.55)" }}
        >
          {t("description")}
        </p>

        {/* CTA button */}
        <a
          href={`/${locale}`}
          className="mt-2 flex items-center gap-3 rounded-full px-7 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-80"
          style={{ backgroundColor: "hsl(var(--black))", fontFamily: "var(--font-rubik)" }}
        >
          {t("go-back-home")}
          <span
            className="flex h-7 w-7 items-center justify-center rounded-full"
            style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
          </span>
        </a>
      </div>
    </div>
  );
}

