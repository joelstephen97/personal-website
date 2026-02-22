<template>
  <div
    v-if="playing"
    class="absolute border-2 border-dashed border-[rgb(var(--border))] rounded-xl pointer-events-none"
    :style="zoneStyle"
  />
  <AimTrainerTarget
    v-for="(t, i) in targets"
    :key="i"
    :x="t.x"
    :y="t.y"
    :size="targetSize"
    @hit="(e) => handleHit(i, e)"
  />
</template>

<script setup lang="ts">
import type { HitData, TargetSize } from "~/composables/useAimTrainer";
import { TARGET_SIZES, usePlayZone } from "~/composables/useAimTrainer";
import AimTrainerTarget from "./AimTrainerTarget.vue";

const props = defineProps<{
  playing: boolean;
  targetSize: TargetSize;
  onHit: (data: HitData) => void;
}>();

interface Target {
  x: number;
  y: number;
}

const targets = ref<Target[]>([]);
const MIN_DISTANCE = 120;
const zone = usePlayZone(true);

const zoneStyle = computed(() => {
  const z = zone.value;
  return {
    left: `${z.left}px`,
    top: `${z.top}px`,
    width: `${z.width}px`,
    height: `${z.height}px`,
  };
});

function randomPosition(): { x: number; y: number } {
  const z = zone.value;
  const r = (TARGET_SIZES[props.targetSize] ?? 40) / 2;
  const w = Math.max(0, z.width - 2 * r);
  const h = Math.max(0, z.height - 2 * r);
  return {
    x: z.left + r + Math.random() * w,
    y: z.top + r + Math.random() * h,
  };
}

function overlaps(pos: { x: number; y: number }, others: Target[]) {
  return others.some(
    (t) => Math.hypot(pos.x - t.x, pos.y - t.y) < MIN_DISTANCE,
  );
}

function placeOne(excludeIndex?: number): Target {
  const others = targets.value.filter((_, i) => i !== excludeIndex);
  let pos = randomPosition();
  let attempts = 0;
  while (overlaps(pos, others) && attempts < 50) {
    pos = randomPosition();
    attempts++;
  }
  return pos;
}

function initTargets() {
  targets.value = [placeOne(), placeOne(), placeOne()];
}

function handleHit(index: number, e: MouseEvent) {
  const t = targets.value[index];
  props.onHit({
    clickX: e.clientX,
    clickY: e.clientY,
    targetX: t.x,
    targetY: t.y,
  });
  targets.value[index] = placeOne(index);
}

function hitTest(px: number, py: number) {
  const r = (TARGET_SIZES[props.targetSize] ?? 40) / 2;
  for (let i = 0; i < targets.value.length; i++) {
    const t = targets.value[i];
    if (Math.hypot(px - t.x, py - t.y) <= r) {
      const data: HitData = {
        clickX: px,
        clickY: py,
        targetX: t.x,
        targetY: t.y,
      };
      targets.value[i] = placeOne(i);
      return { hit: true, data };
    }
  }
  return { hit: false };
}

defineExpose({ hitTest });

watch(
  () => props.playing,
  (isPlaying) => {
    if (isPlaying) initTargets();
  },
  { immediate: true },
);

watch(zone, () => {
  if (props.playing) initTargets();
});
</script>
