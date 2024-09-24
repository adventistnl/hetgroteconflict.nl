"use client";

import { LanguageObj } from "@/utils/languages-list";
import { AvailableFormatCard } from "../atoms/available-format-card";
import { DownloadMenubar } from "./download-menubar";
import { downloadList } from "@/utils/download-list";
import { useTranslations } from "next-intl";

interface Props {
  selectedLanguage: LanguageObj;
}

export const BookAvailableFormatsContainer = ({ selectedLanguage }: Props) => {
  const translations = useTranslations("book-available-formats-container");

  const hasDownloadOptionsAvailable = () => {
    const options = [
      "pdf",
      "epub",
      "audio",
      "promotional",
      "readingPlan",
      "studyGuide",
    ];

    return options.some(
      (option) => downloadList[option][selectedLanguage.value],
    );
  };

  return (
    <div className="flex flex-row items-start gap-3">
      <span>{translations("available")}</span>
      <div className="flex flex-col gap-3">
        <div className="flex flex-row flex-wrap items-center justify-start gap-2">
          {downloadList.pdf[selectedLanguage.value] && (
            <AvailableFormatCard format="PDF" />
          )}
          {downloadList.epub[selectedLanguage.value] && (
            <AvailableFormatCard format="ePub" />
          )}
          {downloadList.audio[selectedLanguage.value] && (
            <AvailableFormatCard format={translations("audio")} />
          )}
          {downloadList.promotional[selectedLanguage.value] && (
            <AvailableFormatCard format={translations("promotional")} />
          )}
          {downloadList.readingPlan[selectedLanguage.value] && (
            <AvailableFormatCard format={translations("reading")} />
          )}
          {downloadList.studyGuide[selectedLanguage.value] && (
            <AvailableFormatCard format={translations("study")} />
          )}
          {!hasDownloadOptionsAvailable() && (
            <span className="text-indigo-900">
              {translations("no-options")}
            </span>
          )}
        </div>
        {hasDownloadOptionsAvailable() && (
          <DownloadMenubar selectedLanguage={selectedLanguage} />
        )}
      </div>
    </div>
  );
};
