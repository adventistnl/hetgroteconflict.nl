import { HopeChannelIcon } from "../atoms/icons/hope-channel-icon";
import { Awr360Icon } from "../atoms/icons/awr-360-icon";
import { ReviewHeraldIcon } from "../atoms/icons/review-herald-icon";
import { EswIcon } from "../atoms/icons/esw-icon";

export const CompaniesContainer = () => {
  return (
    <div className="flex w-full max-w-[1800px] flex-row flex-wrap items-center justify-center gap-3 py-4 laptop:justify-around laptop:px-28">
      <HopeChannelIcon fill="black" />
      <Awr360Icon fill="black" />
      <ReviewHeraldIcon fill="black" />
      <EswIcon fill="black" />
    </div>
  );
};
