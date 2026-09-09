import { Caseback } from "@/components/movement/Caseback";
import { site } from "@/lib/site";
import { BuildDrawer } from "./BuildDrawer";
import { CopyEmail } from "./CopyEmail";
import { TrackedButton, TrackedLink } from "./TrackedLink";

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <p className="font-display text-lg text-fg">{site.name}</p>
            <p className="mt-1 text-sm text-fg-2">{site.title}</p>
            <p className="mt-1 text-sm text-fg-3">{site.location}</p>
          </div>

          <div className="flex flex-col gap-2">
            <span className="label text-fg-3">Elsewhere</span>
            <TrackedLink
              href={site.github}
              external
              event="github_click"
              className="link-draw w-fit text-sm text-link"
            >
              GitHub
            </TrackedLink>
            <TrackedLink
              href={site.linkedin}
              external
              event="linkedin_click"
              className="link-draw w-fit text-sm text-link"
            >
              LinkedIn
            </TrackedLink>
            <CopyEmail />
            <TrackedLink
              href="/joel-stephen-resume.pdf"
              external
              event="resume_click"
              eventProps={{ location: "footer" }}
              className="link-draw w-fit text-sm text-link"
            >
              Résumé (PDF)
            </TrackedLink>
          </div>

          <div className="flex flex-col gap-3">
            <span className="label text-fg-3">Consulting</span>
            <p className="text-sm text-fg-2">Have a hard technical problem?</p>
            <TrackedButton
              href="/consulting"
              size="sm"
              variant="secondary"
              event="consulting_cta_click"
              eventProps={{ location: "footer" }}
            >
              Discuss a project
            </TrackedButton>
          </div>
        </div>

        <div className="mt-12">
          <BuildDrawer sha={process.env.NEXT_PUBLIC_BUILD_SHA} />
          <Caseback
            build={{
              sha: process.env.NEXT_PUBLIC_BUILD_SHA,
              date: process.env.NEXT_PUBLIC_BUILD_DATE,
            }}
            className="mt-6"
          />
        </div>
      </div>
    </footer>
  );
}
