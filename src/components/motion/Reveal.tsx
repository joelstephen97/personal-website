"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ComponentProps,
  type ReactNode,
} from "react";
import { m, useReducedMotion } from "motion/react";
import { reveal, stagger } from "@/lib/motion";

type RevealTag = "div" | "section" | "ul" | "li" | "article";

// A single ref usable across all `RevealTag` elements. JSX can't narrow the
// ref type for a dynamically-chosen intrinsic tag, so this intersection
// stands in for "whichever host element `as` resolves to" at the three call
// sites below.
type RevealRef = React.Ref<HTMLDivElement & HTMLUListElement & HTMLLIElement>;

interface RevealProps {
  as?: RevealTag;
  className?: string;
  children: ReactNode;
  delay?: number;
}

// Same vertical margin as the `viewport` prop below ("-10% 0px"), expressed
// as a fraction of the viewport height for the one-time mount-time measurement.
const VIEWPORT_MARGIN_FRACTION = 0.1;

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

// useLayoutEffect is a no-op (with a console warning) during SSR; fall back
// to useEffect there since this hook only ever needs to run on the client.
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

function isInViewport(rect: DOMRect) {
  if (typeof window === "undefined") return false;
  const margin = window.innerHeight * VIEWPORT_MARGIN_FRACTION;
  return rect.top < window.innerHeight - margin && rect.bottom > margin;
}

/**
 * Reveal renders a plain, fully-visible element on the server and on first
 * paint (no `initial`/opacity styling reaches the server HTML). Only after
 * the component mounts does a `useLayoutEffect` measure the element once,
 * synchronously, before the browser paints:
 *
 * - Already inside the viewport (± the same -10% margin used by
 *   `whileInView`) → swap to the Motion element with `initial={false}` +
 *   `animate="show"`. No "hidden" frame is ever produced for this element,
 *   so it never flashes to opacity 0 and never needs to animate on load.
 * - Below the fold → swap to the Motion element with `initial="hidden"` +
 *   `whileInView="show"`, exactly as before, so it reveals when scrolled
 *   into view.
 *
 * Because the measurement + state update both happen inside a layout
 * effect, the swap is committed before the browser paints — no frame with
 * `opacity: 0` is ever visible for an in-view element.
 */
export function Reveal({ as = "div", className, children, delay }: RevealProps) {
  const mounted = useMounted();
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState<boolean | null>(null);

  useIsomorphicLayoutEffect(() => {
    if (!mounted) return;
    const el = ref.current;
    setInView(el ? isInViewport(el.getBoundingClientRect()) : false);
  }, [mounted]);

  if (!mounted || inView === null) {
    const Static = as;
    return (
      <Static ref={ref as RevealRef} className={className}>
        {children}
      </Static>
    );
  }

  const Comp = m[as];
  // `delay` must flow into the `show` variant's own transition, not a
  // component-level `transition` prop — Motion resolves a variant's
  // `transition` first, which shadows (and silently discards) any
  // `transition` prop passed alongside `variants`/`animate`/`whileInView`.
  const variants = stagger(0.06, delay ?? 0.08);

  if (inView) {
    return (
      <Comp
        ref={ref as RevealRef}
        className={className}
        variants={variants}
        initial={false}
        animate="show"
      >
        {children}
      </Comp>
    );
  }

  return (
    <Comp
      ref={ref as RevealRef}
      className={className}
      variants={variants}
      initial={reduced ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, margin: "-10% 0px" }}
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
