import { NextResponse } from "next/server";
import { getOAuth2Client } from "@/lib/auth/google";
import { setTokens, setUserEmail } from "@/lib/kv";
import { getUserProfile } from "@/lib/gmail/fetchMessages";
import { SESSION_COOKIE, createSessionCookieValue, sessionCookieOptions } from "@/lib/auth/session";

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error || !code) {
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error || "missing_code")}`);
  }

  try {
    const client = await getOAuth2Client();
    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);
    await setTokens(tokens);

    const profile = await getUserProfile();
    if (profile?.emailAddress) await setUserEmail(profile.emailAddress);

    const response = NextResponse.redirect(`${origin}/inbox`);
    response.cookies.set(SESSION_COOKIE, await createSessionCookieValue(), sessionCookieOptions);
    return response;
  } catch (err) {
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(err.message || "oauth_failed")}`);
  }
}
