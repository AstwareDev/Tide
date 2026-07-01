import { NextResponse } from "next/server";
import { listThreads } from "@/lib/gmail/fetchThreads";
import { getMessages } from "@/lib/gmail/fetchMessages";
import { classifyEmail } from "@/lib/ai/classifier";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(request) {
  const { prompt, action, labelName } = await request.json();
  if (!prompt) return NextResponse.json({ error: "prompt is required" }, { status: 400 });

  try {
    const { threads } = await listThreads({ maxResults: 10 });
    const ids = threads.map((t) => t.id);
    const emails = await getMessages(ids);

    const agent = { prompt, action: action || "label", labelName };
    const results = await Promise.all(
      emails.map(async (email) => {
        const result = await classifyEmail({ agent, email });
        return {
          messageId: email.id,
          subject: email.subject,
          from: email.from,
          matches: result.matches,
          reason: result.reason,
        };
      })
    );

    return NextResponse.json({ results });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
