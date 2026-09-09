import type { Metadata } from "next";
import { TrackedButton } from "@/components/shell/TrackedLink";
import { JsonLd } from "@/components/seo/JsonLd";
import { pageMetadata, jsonLdGraph } from "@/lib/seo";
import { getDomains, getEducation, getExperience, getProject } from "@/lib/content";
import { profile } from "@/content/profile";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Résumé",
  description: "Full-Stack & AI Product Engineer — experience, education, and skills.",
  path: "/resume",
});

// Résumé impact-line budget per role, independent of the Experience page's
// own "depth" progressive-disclosure UI: full lines for the top two roles,
// then decaying counts so five roles fit a two-page print budget.
const IMPACT_LIMIT: Record<string, number> = {
  appliedai: Infinity,
  "otani-senior": Infinity,
  "otani-swe": 4,
  riot: 2,
  alucor: 1,
};

function displayUrl(url: string): string {
  return url.replace(/^https?:\/\//, "");
}

export default function ResumePage() {
  const experience = getExperience();
  const education = getEducation();
  const domains = getDomains();
  const scamshield = getProject("scamshield");

  return (
    <div className="resume-print mx-auto max-w-3xl px-4 py-16 sm:px-6 print:mx-0 print:max-w-none print:px-0 print:py-0">
      <JsonLd data={jsonLdGraph({ path: "/resume", kind: "experience" })} />

      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line pb-8 print:border-none print:pb-2">
        <div>
          <h1 className="font-display text-[clamp(2.25rem,1.5rem+2.8vw,3.5rem)] leading-[1.02] print:text-2xl">
            {site.name}
          </h1>
          <p className="mt-2 text-lg text-fg-2 print:mt-1 print:text-sm">{site.title}</p>
          <p className="mt-1 text-sm text-fg-3 print:text-[9pt]">
            {site.email} · {site.location} · {displayUrl(site.url)} · {displayUrl(site.github)} ·{" "}
            {displayUrl(site.linkedin)}
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

      <section className="mt-10 print:mt-4" aria-labelledby="resume-experience-heading">
        <h2 id="resume-experience-heading" className="label text-fg-3">
          Experience
        </h2>
        <div className="mt-4 space-y-8 print:mt-2 print:space-y-3">
          {experience.map((role) => {
            const limit = IMPACT_LIMIT[role.id] ?? role.impact.length;
            const lines = role.impact.slice(0, limit);
            return (
              <div key={role.id} className="avoid-break">
                <h3 className="text-base font-medium text-fg print:text-[10.5pt]">{role.role}</h3>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="text-sm text-fg-3 print:text-[9pt]">
                    {role.company} · {role.location}
                  </p>
                  <span className="font-mono text-[12px] text-fg-3 print:text-[9pt]">
                    {role.dates.start} – {role.dates.end ?? "present"}
                  </span>
                </div>
                <ul className="mt-2 list-disc space-y-1 pl-5 print:mt-1 print:space-y-0.5">
                  {lines.map((line) => (
                    <li key={line} className="text-sm leading-relaxed text-fg-2 print:text-[9.5pt]">
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      <section
        className="mt-10 border-t border-line pt-8 print:mt-4 print:pt-3"
        aria-labelledby="resume-projects-heading"
      >
        <h2 id="resume-projects-heading" className="label text-fg-3">
          Projects
        </h2>
        <div className="mt-4 space-y-4 print:mt-2 print:space-y-2">
          <div className="avoid-break">
            <h3 className="text-base font-medium text-fg print:text-[10.5pt]">
              Cursor for Product Managers — YC X26 top 10%
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-fg-2 print:text-[9.5pt]">
              I pitched Cursor for Product Managers, a full-stack agentic product for PMs, to the Y
              Combinator X26 batch and reached the top 10% of applications.
            </p>
          </div>
          {scamshield && (
            <div className="avoid-break">
              <h3 className="text-base font-medium text-fg print:text-[10.5pt]">
                {scamshield.title}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-fg-2 print:text-[9.5pt]">
                {scamshield.tagline}
              </p>
              <ul className="mt-1 list-disc space-y-0.5 pl-5">
                {scamshield.results.slice(0, 2).map((line) => (
                  <li key={line} className="text-sm leading-relaxed text-fg-2 print:text-[9.5pt]">
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      <section
        className="mt-10 border-t border-line pt-8 print:mt-4 print:pt-3"
        aria-labelledby="resume-education-heading"
      >
        <h2 id="resume-education-heading" className="label text-fg-3">
          Education
        </h2>
        <div className="mt-4 print:mt-2">
          <p className="text-sm text-fg print:text-[9.5pt]">{education.degree}</p>
          <p className="text-sm text-fg-2 print:text-[9.5pt]">
            {education.institution} · {education.location} · {education.dates.start}–
            {education.dates.end}
          </p>
          <p className="mt-1 text-sm text-fg-3 print:text-[9pt]">
            {education.capstone} {education.certifications.summary}{" "}
            {education.certifications.inProgress}
          </p>
        </div>
      </section>

      <section
        className="mt-10 border-t border-line pt-8 print:mt-4 print:pt-3"
        aria-labelledby="resume-skills-heading"
      >
        <h2 id="resume-skills-heading" className="label text-fg-3">
          Skills
        </h2>
        <div className="mt-4 grid gap-x-6 gap-y-2 sm:grid-cols-2 print:mt-2 print:grid-cols-2 print:gap-y-1">
          {domains.map((domain) => (
            <p key={domain.id} className="text-sm leading-relaxed text-fg-2 print:text-[9pt]">
              <span className="font-medium text-fg">{domain.label}:</span> {domain.tech.join(", ")}
            </p>
          ))}
        </div>
      </section>
    </div>
  );
}
