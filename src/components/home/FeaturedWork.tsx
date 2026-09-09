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
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useDomainFilter } from "@/components/system-map/useDomainFilter";
import { WorkCard } from "./WorkCard";

export interface FeaturedWorkProps {
  projects: Project[];
  domains: Pick<Domain, "id" | "label">[];
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
export function FeaturedWork({ projects, domains }: FeaturedWorkProps) {
  const { selected, select } = useDomainFilter();
  const reduced = useReducedMotion();

  const flagshipSlug = projects[0]?.slug;
  const visible = selected ? projects.filter((p) => p.domains.includes(selected)) : projects;
  const selectedDomain = selected ? (domains.find((d) => d.id === selected) ?? null) : null;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeader
          eyebrow="Selected work"
          title="Five things I would explain to another engineer."
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
              {visible.map((project, index) => (
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
                    index={index}
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
