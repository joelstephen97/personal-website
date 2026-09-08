"use client";

import { AnimatePresence, m } from "motion/react";
import { mechanical } from "@/lib/motion";
import { cn } from "@/lib/cn";

export type DateWindowSize = "sm" | "md";

export interface DateWindowProps {
  value: string;
  label?: string;
  size?: DateWindowSize;
  className?: string;
}

const dims: Record<DateWindowSize, { width: number; height: number; fontSize: number }> = {
  sm: { width: 40, height: 32, fontSize: 18 },
  md: { width: 58, height: 44, fontSize: 28 },
};

/**
 * A watch date-window aperture: the current `value` sits behind a recessed,
 * champagne-beveled window and rolls in/out like a mechanical date wheel
 * whenever `value` changes.
 */
export function DateWindow({ value, label, size = "md", className }: DateWindowProps) {
  const { width, height, fontSize } = dims[size];

  return (
    <div className={cn("inline-flex flex-col items-center gap-1.5", className)}>
      <div
        className="relative overflow-hidden bg-ground"
        style={{ width, height, boxShadow: "var(--shadow-inset)" }}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ boxShadow: "inset 0 0 0 1px var(--metal-champagne-line)" }}
        />
        <AnimatePresence mode="popLayout" initial={false}>
          <m.span
            key={value}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%", opacity: 0.2 }}
            transition={mechanical}
            className="absolute inset-0 flex items-center justify-center font-display tabular-nums text-fg"
            style={{ fontSize }}
          >
            {value}
          </m.span>
        </AnimatePresence>
      </div>
      {label && <span className="label text-fg-3">{label}</span>}
    </div>
  );
}
