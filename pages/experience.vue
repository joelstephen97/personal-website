<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 py-8">
    <!-- Header -->
    <header class="text-center mb-8" aria-labelledby="experience-heading">
      <p class="text-xs font-medium text-accent tracking-wide uppercase mb-2">
        Career
      </p>
      <h1
        id="experience-heading"
        class="text-h2 font-bold text-foreground mb-1"
      >
        Experience
      </h1>
      <div
        class="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-solid"
        :title="`${totalYears}+ years of professional experience`"
      >
        <Icon name="Briefcase" :size="18" class="text-accent" />
        <span class="text-sm font-medium text-foreground">{{ totalYears }}+ yrs</span>
      </div>
    </header>

    <!-- Timeline -->
    <section class="space-y-6" aria-label="Career timeline">
      <div
        v-for="(job, i) in jobs"
        :key="i"
        class="relative pl-8 pb-8 border-l-2 border-border last:pb-0"
      >
        <!-- Dot -->
        <div
          class="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-accent ring-4 ring-[rgb(var(--bg))]"
        />

        <!-- Card -->
        <div
          class="glass-solid rounded-2xl p-6 hover:border-accent/30 transition-colors"
        >
          <div
            class="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-4"
          >
            <div>
              <h3 class="text-h3 font-semibold text-accent">
                {{ job.title }}
              </h3>
              <p class="text-foreground font-medium">
                {{ job.company }}
              </p>
            </div>
            <div
              class="text-sm text-muted md:text-right"
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
              class="flex items-start gap-2 text-sm text-muted"
            >
              <Icon
                name="Check"
                :size="16"
                class="text-accent mt-0.5 flex-shrink-0"
              />
              <span>{{ task }}</span>
            </li>
          </ul>

          <div class="flex flex-wrap gap-2">
            <span
              v-for="skill in job.skills"
              :key="skill"
              class="px-2.5 py-1 rounded-md text-xs font-medium bg-accent/10 text-accent"
            >
              {{ skill }}
            </span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import Icon from "~/components/ui/Icon.vue";

const totalYears = 5;

const jobs = [
  {
    title: "Frontend Engineer",
    company: "AppliedAI",
    location: "Abu Dhabi, UAE",
    duration: "Jun 2025 - Present",
    tasks: [
      "Opus AI workflow product. Vue/React production features.",
      "Reusable UI components for complex multi-step workflows.",
      "Collaboration with backend, product, and design.",
      "Performance, maintainability, and UX improvements.",
      "Code reviews, sprint planning, iterative delivery.",
    ],
    skills: ["Vue.js", "React", "TypeScript", "AI Workflows"],
  },
  {
    title: "Senior Software Engineer",
    company: "Otani Trading FZCO",
    location: "Dubai, UAE",
    duration: "Jul 2024 - Feb 2025",
    tasks: [
      "Led frontend on PWA; trained juniors, managed team.",
      "Project direction, requirements, DevOps.",
      "UI/UX with Figma, shadcn, Nuxt, Vue, Radix.",
      "GraphQL (URQL, Strawberry); OpenCV, YOLO for ML.",
    ],
    skills: ["Nuxt.js", "Vue.js", "GraphQL", "OpenCV", "YOLO", "Figma"],
  },
  {
    title: "Software Engineer",
    company: "Otani Trading FZCO",
    location: "Dubai, UAE",
    duration: "Sep 2023 - Jul 2024",
    tasks: [
      "Full-stack Vue, TypeScript, FastAPI, Python.",
      "Project FMI: B2B app, 7 major features, FastAPI/Peewee.",
      "Project Valit: PWA, GraphQL, Strawberry, DynamoDB.",
      "ShadCN, RadixVue, Pytest, Cypress.",
      "Led features, mentored, agile sprints.",
    ],
    skills: ["Vue.js", "FastAPI", "Python", "GraphQL", "DynamoDB", "Pytest", "Cypress"],
  },
  {
    title: "Junior Software Engineer",
    company: "RIOT by Preowned Collective Portal FZ LLC",
    location: "Dubai, UAE",
    duration: "Sep 2019 - Feb 2023",
    tasks: [
      "3 payment gateways, 3rd-party integrations.",
      "Node.js/React site launch; data migration.",
      "Google Ads, Analytics; Python automation.",
      "JIRA, Figma for requirements and prototyping.",
    ],
    skills: ["Node.js", "React", "Python", "JIRA", "Figma"],
  },
  {
    title: "SDE Intern",
    company: "Alucor Limited",
    location: "Dubai, UAE",
    duration: "Jan 2019 - Jul 2019",
    tasks: [
      "Web app replacing MS Excel; Django, SQLAlchemy.",
      "REST APIs, LDAP auth, event-driven UI.",
      "PEP8, documentation.",
    ],
    skills: ["Django", "Python", "SQLAlchemy", "REST APIs", "LDAP"],
  },
];
</script>
