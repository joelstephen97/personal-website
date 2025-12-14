<template>
  <PageContainer>
    <!-- Section Header -->
    <PageHeader
      title="PROJECTS"
      subtitle="A showcase of my latest experiments and fun utilities. Dive in and explore!"
      title-class="-mt-8 md:-mt-20"
    />
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
  </PageContainer>
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
    description: "Train you aim for FPS games",
    link: "/project/aim-trainer",
    buttonText: "Train your aim",
  },
];
</script>
