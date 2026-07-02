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
        className="text-[15px] focus:ring-0"
      />
      <CommandList className="p-2">
        <CommandEmpty className="py-10 text-center text-sm text-muted-foreground">
          No ripples found in the tide.
        </CommandEmpty>
        <CommandGroup heading="Navigate" className="px-1 text-xs font-medium text-cyan-600/70 dark:text-cyan-400/70">
          <CommandItem 
            onSelect={() => go("/inbox")}
            className="group flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-300 aria-selected:bg-gradient-to-r aria-selected:from-cyan-50 aria-selected:to-blue-50 dark:aria-selected:from-cyan-950/30 dark:aria-selected:to-blue-900/30 aria-selected:text-cyan-700 dark:aria-selected:text-cyan-300"
          >
            <Inbox size={16} className="text-cyan-500 transition-transform group-hover:scale-110" />
            <span className="font-medium">Go to Inbox</span>
          </CommandItem>
          <CommandItem 
            onSelect={() => go("/agents")}
            className="group flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-300 aria-selected:bg-gradient-to-r aria-selected:from-cyan-50 aria-selected:to-blue-50 dark:aria-selected:from-cyan-950/30 dark:aria-selected:to-blue-900/30 aria-selected:text-cyan-700 dark:aria-selected:text-cyan-300"
          >
            <Bot size={16} className="text-cyan-500 transition-transform group-hover:scale-110" />
            <span className="font-medium">Go to Agents</span>
          </CommandItem>
          <CommandItem 
            onSelect={() => go("/activity")}
            className="group flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-300 aria-selected:bg-gradient-to-r aria-selected:from-cyan-50 aria-selected:to-blue-50 dark:aria-selected:from-cyan-950/30 dark:aria-selected:to-blue-900/30 aria-selected:text-cyan-700 dark:aria-selected:text-cyan-300"
          >
            <Activity size={16} className="text-cyan-500 transition-transform group-hover:scale-110" />
            <span className="font-medium">Go to Activity</span>
          </CommandItem>
          <CommandItem 
            onSelect={() => go("/settings")}
            className="group flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-300 aria-selected:bg-gradient-to-r aria-selected:from-cyan-50 aria-selected:to-blue-50 dark:aria-selected:from-cyan-950/30 dark:aria-selected:to-blue-900/30 aria-selected:text-cyan-700 dark:aria-selected:text-cyan-300"
          >
            <Settings size={16} className="text-cyan-500 transition-transform group-hover:scale-110" />
            <span className="font-medium">Go to Settings</span>
          </CommandItem>
        </CommandGroup>
        <div className="my-1 h-px w-full bg-gradient-to-r from-transparent via-cyan-200 to-transparent dark:via-cyan-800" />
        <CommandGroup heading="Actions" className="px-1 text-xs font-medium text-cyan-600/70 dark:text-cyan-400/70">
          <CommandItem
            onSelect={() => {
              onRunNow?.();
              onOpenChange(false);
            }}
            className="group flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-300 aria-selected:bg-gradient-to-r aria-selected:from-cyan-500 aria-selected:to-blue-500 aria-selected:text-white"
          >
            <RefreshCw size={16} className="transition-transform group-hover:rotate-180" />
            <span className="font-semibold tracking-wide">Run agents now</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}