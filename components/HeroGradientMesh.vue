<template>
  <div class="hero-gradient-mesh" aria-hidden="true">
    <Motion
      as="div"
      class="hero-gradient-mesh__layer"
      :style="{ background: bg1, opacity: 0.1 }"
    />
    <Motion
      as="div"
      class="hero-gradient-mesh__layer"
      :style="{ background: bg2, opacity: 0.07 }"
    />
    <div
      class="hero-gradient-mesh__layer hero-gradient-mesh__layer--static"
      :style="{ opacity: 0.03 }"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { animate, useMotionValue, useMotionTemplate } from "motion-v";

const angle1 = useMotionValue(0);
const angle2 = useMotionValue(360);

const bg1 = useMotionTemplate`conic-gradient(from ${angle1}deg at 50% 45%, transparent 0%, rgb(var(--accent)) 12%, transparent 25%, rgb(var(--accent-hover)) 37%, transparent 50%, rgb(var(--accent)) 62%, transparent 75%, rgb(var(--accent-hover)) 87%, transparent 100%)`;
const bg2 = useMotionTemplate`conic-gradient(from ${angle2}deg at 55% 50%, transparent 0%, rgb(var(--accent-hover)) 15%, transparent 30%, rgb(var(--accent)) 45%, transparent 60%, rgb(var(--accent-hover)) 75%, transparent 90%)`;

let anim1: ReturnType<typeof animate> | null = null;
let anim2: ReturnType<typeof animate> | null = null;

onMounted(() => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;
  anim1 = animate(angle1, 360, {
    duration: 18,
    repeat: Infinity,
    ease: "linear",
  });
  anim2 = animate(angle2, 0, {
    duration: 25,
    repeat: Infinity,
    ease: "linear",
  });
});

onUnmounted(() => {
  anim1?.cancel();
  anim2?.cancel();
});
</script>

<style scoped>
.hero-gradient-mesh {
  position: absolute;
  inset: -10px 0;
  overflow: hidden;
  pointer-events: none;
  z-index: -1;
}

.hero-gradient-mesh__layer {
  position: absolute;
  inset: -50%;
}

.hero-gradient-mesh__layer--static {
  background: radial-gradient(
    ellipse 600px 400px at 40% 50%,
    rgb(var(--accent) / 0.2) 0%,
    transparent 70%
  );
}
</style>
