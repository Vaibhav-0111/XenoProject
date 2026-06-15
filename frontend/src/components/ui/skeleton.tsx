import { cn } from "@/lib/utils";

/**
 * Shimmer skeleton: a soft diagonal highlight sweeps across the block,
 * layered on top of the base pulse for a more premium loading feel.
 */
function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md bg-primary/10",
        "before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer",
        "before:bg-gradient-to-r before:from-transparent before:via-foreground/10 before:to-transparent",
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
