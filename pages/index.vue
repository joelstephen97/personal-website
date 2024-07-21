<template>
  <UContainer>
    <div class="w-full pt-12 md:pt-24 lg:pt-32 flex-row pb-10">
      <div class="container space-y-10 xl:space-y-16">
        <div class="grid gap-4 md:grid-cols-2 md:gap-16">
          <div>
            <h1 class="lg:leading-tighter pb-2 text-4xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-6xl 2xl:text-7xl">
              <TypingEffect :strings="['Joel Stephen']" :loop="false" />
            </h1>
            <h2 class="text-3xl font-bold tracking-tighter sm:text-4xl md:text-4xl pb-2">
              <TypingEffect :strings="['Full-stack Engineer','Front-end','Back-end','UI-UX','Testing']" />
            </h2>
            <div class="max-w-[700px] mx-auto my-5 bg-gray-800 rounded-lg overflow-hidden shadow-lg">
              <div class="bg-gray-700 px-4 py-2 flex items-center">
                <button @click="toggleMinimize" class="w-3 h-3 rounded-full bg-red-500 mr-2 focus:outline-none"></button>
                <button @click="toggleMinimize" class="w-3 h-3 rounded-full bg-yellow-500 mr-2 focus:outline-none"></button>
                <button @click="toggleMinimize" class="w-3 h-3 rounded-full bg-green-500 focus:outline-none"></button>
              </div>
              <div v-if="!isMinimized" class="p-4 text-gray-300 font-mono">
                <p class="text-green-400 mb-2">$ cat developer_profile.txt</p>
                <p class="text-sm md:text-base lg:text-lg leading-relaxed">
                  Experienced in building scalable and performant web applications using modern technologies. Passionate about creating intuitive UI and solving complex problems both in backend and frontend.
                </p>
              </div>
            </div>

            <div class="pt-4 pb-4 flex flex-col space-y-4">
              <div class="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                <div class="flex flex-col space-y-4">
                  <UButton color="black" class="text-md uppercase hover:italic" variant="solid" size="xl" @click="onClickFrontend">Front-end Stack</UButton>
                  <div v-if="frontendSelected" class="sm:hidden grid max-w-[700px] grid-cols-1 gap-4">
                    <div v-for="tech in frontendTech" :key="tech.name" class="flex items-center space-x-2 cursor-pointer" @click="scrollToSkill(tech.name)">
                      <span class="text-xl font-bold">{{ tech.name }}</span>
                    </div>
                  </div>
                </div>

                <div class="flex flex-col space-y-4">
                  <UButton color="black" class="text-md uppercase hover:italic" variant="solid" size="xl" @click="onClickBackend">Back-end Stack</UButton>
                  <div v-if="backendSelected" class="sm:hidden grid max-w-[700px] grid-cols-1 gap-4">
                    <div v-for="tech in backendTech" :key="tech.name" class="flex items-center space-x-2 cursor-pointer" @click="scrollToSkill(tech.name)">
                      <span class="text-xl font-bold">{{ tech.name }}</span>
                    </div>
                  </div>
                </div>

                <div class="flex flex-col space-y-4">
                  <UButton color="black" class="text-md uppercase hover:italic" variant="solid" size="xl" @click="onClickTools">Tools</UButton>
                  <div v-if="toolsSelected" class="sm:hidden grid max-w-[700px] grid-cols-1 gap-4">
                    <div v-for="tool in tools" :key="tool.name" class="flex items-center space-x-2 cursor-pointer" @click="scrollToSkill(tool.name)">
                      <span class="text-xl font-bold">{{ tool.name }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Content for larger screens -->
              <div class="hidden sm:block">
                <div v-if="frontendSelected" class="grid max-w-[700px] grid-cols-1 md:grid-cols-2 gap-4">
                  <div v-for="tech in frontendTech" :key="tech.name" class="flex items-center space-x-2 cursor-pointer" @click="scrollToSkill(tech.name)">
                    <span class="text-xl font-bold">{{ tech.name }}</span>
                  </div>
                </div>

                <div v-if="backendSelected" class="grid max-w-[700px] grid-cols-1 md:grid-cols-2 gap-4">
                  <div v-for="tech in backendTech" :key="tech.name" class="flex items-center space-x-2 cursor-pointer" @click="scrollToSkill(tech.name)">
                    <span class="text-xl font-bold">{{ tech.name }}</span>
                  </div>
                </div>

                <div v-if="toolsSelected" class="grid max-w-[700px] grid-cols-1 md:grid-cols-2 gap-4">
                  <div v-for="tool in tools" :key="tool.name" class="flex items-center space-x-2 cursor-pointer" @click="scrollToSkill(tool.name)">
                    <span class="text-xl font-bold">{{ tool.name }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- Timeline Section -->
          <div class="max-h-[600px] overflow-y-auto p-5 bg-gray-800 rounded-lg hide-scrollbar">
            <h2 class="text-2xl font-bold mb-4 text-white dark:text-white text-center">Skill Timeline</h2>
            <div class="relative pl-2 border-l-2 border-green-600">
              <div v-for="item in sortedTimelineData" :key="`${item.skill}-${item.start}`" class="mb-5 relative timeline-item rounded-lg border-2 border-black" :data-skill="item.skill">
                <div class="absolute -left-[25px] top-7 w-3 h-3 bg-white border-2 border-gray-800 rounded-full"></div>
                <div class="p-3 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors duration-300">
                  <h3 class="text-xl font-semibold text-white dark:text-white">{{ item.skill }}</h3>
                  <p class="text-white dark:text-white">{{ calculateDuration(item.start, item.end) }} {{ calculateDuration(item.start, item.end) === 1 ? 'year' : 'years' }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
import { ref, nextTick } from "vue";

const backendSelected = ref(false);
const frontendSelected = ref(false);
const toolsSelected = ref(false);

const onClickBackend = () => {
  backendSelected.value = !backendSelected.value;
  frontendSelected.value = false;
  toolsSelected.value = false;
};

const onClickFrontend = () => {
  frontendSelected.value = !frontendSelected.value;
  backendSelected.value = false;
  toolsSelected.value = false;
};

const onClickTools = () => {
  toolsSelected.value = !toolsSelected.value;
  backendSelected.value = false;
  frontendSelected.value = false;
};

const frontendTech = [
  { name: 'Vue.js' },
  { name: 'React' },
  { name: 'Angular' },
  { name: 'JavaScript' },
  { name: 'jQuery' },
];

const backendTech = [
  { name: 'Python' },
  { name: 'PHP' },
  { name: 'Java' },
];

const tools = [
  { name: 'Linux' },
  { name: 'Postman' },
  { name: 'REST API' },
  { name: 'GraphQL' },
  { name: 'Docker' },
  { name: 'Cypress' },
];

const isMinimized = ref(false);

const toggleMinimize = () => {
  isMinimized.value = !isMinimized.value;
};

const timelineData = [
  { skill: 'Java', start: '2015-08', end: '2019-08' },
  { skill: 'Python', start: '2019-01', end: '2024-07' },
  { skill: 'jQuery', start: '2019-09', end: '2023-05' },
  { skill: 'PHP', start: '2019-09', end: '2023-01' },
  { skill: 'JavaScript', start: '2019-09', end: '2024-07' },
  { skill: 'React', start: '2021-02', end: '2023-01' },
  { skill: 'Angular', start: '2023-03', end: '2023-05' },
  { skill: 'Vue.js', start: '2023-08', end: '2024-07' },
  { skill: 'Linux', start: '2019-08', end: '2024-07' },
  { skill: 'Postman', start: '2021-08', end: '2024-07' },
  { skill: 'REST API', start: '2019-08', end: '2024-07' },
  { skill: 'GraphQL', start: '2023-08', end: '2024-07' },
  { skill: 'Docker', start: '2023-08', end: '2024-07' },
  { skill: 'Cypress', start: '2023-08', end: '2024-07' },
];

const calculateDuration = (start: string, end: string): number => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const durationInYears = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 365));
  return durationInYears;
};

const sortedTimelineData = timelineData.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

const scrollToSkill = (skill: string) => {
  nextTick(() => {
    const element = document.querySelector(`.timeline-item[data-skill="${skill}"]`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.classList.add('highlight','animate-pulse');
      setTimeout(() => element.classList.remove('highlight'), 1000);
    }
  });
};
</script>

<style scoped>
.highlight {
  border-color: #ff0000;
  transition: background-color 1s ease;
}
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
/* Hide scrollbar for IE, Edge, and Firefox */
.hide-scrollbar {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;     /* Firefox */
}
</style>
