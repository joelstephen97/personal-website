import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/seo/JsonLd";
import { pageMetadata, jsonLdGraph } from "@/lib/seo";
import { getLab } from "@/lib/content";
import { retiredLabSlugs } from "@/content/lab";

function knownSlugs(): string[] {
  return [...getLab().map((entry) => entry.slug), ...retiredLabSlugs];
}

function titleCase(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/** The demo's display title, from `lab.ts` when it's a known tracked entry, else derived from the slug (covers `retiredLabSlugs`, which carry no metadata). */
function demoTitle(slug: string): string {
  return getLab().find((entry) => entry.slug === slug)?.title ?? titleCase(slug);
}

export function generateStaticParams() {
  return knownSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (!knownSlugs().includes(slug)) return {};
  return pageMetadata({
    title: demoTitle(slug),
    description: "The demos are being ported. They return here when they are ready.",
    path: `/lab/${slug}`,
    noindex: true,
  });
}

// Lab is hidden for launch (controller ruling, 2026-09-10): known slugs
// (tracked `lab.ts` entries and `retiredLabSlugs`) render the same
// placeholder as `/lab`, naming the specific demo, so the old `/project/*`
// redirects (next.config.ts) land on a 200 instead of a 404. Anything else
// 404s.
export default async function LabEntryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!knownSlugs().includes(slug)) return notFound();

  const title = demoTitle(slug);

  return (
    <div className="mx-auto max-w-2xl px-4 py-24 sm:px-6">
      <JsonLd data={jsonLdGraph({ path: `/lab/${slug}`, kind: "work" })} />

      <SectionHeader as="h1" eyebrow="Lab" title="The demos are being ported." />
      <p className="mt-5 text-lg leading-relaxed text-fg-2">
        {title} is one of nineteen browser experiments from the previous site, being moved to the
        new stack. It returns here when it is ready.
      </p>
      <div className="mt-8">
        <Button href="/">Back to the front page</Button>
      </div>
    </div>
  );
}
