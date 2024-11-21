import Image from "next/image";
import { DownloadMenubar } from "./download-menubar";
import { CountryFlag } from "../atoms/country-flag";

interface iProps {
  keyValue: number;
  bookSrc: string;
  value: string;
  code: string;
}
export function BookCarouselItem({ keyValue, bookSrc, code, value }: iProps) {
  console.log("bookSrc", bookSrc);
  return (
    <div
      key={keyValue}
      className="flex flex-col gap-4 text-primary transition-all duration-500 hover:scale-105"
    >
      <Image
        src={`/book-covers/${bookSrc}`}
        alt={`Book of ${value} cover`}
        width={233}
        height={327}
        className="cursor-pointer rounded-xl transition-all duration-500 ease-in-out"
      />
      <div className="flex gap-3">
        <p>value:</p>
        <div className="flex gap-2">
          <CountryFlag countryCode={code} />
          <p>{value}</p>
        </div>
      </div>
      <DownloadMenubar
        buttonStyle="secondary"
        selectedLanguage={{ label: value, value: value }}
      />
    </div>
  );
}
