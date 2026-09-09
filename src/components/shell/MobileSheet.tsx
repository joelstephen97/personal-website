"use client";

import { useEffect, useRef, type ComponentProps } from "react";
import Link from "next/link";
import { AnimatePresence, m } from "motion/react";
import { dur, ease } from "@/lib/motion";
import { site } from "@/lib/site";
import { NAV_ITEMS } from "./Nav";

// See Button.tsx for why this cast exists instead of a typed `href` prop.
type LinkHref = ComponentProps<typeof Link>["href"];

export interface MobileSheetProps {
  open: boolean;
  onClose: () => void;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Full-screen mobile nav panel: rolls its own focus trap (Tab / Shift+Tab
 * cycle within the panel), closes on Escape, and locks body scroll while
 * open.
 */
export function MobileSheet({ open, onClose }: MobileSheetProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const panel = panelRef.current;
    const firstFocusable = panel?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
    firstFocusable?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panel) return;

      const focusable = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <m.div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: dur.base, ease: ease.outExpo }}
          className="glass-hud fixed inset-0 z-[var(--z-tray)] flex flex-col justify-between p-6 md:hidden"
        >
          <div className="flex items-center justify-between">
            <span className="font-display text-[22px] leading-none text-fg">Joel Stephen</span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="inline-flex size-9 items-center justify-center rounded-full border border-line-2 text-fg-2"
            >
              <span aria-hidden="true">&#10005;</span>
            </button>
          </div>

          <nav aria-label="Mobile" className="flex flex-col gap-3">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href as LinkHref}
                onClick={onClose}
                className="font-display text-[34px] leading-tight text-fg"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-3 border-t border-line pt-4 text-sm">
            <a href={`mailto:${site.email}`} className="link-draw text-link">
              {site.email}
            </a>
            <a
              href={site.github}
              target="_blank"
              rel="noopener noreferrer"
              className="link-draw text-link"
            >
              GitHub
            </a>
            <a
              href={site.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="link-draw text-link"
            >
              LinkedIn
            </a>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
