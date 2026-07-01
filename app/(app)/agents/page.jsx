"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AgentCard } from "@/components/agents/agent-card";
import { AgentFormSheet } from "@/components/agents/agent-form-sheet";
import { api } from "@/lib/api-client";

export default function AgentsPage() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sheet, setSheet] = useState(null); // null | 'create' | { agent }

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.agents.list();
      setAgents(data.agents || []);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (data) => {
    try {
      const res = await api.agents.create(data);
      setAgents(res.agents);
      toast.success("Agent created");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleUpdate = async (id, data) => {
    try {
      const res = await api.agents.update(id, data);
      setAgents(res.agents);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await api.agents.remove(id);
      setAgents(res.agents);
      toast.success("Agent deleted");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-500 text-sm mt-0.5">
          {agents.filter((a) => a.enabled).length} active · {agents.length} total
        </p>
        <Button onClick={() => setSheet("create")}>
          <Plus size={14} />
          New agent
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-[92px] w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {agents.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              onToggle={(enabled) => handleUpdate(agent.id, { enabled })}
              onEdit={() => setSheet({ agent })}
              onDelete={() => handleDelete(agent.id)}
            />
          ))}
        </div>
      )}

      <AgentFormSheet
        open={sheet === "create"}
        onOpenChange={(open) => !open && setSheet(null)}
        onSave={handleCreate}
      />
      <AgentFormSheet
        open={!!sheet?.agent}
        onOpenChange={(open) => !open && setSheet(null)}
        initial={sheet?.agent}
        onSave={(data) => handleUpdate(sheet.agent.id, data)}
      />
    </div>
  );
}
