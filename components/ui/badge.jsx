import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary/15 text-blue-400 border-blue-500/20",
        secondary: "bg-accent text-muted-foreground border-border",
        destructive: "bg-red-500/15 text-red-400 border-red-500/20",
        amber: "bg-amber-500/15 text-amber-400 border-amber-500/20",
        outline: "text-foreground border-border bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({ className, variant, ...props }) {
  return <div className={cn(badgeVariants({ variant, className }))} {...props} />;
}

export { Badge, badgeVariants };
