import { HopeChannelIcon } from "../atoms/icons/hope-channel-icon";
import { Awr360Icon } from "../atoms/icons/awr-360-icon";
import { ReviewHeraldIcon } from "../atoms/icons/review-herald-icon";
import { EswIcon } from "../atoms/icons/esw-icon";

interface Props {
  fill?: string;
}

export const CompaniesContainer = ({ fill = "black" }: Props) => {
  return (
    <div className="flex w-full max-w-[1800px] flex-row flex-wrap items-center justify-center gap-3 py-4 laptop:justify-around laptop:px-28 bg-transparent">
      <a
        href="https://hopetv.org"
        target="_blank"
        className="hover:scale-125 transition-all duration-300 bg-transparent hover:bg-transparent"
      >
        <HopeChannelIcon fill={fill} />
      </a>
      <a
        href="https://awr.org"
        target="_blank"
        className="hover:scale-125 transition-all duration-300 bg-transparent hover:bg-transparent"
      >
        <Awr360Icon fill={fill} />
      </a>
      <a
        href="https://www.reviewandherald.com"
        target="_blank"
        className="hover:scale-125 transition-all duration-300 bg-transparent hover:bg-transparent"
      >
        <ReviewHeraldIcon fill={fill} />
      </a>
      <a
        href="https://egwwritings.org"
        target="_blank"
        className="hover:scale-125 transition-all duration-300 bg-transparent hover:bg-transparent"
      >
        <EswIcon fill={fill} />
      </a>
    </div>
  );
};
