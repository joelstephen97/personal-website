<template>
  <header class="text-center mb-8" :aria-labelledby="id">
    <p
      v-if="eyebrow"
      v-reveal="{ delay: 0 }"
      class="text-xs font-medium text-accent tracking-wide uppercase mb-2"
    >
      {{ eyebrow }}
    </p>
    <Motion
      v-if="animate"
      :id="id"
      as="h1"
      class="text-h2 font-bold text-foreground mb-1"
      :variants="fadeUp"
      initial="hidden"
      animate="show"
    >
      {{ title }}
    </Motion>
    <h1
      v-else
      :id="id"
      v-reveal="{ delay: 50 }"
      class="text-h2 font-bold text-foreground mb-1"
    >
      {{ title }}
    </h1>
    <p
      v-if="subtitle"
      v-reveal="{ delay: animate ? 300 : 100 }"
      class="text-base text-muted max-w-md mx-auto"
      :class="subtitleClass"
    >
      {{ subtitle }}
    </p>
    <slot />
  </header>
</template>

<script setup lang="ts">
import { fadeUp } from "~/constants/motion";

withDefaults(
  defineProps<{
    id: string;
    title: string;
    eyebrow?: string;
    subtitle?: string;
    subtitleClass?: string;
    animate?: boolean;
  }>(),
  { subtitleClass: "", animate: false },
);
</script>
