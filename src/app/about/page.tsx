import type { Metadata } from "next";
import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { TrackedLink } from "@/components/shell/TrackedLink";
import { CopyEmail } from "@/components/shell/CopyEmail";
import { JsonLd } from "@/components/seo/JsonLd";
import { pageMetadata, jsonLdGraph } from "@/lib/seo";
import { getPrinciples } from "@/lib/content";
import { aboutCopy } from "@/content/about-copy";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description: aboutCopy.heading,
  path: "/about",
});

export default function AboutPage() {
  const principles = getPrinciples();

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <JsonLd data={jsonLdGraph({ path: "/about", kind: "about" })} />

      <div className="grid gap-10 sm:grid-cols-[1fr_220px]">
        <div>
          <h1 className="font-display text-[clamp(2.25rem,1.5rem+2.8vw,3.5rem)] leading-[1.02]">
            {aboutCopy.heading}
          </h1>
        </div>
        <Card className="relative aspect-[4/5] w-full max-w-[220px] overflow-hidden">
          <Image
            src="/headshot.png"
            alt="Portrait of Joel Stephen"
            fill
            sizes="220px"
            className="object-cover"
            priority
          />
        </Card>
      </div>

      <div className="mt-10 max-w-2xl space-y-5">
        {aboutCopy.progression.map((paragraph) => (
          <p key={paragraph.slice(0, 24)} className="text-base leading-relaxed text-fg-2">
            {paragraph}
          </p>
        ))}
      </div>

      <section className="mt-16 border-t border-line pt-10" aria-labelledby="how-i-think-heading">
        <SectionHeader eyebrow="Principles" title="How I think" id="how-i-think-heading" />
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {principles.map((principle) => (
            <div key={principle.title}>
              <h3 className="text-base font-medium text-fg">{principle.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-fg-2">{principle.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 border-t border-line pt-10" aria-labelledby="beyond-heading">
        <SectionHeader
          eyebrow="Beyond the keyboard"
          title="Beyond the keyboard"
          id="beyond-heading"
        />
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-fg-2">
          {aboutCopy.beyondKeyboard}
        </p>
      </section>

      <section className="mt-16 border-t border-line pt-10" aria-labelledby="about-contact-heading">
        <SectionHeader eyebrow="Contact" title="Get in touch" id="about-contact-heading" />
        <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3">
          <CopyEmail className="text-base text-fg" />
          <TrackedLink
            href={site.github}
            external
            event="github_click"
            className="link-draw text-sm text-link"
          >
            GitHub
          </TrackedLink>
          <TrackedLink
            href={site.linkedin}
            external
            event="linkedin_click"
            className="link-draw text-sm text-link"
          >
            LinkedIn
          </TrackedLink>
        </div>
      </section>

      <p className="mt-16 max-w-2xl border-t border-line pt-6 text-xs leading-relaxed text-fg-3">
        {aboutCopy.forAssistants}
      </p>
    </div>
  );
}
