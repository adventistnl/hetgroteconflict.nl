"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { highlightText } from "@/utils/transformHighlightText";

export const QuoteContainer = () => {
  const [quoteIconSize, setQuoteIconSize] = useState(65);
  const translations = useTranslations(
    "participate-page-container.quote-container"
  );

  const handleResize = () => {
    if (window.innerWidth > 768) {
      setQuoteIconSize(90);
    } else {
      setQuoteIconSize(75);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex flex-row flex-no-wrap gap-2 items-start max-w-[925px] p-4">
      <Image
        className=""
        src="/quote.svg"
        alt="quote icon"
        width={quoteIconSize}
        height={quoteIconSize}
      />
      <div className="flex flex-col gap-4">
        <h4
          className="text-primary text-xl"
          dangerouslySetInnerHTML={{
            __html:
              typeof highlightText(translations("quote")) === "string"
                ? highlightText(translations("quote"))
                : "",
          }}
        ></h4>{" "}
        <div className="flex flex-row flex-no-wrap gap-3 items-end max-w-[320px]">
          <Image
            className=""
            src="/ellen_photo.svg"
            alt="ellen g. white"
            width={60}
            height={60}
          />
          <p className="text-primary text-sm">{`${translations("author").toUpperCase()}, ${translations("book").toUpperCase()}, ${translations("year").toUpperCase()}`}</p>
        </div>
      </div>
    </div>
  );
};
