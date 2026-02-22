<template>
  <div
    class="relative w-14 h-14 rounded-lg bg-[rgb(var(--bg))] border border-[rgb(var(--border))] flex items-center justify-center overflow-hidden"
    :style="{ color: preview.color }"
  >
    <template v-if="preview.style === 'cross' || preview.style === 'cross-dot'">
      <div
        class="absolute bg-current"
        :style="preview.bars.v1"
      />
      <div
        class="absolute bg-current"
        :style="preview.bars.v2"
      />
      <div
        class="absolute bg-current"
        :style="preview.bars.h1"
      />
      <div
        class="absolute bg-current"
        :style="preview.bars.h2"
      />
    </template>
    <div
      v-if="preview.style === 'dot' || preview.style === 'cross-dot'"
      class="absolute rounded-full bg-current"
      :style="preview.dot"
    />
    <div
      v-if="preview.style === 'circle'"
      class="absolute rounded-full border-2 border-current"
      :style="preview.circle"
    />
  </div>
</template>

<script setup lang="ts">
import type { CrosshairSettings } from "~/composables/useAimTrainerCrosshair";

const props = defineProps<{
  settings: CrosshairSettings;
}>();

const scale = 0.5;

const preview = computed(() => {
  const s = props.settings;
  const size = Math.min(s.size * scale, 14);
  const thick = Math.max(1, s.thickness);
  const gap = s.gap * scale;
  const outline = s.outline ? `0 0 0 1px ${s.outlineColor}` : undefined;

  return {
    style: s.style,
    color: s.color,
    bars: {
      v1: {
        left: "50%", top: "50%",
        width: `${thick}px`, height: `${size}px`,
        marginLeft: `-${thick / 2}px`, marginTop: `-${size / 2}px`,
        transform: `translateY(-${gap}px)`,
        boxShadow: outline,
      },
      v2: {
        left: "50%", top: "50%",
        width: `${thick}px`, height: `${size}px`,
        marginLeft: `-${thick / 2}px`, marginTop: `-${size / 2}px`,
        transform: `translateY(${gap}px)`,
        boxShadow: outline,
      },
      h1: {
        left: "50%", top: "50%",
        width: `${size}px`, height: `${thick}px`,
        marginLeft: `-${size / 2}px`, marginTop: `-${thick / 2}px`,
        transform: `translateX(-${gap}px)`,
        boxShadow: outline,
      },
      h2: {
        left: "50%", top: "50%",
        width: `${size}px`, height: `${thick}px`,
        marginLeft: `-${size / 2}px`, marginTop: `-${thick / 2}px`,
        transform: `translateX(${gap}px)`,
        boxShadow: outline,
      },
    },
    dot: {
      left: "50%", top: "50%",
      width: `${size / 2}px`, height: `${size / 2}px`,
      marginLeft: `-${size / 4}px`, marginTop: `-${size / 4}px`,
      boxShadow: outline,
    },
    circle: {
      left: "50%", top: "50%",
      width: `${size}px`, height: `${size}px`,
      marginLeft: `-${size / 2}px`, marginTop: `-${size / 2}px`,
      borderWidth: `${thick}px`,
      boxShadow: outline,
    },
  };
});
</script>
