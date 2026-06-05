"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { EsdaCourseCovers } from "./esda-course-covers";

const ESDA_URL = "https://esda-instituut.nl/";

export const EsdaCoursesContainer = () => {
  const t = useTranslations("esda-courses");

  return (
    <div className="flex flex-wrap items-start justify-center gap-6">
      {/* Left: text content */}
      <div className="flex max-w-[600px] flex-col gap-6 p-8">
        <h6 className="text-2xl text-primary">{t("title")}</h6>
        <div className="flex flex-col gap-4">
          <p className="text-gray">{t("summary")}</p>

          <Link
            href={ESDA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex w-fit items-center justify-center rounded-full border border-primary/30 bg-primary/5 px-5 py-2.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/15"
            style={{ fontFamily: "var(--font-rubik)" }}
          >
            {t("viewAll")}
          </Link>
        </div>
      </div>

      {/* Right: course covers */}
      <div className="flex items-center p-8">
        <EsdaCourseCovers />
      </div>
    </div>
  );
};
