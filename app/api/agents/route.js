import { NextResponse } from "next/server";
import { getAgents, setAgents } from "@/lib/kv";
import { DEFAULT_AGENTS } from "@/lib/agents/defaults";

async function ensureDefaultAgents() {
  const existing = await getAgents();
  if (existing) return existing;
  return setAgents(DEFAULT_AGENTS);
}

export async function GET() {
  const agents = await ensureDefaultAgents();
  return NextResponse.json({ agents });
}

export async function POST(request) {
  const body = await request.json();
  if (!body.name || !body.prompt) {
    return NextResponse.json({ error: "name and prompt are required" }, { status: 400 });
  }

  const agents = await ensureDefaultAgents();
  const agent = {
    id: crypto.randomUUID(),
    name: body.name,
    prompt: body.prompt,
    action: body.action || "label",
    labelName: body.labelName || null,
    enabled: body.enabled !== false,
    isDefault: false,
    createdAt: Date.now(),
  };
  const next = [...agents, agent];
  await setAgents(next);
  return NextResponse.json({ agent, agents: next }, { status: 201 });
}
