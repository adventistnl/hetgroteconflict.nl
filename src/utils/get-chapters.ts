import chaptersBase from "@/database/chapters.json";
import i18n from "@/database/chapters-i18n.json";

export interface LocalizedChapter {
  chapterNumber: string;
  title: string;
  description: string;
  videoUrl: string;
  videoCover: string;
}

type I18nData = typeof i18n;
type LocaleKey = keyof I18nData;

/**
 * Returns the full chapter list with titles and descriptions translated for
 * the given locale. Falls back to English when no translation is found.
 */
export function getLocalizedChapters(locale: string): LocalizedChapter[] {
  const key = (locale in i18n ? locale : "en") as LocaleKey;
  const localeData = i18n[key];
  const fallback = i18n["en"];

  return chaptersBase.map((chapter) => {
    const idx = parseInt(chapter.chapterNumber, 10) - 1;
    const title =
      localeData.titles[idx] ?? fallback.titles[idx] ?? chapter.title;

    // chapters 2 and 3 have a unique description; all others use the generic one
    const chNum = chapter.chapterNumber;
    const descKey = chNum as "2" | "3";
    const hasUnique = chNum === "2" || chNum === "3";
    const description = hasUnique
      ? (localeData[descKey] ?? fallback[descKey] ?? localeData.generic)
      : localeData.generic;

    return {
      chapterNumber: chapter.chapterNumber,
      title,
      description,
      videoUrl: chapter.videoUrl,
      videoCover: chapter.videoCover,
    };
  });
}

/**
 * Returns a single localized chapter by number. Returns undefined if not found.
 */
export function getLocalizedChapter(
  locale: string,
  chapterNumber: string
): LocalizedChapter | undefined {
  return getLocalizedChapters(locale).find(
    (c) => c.chapterNumber === chapterNumber
  );
}
