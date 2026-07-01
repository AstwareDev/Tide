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
    <aside className="w-[220px] shrink-0 flex flex-col bg-background border-r border-border py-4">
      <div className="px-5 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg overflow-hidden flex items-center justify-center">
            <img src="/tide.png" alt="Tide" className="w-full h-full object-cover" />
          </div>
          <span className="text-foreground font-semibold text-[15px] tracking-tight">Tide</span>
        </div>
      </div>

      <nav className="flex-1 flex flex-col gap-0.5 px-2">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = pathname?.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                active ? "bg-primary text-primary-foreground font-medium" : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <Icon size={16} strokeWidth={1.75} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-5 mt-4">
        <div className="text-[11px] text-muted-foreground">v0.1.0</div>
      </div>
    </aside>
  );
}
