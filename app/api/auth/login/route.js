import { NextResponse } from "next/server";
import { getOAuth2Client, buildAuthUrl } from "@/lib/auth/google";

export async function GET() {
  const client = await getOAuth2Client();
  const authUrl = buildAuthUrl(client);
  return NextResponse.redirect(authUrl);
}
