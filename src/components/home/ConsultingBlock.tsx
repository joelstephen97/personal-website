import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { TrackedLink } from "@/components/shell/TrackedLink";
import { getServices } from "@/lib/content";
import { site } from "@/lib/site";

/**
 * The champagne-line bordered consulting card. Shows the first six
 * services from `getServices()` (roadmapping session through the
 * prototype/reliability-audit tier) as a title + scope ladder — never
 * `pricingRule`, which is where "Unpriced" and fee language live.
 */
export function ConsultingBlock() {
  const services = getServices().slice(0, 6);

  return (
    <div className="rounded-[var(--radius-4)] border border-champagne-line bg-raised px-6 py-10 sm:px-9 lg:grid lg:grid-cols-[1.1fr_1fr] lg:gap-10 lg:px-11">
      <div>
        <SectionHeader eyebrow="Consulting" title="Consulting" />
        <h3 className="mt-3 font-display text-[clamp(1.75rem,1.4rem+1.2vw,2.5rem)] leading-[1.1]">
          You shipped an AI feature. Now it has to work in production.
        </h3>
        <p className="mt-4 max-w-[52ch] text-base leading-relaxed text-fg-2">
          A small number of fixed-fee engagements alongside my role at AppliedAI: AI integration,
          workflow systems, real-time collaboration. Start with a 90-minute roadmapping session and
          a written plan.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <TrackedLink
            href={`mailto:${site.email}?subject=Roadmapping%20session`}
            event="consulting_cta_click"
            eventProps={{ location: "home" }}
            className="inline-flex h-12 items-center gap-2 rounded-[var(--radius-3)] bg-accent px-5 text-base font-medium text-on-accent transition-colors hover:bg-accent-hover"
          >
            Book a roadmapping session
          </TrackedLink>
          <Button href="/consulting" variant="ghost" size="lg">
            All offers →
          </Button>
        </div>
      </div>
      <div className="mt-8 divide-y divide-line lg:mt-0 lg:self-center">
        {services.map((service) => (
          <div key={service.id} className="py-2.5">
            <p className="text-sm text-fg">{service.title}</p>
            <p className="mt-1 font-mono text-[11px] text-fg-3">{service.scope}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
