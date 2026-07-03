"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Archive, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AgentDecisionCard } from "@/components/inbox/agent-decision-card";
import { MessageBody } from "@/components/inbox/message-body";
import { SenderAvatar } from "@/components/inbox/sender-avatar";
import { api } from "@/lib/api-client";
import { getThread } from "@/lib/thread-cache";
import { extractEmail } from "@/lib/gravatar";

function formatDate(ms) {
  if (!ms) return "";
  return new Date(ms).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export function MessageDetail({ threadId }) {
  const router = useRouter();
  const [thread, setThread] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);

  useEffect(() => {
    let active = true;
    setThread(null);
    setAvatarUrl(null);
    setLoading(true);
    setError(null);
    // Reads from the shared thread cache — if this thread was already
    // prefetched on hover in the list, this resolves immediately.
    getThread(threadId)
      .then((data) => active && setThread(data))
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [threadId]);

  useEffect(() => {
    const lastMessage = thread?.messages?.[thread.messages.length - 1];
    const email = extractEmail(lastMessage?.from);
    if (!email) return;
    let active = true;
    api.gmail
      .avatars([email])
      .then((data) => active && setAvatarUrl(data.avatars?.[email] || null))
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [thread]);

  const act = async (action) => {
    const messageId = thread?.messages?.[thread.messages.length - 1]?.id;
    if (!messageId) return;
    try {
      await api.gmail.action({ messageId, action });
      toast.success(action === "archive" ? "Archived" : "Moved to trash");
      router.push("/inbox");
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col p-6 gap-4">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-3 w-full mt-4" />
        <Skeleton className="h-3 w-5/6" />
        <Skeleton className="h-3 w-3/4" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center text-sm text-destructive">{error}</div>
    );
  }

  const lastMessage = thread?.messages?.[thread.messages.length - 1];

  return (
    <div key={threadId} className="flex-1 flex flex-col overflow-hidden h-full">
      <div className="p-6 border-b border-border flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0">
          <SenderAvatar
            avatarUrl={avatarUrl}
            from={lastMessage?.from}
            senderName={lastMessage?.from}
            className="mt-0.5 h-10 w-10 shrink-0"
          />
          <div className="min-w-0">
            <h2 className="text-foreground font-semibold text-base mb-1">{thread?.subject}</h2>
            <p className="text-muted-foreground text-sm truncate">{lastMessage?.from}</p>
            <p className="text-muted-foreground text-xs mt-1">{formatDate(lastMessage?.date)}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Button variant="ghost" size="icon" onClick={() => act("archive")} title="Archive (e)">
            <Archive size={15} />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => act("delete")} title="Delete (#)">
            <Trash2 size={15} />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => router.push("/inbox")} title="Close (Esc)">
            <X size={15} />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          {thread?.messages?.map((message, i) => (
            <div
              key={message.id}
              className="border-b border-border pb-6 last:border-0 animate-in fade-in slide-in-from-top-1 fill-mode-both"
              style={{ animationDelay: `${Math.min(i, 8) * 40}ms`, animationDuration: "220ms" }}
            >
              <p className="text-muted-foreground text-xs mb-2">{message.from} · {formatDate(message.date)}</p>
              <MessageBody body={message.body || message.snippet} bodyType={message.bodyType} />
            </div>
          ))}

          <AgentDecisionCard classification={lastMessage?.classification} />
        </div>
      </ScrollArea>
    </div>
  );
}
