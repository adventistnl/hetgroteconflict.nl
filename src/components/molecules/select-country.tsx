"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../atoms/select";
import { UseFormSetValue } from "react-hook-form";
import { useTranslations } from "next-intl";
import FormData from "@/app/interfaces/form-data";

interface Props {
  setValue: UseFormSetValue<FormData>;
}

export const SelectCountry = ({ setValue }: Props) => {
  const translations = useTranslations("select-country");

  return (
    <Select
      defaultValue="Netherlands"
      onValueChange={(value) => setValue("country", value)}
    >
      <SelectTrigger className="w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Netherlands">
          {translations("netherlands")}
        </SelectItem>
        <SelectItem value="Belgium">{translations("belgium")}</SelectItem>
        <SelectItem value="Germany">{translations("germany")}</SelectItem>
      </SelectContent>
    </Select>
  );
};
