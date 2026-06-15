import gsap from "gsap";
import { motion, useInView } from "framer-motion";
import { useEffect, useMemo, useRef } from "react";

interface MotionLineChartProps {
  data: number[];
  width?: number;
  height?: number;
  className?: string;
  /** trigger re-animation when this changes */
  resetKey?: string | number;
}

/**
 * Editorial line + area chart. Framer Motion handles path-length draw-in,
 * GSAP staggers the dot reveal once the line completes.
 */
export function MotionLineChart({
  data,
  width = 600,
  height = 200,
  className,
  resetKey,
}: MotionLineChartProps) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const max = Math.max(...data, 1);
  const step = width / (data.length - 1 || 1);

  const { points, area, dots } = useMemo(() => {
    const dots = data.map((v, i) => ({
      cx: i * step,
      cy: height - (v / max) * height * 0.85,
    }));
    const points = dots.map((d) => `${d.cx},${d.cy}`).join(" ");
    const area = `0,${height} ${points} ${width},${height}`;
    return { points, area, dots };
  }, [data, height, max, step, width]);

  // GSAP dot stagger after the polyline draws in
  useEffect(() => {
    if (!inView) return;
    const els = ref.current?.querySelectorAll<SVGCircleElement>("[data-chart-dot]");
    if (!els || els.length === 0) return;
    gsap.fromTo(
      els,
      { scale: 0, transformOrigin: "center" },
      {
        scale: 1,
        duration: 0.35,
        ease: "back.out(2)",
        stagger: 0.04,
        delay: 1.0,
      },
    );
  }, [inView, resetKey]);

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${width} ${height}`}
      className={className ?? "h-48 w-full"}
      key={resetKey}
    >
      <defs>
        <linearGradient id="mlc-area" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.72 0.16 270)" stopOpacity="0.45" />
          <stop offset="100%" stopColor="oklch(0.72 0.16 270)" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="mlc-line" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="oklch(0.78 0.14 220)" />
          <stop offset="100%" stopColor="oklch(0.82 0.16 180)" />
        </linearGradient>
      </defs>
      <motion.polygon
        points={area}
        fill="url(#mlc-area)"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1 }}
      />
      <motion.polyline
        points={points}
        fill="none"
        stroke="url(#mlc-line)"
        strokeWidth="2.5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
      />
      {dots.map((d, i) => (
        <circle
          key={i}
          data-chart-dot
          cx={d.cx}
          cy={d.cy}
          r="2.5"
          fill="oklch(0.82 0.16 180)"
          style={{ transform: "scale(0)", transformOrigin: `${d.cx}px ${d.cy}px` }}
        />
      ))}
    </svg>
  );
}
