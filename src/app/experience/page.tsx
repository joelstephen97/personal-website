import type { Metadata } from "next";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { TrackedButton } from "@/components/shell/TrackedLink";
import { JsonLd } from "@/components/seo/JsonLd";
import { pageMetadata, jsonLdGraph } from "@/lib/seo";
import { getExperience, getProject } from "@/lib/content";
import { appliedAiPublic } from "@/content/experience";
import { testimonials } from "@/content/testimonials";
import { ExperienceRail } from "@/components/experience/ExperienceRail";
import type { CaseStudyLink } from "@/components/experience/RoleEntry";

export const metadata: Metadata = pageMetadata({
  title: "Experience",
  description:
    "Five roles across AppliedAI, Otani Trading, RIOT, and Alucor: AI product engineering, real-time collaboration, and full-stack delivery.",
  path: "/experience",
});

export default function ExperiencePage() {
  const experience = getExperience();
  const current = experience[0];

  // Only AppliedAI's `work` slugs that resolve to a real, routable case
  // study (featured project with a `/work/[slug]` page) become links —
  // `customer-surface` resolves via `getProject` but isn't featured, so it's
  // filtered out here rather than linking to a page that 404s.
  const caseStudyLinks: CaseStudyLink[] = (current?.work ?? [])
    .map((slug) => getProject(slug))
    .filter((project): project is NonNullable<typeof project> => Boolean(project?.featured))
    .map((project) => ({ slug: project.slug, title: project.title }));

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <JsonLd data={jsonLdGraph({ path: "/experience", kind: "experience" })} />

      <SectionHeader
        as="h1"
        eyebrow="Experience"
        title="Each role was a harder system than the last."
        lead="Intern, then engineer, then senior, then AI and full-stack. The depth of each entry below is proportional to how much of it still shapes what I build."
      />

      <div className="mt-6">
        <TrackedButton
          href="/joel-stephen-resume.pdf"
          external
          variant="primary"
          event="resume_click"
          eventProps={{ location: "experience" }}
        >
          Résumé PDF
        </TrackedButton>
      </div>

      <div className="mt-12">
        <ExperienceRail
          roles={experience}
          caseStudyLinks={caseStudyLinks}
          publicNote={{
            text: appliedAiPublic,
            href: "https://www.opus.com",
            linkLabel: "opus.com",
          }}
        />
      </div>

      <section className="mt-16 border-t border-line pt-10">
        <SectionHeader
          as="h2"
          tone="muted"
          eyebrow="Background"
          title="Education and certifications."
        />
        <div className="mt-8 grid gap-8 sm:grid-cols-2">
          <div>
            <p className="label text-fg-3">Education</p>
            <p className="mt-3 text-fg">
              Bachelor of Engineering in Computer Science Engineering, Hons.
            </p>
            <p className="mt-1 text-sm text-fg-2">BITS Pilani, Dubai Campus · 2015 – 2019</p>
            <p className="mt-2 text-sm leading-relaxed text-fg-2">
              Capstone: TensorFlow and Python stock-price prediction, from data to model to
              operational signal.
            </p>
          </div>
          <div>
            <p className="label text-fg-3">Certifications</p>
            <p className="mt-3 text-sm leading-relaxed text-fg-2">
              Sixteen listed on LinkedIn. AWS Cloud Practitioner in progress.
            </p>
          </div>
        </div>
      </section>

      {testimonials.length > 0 && (
        <section className="mt-16 border-t border-line pt-10">
          <SectionHeader as="h2" tone="muted" eyebrow="Recommendations" title="What people say." />
        </section>
      )}
    </div>
  );
}
