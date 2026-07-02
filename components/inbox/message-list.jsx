"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search, Mail, MailOpen, Archive, Trash2, Tag, Plus } from "lucide-react";
import { toast } from "sonner";
import { MessageRow } from "@/components/inbox/message-row";
import { EmptyInbox } from "@/components/inbox/empty-states";
import { LabelPopover } from "@/components/inbox/label-popover";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
} from "@/components/ui/context-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { useUndoStack } from "@/hooks/use-undo-stack";
import { api } from "@/lib/api-client";
import { cn } from "@/lib/utils";

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
  const [removingIds, setRemovingIds] = useState(new Set());
  const [labels, setLabels] = useState([]);
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

  useEffect(() => {
    api.gmail
      .labels()
      .then((data) => setLabels(data.labels || []))
      .catch(() => {});
  }, []);

  const userLabels = useMemo(() => labels.filter((l) => l.type === "user"), [labels]);

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
      if (action === "markRead" || action === "markUnread") {
        try {
          await api.gmail.action({ messageId: thread.id, action });
          setThreads((prev) =>
            prev.map((t) => (t.id === thread.id ? { ...t, unread: action === "markUnread" } : t))
          );
        } catch (err) {
          toast.error(err.message);
        }
        return;
      }

      try {
        await api.gmail.action({ messageId: thread.id, action, labelName });
        setRemovingIds((prev) => new Set(prev).add(thread.id));
        setTimeout(() => {
          removeThreadLocally(thread.id);
          setRemovingIds((prev) => {
            const next = new Set(prev);
            next.delete(thread.id);
            return next;
          });
        }, 180);
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
                <Skeleton className="h-9 w-9 rounded-full" />
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
          <div className="p-2">
            {filtered.map((thread, i) => {
              const removing = removingIds.has(thread.id);
              return (
                <LabelPopover
                  key={thread.id}
                  open={labelPopoverFor === thread.id}
                  onOpenChange={(o) => setLabelPopoverFor(o ? thread.id : null)}
                  onApply={(labelName) => {
                    performAction(thread, "label", labelName);
                    setLabelPopoverFor(null);
                  }}
                >
                  <div
                    className={cn(
                      removing
                        ? "animate-out fade-out slide-out-to-left-4 fill-mode-forwards pointer-events-none"
                        : "animate-in fade-in slide-in-from-top-1 fill-mode-both"
                    )}
                    style={{ animationDelay: removing ? "0ms" : `${Math.min(i, 12) * 25}ms`, animationDuration: "200ms" }}
                  >
                    <ContextMenu>
                      <ContextMenuTrigger asChild>
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
                        />
                      </ContextMenuTrigger>
                      <ContextMenuContent>
                        <ContextMenuItem
                          onClick={() => {
                            setActiveIndex(i);
                            openThread(thread.id);
                          }}
                        >
                          <Mail size={14} /> Open
                        </ContextMenuItem>
                        <ContextMenuItem
                          onClick={() => performAction(thread, thread.unread ? "markRead" : "markUnread")}
                        >
                          {thread.unread ? <MailOpen size={14} /> : <Mail size={14} />}
                          Mark as {thread.unread ? "read" : "unread"}
                        </ContextMenuItem>
                        <ContextMenuItem onClick={() => performAction(thread, "archive")}>
                          <Archive size={14} /> Archive
                        </ContextMenuItem>
                        <ContextMenuSeparator />
                        <ContextMenuSub>
                          <ContextMenuSubTrigger>
                            <Tag size={14} /> Label
                          </ContextMenuSubTrigger>
                          <ContextMenuSubContent>
                            {userLabels.length === 0 && (
                              <div className="px-2 py-1.5 text-xs text-muted-foreground">No labels yet</div>
                            )}
                            {userLabels.map((label) => (
                              <ContextMenuItem key={label.id} onClick={() => performAction(thread, "label", label.name)}>
                                {label.name}
                              </ContextMenuItem>
                            ))}
                            {userLabels.length > 0 && <ContextMenuSeparator />}
                            <ContextMenuItem onClick={() => setLabelPopoverFor(thread.id)}>
                              <Plus size={14} /> New label…
                            </ContextMenuItem>
                          </ContextMenuSubContent>
                        </ContextMenuSub>
                        <ContextMenuSeparator />
                        <ContextMenuItem destructive onClick={() => performAction(thread, "delete")}>
                          <Trash2 size={14} /> Delete
                        </ContextMenuItem>
                      </ContextMenuContent>
                    </ContextMenu>
                  </div>
                </LabelPopover>
              );
            })}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
