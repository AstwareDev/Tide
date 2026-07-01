import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const alertVariants = cva("relative w-full rounded-lg border px-4 py-3 text-sm flex items-start gap-3", {
  variants: {
    variant: {
      default: "bg-accent border-border text-accent-foreground",
      destructive: "bg-red-500/10 border-red-500/20 text-red-300",
    },
  },
  defaultVariants: { variant: "default" },
});

function Alert({ className, variant, ...props }) {
  return <div role="alert" className={cn(alertVariants({ variant, className }))} {...props} />;
}

function AlertTitle({ className, ...props }) {
  return <h5 className={cn("font-medium leading-none mb-1", className)} {...props} />;
}

function AlertDescription({ className, ...props }) {
  return <div className={cn("text-xs opacity-90", className)} {...props} />;
}

export { Alert, AlertTitle, AlertDescription };
