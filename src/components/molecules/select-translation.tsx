"use client";

import { useMediaQuery } from "@/hooks/use-media-query";
import * as React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../atoms/popover";
import { Button } from "../atoms/button";
import { Drawer, DrawerContent, DrawerTrigger } from "../atoms/drawer";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../atoms/command";
import { PiTranslateBold as TranslateIcon } from "react-icons/pi";
import {
  LanguageISO,
  languagesIsoCodeList,
} from "@/utils/languages-iso-code-list";
import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { DialogTitle } from "../atoms/dialog";

export function SelectTranslation() {
  //States and Hooks
  const [open, setOpen] = React.useState(false);
  const locale = useLocale();
  const [selectedLanguage, setSelectedLanguage] = React.useState<LanguageISO>(
    languagesIsoCodeList.find(
      (lang) => lang.code.toLowerCase() === "en",
    ) as LanguageISO,
  );
  const isDesktop = useMediaQuery("(min-width: 768px)");

  //Effects
  React.useEffect(() => {
    setSelectedLanguage(
      languagesIsoCodeList.find(
        (lang) => lang.code.toLowerCase() === locale.toLowerCase(),
      ) as LanguageISO,
    );
  }, [locale]);

  //Render
  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger className="z-10" asChild>
          <Button
            variant="ghost"
            size="sm"
            className="justify-between text-indigo-950"
          >
            <TranslateIcon className="mr-2 text-2xl" />
            {selectedLanguage.code}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <LanguageList
            setOpen={setOpen}
            setSelectedLanguage={setSelectedLanguage}
          />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="justify-between text-indigo-950"
        >
          <TranslateIcon className="mr-2 text-2xl" /> {selectedLanguage.code}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <VisuallyHidden.Root>
          <DialogTitle>Select Language</DialogTitle>
        </VisuallyHidden.Root>
        <div className="mt-4 border-t">
          <LanguageList
            setOpen={setOpen}
            setSelectedLanguage={setSelectedLanguage}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function LanguageList({
  setOpen,
  setSelectedLanguage,
}: {
  setOpen: (open: boolean) => void;
  setSelectedLanguage: (language: LanguageISO) => void;
}) {
  //States and Hooks
  const router = useRouter();
  const pathname = usePathname();
  const treatedPathname = pathname
    .replaceAll("/en", "")
    .replaceAll("/fr", "")
    .replaceAll("/de", "")
    .replaceAll("/pt", "")
    .replaceAll("/es", "")
    .replaceAll("/ar", "")
    .replaceAll("/nl", "")
    .replaceAll("/ru", "")
    .replaceAll("/cz", "")
    .replaceAll("/zh", "");
  const [isChangingLanguage, startTransition] = React.useTransition();

  //Handlers
  const handleLanguageChange = (value: string) => {
    if (isChangingLanguage) return;

    const selectedLang = languagesIsoCodeList.find(
      (priority) => priority.value === value,
    ) as LanguageISO;
    setSelectedLanguage(selectedLang);
    const languageCode = selectedLang?.code.toLowerCase();

    startTransition(() => {
      setOpen(false);
      router.replace(`/${languageCode}/${treatedPathname}`);
      router.refresh();
    });
  };

  return (
    <Command>
      <CommandInput placeholder="Search language..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {languagesIsoCodeList.map((status) => (
            <CommandItem
              key={status.value}
              value={status.value}
              onSelect={(value) => handleLanguageChange(value)}
            >
              {status.value}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
