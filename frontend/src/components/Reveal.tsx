import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Stagger delay in seconds, useful when revealing a list of siblings */
  delay?: number;
  /** Direction the content animates in from */
  direction?: "up" | "down" | "left" | "right" | "none";
  /** Distance (px) traveled during the reveal */
  distance?: number;
  /** Apply to the container (e.g. "contents") if you don't want an extra DOM box */
  as?: "div" | "span";
}

const OFFSETS: Record<NonNullable<RevealProps["direction"]>, { x?: number; y?: number }> = {
  up: { y: 1 },
  down: { y: -1 },
  left: { x: 1 },
  right: { x: -1 },
  none: {},
};

/**
 * Scroll-into-view reveal: fades, rises/slides and un-blurs content once it
 * enters the viewport. Used across landing page sections for a layered,
 * "things arrive as you scroll" feel without re-triggering on every scroll
 * (animates once).
 */
export function Reveal({
  children,
  className,
  delay = 0,
  direction = "up",
  distance = 24,
  as = "div",
}: RevealProps) {
  const reduceMotion = useReducedMotion();
  const offset = OFFSETS[direction];

  const variants: Variants = {
    hidden: {
      opacity: 0,
      y: offset.y ? offset.y * distance : 0,
      x: offset.x ? offset.x * distance : 0,
      filter: "blur(6px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      filter: "blur(0px)",
      transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
    },
  };

  if (reduceMotion) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  const MotionTag = as === "span" ? motion.span : motion.div;

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px -80px 0px" }}
      variants={variants}
    >
      {children}
    </MotionTag>
  );
}

/**
 * Wraps a list of children, staggering each direct child's reveal.
 * Children should be plain elements -- this clones each into a Reveal.
 */
export function RevealGroup({
  children,
  className,
  stagger = 0.08,
  ...rest
}: Omit<RevealProps, "delay"> & { children: ReactNode[]; stagger?: number }) {
  return (
    <div className={className}>
      {children.map((child, i) => (
        <Reveal key={i} delay={i * stagger} {...rest}>
          {child}
        </Reveal>
      ))}
    </div>
  );
}
