"use client";

import { useId } from "react";
import Image from "next/image";
import { m, useReducedMotion } from "motion/react";

// The push-in ease the controller ruling specifies ([0.2, 0.6, 0.2, 1]) is
// deliberately softer than `ease.mechanical` ([0.2, 0.8, 0.2, 1]) in
// `@/lib/motion` — not a typo, so it stays a local literal rather than
// reusing that token.
const PUSH_IN_EASE = [0.2, 0.6, 0.2, 1] as const;
const PUSH_IN_DURATION = 8;

/**
 * The About page portrait: a 4:5 frame around `/headshot.png` with a single
 * 8-second push-in (scale 1 → 1.045) the first time it enters the viewport,
 * plus a static SVG grain overlay. The `m.div` renders with `initial={{
 * scale: 1 }}` — identical to the unscaled image — so the server HTML and
 * first paint show the photo fully; only the *animation* is client-side.
 */
export function Headshot() {
  const reduced = useReducedMotion();
  const grainId = useId();

  return (
    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[var(--radius-4)] border border-line">
      <m.div
        className="absolute inset-0"
        initial={{ scale: 1 }}
        whileInView={reduced ? { scale: 1 } : { scale: 1.045 }}
        viewport={{ once: true }}
        transition={{ duration: PUSH_IN_DURATION, ease: PUSH_IN_EASE }}
      >
        <Image
          src="/headshot.png"
          alt="Portrait of Joel Stephen"
          fill
          priority={false}
          sizes="(min-width:1024px) 320px, 60vw"
          className="object-cover"
        />
      </m.div>
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.045]"
      >
        <filter id={grainId}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves={2}
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter={`url(#${grainId})`} />
      </svg>
    </div>
  );
}
