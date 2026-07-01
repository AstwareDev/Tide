import { NextResponse } from "next/server";
import { getTokens, getUserEmail } from "@/lib/kv";

export async function GET() {
  const tokens = await getTokens();
  const email = await getUserEmail();
  return NextResponse.json({ connected: !!tokens, email });
}
