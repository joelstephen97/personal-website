"use client";

import { useState } from "react";
import { m, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { cn } from "@/lib/cn";

export interface ReadingDialProps {
  /** Overall diameter in px. */
  size?: number;
  className?: string;
}

/**
 * A small watch-dial indicator of scroll progress through the page: a grey
 * seconds hand ticks with a CSS keyframe animation (`@keyframes tick` in
 * globals.css, disabled under reduced motion), while a champagne hand is
 * driven by `scrollYProgress` and sweeps from 0deg to 360deg across the
 * page. A visually-hidden `progressbar` mirrors the same value for
 * assistive tech.
 */
export function ReadingDial({ size = 28, className }: ReadingDialProps) {
  const { scrollYProgress } = useScroll();
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const [pct, setPct] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setPct(Math.round(Math.min(1, Math.max(0, v)) * 100));
  });

  return (
    <div className={cn("dial", className)} style={{ width: size, height: size }}>
      <div aria-hidden="true" className="absolute inset-0">
        <span className="hand sec" />
        <m.span className="hand" style={{ rotate }} />
        <span className="pin" />
      </div>
      <span
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        aria-label="Page read"
        className="sr-only"
      />
    </div>
  );
}
