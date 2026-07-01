import { DEFAULT_AGENTS } from "@/lib/agents/defaults";

export function AgentTemplatePicker({ onPick }) {
  return (
    <div className="grid grid-cols-1 gap-2">
      {DEFAULT_AGENTS.map((tpl) => (
        <button
          key={tpl.id}
          type="button"
          onClick={() => onPick({ name: `${tpl.name} (copy)`, prompt: tpl.prompt, action: tpl.action, labelName: tpl.labelName })}
          className="text-left rounded-lg border border-border bg-secondary hover:bg-accent p-3 transition-colors"
        >
          <p className="text-sm text-foreground font-medium">{tpl.name}</p>
          <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{tpl.prompt}</p>
        </button>
      ))}
    </div>
  );
}
