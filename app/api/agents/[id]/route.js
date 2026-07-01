import { NextResponse } from "next/server";
import { getAgents, setAgents } from "@/lib/kv";

export async function PATCH(request, { params }) {
  const { id } = await params;
  const patch = await request.json();

  const agents = (await getAgents()) || [];
  let updated = null;
  const next = agents.map((agent) => {
    if (agent.id !== id) return agent;
    updated = { ...agent, ...patch, id: agent.id };
    return updated;
  });

  if (!updated) return NextResponse.json({ error: "Agent not found" }, { status: 404 });

  await setAgents(next);
  return NextResponse.json({ agent: updated, agents: next });
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  const agents = (await getAgents()) || [];
  const target = agents.find((a) => a.id === id);

  if (target?.isDefault) {
    return NextResponse.json({ error: "Default agents cannot be deleted" }, { status: 400 });
  }

  const next = agents.filter((a) => a.id !== id);
  await setAgents(next);
  return NextResponse.json({ agents: next });
}
