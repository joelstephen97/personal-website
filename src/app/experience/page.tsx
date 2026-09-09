import type { Metadata } from "next";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Tag } from "@/components/ui/Tag";
import { TrackedButton } from "@/components/shell/TrackedLink";
import { JsonLd } from "@/components/seo/JsonLd";
import { pageMetadata, jsonLdGraph } from "@/lib/seo";
import { getExperience } from "@/lib/content";
import { appliedAiPublic } from "@/content/experience";
import type { Experience } from "@/content/schema";

export const metadata: Metadata = pageMetadata({
  title: "Experience",
  description:
    "Five roles across AppliedAI, Otani Trading, RIOT, and Alucor: AI product engineering, real-time collaboration, and full-stack delivery.",
  path: "/experience",
});

const IMPACT_LINES: Record<Experience["depth"], number | "all"> = {
  full: "all",
  "60": 4,
  "40": 3,
  "25": 2,
  "15": 1,
};

export default function ExperiencePage() {
  const experience = getExperience();

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <JsonLd data={jsonLdGraph({ path: "/experience", kind: "experience" })} />

      <h1 className="font-display text-[clamp(2.25rem,1.5rem+2.8vw,3.5rem)] leading-[1.02]">
        Experience
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-fg-2">
        Five roles, most recent first, in more depth the more recent they are.
      </p>

      <div className="mt-6">
        <TrackedButton
          href="/joel-stephen-resume.pdf"
          external
          variant="secondary"
          event="resume_click"
          eventProps={{ location: "experience" }}
        >
          Résumé (PDF)
        </TrackedButton>
      </div>

      <ol className="mt-12 space-y-12 border-l border-line pl-6">
        {experience.map((role) => {
          const count = IMPACT_LINES[role.depth];
          const impact = count === "all" ? role.impact : role.impact.slice(0, count);
          return (
            <li key={role.id} className="relative">
              <span
                aria-hidden="true"
                className="absolute -left-[29px] top-1.5 size-2.5 rounded-full bg-champagne"
              />
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="font-display text-xl text-fg">
                  {role.role} <span className="text-fg-3">· {role.company}</span>
                </h2>
                <span className="font-mono text-[12px] text-fg-3">
                  {role.dates.start} – {role.dates.end ?? "present"}
                </span>
              </div>
              <p className="mt-1 text-sm text-fg-3">{role.location}</p>
              <p className="mt-3 text-base leading-relaxed text-fg-2">{role.summary}</p>
              {role.id === "appliedai" && (
                <p className="mt-2 text-sm leading-relaxed text-fg-2">{appliedAiPublic}</p>
              )}
              <ul className="mt-4 list-disc space-y-1.5 pl-5">
                {impact.map((line) => (
                  <li key={line} className="text-sm leading-relaxed text-fg-2">
                    {line}
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex flex-wrap gap-2">
                {role.technologies.map((tech) => (
                  <Tag key={tech}>{tech}</Tag>
                ))}
              </div>
            </li>
          );
        })}
      </ol>

      <section className="mt-16 border-t border-line pt-10" aria-labelledby="education-heading">
        <SectionHeader eyebrow="Education" title="Education" id="education-heading" />
        <div className="mt-6">
          <p className="text-fg">Bachelor of Engineering in Computer Science Engineering, Hons.</p>
          <p className="text-sm text-fg-2">BITS Pilani, Dubai Campus</p>
        </div>
      </section>
    </div>
  );
}
