<script setup lang="ts">
import * as icons from "lucide-vue-next";
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    name: string;
    size?: number | string;
    strokeWidth?: number;
  }>(),
  {
    size: 20,
    strokeWidth: 2,
  }
);

const iconComponent = computed(() => {
  // Convert kebab-case or icon names to PascalCase
  const name = props.name
    .replace(/^i-/, "")
    .replace(/-./g, (x) => x[1].toUpperCase())
    .replace(/^./, (x) => x.toUpperCase());

  return (icons as Record<string, any>)[name] || icons.Circle;
});
</script>

<template>
  <component
    :is="iconComponent"
    :size="size"
    :stroke-width="strokeWidth"
    class="inline-block flex-shrink-0"
  />
</template>
