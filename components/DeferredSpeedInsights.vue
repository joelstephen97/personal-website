<template>
  <SpeedInsights v-if="mounted" />
</template>

<script setup lang="ts">
import { SpeedInsights } from "@vercel/speed-insights/nuxt";

const mounted = ref(false);

onMounted(() => {
  if (typeof requestIdleCallback !== "undefined") {
    requestIdleCallback(() => { mounted.value = true; }, { timeout: 4000 });
  } else {
    setTimeout(() => { mounted.value = true; }, 2000);
  }
});
</script>
