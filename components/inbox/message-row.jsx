"use client";

import { forwardRef } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { gravatarUrl, avatarColor } from "@/lib/gravatar";
import { cn } from "@/lib/utils";

const ACTION_BADGE_VARIANT = {
  label: "default",
  delete: "destructive",
  archive: "amber",
  skip: "secondary",
};

function formatDate(ms) {
  if (!ms) return "";
  const diff = Date.now() - ms;
  if (diff < 3600000) return `${Math.max(1, Math.floor(diff / 60000))}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
}

function initials(from) {
  const name = (from || "").split("<")[0].trim();
  const parts = name.split(" ").filter(Boolean);
  if (!parts.length) return "?";
  return (parts[0][0] + (parts[1]?.[0] || "")).toUpperCase();
}

export const MessageRow = forwardRef(function MessageRow(
  { thread, active, checked, onSelect, onToggleCheck },
  ref
) {
  const senderName = thread.from?.split("<")[0].trim() || thread.from || "Unknown";

  return (
    <button
      ref={ref}
      onClick={onSelect}
      data-active={active || undefined}
      className={cn(
        "w-full text-left px-3.5 py-3 rounded-xl border border-transparent bg-card transition-all duration-150 group relative",
        "hover:border-border hover:shadow-sm hover:-translate-y-px",
        active && "border-primary/30 bg-secondary shadow-sm"
      )}
    >
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => {
            e.stopPropagation();
            onToggleCheck?.();
          }}
          onClick={(e) => e.stopPropagation()}
          className="mt-2 shrink-0 accent-primary"
        />
        <Avatar className="mt-0.5 h-9 w-9 ring-1 ring-border">
          <AvatarImage src={gravatarUrl(thread.from) || undefined} alt="" />
          <AvatarFallback style={{ backgroundColor: avatarColor(senderName), color: "#fff" }}>
            {initials(thread.from)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <span
              className={cn(
                "text-[13px] truncate",
                thread.unread ? "font-semibold text-foreground" : "text-muted-foreground"
              )}
            >
              {senderName}
            </span>
            <span className="text-[11px] text-muted-foreground shrink-0">{formatDate(thread.date)}</span>
          </div>

          <div className="text-[13px] text-muted-foreground truncate mb-1.5">
            <span className={thread.unread ? "text-foreground font-medium" : ""}>{thread.subject}</span>
            {thread.snippet && <span className="text-muted-foreground"> — {thread.snippet}</span>}
          </div>

          <div className="flex items-center gap-1.5">
            {thread.unread && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
            {(thread.labelNames || []).slice(0, 2).map((label) => (
              <Badge key={label} variant="default">
                {label}
              </Badge>
            ))}
            {thread.classification && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <Badge variant={ACTION_BADGE_VARIANT[thread.classification.action] || "secondary"}>
                      Auto-{thread.classification.action} · {thread.classification.agentName}
                    </Badge>
                  </span>
                </TooltipTrigger>
                <TooltipContent>{thread.classification.reason}</TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
      </div>
    </button>
  );
});
