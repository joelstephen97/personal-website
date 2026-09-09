"use client";

import {
  AnimatePresence,
  LayoutGroup,
  LazyMotion,
  domMax,
  m,
  useReducedMotion,
} from "motion/react";
import type { Domain, Project } from "@/content/schema";
import { spring } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useDomainFilter } from "@/components/system-map/useDomainFilter";
import { WorkCard } from "./WorkCard";

export interface FeaturedWorkProps {
  projects: Project[];
  domains: Pick<Domain, "id" | "label">[];
  /**
   * Skips the internal "Selected work / Five things I would explain to
   * another engineer" heading. For a caller (`/work`) that already
   * renders its own page-level h1 with the same "five things" framing
   * immediately above this component, so the two don't appear stacked as
   * two adjacent "five things" headings.
   */
  hideHeader?: boolean;
}

/**
 * The home page's editorial work list. Filters `projects` by the System
 * Map's URL-backed `?domain=` selection (`useDomainFilter`) and animates
 * the resulting list with a shared `LayoutGroup` so remaining cards glide
 * into their new positions rather than jumping.
 *
 * `domMax` (layout animations) is loaded in its own `LazyMotion` boundary
 * here rather than widening the app-wide `domAnimation` bundle in
 * `MotionProvider` — see `Nav.tsx` for the same tradeoff made the other way.
 */
export function FeaturedWork({ projects, domains, hideHeader = false }: FeaturedWorkProps) {
  const { selected, select } = useDomainFilter();
  const reduced = useReducedMotion();

  const flagshipSlug = projects[0]?.slug;
  const visible = selected ? projects.filter((p) => p.domains.includes(selected)) : projects;
  const selectedDomain = selected ? (domains.find((d) => d.id === selected) ?? null) : null;
  // Case-study numbering ("Case study N: …") stays tied to each project's
  // position in the unfiltered list, not its position in the filtered
  // one — filtering shouldn't renumber a card that was already "3" when
  // "All domains" was showing.
  const indexBySlug = new Map(projects.map((p, i) => [p.slug, i]));

  return (
    <div>
      <div
        className={cn(
          "flex flex-wrap items-end gap-4",
          hideHeader ? "justify-end" : "justify-between",
        )}
      >
        <SectionHeader
          eyebrow="Selected work"
          title="Five things I would explain to another engineer."
          // `hideHeader`'s caller (`/work`) already has its own visible h1
          // with the same "five things" framing immediately above this
          // component — this stays in the DOM (visually hidden, not
          // removed) so the heading order between that page's h1 and each
          // `WorkCard`'s h3 stays valid (h1 → h2 → h3, no skipped level)
          // for assistive-technology heading navigation.
          className={hideHeader ? "sr-only" : undefined}
        />
        <p className="label text-fg-3">
          {selectedDomain ? (
            <>
              {selectedDomain.label} ·{" "}
              <button type="button" onClick={() => select(null)} className="hover:text-fg">
                Clear
              </button>
            </>
          ) : (
            "All domains"
          )}
        </p>
      </div>

      <LazyMotion features={domMax}>
        <LayoutGroup>
          <div className="mt-10 grid gap-6">
            <AnimatePresence mode="popLayout" initial={false}>
              {visible.map((project) => (
                <m.div
                  key={project.slug}
                  layout={!reduced}
                  initial={reduced ? false : { opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduced ? undefined : { opacity: 0, scale: 0.98 }}
                  transition={spring.gentle}
                >
                  <WorkCard
                    project={project}
                    flagship={project.slug === flagshipSlug}
                    index={indexBySlug.get(project.slug) ?? 0}
                  />
                </m.div>
              ))}
            </AnimatePresence>
          </div>
        </LayoutGroup>
      </LazyMotion>

      <p aria-live="polite" className="sr-only">
        {`Showing ${visible.length} of ${projects.length}`}
      </p>
    </div>
  );
}
