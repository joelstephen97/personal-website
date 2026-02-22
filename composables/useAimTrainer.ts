import { useIntervalFn, useWindowSize } from "@vueuse/core";

export const PLAY_ZONE = {
  top: 72,
  bottom: 64,
  side: 24,
};

export type AimMode = "flick" | "gridshot" | "tracking" | "precision";
export type TargetSize = "sm" | "md" | "lg";

export const TARGET_SIZES: Record<TargetSize, number> = {
  sm: 24,
  md: 40,
  lg: 56,
};

export interface MousePoint {
  x: number;
  y: number;
  t: number;
}

export interface HitData {
  reactionMs?: number;
  flickDistancePx?: number;
  clickX: number;
  clickY: number;
  targetX: number;
  targetY: number;
  time: number;
}

export interface MissData {
  x: number;
  y: number;
  t: number;
}

export interface ReactionTimeStats {
  min: number;
  max: number;
  avg: number;
  median: number;
  p95: number;
  count: number;
}

export type PerformanceGrade = "S" | "A" | "B" | "C" | "D";

export function getPerformanceRating(run: AimTrainerRun): {
  grade: PerformanceGrade;
  label: string;
} {
  const avgReaction = run.avgReactionMs ?? run.reactionTimeStats?.avg;
  if (avgReaction != null) {
    if (avgReaction < 200) return { grade: "S", label: "Exceptional" };
    if (avgReaction < 250) return { grade: "A", label: "Excellent" };
    if (avgReaction < 300) return { grade: "B", label: "Good" };
    if (avgReaction < 350) return { grade: "C", label: "Average" };
    return { grade: "D", label: "Below avg" };
  }
  const effectiveKps = run.kps * (run.accuracy / 100);
  if (effectiveKps >= 2.5) return { grade: "S", label: "Exceptional" };
  if (effectiveKps >= 2.0) return { grade: "A", label: "Excellent" };
  if (effectiveKps >= 1.5) return { grade: "B", label: "Good" };
  if (effectiveKps >= 1.0) return { grade: "C", label: "Average" };
  return { grade: "D", label: "Below avg" };
}

export interface AimTrainerRun {
  mode: AimMode;
  score: number;
  hits: number;
  misses: number;
  accuracy: number;
  kps: number;
  avgReactionMs?: number;
  duration: number;
  timestamp: number;
  mousePath?: MousePoint[];
  hitData?: HitData[];
  missData?: MissData[];
  reactionTimeStats?: ReactionTimeStats;
  totalMouseDistancePx?: number;
  avgFlickDistancePx?: number;
  targetSize?: TargetSize;
}

export function usePlayZone(gridshot = false) {
  const { width: windowWidth, height: windowHeight } = useWindowSize();

  return computed(() => {
    const w = windowWidth.value ?? window.innerWidth;
    const h = windowHeight.value ?? window.innerHeight;
    const top = PLAY_ZONE.top;
    const bottom = PLAY_ZONE.bottom;
    const side = PLAY_ZONE.side;

    if (gridshot) {
      const zoneWidth = Math.min(w * 0.75, 800);
      const zoneHeight = Math.min((h - top - bottom) * 0.85, 500);
      const left = (w - zoneWidth) / 2;
      const zoneTop = top + (h - top - bottom - zoneHeight) / 2;
      return {
        left,
        top: zoneTop,
        width: zoneWidth,
        height: zoneHeight,
        right: left + zoneWidth,
        bottom: zoneTop + zoneHeight,
      };
    }

    return {
      left: side,
      top,
      width: w - side * 2,
      height: h - top - bottom,
      right: w - side,
      bottom: h - bottom,
    };
  });
}

const MOUSE_SAMPLE_MS = 5;
const STORED_PATH_MAX_POINTS = 4000;

function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;
  const i = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, i)] ?? 0;
}

export function useAimTrainer() {
  const playing = ref(false);
  const score = ref(0);
  const time = ref(30);
  const duration = ref(30);
  const mode = ref<AimMode>("flick");
  const targetSize = ref<TargetSize>("md");
  const hits = ref(0);
  const misses = ref(0);
  const reactionTimes = ref<number[]>([]);
  const history = ref<AimTrainerRun[]>([]);
  const mousePath = ref<MousePoint[]>([]);
  const hitData = ref<HitData[]>([]);
  const missData = ref<MissData[]>([]);
  const startRunTime = ref(0);
  let lastMouseSample = 0;
  let lastClickX = 0;
  let lastClickY = 0;

  const accuracy = computed(() => {
    const total = hits.value + misses.value;
    return total > 0 ? (hits.value / total) * 100 : 0;
  });

  const kps = computed(() => {
    const elapsed = duration.value - time.value;
    return elapsed > 0 ? hits.value / elapsed : 0;
  });

  const avgReactionMs = computed(() => {
    if (reactionTimes.value.length === 0) return undefined;
    const sum = reactionTimes.value.reduce((a, b) => a + b, 0);
    return Math.round(sum / reactionTimes.value.length);
  });

  const { pause: pauseTimer, resume: resumeTimer } = useIntervalFn(
    () => {
      time.value = Math.max(0, time.value - 0.1);
      if (time.value <= 0) end();
    },
    100,
    { immediate: false },
  );

  function computeReactionStats(): ReactionTimeStats | undefined {
    const arr = reactionTimes.value.filter((n) => n > 0);
    if (arr.length === 0) return undefined;
    const sorted = [...arr].sort((a, b) => a - b);
    const sum = sorted.reduce((a, b) => a + b, 0);
    return {
      min: sorted[0] ?? 0,
      max: sorted[sorted.length - 1] ?? 0,
      avg: Math.round(sum / sorted.length),
      median: percentile(sorted, 50),
      p95: percentile(sorted, 95),
      count: sorted.length,
    };
  }

  function computeTotalMouseDistance(): number {
    let total = 0;
    for (let i = 1; i < mousePath.value.length; i++) {
      const a = mousePath.value[i - 1];
      const b = mousePath.value[i];
      total += Math.hypot(b.x - a.x, b.y - a.y);
    }
    return Math.round(total);
  }

  function computeAvgFlickDistance(): number | undefined {
    const distances = hitData.value
      .map((h) => h.flickDistancePx)
      .filter((d): d is number => d != null && d > 0);
    if (distances.length === 0) return undefined;
    const sum = distances.reduce((a, b) => a + b, 0);
    return Math.round(sum / distances.length);
  }

  function start() {
    score.value = 0;
    time.value = duration.value;
    hits.value = 0;
    misses.value = 0;
    reactionTimes.value = [];
    mousePath.value = [];
    hitData.value = [];
    missData.value = [];
    lastMouseSample = 0;
    lastClickX = 0;
    lastClickY = 0;
    startRunTime.value = performance.now();
    playing.value = true;
    resumeTimer();
  }

  function end() {
    pauseTimer();
    playing.value = false;
    const elapsed = (performance.now() - startRunTime.value) / 1000;
    const path = mousePath.value;
    const storedPath =
      path.length > STORED_PATH_MAX_POINTS
        ? path.filter(
            (_, i) => i % Math.ceil(path.length / STORED_PATH_MAX_POINTS) === 0,
          )
        : [...path];
    const run: AimTrainerRun = {
      mode: mode.value,
      score: score.value,
      hits: hits.value,
      misses: misses.value,
      accuracy: accuracy.value,
      kps: kps.value,
      avgReactionMs: avgReactionMs.value,
      duration: elapsed,
      timestamp: Date.now(),
      mousePath: storedPath,
      hitData: [...hitData.value],
      missData: [...missData.value],
      reactionTimeStats: computeReactionStats(),
      totalMouseDistancePx: computeTotalMouseDistance(),
      avgFlickDistancePx: computeAvgFlickDistance(),
      targetSize: targetSize.value,
    };
    history.value.unshift(run);
    if (history.value.length > 5) history.value.pop();
    return run;
  }

  function recordMousePosition(x: number, y: number) {
    if (!playing.value) return;
    const now = performance.now();
    if (now - lastMouseSample >= MOUSE_SAMPLE_MS) {
      lastMouseSample = now;
      mousePath.value.push({ x, y, t: now - startRunTime.value });
    }
  }

  function recordHit(
    points = 2,
    data?: {
      clickX: number;
      clickY: number;
      targetX: number;
      targetY: number;
      reactionMs?: number;
    },
  ) {
    score.value += points;
    hits.value += 1;
    if (data?.reactionMs != null) reactionTimes.value.push(data.reactionMs);
    if (data) {
      const flickDistancePx =
        lastClickX !== 0 || lastClickY !== 0
          ? Math.hypot(data.targetX - lastClickX, data.targetY - lastClickY)
          : undefined;
      lastClickX = data.clickX;
      lastClickY = data.clickY;
      hitData.value.push({
        ...data,
        flickDistancePx,
        time: performance.now() - startRunTime.value,
      });
    } else {
      lastClickX = 0;
      lastClickY = 0;
    }
  }

  function recordMiss(penalty = 1, x?: number, y?: number) {
    score.value = Math.max(0, score.value - penalty);
    misses.value += 1;
    if (x != null && y != null) {
      missData.value.push({
        x,
        y,
        t: performance.now() - startRunTime.value,
      });
    }
  }

  function recordReaction(ms: number) {
    reactionTimes.value.push(ms);
  }

  function reset() {
    score.value = 0;
    time.value = duration.value;
    hits.value = 0;
    misses.value = 0;
    reactionTimes.value = [];
  }

  onUnmounted(() => pauseTimer());

  return {
    playing,
    score,
    time,
    duration,
    mode,
    targetSize,
    hits,
    misses,
    reactionTimes,
    history,
    accuracy,
    kps,
    avgReactionMs,
    start,
    end,
    recordHit,
    recordMiss,
    recordReaction,
    recordMousePosition,
    reset,
    pauseTimer,
    resumeTimer,
  };
}
