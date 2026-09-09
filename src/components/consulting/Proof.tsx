import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { TextLink } from "@/components/ui/TextLink";
import { consultingCopy } from "@/content/consulting-copy";
import { getProject } from "@/lib/content";

/**
 * "Proof" — two case-study cards, muted `SectionHeader`. Results come from
 * `consultingCopy.proofItems` (not a local constant) so `/llms-full.txt`'s
 * plain-text rendering stays word-for-word identical to what renders here.
 */
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
        {consultingCopy.proofItems.map(({ slug, result }) => {
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
