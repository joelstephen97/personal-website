"use client";

import { m } from "motion/react";
import { spring } from "@/lib/motion";
import { cn } from "@/lib/cn";

export interface CrownProps {
  onPress: () => void;
  label?: string;
  className?: string;
}

/**
 * A watch-crown button (opens the command menu): a knurled conic-gradient
 * disc that winds clockwise on hover/tap, with an inset ring standing in
 * for the crown's bevel.
 */
export function Crown({ onPress, label = "Open command menu", className }: CrownProps) {
  return (
    <m.button
      type="button"
      aria-label={label}
      onClick={onPress}
      whileHover={{ rotate: 18 }}
      whileTap={{ rotate: 38, scale: 0.96 }}
      transition={spring.detent}
      className={cn(
        "relative inline-flex size-9 shrink-0 items-center justify-center rounded-full",
        className,
      )}
      style={{
        background:
          "repeating-conic-gradient(var(--surface-pressed) 0deg 6deg, var(--surface-raised) 6deg 12deg)",
        boxShadow: "inset 0 0 0 5px var(--surface-raised), 0 1px 0 var(--glass-highlight)",
      }}
    >
      <span aria-hidden="true" className="font-sans text-sm leading-none text-fg-2">
        ⌘
      </span>
    </m.button>
  );
}
