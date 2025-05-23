"use client";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "../atoms/menubar";
import { track } from '@vercel/analytics';
import { MdKeyboardArrowDown as ArrowIcon } from "react-icons/md";
import { FaRegFilePdf as PdfIcon } from "react-icons/fa6";
import { AiOutlineBook as EpubIcon } from "react-icons/ai";
import { HiOutlineSquares2X2 as SquareIcon } from "react-icons/hi2";
import { IoBookOutline as OpenBookIcon } from "react-icons/io5";
import { FiBook as ClosedBookIcon } from "react-icons/fi";
import { SlEarphones as EarphoneIcon } from "react-icons/sl";
import Link from "next/link";
import { downloadList } from "@/utils/download-list";
import { LanguageObj } from "@/utils/languages-list";
import { useTranslations } from "next-intl";

interface Props {
  selectedLanguage: LanguageObj;
  buttonStyle?: "primary" | "secondary";
}

type materialType = "epub" | "pdf" | "promotional" | "studyGuide" | "readingPlan" | "audio"

export const DownloadMenubar = ({
  selectedLanguage,
  buttonStyle = "primary",
}: Props) => {
  const translations = useTranslations("download-menubar");
  const buttonStyleClass = {
    primary:
      "w-[150px] cursor-pointer rounded-full bg-indigo-950 px-5 py-2 text-white",
    secondary:
      "w-[150px] cursor-pointer rounded-full bg-none border border-primary px-5 py-2 text-primary",
  };
  const handleOnClick = (material: materialType) => {
     track('download', {material, language: selectedLanguage.label });
  }
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger className={buttonStyleClass[buttonStyle]}>
          {translations("download")} <ArrowIcon />
        </MenubarTrigger>
        <MenubarContent>
          {downloadList.pdf[selectedLanguage.value] && (
            <Link href={downloadList.pdf[selectedLanguage.value]}
              onClick={() => handleOnClick("pdf")}
            >
              <MenubarItem>
                <PdfIcon className="mr-2 text-2xl" /> PDF
              </MenubarItem>
            </Link>
          )}
          {downloadList.epub[selectedLanguage.value] && (
            <Link href={downloadList.epub[selectedLanguage.value]}
              onClick={() => handleOnClick("epub")}
            >
              <MenubarItem>
                <EpubIcon className="mr-2 text-2xl" />
                EPUB
              </MenubarItem>
            </Link>
          )}
          {downloadList.promotional[selectedLanguage.value] && (
            <Link
              href={downloadList.promotional[selectedLanguage.value]}
              target="_blank"
              onClick={() => handleOnClick("promotional")}
            >
              <MenubarItem>
                <SquareIcon className="mr-2 text-2xl" />
                {translations("promotional")}
              </MenubarItem>
            </Link>
          )}
          {downloadList.studyGuide[selectedLanguage.value] && (
            <Link href={downloadList.studyGuide[selectedLanguage.value]}
              onClick={() => handleOnClick("studyGuide")}
            >
              <MenubarItem>
                <OpenBookIcon className="mr-2 text-2xl" />
                {translations("study")}
              </MenubarItem>
            </Link>
          )}
          {downloadList.readingPlan[selectedLanguage.value] && (
            <Link href={downloadList.readingPlan[selectedLanguage.value]}
              onClick={() => handleOnClick("readingPlan")}
            >
              <MenubarItem>
                <ClosedBookIcon className="mr-2 text-2xl" />
                {translations("reading")}
              </MenubarItem>
            </Link>
          )}
          {downloadList.audio[selectedLanguage.value] && (
            <Link href={downloadList.audio[selectedLanguage.value]}
              onClick={() => handleOnClick("audio")}
            >
              <MenubarItem>
                <EarphoneIcon className="mr-2 text-2xl" />
                MP3
              </MenubarItem>
            </Link>
          )}
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
};
