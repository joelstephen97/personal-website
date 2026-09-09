"use client";

import { useState, useSyncExternalStore } from "react";
import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { dur, ease } from "@/lib/motion";

export interface RoleMoreProps {
  /** The impact lines depth-truncated off the visible list. */
  items: string[];
}

function subscribe() {
  return () => {};
}

/**
 * True only once mounted on the client — see `Reveal.tsx`'s `useMounted`
 * for why this uses `useSyncExternalStore` (server snapshot `false`, client
 * snapshot `true`) rather than an effect + setState: it flips before paint
 * with no cascading render, and satisfies `react-hooks/set-state-in-effect`.
 */
function useMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}

/**
 * The remainder of a role's impact list, tucked behind a native
 * `<details>`/`<summary>` so it works with no JS (the browser shows/hides
 * the list itself based on the `open` attribute). Once mounted, `open` is
 * mirrored into React state so a height-animated `m.div` can replace the
 * native show/hide — `AnimatePresence` only runs client-side, after
 * hydration, and is skipped entirely under reduced motion.
 */
export function RoleMore({ items }: RoleMoreProps) {
  const [open, setOpen] = useState(false);
  const mounted = useMounted();
  const reduced = useReducedMotion();

  if (items.length === 0) return null;

  const list = (
    <ul className="list-disc space-y-1.5 pl-5">
      {items.map((line) => (
        <li key={line} className="text-sm leading-relaxed text-fg-2">
          {line}
        </li>
      ))}
    </ul>
  );

  return (
    <details className="mt-3" open={open} onToggle={(event) => setOpen(event.currentTarget.open)}>
      <summary
        aria-expanded={open}
        className="w-fit cursor-pointer select-none text-sm font-medium text-fg-2 transition-colors hover:text-fg focus-visible:outline-2"
      >
        {open ? "Less" : "More"}
      </summary>
      {mounted && !reduced ? (
        <AnimatePresence initial={false}>
          {open && (
            <m.div
              key="more"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: dur.slow, ease: ease.outExpo }}
              className="overflow-hidden"
            >
              <div className="pt-2">{list}</div>
            </m.div>
          )}
        </AnimatePresence>
      ) : (
        <div className="pt-2">{list}</div>
      )}
    </details>
  );
}
