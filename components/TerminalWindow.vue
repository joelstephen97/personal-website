<template>
  <div
    class="max-w-[700px] mx-auto my-5 bg-gray-800 rounded-lg overflow-hidden shadow-lg"
  >
    <div class="bg-gray-700 px-4 py-2 flex items-center">
      <button
        class="w-3 h-3 rounded-full bg-red-500 mr-2 focus:outline-none"
        @click="toggleMinimize"
      />
      <button
        class="w-3 h-3 rounded-full bg-yellow-500 mr-2 focus:outline-none"
        @click="toggleMinimize"
      />
      <button
        class="w-3 h-3 rounded-full bg-green-500 focus:outline-none"
        @click="toggleMinimize"
      />
    </div>
    <div v-if="!isMinimized" class="p-4 text-gray-300 font-mono">
      <p class="text-green-400 mb-2">{{ command }}</p>
      <p class="text-sm md:text-base lg:text-lg leading-relaxed">
        <slot />
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    command?: string;
  }>(),
  {
    command: "$ cat developer_profile.txt",
  }
);

const isMinimized = ref(false);

const toggleMinimize = () => {
  isMinimized.value = !isMinimized.value;
};
</script>

