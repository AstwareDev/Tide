import { Tag, Trash2, Archive, SkipForward, AlertCircle, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const ACTION_CONFIG = {
  label: { icon: Tag, color: "text-blue-400", bg: "bg-blue-500/10", label: "Labeled" },
  delete: { icon: Trash2, color: "text-red-400", bg: "bg-red-500/10", label: "Deleted" },
  archive: { icon: Archive, color: "text-amber-400", bg: "bg-amber-500/10", label: "Archived" },
  skip: { icon: SkipForward, color: "text-gray-400", bg: "bg-gray-500/10", label: "Skipped" },
  error: { icon: AlertCircle, color: "text-orange-400", bg: "bg-orange-500/10", label: "Error" },
};

function formatTime(ms) {
  return new Date(ms).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function ActivityEntry({ entry, onUndo }) {
  const cfg = ACTION_CONFIG[entry.action] || ACTION_CONFIG.skip;
  const Icon = cfg.icon;

  return (
    <div className="flex items-start gap-3 py-2.5 px-3 rounded-xl hover:bg-white/[0.03] transition-colors group">
      <div className={`w-7 h-7 rounded-lg ${cfg.bg} flex items-center justify-center shrink-0 mt-0.5`}>
        <Icon size={13} className={cfg.color} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-1.5 mb-0.5">
          <span className={`text-xs font-medium ${cfg.color}`}>{cfg.label}</span>
          {entry.labelApplied && <span className="text-xs text-gray-500">→ {entry.labelApplied}</span>}
          <span className="text-xs text-gray-600">·</span>
          <span className="text-xs text-gray-500 truncate">{entry.agentName}</span>
          {entry.undone && <span className="text-xs text-gray-600">(undone)</span>}
        </div>
        <p className="text-sm text-gray-300 truncate">{entry.emailSubject}</p>
        <p className="text-xs text-gray-600 truncate">{entry.emailFrom}</p>
        {entry.reason && <p className="text-xs text-gray-600 mt-1 italic truncate">{entry.reason}</p>}
      </div>
      {entry.undoable && !entry.undone && (
        <Button
          variant="ghost"
          size="icon"
          className="opacity-0 group-hover:opacity-100 shrink-0"
          onClick={() => onUndo?.(entry)}
          title="Undo"
        >
          <Undo2 size={13} />
        </Button>
      )}
      <span className="text-[11px] text-gray-600 shrink-0 mt-0.5">{formatTime(entry.timestamp)}</span>
    </div>
  );
}
