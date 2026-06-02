/**
 * Single source of truth for all language configuration.
 * To add a new language, add ONE entry to the `languages` array below.
 * All derived maps and lists are computed automatically from this array.
 */
export interface LanguageConfig {
  /** Uppercase ISO code used internally (e.g. "EN", "AR", "ZH") */
  isoCode: string;
  /** Human-readable name in English (e.g. "English", "Arabic") */
  name: string;
  /**
   * Stable flag/locale code used for emoji lookup and URL matching.
   * Uses the country's ISO 3166-1 alpha-2 code for the flag (e.g. "gb" for English, "sa" for Arabic).
   */
  flagCode: string;
  /** YouTube `hl` / `cc_lang_pref` parameter value (e.g. "en", "ar", "zh-CN") */
  ytLocale: string;
  /** next-intl route locale key (e.g. "en", "ar", "zh") */
  routeLocale: string;
  /** Flag emoji character */
  emoji: string;
  /** Book cover image format — avif for languages with dedicated high-quality covers */
  bookCoverExtension: "avif" | "webp";
}

export const languages: LanguageConfig[] = [
  { isoCode: "AR", name: "Arabic",     flagCode: "sa", ytLocale: "ar",    routeLocale: "ar", emoji: "🇸🇦", bookCoverExtension: "webp" },
  { isoCode: "ZH", name: "Chinese",    flagCode: "cn", ytLocale: "zh-CN", routeLocale: "zh", emoji: "🇨🇳", bookCoverExtension: "webp" },
  { isoCode: "CZ", name: "Czech",      flagCode: "cz", ytLocale: "cs",    routeLocale: "cz", emoji: "🇨🇿", bookCoverExtension: "webp" },
  { isoCode: "NL", name: "Dutch",      flagCode: "nl", ytLocale: "nl",    routeLocale: "nl", emoji: "🇳🇱", bookCoverExtension: "webp" },
  { isoCode: "EN", name: "English",    flagCode: "gb", ytLocale: "en",    routeLocale: "en", emoji: "🇬🇧", bookCoverExtension: "avif" },
  { isoCode: "FR", name: "French",     flagCode: "fr", ytLocale: "fr",    routeLocale: "fr", emoji: "🇫🇷", bookCoverExtension: "webp" },
  { isoCode: "DE", name: "German",     flagCode: "de", ytLocale: "de",    routeLocale: "de", emoji: "🇩🇪", bookCoverExtension: "avif" },
  { isoCode: "PT", name: "Portuguese", flagCode: "pt", ytLocale: "pt",    routeLocale: "pt", emoji: "🇵🇹", bookCoverExtension: "webp" },
  { isoCode: "RU", name: "Russian",    flagCode: "ru", ytLocale: "ru",    routeLocale: "ru", emoji: "🇷🇺", bookCoverExtension: "webp" },
  { isoCode: "ES", name: "Spanish",    flagCode: "es", ytLocale: "es",    routeLocale: "es", emoji: "🇪🇸", bookCoverExtension: "avif" },
  { isoCode: "TW", name: "Twi",        flagCode: "tw", ytLocale: "tw",    routeLocale: "tw", emoji: "🇹🇼", bookCoverExtension: "avif" },
];

// ---------------------------------------------------------------------------
// Derived lookup maps — computed once from the languages array above
// ---------------------------------------------------------------------------

/** ISO code (uppercase) → flag code  e.g. "EN" → "gb" */
export const isoToFlagCode: Record<string, string> = Object.fromEntries(
  languages.map((l) => [l.isoCode, l.flagCode])
);

/** flag code → flag emoji  e.g. "gb" → "🇬🇧" */
export const flagCodeToEmoji: Record<string, string> = Object.fromEntries(
  languages.map((l) => [l.flagCode, l.emoji])
);

/** flag code → YouTube locale  e.g. "gb" → "en", "cn" → "zh-CN" */
export const flagCodeToYtLocale: Record<string, string> = Object.fromEntries(
  languages.map((l) => [l.flagCode, l.ytLocale])
);

/** route locale → flag code  e.g. "ar" → "sa", "zh" → "cn" */
export const routeLocaleToFlagCode: Record<string, string> = Object.fromEntries(
  languages.map((l) => [l.routeLocale, l.flagCode])
);

/** Book cover extension lookup by ISO code  e.g. "EN" → "avif" */
export const isoToBookCoverExtension: Record<string, "avif" | "webp"> = Object.fromEntries(
  languages.map((l) => [l.isoCode, l.bookCoverExtension])
);

/**
 * Drop-in replacement for the legacy `languagesIsoCodeList` shape `{ code, value }[]`.
 * Kept for backward compatibility with existing consumers.
 */
export const languagesIsoCodeList = languages.map((l) => ({
  code: l.isoCode,
  value: l.name,
}));
