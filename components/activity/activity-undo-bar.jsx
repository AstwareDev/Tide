import { Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ActivityUndoBar({ entry, onUndo }) {
  if (!entry) return null;
  return (
    <div className="flex items-center justify-between gap-3 mb-4 px-3 py-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20">
      <p className="text-xs text-blue-300 truncate">
        Undo last: {entry.action === "delete" ? "Deleted" : entry.action === "archive" ? "Archived" : "Labeled"} “
        {entry.emailSubject}” · {entry.agentName}
      </p>
      <Button size="sm" variant="secondary" onClick={() => onUndo(entry)}>
        <Undo2 size={12} />
        Undo
      </Button>
    </div>
  );
}
