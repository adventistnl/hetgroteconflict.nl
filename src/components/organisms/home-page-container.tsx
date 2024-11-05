"use client";

import FormData from "@/app/interfaces/form-data";
import { Button } from "@/components/atoms/button";
import { BookCoverContainer } from "@/components/molecules/book-cover-container";
import { CompaniesContainer } from "@/components/molecules/companies-container";
import { ReceiveAtHomeContainer } from "@/components/molecules/receive-at-home-container";
import { SummaryContainer } from "@/components/organisms/summary-container";
import { useTranslations } from "next-intl";
import { HiOutlineCloudDownload as CloudIcon } from "react-icons/hi";
import { PiHouse as HouseIcon } from "react-icons/pi";
import { useRefStore } from "../stores/ref-store";
import { scrollToSection } from "@/utils/scroll-to-section";
// import { TalkToUsContainer } from "./talk-to-us-container";
import TalkToUsFormData from "@/app/interfaces/talk-to-us-form-data";
import { Footer } from "../molecules/footer";
import { BookCarousel } from "../molecules/book-carousel";

interface Props {
  receiveAtHomeFunctions: (formData: FormData) => Promise<null>;
  talkToUsFunctions: (formData: TalkToUsFormData) => Promise<null>;
}

export const HomePageContainer = ({
  receiveAtHomeFunctions,
  // talkToUsFunctions,
}: Props) => {
  const translations = useTranslations("home-page-container");
  const { ref_DownloadSection, ref_ReceiveAtHomeSection } = useRefStore();

  return (
    <>
      <div
        className="relative flex w-full flex-col items-center laptop:justify-around pb-12 mt-[80px] gap-6"
        style={{
          background:
            "linear-gradient(to top, #3b3b3b, #e8e8e8) bottom/100% 5% no-repeat", // Aplica o gradiente apenas nos últimos 20% da altura do componente
        }}
      >
        <div className="relative flex w-full flex-col items-center laptop:flex-row laptop:justify-around laptop:px-10">
          <div className="p-3 z-10 flex gap-6 flex-col laptop:w-1/3">
            <h1 className="text-5xl font-bold text-primary drop-shadow-2xl">
              {translations("title")}
            </h1>
            <p className="text-gray drop-shadow-md">
              {translations("subtitle")}
            </p>
            <div className="flex w-full flex-col justify-start gap-3 tablet:items-center mobile:items-center laptop:items-start">
              <Button
                variant="specialGray"
                size="lg"
                onClick={() => scrollToSection(ref_DownloadSection)}
              >
                {translations("download-button")}
                <div className="rounded-full bg-white p-1">
                  <CloudIcon className="text-2xl text-primary" />
                </div>
              </Button>
              <Button
                variant="specialBlue"
                size="lg"
                onClick={() => scrollToSection(ref_ReceiveAtHomeSection)}
              >
                {translations("receive-at-home-button")}
                <div className="rounded-full bg-white p-1">
                  <HouseIcon className="text-2xl text-primary" />
                </div>
              </Button>
            </div>
          </div>
          <BookCoverContainer />
        </div>
        <CompaniesContainer />
        <SummaryContainer />
        <BookCarousel />
      </div>
      <ReceiveAtHomeContainer receiveAtHomeFunctions={receiveAtHomeFunctions} />
      {/* <TalkToUsContainer talkToUsFunctions={talkToUsFunctions} /> */}
      <Footer />
    </>
  );
};
