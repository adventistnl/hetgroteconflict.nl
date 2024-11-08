import { languagesIsoCodeList } from "@/utils/languages-iso-code-list";
import Carousel from "./caroussel";
import { BookCarouselItem } from "./book-carousel-item";
import { useTranslations } from "next-intl";

export function BookCarousel() {
  const translations = useTranslations("summary-container");
  const stableLanguageFlags: Record<string, string> = {
    AR: "sa",
    ZH: "cn",
    CZ: "cz",
    NL: "nl",
    EN: "gb",
    FR: "fr",
    DE: "de",
    PT: "pt",
    RU: "ru",
    ES: "es",
  };
  const books = languagesIsoCodeList.map((item, index) => {
    return {
      key: index,
      bookSrc: `${item.value.toLowerCase()}.${item.code === "EN" || item.code === "ES" || item.code === "DE" ? "avif" : "webp"}`,
      code: stableLanguageFlags[item.code],
      value: item.value,
    };
  });

  return (
    <div>
      <h2 className="text-2xl text-primary pl-24">
        {translations("most-downloaded-title")}
      </h2>
      <Carousel ItemComponent={BookCarouselItem} items={books} />
    </div>
  );
}
