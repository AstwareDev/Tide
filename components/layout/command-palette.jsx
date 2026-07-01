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
      <CommandInput placeholder="Type a command or search…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigate">
          <CommandItem onSelect={() => go("/inbox")}>
            <Inbox size={14} /> Go to Inbox
          </CommandItem>
          <CommandItem onSelect={() => go("/agents")}>
            <Bot size={14} /> Go to Agents
          </CommandItem>
          <CommandItem onSelect={() => go("/activity")}>
            <Activity size={14} /> Go to Activity
          </CommandItem>
          <CommandItem onSelect={() => go("/settings")}>
            <Settings size={14} /> Go to Settings
          </CommandItem>
        </CommandGroup>
        <CommandGroup heading="Actions">
          <CommandItem
            onSelect={() => {
              onRunNow?.();
              onOpenChange(false);
            }}
          >
            <RefreshCw size={14} /> Run agents now
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
