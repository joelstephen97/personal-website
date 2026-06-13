<template>
  <Motion
    v-if="isHoverDevice"
    as="div"
    class="fixed pointer-events-none -z-5 w-[500px] h-[500px] rounded-full opacity-[0.04] blur-3xl"
    :style="{
      x: glowX,
      y: glowY,
      background:
        'radial-gradient(circle, rgb(var(--accent)) 0%, transparent 70%)',
    }"
    aria-hidden="true"
  />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { useMediaQuery } from "@vueuse/core";
import { useMotionValue, useSpring } from "motion-v";
import { SPRING } from "~/constants/motion";

const isHoverDevice = useMediaQuery("(hover: hover)");
const targetX = useMotionValue(0);
const targetY = useMotionValue(0);
const glowX = useSpring(targetX, SPRING.soft);
const glowY = useSpring(targetY, SPRING.soft);

function onMove(e: MouseEvent) {
  targetX.set(e.clientX - 250);
  targetY.set(e.clientY - 250);
}

onMounted(() =>
  window.addEventListener("mousemove", onMove, { passive: true }),
);
onUnmounted(() => window.removeEventListener("mousemove", onMove));
</script>
