<template>
  <UContainer>
    <!-- Section Header -->
    <div class="w-full pt-10 md:pt-24 lg:pt-32 flex-row pb-10">
      <h1
        class="lg:leading-tighter pb-2 text-4xl font-bold tracking-tighter sm:text-2xl md:text-4xl xl:text-6xl 2xl:text-6xl -mt-8 md:-mt-20"
      >
        <TypingEffect :strings="['PROJECTS']" :loop="false" />
      </h1>
      <p class="text-lg text-gray-800 dark:text-gray-200 mt-4">
        A showcase of my latest experiments and fun utilities. Dive in and
        explore!
      </p>
    </div>
    <!-- Projects Grid -->
    <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      <ProjectCard
        v-for="proj in projects"
        :key="proj.id"
        :title="proj.title"
        :description="proj.description"
        :link="proj.link"
        :button-text="proj.buttonText"
      />

      <!-- Placeholder for Future Projects -->
      <div>
        <UCard
          :ui="{ background: 'bg-white dark:bg-black' }"
          class="rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-800 h-full flex items-center justify-center"
        >
          <div class="text-center text-gray-500 dark:text-gray-400">
            More coming soon...
          </div>
        </UCard>
      </div>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
interface Project {
  id: number;
  title: string;
  description: string;
  link: string;
  buttonText?: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: "Rainbow 6 Randomizer",
    description:
      "Randomize your operator picks for Rainbow Six Siege with a few clicks.",
    link: "/project/rainbow-6-randomizer",
    buttonText: "Try It Out",
  },
  {
    id: 2,
    title: "Basic Background Remover",
    description:
      "Remove backgrounds from your PNG/JPG images instantly with this easy-to-use tool.",
    link: "/project/bg-remover",
    buttonText: "Remove Backgrounds",
  },
  {
    id: 3,
    title: "Basic Aim Trainer",
    description:
      "Train you aim for FPS games",
    link: "/project/aim-trainer",
    buttonText: "Train your aim",
  },
];
</script>
