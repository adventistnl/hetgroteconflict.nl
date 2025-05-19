"use client";

import { ReactNode, useEffect, useState } from "react";
import { track } from '@vercel/analytics';
import Image from "next/image";
import { HamburguerIcon } from "../atoms/hamburguer-icon";
import { useRouter } from "next/navigation";
import { SelectTranslation } from "./select-translation";
import { useLocale, useTranslations } from "next-intl";
import { useMediaQuery } from "@/hooks/use-media-query";
import { scrollToSection } from "@/utils/scroll-to-section";
import { useRefStore } from "../stores/ref-store";
import { ChurchsList } from "../organisms/churchs-list-container";

interface Props {
  children: ReactNode;
}

export const MainContainer = ({ children }: Props) => {
  //States and Hooks
  const translations = useTranslations("navbar");
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const router = useRouter();
  const locale = useLocale();

  const [openNavbar, setOpenNavbar] = useState(false);
  const [openChurchList, setOpenChurchList] = useState(false);
  const [isVisibleHeader, setIsVisibleHeader] = useState(false);

  const { ref_TalkToUsSection } = useRefStore();

  //Handlers
  const handleOpenNavbar = () => {
    setOpenNavbar((oldState) => !oldState);
  };

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
                  className="cursor-pointer"
                  onClick={() => {
                    router.push(`/${locale}`);
                    track("sectionSelect", {section: "home"});
                  }}
                >
                  {translations("home")}
                </li>
                <li
                  className="cursor-pointer"
                  onClick={() => {
                    router.push(`/${locale}/${translations("participate")}`)
                    track("sectionSelect", {section: "participate"});
                  }}
                >
                  {translations("participate")}
                </li>
                <li
                  className="cursor-pointer"
                  onClick={() => { 
                    scrollToSection(ref_TalkToUsSection)
                    track("sectionSelect", {section: "contact"});
                  }}
                >
                  {translations("contact")}
                </li>
                <li
                  className="cursor-pointer"
                  onClick={() => {
                    setOpenNavbar(false);
                    setOpenChurchList(!openChurchList);
                    track("sectionSelect", {section: "findChurch"});
                  }}
                >
                  {translations("findChurch")}
                </li>
              </ul>
            </div>
            <SelectTranslation />
          </>
        ) : (
          <div className="flex flex-row items-center">
            {/* <SelectTranslation /> */}
            <HamburguerIcon
              openNavbar={openNavbar}
              handleOpenNavbar={handleOpenNavbar}
            />
          </div>
        )}
      </header>
      {openNavbar && (
        <nav className="fixed top-16 z-[20] flex h-full w-full items-start justify-center rounded-lg bg-secondary laptop:bottom-0 laptop:right-0 laptop:mx-3 laptop:h-52 laptop:w-52">
          <ul className="mt-28 flex flex-col gap-5 p-8 text-center text-2xl text-primary laptop:mt-0">
            <li
              className="cursor-pointer"
              onClick={() => {
                setOpenNavbar(false);
                setIsVisibleHeader(false);
                router.push(`/${locale}`);
                track("sectionSelect", {section: "home"});
              }}
            >
              {translations("home")}
            </li>
            <li
              className="cursor-pointer"
              onClick={() => {
                setOpenNavbar(false);
                setIsVisibleHeader(false);
                router.push(`/${locale}/${translations("participate")}`);
                track("sectionSelect", {section: "participate"});
              }}
            >
              {translations("participate")}
            </li>
            <li
              className="cursor-pointer"
              onClick={() => {
                setOpenNavbar(false);
                scrollToSection(ref_TalkToUsSection);
                track("sectionSelect", {section: "contact"});
              }}
            >
              {translations("contact")}
            </li>
            <li
              className="cursor-pointer"
              onClick={() => {
                setOpenNavbar(false);
                setOpenChurchList(true);
                track("sectionSelect", {section: "findChurch"});
              }}
            >
              {translations("findChurch")}
            </li>
            <li className="mt-12">
              <SelectTranslation />
            </li>
          </ul>
        </nav>
      )}

      <main>{children}</main>
      {openChurchList && <ChurchsList closeHandle={() => setOpenChurchList(false)} />}
    </div>
  );
};
