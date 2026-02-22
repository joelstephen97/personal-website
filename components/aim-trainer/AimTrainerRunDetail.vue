<template>
  <div class="space-y-4">
    <!-- Performance rating -->
    <div v-if="run.hits + run.misses > 0" class="flex items-center gap-2">
      <span
        class="text-lg font-bold w-8 h-8 flex items-center justify-center rounded"
        :class="gradeClass(getPerformanceRating(run).grade)"
      >
        {{ getPerformanceRating(run).grade }}
      </span>
      <span class="text-sm text-[rgb(var(--foreground-secondary))]">
        {{ getPerformanceRating(run).label }}
      </span>
    </div>

    <!-- Primary stats -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div
        class="rounded-lg bg-[rgb(var(--glass))] border border-[rgb(var(--border))] p-3"
      >
        <p class="text-xs text-[rgb(var(--foreground-muted))]">Score</p>
        <p class="font-semibold text-[rgb(var(--foreground))]">
          {{ run.score }}
        </p>
      </div>
      <div
        class="rounded-lg bg-[rgb(var(--glass))] border border-[rgb(var(--border))] p-3"
      >
        <p class="text-xs text-[rgb(var(--foreground-muted))]">Accuracy</p>
        <p class="font-semibold text-[rgb(var(--foreground))]">
          {{ run.accuracy.toFixed(1) }}%
        </p>
      </div>
      <div
        class="rounded-lg bg-[rgb(var(--glass))] border border-[rgb(var(--border))] p-3"
      >
        <p class="text-xs text-[rgb(var(--foreground-muted))]">KPS</p>
        <p class="font-semibold text-[rgb(var(--foreground))]">
          {{ run.kps.toFixed(2) }}
        </p>
      </div>
      <div
        class="rounded-lg bg-[rgb(var(--glass))] border border-[rgb(var(--border))] p-3"
      >
        <p class="text-xs text-[rgb(var(--foreground-muted))]">Duration</p>
        <p class="font-semibold text-[rgb(var(--foreground))]">
          {{ run.duration.toFixed(1) }}s
        </p>
      </div>
    </div>

    <!-- Secondary stats -->
    <div
      v-if="
        run.hits + run.misses > 0 ||
        run.totalMouseDistancePx ||
        run.avgFlickDistancePx != null
      "
      class="grid grid-cols-2 sm:grid-cols-4 gap-3"
    >
      <div
        class="rounded-lg bg-[rgb(var(--glass))] border border-[rgb(var(--border))] p-3"
      >
        <p class="text-xs text-[rgb(var(--foreground-muted))]">Hits</p>
        <p class="font-semibold text-[rgb(var(--foreground))]">
          {{ run.hits }}
        </p>
      </div>
      <div
        class="rounded-lg bg-[rgb(var(--glass))] border border-[rgb(var(--border))] p-3"
      >
        <p class="text-xs text-[rgb(var(--foreground-muted))]">Misses</p>
        <p class="font-semibold text-[rgb(var(--foreground))]">
          {{ run.misses }}
        </p>
      </div>
      <div
        v-if="run.totalMouseDistancePx"
        class="rounded-lg bg-[rgb(var(--glass))] border border-[rgb(var(--border))] p-3"
      >
        <p class="text-xs text-[rgb(var(--foreground-muted))]">Mouse dist</p>
        <p class="font-semibold text-[rgb(var(--foreground))]">
          {{ (run.totalMouseDistancePx / 1000).toFixed(1) }}k px
        </p>
      </div>
      <div
        v-if="run.avgFlickDistancePx != null"
        class="rounded-lg bg-[rgb(var(--glass))] border border-[rgb(var(--border))] p-3"
      >
        <p class="text-xs text-[rgb(var(--foreground-muted))]">Avg flick</p>
        <p class="font-semibold text-[rgb(var(--foreground))]">
          {{ run.avgFlickDistancePx }}px
        </p>
      </div>
    </div>

    <!-- Reaction time (Avg, Median, P95 prominent; Min/Max secondary) -->
    <div
      v-if="run.reactionTimeStats"
      class="rounded-xl bg-[rgb(var(--glass))] border border-[rgb(var(--border))] p-4"
    >
      <h4 class="font-semibold text-[rgb(var(--foreground))] mb-3">
        Reaction Time
      </h4>
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm mb-3">
        <div>
          <span class="text-[rgb(var(--foreground-muted))]">Avg</span>
          <p class="font-medium text-[rgb(var(--foreground))]">
            {{ run.reactionTimeStats.avg }}ms
          </p>
        </div>
        <div>
          <span class="text-[rgb(var(--foreground-muted))]">Median</span>
          <p class="font-medium text-[rgb(var(--foreground))]">
            {{ run.reactionTimeStats.median }}ms
          </p>
        </div>
        <div>
          <span class="text-[rgb(var(--foreground-muted))]">P95</span>
          <p class="font-medium text-[rgb(var(--foreground))]">
            {{ run.reactionTimeStats.p95 }}ms
          </p>
        </div>
      </div>
      <p class="text-xs text-[rgb(var(--foreground-muted))]">
        Min {{ run.reactionTimeStats.min }}ms · Max
        {{ run.reactionTimeStats.max }}ms
      </p>
    </div>

    <!-- Mouse path visualization -->
    <div
      v-if="(run.mousePath?.length ?? 0) > 1"
      class="rounded-xl bg-[rgb(var(--glass))] border border-[rgb(var(--border))] p-4"
    >
      <h4 class="font-semibold text-[rgb(var(--foreground))] mb-3">
        Mouse Path
      </h4>
      <div
        class="relative aspect-video bg-[rgb(var(--bg))] rounded-lg overflow-hidden"
      >
        <svg
          class="absolute inset-0 w-full h-full"
          :viewBox="pathViewBox"
          preserveAspectRatio="none"
        >
          <path
            :d="pathD"
            fill="none"
            stroke="rgb(var(--accent))"
            stroke-width="1.5"
            stroke-opacity="0.6"
          />
          <circle
            v-for="(h, i) in run.hitData ?? []"
            :key="`h-${i}`"
            :cx="h.clickX"
            :cy="h.clickY"
            r="3"
            fill="rgb(var(--success))"
          />
          <circle
            v-for="(m, i) in run.missData ?? []"
            :key="`m-${i}`"
            :cx="m.x"
            :cy="m.y"
            r="3"
            fill="rgb(var(--error))"
          />
        </svg>
      </div>
      <p class="text-xs text-[rgb(var(--foreground-muted))] mt-2">
        Green = hits, Red = misses. Path sampled every 5ms.
      </p>
    </div>

    <!-- Hit-by-hit (for modes with hit data) -->
    <div
      v-if="
        (run.hitData?.length ?? 0) > 0 &&
        (run.hitData ?? []).some(
          (h) => h.reactionMs != null || h.flickDistancePx != null,
        )
      "
      class="rounded-xl bg-[rgb(var(--glass))] border border-[rgb(var(--border))] p-4"
    >
      <h4 class="font-semibold text-[rgb(var(--foreground))] mb-3">
        Hit Breakdown
      </h4>
      <div class="max-h-48 overflow-y-auto space-y-1 text-sm">
        <div
          v-for="(h, i) in run.hitData ?? []"
          :key="i"
          class="flex justify-between gap-4 py-1 border-b border-[rgb(var(--border))] last:border-0"
        >
          <span class="text-[rgb(var(--foreground-muted))]">#{{ i + 1 }}</span>
          <span
            v-if="h.reactionMs != null"
            class="text-[rgb(var(--foreground))]"
          >
            {{ h.reactionMs }}ms
          </span>
          <span
            v-if="h.flickDistancePx != null"
            class="text-[rgb(var(--foreground))]"
          >
            {{ Math.round(h.flickDistancePx) }}px flick
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {
  AimTrainerRun,
  PerformanceGrade,
} from "~/composables/useAimTrainer";
import { getPerformanceRating } from "~/composables/useAimTrainer";

const props = defineProps<{
  run: AimTrainerRun;
}>();

function gradeClass(grade: PerformanceGrade) {
  const map: Record<PerformanceGrade, string> = {
    S: "bg-amber-500/20 text-amber-600 dark:text-amber-400",
    A: "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400",
    B: "bg-blue-500/20 text-blue-600 dark:text-blue-400",
    C: "bg-zinc-500/20 text-zinc-600 dark:text-zinc-400",
    D: "bg-red-900/20 text-red-900 dark:text-red-700",
  };
  return map[grade];
}

const pathBounds = computed(() => {
  const path = props.run.mousePath ?? [];
  if (path.length === 0) return { minX: 0, minY: 0, maxX: 100, maxY: 100 };
  let minX = path[0].x;
  let maxX = path[0].x;
  let minY = path[0].y;
  let maxY = path[0].y;
  for (const p of path) {
    minX = Math.min(minX, p.x);
    maxX = Math.max(maxX, p.x);
    minY = Math.min(minY, p.y);
    maxY = Math.max(maxY, p.y);
  }
  const pad = 20;
  return {
    minX: minX - pad,
    minY: minY - pad,
    maxX: maxX + pad,
    maxY: maxY + pad,
  };
});

const pathViewBox = computed(() => {
  const b = pathBounds.value;
  return `${b.minX} ${b.minY} ${b.maxX - b.minX} ${b.maxY - b.minY}`;
});

const pathD = computed(() => {
  const path = props.run.mousePath ?? [];
  if (path.length < 2) return "";
  return path.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
});
</script>
