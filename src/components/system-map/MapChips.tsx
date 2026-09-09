"use client";

import type { Domain } from "@/content/schema";
import { cn } from "@/lib/cn";
import { useDomainFilter } from "./useDomainFilter";

export interface MapChipsProps {
  domains: Domain[];
  className?: string;
}

// Deliberately not the `label` utility: its uppercase text-transform can
// alter the computed accessible name, and domain labels ("Real-Time",
// "Computer Vision") read better in sentence case at chip size anyway.
const chipBase = "rounded-full border px-3 py-1.5 font-sans text-[12.5px]";
const chipOn = "border-champagne bg-champagne-soft text-fg";
const chipOff = "border-line text-fg-2";

/**
 * <480px fallback for the System Map: a horizontal row of filter chips
 * backed by the same `useDomainFilter` URL state, so map and chips always
 * agree on the current selection.
 */
export function MapChips({ domains, className }: MapChipsProps) {
  const { selected, select, toggle } = useDomainFilter();

  return (
    <div
      role="group"
      aria-label="Filter work by domain"
      className={cn("flex flex-wrap gap-2", className)}
    >
      <button
        type="button"
        aria-pressed={selected === null}
        onClick={() => select(null)}
        className={cn(chipBase, selected === null ? chipOn : chipOff)}
      >
        All
      </button>
      {domains.map((domain) => {
        const pressed = selected === domain.id;
        return (
          <button
            key={domain.id}
            type="button"
            aria-pressed={pressed}
            onClick={() => toggle(domain.id)}
            className={cn(chipBase, pressed ? chipOn : chipOff)}
          >
            {domain.label}
          </button>
        );
      })}
    </div>
  );
}
