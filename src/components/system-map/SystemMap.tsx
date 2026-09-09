"use client";

import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { m, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import type { Domain, DomainId } from "@/content/schema";
import { dur, ease, spring } from "@/lib/motion";
import { cn } from "@/lib/cn";
import {
  MAP,
  arcPath,
  bezelTicks,
  corePath,
  markerTargetDeg,
  nodePosition,
  shortestRotation,
} from "./geometry";
import { SHORT_DESCRIPTOR } from "./shortLabel";
import { useDomainFilter } from "./useDomainFilter";
import { MapTooltip, type MapTooltipProject } from "./MapTooltip";

export interface SystemMapEdge {
  a: DomainId;
  b: DomainId;
  weight: number;
}

export interface SystemMapProps {
  domains: Domain[];
  edges: SystemMapEdge[];
  projectsBySlug: Record<string, MapTooltipProject>;
  variant?: "hero" | "compact";
  choreograph?: boolean;
  className?: string;
}

const SVG_LABEL =
  "System map of engineering domains. Arrow keys move between domains, Enter filters the work below, Escape clears.";

/**
 * Interactive system map: a bezel ring of ticks, edges between domains that
 * share work, and domain nodes filtering the Featured Work section below via
 * `useDomainFilter` (the URL's `?domain=` param). Requires a `<Suspense>`
 * boundary from its caller (see `useDomainFilter`).
 */
export function SystemMap({
  domains,
  edges,
  projectsBySlug,
  variant = "hero",
  choreograph = false,
  className,
}: SystemMapProps) {
  const reduced = useReducedMotion();
  const { selected, select, toggle } = useDomainFilter();
  const [hot, setHot] = useState<DomainId | null>(null);
  const [pulse, setPulse] = useState<DomainId | null>(null);
  const prevSelected = useRef<DomainId | null>(null);
  const nodeRefs = useRef(new Map<DomainId, SVGGElement>());

  const angleById = new Map(domains.map((d) => [d.id, d.angle] as const));
  const ticks = bezelTicks();
  const animateOnMount = choreograph && !reduced;

  // The marker follows whichever domain is hot (hover/focus), falling back
  // to the current selection, and returns to 12 o'clock when neither is
  // set. `markerTargetDeg` also resolves the "on load with ?domain=x" case,
  // since `selected` is already populated from the URL on the first render.
  const markerTargetId = hot ?? selected;
  const markerTargetAngle = markerTargetId ? (angleById.get(markerTargetId) ?? null) : null;
  const markerDeg = markerTargetDeg(markerTargetAngle);

  const markerBase = useMotionValue(markerDeg);
  const markerSpring = useSpring(markerBase, spring.detent);

  useEffect(() => {
    const target = shortestRotation(markerBase.get(), markerDeg);
    markerBase.set(target);
    if (reduced) markerSpring.jump(target);
    // markerBase/markerSpring are stable motion-value instances; only the
    // resolved target degree should retrigger this.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markerDeg, reduced]);

  useEffect(() => {
    if (selected && selected !== prevSelected.current) setPulse(selected);
    prevSelected.current = selected;
  }, [selected]);

  function setNodeRef(id: DomainId, el: SVGGElement | null) {
    if (el) nodeRefs.current.set(id, el);
    else nodeRefs.current.delete(id);
  }

  function focusNode(id: DomainId) {
    nodeRefs.current.get(id)?.focus();
  }

  function handleKeyDown(event: ReactKeyboardEvent<SVGGElement>, index: number, id: DomainId) {
    const count = domains.length;
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown": {
        event.preventDefault();
        const next = domains[(index + 1) % count];
        if (next) focusNode(next.id);
        break;
      }
      case "ArrowLeft":
      case "ArrowUp": {
        event.preventDefault();
        const prev = domains[(index - 1 + count) % count];
        if (prev) focusNode(prev.id);
        break;
      }
      case "Home": {
        event.preventDefault();
        const first = domains[0];
        if (first) focusNode(first.id);
        break;
      }
      case "End": {
        event.preventDefault();
        const last = domains[count - 1];
        if (last) focusNode(last.id);
        break;
      }
      case "Enter":
      case " ": {
        event.preventDefault();
        toggle(id);
        break;
      }
      case "Escape": {
        event.preventDefault();
        select(null);
        setHot(null);
        break;
      }
      default:
        break;
    }
  }

  const selectedDomain = domains.find((d) => d.id === selected) ?? null;
  const liveText = selectedDomain
    ? `Filtering work by ${selectedDomain.label}.`
    : "Showing all work.";

  return (
    <div className={cn("relative", variant === "compact" && "h-[280px]", className)}>
      <svg
        viewBox={`0 0 ${MAP.w} ${MAP.h}`}
        role="group"
        aria-label={SVG_LABEL}
        className="h-full w-full"
      >
        <g className="bezel">
          {ticks.map((t, i) => (
            <line
              key={i}
              x1={t.x1}
              y1={t.y1}
              x2={t.x2}
              y2={t.y2}
              className={cn("map-tick", t.major && "is-major")}
            />
          ))}
          <m.g
            className="map-marker"
            data-target-deg={markerDeg}
            style={{ rotate: markerSpring, transformOrigin: `${MAP.cx}px ${MAP.cy}px` }}
          >
            <line
              x1={MAP.cx}
              y1={MAP.cy - MAP.bezelR + 4}
              x2={MAP.cx}
              y2={MAP.cy - MAP.bezelR + 14}
            />
          </m.g>
        </g>

        <g className="spokes">
          {domains.map((domain, i) => (
            <m.path
              key={`spoke-${domain.id}`}
              d={corePath(domain.angle)}
              className="map-spoke"
              initial={animateOnMount ? { pathLength: 0, opacity: 0.4 } : false}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={
                animateOnMount
                  ? { duration: dur.draw, ease: ease.outExpo, delay: 0.38 + i * 0.04 }
                  : undefined
              }
            />
          ))}
        </g>

        <g className="edges">
          {edges.map((edge, i) => {
            const a = angleById.get(edge.a);
            const b = angleById.get(edge.b);
            if (a == null || b == null) return null;
            const isHotEdge = hot != null && (edge.a === hot || edge.b === hot);
            const isColdEdge = hot != null && !isHotEdge;
            return (
              <m.path
                key={`${edge.a}-${edge.b}`}
                d={arcPath(a, b)}
                className={cn("map-edge", isHotEdge && "is-hot", isColdEdge && "is-cold")}
                initial={animateOnMount ? { pathLength: 0, opacity: 0.4 } : false}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={
                  animateOnMount
                    ? { duration: dur.draw, ease: ease.outExpo, delay: 0.38 + i * 0.04 }
                    : undefined
                }
              />
            );
          })}
        </g>

        <g className="nodes">
          {domains.map((domain, i) => {
            const pos = nodePosition(domain.angle);
            const isHotNode = hot === domain.id;
            const isColdNode = hot != null && !isHotNode;
            const isSelectedNode = selected === domain.id;
            return (
              <m.g
                key={domain.id}
                ref={(el: SVGGElement | null) => setNodeRef(domain.id, el)}
                role="button"
                tabIndex={0}
                aria-pressed={isSelectedNode}
                aria-describedby={`map-tip-${domain.id}`}
                data-id={domain.id}
                className={cn(
                  "map-node",
                  isHotNode && "is-hot",
                  isColdNode && "is-cold",
                  isSelectedNode && "is-selected",
                )}
                style={{ transformOrigin: `${pos.x}px ${pos.y}px` }}
                initial={animateOnMount ? { scale: 0.6, opacity: 0 } : false}
                animate={{ scale: 1, opacity: 1 }}
                transition={
                  animateOnMount ? { ...spring.snappy, delay: 0.58 + i * 0.05 } : undefined
                }
                whileHover={{ scale: 1.06, transition: spring.snappy }}
                whileFocus={{ scale: 1.06, transition: spring.snappy }}
                onPointerEnter={() => setHot(domain.id)}
                onPointerLeave={() => setHot((h) => (h === domain.id ? null : h))}
                onFocus={() => setHot(domain.id)}
                onBlur={() => setHot((h) => (h === domain.id ? null : h))}
                onClick={() => toggle(domain.id)}
                onKeyDown={(event) => handleKeyDown(event, i, domain.id)}
              >
                <circle cx={pos.x} cy={pos.y} r={MAP.nodeR} />
                {isSelectedNode && (
                  <circle className="ring" cx={pos.x} cy={pos.y} r={MAP.nodeR + 3} />
                )}
                {pulse === domain.id && !reduced && (
                  <m.circle
                    className="pulse"
                    cx={pos.x}
                    cy={pos.y}
                    r={MAP.nodeR}
                    initial={{ scale: 1, opacity: 0.6 }}
                    animate={{ scale: 1.3, opacity: 0 }}
                    transition={{ duration: dur.slow }}
                    onAnimationComplete={() => setPulse((p) => (p === domain.id ? null : p))}
                    style={{ transformOrigin: `${pos.x}px ${pos.y}px` }}
                  />
                )}
                <text
                  x={pos.x}
                  y={pos.y - 3}
                  textAnchor="middle"
                  className="font-sans font-medium text-[12.5px]"
                  style={{ fill: "var(--text-primary)" }}
                >
                  {domain.label}
                </text>
                <text
                  x={pos.x}
                  y={pos.y + 11}
                  textAnchor="middle"
                  className="font-label uppercase tracking-[0.2em] text-[9.5px]"
                  style={{ fill: "var(--text-muted)" }}
                >
                  {SHORT_DESCRIPTOR[domain.id]}
                </text>
              </m.g>
            );
          })}
        </g>

        <m.g
          style={{ transformOrigin: `${MAP.cx}px ${MAP.cy}px` }}
          initial={animateOnMount ? { scale: 0.6, opacity: 0 } : false}
          animate={{ scale: 1, opacity: 1 }}
          transition={animateOnMount ? { ...spring.snappy, delay: 0.98 } : undefined}
        >
          <circle
            cx={MAP.cx}
            cy={MAP.cy}
            r={MAP.coreR}
            style={{ fill: "var(--surface-ground)", stroke: "var(--metal-champagne)" }}
            strokeWidth={1.2}
          />
          {/* Champagne budget: the core's stroke is one of the hero's three
              champagne elements (status line, bezel marker, core stroke) —
              the monogram text itself stays a neutral fg-2 so it doesn't
              spend a fourth. */}
          <text
            x={MAP.cx}
            y={MAP.cy}
            textAnchor="middle"
            dominantBaseline="central"
            className="font-display text-[17px]"
            style={{ fill: "var(--text-secondary)" }}
          >
            JS
          </text>
        </m.g>
      </svg>

      <MapTooltip domains={domains} hot={hot} projectsBySlug={projectsBySlug} />

      <p aria-live="polite" className="sr-only">
        {liveText}
      </p>
    </div>
  );
}
