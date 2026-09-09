import { Suspense } from "react";
import { Guilloche } from "@/components/movement/Guilloche";
import { SystemMap } from "@/components/system-map/SystemMap";
import { StaticMap } from "@/components/system-map/StaticMap";
import { MapChips } from "@/components/system-map/MapChips";
import { TrackedButton } from "@/components/shell/TrackedLink";
import { profile } from "@/content/profile";
import { deriveEdges, getDomains, getFeaturedProjects } from "@/lib/content";
import { HeroChoreography } from "./HeroChoreography";
import { HeroHeadline } from "./HeroHeadline";

/**
 * Server-rendered hero: status line, headline, proof paragraph, and CTAs on
 * the left; the System Map (or, below 480px, the chip fallback) on the
 * right. `Guilloche` is purely decorative, absolutely positioned behind
 * everything.
 *
 * Champagne budget for this section: the status line and the map's bezel
 * marker + core stroke (both inside `SystemMap`/`StaticMap`) — three total.
 * Nothing else here uses champagne.
 */
export function Hero() {
  const domains = getDomains();
  const edges = deriveEdges();
  const featured = getFeaturedProjects();
  const projectsBySlug = Object.fromEntries(
    featured.map((p) => [p.slug, { slug: p.slug, title: p.title }]),
  );

  return (
    <section className="relative overflow-hidden border-b border-line">
      <Guilloche className="pointer-events-none absolute inset-0" />
      <div className="relative mx-auto max-w-[1120px] px-5 py-16 sm:px-8 lg:grid lg:grid-cols-[1.2fr_.9fr] lg:items-center lg:gap-[28px] lg:px-14 lg:py-20">
        <HeroChoreography>
          <div>
            <p className="label text-champagne">{profile.status}</p>
            {/* Clamp max reduced from the spec's 5.25rem: at the hero's fixed
                ~560px left column (the 1120px container caps out at
                lg and the grid never widens past 1024+), 5.25rem wrapped
                the headline to 5 lines at 1280 — well past the "fit 3
                lines at >=1280" ruling. 3.25rem is the largest max that
                still holds 3 lines at 1280 and 1728; documented in
                task-4-report.md as a deviation from the ruling's suggested
                4.75rem, which wasn't small enough on its own. */}
            <h1 className="mt-5 text-balance font-display text-[clamp(2.75rem,1.6rem+4.4vw,3.25rem)] leading-[1.05]">
              <HeroHeadline
                words={["Building", "AI", "systems", "and", "the", "interfaces"]}
                emphasis={["people", "run", "them", "from."]}
              />
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-fg-2">{profile.proof}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <TrackedButton
                href="/work"
                size="lg"
                variant="primary"
                event="case_study_view"
                eventProps={{ location: "hero" }}
              >
                Selected work
              </TrackedButton>
              <TrackedButton
                href="/consulting"
                size="lg"
                variant="secondary"
                event="consulting_cta_click"
                eventProps={{ location: "hero" }}
              >
                Work with me
              </TrackedButton>
              <TrackedButton
                href="/joel-stephen-resume.pdf"
                external
                size="lg"
                variant="ghost"
                event="resume_click"
                eventProps={{ location: "hero" }}
              >
                Résumé
              </TrackedButton>
            </div>
          </div>

          <div className="mt-12 lg:mt-0">
            <div className="hidden min-[480px]:block">
              <Suspense
                fallback={
                  <StaticMap domains={domains} edges={edges} className="mx-auto max-w-[420px]" />
                }
              >
                <SystemMap
                  domains={domains}
                  edges={edges}
                  projectsBySlug={projectsBySlug}
                  variant="hero"
                  choreograph
                  className="mx-auto max-w-[420px]"
                />
              </Suspense>
            </div>
            <div className="min-[480px]:hidden">
              <Suspense fallback={null}>
                <MapChips domains={domains} />
              </Suspense>
            </div>
          </div>
        </HeroChoreography>
      </div>
    </section>
  );
}
