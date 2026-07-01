import { NextResponse } from "next/server";
import { undoActivityEntry } from "@/lib/activity/log";

export const runtime = "nodejs";

export async function POST(request) {
  const { entryId } = await request.json();
  if (!entryId) return NextResponse.json({ error: "entryId is required" }, { status: 400 });

  try {
    const entry = await undoActivityEntry(entryId);
    return NextResponse.json({ entry });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
