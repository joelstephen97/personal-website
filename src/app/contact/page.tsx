import type { Metadata } from "next";
import { TrackedLink } from "@/components/shell/TrackedLink";
import { CopyEmail } from "@/components/shell/CopyEmail";
import { JsonLd } from "@/components/seo/JsonLd";
import { pageMetadata, jsonLdGraph } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description: `Reach ${site.name} by email — ${site.location}, ${site.timezone}.`,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 sm:px-6">
      <JsonLd data={jsonLdGraph({ path: "/contact", kind: "about" })} />

      <p className="label text-champagne">Contact</p>
      <h1 className="mt-3 font-display text-[clamp(2.25rem,1.5rem+2.8vw,3.5rem)] leading-[1.02]">
        Get in touch
      </h1>

      <div className="mt-10">
        {/* h1-size display type. `CopyEmail`'s default `w-fit` sizes a
            `<button>` to its max-content width regardless of the
            containing block (a `fit-content` quirk on form controls), so
            the unbroken "name.name@gmail.com" string — no spaces for the
            browser's default line-breaking to use — overflowed the
            viewport on narrow screens even with `break-words` alone.
            `block max-w-full` forces the button back inside its
            container's width so `break-words` actually gets to wrap it. */}
        <CopyEmail className="block max-w-full break-words font-display text-[clamp(2.25rem,1.5rem+2.8vw,3.5rem)] leading-[1.02] text-fg" />
      </div>

      <p className="mt-4 text-sm text-fg-3">
        {site.location.split(",")[0]} · {site.timezone}
      </p>

      <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
        <TrackedLink
          href={`mailto:${site.email}?subject=Project`}
          event="consulting_cta_click"
          eventProps={{ location: "contact-page" }}
          className="link-draw text-base text-link"
        >
          Discuss a project
        </TrackedLink>
        <TrackedLink
          href={site.github}
          external
          event="github_click"
          className="link-draw text-base text-link"
        >
          GitHub
        </TrackedLink>
        <TrackedLink
          href={site.linkedin}
          external
          event="linkedin_click"
          className="link-draw text-base text-link"
        >
          LinkedIn
        </TrackedLink>
        <TrackedLink
          href="/joel-stephen-resume.pdf"
          external
          event="resume_click"
          eventProps={{ location: "contact-page" }}
          className="link-draw text-base text-link"
        >
          Résumé PDF
        </TrackedLink>
      </div>

      <p className="mt-10 text-sm text-fg-3">I reply within two working days.</p>
    </div>
  );
}
