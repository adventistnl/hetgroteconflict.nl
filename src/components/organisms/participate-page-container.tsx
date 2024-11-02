"use client";

import { Footer } from "../molecules/footer";
import { VideoContainer } from "../molecules/video-container";

interface Props {}

export const ParticipatePageContainer = ({}: Props) => {
  return (
    <>
      <div className="relative flex w-full flex-col items-center laptop:justify-around pb-12 mt-[70px]">
        <VideoContainer />
      </div>
      <Footer />
    </>
  );
};
