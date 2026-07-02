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

export function TopBar({ running, onRunNow }) {
  const pathname = usePathname();
  const title = Object.entries(TITLES).find(([prefix]) => pathname?.startsWith(prefix))?.[1] || "Tide";

  return (
    <header className="flex h-20 shrink-0 items-center justify-between border-b border-cyan-100/30 bg-background/60 px-8 backdrop-blur-xl dark:border-cyan-900/30">
      <h1 className="bg-gradient-to-r from-slate-800 to-slate-500 bg-clip-text text-xl font-extrabold tracking-tight text-transparent dark:from-slate-100 dark:to-slate-400">
        {title}
      </h1>

      <div className="flex items-center gap-4">
        <Button 
          onClick={onRunNow} 
          disabled={running}
          className={cn(
            "group relative h-10 overflow-hidden rounded-full pl-5 pr-6 transition-all duration-300 active:scale-95",
            running 
              ? "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500" 
              : "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-[0_0_20px_-4px_rgba(6,182,212,0.6)] hover:from-cyan-400 hover:to-blue-400 hover:shadow-[0_0_25px_-2px_rgba(59,130,246,0.7)]"
          )}
        >
          <span className="relative z-10 flex items-center gap-2.5 text-sm font-bold tracking-wide">
            {running ? (
              <Loader2 size={16} className="animate-spin opacity-70" />
            ) : (
              <Play size={14} fill="currentColor" className="transition-transform duration-300 ease-out group-hover:scale-125" />
            )}
            {running ? "Riding the wave…" : "Run Now"}
          </span>
          
          {/* Shine effect inside the bright wave button */}
          {!running && (
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
          )}
        </Button>
      </div>
    </header>
  );
}