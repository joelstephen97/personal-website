<template>
  <div
    class="p-5 border border-red-100 rounded-2xl drop-shadow-2xl mb-4 bg-gray-800 text-white dark:text-white"
  >
    <h3 class="text-2xl font-bold mb-1 uppercase">{{ title }}</h3>
    <p class="font-bold">{{ company }} - {{ location }}</p>
    <p class="">{{ duration }}</p>
    <ul class="mt-3">
      <li v-for="task in tasks" :key="task" class="-mt-1">- {{ task }}</li>
    </ul>
    <p class="mt-2"><strong>Skills:</strong> {{ skills.join(", ") }}</p>
  </div>
</template>

<script>
export default {
  props: {
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
      type: Array,
      default: () => [],
    },
    skills: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<style scoped>
.job-experience-card {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
