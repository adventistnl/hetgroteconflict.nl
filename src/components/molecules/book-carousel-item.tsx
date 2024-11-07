import Image from "next/image";
import { DownloadMenubar } from "./download-menubar";
import { CountryFlag } from "../atoms/country-flag";

interface iProps {
  key: number;
  bookSrc: string;
  value: string;
  code: string;
}
export function BookCarouselItem({ key, bookSrc, code, value }: iProps) {
  return (
    <div key={key} className="flex flex-col text-primary gap-4">
      <Image
        src={`/book-covers/${bookSrc}`}
        alt={`Book of ${value} cover`}
        width={233}
        height={327}
        className="rounded-xl transition-all duration-500 ease-in-out cursor-pointer"
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
