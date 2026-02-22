<template>
  <div
    class="rounded-2xl overflow-hidden bg-terminal-bg shadow-2xl border border-white/5"
  >
    <!-- Header -->
    <div
      class="flex items-center gap-2 px-4 py-3 bg-terminal-bg/95 border-b border-white/5 select-none"
      :class="{ 'cursor-pointer': minimized }"
      @click="minimized && toggleMinimized(false)"
    >
      <div class="flex gap-1.5">
        <span class="w-3 h-3 rounded-full cursor-default bg-terminal-red" />
        <button
          type="button"
          class="w-3 h-3 rounded-full bg-terminal-yellow transition-colors cursor-pointer hover:bg-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-1 focus-visible:ring-offset-terminal-bg"
          :aria-label="minimized ? 'Expand terminal' : 'Minimize terminal'"
          :aria-expanded="!minimized"
          @click.stop="toggleMinimized()"
        />
        <span class="w-3 h-3 rounded-full cursor-default bg-terminal-green" />
      </div>
      <span class="flex-1 text-center text-xs text-terminal font-mono">
        {{ title }}
      </span>
    </div>
    <!-- Body -->
    <div
      class="grid transition-[grid-template-rows] duration-300 ease-out"
      :style="{ gridTemplateRows: minimized ? '0fr' : '1fr' }"
      :aria-hidden="minimized"
    >
      <div class="overflow-hidden min-h-0">
        <div class="p-5 font-mono text-sm text-terminal leading-relaxed">
          <p>
            <span class="text-terminal-prompt">➜</span>
            <span class="text-terminal-path">~</span> {{ command }}
          </p>
          <div class="mt-3 text-terminal">
            <slot />
          </div>
          <p class="mt-3 flex items-center gap-2">
            <span class="text-terminal-prompt">➜</span>
            <span class="text-terminal-path">~</span>
            <span class="w-2 h-4 bg-terminal/80 animate-pulse" />
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMediaQuery, useToggle } from "@vueuse/core";

const isMobile = useMediaQuery("(max-width: 639px)");
const [minimized, toggleMinimized] = useToggle(false);

onMounted(() => {
  if (isMobile.value) {
    toggleMinimized(true);
  }
});

withDefaults(
  defineProps<{
    title?: string;
    command?: string;
  }>(),
  {
    title: "Terminal",
    command: "cat profile.txt",
  },
);
</script>
