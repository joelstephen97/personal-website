import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { consultingCopy } from "@/content/consulting-copy";

/**
 * "Who this is for" — 4 cards from `consultingCopy.whoFor` (kept as flat
 * sentences, not title+detail pairs, so `llms-full.txt`'s existing
 * `- ${line}` bullet rendering keeps working unchanged). `tone="muted"`:
 * the page's one champagne `SectionHeader` is `Roadmapping`'s "Start here".
 */
export function WhoFor() {
  return (
    <section className="mt-16" aria-labelledby="who-for-heading">
      <SectionHeader
        as="h2"
        tone="muted"
        eyebrow="Who this is for"
        title="A team with one of these problems."
        id="who-for-heading"
      />
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {consultingCopy.whoFor.map((line) => (
          <Card key={line} className="p-5">
            <p className="text-sm leading-relaxed text-fg-2">{line}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
