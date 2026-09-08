import { cn } from "@/lib/cn";

export interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  lead?: string;
  id?: string;
  number?: string;
  className?: string;
}

// h2 fluid size from the type scale (Task 2 has not yet promoted this to a
// theme token, so it is inlined verbatim here).
const H2_SIZE = "text-[clamp(1.875rem,1.4rem+1.6vw,2.625rem)] leading-[1.08]";

export function SectionHeader({ eyebrow, title, lead, id, number, className }: SectionHeaderProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center gap-3">
        <span className="label text-champagne">{eyebrow}</span>
        <span aria-hidden="true" className="h-px w-10 bg-champagne-line" />
        {number && <span className="font-mono text-[11px] text-fg-3">{number}</span>}
      </div>
      <h2 id={id} className={cn("font-display", H2_SIZE)}>
        {title}
      </h2>
      {lead && <p className="text-base leading-relaxed text-fg-2">{lead}</p>}
    </div>
  );
}
