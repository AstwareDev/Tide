"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { MessageRow } from "@/components/inbox/message-row";
import { EmptyInbox } from "@/components/inbox/empty-states";
import { LabelPopover } from "@/components/inbox/label-popover";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { useUndoStack } from "@/hooks/use-undo-stack";
import { api } from "@/lib/api-client";

export function MessageList() {
  const router = useRouter();
  const pathname = usePathname();
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [checked, setChecked] = useState(new Set());
  const [labelPopoverFor, setLabelPopoverFor] = useState(null);
  const { pushUndoable } = useUndoStack();

  const activeThreadId = pathname?.match(/^\/inbox\/([^/]+)/)?.[1] || null;

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.gmail.threads({ maxResults: 50 });
      setThreads(data.threads || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(
    () =>
      threads.filter(
        (t) =>
          !query ||
          t.subject?.toLowerCase().includes(query.toLowerCase()) ||
          t.from?.toLowerCase().includes(query.toLowerCase())
      ),
    [threads, query]
  );

  useEffect(() => {
    if (activeThreadId) {
      const idx = filtered.findIndex((t) => t.id === activeThreadId);
      if (idx >= 0) setActiveIndex(idx);
    }
  }, [activeThreadId, filtered]);

  const removeThreadLocally = useCallback((id) => {
    setThreads((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const performAction = useCallback(
    async (thread, action, labelName) => {
      try {
        await api.gmail.action({ messageId: thread.id, action, labelName });
        removeThreadLocally(thread.id);
        if (activeThreadId === thread.id) router.push("/inbox");
        pushUndoable(
          { id: null },
          action === "archive" ? "Archived" : action === "delete" ? "Moved to trash" : `Labeled ${labelName}`
        );
      } catch (err) {
        toast.error(err.message);
      }
    },
    [removeThreadLocally, activeThreadId, router, pushUndoable]
  );

  const openThread = useCallback(
    (id) => {
      router.push(activeThreadId === id ? "/inbox" : `/inbox/${id}`);
    },
    [activeThreadId, router]
  );

  useKeyboardShortcuts(
    {
      j: () => setActiveIndex((i) => Math.min(filtered.length - 1, i + 1)),
      k: () => setActiveIndex((i) => Math.max(0, i - 1)),
      ArrowDown: () => setActiveIndex((i) => Math.min(filtered.length - 1, i + 1)),
      ArrowUp: () => setActiveIndex((i) => Math.max(0, i - 1)),
      Enter: () => filtered[activeIndex] && openThread(filtered[activeIndex].id),
      o: () => filtered[activeIndex] && openThread(filtered[activeIndex].id),
      e: () => filtered[activeIndex] && performAction(filtered[activeIndex], "archive"),
      "#": () => filtered[activeIndex] && performAction(filtered[activeIndex], "delete"),
      Backspace: () => filtered[activeIndex] && performAction(filtered[activeIndex], "delete"),
      l: () => filtered[activeIndex] && setLabelPopoverFor(filtered[activeIndex].id),
      x: () =>
        filtered[activeIndex] &&
        setChecked((prev) => {
          const next = new Set(prev);
          const id = filtered[activeIndex].id;
          next.has(id) ? next.delete(id) : next.add(id);
          return next;
        }),
      "/": (e) => {
        e.preventDefault();
        document.getElementById("inbox-search")?.focus();
      },
      Escape: () => router.push("/inbox"),
    },
    { allowInInputs: ["Escape"] }
  );

  return (
    <div className="flex flex-col h-full border-r border-border">
      <div className="p-3 border-b border-border">
        <div className="flex items-center gap-2 bg-accent rounded-lg px-3 py-2">
          <Search size={14} className="text-muted-foreground shrink-0" />
          <input
            id="inbox-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search emails…"
            className="bg-transparent text-sm text-foreground placeholder-muted-foreground outline-none flex-1"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        {loading ? (
          <div className="p-4 space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3">
                <Skeleton className="h-7 w-7 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3 w-1/3" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-4 text-sm text-red-400">{error}</div>
        ) : filtered.length === 0 ? (
          <EmptyInbox hasQuery={!!query} />
        ) : (
          filtered.map((thread, i) => (
            <LabelPopover
              key={thread.id}
              open={labelPopoverFor === thread.id}
              onOpenChange={(o) => setLabelPopoverFor(o ? thread.id : null)}
              onApply={(labelName) => {
                performAction(thread, "label", labelName);
                setLabelPopoverFor(null);
              }}
            >
              <div>
                <MessageRow
                  thread={thread}
                  active={activeThreadId === thread.id || (i === activeIndex && !activeThreadId)}
                  checked={checked.has(thread.id)}
                  onSelect={() => {
                    setActiveIndex(i);
                    openThread(thread.id);
                  }}
                  onToggleCheck={() =>
                    setChecked((prev) => {
                      const next = new Set(prev);
                      next.has(thread.id) ? next.delete(thread.id) : next.add(thread.id);
                      return next;
                    })
                  }
                  onArchive={() => performAction(thread, "archive")}
                  onDelete={() => performAction(thread, "delete")}
                  onLabel={() => setLabelPopoverFor(thread.id)}
                />
              </div>
            </LabelPopover>
          ))
        )}
      </ScrollArea>
    </div>
  );
}
