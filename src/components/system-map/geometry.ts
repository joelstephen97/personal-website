/**
 * Pure geometry helpers for the System Map. No React, no DOM — safe to use
 * from both the client `SystemMap` and the server-rendered `StaticMap`.
 */

export const MAP = {
  w: 420,
  h: 320,
  cx: 210,
  cy: 160,
  ringR: 112,
  nodeR: 27,
  bezelR: 150,
  coreR: 22,
} as const;

const TICK_COUNT = 60;
const TICK_MAJOR_EVERY = 5;
const TICK_LEN_MAJOR = 8;
const TICK_LEN_MINOR = 4;

function toRad(deg: number) {
  return (deg * Math.PI) / 180;
}

/** Polar position on the node ring around the map center. */
export function nodePosition(angleDeg: number): { x: number; y: number } {
  const rad = toRad(angleDeg);
  return {
    x: MAP.cx + MAP.ringR * Math.cos(rad),
    y: MAP.cy + MAP.ringR * Math.sin(rad),
  };
}

/** Straight line from the core to a node at `angleDeg`. */
export function corePath(angleDeg: number): string {
  const { x, y } = nodePosition(angleDeg);
  return `M${MAP.cx} ${MAP.cy} L${x} ${y}`;
}

/**
 * Quadratic edge between two domain nodes, bowed 35% toward the map center
 * so overlapping edges stay legible instead of stacking as straight chords.
 */
export function arcPath(a: number, b: number): string {
  const pa = nodePosition(a);
  const pb = nodePosition(b);
  const midX = (pa.x + pb.x) / 2;
  const midY = (pa.y + pb.y) / 2;
  const ctrlX = midX + 0.35 * (MAP.cx - midX);
  const ctrlY = midY + 0.35 * (MAP.cy - midY);
  return `M${pa.x} ${pa.y} Q${ctrlX} ${ctrlY} ${pb.x} ${pb.y}`;
}

/**
 * Adjusts `to` (a "marker degrees" angle, i.e. node angle + 90 so a node at
 * -90° maps to 0° / 12 o'clock) so the delta from `from` lands in (-180,
 * 180], giving the bezel marker the shortest rotation path.
 */
export function shortestRotation(from: number, to: number): number {
  let delta = ((((to - from + 180) % 360) + 360) % 360) - 180;
  if (delta === -180) delta = 180;
  return from + delta;
}

export function bezelTicks(): { x1: number; y1: number; x2: number; y2: number; major: boolean }[] {
  const ticks: { x1: number; y1: number; x2: number; y2: number; major: boolean }[] = [];
  for (let i = 0; i < TICK_COUNT; i++) {
    const angleDeg = (360 / TICK_COUNT) * i;
    const rad = toRad(angleDeg);
    const major = i % TICK_MAJOR_EVERY === 0;
    const len = major ? TICK_LEN_MAJOR : TICK_LEN_MINOR;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    ticks.push({
      x1: MAP.cx + MAP.bezelR * cos,
      y1: MAP.cy + MAP.bezelR * sin,
      x2: MAP.cx + (MAP.bezelR - len) * cos,
      y2: MAP.cy + (MAP.bezelR - len) * sin,
      major,
    });
  }
  return ticks;
}
