"use client";

import { Fragment, useSyncExternalStore } from "react";
import { m, useReducedMotion } from "motion/react";
import { stagger, word } from "@/lib/motion";
import { cn } from "@/lib/cn";

export interface HeroHeadlineProps {
  /** Plain words, rendered first. */
  words: string[];
  /** Words rendered inside a single `<em>`, right after `words`. */
  emphasis: string[];
  className?: string;
}

function subscribe() {
  return () => {};
}

/**
 * True only once mounted on the client — same `useSyncExternalStore`
 * pattern as `Reveal`'s `useMounted` (server snapshot `false`, client
 * snapshot `true`), so the mount flag flips before paint with no
 * cascading render.
 */
function useMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}

/**
 * The hero h1's contents: ten words staggered in on mount. Server HTML
 * (and the reduced-motion render) is plain `<span>` words with no inline
 * opacity — fully visible immediately. Once mounted, if the user has not
 * asked for reduced motion, each word plays in via `variants={word}` under
 * a parent using `stagger(0.035, 0.08)`, `initial="hidden" animate="show"`
 * — this is the once-per-load hero choreography, not a `Reveal`-style
 * viewport gate, so (unlike `Reveal`) it intentionally starts from
 * `hidden` rather than skipping straight to `show`.
 *
 * The space between words is a plain text-node sibling of each
 * `<span class="inline-block">` word (via `Fragment`), never a space
 * *inside* the span: a trailing space inside an `inline-block` box is
 * trimmed at that box's own line-layout edge (`inline-block` establishes
 * its own formatting context), which would otherwise glue consecutive
 * words together with no visible or readable gap.
 */
export function HeroHeadline({ words, emphasis, className }: HeroHeadlineProps) {
  const mounted = useMounted();
  const reduced = useReducedMotion();

  if (!mounted || reduced) {
    return (
      <span className={className}>
        {words.map((w, i) => (
          <Fragment key={`w-${i}`}>
            {i > 0 && " "}
            <span className="inline-block">{w}</span>
          </Fragment>
        ))}{" "}
        <em className="italic font-normal text-fg-2">
          {emphasis.map((w, i) => (
            <Fragment key={`e-${i}`}>
              {i > 0 && " "}
              <span className="inline-block">{w}</span>
            </Fragment>
          ))}
        </em>
      </span>
    );
  }

  return (
    <m.span
      className={cn(className)}
      variants={stagger(0.035, 0.08)}
      initial="hidden"
      animate="show"
    >
      {words.map((w, i) => (
        <Fragment key={`w-${i}`}>
          {i > 0 && " "}
          <m.span variants={word} className="inline-block">
            {w}
          </m.span>
        </Fragment>
      ))}{" "}
      <em className="italic font-normal text-fg-2">
        {emphasis.map((w, i) => (
          <Fragment key={`e-${i}`}>
            {i > 0 && " "}
            <m.span variants={word} className="inline-block">
              {w}
            </m.span>
          </Fragment>
        ))}
      </em>
    </m.span>
  );
}
