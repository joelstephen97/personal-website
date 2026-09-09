import type { Metadata } from "next";
import { TrackedButton } from "@/components/shell/TrackedLink";
import { JsonLd } from "@/components/seo/JsonLd";
import { pageMetadata, jsonLdGraph } from "@/lib/seo";
import { getDomains, getExperience } from "@/lib/content";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Résumé",
  description: "Full-Stack & AI Product Engineer — experience, education, and skills.",
  path: "/resume",
});

export default function ResumePage() {
  const experience = getExperience();
  const domains = getDomains();
  const skills = Array.from(new Set(domains.flatMap((d) => d.tech)));

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 print:py-0">
      <JsonLd data={jsonLdGraph({ path: "/resume", kind: "experience" })} />

      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line pb-8 print:border-none print:pb-0">
        <div>
          <h1 className="font-display text-[clamp(2.25rem,1.5rem+2.8vw,3.5rem)] leading-[1.02] print:text-3xl">
            {site.name}
          </h1>
          <p className="mt-2 text-lg text-fg-2 print:text-base">{site.title}</p>
          <p className="mt-1 text-sm text-fg-3">
            {site.location} · {site.email}
          </p>
        </div>
        <TrackedButton
          href="/joel-stephen-resume.pdf"
          external
          variant="primary"
          event="resume_click"
          eventProps={{ location: "resume-page" }}
          className="print:hidden"
        >
          Download PDF
        </TrackedButton>
      </div>

      <section className="mt-10" aria-labelledby="resume-experience-heading">
        <h2 id="resume-experience-heading" className="label text-fg-3">
          Experience
        </h2>
        <div className="mt-4 space-y-8">
          {experience.map((role) => (
            <div key={role.id}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-base font-medium text-fg">
                  {role.role} · {role.company}
                </h3>
                <span className="font-mono text-[12px] text-fg-3">
                  {role.dates.start} – {role.dates.end ?? "present"}
                </span>
              </div>
              <p className="text-sm text-fg-3">{role.location}</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {role.impact.map((line) => (
                  <li key={line} className="text-sm leading-relaxed text-fg-2">
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section
        className="mt-10 border-t border-line pt-8"
        aria-labelledby="resume-education-heading"
      >
        <h2 id="resume-education-heading" className="label text-fg-3">
          Education
        </h2>
        <p className="mt-4 text-sm text-fg">
          Bachelor of Engineering in Computer Science Engineering, Hons.
        </p>
        <p className="text-sm text-fg-2">BITS Pilani, Dubai Campus</p>
      </section>

      <section className="mt-10 border-t border-line pt-8" aria-labelledby="resume-skills-heading">
        <h2 id="resume-skills-heading" className="label text-fg-3">
          Skills
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-fg-2">{skills.join(" · ")}</p>
      </section>
    </div>
  );
}
