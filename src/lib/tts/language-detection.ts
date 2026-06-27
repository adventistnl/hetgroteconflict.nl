/**
 * Maps app locale codes → Edge TTS voice names (Microsoft Neural voices).
 * Voice list: https://learn.microsoft.com/azure/cognitive-services/speech-service/language-support
 */

export interface VoiceInfo {
  /** BCP-47 locale, e.g. "en-US" */
  bcp47: string;
  /** Edge TTS neural voice name */
  voice: string;
}

const VOICE_MAP: Record<string, VoiceInfo> = {
  en:      { bcp47: "en-US", voice: "en-US-AvaNeural" },
  "en-US": { bcp47: "en-US", voice: "en-US-AvaNeural" },
  pt:      { bcp47: "pt-BR", voice: "pt-BR-FranciscaNeural" },
  "pt-BR": { bcp47: "pt-BR", voice: "pt-BR-FranciscaNeural" },
  "pt-PT": { bcp47: "pt-PT", voice: "pt-PT-RaquelNeural" },
  es:      { bcp47: "es-ES", voice: "es-ES-ElviraNeural" },
  "es-ES": { bcp47: "es-ES", voice: "es-ES-ElviraNeural" },
  de:      { bcp47: "de-DE", voice: "de-DE-KatjaNeural" },
  "de-DE": { bcp47: "de-DE", voice: "de-DE-KatjaNeural" },
  fr:      { bcp47: "fr-FR", voice: "fr-FR-DeniseNeural" },
  "fr-FR": { bcp47: "fr-FR", voice: "fr-FR-DeniseNeural" },
  nl:      { bcp47: "nl-NL", voice: "nl-NL-ColetteNeural" },
  "nl-NL": { bcp47: "nl-NL", voice: "nl-NL-ColetteNeural" },
  ar:      { bcp47: "ar-SA", voice: "ar-SA-ZariyahNeural" },
  "ar-SA": { bcp47: "ar-SA", voice: "ar-SA-ZariyahNeural" },
  zh:      { bcp47: "zh-CN", voice: "zh-CN-XiaoxiaoNeural" },
  "zh-CN": { bcp47: "zh-CN", voice: "zh-CN-XiaoxiaoNeural" },
  tw:      { bcp47: "zh-TW", voice: "zh-TW-HsiaoChenNeural" },
  "zh-TW": { bcp47: "zh-TW", voice: "zh-TW-HsiaoChenNeural" },
  ru:      { bcp47: "ru-RU", voice: "ru-RU-SvetlanaNeural" },
  "ru-RU": { bcp47: "ru-RU", voice: "ru-RU-SvetlanaNeural" },
  cz:      { bcp47: "cs-CZ", voice: "cs-CZ-VlastaNeural" },
  "cs-CZ": { bcp47: "cs-CZ", voice: "cs-CZ-VlastaNeural" },
};

const DEFAULT: VoiceInfo = { bcp47: "en-US", voice: "en-US-AvaNeural" };

/** Returns the best VoiceInfo for a given locale code. */
export function getVoiceInfo(locale: string): VoiceInfo {
  return (
    VOICE_MAP[locale] ??
    VOICE_MAP[locale.split("-")[0]] ??
    DEFAULT
  );
}
