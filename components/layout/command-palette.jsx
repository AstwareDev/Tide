"use client";

import { useRouter } from "next/navigation";
import { Inbox, Bot, Activity, Settings, RefreshCw } from "lucide-react";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";

export function CommandPalette({ open, onOpenChange, onRunNow }) {
  const router = useRouter();

  const go = (href) => {
    router.push(href);
    onOpenChange(false);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput 
        placeholder="Type a command or search…" 
        className="text-[15px] placeholder:text-muted-foreground/60 focus:ring-0"
      />
      <CommandList className="p-2">
        <CommandEmpty className="py-12 text-center text-sm text-muted-foreground">
          No results found.
        </CommandEmpty>
        <CommandGroup heading="Navigate" className="px-1 text-xs font-medium text-muted-foreground/70">
          <CommandItem 
            onSelect={() => go("/inbox")}
            className="group flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200 ease-out aria-selected:bg-accent/50 aria-selected:text-accent-foreground"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-background shadow-sm ring-1 ring-border/50 transition-transform group-hover:scale-105 group-active:scale-95">
              <Inbox size={14} className="text-foreground/70" />
            </div>
            <span className="font-medium tracking-tight">Go to Inbox</span>
          </CommandItem>
          <CommandItem 
            onSelect={() => go("/agents")}
            className="group flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200 ease-out aria-selected:bg-accent/50 aria-selected:text-accent-foreground"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-background shadow-sm ring-1 ring-border/50 transition-transform group-hover:scale-105 group-active:scale-95">
              <Bot size={14} className="text-foreground/70" />
            </div>
            <span className="font-medium tracking-tight">Go to Agents</span>
          </CommandItem>
          <CommandItem 
            onSelect={() => go("/activity")}
            className="group flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200 ease-out aria-selected:bg-accent/50 aria-selected:text-accent-foreground"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-background shadow-sm ring-1 ring-border/50 transition-transform group-hover:scale-105 group-active:scale-95">
              <Activity size={14} className="text-foreground/70" />
            </div>
            <span className="font-medium tracking-tight">Go to Activity</span>
          </CommandItem>
          <CommandItem 
            onSelect={() => go("/settings")}
            className="group flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200 ease-out aria-selected:bg-accent/50 aria-selected:text-accent-foreground"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-background shadow-sm ring-1 ring-border/50 transition-transform group-hover:scale-105 group-active:scale-95">
              <Settings size={14} className="text-foreground/70" />
            </div>
            <span className="font-medium tracking-tight">Go to Settings</span>
          </CommandItem>
        </CommandGroup>
        <div className="my-1 h-px w-full bg-border/40" />
        <CommandGroup heading="Actions" className="px-1 text-xs font-medium text-muted-foreground/70">
          <CommandItem
            onSelect={() => {
              onRunNow?.();
              onOpenChange(false);
            }}
            className="group flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200 ease-out aria-selected:bg-primary/10 aria-selected:text-primary"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary shadow-sm transition-transform group-hover:scale-105 group-active:scale-95">
              <RefreshCw size={14} />
            </div>
            <span className="font-medium tracking-tight text-primary">Run agents now</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}