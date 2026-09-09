import type { Metadata } from "next";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { TextLink } from "@/components/ui/TextLink";
import { TransitionLink } from "@/components/shell/TransitionLink";
import { JsonLd } from "@/components/seo/JsonLd";
import { pageMetadata, jsonLdGraph } from "@/lib/seo";
import { getArchive, getDomains, getFeaturedProjects } from "@/lib/content";

export const metadata: Metadata = pageMetadata({
  title: "Work",
  description:
    "Case studies and shipped products: a real-time collaborative canvas, a node-graph workflow editor, on-device scam detection, and full-stack platforms.",
  path: "/work",
});

export default function WorkPage() {
  const featured = getFeaturedProjects();
  const archive = getArchive();
  const domains = getDomains();

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <JsonLd data={jsonLdGraph({ path: "/work", kind: "work" })} />

      <h1 className="font-display text-[clamp(2.25rem,1.5rem+2.8vw,3.5rem)] leading-[1.02]">
        Work
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-fg-2">
        Case studies from production systems, plus shipped products built solo.
      </p>

      <div className="mt-8 flex flex-wrap gap-2">
        {domains.map((domain) => (
          <Tag key={domain.id}>{domain.label}</Tag>
        ))}
      </div>

      <section className="mt-14" aria-labelledby="featured-heading">
        <SectionHeader eyebrow="Featured" title="Case studies" id="featured-heading" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {featured.map((project) => (
            <TransitionLink key={project.slug} href={`/work/${project.slug}`} className="group">
              <Card interactive className="flex h-full flex-col justify-between p-5">
                <div>
                  <span className="label text-fg-3">{project.company ?? "Independent"}</span>
                  <h3 className="mt-2 font-display text-xl text-fg">{project.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-fg-2">{project.tagline}</p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.technologies.slice(0, 4).map((tech) => (
                    <Tag key={tech}>{tech}</Tag>
                  ))}
                </div>
              </Card>
            </TransitionLink>
          ))}
        </div>
      </section>

      <section className="mt-16" aria-labelledby="archive-heading">
        <SectionHeader eyebrow="Archive" title="Everything else" id="archive-heading" />
        <ul className="mt-8 divide-y divide-line">
          {archive.map((project) => (
            <li
              key={project.slug}
              className="flex flex-wrap items-baseline justify-between gap-2 py-4"
            >
              <div>
                <p className="text-fg">{project.title}</p>
                <p className="text-sm text-fg-2">{project.tagline}</p>
                <p className="mt-1 text-sm text-fg-3">{project.results[0]}</p>
              </div>
              <div className="flex items-center gap-3">
                {project.links.github && (
                  <TextLink href={project.links.github} external className="text-sm">
                    GitHub
                  </TextLink>
                )}
                {project.links.live && (
                  <TextLink href={project.links.live} external className="text-sm">
                    Live
                  </TextLink>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
