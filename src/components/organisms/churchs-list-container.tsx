import { useState, useEffect, useMemo } from "react";
import { Input } from "../atoms/input";
import { useTranslations } from "next-intl";
import { LinkIcon } from "../atoms/link-icon";
import { EmailIcon } from "../atoms/icons/email-icon";
import { GlobeIcon } from "../atoms/icons/globe-icon";
import { iChurchs, churchsDatabase } from "@/database/churchs";


interface ChurchsListProps {
  closeHandle: VoidFunction;
}

export const ChurchsList = ({ closeHandle }: ChurchsListProps) => {
  const translations = useTranslations("churchs-list");
  const [searchTerm, setSearchTerm] = useState("");

  const churchs: iChurchs[] = useMemo(
    () => churchsDatabase,
    []
  );
  const [filteredChurchs, setFilteredChurchs] =
    useState(churchs);

  useEffect(() => {
    setFilteredChurchs(
      churchs.filter((option) =>
        option.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        option.name?.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    );
  }, [churchs, searchTerm]);
  return (
    <div className="fixed right-0 top-0 z-[100] flex h-screen w-full max-w-[500px] flex-col gap-4 bg-white p-4 text-primary">
      <h2 className="text-xl">{translations("title")}</h2>
      <Input
        type="text"
        placeholder={translations("placeholder")}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full"
      />
      <button onClick={closeHandle} className="absolute right-6 text-2xl">
        X
      </button>
      <ul className="flex flex-col gap-4 overflow-y-auto overflow-x-hidden">
        {filteredChurchs
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((option) => {
            return (
              <li
                key={option.id}
                className="border-gray-500 flex w-full flex-col gap-2 border-b pb-6"
              >
                {option.name && <h3 className="font-bold break-words break-normal">{option.name}</h3>}
                {option.address && <p className="text-gray break-words break-normal">
                  <b>{translations("address")}: </b>
                  {option.address}
                </p>}
                {option.phoneNumber && <p className="text-gray break-words break-normal">
                  <b>{translations("phoneNumber")}: </b>
                  {option.phoneNumber}
                </p>}
                {option.days && <p className="text-gray break-words break-normal">
                  <b>{translations("days")}: </b>
                  {option.days[0].split(", ").map((day) => translations(`daysOfWeek.${day}`)).join(", ")}
                </p>}
                {/* <div className="flex w-full flex-col text-gray"> */}
                {option.email && (
                  <LinkIcon
                    Icon={EmailIcon}
                    href={`mailto:${option.email}`}
                    text={option.email}
                    span={`${translations("email")}: `}
                    color="gray"
                  />
                )}
                {option.website && (
                  <LinkIcon
                    Icon={GlobeIcon}
                    href={option.website}
                    target="_blank"
                    text={option.website}
                    span={`${translations("website")}: `}
                    color="gray"
                  />
                )}
                {/* </div> */}
              </li>
            )
          })}
      </ul>
    </div>
  );
};