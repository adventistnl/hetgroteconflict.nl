"use client";

import { useRouter } from "@/i18n/routing";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useEffect } from "react";
import { track } from "@vercel/analytics";
import { scrollToSection } from "@/utils/scroll-to-section";
import { useRefStore } from "../stores/ref-store";
import { Home, BookOpen, Users, MessageSquare, MapPin, LucideIcon } from "lucide-react";

interface NavItem {
  key: string;
  icon: LucideIcon;
  accent?: boolean;
  activePath?: string;
  onClick: () => void;
}

interface Props {
  onOpenChurchList: () => void;
}

export function MobileBottomNav({ onOpenChurchList }: Props) {
  const t = useTranslations("navbar");
  const router = useRouter();
  const locale = useLocale();
  const rawPathname = usePathname(); // e.g. /nl/guide/chapter/1
  const { ref_TalkToUsSection, setPendingScroll } = useRefStore();

  // Computed fresh every render — no stale closure risk
  const participatePath = `/${t("participate")}`;

  // isActive computes inline against rawPathname — always up-to-date
  const isActive = (activePath?: string): boolean => {
    if (!activePath) return false;
    if (activePath === "/") return rawPathname === `/${locale}` || rawPathname === "/";
    const full = `/${locale}${activePath}`;
    return rawPathname === full || rawPathname.startsWith(full + "/");
  };

  // Prefetch on mount for instant navigation
  useEffect(() => {
    router.prefetch("/");
    router.prefetch(participatePath);
    router.prefetch("/guide");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navItems: NavItem[] = [
    {
      key: "home",
      icon: Home,
      activePath: "/",
      onClick: () => { router.push("/"); track("sectionSelect", { section: "home" }); },
    },
    {
      key: "participate",
      icon: Users,
      activePath: participatePath,
      onClick: () => { router.push(participatePath); track("sectionSelect", { section: "participate" }); },
    },
    {
      key: "studyGuide",
      icon: BookOpen,
      accent: true,
      activePath: "/guide",
      onClick: () => { router.push("/guide"); track("sectionSelect", { section: "studyGuide" }); },
    },
    {
      key: "contact",
      icon: MessageSquare,
      onClick: () => {
        track("sectionSelect", { section: "contact" });
        if (ref_TalkToUsSection?.current) {
          scrollToSection(ref_TalkToUsSection);
        } else {
          setPendingScroll("talk-to-us");
          router.push("/");
        }
      },
    },
    {
      key: "findChurch",
      icon: MapPin,
      onClick: () => { onOpenChurchList(); track("sectionSelect", { section: "findChurch" }); },
    },
  ];

  return (
    <nav
      className="fixed left-0 right-0 z-[20] flex justify-center md:hidden"
      style={{ bottom: "calc(1.5rem + env(safe-area-inset-bottom, 0px))" }}
    >
      <div className="flex w-[80vw] items-center justify-between rounded-full border border-primary/10 bg-secondary px-3 py-2 shadow-lg">
        {navItems.map(({ key, icon: Icon, accent, onClick, activePath }) => {
          const active = isActive(activePath);

          if (accent) {
            return (
              <button
                key={key}
                onClick={onClick}
                className={`flex items-center justify-center rounded-full p-3.5 text-white shadow-md transition-all ${
                  active
                    ? "bg-[#4fa6c2] outline outline-2 outline-offset-2 outline-[#4fa6c2]/60 drop-shadow-lg"
                    : "bg-[#4fa6c2] hover:bg-[#3d91ad]"
                }`}
              >
                <Icon className="h-5 w-5" />
              </button>
            );
          }

          return (
            <button
              key={key}
              onClick={onClick}
              className={`flex items-center justify-center rounded-full p-3 transition-all ${
                active
                  ? "border border-white/80 bg-white text-primary shadow-sm"
                  : "text-primary hover:bg-primary/10"
              }`}
            >
              <Icon className={`h-5 w-5 ${active ? "opacity-100" : "opacity-60"}`} />
            </button>
          );
        })}
      </div>
    </nav>
  );
}
