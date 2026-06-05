"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import {
  FaFacebook,
  FaYoutube,
  FaChurch,
} from "react-icons/fa";
import {
  MdEmail,
  MdPhone,
  MdLocationOn,
} from "react-icons/md";

const SOCIAL = [
  {
    name: "Facebook",
    url: "https://www.facebook.com/zevendedagsadventisten/?locale=nl_NL",
    icon: FaFacebook,
    color: "hover:text-blue-400",
  },
  {
    name: "YouTube",
    url: "https://www.youtube.com/@zdanederlandonline9582",
    icon: FaYoutube,
    color: "hover:text-red-500",
  },
];

const INSTITUTIONAL = [
  { key: "about",   url: "https://www.adventist.nl/over-ons/" },
  { key: "contact-link", url: "https://www.adventist.nl/contact/" },
  { key: "news",    url: "https://www.adventist.nl/category/nieuws/" },
  { key: "agenda",  url: "https://www.adventist.nl/agenda/" },
  { key: "sermon",  url: "https://preekrooster.adventist.nl" },
  { key: "esda",    url: "https://www.adventist.nl/esda-instituut/" },
  { key: "adra",    url: "https://www.adventist.nl/adra/" },
  { key: "webshop", url: "http://servicecentrum-adventist.nl" },
];

const LEGAL = [
  { key: "policy",   url: "https://www.adventist.nl/privacy" },
  { key: "legal",    url: "https://www.adventist.nl/" },
  { key: "tradmark", url: "https://www.adventist.nl/" },
];

export const Footer = () => {
  const t = useTranslations("footer");

  return (
    <footer className="w-full border-t border-primary/10 bg-secondary text-primary">
      {/* ── Main grid ── */}
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 px-6 py-12 sm:grid-cols-2 lg:grid-cols-4">

        {/* Col 1 — Brand + social */}
        <div className="flex flex-col gap-5">
          <Link
            href="https://www.adventist.nl"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3"
            aria-label={t("official-site")}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-[#4fa6c2]/20">
              <FaChurch className="h-5 w-5 text-[#4fa6c2]" />
            </span>
            <span
              className="text-sm font-semibold leading-tight text-primary/80 transition-colors group-hover:text-primary"
              style={{ fontFamily: "var(--font-rubik)" }}
            >
              {t("official-site")}
            </span>
          </Link>

          <div>
            <p
              className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary/40"
              style={{ fontFamily: "var(--font-rubik)" }}
            >
              {t("follow")}
            </p>
            <div className="flex gap-4">
              {SOCIAL.map(({ name, url, icon: Icon, color }) => (
                <Link
                  key={name}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                  className={`text-primary/40 transition-colors ${color}`}
                >
                  <Icon className="h-6 w-6" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Col 2 — Institutional links */}
        <div className="flex flex-col gap-3">
          <p
            className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary/40"
            style={{ fontFamily: "var(--font-rubik)" }}
          >
            {t("links-title")}
          </p>
          {INSTITUTIONAL.map(({ key, url }) => (
            <Link
              key={key}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary/60 transition-colors hover:text-primary"
              style={{ fontFamily: "var(--font-rubik)" }}
            >
              {t(key as Parameters<typeof t>[0])}
            </Link>
          ))}
        </div>

        {/* Col 3 — Contact info */}
        <div className="flex flex-col gap-4">
          <p
            className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary/40"
            style={{ fontFamily: "var(--font-rubik)" }}
          >
            {t("contact-title")}
          </p>
          <div className="flex items-start gap-2 text-sm text-primary/60">
            <MdLocationOn className="mt-0.5 h-4 w-4 shrink-0 text-[#4fa6c2]" />
            <span style={{ fontFamily: "var(--font-rubik)" }}>
              Amersfoortseweg 18,<br />3712 BC Huis ter Heide,<br />Nederland
            </span>
          </div>
          <Link
            href="tel:+31306939375"
            className="flex items-center gap-2 text-sm text-primary/60 transition-colors hover:text-primary"
          >
            <MdPhone className="h-4 w-4 shrink-0 text-[#4fa6c2]" />
            <span style={{ fontFamily: "var(--font-rubik)" }}>030 – 693 93 75</span>
          </Link>
          <Link
            href="mailto:info@adventist.nl"
            className="flex items-center gap-2 text-sm text-primary/60 transition-colors hover:text-primary"
          >
            <MdEmail className="h-4 w-4 shrink-0 text-[#4fa6c2]" />
            <span style={{ fontFamily: "var(--font-rubik)" }}>info@adventist.nl</span>
          </Link>
          <Link
            href="mailto:ict@adventist.nl"
            className="flex items-center gap-2 text-sm text-primary/60 transition-colors hover:text-primary"
          >
            <MdEmail className="h-4 w-4 shrink-0 text-primary/30" />
            <span style={{ fontFamily: "var(--font-rubik)" }}>ict@adventist.nl</span>
          </Link>
        </div>

        {/* Col 4 — Legal */}
        <div className="flex flex-col gap-3">
          <p
            className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary/40"
            style={{ fontFamily: "var(--font-rubik)" }}
          >
            Legal
          </p>
          {LEGAL.map(({ key, url }) => (
            <Link
              key={key}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary/60 transition-colors hover:text-primary"
              style={{ fontFamily: "var(--font-rubik)" }}
            >
              {t(key as Parameters<typeof t>[0])}
            </Link>
          ))}
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-primary/10 px-6 py-4">
        <p
          className="text-center text-[11px] text-primary/40"
          style={{ fontFamily: "var(--font-rubik)" }}
        >
          {t("copyright")}
        </p>
      </div>
    </footer>
  );
};
