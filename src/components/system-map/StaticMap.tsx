import type { Domain, DomainId } from "@/content/schema";
import { cn } from "@/lib/cn";
import { chipBase, chipOff, chipOn } from "./chip-styles";
import { MAP, arcPath, bezelTicks, corePath, nodePosition } from "./geometry";
import { SHORT_DESCRIPTOR } from "./shortLabel";

export interface StaticMapEdge {
  a: DomainId;
  b: DomainId;
  weight: number;
}

export interface StaticMapProps {
  domains: Domain[];
  edges: StaticMapEdge[];
  className?: string;
}

/**
 * Server-safe render of the same geometry as `SystemMap` — no "use client",
 * no hooks, no interactivity. Used as the Suspense fallback for the client
 * map so the map chunk (which needs `domMax`) doesn't block first paint.
 */
export function StaticMap({ domains, edges, className }: StaticMapProps) {
  const angleById = new Map(domains.map((d) => [d.id, d.angle] as const));
  const ticks = bezelTicks();

  return (
    <svg
      viewBox={`0 0 ${MAP.w} ${MAP.h}`}
      role="img"
      aria-label="System map of engineering domains"
      className={cn("h-full w-full", className)}
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
      </g>

      <g className="spokes">
        {domains.map((domain) => (
          <path key={`spoke-${domain.id}`} d={corePath(domain.angle)} className="map-spoke" />
        ))}
      </g>

      <g className="edges">
        {edges.map((edge) => {
          const a = angleById.get(edge.a);
          const b = angleById.get(edge.b);
          if (a == null || b == null) return null;
          return <path key={`${edge.a}-${edge.b}`} d={arcPath(a, b)} className="map-edge" />;
        })}
      </g>

      <g className="nodes">
        {domains.map((domain) => {
          const pos = nodePosition(domain.angle);
          return (
            <g key={domain.id} className="map-node" data-id={domain.id}>
              <circle cx={pos.x} cy={pos.y} r={MAP.nodeR} />
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
            </g>
          );
        })}
      </g>

      <g>
        <circle
          cx={MAP.cx}
          cy={MAP.cy}
          r={MAP.coreR}
          style={{ fill: "var(--surface-ground)", stroke: "var(--metal-champagne)" }}
          strokeWidth={1.2}
        />
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
      </g>
    </svg>
  );
}

export interface StaticMapChipsProps {
  domains: Domain[];
  className?: string;
}

/**
 * Server-safe, non-interactive stand-in for `MapChips` — the Suspense
 * fallback shown below 480px while the client chunk (`MapChips` needs
 * `useSearchParams`, hence the Suspense boundary) hasn't hydrated yet.
 * Same labels and chip styling as the real thing (with "All" shown
 * selected, the default state), but plain `<span>`s under
 * `aria-hidden="true"` rather than `<button aria-pressed>`s — nothing
 * here is announced or focusable before the real, interactive chip row
 * takes over. No "use client": zero extra JS, same tradeoff as `StaticMap`
 * above.
 */
export function StaticMapChips({ domains, className }: StaticMapChipsProps) {
  return (
    <div aria-hidden="true" className={cn("flex flex-wrap gap-2", className)}>
      <span className={cn(chipBase, chipOn)}>All</span>
      {domains.map((domain) => (
        <span key={domain.id} className={cn(chipBase, chipOff)}>
          {domain.label}
        </span>
      ))}
    </div>
  );
}
