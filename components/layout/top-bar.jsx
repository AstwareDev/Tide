"use client";

import { usePathname } from "next/navigation";
import { Play, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border/40 bg-background/70 px-8 backdrop-blur-xl transition-all">
      <div className="flex items-center gap-4">
        <h1 className="text-[17px] font-semibold tracking-tight text-foreground">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="group flex cursor-default items-center gap-2.5 rounded-full border border-border/50 bg-secondary/40 px-3.5 py-1.5 backdrop-blur-md transition-all duration-300 hover:bg-secondary/60 hover:shadow-sm">
          <div className="relative flex h-2 w-2 items-center justify-center">
            <div className="absolute h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
            <div className="relative h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          </div>
          <span className="max-w-[180px] truncate text-xs font-medium text-muted-foreground transition-colors group-hover:text-foreground">
            {email}
          </span>
        </div>

        <Button 
          size="sm" 
          onClick={onRunNow} 
          disabled={running}
          className={cn(
            "group relative h-8 overflow-hidden rounded-full pl-3 pr-4 transition-all duration-300 active:scale-95",
            running 
              ? "bg-secondary text-muted-foreground" 
              : "bg-foreground text-background shadow-md hover:shadow-lg hover:shadow-foreground/10"
          )}
        >
          <span className="relative z-10 flex items-center gap-2 text-xs font-semibold tracking-wide">
            {running ? (
              <Loader2 size={13} className="animate-spin opacity-70" />
            ) : (
              <Play size={11} fill="currentColor" className="transition-transform duration-300 ease-out group-hover:scale-110" />
            )}
            {running ? "Running…" : "Run Now"}
          </span>
          {!running && (
            <div className="absolute inset-0 -z-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          )}
        </Button>
      </div>
    </header>
  );
}