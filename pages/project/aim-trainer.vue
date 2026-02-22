<template>
  <div class="min-h-screen bg-[rgb(var(--bg))]">
    <!-- Pre-game -->
    <div v-if="!playing" class="max-w-6xl mx-auto px-6 py-8">
      <div class="flex items-center gap-3 mb-8">
        <BackToProjects />
        <div>
          <h1 class="text-2xl font-bold text-[rgb(var(--foreground))]">
            Aim Trainer
          </h1>
          <p class="text-sm text-[rgb(var(--foreground-secondary))]">
            CS2-style aim training: Flick, Gridshot, Tracking, Precision
          </p>
        </div>
      </div>

      <div
        class="grid grid-cols-1 gap-6"
        :class="{ 'lg:grid-cols-2': hasRuns }"
      >
        <div class="glass-solid rounded-2xl p-6 lg:min-w-0">
        <!-- Mode selector -->
        <div class="mb-6">
          <p class="text-xs text-[rgb(var(--foreground-muted))] uppercase tracking-wide mb-3">
            Mode
          </p>
          <div class="grid grid-cols-2 gap-4">
            <button
              v-for="m in modes"
              :key="m.id"
              class="px-4 py-3.5 rounded-xl border text-left transition-all min-w-0"
              :class="
                mode === m.id
                  ? 'border-accent bg-accent/10 text-accent'
                  : 'border-[rgb(var(--border))] bg-[rgb(var(--glass))] text-[rgb(var(--foreground))] hover:border-[rgb(var(--foreground-muted))]'
              "
              @click="mode = m.id"
            >
              <span class="font-semibold block">{{ m.name }}</span>
              <span class="text-xs text-[rgb(var(--foreground-muted))]">{{
                m.desc
              }}</span>
            </button>
          </div>
        </div>

        <!-- Settings -->
        <div class="flex flex-wrap items-center gap-6 mb-6">
          <div class="flex items-center gap-3">
            <label class="text-sm text-[rgb(var(--foreground))]">Duration:</label>
            <select
              v-model.number="duration"
              class="px-3 py-2 rounded-lg bg-[rgb(var(--glass))] border border-[rgb(var(--border))] text-[rgb(var(--foreground))]"
            >
              <option :value="15">15s</option>
              <option :value="30">30s</option>
              <option :value="60">60s</option>
            </select>
          </div>
          <div
            v-if="mode !== 'precision'"
            class="flex items-center gap-3"
          >
            <label class="text-sm text-[rgb(var(--foreground))]">Target:</label>
            <select
              v-model="targetSize"
              class="px-3 py-2 rounded-lg bg-[rgb(var(--glass))] border border-[rgb(var(--border))] text-[rgb(var(--foreground))]"
            >
              <option value="sm">Small</option>
              <option value="md">Medium</option>
              <option value="lg">Large</option>
            </select>
          </div>
          <div class="flex items-center gap-2">
            <input
              v-model="rawInput"
              type="checkbox"
              id="raw-input"
              class="rounded"
            />
            <label for="raw-input" class="text-sm text-[rgb(var(--foreground))]">
              Raw input (pointer lock)
            </label>
          </div>
        </div>

        <div class="mb-6">
          <AimTrainerCrosshairSettings />
          <p class="text-xs text-[rgb(var(--foreground-muted))] mt-2">
            For pure aim: disable "Enhance pointer precision" in Windows mouse settings.
          </p>
        </div>

        <div class="flex justify-center gap-3">
          <button
            class="px-6 py-3 rounded-xl bg-gradient-to-r from-accent to-accent-hover text-white font-semibold shadow-lg shadow-accent/25 flex items-center gap-2"
            @click="start"
          >
            <Icon name="Play" :size="18" /> Start
          </button>
          <button
            class="px-6 py-3 rounded-xl bg-[rgb(var(--glass))] border border-[rgb(var(--border))] text-[rgb(var(--foreground))] font-semibold flex items-center gap-2"
            @click="reset"
          >
            <Icon name="RotateCcw" :size="18" /> Reset
          </button>
        </div>
        </div>

        <div v-if="hasRuns" class="lg:min-h-[400px] lg:min-w-0">
          <AimTrainerResults
            :history="history"
            :stored-runs="storedRuns"
            @clear="clearStored"
          />
        </div>
      </div>
    </div>

    <!-- Game -->
    <div
      v-else
      ref="area"
      class="fixed inset-0 z-[60] bg-[rgb(var(--bg))] select-none transition-colors duration-75"
      :class="[
        { 'bg-[rgb(var(--error)/0.15)]': missFlash },
        'cursor-none',
      ]"
      @click="handleClick"
      @mousemove="handleMouseMove"
      @mousedown="handlePointerDown"
    >
      <AimTrainerHUD
        :time="time"
        :score="score"
        :accuracy="accuracy"
        :kps="kps"
        :avg-reaction-ms="avgReactionMs"
        :hits="hits"
        :misses="misses"
        @exit="handleEnd"
      />

      <AimTrainerFlick
        v-if="mode === 'flick'"
        ref="modeRef"
        :playing="playing"
        :target-size="targetSize"
        :on-hit="(data) => recordHit(2, data)"
      />
      <AimTrainerGridshot
        v-else-if="mode === 'gridshot'"
        ref="modeRef"
        :playing="playing"
        :target-size="targetSize"
        :on-hit="(data) => recordHit(2, data)"
      />
      <AimTrainerTracking
        v-else-if="mode === 'tracking'"
        :playing="playing"
        :target-size="targetSize"
        :on-score="() => recordHit(1)"
      />
      <AimTrainerPrecision
        v-else-if="mode === 'precision'"
        ref="modeRef"
        :playing="playing"
        :on-hit="(data) => recordHit(1, data)"
      />

      <AimTrainerCrosshair
        v-if="playing"
        :visible="true"
        :x="cursorX"
        :y="cursorY"
        :settings="crosshairSettings"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AimMode } from "~/composables/useAimTrainer";
import { useEventListener, usePointerLock } from "@vueuse/core";
import Icon from "~/components/ui/Icon.vue";
import AimTrainerHUD from "~/components/aim-trainer/AimTrainerHUD.vue";
import AimTrainerResults from "~/components/aim-trainer/AimTrainerResults.vue";
import AimTrainerFlick from "~/components/aim-trainer/AimTrainerFlick.vue";
import AimTrainerGridshot from "~/components/aim-trainer/AimTrainerGridshot.vue";
import AimTrainerTracking from "~/components/aim-trainer/AimTrainerTracking.vue";
import AimTrainerPrecision from "~/components/aim-trainer/AimTrainerPrecision.vue";
import AimTrainerCrosshair from "~/components/aim-trainer/AimTrainerCrosshair.vue";
import AimTrainerCrosshairSettings from "~/components/aim-trainer/AimTrainerCrosshairSettings.vue";

definePageMeta({ layout: "default" });

const modes: { id: AimMode; name: string; desc: string }[] = [
  { id: "flick", name: "Flick", desc: "Single target, reaction time" },
  { id: "gridshot", name: "Gridshot", desc: "3 targets, fast respawn" },
  { id: "tracking", name: "Tracking", desc: "Follow moving target" },
  { id: "precision", name: "Precision", desc: "Small targets, accuracy" },
];

const {
  playing,
  score,
  time,
  duration,
  mode,
  targetSize,
  hits,
  misses,
  history,
  accuracy,
  kps,
  avgReactionMs,
  start,
  end,
  recordHit,
  recordMiss,
  recordMousePosition,
  reset,
} = useAimTrainer();

const { runs: storedRuns, save: saveRun, clear: clearStored } = useAimTrainerStorage();

const hasRuns = computed(() => {
  const stored = storedRuns.value ?? [];
  return stored.length > 0 || history.value.length > 0;
});
const { settings: crosshairSettings } = useAimTrainerCrosshair();

const area = ref<HTMLElement | null>(null);
const { lock, unlock, element: pointerLockElement } = usePointerLock(area);
const isLocked = computed(() => !!pointerLockElement.value);
const modeRef = ref<InstanceType<typeof AimTrainerFlick> | InstanceType<typeof AimTrainerGridshot> | InstanceType<typeof AimTrainerPrecision> | null>(null);
const missFlash = ref(false);
const rawInput = ref(true);
const cursorX = ref(0);
const cursorY = ref(0);

provide("aimTrainerPointerLocked", computed(() => isLocked.value));

function handleMouseMove(e: MouseEvent) {
  if (isLocked.value) {
    cursorX.value = Math.max(0, Math.min(window.innerWidth, cursorX.value + e.movementX));
    cursorY.value = Math.max(0, Math.min(window.innerHeight, cursorY.value + e.movementY));
  } else {
    cursorX.value = e.clientX;
    cursorY.value = e.clientY;
  }
  recordMousePosition(cursorX.value, cursorY.value);
}

function handlePointerDown(e: PointerEvent) {
  if (!rawInput.value || !isLocked.value) return;
  e.preventDefault();
  if (mode.value === "tracking") return;
  const modeComp = modeRef.value as { hitTest?: (px: number, py: number) => { hit: boolean; data?: unknown } } | null;
  const result = modeComp?.hitTest?.(cursorX.value, cursorY.value);
  if (result?.hit && result.data) {
    recordHit(mode.value === "precision" ? 1 : 2, result.data as Parameters<typeof recordHit>[1]);
  } else {
    if (mode.value === "precision") return;
    recordMiss(1, cursorX.value, cursorY.value);
    missFlash.value = true;
    setTimeout(() => (missFlash.value = false), 75);
  }
}

function handleClick(e: MouseEvent) {
  if (rawInput.value && isLocked.value) return;
  if (mode.value === "precision") return;
  if (mode.value === "tracking") return;
  recordMiss(1, e.clientX, e.clientY);
  missFlash.value = true;
  setTimeout(() => (missFlash.value = false), 75);
}

function handleEnd() {
  if (isLocked.value) unlock();
  const run = end();
  if (run) saveRun(run);
}

watch(playing, async (p) => {
  if (p && rawInput.value && area.value) {
    cursorX.value = window.innerWidth / 2;
    cursorY.value = window.innerHeight / 2;
    await nextTick();
    if (area.value) await lock(area.value);
  } else if (!p && isLocked.value) {
    unlock();
  }
});

useEventListener(window, "keydown", (e: KeyboardEvent) => {
  if (e.key === "Escape" && playing.value) handleEnd();
});
</script>
