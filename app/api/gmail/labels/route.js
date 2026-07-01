import { NextResponse } from "next/server";
import { listLabels } from "@/lib/gmail/fetchMessages";

export const runtime = "nodejs";

export async function GET() {
  try {
    const labels = await listLabels();
    return NextResponse.json({ labels });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
