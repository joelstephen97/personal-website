import type { ReactElement } from "react";

interface Plate {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface SkeletonProps {
  /** 3-4 rounded plates, drawn after the bridges so their edges sit on top. */
  plates: [Plate, Plate, Plate] | [Plate, Plate, Plate, Plate];
  /** Pairs of plate indices joined by a bridge line, center to center. */
  bridges: [number, number][];
  /** The single accent jewel — champagne is off-limits here (see below). */
  jewel: { x: number; y: number };
}

function plateCenter(p: Plate) {
  return { x: p.x + p.w / 2, y: p.y + p.h / 2 };
}

/**
 * Abstract "skeleton" visual for a work card that isn't ScamShield: a small
 * set of rounded plates joined by bridges, with one jewel. This stands in
 * for a screenshot on projects that are confidential or archived.
 *
 * The champagne budget (at most 3 champagne elements per viewport) is
 * already spent elsewhere on this page, so the jewel uses `--accent-default`
 * fill with a `--border-default` stroke rather than champagne.
 */
function Skeleton({ plates, bridges, jewel }: SkeletonProps) {
  return (
    <svg viewBox="0 0 240 160" className="h-full w-full" aria-hidden="true">
      {bridges.map(([a, b], i) => {
        const from = plateCenter(plates[a]!);
        const to = plateCenter(plates[b]!);
        return (
          <line
            key={i}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            stroke="var(--border-default)"
            strokeWidth={1}
          />
        );
      })}
      {plates.map((p, i) => (
        <rect
          key={i}
          x={p.x}
          y={p.y}
          width={p.w}
          height={p.h}
          rx={10}
          fill="var(--surface-raised)"
          stroke="var(--border-default)"
          strokeWidth={1}
        />
      ))}
      <circle
        cx={jewel.x}
        cy={jewel.y}
        r={6}
        fill="var(--accent-default)"
        stroke="var(--border-default)"
        strokeWidth={1}
      />
    </svg>
  );
}

function ProcessDiscoveryVisual(): ReactElement {
  return (
    <Skeleton
      plates={[
        { x: 22, y: 28, w: 62, h: 44 },
        { x: 118, y: 18, w: 58, h: 40 },
        { x: 150, y: 92, w: 56, h: 42 },
        { x: 40, y: 100, w: 50, h: 34 },
      ]}
      bridges={[
        [0, 1],
        [1, 2],
        [0, 3],
        [2, 3],
      ]}
      jewel={{ x: 120, y: 80 }}
    />
  );
}

function WorkflowCanvasVisual(): ReactElement {
  return (
    <Skeleton
      plates={[
        { x: 30, y: 20, w: 56, h: 36 },
        { x: 100, y: 60, w: 60, h: 40 },
        { x: 170, y: 24, w: 50, h: 34 },
      ]}
      bridges={[
        [0, 1],
        [1, 2],
      ]}
      jewel={{ x: 130, y: 118 }}
    />
  );
}

function FlowerMeisterVisual(): ReactElement {
  return (
    <Skeleton
      plates={[
        { x: 26, y: 40, w: 54, h: 54 },
        { x: 100, y: 22, w: 54, h: 38 },
        { x: 160, y: 60, w: 54, h: 54 },
        { x: 100, y: 100, w: 54, h: 34 },
      ]}
      bridges={[
        [0, 1],
        [1, 2],
        [1, 3],
      ]}
      jewel={{ x: 120, y: 60 }}
    />
  );
}

function FmiPlatformVisual(): ReactElement {
  return (
    <Skeleton
      plates={[
        { x: 24, y: 60, w: 58, h: 40 },
        { x: 96, y: 24, w: 60, h: 40 },
        { x: 96, y: 96, w: 60, h: 40 },
        { x: 168, y: 60, w: 50, h: 40 },
      ]}
      bridges={[
        [0, 1],
        [0, 2],
        [1, 3],
        [2, 3],
      ]}
      jewel={{ x: 126, y: 80 }}
    />
  );
}

/** Fallback skeleton for any slug without a bespoke composition above. */
function DefaultVisual(): ReactElement {
  return (
    <Skeleton
      plates={[
        { x: 30, y: 30, w: 60, h: 44 },
        { x: 120, y: 40, w: 56, h: 40 },
        { x: 90, y: 100, w: 58, h: 36 },
      ]}
      bridges={[
        [0, 1],
        [0, 2],
        [1, 2],
      ]}
      jewel={{ x: 120, y: 80 }}
    />
  );
}

const VISUALS: Record<string, () => ReactElement> = {
  "process-discovery": ProcessDiscoveryVisual,
  "workflow-canvas": WorkflowCanvasVisual,
  "flower-meister": FlowerMeisterVisual,
  "fmi-platform": FmiPlatformVisual,
};

/** Looks up the abstract skeleton visual for a project slug (scamshield uses a screenshot instead — see `WorkCard`). */
export function WorkVisual({ slug }: { slug: string }): ReactElement {
  const Visual = VISUALS[slug] ?? DefaultVisual;
  return <Visual />;
}
