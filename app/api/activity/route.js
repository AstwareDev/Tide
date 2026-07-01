import { NextResponse } from "next/server";
import { getActivity } from "@/lib/activity/log";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const limit = Number(searchParams.get("limit")) || 100;
  const entries = await getActivity(limit);
  return NextResponse.json({ entries });
}
