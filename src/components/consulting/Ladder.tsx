import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { TextLink } from "@/components/ui/TextLink";
import { getProject } from "@/lib/content";
import type { Service } from "@/content/schema";

export interface LadderProps {
  /** The six services that have a `slug` — each card links to its page. */
  services: Service[];
  /**
   * The two services with no `slug` and no other section on this page
   * (implementation support, the workshop) — no page exists for these, so
   * they render as plain rows instead of cards. The roadmapping session is
   * deliberately excluded from this list by the caller: it already has its
   * own full "Start here" section above, with a description, scope, and
   * its own CTA, so repeating it here would read as an alternate path to
   * the same offer.
   */
  alsoAvailable: Service[];
}

/**
 * "Sprints and audits" — the six services with a `slug` as cards (title
 * links to `/consulting/<slug>`, so "proven in" project links stay
 * sibling anchors rather than nesting inside the title's `<a>`), plus a
 * compact "Also available" list for the two remaining slug-less services.
 */
export function Ladder({ services, alsoAvailable }: LadderProps) {
  return (
    <section className="mt-16 border-t border-line pt-10" aria-labelledby="ladder-heading">
      <SectionHeader
        as="h2"
        tone="muted"
        eyebrow="Sprints and audits"
        title="Fixed scope, fixed fee, proven in shipped work."
        id="ladder-heading"
      />
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {services.map((service) => (
          <Card key={service.id} as="article" className="p-5">
            <h3 className="font-display text-lg text-fg">
              <TextLink href={`/consulting/${service.slug}`}>{service.title}</TextLink>
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-fg-2">{service.what}</p>
            <p className="mt-3 text-sm text-fg-3">{service.scope}</p>
            {service.provenIn.length > 0 && (
              <p className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs">
                <span className="text-fg-3">Proven in</span>
                {service.provenIn.map((slug) => {
                  const project = getProject(slug);
                  return project ? (
                    <TextLink key={slug} href={`/work/${slug}`}>
                      {project.title}
                    </TextLink>
                  ) : null;
                })}
              </p>
            )}
          </Card>
        ))}
      </div>

      {alsoAvailable.length > 0 && (
        <div className="mt-10 divide-y divide-line border-t border-line">
          <p className="label pt-4 text-fg-3">Also available</p>
          {alsoAvailable.map((service) => (
            <div
              key={service.id}
              className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-3"
            >
              <p className="text-sm text-fg">{service.title}</p>
              <p className="font-mono text-[11px] text-fg-3">{service.scope}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
