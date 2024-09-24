import { useEffect, useState } from "react";

export const useMediaQuery = (query: string) => {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    function onChange(event: MediaQueryListEvent) {
      setIsDesktop(event.matches);
    }

    const result = matchMedia(query);
    result.addEventListener("change", onChange);
    setIsDesktop(result.matches);

    return () => result.removeEventListener("change", onChange);
  }, [query]);

  return isDesktop;
};
