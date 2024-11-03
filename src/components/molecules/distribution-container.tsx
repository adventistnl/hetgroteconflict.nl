"use client";

import { BookDownloadContainer } from "../molecules/book-download-container";
import { useTranslations } from "next-intl";
import { DistributionCovers } from "../molecules/distribution-covers";

export const DistributionContainer = () => {
  const translations = useTranslations("distribution-package-container");

  return (
    <div className="flex flex-wrap items-evenly justify-center gap-6">
      <div className="flex flex-col max-w-[600px] gap-6 p-8">
        <h6 className="text-2xl text-primary">{translations("summary")}</h6>
        <div className="flex flex-col gap-6">
          <p className="text-gray">{translations("paragraph-1")}</p>
          <p className="text-gray">{translations("paragraph-2")}</p>
          <BookDownloadContainer />
        </div>
      </div>
      <DistributionCovers />
    </div>
  );
};
