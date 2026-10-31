"use client";

import FormData from "@/app/interfaces/form-data";
import { CompaniesContainer } from "@/components/molecules/companies-container";
// import { ReceiveAtHomeContainer } from "@/components/molecules/receive-at-home-container";
import { useEffect } from "react";

import { useRefStore } from "../stores/ref-store";
import { scrollToSection } from "@/utils/scroll-to-section";
import { TalkToUsContainer } from "./talk-to-us-container";
import TalkToUsFormData from "@/app/interfaces/talk-to-us-form-data";
import { Footer } from "../molecules/footer";
import { BookCarousel } from "../molecules/book-carousel";
import { BookRevealScrollVideo } from "./book-reveal-scroll-video";
import GlobeScrollDemo from "@/components/ui/landing-page";

interface Props {
  receiveAtHomeFunctions: (formData: FormData) => Promise<null>;
  talkToUsFunctions: (formData: TalkToUsFormData) => Promise<null>;
}

export const HomePageContainer = ({
  // receiveAtHomeFunctions,
  talkToUsFunctions,
}: Props) => {
  const { ref_TalkToUsSection, pendingScroll, setPendingScroll } = useRefStore();

  useEffect(() => {
    if (pendingScroll === "talk-to-us" && ref_TalkToUsSection?.current) {
      scrollToSection(ref_TalkToUsSection);
      setPendingScroll(null);
    }
  }, [pendingScroll, ref_TalkToUsSection, setPendingScroll]);

  return (
    <>
      {/* Scroll-driven globe intro, placed above the book-reveal hero. */}
      <GlobeScrollDemo />
      {/* Hero: pinned scroll-scrubbed book reveal, with the download CTA
          shown up front and the full summary + download options inside its
          own Resumo panel further along the scrub. Right after, in the same
          continuous pin, it renders the World Age trailer as a second
          sticky layer that slides up to cover it while the book closes back
          up in reverse. */}
      <BookRevealScrollVideo />
      <div className="relative flex w-full flex-col items-center laptop:justify-around gap-6 pb-12 pt-12">
        <CompaniesContainer />
        <BookCarousel />
      </div>
      {/* <ReceiveAtHomeContainer receiveAtHomeFunctions={receiveAtHomeFunctions} /> */}
      <div id="talk-to-us" className="w-full">
        <TalkToUsContainer talkToUsFunctions={talkToUsFunctions} />
      </div>
      <Footer />
    </>
  );
};
