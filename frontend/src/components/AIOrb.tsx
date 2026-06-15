import { motion, useReducedMotion } from "framer-motion";

export type OrbState =
  | "idle"
  | "thinking"
  | "analyzing"
  | "generating"
  | "executing"
  | "completed";

interface AIOrbProps {
  size?: number;
  state?: OrbState;
  className?: string;
}

/**
 * Per-state visual language. Color drives the inner core + glow tint,
 * speed drives ring rotation + pulse cadence, particleCount drives orbiters.
 */
const STATE_CONFIG: Record<
  OrbState,
  {
    coreA: string;
    coreB: string;
    glow: string;
    ringA: string;
    ringB: string;
    pulse: number; // seconds
    ringSpeed: number; // seconds (outer ring full rotation)
    intensity: number; // scale factor at peak
    particles: number;
  }
> = {
  idle: {
    coreA: "oklch(0.95 0.05 220)",
    coreB: "oklch(0.62 0.18 270)",
    glow: "oklch(0.72 0.16 270 / 0.55)",
    ringA: "oklch(0.78 0.14 220 / 0.4)",
    ringB: "oklch(0.62 0.18 270 / 0.4)",
    pulse: 3.6,
    ringSpeed: 22,
    intensity: 1,
    particles: 5,
  },
  thinking: {
    coreA: "oklch(0.92 0.06 260)",
    coreB: "oklch(0.55 0.18 280)",
    glow: "oklch(0.62 0.2 280 / 0.6)",
    ringA: "oklch(0.7 0.18 280 / 0.55)",
    ringB: "oklch(0.78 0.14 220 / 0.5)",
    pulse: 1.6,
    ringSpeed: 8,
    intensity: 1.04,
    particles: 6,
  },
  analyzing: {
    coreA: "oklch(0.95 0.08 200)",
    coreB: "oklch(0.6 0.18 220)",
    glow: "oklch(0.78 0.16 220 / 0.6)",
    ringA: "oklch(0.82 0.16 220 / 0.6)",
    ringB: "oklch(0.7 0.14 240 / 0.5)",
    pulse: 1.2,
    ringSpeed: 6,
    intensity: 1.06,
    particles: 8,
  },
  generating: {
    coreA: "oklch(0.96 0.08 180)",
    coreB: "oklch(0.62 0.18 180)",
    glow: "oklch(0.82 0.16 180 / 0.6)",
    ringA: "oklch(0.82 0.16 180 / 0.6)",
    ringB: "oklch(0.7 0.18 280 / 0.5)",
    pulse: 1.4,
    ringSpeed: 5,
    intensity: 1.08,
    particles: 9,
  },
  executing: {
    coreA: "oklch(0.95 0.1 140)",
    coreB: "oklch(0.6 0.2 145)",
    glow: "oklch(0.78 0.18 145 / 0.65)",
    ringA: "oklch(0.78 0.18 145 / 0.6)",
    ringB: "oklch(0.82 0.16 180 / 0.5)",
    pulse: 0.9,
    ringSpeed: 3.5,
    intensity: 1.12,
    particles: 10,
  },
  completed: {
    coreA: "oklch(0.97 0.08 145)",
    coreB: "oklch(0.7 0.18 150)",
    glow: "oklch(0.82 0.18 150 / 0.7)",
    ringA: "oklch(0.85 0.18 150 / 0.7)",
    ringB: "oklch(0.85 0.18 150 / 0.5)",
    pulse: 2.8,
    ringSpeed: 14,
    intensity: 1.15,
    particles: 6,
  },
};

export function AIOrb({ size = 240, state = "idle", className = "" }: AIOrbProps) {
  const prefersReduced = useReducedMotion();
  const cfg = STATE_CONFIG[state];
  const pulse = prefersReduced ? 0 : cfg.pulse;
  const ringSpeed = prefersReduced ? 0 : cfg.ringSpeed;

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      {/* Outer glow */}
      <motion.div
        className="absolute inset-0 rounded-full blur-3xl"
        style={{ background: `radial-gradient(circle, ${cfg.glow}, transparent 70%)` }}
        animate={{ scale: [1, cfg.intensity, 1], opacity: [0.5, 0.85, 0.5] }}
        transition={{ duration: pulse || 0.001, repeat: pulse ? Infinity : 0, ease: "easeInOut" }}
      />

      {/* Outer rotating ring */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{ rotate: ringSpeed ? 360 : 0 }}
        transition={{ duration: ringSpeed || 0.001, repeat: ringSpeed ? Infinity : 0, ease: "linear" }}
        style={{
          background: `conic-gradient(from 0deg, transparent, ${cfg.ringA}, transparent 35%)`,
          maskImage: "radial-gradient(circle, transparent 60%, black 62%, black 100%)",
          WebkitMaskImage: "radial-gradient(circle, transparent 60%, black 62%, black 100%)",
        }}
      />

      {/* Inner counter-rotating ring */}
      <motion.div
        className="absolute inset-4 rounded-full"
        animate={{ rotate: ringSpeed ? -360 : 0 }}
        transition={{ duration: (ringSpeed * 0.7) || 0.001, repeat: ringSpeed ? Infinity : 0, ease: "linear" }}
        style={{
          background: `conic-gradient(from 180deg, transparent, ${cfg.ringB}, transparent 30%)`,
          maskImage: "radial-gradient(circle, transparent 65%, black 67%, black 100%)",
          WebkitMaskImage: "radial-gradient(circle, transparent 65%, black 67%, black 100%)",
        }}
      />

      {/* Inner core */}
      <motion.div
        className="absolute inset-[20%] rounded-full"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${cfg.coreA}, ${cfg.coreB} 55%, oklch(0.18 0.04 270) 100%)`,
          boxShadow: `inset -8px -10px 30px oklch(0.12 0.04 270 / 0.7), inset 6px 8px 20px oklch(1 0 0 / 0.28), 0 0 ${size * 0.3}px ${cfg.glow}`,
        }}
        animate={{ scale: [1, cfg.intensity, 1] }}
        transition={{ duration: pulse || 0.001, repeat: pulse ? Infinity : 0, ease: "easeInOut" }}
      />

      {/* Completed checkmark ring */}
      {state === "completed" && (
        <motion.svg
          className="absolute inset-0"
          viewBox="0 0 100 100"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <motion.path
            d="M 32 52 L 45 64 L 68 38"
            stroke="oklch(0.97 0.08 145)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </motion.svg>
      )}

      {/* Floating particles */}
      {!prefersReduced &&
        Array.from({ length: cfg.particles }).map((_, i) => {
          const angle = (i / cfg.particles) * Math.PI * 2;
          const base = 6 + (i % 3);
          const orbitDuration = state === "executing" ? base - 2 : base;
          const d = Math.max(2, orbitDuration);
          return (
            <motion.div
              key={`${state}-${i}`}
              className="absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full"
              style={{
                background: cfg.ringA,
                boxShadow: `0 0 12px ${cfg.ringA}`,
              }}
              animate={{
                x: [
                  Math.cos(angle) * size * 0.45,
                  Math.cos(angle + Math.PI) * size * 0.45,
                  Math.cos(angle) * size * 0.45,
                ],
                y: [
                  Math.sin(angle) * size * 0.45,
                  Math.sin(angle + Math.PI) * size * 0.45,
                  Math.sin(angle) * size * 0.45,
                ],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: d,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.25,
              }}
            />
          );
        })}
    </div>
  );
}
