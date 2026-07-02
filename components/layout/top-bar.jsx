"use client";

import { usePathname } from "next/navigation";
import { Play, Loader2, Command } from "lucide-react";
import { Button } from "@/components/ui/button";

const PAGES = {
  "/inbox": { title: "Inbox", subtitle: "Your Gmail, triaged" },
  "/agents": { title: "Agents", subtitle: "Rules that run on autopilot" },
  "/activity": { title: "Activity", subtitle: "Everything your agents did" },
  "/settings": { title: "Settings", subtitle: "Provider, cadence, account" },
};

export function TopBar({ running, onRunNow }) {
  const pathname = usePathname();
  const page = Object.entries(PAGES).find(([prefix]) => pathname?.startsWith(prefix))?.[1] || { title: "Tide" };

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-background px-6">
      <div className="flex items-baseline gap-3 min-w-0">
        <h1 className="text-[15px] font-semibold tracking-tight text-foreground">{page.title}</h1>
        {page.subtitle && (
          <span className="hidden truncate text-xs text-muted-foreground sm:inline">{page.subtitle}</span>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-1.5 rounded-md border border-border bg-muted px-2 py-1 text-[11px] text-muted-foreground md:flex">
          <Command size={11} />
          <span>K to search</span>
        </div>
        <Button onClick={onRunNow} disabled={running} size="sm" className="gap-2">
          {running ? <Loader2 size={14} className="animate-spin" /> : <Play size={13} fill="currentColor" />}
          {running ? "Running…" : "Run now"}
        </Button>
      </div>
    </header>
  );
}
