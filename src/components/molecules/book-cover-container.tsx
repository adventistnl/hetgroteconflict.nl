"use client";

import Image from "next/image";
import { IconAndInfoSection } from "../atoms/icon-and-info-section";
import { useLocale, useTranslations } from "next-intl";
import { languagesIsoCodeList } from "@/utils/languages-iso-code-list";

export const BookCoverContainer = () => {
  const translations = useTranslations("book-cover-container");
  const locale = useLocale();
  const selectedLanguage = languagesIsoCodeList.find(
    (lang) => lang.code.toLowerCase() === locale,
  );
  const imageName = `${selectedLanguage?.value.toLowerCase()}.${locale === "en" || locale === "es" || locale === "de" ? "avif" : "webp"}`;

  return (
    <div className="flex flex-col items-center justify-center laptop:w-1/3">
      <Image
        className="relative z-10 m-6 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] transition-all duration-1000 hover:scale-105 hover:drop-shadow-[0_15px_30px_rgba(0,0,0,0.7)] rounded-lg"
        src={`/book-covers/${imageName}`}
        alt="book cover"
        width={300}
        height={400}
      />
      <Image
        className="absolute z-0 top-5 right-2 opacity-20"
        src="/background.svg"
        alt="background"
        width={1000}
        height={1000}
      />
      <div className="z-10 flex max-w-[340px] flex-row justify-between p-3 gap-6 border-t border-zinc-300 py-5 laptop:w-full laptop:border-none laptop:pt-0">
        <IconAndInfoSection
          icon="/cloud-icon.svg"
          title="10k +"
          text={translations("downloads")}
        />
        <IconAndInfoSection
          icon="/translation-icon.svg"
          title="100 +"
          text={translations("languages")}
        />
      </div>
    </div>
  );
};
