"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";

async function undoEntry(entryId) {
  const res = await fetch("/api/activity/undo", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ entryId }),
  });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "Undo failed");
  return res.json();
}

export function useUndoStack() {
  const [lastEntry, setLastEntry] = useState(null);

  const pushUndoable = useCallback((entry, successMessage) => {
    setLastEntry(entry);
    toast.success(successMessage, {
      action: entry?.id
        ? {
            label: "Undo",
            onClick: async () => {
              try {
                await undoEntry(entry.id);
                toast.success("Undone");
              } catch (err) {
                toast.error(err.message);
              }
            },
          }
        : undefined,
    });
  }, []);

  const undoLast = useCallback(async () => {
    if (!lastEntry?.id) return;
    await undoEntry(lastEntry.id);
    setLastEntry(null);
  }, [lastEntry]);

  return { lastEntry, pushUndoable, undoLast };
}
