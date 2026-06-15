import { useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Slim aurora progress bar fixed to the top of the viewport, shown while
 * TanStack Router is loading the next route (data fetches, lazy chunks).
 * Mimics the Linear/Vercel "nprogress" feel.
 */
export function RouteProgressBar() {
  const isLoading = useRouterState({ select: (s) => s.status === "pending" });

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed left-0 top-0 z-[100] h-0.5 w-full bg-aurora animate-aurora"
          initial={{ scaleX: 0, opacity: 1 }}
          animate={{ scaleX: 0.8, transition: { duration: 0.6, ease: "easeOut" } }}
          exit={{ scaleX: 1, opacity: 0, transition: { duration: 0.25 } }}
          style={{ transformOrigin: "left", boxShadow: "0 0 12px oklch(0.72 0.16 270 / 0.6)" }}
        />
      )}
    </AnimatePresence>
  );
}
