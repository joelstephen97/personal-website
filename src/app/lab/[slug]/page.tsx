import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/seo/JsonLd";
import { pageMetadata, jsonLdGraph } from "@/lib/seo";
import { getLab } from "@/lib/content";
import { retiredLabSlugs } from "@/content/lab";

function knownSlugs(): string[] {
  return [...getLab().map((entry) => entry.slug), ...retiredLabSlugs];
}

export function generateStaticParams() {
  return knownSlugs().map((slug) => ({ slug }));
}

function titleCase(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (!knownSlugs().includes(slug)) return {};
  return pageMetadata({
    title: titleCase(slug),
    description: "This demo is being ported to the redesigned site.",
    path: `/lab/${slug}`,
    noindex: true,
  });
}

export default async function LabEntryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!knownSlugs().includes(slug)) return notFound();

  const entry = getLab().find((item) => item.slug === slug);
  const title = entry?.title ?? titleCase(slug);

  return (
    <div className="mx-auto max-w-2xl px-4 py-24 sm:px-6">
      <JsonLd data={jsonLdGraph({ path: `/lab/${slug}`, kind: "work" })} />

      <p className="label text-champagne">Lab</p>
      <h1 className="mt-3 font-display text-[clamp(2.25rem,1.5rem+2.8vw,3.5rem)] leading-[1.02]">
        {title}
      </h1>
      <p className="mt-5 text-lg leading-relaxed text-fg-2">
        {entry?.blurb ?? "This demo is being ported to the redesigned site."} This demo is being
        ported and isn&apos;t live here yet.
      </p>
      <div className="mt-8">
        <Button href="/lab" variant="secondary">
          Back to Lab
        </Button>
      </div>
    </div>
  );
}
