import type { Metadata } from "next";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { JsonLd } from "@/components/seo/JsonLd";
import { pageMetadata, jsonLdGraph } from "@/lib/seo";
import { getLab } from "@/lib/content";
import type { LabEntry } from "@/content/schema";

export const metadata: Metadata = pageMetadata({
  title: "Lab",
  description:
    "Small, on-device tools and visualizers: planned builds, not yet shipped, tracked in the open.",
  path: "/lab",
});

function groupByTier(entries: LabEntry[]) {
  const tiers = new Map<1 | 2, LabEntry[]>();
  for (const entry of entries) {
    const group = tiers.get(entry.tier) ?? [];
    group.push(entry);
    tiers.set(entry.tier, group);
  }
  return tiers;
}

export default function LabPage() {
  const entries = getLab();
  const tiers = groupByTier(entries);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <JsonLd data={jsonLdGraph({ path: "/lab", kind: "work" })} />

      <h1 className="font-display text-[clamp(2.25rem,1.5rem+2.8vw,3.5rem)] leading-[1.02]">Lab</h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-fg-2">
        Small, on-device tools and visualizers. Everything here is planned and tracked in the open —
        none of it is live yet.
      </p>

      {[1, 2].map((tier) => {
        const group = tiers.get(tier as 1 | 2);
        if (!group || group.length === 0) return null;
        return (
          <section key={tier} className="mt-14" aria-labelledby={`tier-${tier}-heading`}>
            <SectionHeader
              eyebrow={`Tier ${tier}`}
              title={tier === 1 ? "First up" : "After that"}
              id={`tier-${tier}-heading`}
            />
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {group.map((entry) => (
                <Card key={entry.slug} className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display text-lg text-fg">{entry.title}</h3>
                    <Tag dot>planned</Tag>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-fg-2">{entry.blurb}</p>
                  <p className="mt-3 text-sm leading-relaxed text-fg-3">{entry.buildLog}</p>
                </Card>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
