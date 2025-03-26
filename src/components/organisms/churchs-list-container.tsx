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
      <ul className="flex flex-col gap-4 overflow-y-auto">
        {filteredChurchs.map((option) => (
          <li
            key={option.id}
            className="border-gray-500 flex flex-col gap-2 border-b pb-6"
          >
            {option.name && <h3 className="font-bold">{option.name}</h3>}
            {option.address && <p className="text-gray">
              {translations("location")}: {option.address}
            </p>}
            {option.phoneNumber && <p className="text-gray">
              {translations("language")}: {option.phoneNumber}
            </p>}
            {option.days && <p className="text-gray">
              {translations("language")}: {option.days}
            </p>}
            <div className="flex space-x-4 text-gray">
              {option.email && (
                <LinkIcon
                  Icon={EmailIcon}
                  href={`mailto:${option.email}`}
                  text={`${translations("email")}: ${option.email}`}
                />
              )}
              {option.webSite && (
                <LinkIcon
                  Icon={GlobeIcon}
                  href={option.webSite}
                  target="_blank"
                  text={`${translations(".webSite")}: ${option.webSite}`}
                />
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};