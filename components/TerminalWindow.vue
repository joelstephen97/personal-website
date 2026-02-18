<template>
  <div class="rounded-2xl overflow-hidden bg-neutral-900 shadow-2xl">
    <!-- Header -->
    <div
      class="flex items-center gap-2 px-4 py-3 bg-neutral-800/50 border-b border-white/5"
    >
      <div class="flex gap-2">
        <span class="w-3 h-3 rounded-full bg-red-500" />
        <span class="w-3 h-3 rounded-full bg-yellow-500" />
        <span class="w-3 h-3 rounded-full bg-green-500" />
      </div>
      <span class="flex-1 text-center text-xs text-white/50 font-mono">{{
        title
      }}</span>
    </div>
    <!-- Body -->
    <div class="p-5 font-mono text-sm text-gray-300 leading-relaxed">
      <p>
        <span class="text-green-400">➜</span>
        <span class="text-cyan-400">~</span> {{ command }}
      </p>
      <div class="mt-3 text-white/80">
        <slot />
      </div>
      <p class="mt-3 flex items-center gap-2">
        <span class="text-green-400">➜</span>
        <span class="text-cyan-400">~</span>
        <span class="w-2 h-4 bg-white/80 animate-pulse" />
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
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
