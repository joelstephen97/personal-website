"use client";

import { useId, useState } from "react";
import { AnimatePresence, m } from "motion/react";
import { dur, ease } from "@/lib/motion";
import { cn } from "@/lib/cn";

export interface ComplicationDrawerItem {
  label: string;
  value: string;
}

export interface ComplicationDrawerProps {
  items: ComplicationDrawerItem[];
  className?: string;
}

/**
 * A collapsible "how this page is built" drawer: a toggle button expands a
 * panel of label/value rows (framework, runtime, build metadata, ...) in
 * mono type.
 */
export function ComplicationDrawer({ items, className }: ComplicationDrawerProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <div className={cn(className)}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="label text-fg-2 transition-colors hover:text-fg"
      >
        How this page is built
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <m.div
            id={panelId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: dur.slow, ease: ease.outExpo }}
            className="overflow-hidden"
          >
            <dl className="space-y-1 py-3">
              {items.map((item) => (
                <div key={item.label} className="flex items-baseline justify-between gap-4">
                  <dt className="font-mono text-[12px] text-fg-3">{item.label}</dt>
                  <dd className="font-mono text-[12px] text-fg-2">{item.value}</dd>
                </div>
              ))}
            </dl>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
