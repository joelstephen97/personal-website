import { SectionHeader } from "@/components/ui/SectionHeader";
import { Tag } from "@/components/ui/Tag";
import { TextLink } from "@/components/ui/TextLink";
import { getArchive, getDomains, getFeaturedProjects } from "@/lib/content";

/**
 * The text twin of the System Map: the same six domains, each with its
 * blurb, technologies, and links to the work that proves it. The jewel dot
 * uses `border-line-2` rather than a champagne stroke — the 1px ring reads
 * fine without spending champagne budget on six repeated dots.
 */
export function Domains() {
  const domains = getDomains();
  const projects = [...getFeaturedProjects(), ...getArchive()];
  const projectBySlug = new Map(projects.map((p) => [p.slug, p]));

  return (
    <div>
      <SectionHeader eyebrow="What I build" title="Six domains, each proven in shipped work." />
      <div className="mt-8 grid gap-x-10 sm:grid-cols-2">
        {domains.map((domain) => {
          const provenIn = domain.work
            .map((slug) => projectBySlug.get(slug))
            .filter((p): p is NonNullable<typeof p> => Boolean(p));

          return (
            <div
              key={domain.id}
              className="grid grid-cols-[22px_1fr] gap-3 border-b border-line py-6"
            >
              <span
                aria-hidden="true"
                className="mt-2 size-2.5 rounded-full border border-line-2 bg-accent"
              />
              <div>
                <h3 className="font-sans text-base font-semibold text-fg">{domain.label}</h3>
                <p className="mt-1 max-w-[52ch] text-sm leading-relaxed text-fg-2">
                  {domain.blurb}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {domain.tech.map((tech) => (
                    <Tag key={tech}>{tech}</Tag>
                  ))}
                </div>
                {provenIn.length > 0 && (
                  <p className="mt-3 font-mono text-[11px] text-fg-3">
                    proven in{" "}
                    {provenIn.map((p, i) => (
                      <span key={p.slug}>
                        {i > 0 && " · "}
                        <TextLink href={`/work/${p.slug}`} className="text-fg-2">
                          {p.title}
                        </TextLink>
                      </span>
                    ))}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
