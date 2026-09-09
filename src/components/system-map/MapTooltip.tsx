"use client";

import { AnimatePresence, m, useReducedMotion } from "motion/react";
import type { Domain, DomainId } from "@/content/schema";
import { dur, ease } from "@/lib/motion";
import { cn } from "@/lib/cn";

export interface MapTooltipProject {
  slug: string;
  title: string;
}

export interface MapTooltipProps {
  domains: Domain[];
  hot: DomainId | null;
  projectsBySlug: Record<string, MapTooltipProject>;
  className?: string;
}

function TooltipBody({
  domain,
  projectsBySlug,
}: {
  domain: Domain;
  projectsBySlug: Record<string, MapTooltipProject>;
}) {
  const linkedWork = domain.work
    .map((slug) => projectsBySlug[slug])
    .filter((p): p is MapTooltipProject => Boolean(p));

  return (
    <>
      <p className="font-sans font-medium text-fg">{domain.label}</p>
      <p className="mt-1 text-fg-2">{domain.blurb}</p>
      <p className="mt-2 text-fg-3">{domain.tech.join(", ")}</p>
      {linkedWork.length > 0 && (
        <p className="mt-2 text-fg-2">{linkedWork.map((p) => p.title).join(", ")}</p>
      )}
    </>
  );
}

/**
 * Content for every domain is always in the DOM (visually hidden) so that
 * `aria-describedby="map-tip-<id>"` on each node resolves without a hover;
 * the glass panel below the map only shows the currently `hot` domain.
 */
export function MapTooltip({ domains, hot, projectsBySlug, className }: MapTooltipProps) {
  const reduced = useReducedMotion();
  const hotDomain = domains.find((d) => d.id === hot) ?? null;

  return (
    <>
      <div className="sr-only">
        {domains.map((d) => (
          <div key={d.id} id={`map-tip-${d.id}`}>
            <TooltipBody domain={d} projectsBySlug={projectsBySlug} />
          </div>
        ))}
      </div>
      <div
        className={cn(
          "pointer-events-none absolute bottom-3 left-3 z-[var(--z-tray)] max-w-[300px]",
          className,
        )}
      >
        <AnimatePresence>
          {hotDomain && (
            <m.div
              key={hotDomain.id}
              className="glass rounded-[var(--radius-3)] p-3 text-[12.5px]"
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: 6 }}
              transition={{ duration: dur.base, ease: ease.outExpo }}
            >
              <TooltipBody domain={hotDomain} projectsBySlug={projectsBySlug} />
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
