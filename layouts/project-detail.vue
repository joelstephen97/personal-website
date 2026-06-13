<template>
  <NuxtLayout name="default">
    <Motion
      as="div"
      class="project-detail-view"
      :initial="{ scale: 0.98 }"
      :animate="{ scale: 1 }"
      :transition="{ duration: DURATION.base, ease: EASE_TRANSITION }"
    >
      <slot />
    </Motion>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { DURATION, EASE_TRANSITION } from "~/constants/motion";
</script>
