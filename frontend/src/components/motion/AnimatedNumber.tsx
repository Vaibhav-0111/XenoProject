import gsap from "gsap";
import { useEffect, useRef, useState } from "react";

interface AnimatedNumberProps {
  value: number;
  durationMs?: number;
  /** Decimal places if value is a float */
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

/**
 * GSAP-powered count-up that smoothly tweens between value changes.
 * Reuses a single tween so consecutive updates feel continuous (e.g. live audience size).
 */
export function AnimatedNumber({
  value,
  durationMs = 900,
  decimals,
  prefix = "",
  suffix = "",
  className,
}: AnimatedNumberProps) {
  const obj = useRef({ n: 0 });
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const [display, setDisplay] = useState(0);
  const isFloat = decimals !== undefined ? decimals > 0 : value % 1 !== 0;
  const fixed = isFloat ? (decimals ?? 1) : 0;

  useEffect(() => {
    tweenRef.current?.kill();
    tweenRef.current = gsap.to(obj.current, {
      n: value,
      duration: durationMs / 1000,
      ease: "power3.out",
      onUpdate: () => setDisplay(obj.current.n),
    });
    return () => {
      tweenRef.current?.kill();
    };
  }, [value, durationMs]);

  const formatted = isFloat ? display.toFixed(fixed) : Math.round(display).toLocaleString();

  return (
    <span className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
