"use client";

import { usePathname } from "next/navigation";
import { Play, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const TITLES = {
  "/inbox": "Inbox",
  "/agents": "Agents",
  "/activity": "Activity",
  "/settings": "Settings",
};

export function TopBar({ email, running, onRunNow }) {
  const pathname = usePathname();
  const title = Object.entries(TITLES).find(([prefix]) => pathname?.startsWith(prefix))?.[1] || "Tide";

  return (
    <header className="h-14 shrink-0 flex items-center justify-between px-6 border-b border-white/5 bg-[#0f1117]">
      <h1 className="text-white font-semibold text-base">{title}</h1>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-xs text-gray-300 max-w-[160px] truncate">{email}</span>
        </div>

        <Button size="sm" className="rounded-full" onClick={onRunNow} disabled={running}>
          {running ? <Loader2 size={12} className="animate-spin" /> : <Play size={12} fill="currentColor" />}
          {running ? "Running…" : "Run Now"}
        </Button>
      </div>
    </header>
  );
}
