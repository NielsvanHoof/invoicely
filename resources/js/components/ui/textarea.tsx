import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "border-sidebar-border/70 dark:border-sidebar-border flex min-h-[80px] w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:cursor-not-allowed disabled:opacity-50 dark:placeholder:text-neutral-500 dark:focus-visible:ring-neutral-300",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea }; 