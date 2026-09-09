import type { Metadata } from "next";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { JsonLd } from "@/components/seo/JsonLd";
import { pageMetadata, jsonLdGraph } from "@/lib/seo";
import { getNow } from "@/lib/content";

export const metadata: Metadata = pageMetadata({
  title: "Now",
  description: "What I'm building, exploring, reading, and doing away from the keyboard.",
  path: "/now",
});

export default function NowPage() {
  const now = getNow();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <JsonLd data={jsonLdGraph({ path: "/now", kind: "about" })} />

      <p className="label text-fg-3">Updated {now.updated}</p>
      <h1 className="mt-3 font-display text-[clamp(2.25rem,1.5rem+2.8vw,3.5rem)] leading-[1.02]">
        Now
      </h1>

      <section className="mt-12" aria-labelledby="building-heading">
        <SectionHeader eyebrow="Building" title="Building" id="building-heading" />
        <ul className="mt-6 list-disc space-y-2 pl-5">
          {now.building.map((item) => (
            <li key={item} className="text-base leading-relaxed text-fg-2">
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12" aria-labelledby="exploring-heading">
        <SectionHeader eyebrow="Exploring" title="Exploring" id="exploring-heading" />
        <ul className="mt-6 list-disc space-y-2 pl-5">
          {now.exploring.map((item) => (
            <li key={item} className="text-base leading-relaxed text-fg-2">
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12" aria-labelledby="reading-heading">
        <SectionHeader eyebrow="Reading" title="Reading" id="reading-heading" />
        <p className="mt-6 text-base leading-relaxed text-fg-2">{now.reading}</p>
      </section>

      <section className="mt-12" aria-labelledby="away-heading">
        <SectionHeader
          eyebrow="Away from the keyboard"
          title="Away from the keyboard"
          id="away-heading"
        />
        <p className="mt-6 text-base leading-relaxed text-fg-2">{now.away}</p>
      </section>
    </div>
  );
}
