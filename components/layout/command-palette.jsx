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
  CommandSeparator,
} from "@/components/ui/command";

const NAV_ITEMS = [
  { href: "/inbox", icon: Inbox, label: "Go to Inbox" },
  { href: "/agents", icon: Bot, label: "Go to Agents" },
  { href: "/activity", icon: Activity, label: "Go to Activity" },
  { href: "/settings", icon: Settings, label: "Go to Settings" },
];

export function CommandPalette({ open, onOpenChange, onRunNow }) {
  const router = useRouter();

  const go = (href) => {
    router.push(href);
    onOpenChange(false);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Type a command or search…" />
      <CommandList className="p-1.5">
        <CommandEmpty className="py-10 text-center text-sm text-muted-foreground">
          No results found.
        </CommandEmpty>
        <CommandGroup heading="Navigate">
          {NAV_ITEMS.map(({ href, icon: Icon, label }) => (
            <CommandItem
              key={href}
              onSelect={() => go(href)}
              className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm aria-selected:bg-accent aria-selected:text-accent-foreground"
            >
              <Icon size={16} className="text-muted-foreground" />
              {label}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem
            onSelect={() => {
              onRunNow?.();
              onOpenChange(false);
            }}
            className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm aria-selected:bg-accent aria-selected:text-accent-foreground"
          >
            <RefreshCw size={16} className="text-muted-foreground" />
            Run agents now
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
