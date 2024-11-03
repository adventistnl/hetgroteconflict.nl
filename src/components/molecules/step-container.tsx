"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface Props {
  step_sub: string;
  step_count: string;
  explanation: string;
  link_sub: string;
  picture_src: string;
  show_border: boolean;
  href?: string;
  last_step?: boolean;
  second_step?: boolean;
}
export const StepContainer = ({
  explanation,
  link_sub,
  step_count,
  step_sub,
  picture_src,
  href,
  last_step,
  second_step,
}: Props) => {
  const [isMobile, setIsMoboile] = useState(true);
  const [isMedium, setIsMedium] = useState(true);

  const handleResize = () => {
    if (window.innerWidth <= 765) {
      setIsMoboile(true);
      setIsMedium(false);
    } else if (window.innerWidth > 765 && window.innerWidth < 1022) {
      setIsMoboile(false);
      setIsMedium(true);
    } else {
      setIsMoboile(false);
      setIsMedium(false);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className="flex flex-col text-primary gap-8 p-8 md:p-0 md:px-8 pw-100 "
      style={{
        borderRight: !last_step
          ? `${isMobile ? 0 : isMedium && second_step ? 0 : 1}px solid white`
          : undefined,
        borderBottom:
          isMobile && !last_step
            ? `${isMobile ? 1 : 0}px solid white`
            : undefined,
      }}
    >
      <div>
        <h6 className="text-gray font-thin capitalize">{step_sub}</h6>
        <h2 className="text-gray font-thin text-4xl">{step_count}</h2>
      </div>
      <Image
        className=""
        src={picture_src}
        alt="quote icon"
        width={100}
        height={100}
      />
      <p>
        <strong>{explanation}</strong>
      </p>
      {href && (
        <a
          className="border-b-[1.5px] border-black w-auto w-max"
          href={href}
          target="_blank"
        >
          {link_sub}
        </a>
      )}
    </div>
  );
};
