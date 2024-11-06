import { useState, useEffect, useMemo } from "react";
import { Input } from "../atoms/input";
import { useTranslations } from "next-intl";
import { LinkIcon } from "../atoms/link-icon";
import { EmailIcon } from "../atoms/icons/email-icon";
import { GlobeIcon } from "../atoms/icons/globe-icon";

interface publishHouse {
  name: string;
  languages: Array<string>;
  location: string;
  website?: string;
  email?: string;
}
interface iProps {
  closeHandle: VoidFunction;
}
export const PublishHousesContainer = ({ closeHandle }: iProps) => {
  const translations = useTranslations("publish-houses");
  const publishHouses: publishHouse[] = useMemo(
    () => [
      {
        name: "Albanian Seventh-day Adventist Publishing Service",
        languages: ["Albanian"],
        location: "Albania",
        email: "office@adventist.al",
      },
      {
        name: "Croatian Publishing House",
        languages: ["Croatian"],
        location: "Croatia",
        website: "https://www.znaci-vremena.com/",
      },
      {
        name: "Slovenian Publishing House",
        languages: ["Slovenian"],
        location: "Slovenia",
        email: "zalozba@adventisti.si",
      },
      {
        name: "Latvian Publishing House",
        languages: ["Latvian"],
        location: "Latvia",
        email: "lds@mail.bkc.lv",
      },
      {
        name: "Lithuanian Conference Publishing Coordinator",
        languages: ["Latvian"],
        location: "Lithuania",
        email: "office@adventistai.lt",
      },
      {
        name: "Stanborough Press Limited",
        languages: ["English"],
        location: "United Kingdom",
        website: "https://www.stanboroughpress.org.uk/",
      },
      {
        name: "Danish Publishing House",
        languages: ["Danish"],
        location: "Denmark",
        website: "https://danskbogforlag.dk/",
      },
      {
        name: "Finland Seventh-day Adventist Publishing House",
        languages: ["Finnish"],
        location: "Finland",
        website: "http://www.kirjatoimi.fi/",
      },
      {
        name: "Greek Mission Publishing Centre",
        languages: ["Greek"],
        location: "Greece",
        email: "yvrakas@adventist.gr",
      },
      {
        name: "Advent Publishing House",
        languages: ["Hungarian"],
        location: "Hungary",
        website: "http://adventkiado.hu/",
      },
      {
        name: "Iceland Publishing House",
        languages: ["Icelandic"],
        location: "Iceland",
        email: "gavin@adventistar.is",
      },
      {
        name: "Netherlands Publishing Service",
        languages: ["Dutch"],
        location: "Netherlands",
        website: "https://www.adventist.nl/",
      },
      {
        name: "Norwegian Publishing House",
        languages: ["Norwegian"],
        location: "Norway",
        website: "https://www.norskbokforlag.no/",
      },
      {
        name: "Polish Publishing House",
        languages: ["Polish"],
        location: "Poland",
        website: "https://znakiczasu.pl/",
      },
      {
        name: "Macedonian Publishing House",
        languages: ["Macedonian"],
        location: "Republic of Macedonia",
        website: "https://www.adventisti.org.mk/",
      },
      {
        name: "Serbian Publishing House",
        languages: ["Serbian"],
        location: "Serbia",
        website: "https://www.preporod.rs/",
      },
      {
        name: "Adventist Media and Forvaltning AB",
        languages: ["Swedish"],
        location: "Sweden",
        email: "rainer.refsback@adventist.se",
      },
    ],
    []
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPublishHouses, setFilteredPublishHouses] =
    useState(publishHouses);

  useEffect(() => {
    setFilteredPublishHouses(
      publishHouses.filter((option) =>
        option.languages.some((language) =>
          language.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    );
  }, [publishHouses, searchTerm]);

  return (
    <div className="fixed flex flex-col gap-4 p-4 text-primary bg-white w-full max-w-[500px] z-[100] h-screen top-0 right-0">
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
        {filteredPublishHouses.map((option, index) => (
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
              {option.email && (
                <LinkIcon
                  Icon={EmailIcon}
                  href={`mailto:${option.email}`}
                  text={translations("email")}
                />
              )}
              {option.website && (
                <LinkIcon
                  Icon={GlobeIcon}
                  href={option.website}
                  text={translations("website")}
                />
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
