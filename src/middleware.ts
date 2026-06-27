import createIntlMiddleware from "next-intl/middleware";
import { type NextRequest } from "next/server";
import { routing } from "./i18n/routing";
import { updateSession } from "./lib/supabase/middleware";

const intlMiddleware = createIntlMiddleware(routing);

export async function middleware(request: NextRequest) {
  // 1. Refresh Supabase auth session (keeps cookies fresh)
  const supabaseResponse = await updateSession(request);

  // 2. Run next-intl locale routing on top
  const intlResponse = intlMiddleware(request);

  // If intl wants to redirect/rewrite, honour it; otherwise use the Supabase response
  if (intlResponse.status !== 200 || intlResponse.headers.get("x-middleware-rewrite")) {
    return intlResponse;
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/", `/(ar|cz|de|en|es|fr|nl|pt|ru|zh|tw)/:path*`],
};
