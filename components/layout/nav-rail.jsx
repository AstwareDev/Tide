"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Inbox, Bot, Activity, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/inbox", icon: Inbox, label: "Inbox" },
  { href: "/agents", icon: Bot, label: "Agents" },
  { href: "/activity", icon: Activity, label: "Activity" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export function NavRail() {
  const pathname = usePathname();

  return (
    <aside className="flex w-[260px] shrink-0 flex-col border-r border-border/40 bg-background/50 py-6 backdrop-blur-2xl">
      <div className="mb-8 px-6">
        <div className="group flex cursor-pointer items-center gap-3 transition-opacity hover:opacity-80">
          <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-background to-secondary shadow-[0_2px_10px_-3px_rgba(0,0,0,0.1)] ring-1 ring-border/60 transition-transform duration-300 ease-out group-hover:scale-105">
            <img src="/tide.png" alt="Tide" className="h-full w-full object-cover" />
          </div>
          <span className="text-[17px] font-semibold tracking-tight text-foreground">
            Tide
          </span>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1.5 px-3">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = pathname?.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "group relative flex items-center gap-3 overflow-hidden rounded-xl px-4 py-3 text-sm transition-all duration-300 ease-out active:scale-[0.98]",
                active
                  ? "bg-foreground text-background shadow-md"
                  : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
              )}
            >
              <Icon 
                size={18} 
                strokeWidth={active ? 2 : 1.75} 
                className={cn(
                  "transition-transform duration-300 ease-out group-hover:scale-110",
                  active ? "text-background" : "text-muted-foreground group-hover:text-foreground"
                )} 
              />
              <span className={cn("font-medium tracking-wide", active ? "font-semibold" : "")}>
                {label}
              </span>
              {active && (
                <div className="absolute inset-0 -z-10 bg-gradient-to-r from-transparent to-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-4 px-6 pb-2">
        <div className="inline-flex items-center rounded-full border border-border/50 bg-secondary/30 px-2.5 py-1 backdrop-blur-sm transition-colors hover:bg-secondary/50">
          <span className="text-[11px] font-medium tracking-wider text-muted-foreground/70">
            v0.1.0
          </span>
        </div>
      </div>
    </aside>
  );
}