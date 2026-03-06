<template>
  <div
    v-if="isHoverDevice"
    ref="glowRef"
    class="fixed pointer-events-none -z-5 w-[500px] h-[500px] rounded-full opacity-[0.04] blur-3xl"
    :style="{
      background: `radial-gradient(circle, rgb(var(--accent)) 0%, transparent 70%)`,
      transform: `translate3d(${x - 250}px, ${y - 250}px, 0)`,
      willChange: 'transform',
    }"
    aria-hidden="true"
  />
</template>

<script setup lang="ts">
import { useMouse, useMediaQuery } from "@vueuse/core";

const isHoverDevice = useMediaQuery("(hover: hover)");
const { x, y } = useMouse({ type: "client" });
const glowRef = ref<HTMLElement | null>(null);
</script>
