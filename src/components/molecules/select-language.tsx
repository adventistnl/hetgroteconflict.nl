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
import { MdKeyboardArrowDown as ArrowIcon } from "react-icons/md";
import { LanguageObj, languagesList } from "@/utils/languages-list";
import { useTranslations } from "next-intl";

interface Props {
  selectedLanguage: LanguageObj;
  setSelectedLanguage: React.Dispatch<React.SetStateAction<LanguageObj>>;
}

export function SelectLanguage({
  selectedLanguage,
  setSelectedLanguage,
}: Props) {
  //States and Hooks
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="md" className="justify-between">
            {selectedLanguage.label} <ArrowIcon className="text-primary" />
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
        <Button variant="outline" size="md" className="justify-between">
          {selectedLanguage.label} <ArrowIcon className="text-primary" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
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
  setSelectedLanguage: (language: LanguageObj) => void;
}) {
  const translations = useTranslations("select-language");

  return (
    <Command>
      <CommandInput placeholder="Search language..." />
      <CommandList>
        <CommandEmpty>{translations("no-results")}</CommandEmpty>
        <CommandGroup>
          {languagesList.map((status) => (
            <CommandItem
              key={status.value}
              value={status.value}
              onSelect={(value) => {
                setSelectedLanguage(
                  languagesList.find(
                    (priority) => priority.value === value,
                  ) as LanguageObj,
                );
                setOpen(false);
              }}
            >
              {status.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
