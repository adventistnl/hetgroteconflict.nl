"use client";

import { LanguageObj } from "@/utils/languages-list";
import { SelectLanguage } from "./select-language";
import { Dispatch, SetStateAction } from "react";
import { useTranslations } from "next-intl";

interface Props {
  selectedLanguage: LanguageObj;
  setSelectedLanguage: Dispatch<SetStateAction<LanguageObj>>;
}

export const BookLanguageContainer = ({
  selectedLanguage,
  setSelectedLanguage,
}: Props) => {
  const translations = useTranslations("book-language-container");

  return (
    <div className="flex flex-row items-center gap-3">
      <span>{translations("language")}</span>
      <SelectLanguage
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
      />
    </div>
  );
};
