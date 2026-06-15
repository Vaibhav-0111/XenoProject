import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AnimatedTableRowProps {
  index: number;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

/**
 * Staggered fade-in table row with hover highlight + subtle inset shift.
 */
export function AnimatedTableRow({ index, children, className, onClick }: AnimatedTableRowProps) {
  return (
    <motion.tr
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ backgroundColor: "oklch(0.23 0.035 260 / 0.55)" }}
      onClick={onClick}
      className={cn(
        "border-t border-border/30 transition-colors",
        onClick && "cursor-pointer",
        className,
      )}
    >
      {children}
    </motion.tr>
  );
}
