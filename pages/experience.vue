<template>
  <div class="max-w-5xl mx-auto px-6 py-20">
    <!-- Header -->
    <div class="text-center mb-16">
      <p class="text-sm font-medium text-red-500 tracking-wide uppercase mb-4">
        Career
      </p>
      <h1
        class="text-4xl md:text-5xl font-bold text-[rgb(var(--foreground))] mb-4"
      >
        Experience
      </h1>
      <div
        class="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-solid"
      >
        <Icon name="Briefcase" :size="18" class="text-red-500" />
        <span class="text-sm font-medium text-[rgb(var(--foreground))]"
          >{{ totalYears }}+ years in tech</span
        >
      </div>
    </div>

    <!-- Timeline -->
    <div class="space-y-6">
      <div
        v-for="(job, i) in jobs"
        :key="i"
        class="relative pl-8 pb-8 border-l-2 border-[rgb(var(--border))] last:pb-0"
      >
        <!-- Dot -->
        <div
          class="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-red-500 ring-4 ring-[rgb(var(--bg))]"
        />

        <!-- Card -->
        <div
          class="glass-solid rounded-2xl p-6 hover:border-red-500/30 transition-colors"
        >
          <div
            class="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-4"
          >
            <div>
              <h3 class="text-xl font-semibold text-red-500">
                {{ job.title }}
              </h3>
              <p class="text-[rgb(var(--foreground))] font-medium">
                {{ job.company }}
              </p>
            </div>
            <div
              class="text-sm text-[rgb(var(--foreground-secondary))] md:text-right"
            >
              <p class="flex items-center gap-1">
                <Icon name="MapPin" :size="14" /> {{ job.location }}
              </p>
              <p class="flex items-center gap-1">
                <Icon name="Calendar" :size="14" /> {{ job.duration }}
              </p>
            </div>
          </div>

          <ul class="space-y-2 mb-4">
            <li
              v-for="task in job.tasks"
              :key="task"
              class="flex items-start gap-2 text-sm text-[rgb(var(--foreground-secondary))]"
            >
              <Icon
                name="Check"
                :size="16"
                class="text-red-500 mt-0.5 flex-shrink-0"
              />
              <span>{{ task }}</span>
            </li>
          </ul>

          <div class="flex flex-wrap gap-2">
            <span
              v-for="skill in job.skills"
              :key="skill"
              class="px-2.5 py-1 rounded-md text-xs font-medium bg-red-500/10 text-red-500"
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
import Icon from "~/components/ui/Icon.vue";

const totalYears = 5;

const jobs = [
  {
    title: "Frontend Engineer",
    company: "Applied AI",
    location: "Abu Dhabi, UAE",
    duration: "Jun 2025 - Present",
    tasks: [
      "Core development of low-code Workflow Builder",
      "Building reusable UI components with Vue.js and React",
      "Cross-functional collaboration on AI-driven interfaces",
    ],
    skills: ["Vue.js", "React", "TypeScript", "Tailwind"],
  },
  {
    title: "Senior Software Engineer",
    company: "Otani Trading FZCO",
    location: "Dubai, UAE",
    duration: "Jun 2024 - Feb 2025",
    tasks: [
      "Leading frontend development and mentoring juniors",
      "Architecture decisions and UI/UX design with Figma",
      "Building with Nuxt, Radix UI, and shadcn",
    ],
    skills: ["Nuxt.js", "GraphQL", "Radix UI"],
  },
  {
    title: "Software Engineer",
    company: "Otani Trading FZCO",
    location: "Dubai, UAE",
    duration: "Sep 2023 - Jul 2024",
    tasks: [
      "Full-stack development with Vue.js and FastAPI",
      "Test-driven development with Pytest and Cypress",
    ],
    skills: ["FastAPI", "Python", "PostgreSQL"],
  },
  {
    title: "Junior Software Engineer",
    company: "RIOT",
    location: "Dubai, UAE",
    duration: "May 2020 - Feb 2023",
    tasks: [
      "E-commerce platform development and payment integrations",
      "API development and technical documentation",
    ],
    skills: ["PHP", "React", "Next.js", "REST APIs"],
  },
];
</script>
