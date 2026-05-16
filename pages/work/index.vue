<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 py-8">
    <PageHeader
      id="work-heading"
      title="Work"
      eyebrow="Case studies"
      subtitle="Five roles across five years. Each card links to the deeper story — what the product was, what I shipped, what I learned."
    />

    <section
      v-reveal
      class="grid sm:grid-cols-2 gap-4"
      aria-label="Professional work case studies"
    >
      <NuxtLink
        v-for="(item, i) in work"
        :key="item.slug"
        v-reveal="{ delay: i * 80 }"
        :to="item.to"
        class="block glass-solid rounded-2xl p-6 hover:border-accent/30 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/5 transition-all"
      >
        <div class="flex items-start gap-3 mb-3">
          <div
            class="w-10 h-10 rounded-lg bg-gradient-to-br from-accent to-accent-hover flex items-center justify-center shadow-lg shadow-accent/20 shrink-0"
          >
            <Icon :name="item.icon" :size="18" class="text-white" />
          </div>
          <div class="flex-1 min-w-0">
            <h2 class="text-h3 font-semibold text-accent leading-tight">
              {{ item.title }}
            </h2>
            <p class="text-sm text-foreground font-medium">
              {{ item.company }}
            </p>
            <p class="text-xs text-muted">{{ item.duration }}</p>
          </div>
          <span
            v-if="item.status === 'current'"
            class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-accent/10 text-accent text-xs font-medium shrink-0"
          >
            <span class="relative inline-flex h-1.5 w-1.5" aria-hidden="true">
              <span
                class="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"
              />
              <span
                class="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent"
              />
            </span>
            Current
          </span>
        </div>
        <p class="text-sm text-muted mb-3">{{ item.summary }}</p>
        <div class="flex flex-wrap gap-1.5">
          <span
            v-for="t in item.tags"
            :key="t"
            class="px-2 py-0.5 rounded-md glass text-xs text-muted-foreground"
            >{{ t }}</span
          >
        </div>
        <div
          v-if="item.cta"
          class="mt-3 inline-flex items-center gap-1 text-xs font-medium text-accent"
        >
          {{ item.cta }}
          <Icon name="ArrowRight" :size="14" />
        </div>
      </NuxtLink>
    </section>

    <!-- Side projects bridge -->
    <section v-reveal class="mt-10" aria-label="Side projects">
      <div class="glass-solid rounded-2xl p-6 text-center space-y-3">
        <h2 class="text-h3 font-semibold text-foreground">
          Looking for the interactive demos?
        </h2>
        <p class="text-sm text-muted max-w-2xl mx-auto">
          Side projects — pathfinding visualizers, in-browser ML demos
          (transformers.js, image captioning, speech-to-text), dev tools, and a
          few games — live on the Projects page.
        </p>
        <UiButton variant="primary" to="/project" class="inline-flex">
          <Icon name="FolderOpen" :size="18" />
          Browse interactive projects
        </UiButton>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import Icon from "~/components/ui/Icon.vue";

useSeo({
  title: "Work | Joel Stephen — Case Studies",
  description:
    "Case studies of Joel Stephen's professional work: Opus at AppliedAI (Process Discovery, Opus Technical Canvas, Opus-CX), Flower Meister at Otani Trading (YOLO v5 + OpenCV computer vision), Project FMI, RIOT, and Alucor.",
});

const work = [
  {
    slug: "opus",
    title: "Opus — AI workflow platform",
    company: "AppliedAI",
    duration: "Jun 2025 — Present · Abu Dhabi, UAE",
    icon: "Cpu",
    status: "current" as const,
    summary:
      "Three production surfaces: Process Discovery (React + Yjs/CRDT multiplayer canvas), Opus Technical Canvas (n8n fork in Vue + TypeScript), and Opus-CX (React + Zustand). Anthropic and OpenAI models inside.",
    tags: [
      "React",
      "Vue",
      "TypeScript",
      "Yjs/CRDT",
      "FastAPI",
      "Anthropic",
      "OpenAI",
    ],
    to: "/work/opus",
    cta: "Read the full case study",
  },
  {
    slug: "flower-meister",
    title: "Flower Meister — B2C PWA for the flower trade",
    company: "Otani Trading FZCO",
    duration: "Jul 2024 — Feb 2025 · Dubai, UAE",
    icon: "Flower2",
    status: "past" as const,
    summary:
      "Led frontend, data layer, and DevOps on a PWA that used YOLO v5 + OpenCV to turn grower photographs into proof of flower-variant quality — enabled bulk purchase deals worth millions, shipped internationally.",
    tags: [
      "Vue 3",
      "shadcn",
      "URQL",
      "Strawberry",
      "FastAPI",
      "YOLO v5",
      "OpenCV",
    ],
    to: "/work/flower-meister",
    cta: "Read the full case study",
  },
  {
    slug: "project-fmi",
    title: "Project FMI — B2B operational platform",
    company: "Otani Trading FZCO",
    duration: "Sep 2023 — Jul 2024 · Dubai, UAE",
    icon: "LayoutGrid",
    status: "past" as const,
    summary:
      "Embedded with vendor, merchant, and admin user groups; shipped 7 major features driven by direct user requirements. Backend in FastAPI + Pydantic + Peewee; GraphQL with Strawberry + DynamoDB on Project Valit. UI in VueJS + RadixVue + shadcn.",
    tags: [
      "Vue.js",
      "FastAPI",
      "Python",
      "GraphQL",
      "Strawberry",
      "DynamoDB",
      "Pytest",
      "Cypress",
    ],
    to: "/experience#fmi",
    cta: "See on experience page",
  },
  {
    slug: "riot",
    title: "RIOT customer-facing platform",
    company: "Preowned Collective Portal FZ LLC",
    duration: "Sep 2019 — Feb 2023 · Dubai, UAE",
    icon: "ShoppingBag",
    status: "past" as const,
    summary:
      "Led cross-functional features on a customer-facing Node.js + React.js platform. Integrated 3 payment gateways and multiple third-party services. Migrated data from a legacy platform. Automated operational tasks in Python.",
    tags: ["Node.js", "React", "Python", "Payment gateways"],
    to: "/experience#riot",
    cta: "See on experience page",
  },
];
</script>
