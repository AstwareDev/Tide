import { Bot, Pencil, Trash2, Tag, Archive, Trash } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

const ACTION_COLORS = {
  label: "text-primary",
  archive: "text-amber-600",
  delete: "text-destructive",
  skip: "text-muted-foreground",
};

const ACTION_ICONS = { label: Tag, archive: Archive, delete: Trash, skip: Bot };

export function AgentCard({ agent, onToggle, onEdit, onDelete }) {
  const ActionIcon = ACTION_ICONS[agent.action] || Bot;

  return (
    <div className="bg-card border border-border rounded-xl p-4 flex items-start gap-4">
      <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shrink-0">
        <ActionIcon size={18} className={ACTION_COLORS[agent.action]} strokeWidth={1.5} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-foreground text-sm font-medium">{agent.name}</span>
          {agent.isDefault && <span className="text-[10px] text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">default</span>}
        </div>
        <p className="text-muted-foreground text-xs leading-relaxed mb-2 line-clamp-2">{agent.prompt}</p>
        <span className={`text-xs font-medium ${ACTION_COLORS[agent.action]}`}>
          {agent.action === "label" ? `Label → ${agent.labelName}` : agent.action.charAt(0).toUpperCase() + agent.action.slice(1)}
        </span>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <Switch checked={agent.enabled} onCheckedChange={onToggle} />
        <Button variant="ghost" size="icon" onClick={onEdit} className="ml-1">
          <Pencil size={13} />
        </Button>
        {!agent.isDefault && (
          <Button variant="ghost" size="icon" onClick={onDelete} className="hover:text-destructive">
            <Trash2 size={13} />
          </Button>
        )}
      </div>
    </div>
  );
}
