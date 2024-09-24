"use client";

import { useEffect, useRef, useState } from "react";
import { BookAvailableFormatsContainer } from "./book-available-formats-container";
import { BookLanguageContainer } from "./book-language-container";
import { LanguageObj, languagesList } from "@/utils/languages-list";
import { useLocale } from "next-intl";
import {
  LanguageISO,
  languagesIsoCodeList,
} from "@/utils/languages-iso-code-list";
import { useRefStore } from "../stores/ref-store";

export const BookDownloadContainer = () => {
  //States and Hooks
  const locale = useLocale();
  const { setRef_DownloadSection } = useRefStore();
  const downloadSectionRef = useRef<HTMLDivElement | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageObj>({
    label: "English",
    value: "English",
  });

  //Effects
  useEffect(() => {
    const language = languagesIsoCodeList.find(
      (lang) => lang.code.toLowerCase() === locale,
    ) as LanguageISO;
    setSelectedLanguage(
      languagesList.find(
        (lang) => lang.value === language.value,
      ) as LanguageObj,
    );
  }, [locale]);

  useEffect(() => {
    setRef_DownloadSection(downloadSectionRef);
  }, []);

  return (
    <div
      className="z-10 flex flex-col gap-3 text-primary"
      ref={downloadSectionRef}
    >
      <BookLanguageContainer
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
      />
      <BookAvailableFormatsContainer selectedLanguage={selectedLanguage} />
    </div>
  );
};
