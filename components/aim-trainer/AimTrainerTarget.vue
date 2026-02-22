<template>
  <div
    class="absolute rounded-full bg-gradient-to-br from-accent to-accent-hover shadow-lg shadow-accent/50 cursor-none select-none transition-transform duration-150 hover:scale-110"
    :class="{ 'animate-pulse': moving }"
    :style="targetStyle"
    draggable="false"
    @click.stop="$emit('hit', $event)"
  />
</template>

<script setup lang="ts">
import type { TargetSize } from "~/composables/useAimTrainer";
import { TARGET_SIZES } from "~/composables/useAimTrainer";

const props = withDefaults(
  defineProps<{
    x: number;
    y: number;
    size?: TargetSize;
    moving?: boolean;
  }>(),
  { size: "md", moving: false }
);

const pointerLocked = inject<Ref<boolean>>("aimTrainerPointerLocked", () => ref(false));

defineEmits<{
  hit: [event: MouseEvent];
}>();

const sizePx = computed(() => TARGET_SIZES[props.size] ?? TARGET_SIZES.md);

const targetStyle = computed(() => ({
  left: `${props.x}px`,
  top: `${props.y}px`,
  width: `${sizePx.value}px`,
  height: `${sizePx.value}px`,
  transform: "translate(-50%, -50%)",
  userSelect: "none",
  WebkitUserDrag: "none",
  pointerEvents: pointerLocked.value ? "none" : "auto",
}));
</script>
