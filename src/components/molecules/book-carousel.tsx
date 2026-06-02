import Carousel from "./caroussel";
import { BookCarouselItem } from "./book-carousel-item";
import { useTranslations } from "next-intl";
import { languages, isoToFlagCode, isoToBookCoverExtension } from "@/config/languages";

export function BookCarousel() {
  const translations = useTranslations("summary-container");
  const books = languages.map((lang, index) => {
    const extension = isoToBookCoverExtension[lang.isoCode] ?? "webp";
    return {
      keyValue: index,
      bookSrc: `${lang.name.toLowerCase()}.${extension}`,
      code: isoToFlagCode[lang.isoCode],
      value: lang.name,
    };
  });

  return (
    <div>
      <h2 className="pl-24 text-2xl text-primary">
        {translations("most-downloaded-title")}
      </h2>
      <Carousel ItemComponent={BookCarouselItem} items={books} />
    </div>
  );
}
