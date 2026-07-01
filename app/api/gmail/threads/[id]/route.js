import { NextResponse } from "next/server";
import { getThread } from "@/lib/gmail/fetchThreads";

export const runtime = "nodejs";

export async function GET(request, { params }) {
  const { id } = await params;
  try {
    const thread = await getThread(id);
    return NextResponse.json(thread);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
