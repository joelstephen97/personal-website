import type { ComponentProps } from "react";
import { DateWindow } from "@/components/movement/DateWindow";
import { Callout } from "@/components/ui/Callout";
import { Tag } from "@/components/ui/Tag";
import { cn } from "@/lib/cn";

export interface Heading {
  id: string;
  text: string;
  level: number;
}

// h3 fluid size from the type scale (Task 2 has not yet promoted this to a
// theme token, so it is inlined verbatim here, matching SectionHeader.tsx).
const H2_SIZE = "text-[clamp(1.375rem,1.2rem+.6vw,1.875rem)] leading-[1.1]";

function numeral(position: number): string {
  return String(position).padStart(2, "0");
}

/**
 * Builds the component map handed to `useMDXComponent`. `h2` numbers itself
 * against the document's own H2 order (matching the `headings` list the
 * `work`/`writing` collections extract at build time) with a `DateWindow`
 * numeral, then renders the heading text in the display face.
 */
export function createMdxComponents(headings: Heading[]) {
  let position = 0;
  const level2 = headings.filter((h) => h.level === 2);

  return {
    h2: ({ children, ...rest }: ComponentProps<"h2">) => {
      const heading = level2[position];
      position += 1;
      return (
        <h2
          id={heading?.id}
          className="mt-12 mb-4 flex items-baseline gap-4 scroll-mt-24 first:mt-0"
          {...rest}
        >
          <DateWindow value={numeral(position)} size="sm" />
          <span className={cn("font-display text-fg", H2_SIZE)}>{children}</span>
        </h2>
      );
    },
    p: ({ children, ...rest }: ComponentProps<"p">) => (
      <p className="mb-4 text-base leading-relaxed text-fg-2" {...rest}>
        {children}
      </p>
    ),
    ul: ({ children, ...rest }: ComponentProps<"ul">) => (
      <ul className="mb-4 list-disc space-y-2 pl-5 text-fg-2" {...rest}>
        {children}
      </ul>
    ),
    li: ({ children, ...rest }: ComponentProps<"li">) => (
      <li className="text-base leading-relaxed" {...rest}>
        {children}
      </li>
    ),
    strong: ({ children, ...rest }: ComponentProps<"strong">) => (
      <strong className="font-semibold text-fg" {...rest}>
        {children}
      </strong>
    ),
    a: ({ children, ...rest }: ComponentProps<"a">) => (
      <a className="link-draw text-link" {...rest}>
        {children}
      </a>
    ),
    Callout,
    Tag,
  };
}
