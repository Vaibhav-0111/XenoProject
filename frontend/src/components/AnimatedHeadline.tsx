import { motion, useReducedMotion } from "framer-motion";
import { Children, type ReactNode } from "react";

/**
 * Splits its text children into words and staggers them in with a soft
 * blur + rise, for hero-grade headline entrances. Non-text children (e.g.
 * <br/>, <span> accents) are rendered as their own staggered block so
 * styling like .text-gradient on inline spans still works.
 */
export function AnimatedHeadline({
  children,
  className,
  delay = 0,
  stagger = 0.05,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <h1 className={className}>{children}</h1>;
  }

  let wordIndex = 0;
  const blocks = Children.toArray(children).map((child, i) => {
    if (typeof child === "string") {
      const words = child.split(/(\s+)/).filter(Boolean);
      return (
        <span key={i}>
          {words.map((word, j) => {
            if (/^\s+$/.test(word)) return <span key={j}>{word}</span>;
            const idx = wordIndex++;
            return (
              <motion.span
                key={j}
                className="inline-block"
                initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{
                  duration: 0.6,
                  delay: delay + idx * stagger,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {word}
              </motion.span>
            );
          })}
        </span>
      );
    }

    // Non-string child (e.g. <br/>, accent <span>): reveal as a whole block
    const idx = wordIndex++;
    return (
      <motion.span
        key={i}
        className="inline-block"
        initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.6, delay: delay + idx * stagger, ease: [0.22, 1, 0.36, 1] }}
      >
        {child}
      </motion.span>
    );
  });

  return <h1 className={className}>{blocks}</h1>;
}
