"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Inbox, Bot, Activity, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/inbox", icon: Inbox, label: "Inbox" },
  { href: "/agents", icon: Bot, label: "Agents" },
  { href: "/activity", icon: Activity, label: "Activity" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export function NavRail({ 
  user = { 
    name: "Wave Surfer", 
    email: "surfer@gmail.com", 
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Wave&backgroundColor=c0aede" 
  } 
}) {
  const pathname = usePathname();

  return (
    <aside className="flex w-[260px] shrink-0 flex-col border-r border-cyan-100/50 bg-white/40 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-blend-soft-light backdrop-blur-2xl dark:border-cyan-900/30 dark:bg-slate-950/40">
      <div className="mb-8 px-6 pt-6">
        <div className="flex items-center gap-3">
          {/* Logo is placed as-is without any clipping or rounding classes */}
          <img 
            src="/tide.png" 
            alt="Tide" 
            className="h-8 w-8 drop-shadow-[0_2px_10px_rgba(6,182,212,0.5)] transition-transform duration-500 hover:scale-110 hover:-rotate-3" 
          />
          <span className="bg-gradient-to-br from-cyan-500 to-blue-600 bg-clip-text text-xl font-bold tracking-tight text-transparent drop-shadow-sm">
            Tide
          </span>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-2 px-4">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = pathname?.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "group relative flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-all duration-300 ease-out",
                active
                  ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-[0_4px_20px_-4px_rgba(6,182,212,0.5)]"
                  : "text-slate-600 hover:bg-cyan-50 hover:text-cyan-700 dark:text-slate-400 dark:hover:bg-cyan-950/30 dark:hover:text-cyan-300"
              )}
            >
              <Icon 
                size={18} 
                strokeWidth={active ? 2.5 : 2} 
                className={cn(
                  "transition-transform duration-300 group-hover:scale-110",
                  active ? "text-white" : "text-cyan-500/70 group-hover:text-cyan-600 dark:group-hover:text-cyan-400"
                )} 
              />
              <span className={cn("font-medium tracking-wide", active && "font-semibold")}>
                {label}
              </span>
              
              {/* Subtle wave-like overlay for active state */}
              {active && (
                <div className="absolute inset-0 overflow-hidden rounded-2xl">
                  <div className="absolute -left-full top-0 h-full w-[200%] animate-[wave_3s_linear_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50" />
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Account Card Profile at the Bottom */}
      <div className="mt-auto p-4 pb-6">
        <div className="relative overflow-hidden rounded-3xl border border-cyan-200/50 bg-gradient-to-b from-white/80 to-cyan-50/80 p-1 shadow-[0_8px_30px_-6px_rgba(6,182,212,0.15)] backdrop-blur-md dark:border-cyan-800/40 dark:from-slate-900/80 dark:to-cyan-950/80">
          {/* Decorative background wave */}
          <div className="absolute -top-12 right-0 h-32 w-32 rounded-full bg-cyan-400/10 blur-2xl" />
          <div className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-blue-500/10 blur-xl" />
          
          <div className="relative z-10 flex flex-col gap-3 p-3">
            <div className="flex items-center gap-3">
              <img 
                src={user.image} 
                alt={user.name} 
                className="h-10 w-10 shrink-0 rounded-full border-2 border-white object-cover shadow-sm dark:border-slate-800" 
              />
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-[14px] font-bold text-slate-800 dark:text-slate-200">
                  {user.name}
                </span>
                <span className="truncate text-[12px] font-medium text-cyan-600 dark:text-cyan-400">
                  {user.email}
                </span>
              </div>
            </div>

            <button className="group flex w-full items-center justify-center gap-2 rounded-xl bg-white/60 py-2.5 text-xs font-semibold text-slate-600 transition-all hover:bg-red-50 hover:text-red-600 hover:shadow-sm dark:bg-slate-950/40 dark:text-slate-300 dark:hover:bg-red-950/40 dark:hover:text-red-400">
              <LogOut size={14} className="transition-transform group-hover:-translate-x-0.5" />
              Log out
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}