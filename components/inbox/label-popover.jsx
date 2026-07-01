"use client";

import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function LabelPopover({ children, open, onOpenChange, onApply }) {
  const [value, setValue] = useState("");

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent>
        <p className="text-xs text-gray-500 mb-2">Apply label</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!value.trim()) return;
            onApply?.(value.trim());
            setValue("");
          }}
          className="flex gap-2"
        >
          <Input
            autoFocus
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Label name…"
            className="h-8 text-xs"
          />
          <Button type="submit" size="sm">
            Apply
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  );
}
