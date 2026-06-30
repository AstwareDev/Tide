import { useState } from "react";
import { Plus, Bot, Pencil, Trash2, Tag, Archive, Trash } from "lucide-react";
import { useAgents } from "../context/AgentContext";

const ACTION_COLORS = {
  label: "text-blue-400",
  archive: "text-amber-400",
  delete: "text-red-400",
  skip: "text-gray-400",
};

const ACTION_ICONS = {
  label: Tag,
  archive: Archive,
  delete: Trash,
  skip: Bot,
};

function AgentFormModal({ initial, onSave, onClose }) {
  const [form, setForm] = useState(
    initial || { name: "", prompt: "", action: "label", labelName: "", enabled: true }
  );

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-[#1a1d27] border border-white/10 rounded-2xl w-full max-w-lg p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-white font-semibold text-lg mb-6">{initial ? "Edit Agent" : "New Agent"}</h2>

        <div className="space-y-4">
          <div>
            <label className="text-xs text-gray-400 mb-1.5 block">Name</label>
            <input
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="e.g. Newsletter Archiver"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-blue-500/60"
            />
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-1.5 block">Prompt</label>
            <textarea
              value={form.prompt}
              onChange={(e) => set("prompt", e.target.value)}
              placeholder="Describe what kind of email this agent should handle…"
              rows={4}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-blue-500/60 resize-none"
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs text-gray-400 mb-1.5 block">Action</label>
              <select
                value={form.action}
                onChange={(e) => set("action", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500/60"
              >
                <option value="label">Label</option>
                <option value="archive">Archive</option>
                <option value="delete">Delete</option>
              </select>
            </div>

            {form.action === "label" && (
              <div className="flex-1">
                <label className="text-xs text-gray-400 mb-1.5 block">Label name</label>
                <input
                  value={form.labelName}
                  onChange={(e) => set("labelName", e.target.value)}
                  placeholder="e.g. Education"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-blue-500/60"
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-400 hover:text-gray-200 transition-colors">
            Cancel
          </button>
          <button
            onClick={() => { onSave(form); onClose(); }}
            disabled={!form.name || !form.prompt}
            className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium"
          >
            {initial ? "Save changes" : "Create agent"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AgentsScreen() {
  const { agents, createAgent, updateAgent, deleteAgent } = useAgents();
  const [modal, setModal] = useState(null); // null | 'create' | { agent }

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-gray-500 text-sm mt-0.5">{agents.filter((a) => a.enabled).length} active · {agents.length} total</p>
        </div>
        <button
          onClick={() => setModal("create")}
          className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus size={14} />
          New agent
        </button>
      </div>

      <div className="space-y-3">
        {agents.map((agent) => {
          const ActionIcon = ACTION_ICONS[agent.action] || Bot;
          return (
            <div key={agent.id} className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4 flex items-start gap-4">
              {/* Icon */}
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                <ActionIcon size={18} className={ACTION_COLORS[agent.action]} strokeWidth={1.5} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-white text-sm font-medium">{agent.name}</span>
                  {agent.isDefault && (
                    <span className="text-[10px] text-gray-600 bg-white/5 px-1.5 py-0.5 rounded">default</span>
                  )}
                </div>
                <p className="text-gray-500 text-xs leading-relaxed mb-2 line-clamp-2">{agent.prompt}</p>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium ${ACTION_COLORS[agent.action]}`}>
                    {agent.action === "label" ? `Label → ${agent.labelName}` : agent.action.charAt(0).toUpperCase() + agent.action.slice(1)}
                  </span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-1 shrink-0">
                {/* Toggle */}
                <button
                  onClick={() => updateAgent(agent.id, { enabled: !agent.enabled })}
                  className={`relative w-9 h-5 rounded-full transition-colors ${agent.enabled ? "bg-blue-600" : "bg-white/10"}`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${agent.enabled ? "left-[18px]" : "left-0.5"}`} />
                </button>

                <button
                  onClick={() => setModal({ agent })}
                  className="w-7 h-7 flex items-center justify-center text-gray-600 hover:text-gray-300 transition-colors ml-1"
                >
                  <Pencil size={13} />
                </button>

                {!agent.isDefault && (
                  <button
                    onClick={() => deleteAgent(agent.id)}
                    className="w-7 h-7 flex items-center justify-center text-gray-600 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {modal === "create" && (
        <AgentFormModal
          onSave={(data) => createAgent(data)}
          onClose={() => setModal(null)}
        />
      )}

      {modal?.agent && (
        <AgentFormModal
          initial={modal.agent}
          onSave={(data) => updateAgent(modal.agent.id, data)}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
