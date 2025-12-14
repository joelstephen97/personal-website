<template>
  <div
    class="max-h-[600px] overflow-y-auto p-5 bg-gray-800 rounded-lg hide-scrollbar"
  >
    <h2
      class="text-2xl font-bold mb-4 text-white dark:text-white text-center"
    >
      {{ title }}
    </h2>
    <div class="relative pl-2 border-l-2 border-green-600">
      <div
        v-for="item in sortedTimelineData"
        :key="`${item.skill}-${item.start}`"
        class="mb-5 relative timeline-item rounded-lg border-2 border-black"
        :data-skill="item.skill"
      >
        <div
          class="absolute -left-[25px] top-7 w-3 h-3 bg-white border-2 border-gray-800 rounded-full"
        />
        <div
          class="p-3 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors duration-300"
        >
          <h3 class="text-xl font-semibold text-white dark:text-white">
            {{ item.skill }}
          </h3>
          <p class="text-white dark:text-white">
            {{ calculateDuration(item.start, item.end) }}
            {{
              calculateDuration(item.start, item.end) === 1 ? "year" : "years"
            }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface TimelineItem {
  skill: string;
  start: string;
  end: string;
}

const props = defineProps<{
  timelineData: TimelineItem[];
  title?: string;
}>();

const calculateDuration = (start: string, end: string): number => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const durationInYears = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 365),
  );
  return durationInYears;
};

const sortedTimelineData = computed(() =>
  [...props.timelineData].sort(
    (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
  ),
);
</script>

<style scoped>
.timeline-item.highlight {
  border-color: #ff0000;
  transition: background-color 1s ease;
}
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
/* Hide scrollbar for IE, Edge, and Firefox */
.hide-scrollbar {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>

