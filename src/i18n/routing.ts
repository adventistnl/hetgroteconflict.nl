import { defineRouting } from "next-intl/routing";
import { createSharedPathnamesNavigation } from "next-intl/navigation";

export enum Locales {
  AR = "ar",
  CZ = "cz",
  DE = "de",
  EN = "en",
  ES = "es",
  FR = "fr",
  NL = "nl",
  PT = "pt",
  RU = "ru",
  ZH = "zh",
}

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: [
    Locales.AR,
    Locales.CZ,
    Locales.DE,
    Locales.EN,
    Locales.ES,
    Locales.FR,
    Locales.NL,
    Locales.PT,
    Locales.RU,
    Locales.ZH,
  ],

  // Used when no locale matches
  defaultLocale: Locales.EN,
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter } =
  createSharedPathnamesNavigation(routing);
