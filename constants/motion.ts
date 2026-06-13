// Single source of truth for the site's motion "signature".
// Apple-tier: precise, minimal, premium. Import from here everywhere —
// never hand-write eases/durations/springs in components.

import type { Transition, Variants } from "motion-v";

// Entrances (reveal, hero): expressive-but-controlled ease-out.
export const EASE_ENTRANCE = [0.16, 1, 0.3, 1] as const;
// Transitions (page change, color/transform settle): standard material ease.
export const EASE_TRANSITION = [0.4, 0, 0.2, 1] as const;

export const DURATION = {
  fast: 0.18,
  base: 0.35,
  slow: 0.7,
} as const;

export const SPRING = {
  // Gentle settle for tilt / large surfaces.
  soft: { type: "spring", stiffness: 150, damping: 20, mass: 0.6 },
  // Crisp press/hover feedback.
  snappy: { type: "spring", stiffness: 400, damping: 30 },
  // Magnetic pull — light and quick to return.
  magnetic: { type: "spring", stiffness: 250, damping: 18, mass: 0.5 },
} as const satisfies Record<string, Transition>;

// Page-level transition used by AnimatePresence in the default layout.
export const pageVariants = {
  initial: { opacity: 0, filter: "blur(8px)", y: 12 },
  animate: {
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    transition: { duration: DURATION.base, ease: EASE_TRANSITION },
  },
  exit: {
    opacity: 0,
    filter: "blur(8px)",
    y: 12,
    transition: { duration: DURATION.base, ease: EASE_TRANSITION },
  },
} satisfies Variants;

// Reusable fade-up for stagger children (hero).
export const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.slow, ease: EASE_ENTRANCE },
  },
} satisfies Variants;

// Stagger container for orchestrated entrances (hero).
export const staggerContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
} satisfies Variants;
