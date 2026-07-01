import { NextResponse } from "next/server";
import { applyAction } from "@/lib/gmail/modifyMessage";

export const runtime = "nodejs";

export async function POST(request) {
  const { messageId, action, labelName } = await request.json();

  if (!messageId || !action) {
    return NextResponse.json({ error: "messageId and action are required" }, { status: 400 });
  }

  try {
    await applyAction(messageId, action, labelName);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
