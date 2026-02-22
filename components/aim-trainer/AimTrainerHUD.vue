<template>
  <div
    class="absolute top-0 inset-x-0 glass p-4 flex justify-between items-center z-10"
  >
    <div class="flex gap-6 flex-wrap">
      <span class="flex items-center gap-2 text-[rgb(var(--foreground))]">
        <Icon name="Clock" :size="18" class="text-accent" />
        {{ time.toFixed(1) }}s
      </span>
      <span class="flex items-center gap-2 text-[rgb(var(--foreground))]">
        <Icon name="Target" :size="18" class="text-accent" />
        {{ score }}
      </span>
      <span
        v-if="hits + misses > 0"
        class="flex items-center gap-2 text-[rgb(var(--foreground))]"
      >
        <Icon name="Crosshair" :size="18" class="text-accent" />
        {{ accuracy.toFixed(0) }}%
      </span>
      <span
        v-if="hits + misses > 0"
        class="flex items-center gap-2 text-[rgb(var(--foreground))]"
      >
        <Icon name="Zap" :size="18" class="text-accent" />
        {{ kps.toFixed(1) }} KPS
      </span>
      <span
        v-if="avgReactionMs != null"
        class="flex items-center gap-2 text-[rgb(var(--foreground))]"
      >
        <Icon name="Timer" :size="18" class="text-accent" />
        {{ avgReactionMs }}ms
      </span>
    </div>
    <button
      class="px-4 py-2 rounded-lg bg-[rgb(var(--glass))] border border-[rgb(var(--border))] text-sm font-medium text-[rgb(var(--foreground))] hover:bg-[rgb(var(--border))] transition-colors"
      @click="$emit('exit')"
    >
      Exit
    </button>
  </div>
</template>

<script setup lang="ts">
import Icon from "~/components/ui/Icon.vue";

defineProps<{
  time: number;
  score: number;
  accuracy: number;
  kps: number;
  avgReactionMs?: number;
  hits: number;
  misses: number;
}>();

defineEmits<{
  exit: [];
}>();
</script>
