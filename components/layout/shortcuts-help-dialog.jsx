"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const SHORTCUTS = [
  { keys: "j / k", desc: "Navigate rows" },
  { keys: "Enter / o", desc: "Open in reading pane" },
  { keys: "e", desc: "Archive + advance" },
  { keys: "# / Backspace", desc: "Trash" },
  { keys: "l", desc: "Quick label" },
  { keys: "u", desc: "Toggle read/unread" },
  { keys: "x, Shift+j/k", desc: "Multi-select" },
  { keys: "z", desc: "Undo last action" },
  { keys: "⌘/Ctrl K", desc: "Command palette" },
  { keys: "/", desc: "Focus search" },
  { keys: "g then i/a/t/s", desc: "Go to Inbox/Agents/Activity/Settings" },
  { keys: "Esc", desc: "Close pane / deselect" },
];

export function ShortcutsHelpDialog({ open, onOpenChange }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Keyboard shortcuts</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-y-2 gap-x-6 text-sm">
          {SHORTCUTS.map((s) => (
            <div key={s.keys} className="flex items-center justify-between gap-3 col-span-2 sm:col-span-1">
              <span className="text-gray-400">{s.desc}</span>
              <kbd className="text-[11px] bg-white/10 border border-white/10 rounded px-1.5 py-0.5 text-gray-300 whitespace-nowrap">
                {s.keys}
              </kbd>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
