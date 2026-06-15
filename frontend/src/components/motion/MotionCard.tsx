import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { forwardRef, type ReactNode, type MouseEvent } from "react";
import { cn } from "@/lib/utils";

interface MotionCardProps {
  children: ReactNode;
  className?: string;
  /** Adds spotlight glow that follows the cursor */
  spotlight?: boolean;
  /** Subtle hover lift translate */
  lift?: boolean;
  onClick?: () => void;
}

/**
 * Card with cursor-tracked spotlight (Framer Motion values) + lift transition.
 * Tuned for the dark editorial palette.
 */
export const MotionCard = forwardRef<HTMLDivElement, MotionCardProps>(
  ({ children, className, spotlight = true, lift = true, onClick }, ref) => {
    const mx = useMotionValue(-200);
    const my = useMotionValue(-200);
    const bg = useMotionTemplate`radial-gradient(220px circle at ${mx}px ${my}px, oklch(0.82 0.16 180 / 0.18), transparent 60%)`;

    const handleMove = (e: MouseEvent<HTMLDivElement>) => {
      if (!spotlight) return;
      const rect = e.currentTarget.getBoundingClientRect();
      mx.set(e.clientX - rect.left);
      my.set(e.clientY - rect.top);
    };

    return (
      <motion.div
        ref={ref}
        onMouseMove={handleMove}
        onClick={onClick}
        whileHover={lift ? { y: -3 } : undefined}
        transition={{ type: "spring", stiffness: 320, damping: 26 }}
        className={cn(
          "group relative overflow-hidden rounded-2xl border border-border/60 bg-card/40 backdrop-blur-xl transition-colors",
          onClick && "cursor-pointer",
          className,
        )}
      >
        {spotlight && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{ background: bg }}
          />
        )}
        <div className="relative">{children}</div>
      </motion.div>
    );
  },
);
MotionCard.displayName = "MotionCard";
