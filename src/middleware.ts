import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Match only internationalized pathnames
  matcher: ["/", `/(ar|cz|de|en|es|fr|nl|pt|ru|zh|tw)/:path*`],
};
