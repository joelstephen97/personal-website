import type { Transition, Variants } from "motion/react";

export const ease = {
  outExpo: [0.16, 1, 0.3, 1],
  inOut: [0.65, 0, 0.35, 1],
  mechanical: [0.2, 0.8, 0.2, 1],
} as const;

export const dur = {
  fast: 0.12,
  base: 0.2,
  slow: 0.32,
  reveal: 0.56,
  draw: 0.9,
  pushIn: 8,
} as const;

export const spring = {
  snappy: { type: "spring", stiffness: 520, damping: 38, mass: 0.8 },
  gentle: { type: "spring", stiffness: 170, damping: 26, mass: 1 },
  magnet: { type: "spring", stiffness: 300, damping: 20, mass: 0.6 },
  detent: { type: "spring", stiffness: 380, damping: 22, mass: 1 },
} as const satisfies Record<string, Transition>;

export const mechanical: Transition = {
  duration: dur.base,
  ease: ease.mechanical,
};

export const reveal: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: dur.reveal,
      ease: ease.outExpo,
      delay: i * 0.06,
    },
  }),
};

export function stagger(staggerChildren = 0.06, delayChildren = 0.08): Variants {
  return {
    hidden: {},
    show: {
      transition: {
        staggerChildren,
        delayChildren,
      },
    },
  };
}

export const word: Variants = {
  hidden: { opacity: 0, y: 8, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: dur.slow,
      ease: ease.outExpo,
    },
  },
};
