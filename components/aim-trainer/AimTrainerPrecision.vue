<template>
  <AimTrainerTarget
    v-if="playing && !spawnDelayed"
    :x="x"
    :y="y"
    size="sm"
    @hit="handleHit"
  />
</template>

<script setup lang="ts">
import type { HitData } from "~/composables/useAimTrainer";
import { TARGET_SIZES, usePlayZone } from "~/composables/useAimTrainer";
import AimTrainerTarget from "./AimTrainerTarget.vue";

const props = defineProps<{
  playing: boolean;
  onHit: (data: HitData) => void;
}>();

const x = ref(0);
const y = ref(0);
const spawnTime = ref(0);
const spawnDelayed = ref(false);
const SPAWN_DELAY_MS = 500;
const zone = usePlayZone(false);

function place() {
  const z = zone.value;
  const r = TARGET_SIZES.sm / 2;
  const w = Math.max(0, z.width - 2 * r);
  const h = Math.max(0, z.height - 2 * r);
  x.value = z.left + r + Math.random() * w;
  y.value = z.top + r + Math.random() * h;
  spawnTime.value = performance.now();
  spawnDelayed.value = false;
}

function handleHit(e: MouseEvent) {
  const result = hitTest(e.clientX, e.clientY);
  if (result.hit && result.data) {
    props.onHit(result.data);
  }
}

function hitTest(px: number, py: number) {
  const r = TARGET_SIZES.sm / 2;
  const hit = Math.hypot(px - x.value, py - y.value) <= r;
  if (!hit) return { hit: false };
  const reactionMs = Math.round(performance.now() - spawnTime.value);
  const data: HitData = {
    clickX: px,
    clickY: py,
    targetX: x.value,
    targetY: y.value,
    reactionMs,
  };
  spawnDelayed.value = true;
  setTimeout(() => {
    if (props.playing) place();
  }, SPAWN_DELAY_MS);
  return { hit: true, data };
}

defineExpose({ hitTest });

watch(
  () => props.playing,
  (isPlaying) => {
    if (isPlaying) {
      spawnDelayed.value = false;
      place();
    }
  },
  { immediate: true }
);

watch(zone, () => {
  if (props.playing && !spawnDelayed.value) place();
});
</script>
