"use client";

import { useTheme } from "next-themes";
import { m } from "motion/react";
import { spring } from "@/lib/motion";
import { cn } from "@/lib/cn";

type ResolvedTheme = "dark" | "light";

// `<meta name="theme-color">` can't read CSS custom properties, so these
// two hex literals (the dark/light `surface.ground` values) are the one
// allowed exception to the no-raw-hex rule.
const THEME_COLOR: Record<ResolvedTheme, string> = {
  dark: "#0B0C0F",
  light: "#F3F0E8",
};

function otherTheme(theme: ResolvedTheme): ResolvedTheme {
  return theme === "dark" ? "light" : "dark";
}

export interface ThemeToggleProps {
  className?: string;
}

/** Cycles dark <-> light; wraps the switch in a view transition when available. */
export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const active: ResolvedTheme = (theme ?? resolvedTheme) === "light" ? "light" : "dark";
  const next = otherTheme(active);

  function apply() {
    setTheme(next);
    const meta = document.querySelector('meta[name="theme-color"]');
    meta?.setAttribute("content", THEME_COLOR[next]);
  }

  function toggle() {
    const doc = document as Document & { startViewTransition?: (cb: () => void) => void };
    if (typeof doc.startViewTransition === "function") {
      doc.startViewTransition(apply);
    } else {
      apply();
    }
  }

  const visibleLabel = active === "dark" ? "Dark" : "Light";

  return (
    <m.button
      type="button"
      onClick={toggle}
      whileTap={{ scale: 0.94 }}
      transition={spring.snappy}
      // The visible label text ("Dark"/"Light") must appear in the
      // accessible name (WCAG 2.5.3 Label in Name / axe
      // label-content-name-mismatch) so voice-control users referring to
      // what they see on screen can target this control.
      aria-label={`${visibleLabel} theme, switch to ${next} mode`}
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-full border border-line-2 text-fg-2 transition-colors hover:text-fg",
        className,
      )}
    >
      <span aria-hidden="true" className="label text-[10px] leading-none">
        {visibleLabel}
      </span>
    </m.button>
  );
}
