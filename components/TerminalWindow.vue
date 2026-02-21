<template>
  <div class="rounded-xl overflow-hidden bg-terminal-bg shadow-2xl border border-white/5">
    <!-- Header -->
    <div
      class="flex items-center gap-2 px-4 py-3 bg-[rgb(45_55_72/0.95)] border-b border-white/5 select-none"
      :class="{ 'cursor-pointer': minimized }"
      @click="minimized && (minimized = false)"
    >
      <div class="flex gap-1.5">
        <span
          class="w-3 h-3 rounded-full cursor-default"
          style="background-color: #ff5f57"
        />
        <button
          type="button"
          class="w-3 h-3 rounded-full transition-colors cursor-pointer hover:bg-[#e5a828] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-1 focus-visible:ring-offset-[rgb(var(--terminal-bg))]"
          style="background-color: #febc2e"
          :aria-label="minimized ? 'Expand terminal' : 'Minimize terminal'"
          :aria-expanded="!minimized"
          @click.stop="minimized = !minimized"
        />
        <span
          class="w-3 h-3 rounded-full transition-colors cursor-default"
          style="background-color: #28c840"
        />
      </div>
      <span class="flex-1 text-center text-xs text-terminal-muted font-mono">
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
            <span class="text-green-400">➜</span>
            <span class="text-cyan-400">~</span> {{ command }}
          </p>
          <div class="mt-3 text-terminal/80">
            <slot />
          </div>
          <p class="mt-3 flex items-center gap-2">
            <span class="text-green-400">➜</span>
            <span class="text-cyan-400">~</span>
            <span class="w-2 h-4 bg-terminal/80 animate-pulse" />
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const minimized = ref(false);

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
