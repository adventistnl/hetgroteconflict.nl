import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { ChapterPageContainer } from "@/components/organisms/chapter-page-container";
import chaptersData from "@/database/chapters.json";
import TalkToUsFormData from "@/app/interfaces/talk-to-us-form-data";
import { sendTalkToUsEmail } from "@/utils/send-email/send-talk-to-us-email";
import { sendTalkToUsConfirmationEmail } from "@/utils/send-email/send-talk-to-us-confirmation-email";

type Props = {
  params: {
    locale: string;
    chapter_number: string;
  };
};

export default async function ChapterPage({ params }: Props) {
  const { locale, chapter_number } = params;

  // Set the request locale for static generation / internationalization
  unstable_setRequestLocale(locale);

  // Find the chapter in the mock database
  const chapter = chaptersData.find((c) => c.chapterNumber === chapter_number);

  // Server action for the TalkToUs contact form
  async function talkToUsFunction(formData: TalkToUsFormData) {
    "use server";
    await sendTalkToUsEmail(formData);
    await sendTalkToUsConfirmationEmail(formData);
    return null;
  }

  // Fallback: If chapter does not exist in the database, show "Coming Soon"
  if (!chapter) {
    const t = await getTranslations({ locale, namespace: "chapter-page" });

    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-secondary">
        {/* Concentric circles — mirrors the decoration */}
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
              strokeOpacity="0.4"
            />
          ))}
        </svg>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center gap-7 px-6 text-center" style={{ maxWidth: "520px" }}>
          {/* Chapter badge */}
          <span
            className="rounded-full px-4 py-1 text-xs font-semibold uppercase text-primary border border-gray-400/25"
            style={{
              fontFamily: "var(--font-rubik)",
              letterSpacing: "0.18em",
            }}
          >
            {t("chapter")} {chapter_number}
          </span>

          {/* Main heading */}
          <h1
            className="text-5xl font-bold leading-tight text-primary font-plus-jakarta-sans"
          >
            {t("coming-soon")}
          </h1>

          {/* Ornamental divider */}
          <div className="flex items-center gap-3 text-gray-400/50">
            <div className="h-px w-12 bg-current" />
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <circle cx="8" cy="8" r="2" />
              <circle cx="2" cy="8" r="1.2" />
              <circle cx="14" cy="8" r="1.2" />
            </svg>
            <div className="h-px w-12 bg-current" />
          </div>

          {/* Description */}
          <p
            className="text-base leading-relaxed text-gray-500 font-rubik"
          >
            {t("description")}
          </p>

          {/* CTA button */}
          <a
            href={`/${locale}`}
            className="mt-2 flex items-center gap-3 rounded-full px-7 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-80 bg-black font-rubik"
          >
            {t("go-back-home")}
            <span
              className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20"
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

  // Render full chapter page details with dynamic layout
  return (
    <ChapterPageContainer
      chapter={chapter}
      talkToUsFunctions={talkToUsFunction}
    />
  );
}
