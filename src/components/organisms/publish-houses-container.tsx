import { useState, useEffect, useMemo } from "react";
import { Input } from "../atoms/input";
import { useTranslations } from "next-intl";
import { LinkIcon } from "../atoms/link-icon";
import { EmailIcon } from "../atoms/icons/email-icon";
import { GlobeIcon } from "../atoms/icons/globe-icon";

interface iProps {
  closeHandle: VoidFunction;
}
export const PublishHousesContainer = ({ closeHandle }: iProps) => {
  const translations = useTranslations("publish-houses");
  const options = useMemo(
    () => [
      {
        name: "Africa Herald Publishing House",
        languages: [
          "English",
          "Arabic",
          "Greek",
          "English",
          "Arabic",
          "Greek",
          "English",
          "Arabic",
          "Greek",
          "English",
          "Arabic",
          "Greek",
        ],
        location: "Kenya",
        website: "https://example.com",
        email: "info@example.com",
      },
      {
        name: "AAA",
        languages: ["Greek"],
        location: "Kenya",
        website: "https://example.com",
        email: "info@example.com",
      },
      {
        name: "BBB",
        languages: ["English"],
        location: "Kenya",
        website: "https://example.com",
        email: "info@example.com",
      },
      {
        name: "BBB",
        languages: ["English"],
        location: "Kenya",
        website: "https://example.com",
        email: "info@example.com",
      },
      {
        name: "BBB",
        languages: ["English"],
        location: "Kenya",
        website: "https://example.com",
        email: "info@example.com",
      },
      {
        name: "BBB",
        languages: ["English"],
        location: "Kenya",
        website: "https://example.com",
        email: "info@example.com",
      },
      {
        name: "BBB",
        languages: ["English"],
        location: "Kenya",
        website: "https://example.com",
        email: "info@example.com",
      },
      {
        name: "BBB",
        languages: ["English"],
        location: "Kenya",
        website: "https://example.com",
        email: "info@example.com",
      },
      // Adicione mais opções conforme necessário
    ],
    []
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);

  useEffect(() => {
    setFilteredOptions(
      options.filter((option) =>
        option.languages.some((language) =>
          language.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    );
  }, [options, searchTerm]);

  return (
    <div className="fixed flex flex-col gap-4 p-4 text-primary bg-white max-w-[500px] z-[100] h-screen top-0 right-0">
      <h2 className="text-xl">Publishing House</h2>
      <Input
        type="text"
        placeholder="Find by language"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full"
      />
      <button onClick={closeHandle} className="absolute right-6 text-2xl">
        X
      </button>
      <ul className="flex flex-col gap-4 overflow-y-auto">
        {filteredOptions.map((option, index) => (
          <li
            key={index}
            className="flex flex-col border-b border-gray-500 gap-2 pb-6"
          >
            <h3 className="font-bold">{option.name}</h3>
            <p className="text-gray">
              {translations("language")}: {option.languages.join(", ")}
            </p>
            <p className="text-gray">
              {translations("location")}: {option.location}
            </p>
            <div className="flex space-x-4 text-gray">
              <LinkIcon
                Icon={EmailIcon}
                href={`mailto:${option.email}`}
                text={translations("email")}
              />
              <LinkIcon
                Icon={GlobeIcon}
                href=""
                text={translations("website")}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
