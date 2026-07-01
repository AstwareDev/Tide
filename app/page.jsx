import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, isValidSessionCookieValue } from "@/lib/auth/session";

export default async function RootPage() {
  const cookieStore = await cookies();
  const authed = await isValidSessionCookieValue(cookieStore.get(SESSION_COOKIE)?.value);
  redirect(authed ? "/inbox" : "/login");
}
