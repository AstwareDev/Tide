import { NextResponse } from "next/server";
import { SESSION_COOKIE, isValidSessionCookieValue } from "@/lib/auth/session";

const PUBLIC_PAGE_PREFIXES = ["/login"];
const PUBLIC_API_PREFIXES = ["/api/auth", "/api/cron"];

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const isApi = pathname.startsWith("/api");

  const isPublic = isApi
    ? PUBLIC_API_PREFIXES.some((p) => pathname.startsWith(p))
    : pathname === "/" || PUBLIC_PAGE_PREFIXES.some((p) => pathname.startsWith(p));

  if (isPublic) return NextResponse.next();

  const cookie = request.cookies.get(SESSION_COOKIE)?.value;
  const authed = await isValidSessionCookieValue(cookie);

  if (authed) return NextResponse.next();

  if (isApi) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|gif|webp|ico|webmanifest|json|xml|txt)$).*)",
  ],
};
