import { motion, type HTMLMotionProps } from "framer-motion";
import { forwardRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost" | "outline" | "subtle";

interface MotionButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: Variant;
  children: ReactNode;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "relative overflow-hidden bg-foreground text-background hover:bg-foreground/95 shadow-[0_8px_24px_-12px_oklch(0.72_0.16_270/0.6)]",
  ghost: "bg-transparent text-foreground hover:bg-secondary/60",
  outline:
    "border border-border/70 text-foreground hover:border-foreground/40 hover:bg-secondary/30",
  subtle: "bg-secondary/60 text-foreground hover:bg-secondary",
};

/**
 * Framer-Motion button with consistent press/hover micro-interactions tuned
 * to the editorial design tokens. Primary variant includes a sheen sweep on hover.
 */
export const MotionButton = forwardRef<HTMLButtonElement, MotionButtonProps>(
  ({ variant = "primary", className, children, ...rest }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={
          variant === "primary"
            ? { y: -1, boxShadow: "0 12px 32px -10px oklch(0.72 0.16 270 / 0.85)" }
            : { y: -1 }
        }
        whileTap={{ scale: 0.97, y: 0 }}
        transition={{ type: "spring", stiffness: 420, damping: 26 }}
        className={cn(
          "group inline-flex cursor-pointer items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
          VARIANT_CLASSES[variant],
          className,
        )}
        {...rest}
      >
        {variant === "primary" && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full"
          />
        )}
        <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
      </motion.button>
    );
  },
);
MotionButton.displayName = "MotionButton";
