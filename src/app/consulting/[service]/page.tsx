import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Tag } from "@/components/ui/Tag";
import { TextLink } from "@/components/ui/TextLink";
import { Button } from "@/components/ui/Button";
import { TrackedLink } from "@/components/shell/TrackedLink";
import { JsonLd } from "@/components/seo/JsonLd";
import { pageMetadata, jsonLdGraph } from "@/lib/seo";
import { getDomain, getProject, getServices } from "@/lib/content";
import { site } from "@/lib/site";

const FAQ = [
  {
    question: "Does this work with the model provider we already use?",
    answer:
      "Yes. The work is built around multiple LLM providers rather than one, so the pipeline stays portable if a provider or model changes later.",
  },
  {
    question: "What if we're not sure AI is the right answer yet?",
    answer:
      "That's what the roadmapping session is for. It maps the candidate workflows and says plainly if none of them earn their cost yet, before any build starts.",
  },
  {
    question: "Can you sign an NDA?",
    answer: "Yes — standard practice for any engagement that touches a codebase or customer data.",
  },
  {
    question: "How does this fit around your full-time role?",
    answer:
      "Consulting engagements run alongside a full-time role at AppliedAI, scoped and scheduled on agreed hours so they don't compete with it.",
  },
];

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
    description: service.problem,
    path: `/consulting/${slug}`,
  });
}

export default async function ServicePage({ params }: { params: Promise<{ service: string }> }) {
  const { service: slug } = await params;
  const service = findService(slug);
  if (!service) return notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <JsonLd data={jsonLdGraph({ path: `/consulting/${slug}`, kind: "service", service })} />

      <p className="label text-champagne">Consulting</p>
      <h1 className="mt-3 font-display text-[clamp(2.25rem,1.5rem+2.8vw,3.5rem)] leading-[1.02]">
        {service.title}
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-fg-2">
        {service.problem} {service.what}
      </p>

      <div className="mt-10 grid gap-8 border-y border-line py-8 sm:grid-cols-2">
        <div>
          <p className="label text-fg-3">Scope</p>
          <p className="mt-2 text-sm leading-relaxed text-fg-2">{service.scope}</p>
        </div>
        <div>
          <p className="label text-fg-3">Pricing</p>
          <p className="mt-2 text-sm leading-relaxed text-fg-2">{service.pricingRule}</p>
        </div>
      </div>

      {service.technologies.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          {service.technologies.map((tech) => (
            <Tag key={tech}>{tech}</Tag>
          ))}
        </div>
      )}

      {service.domains.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {service.domains.map((id) => {
            const domain = getDomain(id);
            return domain ? (
              <Tag key={id} tone="champagne">
                {domain.label}
              </Tag>
            ) : null;
          })}
        </div>
      )}

      {service.provenIn.length > 0 && (
        <section className="mt-12" aria-labelledby="proven-heading">
          <p id="proven-heading" className="label text-fg-3">
            Proven in
          </p>
          <div className="mt-3 flex flex-wrap gap-4">
            {service.provenIn.map((projectSlug) => {
              const project = getProject(projectSlug);
              return project ? (
                <TextLink key={projectSlug} href={`/work/${projectSlug}`}>
                  {project.title}
                </TextLink>
              ) : null;
            })}
          </div>
        </section>
      )}

      <section className="mt-16 border-t border-line pt-10" aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="font-display text-2xl text-fg">
          Questions
        </h2>
        <div className="mt-6 space-y-6">
          {FAQ.map((item) => (
            <div key={item.question}>
              <h3 className="text-base font-medium text-fg">{item.question}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-fg-2">{item.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 border-t border-line pt-10">
        <div className="flex flex-wrap gap-3">
          <TrackedLink
            href={`mailto:${site.email}?subject=Roadmapping%20session`}
            event="consulting_cta_click"
            eventProps={{ location: `consulting-${slug}` }}
            className="inline-flex h-12 items-center rounded-3 bg-accent px-5 text-base font-medium text-on-accent transition-colors hover:bg-accent-hover"
          >
            Book a roadmapping session
          </TrackedLink>
          <Button href={`mailto:${site.email}`} external variant="secondary" size="lg">
            Or write to me
          </Button>
        </div>
      </section>
    </div>
  );
}
