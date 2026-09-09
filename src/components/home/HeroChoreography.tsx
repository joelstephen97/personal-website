"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

export interface HeroChoreographyValue {
  /** `performance.now()` at the moment this provider first rendered. */
  startedAt: number | null;
}

const HeroChoreographyContext = createContext<HeroChoreographyValue>({ startedAt: null });

/**
 * `startedAt`: `null` until mount, then the `performance.now()` timestamp
 * the hero's choreography started at. A consumer with no provider above it
 * gets `{ startedAt: null }` and should fall back to its own mount-relative
 * delays (see `SystemMap`, which does exactly this today).
 */
export function useHeroChoreography(): HeroChoreographyValue {
  return useContext(HeroChoreographyContext);
}

/**
 * Provides a shared `startedAt` timestamp for the hero's headline and map
 * so a future revision of `SystemMap` could offset its own animation
 * delays from the headline's start instead of its own mount time.
 *
 * Simplification for this task: `SystemMap` is intentionally left
 * unmodified (per the controller ruling — its delays already run from its
 * own mount) rather than wired to consume this context. `HeroHeadline` and
 * `SystemMap` are mounted together, in the same commit, by `Hero`, so their
 * independent mount-relative timelines start within the same frame and the
 * spec's relative offsets (edges 380ms, nodes 580ms, core 980ms from the
 * headline's start) hold in practice without `SystemMap` reading this
 * context. This provider exists so a later task can wire that consumption
 * up without changing `Hero`'s structure.
 */
export function HeroChoreography({ children }: { children: ReactNode }) {
  // A lazy initializer (not an effect + setState) so the timestamp is
  // captured once, synchronously, on the first render — no cascading
  // re-render from setting state inside an effect.
  const [startedAt] = useState<number | null>(() =>
    typeof performance !== "undefined" ? performance.now() : null,
  );

  return (
    <HeroChoreographyContext.Provider value={{ startedAt }}>
      {children}
    </HeroChoreographyContext.Provider>
  );
}
