import type { Metadata } from "next";
import { Suspense } from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { TextLink } from "@/components/ui/TextLink";
import { FeaturedWork } from "@/components/home/FeaturedWork";
import { WorkCard } from "@/components/home/WorkCard";
import { SystemMap } from "@/components/system-map/SystemMap";
import { StaticMap, StaticMapChips } from "@/components/system-map/StaticMap";
import { MapChips } from "@/components/system-map/MapChips";
import { JsonLd } from "@/components/seo/JsonLd";
import { pageMetadata, jsonLdGraph } from "@/lib/seo";
import { deriveEdges, getArchive, getDomains, getFeaturedProjects } from "@/lib/content";

export const metadata: Metadata = pageMetadata({
  title: "Work",
  description:
    "Case studies and shipped products: a real-time collaborative canvas, a node-graph workflow editor, on-device scam detection, and full-stack platforms.",
  path: "/work",
});

/**
 * The map doubles as the filter here (same `?domain=` URL state, same
 * `useDomainFilter` hook, as the home hero) — a compact, non-choreographed
 * `SystemMap` sits beside the page header and `FeaturedWork` below reacts
 * to it, exactly like the home page's Hero + FeaturedWork pairing.
 */
export default function WorkPage() {
  const featured = getFeaturedProjects();
  const archive = getArchive();
  const domains = getDomains();
  const edges = deriveEdges();
  const domainSummaries = domains.map(({ id, label }) => ({ id, label }));
  const projectsBySlug = Object.fromEntries(
    featured.map((p) => [p.slug, { slug: p.slug, title: p.title }]),
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <JsonLd data={jsonLdGraph({ path: "/work", kind: "work" })} />

      <div className="lg:grid lg:grid-cols-[1fr_auto] lg:items-end lg:gap-10">
        <SectionHeader
          as="h1"
          eyebrow="Work"
          title="Five things I am proud of, in the order I would explain them."
        />

        <div className="mt-10 lg:mt-0 lg:shrink-0">
          <div className="hidden min-[480px]:block">
            <Suspense
              fallback={
                <StaticMap domains={domains} edges={edges} className="mx-auto max-w-[320px]" />
              }
            >
              <SystemMap
                domains={domains}
                edges={edges}
                projectsBySlug={projectsBySlug}
                variant="compact"
                className="mx-auto max-w-[320px]"
              />
            </Suspense>
          </div>
          <div className="min-[480px]:hidden">
            <Suspense fallback={<StaticMapChips domains={domains} />}>
              <MapChips domains={domains} />
            </Suspense>
          </div>
        </div>
      </div>

      <section className="mt-14">
        <Suspense
          fallback={
            <ul className="mt-10 grid gap-6">
              {featured.map((project, index) => (
                <li key={project.slug}>
                  <WorkCard project={project} flagship={index === 0} index={index} />
                </li>
              ))}
            </ul>
          }
        >
          <FeaturedWork projects={featured} domains={domainSummaries} hideHeader />
        </Suspense>
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
