"use client";

import { cloneElement, useEffect, useId, useState } from "react";
import type {
  FocusEvent as ReactFocusEvent,
  KeyboardEvent as ReactKeyboardEvent,
  PointerEvent as ReactPointerEvent,
  ReactElement,
  ReactNode,
} from "react";
import { cn } from "@/lib/cn";

export interface TooltipProps {
  label: ReactNode;
  children: ReactElement<Record<string, unknown>>;
  className?: string;
}

const SHOW_DELAY_MS = 60;

/**
 * Dependency-free tooltip. Shows on `pointerenter` after a 60ms delay, and
 * on `focus` immediately; hides on `pointerleave`, `blur`, or Escape. The
 * tooltip content is always rendered in the DOM (visually hidden via
 * opacity when closed) so `aria-describedby` always resolves.
 *
 * The pending-show delay is owned by a `useEffect` keyed on a `pendingShow`
 * boolean, not a ref + manually-managed `setTimeout` id: nothing here ever
 * reads (or writes) a ref inside a handler passed to `cloneElement` (refs
 * may only be accessed in render-safe positions — effects and real JSX
 * event-handler props — and the React Compiler's `react-hooks/refs` lint
 * rule flags any ref access it can reach from a `cloneElement` props
 * object, even inside a callback, as unsafe). Letting the effect own the
 * timer instead gets unmount cleanup for free: React always runs an
 * effect's cleanup — including a pending `clearTimeout` — before
 * unmounting, so hovering, tabbing away, or navigating mid-delay never
 * leaves a stale timer that later calls `setOpen` on an unmounted
 * component.
 */
export function Tooltip({ label, children, className }: TooltipProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [pendingShow, setPendingShow] = useState(false);

  useEffect(() => {
    if (!pendingShow) return;
    const timeout = setTimeout(() => setOpen(true), SHOW_DELAY_MS);
    return () => clearTimeout(timeout);
  }, [pendingShow]);

  function scheduleShow() {
    setPendingShow(true);
  }

  function showNow() {
    setPendingShow(false);
    setOpen(true);
  }

  function hide() {
    setPendingShow(false);
    setOpen(false);
  }

  const childProps = children.props;
  const pointerEnter = childProps.onPointerEnter as ((e: ReactPointerEvent) => void) | undefined;
  const pointerLeave = childProps.onPointerLeave as ((e: ReactPointerEvent) => void) | undefined;
  const focus = childProps.onFocus as ((e: ReactFocusEvent) => void) | undefined;
  const blur = childProps.onBlur as ((e: ReactFocusEvent) => void) | undefined;
  const keyDown = childProps.onKeyDown as ((e: ReactKeyboardEvent) => void) | undefined;

  const trigger = cloneElement(children, {
    "aria-describedby": id,
    onPointerEnter: (event: ReactPointerEvent) => {
      pointerEnter?.(event);
      scheduleShow();
    },
    onPointerLeave: (event: ReactPointerEvent) => {
      pointerLeave?.(event);
      hide();
    },
    onFocus: (event: ReactFocusEvent) => {
      focus?.(event);
      showNow();
    },
    onBlur: (event: ReactFocusEvent) => {
      blur?.(event);
      hide();
    },
    onKeyDown: (event: ReactKeyboardEvent) => {
      keyDown?.(event);
      if (event.key === "Escape") hide();
    },
  });

  return (
    <span className="relative inline-flex">
      {trigger}
      <span
        role="tooltip"
        id={id}
        className={cn(
          // No `whitespace-nowrap`: a long `label` (e.g. a multi-sentence
          // tip) would otherwise force this absolutely-positioned span to
          // its full unwrapped content width, which can extend past the
          // viewport at narrow widths even while invisible (`opacity-0`,
          // `pointer-events-none` don't remove it from layout) — that
          // still inflates `document.documentElement.scrollWidth` and can
          // produce a real horizontal scrollbar. `max-w-[240px]` plus the
          // default `white-space: normal` lets longer tips wrap instead.
          "glass pointer-events-none absolute left-1/2 top-full z-[var(--z-tray)] mt-2 max-w-[min(240px,calc(100vw-2rem))] -translate-x-1/2 rounded-2 px-2 py-1 text-[12px] text-fg transition-opacity duration-[var(--dur-fast)]",
          open ? "opacity-100" : "opacity-0",
          className,
        )}
      >
        {label}
      </span>
    </span>
  );
}
