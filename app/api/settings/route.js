import { NextResponse } from "next/server";
import { getSettings, setSettings } from "@/lib/kv";

export async function GET() {
  const settings = await getSettings();
  return NextResponse.json({
    ...settings,
    geminiKeyConfigured: !!process.env.GEMINI_API_KEY,
  });
}

export async function PATCH(request) {
  const patch = await request.json();
  delete patch.geminiApiKey; // moved to env var, never persisted via API
  const settings = await setSettings(patch);
  return NextResponse.json({ ...settings, geminiKeyConfigured: !!process.env.GEMINI_API_KEY });
}
