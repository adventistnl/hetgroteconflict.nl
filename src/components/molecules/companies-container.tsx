import { HopeChannelIcon } from "../atoms/icons/hope-channel-icon";
import { Awr360Icon } from "../atoms/icons/awr-360-icon";
import { ReviewHeraldIcon } from "../atoms/icons/review-herald-icon";
import { EswIcon } from "../atoms/icons/esw-icon";

interface Props {
  fill?: string;
}

const LOGOS = [
  { href: "https://hopetv.org",              label: "Hope Channel",    Icon: HopeChannelIcon },
  { href: "https://awr.org",                 label: "AWR 360",         Icon: Awr360Icon },
  { href: "https://www.reviewandherald.com", label: "Review & Herald", Icon: ReviewHeraldIcon },
  { href: "https://egwwritings.org",          label: "EGW Writings",    Icon: EswIcon },
];

// Triplicate so there is always a full set visible on both sides of the seam
const TRACK = [...LOGOS, ...LOGOS, ...LOGOS];

export const CompaniesContainer = ({ fill = "black" }: Props) => {
  return (
    <div className="relative w-full overflow-hidden py-4">
      {/* Fade masks */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 from-white/80 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 from-white/80 to-transparent" />

      {/*
        The track contains 3 copies of LOGOS.
        We animate translateX(0 → -33.333%) which shifts exactly one full set.
        Because the content before and after the seam is identical, the loop is seamless.
      */}
      <div className="flex w-max animate-marquee-third flex-row items-center gap-16">
        {TRACK.map(({ href, label, Icon }, i) => (
          <a
            key={i}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="flex shrink-0 items-center transition-transform duration-300 hover:scale-110"
          >
            <Icon fill={fill} />
          </a>
        ))}
      </div>
    </div>
  );
};

