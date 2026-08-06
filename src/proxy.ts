/**
 * Proxy — Next.js 16's replacement for `middleware.ts`, same behaviour, new
 * name and location (`src/proxy.ts`, alongside `app/`).
 *
 * This is an *optimistic* check only. It reads the session cookie and
 * redirects, and never touches the database: proxy runs on every matched
 * request including prefetches, so a query here would be paid over and over.
 *
 * It is therefore not a security boundary. Anything that reads or writes admin
 * data calls `verifySession()` from `lib/auth/dal.ts`, which does check the
 * database. What this file buys is that a signed-out visitor lands on the login
 * page instead of rendering an admin shell first.
 */
import { NextResponse, type NextRequest } from "next/server";

import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth/jwt";

const LOGIN_PATH = "/admin/login";

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const session = await verifySessionToken(
    request.cookies.get(SESSION_COOKIE)?.value,
  );

  const isLoginPage = pathname === LOGIN_PATH;

  if (isLoginPage) {
    // Already signed in? Skip the form.
    return session
      ? NextResponse.redirect(new URL("/admin", request.url))
      : NextResponse.next();
  }

  if (!session) {
    const loginUrl = new URL(LOGIN_PATH, request.url);

    // Remember where they were headed so login can return them there. Only the
    // path is carried over, and it is validated on the way back out — see the
    // login action — so this cannot be turned into an open redirect.
    loginUrl.searchParams.set("next", `${pathname}${search}`);

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Scoped to /admin: the public site must not pay for this on every request,
  // and without a matcher proxy would also run for static assets and images.
  matcher: ["/admin", "/admin/:path*"],
};
