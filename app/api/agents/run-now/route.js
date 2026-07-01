import { NextResponse } from "next/server";
import { runAgentCycle } from "@/lib/agents/runner";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST() {
  try {
    const result = await runAgentCycle();
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
