/**
 * @deprecated Import directly from "@/config/languages" instead.
 * This file re-exports from the global language config for backward compatibility.
 */
export { languagesIsoCodeList, type LanguageConfig } from "@/config/languages";

// Legacy type alias kept for existing consumers
export type LanguageISO = { code: string; value: string };
