<template>
  <a
    v-if="href"
    :href="href"
    :target="target"
    :rel="target === '_blank' ? 'noopener noreferrer' : undefined"
    class="block hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors"
  >
    <div class="flex items-center gap-4 p-3">
      <div class="bg-red-600/20 p-3 pb-1 rounded-full">
        <UIcon :name="icon" class="text-red-600 dark:text-red-400 w-6 h-6" />
      </div>
      <div>
        <p class="text-lg font-bold text-black dark:text-white">
          {{ title }}
        </p>
        <p
          class="font-medium text-gray-800 dark:text-gray-200"
          :class="{
            'hover:text-red-600 dark:hover:text-red-400 transition-colors':
              href,
          }"
        >
          {{ value }}
        </p>
      </div>
    </div>
  </a>
  <div v-else class="flex items-center gap-4 p-3">
    <div class="bg-red-600/20 p-3 pb-1 rounded-full">
      <UIcon :name="icon" class="text-red-600 dark:text-red-400 w-6 h-6" />
    </div>
    <div>
      <p class="text-lg font-bold text-black dark:text-white">{{ title }}</p>
      <p class="font-medium text-gray-800 dark:text-gray-200">{{ value }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  value: string;
  icon: string;
  href?: string;
  target?: string;
}>();
</script>

