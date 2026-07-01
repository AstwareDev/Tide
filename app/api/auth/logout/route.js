import { NextResponse } from "next/server";
import { clearTokens, clearUserEmail } from "@/lib/kv";
import { SESSION_COOKIE } from "@/lib/auth/session";

export async function POST() {
  await clearTokens();
  await clearUserEmail();
  const response = NextResponse.json({ success: true });
  response.cookies.delete(SESSION_COOKIE);
  return response;
}
