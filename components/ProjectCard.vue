<template>
  <UCard
    :ui="{ background: 'bg-white dark:bg-black' }"
    class="rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-800 h-full flex flex-col justify-between"
  >
    <!-- header slot for custom title markup -->
    <template #header>
      <h2 class="text-2xl font-semibold uppercase text-center">
        {{ title }}
      </h2>
    </template>

    <!-- description -->
    <p class="flex-grow mt-4 text-gray-700 dark:text-gray-300 text-center">
      {{ description }}
    </p>

    <!-- footer slot for custom button/link -->
    <template #footer>
      <NuxtLink :to="link" class="block w-full">
        <UButton
          block
          color="red"
          class="uppercase mt-6 bg-red-700 hover:bg-red-800 text-white"
        >
          {{ buttonText }}
          <template #trailing>
            <UIcon name="i-heroicons-arrow-right-20-solid" class="w-5 h-5" />
          </template>
        </UButton>
      </NuxtLink>
    </template>
  </UCard>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  description: string;
  link: string;
  buttonText?: string;
}>();
</script>
