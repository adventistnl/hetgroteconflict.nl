import { cn } from "@/utils/tailwind-merge";

interface Props {
  openNavbar: boolean;
  handleOpenNavbar: () => void;
}

export const HamburguerIcon = ({ openNavbar, handleOpenNavbar }: Props) => {
  return (
    <div className="z-10">
      <button
        className="group relative"
        aria-label="Navbar"
        onClick={handleOpenNavbar}
      >
        <div className="relative flex h-[50px] w-[50px] transform items-center justify-center overflow-hidden rounded-full transition-all duration-200">
          <div className="flex h-[20px] w-[20px] origin-center transform flex-col justify-between overflow-hidden transition-all duration-300">
            <div
              className={cn(
                "h-[2px] w-7 origin-left transform bg-primary transition-all duration-300",
                openNavbar && "translate-x-10",
              )}
            ></div>
            <div
              className={cn(
                "h-[2px] w-7 transform rounded bg-primary transition-all delay-75 duration-300",
                openNavbar && "translate-x-10",
              )}
            ></div>
            <div
              className={cn(
                "h-[2px] w-7 origin-left transform bg-primary transition-all delay-150 duration-300",
                openNavbar && "translate-x-10",
              )}
            ></div>

            <div
              className={cn(
                "absolute top-2.5 flex w-0 -translate-x-10 transform items-center justify-between transition-all duration-500",
                openNavbar && "w-12 translate-x-0",
              )}
            >
              <div
                className={cn(
                  "absolute h-[2px] w-5 rotate-0 transform bg-primary transition-all delay-300 duration-500",
                  openNavbar && "rotate-45",
                )}
              ></div>
              <div
                className={cn(
                  "absolute h-[2px] w-5 -rotate-0 transform bg-primary transition-all delay-300 duration-500",
                  openNavbar && "-rotate-45",
                )}
              ></div>
            </div>
          </div>
        </div>
      </button>
    </div>
  );
};
