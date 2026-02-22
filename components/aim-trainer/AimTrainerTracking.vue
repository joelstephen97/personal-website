<template>
  <AimTrainerTarget
    v-if="playing"
    :x="x"
    :y="y"
    :size="targetSize"
    moving
    @hit="() => {}"
  />
</template>

<script setup lang="ts">
import type { TargetSize } from "~/composables/useAimTrainer";
import { TARGET_SIZES, usePlayZone } from "~/composables/useAimTrainer";
import AimTrainerTarget from "./AimTrainerTarget.vue";

const props = defineProps<{
  playing: boolean;
  targetSize: TargetSize;
  onScore: () => void;
}>();

const x = ref(0);
const y = ref(0);
const t = ref(0);
let rafId = 0;
let lastTick = 0;
const TICK_INTERVAL = 200;
const zone = usePlayZone(false);

function getCenter() {
  const z = zone.value;
  return {
    x: z.left + z.width / 2,
    y: z.top + z.height / 2,
  };
}

function getMaxRadius() {
  const z = zone.value;
  const targetRadius = (TARGET_SIZES[props.targetSize] ?? 40) / 2;
  return Math.min(120, z.width / 2 - targetRadius, z.height / 2 - targetRadius);
}

function updatePosition() {
  const center = getCenter();
  const radius = Math.max(0, getMaxRadius());
  t.value += 0.008;
  x.value = center.x + Math.cos(t.value) * radius;
  y.value = center.y + Math.sin(t.value * 1.3) * radius;
}

function checkCursorInTarget(mouseX: number, mouseY: number) {
  const size = TARGET_SIZES[props.targetSize] ?? 40;
  const half = size / 2;
  return (
    mouseX >= x.value - half &&
    mouseX <= x.value + half &&
    mouseY >= y.value - half &&
    mouseY <= y.value + half
  );
}

function loop(timestamp: number) {
  if (!props.playing) return;
  updatePosition();
  if (timestamp - lastTick >= TICK_INTERVAL) {
    lastTick = timestamp;
    if (cursorInTarget.value) props.onScore();
  }
  rafId = requestAnimationFrame(loop);
}

const cursorInTarget = ref(false);

function onMouseMove(e: MouseEvent) {
  cursorInTarget.value = checkCursorInTarget(e.clientX, e.clientY);
}

watch(
  () => props.playing,
  (isPlaying) => {
    if (isPlaying) {
      const center = getCenter();
      const radius = Math.max(0, getMaxRadius());
      x.value = center.x + radius;
      y.value = center.y;
      t.value = 0;
      lastTick = performance.now();
      rafId = requestAnimationFrame(loop);
      window.addEventListener("mousemove", onMouseMove);
    } else {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouseMove);
    }
  },
  { immediate: true },
);

onUnmounted(() => {
  cancelAnimationFrame(rafId);
  window.removeEventListener("mousemove", onMouseMove);
});
</script>
