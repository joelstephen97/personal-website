import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { allWorks } from "content-collections";
import { DateWindow } from "@/components/movement/DateWindow";
import { MdxContent } from "@/components/mdx/MdxContent";
import { Tag } from "@/components/ui/Tag";
import { TextLink } from "@/components/ui/TextLink";
import { TrackedLink } from "@/components/shell/TrackedLink";
import { JsonLd } from "@/components/seo/JsonLd";
import { ScamShieldExtras } from "@/components/work/ScamShieldExtras";
import { pageMetadata, jsonLdGraph } from "@/lib/seo";
import { getDomain, getFeaturedProjects, getProject } from "@/lib/content";

export function generateStaticParams() {
  return getFeaturedProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return pageMetadata({
    title: project.title,
    description: project.tagline,
    path: `/work/${slug}`,
    type: "article",
  });
}

export default async function WorkDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project || !project.featured) return notFound();

  const doc = allWorks.find((w) => w.slug === slug);
  const featured = getFeaturedProjects();
  const index = featured.findIndex((p) => p.slug === slug);
  const prev = index > 0 ? featured[index - 1] : undefined;
  const next = index >= 0 && index < featured.length - 1 ? featured[index + 1] : undefined;

  return (
    <article className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <JsonLd data={jsonLdGraph({ path: `/work/${slug}`, kind: "case", project })} />

      <header className="border-b border-line pb-10">
        <div className="flex items-center gap-4">
          <DateWindow value={String(project.order).padStart(2, "0")} label="Order" size="sm" />
          <p className="label text-fg-3">
            {project.company ?? "Independent"} · {project.dates.start} –{" "}
            {project.dates.end ?? "present"}
          </p>
        </div>
        <h1 className="mt-5 font-display text-[clamp(2.25rem,1.5rem+2.8vw,3.5rem)] leading-[1.02]">
          {project.title}
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-fg-2">{project.tagline}</p>
      </header>

      <div className="grid gap-8 border-b border-line py-10 sm:grid-cols-3">
        <div>
          <p className="label text-fg-3">Role</p>
          <p className="mt-2 text-sm text-fg-2">{project.role}</p>
        </div>
        <div>
          <p className="label text-fg-3">Domains</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {project.domains.map((id) => {
              const domain = getDomain(id);
              return domain ? <Tag key={id}>{domain.label}</Tag> : null;
            })}
          </div>
        </div>
        <div>
          <p className="label text-fg-3">Stack</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <Tag key={tech}>{tech}</Tag>
            ))}
          </div>
        </div>
      </div>

      {(project.links.github || project.links.chromeStore || project.links.live) && (
        <div className="flex flex-wrap gap-4 border-b border-line py-6">
          {project.links.chromeStore && (
            <TrackedLink
              href={project.links.chromeStore}
              external
              event="extension_install_click"
              eventProps={{ location: "work-detail" }}
              className="link-draw text-sm text-link"
            >
              Install
            </TrackedLink>
          )}
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
      )}

      {project.screenshots.length > 0 && (
        <div className="grid gap-4 py-10 sm:grid-cols-2">
          {project.screenshots.map((shot) => (
            <figure key={shot.src} className="overflow-hidden rounded-4 border border-line">
              <Image
                src={shot.src}
                alt={shot.alt}
                width={1280}
                height={800}
                className="h-auto w-full"
              />
              {shot.caption && (
                <figcaption className="p-3 text-sm text-fg-3">{shot.caption}</figcaption>
              )}
            </figure>
          ))}
        </div>
      )}

      {doc && (
        <div className="py-10">
          <MdxContent code={doc.code} headings={doc.headings} />
        </div>
      )}

      {project.slug === "scamshield" && <ScamShieldExtras />}

      {(prev || next) && (
        <nav
          className="flex items-center justify-between border-t border-line pt-8"
          aria-label="Case study navigation"
        >
          {prev ? <TextLink href={`/work/${prev.slug}`}>← {prev.title}</TextLink> : <span />}
          {next ? <TextLink href={`/work/${next.slug}`}>{next.title} →</TextLink> : <span />}
        </nav>
      )}
    </article>
  );
}
