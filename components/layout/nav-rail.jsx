"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Inbox, Bot, Activity, Settings, LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api-client";

const NAV = [
  { href: "/inbox", icon: Inbox, label: "Inbox" },
  { href: "/agents", icon: Bot, label: "Agents" },
  { href: "/activity", icon: Activity, label: "Activity" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export function NavRail({ email }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await api.auth.logout();
    } finally {
      router.push("/login");
    }
  };

  return (
    <aside className="flex w-[232px] shrink-0 flex-col border-r border-border bg-muted/50">
      <div className="px-5 pb-6 pt-5">
        <Link href="/inbox" className="flex items-center gap-2.5">
          {/* Logo is placed as-is without any clipping or rounding classes */}
          <img src="/tide.png" alt="Tide" className="h-8 w-8" />
          <span className="text-lg font-bold tracking-tight text-foreground">Tide</span>
        </Link>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = pathname?.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-primary text-primary-foreground font-medium shadow-sm"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <Icon
                size={16}
                strokeWidth={active ? 2.25 : 2}
                className={cn(!active && "text-muted-foreground group-hover:text-foreground")}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-3">
        <div className="flex items-center gap-2.5 rounded-lg px-2 py-1.5">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-secondary text-xs font-semibold text-primary">
              {email ? email[0].toUpperCase() : "…"}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-foreground">{email || "Connecting…"}</p>
            <p className="text-[11px] text-muted-foreground">Gmail connected</p>
          </div>
          <button
            onClick={handleLogout}
            title="Log out"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-destructive"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
}
