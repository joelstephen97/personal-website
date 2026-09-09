"use client";

import type { Domain, Project } from "@/content/schema";
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
 * the resulting reorder/enter/exit with the native View Transitions API
 * (see `useDomainFilter.ts`'s `select`) rather than Motion's `domMax`
 * layout-animation feature bundle — that bundle (~45 kB gzipped) existed
 * in the client bundle only for this one transition, on every load of
 * `/` and `/work`, whether or not the filter was ever touched.
 */
export function FeaturedWork({ projects, domains, hideHeader = false }: FeaturedWorkProps) {
  const { selected, select } = useDomainFilter();

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
        style={{ viewTransitionName: "work-header" }}
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

      <div className="mt-10 grid gap-6">
        {visible.map((project) => (
          // `viewTransitionName` (per project slug) is what lets the
          // browser's native View Transition — triggered by
          // `useDomainFilter.ts`'s `select`, wrapping the `?domain=`
          // URL update — animate each card's reorder/enter/exit; see
          // globals.css's `.vt-filter ::view-transition-group(*)` rule.
          <div key={project.slug} style={{ viewTransitionName: `work-${project.slug}` }}>
            <WorkCard
              project={project}
              flagship={project.slug === flagshipSlug}
              index={indexBySlug.get(project.slug) ?? 0}
            />
          </div>
        ))}
      </div>

      <p aria-live="polite" className="sr-only">
        {`Showing ${visible.length} of ${projects.length}`}
      </p>
    </div>
  );
}
