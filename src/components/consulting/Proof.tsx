import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { TextLink } from "@/components/ui/TextLink";
import { getProject } from "@/lib/content";

// One-line results, sourced from each project's `results` in
// `src/content/projects.ts` (traceable to the résumé / ScamShield's
// published benchmark, per the copy-voice rule).
const PROOF_ITEMS = [
  {
    slug: "process-discovery",
    result: "In production with insurance, chemical, and government customers.",
  },
  {
    slug: "scamshield",
    result:
      "903 unit and 138 end-to-end tests, benchmarked in the open with zero hard false positives on the control set.",
  },
] as const;

/** "Proof" — two case-study cards, muted `SectionHeader`. */
export function Proof() {
  return (
    <section className="mt-16 border-t border-line pt-10" aria-labelledby="proof-heading">
      <SectionHeader
        as="h2"
        tone="muted"
        eyebrow="Proof"
        title="Read the work before the call."
        id="proof-heading"
      />
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {PROOF_ITEMS.map(({ slug, result }) => {
          const project = getProject(slug);
          if (!project) return null;
          return (
            <Card key={slug} className="p-5">
              <p className="label text-fg-3">{project.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-fg-2">{result}</p>
              <TextLink href={`/work/${slug}`} className="mt-3 inline-block text-sm">
                Case study
              </TextLink>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
