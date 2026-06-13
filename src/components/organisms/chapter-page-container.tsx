"use client";

import { useEffect } from "react";
import { useChapterProgress } from "@/hooks/use-chapter-progress";
import { TalkToUsContainer } from "./talk-to-us-container";
import { Footer } from "../molecules/footer";
import TalkToUsFormData from "@/app/interfaces/talk-to-us-form-data";
import { CompaniesContainer } from "../molecules/companies-container";
import { ChapterCarousel } from "../molecules/chapter-carousel";
import { EsdaCoursesContainer } from "../molecules/esda-courses-container";
import { PageHero, ChapterData } from "../molecules/page-hero";
import { useLocale } from "next-intl";

interface Props {
  chapter: ChapterData;
  talkToUsFunctions: (formData: TalkToUsFormData) => Promise<null>;
}

export const ChapterPageContainer = ({ chapter, talkToUsFunctions }: Props) => {
  const locale = useLocale();
  const { markChapterVisited } = useChapterProgress();

  // Save progress to localStorage when the chapter page mounts
  useEffect(() => {
    markChapterVisited(chapter.chapterNumber);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapter.chapterNumber]);

  return (
    <div className="flex w-full flex-col items-center">
      <PageHero variant="chapter" chapter={chapter} locale={locale} />
      {/* Sponsor/Partner logos */}
      <section className="flex w-full flex-col items-center justify-center bg-transparent py-6 opacity-80">
        <CompaniesContainer />
      </section>


      {/* 4. Chapter Carousel — Up Next */}
      <section className="w-full bg-secondary py-10">
        <ChapterCarousel
          currentChapterNumber={chapter.chapterNumber}
          locale={locale}
        />
      </section>

      {/* 5. ESDA Courses */}
      <section className="w-full py-0">
        <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-10">
          <EsdaCoursesContainer />
        </div>
      </section>

      {/* 6. Contact/Talk to Us Section */}
      <section id="talk-to-us" className="w-full bg-[#191919] py-12">
        <TalkToUsContainer talkToUsFunctions={talkToUsFunctions} />
      </section>

      {/* 6. Footer */}
      <section className="w-full bg-transparent">
        <Footer />
      </section>
    </div>
  );
};
