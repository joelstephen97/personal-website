<template>
  <UContainer>
    <div class="w-full pt-12 md:pt-24 lg:pt-32 flex-row">
      <div class="container space-y-10 xl:space-y-16">
        <div class="grid gap-4 md:grid-cols-2 md:gap-16">
          <div>
            <h1 className="lg:leading-tighter pb-2 text-5xl font-bold tracking-tighter sm:text-5xl md:text-6xl xl:text-7xl 2xl:text-8xl">
              <TypingEffect :strings="['Joel Stephen']" :loop="false" />
            </h1>
            <h2 class="text-5xl font-bold tracking-tighter sm:text-5xl md:text-5xl pb-2">
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
          </div>
        </div>
      </div>
    </div>
    <div class="pt-4 flex-col space-x-4 pb-4">
      <UButton color="black" class="text-md uppercase hover:italic" variant="solid" size="xl" @click="onClickFrontend()">Front-end Stack</UButton>
      <UButton color="black" class="text-md uppercase hover:italic" variant="solid" size="xl" @click="onClickBackend()">Back-end Stack</UButton>
      <UButton color="black" class="text-md uppercase hover:italic" variant="solid" size="xl" @click="onClickTools()">Tools</UButton>
    </div>
    <div v-if="frontendSelected" class="grid max-w-[700px] grid-cols-1 md:grid-cols-3 gap-4">
      <div v-for="tech in frontendTech" :key="tech.name" class="flex items-center space-x-2">
        <span class="text-xl font-bold">{{ tech.name }}</span>
      </div>
    </div>
  
    <div v-if="backendSelected" class="grid max-w-[700px] grid-cols-1 md:grid-cols-3 gap-4">
      <div v-for="tech in backendTech" :key="tech.name" class="flex items-center space-x-2">
        <span class="text-xl font-bold">{{ tech.name }}</span>
      </div>
    </div>
    
    <div v-if="toolsSelected" class="grid max-w-[700px] grid-cols-1 md:grid-cols-3 gap-4">
      <div v-for="tool in tools" :key="tool.name" class="flex items-center space-x-2">
        <span class="text-xl font-bold">{{ tool.name }}</span>
      </div>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
import { ref } from "vue"

const backendSelected = ref(false);
const frontendSelected = ref(false);
const toolsSelected = ref(false);

const onClickBackend = () => {
  backendSelected.value = !backendSelected.value;
  frontendSelected.value = false;
  toolsSelected.value = false;
}
const onClickFrontend = () => {
  frontendSelected.value = !frontendSelected.value;
  backendSelected.value = false;
  toolsSelected.value = false;
}
const onClickTools = () => {
  toolsSelected.value = !toolsSelected.value;
  backendSelected.value = false;
  frontendSelected.value = false;
}

const frontendTech = [
  { name: 'Vue.js'},
  { name: 'React'},
  { name: 'Angular'},
  { name: 'JavaScript'},
  { name: 'jQuery'},
]

const backendTech = [
  { name: 'Python'},
  { name: 'PHP'},
  { name: 'Java'},
]

const tools = [
  { name: 'Linux'},
  { name: 'Postman'},
  { name: 'REST API'},
  { name: 'GraphQL'},
  { name: 'Docker'},
  { name: 'Cypress'},
]

const isMinimized = ref(false)

const toggleMinimize = () => {
  isMinimized.value = !isMinimized.value
}
</script>