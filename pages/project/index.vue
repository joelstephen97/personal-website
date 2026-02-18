<template>
  <div class="max-w-5xl mx-auto px-6 py-20">
    <!-- Header -->
    <div class="text-center mb-16">
      <p class="text-sm font-medium text-red-500 tracking-wide uppercase mb-4">
        Portfolio
      </p>
      <h1
        class="text-4xl md:text-5xl font-bold text-[rgb(var(--foreground))] mb-4"
      >
        Projects
      </h1>
      <p
        class="text-lg text-[rgb(var(--foreground-secondary))] max-w-md mx-auto"
      >
        Professional work and personal experiments.
      </p>
    </div>

    <!-- Professional Work -->
    <section class="mb-16">
      <div class="flex items-center gap-3 mb-6">
        <div
          class="w-8 h-8 rounded-lg bg-red-500 flex items-center justify-center"
        >
          <Icon name="Briefcase" :size="16" class="text-white" />
        </div>
        <h2 class="text-xl font-semibold text-[rgb(var(--foreground))]">
          Professional Work
        </h2>
      </div>

      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <a
          v-for="project in professional"
          :key="project.name"
          :href="project.url"
          target="_blank"
          rel="noopener"
          class="group glass-solid rounded-2xl p-6 hover:border-red-500/30 transition-all hover:-translate-y-1"
        >
          <div class="flex items-start justify-between mb-4">
            <div
              class="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/20"
            >
              <Icon :name="project.icon" :size="24" class="text-white" />
            </div>
            <Icon
              name="ArrowUpRight"
              :size="18"
              class="text-[rgb(var(--foreground-muted))] group-hover:text-red-500 transition-colors"
            />
          </div>
          <h3
            class="text-lg font-semibold text-[rgb(var(--foreground))] group-hover:text-red-500 transition-colors mb-1"
          >
            {{ project.name }}
          </h3>
          <p class="text-xs text-red-500 font-medium mb-2">
            {{ project.company }}
          </p>
          <p
            class="text-sm text-[rgb(var(--foreground-secondary))] leading-relaxed"
          >
            {{ project.description }}
          </p>
          <div class="flex flex-wrap gap-1.5 mt-4">
            <span
              v-for="tech in project.tech"
              :key="tech"
              class="px-2 py-0.5 rounded text-xs bg-[rgb(var(--glass))] text-[rgb(var(--foreground-muted))] border border-[rgb(var(--border))]"
            >
              {{ tech }}
            </span>
          </div>
        </a>
      </div>
    </section>

    <!-- Side Projects / Hobbies -->
    <section>
      <div class="flex items-center gap-3 mb-6">
        <div
          class="w-8 h-8 rounded-lg bg-[rgb(var(--foreground-muted))] flex items-center justify-center"
        >
          <Icon name="Sparkles" :size="16" class="text-white" />
        </div>
        <h2 class="text-xl font-semibold text-[rgb(var(--foreground))]">
          Side Projects
        </h2>
      </div>

      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <NuxtLink
          v-for="project in hobbies"
          :key="project.id"
          :to="project.link"
          class="group glass-solid rounded-2xl p-6 hover:border-red-500/30 transition-all hover:-translate-y-1"
        >
          <div
            class="w-12 h-12 rounded-xl bg-[rgb(var(--glass))] border border-[rgb(var(--border))] flex items-center justify-center mb-4 group-hover:border-red-500/50 transition-colors"
          >
            <Icon
              :name="project.icon"
              :size="24"
              class="text-[rgb(var(--foreground-secondary))] group-hover:text-red-500 transition-colors"
            />
          </div>
          <h3
            class="text-lg font-semibold text-[rgb(var(--foreground))] group-hover:text-red-500 transition-colors mb-2"
          >
            {{ project.title }}
          </h3>
          <p
            class="text-sm text-[rgb(var(--foreground-secondary))] mb-4 leading-relaxed"
          >
            {{ project.description }}
          </p>
          <span
            class="inline-flex items-center gap-1 text-sm font-medium text-red-500"
          >
            {{ project.cta }}
            <Icon
              name="ArrowRight"
              :size="16"
              class="group-hover:translate-x-1 transition-transform"
            />
          </span>
        </NuxtLink>

        <!-- Coming Soon -->
        <div
          class="glass-solid rounded-2xl p-6 flex flex-col items-center justify-center text-center opacity-60"
        >
          <div
            class="w-12 h-12 rounded-xl bg-[rgb(var(--glass))] border border-dashed border-[rgb(var(--border))] flex items-center justify-center mb-4"
          >
            <Icon
              name="Plus"
              :size="24"
              class="text-[rgb(var(--foreground-muted))]"
            />
          </div>
          <p class="text-sm text-[rgb(var(--foreground-muted))]">
            More coming soon
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import Icon from "~/components/ui/Icon.vue";

const professional = [
  {
    name: "Opus",
    company: "APPLIED AI INNOVATION RESEARCH - SOLE PROPRIETORSHIP L.L.C.",
    url: "https://app.opus.com/",
    icon: "Workflow",
    description:
      "Low-code/no-code AI workflow builder. Built core features for creating and deploying AI-driven automation processes.",
    tech: ["Vue.js", "React", "TypeScript", "Node.js"],
  },
  {
    name: "Flower Meister International",
    company: "Otani Trading FZCO",
    url: "https://flowermeister.com/",
    icon: "Flower2",
    description:
      "B2B platform connecting flower growers and exporters with importers worldwide. Led frontend development and UI/UX design.",
    tech: ["Nuxt.js", "Vue.js", "GraphQL", "Python"],
  },
  {
    name: "RIOT",
    company: "Preowned Collective Portal (Acquired)",
    url: "https://wayback-classic.net/cgi-bin/history.cgi?q=riothere.com&utf8=%E2%9C%93",
    icon: "ShoppingBag",
    description:
      "Luxury consignment e-commerce platform. Built payment integrations, APIs, and managed live website operations.",
    tech: ["PHP", "React", "Next.js", "REST APIs"],
  },
];

const hobbies = [
  {
    id: 1,
    title: "R6 Siege Randomizer",
    description: "Random operator selection for Rainbow Six Siege matches.",
    link: "/project/rainbow-6-randomizer",
    cta: "Try it",
    icon: "Shuffle",
  },
  {
    id: 2,
    title: "Background Remover",
    description: "AI-powered tool to remove image backgrounds instantly.",
    link: "/project/bg-remover",
    cta: "Remove backgrounds",
    icon: "ImageMinus",
  },
  {
    id: 3,
    title: "Aim Trainer",
    description: "Improve your FPS aim with this reaction time trainer.",
    link: "/project/aim-trainer",
    cta: "Train now",
    icon: "Target",
  },
];
</script>
