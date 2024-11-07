import { HopeChannelIcon } from "../atoms/icons/hope-channel-icon";
import { Awr360Icon } from "../atoms/icons/awr-360-icon";
import { ReviewHeraldIcon } from "../atoms/icons/review-herald-icon";
import { EswIcon } from "../atoms/icons/esw-icon";

export const CompaniesContainer = () => {
  return (
    <div className="flex w-full max-w-[1800px] flex-row flex-wrap items-center justify-center gap-3 py-4 laptop:justify-around laptop:px-28">
      <a
        href="https://hopetv.org"
        target="_blank"
        className="hover:scale-125 transition-all  duration-300"
      >
        <HopeChannelIcon fill="black" />
      </a>
      <a
        href="https://awr.org"
        target="_blank"
        className="hover:scale-125 transition-all  duration-300"
      >
        <Awr360Icon fill="black" />
      </a>
      <a
        href="https://www.reviewandherald.com"
        target="_blank"
        className="hover:scale-125 transition-all  duration-300"
      >
        <ReviewHeraldIcon fill="black" />
      </a>
      <a
        href="https://egwwritings.org"
        target="_blank"
        className="hover:scale-125 transition-all  duration-300"
      >
        <EswIcon fill="black" />
      </a>
    </div>
  );
};
