"use client";

import { ReactNode, useEffect, useState } from "react";
import { track } from '@vercel/analytics';
import Image from "next/image";
import { useRouter } from "next/navigation";
import { SelectTranslation } from "./select-translation";
import { useLocale, useTranslations } from "next-intl";
import { useMediaQuery } from "@/hooks/use-media-query";
import { scrollToSection } from "@/utils/scroll-to-section";
import { useRefStore } from "../stores/ref-store";
import { MobileBottomNav } from "./mobile-bottom-nav";

interface Props {
  children: ReactNode;
}

export const MainContainer = ({ children }: Props) => {
  //States and Hooks
  const translations = useTranslations("navbar");
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const router = useRouter();
  const locale = useLocale();

  const [isVisibleHeader, setIsVisibleHeader] = useState(false);

  const { ref_TalkToUsSection } = useRefStore();
  const { setPendingScroll } = useRefStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsVisibleHeader(window.scrollY > 25); // Ajuste o valor 50 conforme necessário
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isVisibleHeader]);

  return (
    <div className="relative">
      <header
        className={`duration-50 fixed z-[15] flex w-screen items-center justify-between bg-secondary px-5 py-3 shadow-md transition-all ease-in-out ${!isVisibleHeader ? "shadow-none" : "shadow-brown"}`}
        style={{
          boxShadow: isVisibleHeader ? "0 4px 6px rgba(0, 0, 0, 0.1)" : "none",
        }}
      >
        {/* Resto do conteúdo */}
        <Image
          src="/logo.svg"
          alt="logo"
          width={60}
          height={60}
          className="cursor-pointer"
          onClick={() => router.push("/")}
        />
        {isDesktop ? (
          <>
            <div className="z-10 flex flex-row items-center">
              <ul className="flex flex-row gap-16 text-center text-primary">
                <li
                  className="group relative cursor-pointer"
                  onClick={() => {
                    router.push(`/${locale}`);
                    track("sectionSelect", {section: "home"});
                  }}
                >
                  {translations("home")}
                  <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-primary transition-all duration-300 group-hover:w-full" />
                </li>
                <li
                  className="group relative cursor-pointer"
                  onClick={() => {
                    router.push(`/${locale}/guide`);
                    track("sectionSelect", {section: "studyGuide"});
                  }}
                >
                  {translations("studyGuide")}
                  <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-primary transition-all duration-300 group-hover:w-full" />
                </li>
                <li
                  className="group relative cursor-pointer"
                  onClick={() => {
                    router.push(`/${locale}/${translations("participate")}`)
                    track("sectionSelect", {section: "participate"});
                  }}
                >
                  {translations("participate")}
                  <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-primary transition-all duration-300 group-hover:w-full" />
                </li>
                <li
                  className="group relative cursor-pointer"
                  onClick={() => {
                    track("sectionSelect", {section: "contact"});
                    if (ref_TalkToUsSection?.current) {
                      scrollToSection(ref_TalkToUsSection);
                    } else {
                      setPendingScroll("talk-to-us");
                      router.push(`/${locale}`);
                    }
                  }}
                >
                  {translations("contact")}
                  <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-primary transition-all duration-300 group-hover:w-full" />
                </li>
                <li
                  className="group relative cursor-pointer"
                  onClick={() => {
                    router.push(`/${locale}/find-church`);
                    track("sectionSelect", {section: "findChurch"});
                  }}
                >
                  {translations("findChurch")}
                  <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-primary transition-all duration-300 group-hover:w-full" />
                </li>
              </ul>
            </div>
            <SelectTranslation />
          </>
        ) : (
          <div className="flex flex-row items-center">
            <SelectTranslation />
          </div>
        )}
      </header>

      <main>{children}</main>

      <MobileBottomNav />
    </div>
  );
};
