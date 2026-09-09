import type { Metadata } from "next";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/seo/JsonLd";
import { pageMetadata, jsonLdGraph } from "@/lib/seo";

// Lab is hidden for launch (controller ruling, 2026-09-10): the route stays
// live so the old `/project/*` redirects (see next.config.ts) land on a
// 200, but it renders this short noindex placeholder instead of the real
// tier grid. `content/lab.ts` is kept as-is for the future port.
export const metadata: Metadata = pageMetadata({
  title: "Lab",
  description: "The demos are being ported. They return here when they are ready.",
  path: "/lab",
  noindex: true,
});

export default function LabPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 sm:px-6">
      <JsonLd data={jsonLdGraph({ path: "/lab", kind: "work" })} />

      <SectionHeader as="h1" eyebrow="Lab" title="The demos are being ported." />
      <p className="mt-5 text-lg leading-relaxed text-fg-2">
        Nineteen browser experiments from the previous site, including in-browser speech-to-text,
        image captioning, and background removal, are being moved to the new stack. They return here
        when they are ready.
      </p>
      <div className="mt-8">
        <Button href="/">Back to the front page</Button>
      </div>
    </div>
  );
}
