import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { consultingCopy } from "@/content/consulting-copy";

/** "Who this is not for" — 4 cards from `consultingCopy.whoNotFor`, muted. */
export function NotFor() {
  return (
    <section className="mt-16 border-t border-line pt-10" aria-labelledby="who-not-for-heading">
      <SectionHeader
        as="h2"
        tone="muted"
        eyebrow="Who this is not for"
        title="Where this offer doesn't fit."
        id="who-not-for-heading"
      />
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {consultingCopy.whoNotFor.map((line) => (
          <Card key={line} className="p-5">
            <p className="text-sm leading-relaxed text-fg-2">{line}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
