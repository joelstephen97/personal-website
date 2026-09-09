import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { TrackedLink } from "@/components/shell/TrackedLink";
import { site } from "@/lib/site";
import type { Service } from "@/content/schema";

export interface RoadmappingProps {
  service: Service;
}

/**
 * "Start here" — the entry offer, given its own full-width card and the
 * page's single champagne `SectionHeader` (default `tone="champagne"`).
 * Pricing renders as the literal string "Fixed fee." rather than
 * `service.pricingRule`, per the resolution that "Unpriced" must never
 * render for this offer.
 */
export function Roadmapping({ service }: RoadmappingProps) {
  return (
    <section className="mt-16 border-t border-line pt-10" aria-labelledby="start-here-heading">
      <SectionHeader eyebrow="Start here" title={service.title} id="start-here-heading" />
      <Card className="mt-6 p-6">
        <p className="text-base leading-relaxed text-fg-2">{service.answer}</p>
        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-fg-3">
          <span>{service.scope}</span>
          <span>Fixed fee.</span>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <TrackedLink
            href={`mailto:${site.email}?subject=Roadmapping%20session`}
            event="consulting_cta_click"
            eventProps={{ location: "consulting-start-here" }}
            className="inline-flex h-10 items-center rounded-3 bg-accent px-4 text-sm font-medium text-on-accent transition-colors hover:bg-accent-hover"
          >
            Book a roadmapping session
          </TrackedLink>
        </div>
      </Card>
    </section>
  );
}
