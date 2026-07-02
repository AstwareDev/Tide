import { NextResponse } from "next/server";
import { getAvatarUrls } from "@/lib/google/people";

export const runtime = "nodejs";

export async function POST(request) {
  const { emails } = await request.json();

  if (!Array.isArray(emails) || !emails.length) {
    return NextResponse.json({ avatars: {} });
  }

  try {
    const avatars = await getAvatarUrls(emails);
    return NextResponse.json({ avatars });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
