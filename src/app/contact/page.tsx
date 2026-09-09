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
        <CopyEmail className="font-display text-[clamp(1.75rem,1.4rem+1.6vw,2.5rem)] leading-tight text-fg" />
      </div>

      <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
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
          href={`mailto:${site.email}?subject=Project:%20`}
          event="consulting_cta_click"
          eventProps={{ location: "contact-page" }}
          className="link-draw text-base text-link"
        >
          Discuss a project
        </TrackedLink>
      </div>

      <p className="mt-10 text-sm text-fg-3">
        Based in {site.location.split(",")[0]}, {site.timezone}. I reply within two working days.
      </p>
    </div>
  );
}
