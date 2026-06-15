import { motion, useReducedMotion } from "framer-motion";

/**
 * Large, soft, slowly-drifting gradient blobs used behind hero/section
 * content for depth. Purely decorative -- aria-hidden, pointer-events none.
 */
export function AmbientGlow({ className = "" }: { className?: string }) {
  const reduceMotion = useReducedMotion();

  const blobs = [
    { color: "oklch(0.62 0.18 270 / 0.35)", size: 480, top: "5%", left: "8%", duration: 22 },
    { color: "oklch(0.78 0.14 220 / 0.3)", size: 420, top: "40%", left: "70%", duration: 26 },
    { color: "oklch(0.82 0.16 180 / 0.25)", size: 360, top: "70%", left: "15%", duration: 30 },
  ];

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {blobs.map((b, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl"
          style={{
            width: b.size,
            height: b.size,
            top: b.top,
            left: b.left,
            background: b.color,
          }}
          animate={
            reduceMotion
              ? undefined
              : {
                  x: [0, 40, -20, 0],
                  y: [0, -30, 20, 0],
                  scale: [1, 1.08, 0.96, 1],
                }
          }
          transition={{ duration: b.duration, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}
