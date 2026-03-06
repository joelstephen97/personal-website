<template>
  <div
    class="scroll-progress"
    :style="{ transform: `scaleX(${progress})` }"
    aria-hidden="true"
  />
</template>

<script setup lang="ts">
import { useWindowScroll, useWindowSize } from "@vueuse/core";

const { y } = useWindowScroll();
const { height: windowHeight } = useWindowSize();

const progress = computed(() => {
  if (!import.meta.client) return 0;
  const docHeight = document.documentElement.scrollHeight;
  const maxScroll = docHeight - windowHeight.value;
  if (maxScroll <= 0) return 0;
  return Math.min(y.value / maxScroll, 1);
});
</script>
