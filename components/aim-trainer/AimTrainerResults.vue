<template>
  <div v-if="displayRuns.length" class="glass-solid rounded-2xl p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="font-semibold text-[rgb(var(--foreground))]">
        Run History
        <span class="text-sm font-normal text-[rgb(var(--foreground-muted))] ml-2">
          (stored locally)
        </span>
      </h3>
      <button
        v-if="storedRuns.length > 0"
        class="text-sm text-[rgb(var(--foreground-muted))] hover:text-[rgb(var(--error))] transition-colors"
        @click="handleClear"
      >
        Clear all
      </button>
    </div>

    <div class="space-y-2">
      <div
        v-for="(run, i) in displayRuns"
        :key="`${run.timestamp}-${run.mode}-${i}`"
        class="rounded-xl border border-[rgb(var(--border))] overflow-hidden"
      >
        <button
          class="w-full flex items-center justify-between gap-4 py-3 px-4 bg-[rgb(var(--glass))] hover:bg-[rgb(var(--border))]/30 transition-colors text-left"
          @click="toggleExpand(run, i)"
        >
          <div class="flex items-center gap-3">
            <span
              v-if="run.hits + run.misses > 0"
              class="text-xs font-bold w-6 h-6 flex items-center justify-center rounded shrink-0"
              :class="gradeClass(getPerformanceRating(run).grade)"
              :title="getPerformanceRating(run).label"
            >
              {{ getPerformanceRating(run).grade }}
            </span>
            <span
              class="text-xs font-medium uppercase tracking-wide px-2 py-0.5 rounded bg-[rgb(var(--border))] text-[rgb(var(--foreground-muted))]"
            >
              {{ run.mode }}
            </span>
            <span class="text-sm text-[rgb(var(--foreground))]">
              {{ run.score }} pts · {{ run.accuracy.toFixed(0) }}% · {{ run.kps.toFixed(1) }} KPS
            </span>
            <span
              v-if="run.avgReactionMs != null"
              class="text-sm text-[rgb(var(--foreground-secondary))]"
            >
              {{ run.avgReactionMs }}ms avg
            </span>
          </div>
          <span class="text-xs text-[rgb(var(--foreground-muted))]">
            {{ formatDate(run.timestamp) }}
          </span>
          <Icon
            :name="expandedId === runId(run, i) ? 'ChevronUp' : 'ChevronDown'"
            :size="18"
            class="text-[rgb(var(--foreground-muted))]"
          />
        </button>

        <Transition name="expand">
          <div
            v-if="expandedId === runId(run, i)"
            class="p-4 border-t border-[rgb(var(--border))] bg-[rgb(var(--bg))]/50"
          >
            <AimTrainerRunDetail :run="run" />
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AimTrainerRun, PerformanceGrade } from "~/composables/useAimTrainer";
import { getPerformanceRating } from "~/composables/useAimTrainer";
import Icon from "~/components/ui/Icon.vue";
import AimTrainerRunDetail from "./AimTrainerRunDetail.vue";

const props = defineProps<{
  history: AimTrainerRun[];
  storedRuns?: AimTrainerRun[];
}>();

const emit = defineEmits<{
  clear: [];
}>();

const expandedId = ref<string | null>(null);

const displayRuns = computed(() => {
  const stored = props.storedRuns ?? [];
  if (stored.length > 0) return stored;
  return props.history;
});

function runId(run: AimTrainerRun, i: number) {
  return `${run.timestamp}-${run.mode}-${i}`;
}

function toggleExpand(run: AimTrainerRun, i: number) {
  const id = runId(run, i);
  expandedId.value = expandedId.value === id ? null : id;
}

function formatDate(ts: number) {
  const d = new Date(ts);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  if (diff < 60000) return "Just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return d.toLocaleDateString();
}

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

function handleClear() {
  emit("clear");
}
</script>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition: all 0.2s ease;
}
.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
}
.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-height: 1200px;
}
</style>
