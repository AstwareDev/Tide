import { NextResponse } from "next/server";
import { getSettings, setSettings } from "@/lib/kv";

export async function GET() {
  const settings = await getSettings();
  return NextResponse.json({
    ...settings,
    anthropicKeyConfigured: !!process.env.ANTHROPIC_API_KEY,
  });
}

export async function PATCH(request) {
  const patch = await request.json();
  delete patch.anthropicApiKey; // moved to env var, never persisted via API
  const settings = await setSettings(patch);
  return NextResponse.json({ ...settings, anthropicKeyConfigured: !!process.env.ANTHROPIC_API_KEY });
}
