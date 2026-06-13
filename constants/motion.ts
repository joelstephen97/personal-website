// Single source of truth for the site's motion "signature".
// Apple-tier: precise, minimal, premium. Import from here everywhere —
// never hand-write eases/durations/springs in components.

import type { Transition, Variants } from "motion-v";

// ── Easing ──────────────────────────────────────────────────────────────────
// Expo-out: a confident, fast-in/soft-settle entrance. Used for reveals/hero.
export const EASE_ENTRANCE = [0.16, 1, 0.3, 1] as const;
// Apple's signature UI curve (iOS/macOS) — decisive, smooth, no rubberiness.
// Used for page/route transitions and matched element changes.
export const EASE_TRANSITION = [0.32, 0.72, 0, 1] as const;

export const DURATION = {
  fast: 0.2,
  base: 0.45,
  slow: 0.6,
} as const;

// ── Springs ───────────────────────────────────────────────────────────────
// Physics presets. Apple's feel = critically-ish damped with a whisper of
// overshoot, never bouncy. Retune here to re-feel the whole site.
export const SPRING = {
  // Natural settle for tilt / cards / large surfaces.
  soft: { type: "spring", stiffness: 170, damping: 22, mass: 0.9 },
  // Crisp press/hover feedback.
  snappy: { type: "spring", stiffness: 460, damping: 34 },
  // Magnetic pull — light, quick to return.
  magnetic: { type: "spring", stiffness: 280, damping: 20, mass: 0.6 },
} as const satisfies Record<string, Transition>;

// ── Variants ────────────────────────────────────────────────────────────────
// Page-level transition (AnimatePresence in the default layout). Light blur +
// micro-scale + small lift reads as depth, not as a heavy wipe. Fast exit so
// navigation feels instant.
export const pageVariants = {
  initial: { opacity: 0, filter: "blur(6px)", y: 10, scale: 0.99 },
  animate: {
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    scale: 1,
    transition: { duration: DURATION.base, ease: EASE_TRANSITION },
  },
  exit: {
    opacity: 0,
    filter: "blur(6px)",
    y: 10,
    scale: 0.99,
    transition: { duration: 0.28, ease: EASE_TRANSITION },
  },
} satisfies Variants;

// Reusable fade-up for stagger children (hero, page headers). Blur-in adds the
// premium sense of an element "focusing" into place.
export const fadeUp = {
  hidden: { opacity: 0, y: 22, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: DURATION.slow, ease: EASE_ENTRANCE },
  },
} satisfies Variants;

// Stagger container for orchestrated entrances (hero, page headers).
export const staggerContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.08 },
  },
} satisfies Variants;
