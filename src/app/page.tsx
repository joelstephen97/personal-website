import type { Metadata } from "next";
import { Guilloche } from "@/components/movement/Guilloche";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { Button } from "@/components/ui/Button";
import { TextLink } from "@/components/ui/TextLink";
import { TransitionLink } from "@/components/shell/TransitionLink";
import { TrackedButton, TrackedLink } from "@/components/shell/TrackedLink";
import { CopyEmail } from "@/components/shell/CopyEmail";
import { JsonLd } from "@/components/seo/JsonLd";
import { pageMetadata, jsonLdGraph } from "@/lib/seo";
import { profile } from "@/content/profile";
import { getDomains, getFeaturedProjects, getExperience, getNow } from "@/lib/content";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: `${site.name} — ${site.title}, Abu Dhabi`,
  description: profile.proof,
  path: "/",
});

export default function Home() {
  const domains = getDomains();
  const featured = getFeaturedProjects();
  const [heroFeature, ...restFeatured] = featured;
  const experience = getExperience();
  const now = getNow();

  return (
    <>
      <JsonLd data={jsonLdGraph({ path: "/", kind: "home" })} />

      {/* Hero: fully server-rendered and legible with no JS — the Guilloche
          canvas behind it is purely decorative and paints only on the client. */}
      <section className="relative overflow-hidden border-b border-line">
        <Guilloche className="absolute inset-0" />
        <div className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32">
          <p className="label text-champagne">{profile.status}</p>
          <h1 className="mt-5 max-w-3xl font-display text-[clamp(2.75rem,1.6rem+4.4vw,5.25rem)] leading-[1.0]">
            Building AI systems and the interfaces <em>people run them from.</em>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-fg-2">{profile.proof}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <TrackedButton
              href="/work"
              size="lg"
              variant="primary"
              event="case_study_view"
              eventProps={{ location: "hero" }}
            >
              Selected work
            </TrackedButton>
            <TrackedButton
              href="/consulting"
              size="lg"
              variant="secondary"
              event="consulting_cta_click"
              eventProps={{ location: "hero" }}
            >
              Work with me
            </TrackedButton>
            <TrackedButton
              href="/joel-stephen-resume.pdf"
              external
              size="lg"
              variant="ghost"
              event="resume_click"
              eventProps={{ location: "hero" }}
            >
              Résumé
            </TrackedButton>
          </div>
        </div>
      </section>

      {/* Placeholder for the interactive system map (WP4) — a plain,
          server-rendered list of the six domains so nothing is invisible
          until that work lands. */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <div data-slot="system-map" className="flex flex-wrap gap-x-8 gap-y-3">
            {domains.map((domain) => (
              <div key={domain.id} className="flex items-baseline gap-2">
                <span className="label text-fg-3">{domain.label}</span>
                <span className="text-sm text-fg-2">{domain.short}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <div className="flex flex-wrap items-center gap-3">
            {profile.credibility.map((item) =>
              item.href ? (
                <TextLink key={item.label} href={item.href} external className="no-underline">
                  <Tag dot>
                    {item.label} <span className="text-fg-3">· {item.detail}</span>
                  </Tag>
                </TextLink>
              ) : (
                <Tag key={item.label} dot>
                  {item.label} <span className="text-fg-3">· {item.detail}</span>
                </Tag>
              ),
            )}
          </div>
        </div>
      </section>

      <Reveal as="section" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <SectionHeader eyebrow="Selected work" title="What's shipped" number="01" />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {heroFeature && (
            <TransitionLink
              href={`/work/${heroFeature.slug}`}
              className="group sm:col-span-2 lg:col-span-2 lg:row-span-2"
            >
              <Card interactive className="flex h-full flex-col justify-between p-6">
                <div>
                  <span className="label text-fg-3">{heroFeature.company ?? "Independent"}</span>
                  <h3 className="mt-3 font-display text-2xl text-fg">{heroFeature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-fg-2">{heroFeature.tagline}</p>
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  {heroFeature.technologies.slice(0, 4).map((tech) => (
                    <Tag key={tech}>{tech}</Tag>
                  ))}
                </div>
              </Card>
            </TransitionLink>
          )}
          {restFeatured.map((project) => (
            <TransitionLink key={project.slug} href={`/work/${project.slug}`} className="group">
              <Card interactive className="flex h-full flex-col justify-between p-5">
                <div>
                  <span className="label text-fg-3">{project.company ?? "Independent"}</span>
                  <h3 className="mt-2 font-display text-xl text-fg">{project.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-fg-2">{project.tagline}</p>
                </div>
              </Card>
            </TransitionLink>
          ))}
        </div>
      </Reveal>

      <Reveal as="section" className="border-t border-line">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <SectionHeader eyebrow="Capabilities" title="What I build" number="02" />
          <div className="mt-10 divide-y divide-line">
            {domains.map((domain) => (
              <div key={domain.id} className="grid gap-3 py-6 sm:grid-cols-[180px_1fr]">
                <h3 className="font-display text-lg text-fg">{domain.label}</h3>
                <div>
                  <p className="text-sm leading-relaxed text-fg-2">{domain.blurb}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {domain.tech.map((tech) => (
                      <Tag key={tech}>{tech}</Tag>
                    ))}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
                    {domain.work.slice(0, 3).map((slug) => {
                      const project = featured.find((p) => p.slug === slug);
                      if (!project) return null;
                      return (
                        <TextLink key={slug} href={`/work/${slug}`} className="text-sm">
                          {project.title}
                        </TextLink>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal as="section" className="border-t border-line">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <SectionHeader eyebrow="Experience" title="Five roles, one throughline" number="03" />
          <div className="mt-10 divide-y divide-line">
            {experience.map((role, index) => (
              <div key={role.id} className="py-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="text-fg">
                    <span className="font-medium">{role.role}</span>{" "}
                    <span className="text-fg-3">· {role.company}</span>
                  </p>
                  <span className="font-mono text-[12px] text-fg-3">
                    {role.dates.start} – {role.dates.end ?? "present"}
                  </span>
                </div>
                {index === 0 && (
                  <p className="mt-2 text-sm leading-relaxed text-fg-2">{role.summary}</p>
                )}
              </div>
            ))}
          </div>
          <div className="mt-6">
            <TextLink href="/experience">Full experience</TextLink>
          </div>
        </div>
      </Reveal>

      <Reveal as="section" className="border-t border-line">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <SectionHeader eyebrow="Now" title={`Updated ${now.updated}`} number="04" />
          <div className="mt-8 grid gap-8 sm:grid-cols-2">
            <div>
              <p className="label text-fg-3">Building</p>
              <ul className="mt-2 space-y-1 text-sm text-fg-2">
                {now.building.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="label text-fg-3">Exploring</p>
              <ul className="mt-2 space-y-1 text-sm text-fg-2">
                {now.exploring.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-6">
            <TextLink href="/now">More about now</TextLink>
          </div>
        </div>
      </Reveal>

      <Reveal as="section" className="border-t border-line">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <SectionHeader
            eyebrow="Consulting"
            title="Have a hard technical problem?"
            lead="A roadmapping session maps the candidate workflows, picks the one with the clearest payoff, and specifies what a first build needs."
            number="05"
          />
          <div className="mt-8 flex flex-wrap gap-3">
            <TrackedLink
              href={`mailto:${site.email}?subject=Roadmapping%20session`}
              event="consulting_cta_click"
              eventProps={{ location: "home-consulting" }}
              className="inline-flex h-12 items-center gap-2 rounded-3 bg-accent px-5 text-base font-medium text-on-accent transition-colors hover:bg-accent-hover"
            >
              Book a roadmapping session
            </TrackedLink>
            <Button href="/consulting" variant="secondary" size="lg">
              See all engagements
            </Button>
          </div>
        </div>
      </Reveal>

      <Reveal as="section" className="border-t border-line">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <SectionHeader eyebrow="Contact" title="Get in touch" number="06" />
          <div className="mt-8 flex flex-wrap items-center gap-x-10 gap-y-4">
            <CopyEmail className="font-display text-2xl text-fg" />
            <TrackedLink
              href={site.github}
              external
              event="github_click"
              className="link-draw text-link"
            >
              GitHub
            </TrackedLink>
            <TrackedLink
              href={site.linkedin}
              external
              event="linkedin_click"
              className="link-draw text-link"
            >
              LinkedIn
            </TrackedLink>
          </div>
          <p className="mt-4 text-sm text-fg-3">
            Based in {site.location.split(",")[0]}, {site.timezone}. I reply within two working
            days.
          </p>
        </div>
      </Reveal>
    </>
  );
}
