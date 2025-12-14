<template>
  <div class="w-full pt-10 md:pt-24 lg:pt-32 flex-row pb-10">
    <h1
      class="lg:leading-tighter pb-2 text-4xl font-bold tracking-tighter sm:text-2xl md:text-4xl xl:text-6xl 2xl:text-7xl"
      :class="titleClass"
    >
      <TypingEffect :strings="[title]" :loop="loop" />
    </h1>
    <p
      v-if="subtitle"
      class="text-lg text-gray-800 dark:text-gray-200 mt-4"
      v-html="subtitle"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  subtitle?: string;
  loop?: boolean;
  titleClass?: string;
}>();
</script>

