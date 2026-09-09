import type { Metadata } from "next";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { TextLink } from "@/components/ui/TextLink";
import { Button } from "@/components/ui/Button";
import { TrackedLink } from "@/components/shell/TrackedLink";
import { JsonLd } from "@/components/seo/JsonLd";
import { pageMetadata, jsonLdGraph } from "@/lib/seo";
import { getServices } from "@/lib/content";
import { consultingCopy } from "@/content/consulting-copy";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Consulting",
  description: consultingCopy.hero,
  path: "/consulting",
});

export default function ConsultingPage() {
  const services = getServices();
  const roadmapping = services.find((s) => s.id === "roadmapping-session")!;
  const engagements = services.filter((s) => s.slug !== null);

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <JsonLd data={jsonLdGraph({ path: "/consulting", kind: "consulting" })} />

      <h1 className="font-display text-[clamp(2.25rem,1.5rem+2.8vw,3.5rem)] leading-[1.02]">
        {consultingCopy.hero}
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-fg-2">{consultingCopy.subLine}</p>

      <div className="mt-12 grid gap-8 sm:grid-cols-2">
        <div>
          <p className="label text-fg-3">Who this is for</p>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            {consultingCopy.whoFor.map((line) => (
              <li key={line} className="text-sm leading-relaxed text-fg-2">
                {line}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="label text-fg-3">Who this is not for</p>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            {consultingCopy.whoNotFor.map((line) => (
              <li key={line} className="text-sm leading-relaxed text-fg-2">
                {line}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <section className="mt-16 border-t border-line pt-10" aria-labelledby="start-here-heading">
        <SectionHeader eyebrow="Start here" title={roadmapping.title} id="start-here-heading" />
        <Card className="mt-6 p-6">
          <p className="text-sm leading-relaxed text-fg-2">{roadmapping.problem}</p>
          <p className="mt-3 text-sm leading-relaxed text-fg-2">{roadmapping.what}</p>
          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-fg-3">
            <span>{roadmapping.scope}</span>
            <span>Fixed fee.</span>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <TrackedLink
              href={`mailto:${site.email}?subject=Roadmapping%20session`}
              event="consulting_cta_click"
              eventProps={{ location: "consulting-start-here" }}
              className="inline-flex h-10 items-center rounded-3 bg-accent px-4 text-sm font-medium text-on-accent transition-colors hover:bg-accent-hover"
            >
              {consultingCopy.ctaLabel}
            </TrackedLink>
          </div>
        </Card>
      </section>

      <section className="mt-16 border-t border-line pt-10" aria-labelledby="engagements-heading">
        <SectionHeader eyebrow="Engagements" title="Sprints and audits" id="engagements-heading" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {engagements.map((service) => (
            <TextLink
              key={service.id}
              href={`/consulting/${service.slug}`}
              className="no-underline"
            >
              <Card interactive className="h-full p-5">
                <h3 className="font-display text-lg text-fg">{service.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-fg-2">{service.problem}</p>
                <p className="mt-3 text-sm text-fg-3">{service.scope}</p>
              </Card>
            </TextLink>
          ))}
        </div>
      </section>

      <section className="mt-16 border-t border-line pt-10" aria-labelledby="proof-heading">
        <SectionHeader eyebrow="Proof" title="Proven in production" id="proof-heading" />
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-fg-2">{consultingCopy.proof}</p>
        <div className="mt-4 flex flex-wrap gap-4">
          <TextLink href="/work/process-discovery">Process Discovery</TextLink>
          <TextLink href="/work/scamshield">ScamShield</TextLink>
        </div>
      </section>

      <section className="mt-16 border-t border-line pt-10">
        <div className="flex flex-wrap gap-3">
          <TrackedLink
            href={`mailto:${site.email}?subject=Roadmapping%20session`}
            event="consulting_cta_click"
            eventProps={{ location: "consulting-footer" }}
            className="inline-flex h-12 items-center rounded-3 bg-accent px-5 text-base font-medium text-on-accent transition-colors hover:bg-accent-hover"
          >
            {consultingCopy.ctaLabel}
          </TrackedLink>
          <Button href={`mailto:${site.email}`} external variant="secondary" size="lg">
            {consultingCopy.ctaSecondaryLabel}
          </Button>
        </div>
      </section>
    </div>
  );
}
