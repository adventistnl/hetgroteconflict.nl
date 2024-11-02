"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export const VideoContainer = () => {
  const [showVideo, setShowVideo] = useState(false);
  const [buttonSize, setButtonSize] = useState(65);
  const translations = useTranslations(
    "participate-page-container.video-container"
  );

  const handleResize = () => {
    if (window.innerWidth > 768) {
      setButtonSize(65);
    } else if (window.innerWidth <= 600) {
      setButtonSize(30);
    } else {
      setButtonSize(50);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="bg-deep_blue w-full flex justify-center">
      <div className="relative max-w-[1800px] flex justify-center w-full flex gap-6 flex-col lg:flex-row-reverse xl:flex-row-reverse items-center justify-between ">
        <div className="relative flex items-center justify-center bg-right bg-no-repeat lg:max-w-[1074px]">
          <Image
            src="/video-cover.svg"
            alt="Button Icon"
            width={0}
            height={0}
            className="flex items-center justify-center bg-right bg-no-repeat w-[100%] lg:max-w-[1200px]"
          />

          <button
            onClick={() => setShowVideo(true)}
            className="absolute flex items-center justify-center flex-col gap-4 "
          >
            <Image
              className="button-image"
              src="/playbutton.svg"
              alt="Button Icon"
              width={buttonSize}
              height={buttonSize}
            />
            <p className="text-sm sm:text-xl">
              {translations("play-sub-text")}
            </p>
          </button>
        </div>

        <div className="md:absolute pb-4 flex flex-grow flex-col gap-2 justify-start lg:left-[140px] xl:left-[240px] left-[100px] bottom-[100px] lg:bottom-[150px] ">
          <h1 className="text-3xl sm:text-5xl font-plus-jakarta-sans text-white font-normal drop-shadow-2xl">
            {translations("name")}
          </h1>
          <p className="text-white max-w-[60%] text-base">
            {translations("role")}
          </p>
        </div>
        {showVideo && (
          <div
            onClick={() => setShowVideo(false)}
            className="fixed  flex flex-col items-center justify-center inset-0 z-10 bg-black bg-opacity-80 w-[100vw] h-[100vh]"
          >
            <iframe
              title="vimeo-player"
              src="https://player.vimeo.com/video/749148790?h=5fb7c065f9"
              width="100%"
              height="56.25%"
              allowFullScreen
            />
          </div>
        )}
      </div>
    </div>
  );
};
