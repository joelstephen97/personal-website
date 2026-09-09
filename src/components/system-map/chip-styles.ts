// Shared chip styling for `MapChips` (client, interactive) and
// `StaticMapChips` (server, the Suspense fallback) — kept in one file with
// no "use client" directive so a server component can pull in the class
// strings without also pulling in `MapChips`'s client boundary.

// Deliberately not the `label` utility: its uppercase text-transform can
// alter the computed accessible name, and domain labels ("Real-Time",
// "Computer Vision") read better in sentence case at chip size anyway.
export const chipBase = "rounded-full border px-3 py-1.5 font-sans text-[12.5px]";
export const chipOn = "border-champagne bg-champagne-soft text-fg";
export const chipOff = "border-line text-fg-2";
