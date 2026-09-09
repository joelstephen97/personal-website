import { cn } from "@/lib/cn";

export interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  lead?: string;
  id?: string;
  number?: string;
  className?: string;
  /** Page-level headers (one per route) pass `as="h1"` — see /work. Default h2. */
  as?: "h1" | "h2";
}

// h1/h2 fluid sizes from the type scale (Task 2 has not yet promoted these
// to theme tokens, so they're inlined verbatim here — h1 matches the raw
// <h1> markup every other page uses, e.g. src/app/consulting/page.tsx).
const H1_SIZE = "text-[clamp(2.25rem,1.5rem+2.8vw,3.5rem)] leading-[1.02]";
const H2_SIZE = "text-[clamp(1.875rem,1.4rem+1.6vw,2.625rem)] leading-[1.08]";

export function SectionHeader({
  eyebrow,
  title,
  lead,
  id,
  number,
  className,
  as = "h2",
}: SectionHeaderProps) {
  const Heading = as;
  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center gap-3">
        <span className="label text-champagne">{eyebrow}</span>
        <span aria-hidden="true" className="h-px w-10 bg-champagne-line" />
        {number && <span className="font-mono text-[11px] text-fg-3">{number}</span>}
      </div>
      <Heading id={id} className={cn("font-display", as === "h1" ? H1_SIZE : H2_SIZE)}>
        {title}
      </Heading>
      {lead && <p className="text-base leading-relaxed text-fg-2">{lead}</p>}
    </div>
  );
}
