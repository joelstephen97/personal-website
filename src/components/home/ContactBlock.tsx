import { TrackedLink } from "@/components/shell/TrackedLink";
import { CopyEmail } from "@/components/shell/CopyEmail";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { site } from "@/lib/site";

/** Eyebrow + h2 (via `SectionHeader`), email (font-display, click-to-copy), reply-time note, and tracked links. */
export function ContactBlock() {
  return (
    <div className="lg:grid lg:grid-cols-[1.3fr_1fr] lg:items-end lg:gap-9">
      <div>
        <SectionHeader eyebrow="Contact" title="Contact" />
        <CopyEmail className="mt-4 block font-display text-[clamp(1.5rem,1.2rem+1.2vw,2.25rem)]" />
        <p className="mt-3 text-sm text-fg-3">
          Based in {site.location.split(",")[0]}, {site.timezone}. I reply within two working days.
        </p>
      </div>
      <div className="mt-6 grid gap-2 text-sm lg:mt-0">
        <TrackedLink
          href={site.github}
          external
          event="github_click"
          className="link-draw w-fit text-link"
        >
          GitHub → joelstephen97
        </TrackedLink>
        <TrackedLink
          href={site.linkedin}
          external
          event="linkedin_click"
          className="link-draw w-fit text-link"
        >
          LinkedIn → joelthomasstephen
        </TrackedLink>
        <TrackedLink
          href="/joel-stephen-resume.pdf"
          external
          event="resume_click"
          eventProps={{ location: "contact" }}
          className="link-draw w-fit text-link"
        >
          Résumé → PDF
        </TrackedLink>
      </div>
    </div>
  );
}
