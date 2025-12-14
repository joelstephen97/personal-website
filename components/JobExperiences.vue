<template>
  <div
    class="job-experience-card group hover:shadow-lg transition-all duration-300 ease-in-out"
  >
    <div
      class="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-gray-800 dark:text-white shadow-md relative overflow-hidden"
    >
      <div
        class="absolute left-0 top-0 bottom-0 w-1 bg-red-600 group-hover:w-2 transition-all duration-300"
      />

      <div class="pl-4">
        <div
          class="flex flex-col md:flex-row md:justify-between md:items-start gap-2"
        >
          <div>
            <h3 class="text-2xl font-bold mb-1 text-red-700 dark:text-red-500">
              {{ title }}
            </h3>
            <p class="font-bold text-gray-800 dark:text-gray-200">
              {{ company }}
            </p>
          </div>
          <div class="text-right">
            <p class="text-gray-600 dark:text-gray-400">{{ location }}</p>
            <p class="text-gray-600 dark:text-gray-400 font-medium">
              {{ duration }}
            </p>
          </div>
        </div>

        <div class="mt-4">
          <p class="font-semibold mb-2 text-gray-800 dark:text-gray-200">
            Responsibilities:
          </p>
          <ul class="space-y-2 text-gray-700 dark:text-gray-300">
            <li v-for="task in tasks" :key="task" class="flex items-start">
              <UIcon
                name="i-heroicons-check-circle"
                class="text-red-600 dark:text-red-400 w-5 h-5 mr-2 flex-shrink-0 mt-1"
              />
              <span v-html="formatTaskWithLinks(task)"></span>
            </li>
          </ul>
        </div>

        <div class="mt-4">
          <p class="font-semibold mb-2 text-gray-800 dark:text-gray-200">
            Skills:
          </p>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="skill in skills"
              :key="skill"
              class="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 px-3 py-1 rounded-full text-sm font-medium"
            >
              {{ skill }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    default: "Job Title",
  },
  company: {
    type: String,
    default: "Company Name",
  },
  location: {
    type: String,
    default: "Location",
  },
  duration: {
    type: String,
    default: "Duration",
  },
  tasks: {
    type: Array<string>,
    default: () => [],
  },
  skills: {
    type: Array<string>,
    default: () => [],
  },
});

const formatTaskWithLinks = (task: string): string => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return task.replace(
    urlRegex,
    '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-red-600 dark:text-red-400 hover:underline">$1</a>'
  );
};
</script>
