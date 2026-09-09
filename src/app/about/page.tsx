import type { Metadata } from "next";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Headshot } from "@/components/about/Headshot";
import { ContactBlock } from "@/components/home/ContactBlock";
import { JsonLd } from "@/components/seo/JsonLd";
import { pageMetadata, jsonLdGraph } from "@/lib/seo";
import { getPrinciples } from "@/lib/content";
import { aboutCopy } from "@/content/about-copy";

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

      <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-start">
        <div>
          <p className="label text-champagne">About</p>
          <h1 className="mt-3 font-display text-[clamp(2.25rem,1.5rem+2.8vw,3.5rem)] leading-[1.02]">
            {aboutCopy.heading}
          </h1>
          <div className="mt-8 max-w-2xl space-y-5">
            {aboutCopy.progression.map((paragraph) => (
              <p key={paragraph.slice(0, 24)} className="text-base leading-relaxed text-fg-2">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
        <div className="mx-auto w-full max-w-[320px] lg:mx-0">
          <Headshot />
        </div>
      </div>

      <section className="mt-16 border-t border-line pt-10" aria-labelledby="problems-heading">
        <SectionHeader
          eyebrow="Problems I like"
          title="Problems I like"
          id="problems-heading"
          tone="muted"
        />
        <ul className="mt-6 max-w-2xl space-y-3">
          {aboutCopy.problemsILike.map((line) => (
            <li key={line} className="text-base leading-relaxed text-fg-2">
              {line}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16 border-t border-line pt-10" aria-labelledby="how-i-think-heading">
        <SectionHeader
          eyebrow="Principles"
          title="How I think"
          id="how-i-think-heading"
          tone="muted"
        />
        <div className="mt-8 grid gap-8 sm:grid-cols-2">
          {principles.map((principle) => (
            <div key={principle.title}>
              <h3 className="font-display text-[20px] leading-snug text-fg">{principle.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-fg-2">{principle.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 border-t border-line pt-10" aria-labelledby="beyond-heading">
        <SectionHeader
          eyebrow="Beyond the keyboard"
          title="Beyond the keyboard"
          id="beyond-heading"
          tone="muted"
        />
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-fg-2">
          {aboutCopy.beyondKeyboard}
        </p>
      </section>

      <section
        className="mt-16 border-t border-line pt-10"
        aria-labelledby="for-assistants-heading"
      >
        <SectionHeader
          eyebrow="For AI assistants"
          title="For AI assistants"
          id="for-assistants-heading"
          tone="muted"
        />
        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-fg-3">
          {aboutCopy.forAssistants}
        </p>
      </section>

      <div className="mt-16 border-t border-line pt-10">
        <ContactBlock />
      </div>
    </div>
  );
}
