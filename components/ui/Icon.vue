<script setup lang="ts">
import {
  Bot,
  Circle,
  Loader2,
  Menu,
  MessageCircle,
  Send,
  Trash2,
  X,
} from "lucide-vue-next";
import * as icons from "lucide-vue-next";
import { computed } from "vue";

const explicitIcons: Record<string, unknown> = {
  Bot,
  Circle,
  Loader2,
  Menu,
  MessageCircle,
  Send,
  Trash2,
  X,
};

const props = withDefaults(
  defineProps<{
    name: string;
    size?: number | string;
    strokeWidth?: number;
  }>(),
  {
    size: 20,
    strokeWidth: 2,
  },
);

const iconComponent = computed(() => {
  const name = props.name
    .replace(/^i-/, "")
    .replace(/-./g, (x) => x[1].toUpperCase())
    .replace(/^./, (x) => x.toUpperCase());

  return explicitIcons[name] ?? (icons as Record<string, unknown>)[name] ?? Circle;
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
