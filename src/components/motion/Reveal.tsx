"use client";

import { useSyncExternalStore, type ComponentProps, type ReactNode } from "react";
import { m, useReducedMotion } from "motion/react";
import { reveal, stagger } from "@/lib/motion";

type RevealTag = "div" | "section" | "ul" | "li" | "article";

interface RevealProps {
  as?: RevealTag;
  className?: string;
  children: ReactNode;
  delay?: number;
}

function subscribe() {
  return () => {};
}

/**
 * True only once the component has mounted on the client. Implemented with
 * `useSyncExternalStore` (server snapshot = false, client snapshot = true)
 * rather than an effect + setState, so the mount flag flips before paint
 * with no cascading render.
 */
function useMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}

/**
 * Reveal renders a plain, fully-visible element on the server and on first
 * paint (no `initial`/opacity styling reaches the server HTML). Only after
 * the component mounts on the client does it swap in the Motion `m[as]`
 * element with `initial="hidden"` + `whileInView="show"`, so the reveal
 * animation is entirely a client-side, post-hydration behavior.
 */
export function Reveal({ as = "div", className, children, delay = 0 }: RevealProps) {
  const mounted = useMounted();
  const reduced = useReducedMotion();

  if (!mounted) {
    const Static = as;
    return <Static className={className}>{children}</Static>;
  }

  const Comp = m[as];

  return (
    <Comp
      className={className}
      variants={stagger()}
      initial={reduced ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={delay ? { delayChildren: delay } : undefined}
    >
      {children}
    </Comp>
  );
}

export function RevealItem({ className, children, ...props }: ComponentProps<typeof m.div>) {
  return (
    <m.div className={className} variants={reveal} {...props}>
      {children}
    </m.div>
  );
}
