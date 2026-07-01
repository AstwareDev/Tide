import { NextResponse } from "next/server";
import { getAgentRunStatus } from "@/lib/kv";

export async function GET() {
  const status = await getAgentRunStatus();
  return NextResponse.json(status);
}
