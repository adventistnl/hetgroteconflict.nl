"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

export const Footer = () => {
  const translations = useTranslations("footer");

  return (
    <footer className="flex w-full flex-col items-center md:flex-row md:justify-around md:items-start gap-3 py-9 pt-12 text-white ">
      <div>
        <Link
          href="https://www.facebook.com/thegreatcontroversyproject/"
          target="_blank"
        >
          <Image
            className="cursor-pointer"
            src="/facebook-icon.svg"
            alt="facebook icon"
            width={30}
            height={30}
          />
        </Link>
      </div>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col items-center md:flex-row md:justify-end gap-6 px-3 text-xs desktop:text-sm">
          <p className="text-gray cursor-pointer">{translations("policy")}</p>
          <p className="text-gray cursor-pointer">{translations("legal")}</p>
          <p className="text-gray cursor-pointer">{translations("tradmark")}</p>
        </div>
        <div className="flex flex-col items-center md:items-end p-2 text-end text-[10px] desktop:text-xs">
          <p className="text-gray">
            Copyright 2024 Kerkgenootschap der Zevende-dags Adventisten
          </p>
          <p className="text-gray">
            Utrecht, Amersfoortseweg 18, 3712 BC Huis Ter Heide
          </p>
        </div>
      </div>
    </footer>
  );
};
