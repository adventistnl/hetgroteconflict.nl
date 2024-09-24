import { MutableRefObject } from "react";

export const scrollToSection = (
  ref: MutableRefObject<HTMLDivElement | null> | null,
) => {
  if (ref?.current) {
    ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};
