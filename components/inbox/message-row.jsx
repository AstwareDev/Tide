"use client";

import { Archive, Trash2, Tag } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
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

export function MessageRow({ thread, active, checked, onSelect, onToggleCheck, onArchive, onDelete, onLabel }) {
  return (
    <button
      onClick={onSelect}
      data-active={active || undefined}
      className={cn(
        "w-full text-left px-4 py-3.5 border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors group relative",
        active && "bg-white/[0.06] border-l-2 border-l-blue-500"
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
          className="mt-1.5 shrink-0"
        />
        <Avatar className="mt-0.5">
          <AvatarFallback>{initials(thread.from)}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-0.5">
            <span className={cn("text-[13px] truncate", thread.unread ? "font-semibold text-white" : "text-gray-300")}>
              {thread.from?.split("<")[0].trim() || thread.from}
            </span>
            <span className="text-[11px] text-gray-600 shrink-0 group-hover:hidden">{formatDate(thread.date)}</span>
            <div className="hidden group-hover:flex items-center gap-1 shrink-0">
              <Tooltip>
                <TooltipTrigger asChild>
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      onArchive?.();
                    }}
                    className="p-1 rounded hover:bg-white/10 text-gray-400 hover:text-amber-400 cursor-pointer"
                  >
                    <Archive size={13} />
                  </span>
                </TooltipTrigger>
                <TooltipContent>Archive (e)</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      onLabel?.();
                    }}
                    className="p-1 rounded hover:bg-white/10 text-gray-400 hover:text-blue-400 cursor-pointer"
                  >
                    <Tag size={13} />
                  </span>
                </TooltipTrigger>
                <TooltipContent>Label (l)</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete?.();
                    }}
                    className="p-1 rounded hover:bg-white/10 text-gray-400 hover:text-red-400 cursor-pointer"
                  >
                    <Trash2 size={13} />
                  </span>
                </TooltipTrigger>
                <TooltipContent>Delete (#)</TooltipContent>
              </Tooltip>
            </div>
          </div>

          <div className="text-[13px] text-gray-400 truncate mb-1.5">
            <span className={thread.unread ? "text-gray-200 font-medium" : ""}>{thread.subject}</span>
            {thread.snippet && <span className="text-gray-600"> — {thread.snippet}</span>}
          </div>

          <div className="flex items-center gap-1.5">
            {thread.unread && <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
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
}
