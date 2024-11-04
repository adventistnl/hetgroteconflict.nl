"use client";

import Image from "next/image";
import { BookDownloadContainer } from "../molecules/book-download-container";
import { useEffect, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { languagesIsoCodeList } from "@/utils/languages-iso-code-list";
import { useRefStore } from "../stores/ref-store";

interface iProps {
  showImage?: boolean;
}
export const SummaryContainer = ({ showImage = true }: iProps) => {
  //States and Hooks
  const translations = useTranslations("summary-container");
  const { setRef_AboutSection } = useRefStore();
  const locale = useLocale();
  const aboutSectionRef = useRef<HTMLDivElement | null>(null);
  const selectedLanguage = languagesIsoCodeList.find(
    (lang) => lang.code.toLowerCase() === locale
  );
  const imageName = `${selectedLanguage?.value.toLowerCase()}.${locale === "en" || locale === "es" || locale === "de" ? "avif" : "webp"}`;

  useEffect(() => {
    setRef_AboutSection(aboutSectionRef);
  }, []);

  return (
    <div
      className="flex flex-col items-center justify-center laptop:flex-row"
      ref={aboutSectionRef}
    >
      {showImage && (
        <Image
          className="relative z-10 m-6 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] transition-all duration-1000 hover:scale-105 hover:drop-shadow-[0_15px_30px_rgba(0,0,0,0.7)] rounded-lg"
          src={`/book-covers/${imageName}`}
          alt="book cover"
          width={400}
          height={500}
        />
      )}

      <div className="max-w-[600px] m-6">
        <h6 className="text-2xl text-primary">{translations("summary")}</h6>
        <div className="flex flex-col gap-6">
          <p className="text-gray">{translations("paragraph-1")}</p>
          <p className="text-gray">{translations("paragraph-2")}</p>
          <BookDownloadContainer />
        </div>
      </div>
    </div>
  );
};
