import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { TextLink } from "@/components/ui/TextLink";
import { Faq } from "@/components/consulting/Faq";
import { Cta } from "@/components/consulting/Cta";
import { SERVICE_FAQ_IDS } from "@/content/consulting-faq";
import { JsonLd } from "@/components/seo/JsonLd";
import { pageMetadata, jsonLdGraph } from "@/lib/seo";
import { getProject, getServices } from "@/lib/content";

export function generateStaticParams() {
  return getServices()
    .filter((s) => s.slug !== null)
    .map((s) => ({ service: s.slug as string }));
}

function findService(slug: string) {
  return getServices().find((s) => s.slug === slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ service: string }>;
}): Promise<Metadata> {
  const { service: slug } = await params;
  const service = findService(slug);
  if (!service) return {};
  return pageMetadata({
    title: service.title,
    description: service.answer,
    path: `/consulting/${slug}`,
  });
}

export default async function ServicePage({ params }: { params: Promise<{ service: string }> }) {
  const { service: slug } = await params;
  const service = findService(slug);
  if (!service) return notFound();

  // The roadmapping session is the only service whose `pricingRule` has
  // ever carried "Unpriced" (see `src/content/services.ts`) — this stays
  // as a defensive guard so that word can never render here even if
  // content drifts, per the resolution.
  const pricingRule = service.pricingRule.includes("Unpriced") ? "Fixed fee." : service.pricingRule;

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <JsonLd data={jsonLdGraph({ path: `/consulting/${slug}`, kind: "service", service })} />

      <SectionHeader
        as="h1"
        eyebrow={`Consulting · step ${service.step}`}
        title={service.title}
        id="service-heading"
      />

      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-fg-2">{service.answer}</p>

      <section className="mt-10" aria-labelledby="situation-heading">
        <p id="situation-heading" className="label text-fg-3">
          The situation
        </p>
        <p className="mt-3 text-sm leading-relaxed text-fg-2">{service.problem}</p>
      </section>

      <section className="mt-8" aria-labelledby="what-heading">
        <p id="what-heading" className="label text-fg-3">
          What you get
        </p>
        <p className="mt-3 text-sm leading-relaxed text-fg-2">{service.what}</p>
      </section>

      <section className="mt-10 border-y border-line py-8" aria-labelledby="scope-heading">
        <p id="scope-heading" className="label text-fg-3">
          Scope
        </p>
        <p className="mt-2 text-sm leading-relaxed text-fg-2">{service.scope}</p>
        <p className="mt-1 text-sm leading-relaxed text-fg-2">{pricingRule}</p>
      </section>

      {service.provenIn.length > 0 && (
        <section className="mt-10" aria-labelledby="proven-heading">
          <p id="proven-heading" className="label text-fg-3">
            Proven in
          </p>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            {service.provenIn.map((projectSlug) => {
              const project = getProject(projectSlug);
              if (!project) return null;
              return (
                <Card key={projectSlug} className="p-4">
                  <TextLink href={`/work/${projectSlug}`}>{project.title}</TextLink>
                  <p className="mt-1 text-xs leading-relaxed text-fg-3">{project.tagline}</p>
                </Card>
              );
            })}
          </div>
        </section>
      )}

      <Faq ids={SERVICE_FAQ_IDS} />

      <Cta location={`consulting-${slug}`} />
    </div>
  );
}
