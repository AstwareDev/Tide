import { NextResponse } from "next/server";
import { listThreads } from "@/lib/gmail/fetchThreads";

export const runtime = "nodejs";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const pageToken = searchParams.get("pageToken") || undefined;
  const maxResults = Number(searchParams.get("maxResults")) || 50;

  try {
    const data = await listThreads({ maxResults, pageToken });
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
