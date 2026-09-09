import { Caseback } from "@/components/movement/Caseback";
import {
  ComplicationDrawer,
  type ComplicationDrawerItem,
} from "@/components/movement/ComplicationDrawer";
import { Button } from "@/components/ui/Button";
import { site } from "@/lib/site";
import { CopyEmail } from "./CopyEmail";

// Static: no runtime `Date()` here (the controller ruling forbids it in a
// server component under `cacheComponents`) — the build sha/date come
// from `next.config.ts`'s `env` block, computed once by Next tooling.
const DRAWER_ITEMS: ComplicationDrawerItem[] = [
  { label: "route", value: "static" },
  { label: "rendering", value: "server components" },
  { label: "fonts", value: "Bodoni Moda · Cinzel · Geist · Geist Mono" },
  { label: "client js", value: "see /dev/tokens" },
  { label: "build", value: process.env.NEXT_PUBLIC_BUILD_SHA || "dev" },
];

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
            <a
              href={site.github}
              target="_blank"
              rel="noopener noreferrer"
              className="link-draw w-fit text-sm text-link"
            >
              GitHub
            </a>
            <a
              href={site.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="link-draw w-fit text-sm text-link"
            >
              LinkedIn
            </a>
            <CopyEmail />
            <a href="/joel-stephen-resume.pdf" className="link-draw w-fit text-sm text-link">
              Résumé (PDF)
            </a>
          </div>

          <div className="flex flex-col gap-3">
            <span className="label text-fg-3">Consulting</span>
            <p className="text-sm text-fg-2">Have a hard technical problem?</p>
            <Button href="/consulting" size="sm" variant="secondary">
              Discuss a project
            </Button>
          </div>
        </div>

        <div className="mt-12">
          <ComplicationDrawer items={DRAWER_ITEMS} />
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
