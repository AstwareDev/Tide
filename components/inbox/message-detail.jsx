"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Archive, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AgentDecisionCard } from "@/components/inbox/agent-decision-card";
import { api } from "@/lib/api-client";

function formatDate(ms) {
  if (!ms) return "";
  return new Date(ms).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export function MessageDetail({ threadId }) {
  const router = useRouter();
  const [thread, setThread] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    api.gmail
      .thread(threadId)
      .then((data) => active && setThread(data))
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [threadId]);

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
      <div className="flex-1 flex items-center justify-center text-sm text-red-400">{error}</div>
    );
  }

  const lastMessage = thread?.messages?.[thread.messages.length - 1];

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="p-6 border-b border-white/5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-white font-semibold text-base mb-1">{thread?.subject}</h2>
          <p className="text-gray-400 text-sm">{lastMessage?.from}</p>
          <p className="text-gray-600 text-xs mt-1">{formatDate(lastMessage?.date)}</p>
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
          {thread?.messages?.map((message) => (
            <div key={message.id} className="border-b border-white/5 pb-6 last:border-0">
              <p className="text-gray-500 text-xs mb-2">{message.from} · {formatDate(message.date)}</p>
              <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{message.body || message.snippet}</p>
            </div>
          ))}

          <AgentDecisionCard classification={lastMessage?.classification} />
        </div>
      </ScrollArea>
    </div>
  );
}
