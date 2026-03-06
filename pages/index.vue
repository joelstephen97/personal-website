<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 py-8">
    <!-- Hero with gradient mesh + neural dots -->
    <div class="relative">
      <HeroGradientMesh />
      <NeuralDots />

      <!-- Floating glass decorative elements -->
      <div
        class="absolute top-8 -left-8 w-20 h-20 rounded-2xl glass opacity-40 dark:opacity-60 animate-float hidden sm:block"
        aria-hidden="true"
      />
      <div
        class="absolute bottom-16 -right-6 w-14 h-14 rounded-full glass opacity-30 dark:opacity-50 animate-float-slow hidden sm:block"
        style="animation-delay: -3s"
        aria-hidden="true"
      />
      <div
        class="absolute top-1/2 right-12 w-10 h-10 rounded-lg glass opacity-20 dark:opacity-40 animate-float hidden lg:block"
        style="animation-delay: -6s"
        aria-hidden="true"
      />

      <PageHeader
        id="hero-heading"
        title="Joel Stephen"
        eyebrow="Software Engineer"
        subtitle="Modern web. Clean code. Strong UX."
        subtitle-class="mb-4"
        animate
        :style="heroParallaxStyle"
      >
        <div
          v-reveal="{ delay: 400 }"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-solid mb-2"
          title="5+ years of professional experience"
        >
          <Icon name="Briefcase" :size="18" class="text-accent" />
          <span class="text-sm font-medium text-foreground">5+ yrs</span>
        </div>
        <div v-reveal="{ delay: 500 }" class="flex flex-wrap justify-center gap-1.5">
          <span
            v-for="tech in techList"
            :key="tech"
            class="inline-flex px-2.5 py-0.5 rounded-full glass text-xs text-muted-foreground"
          >
            {{ tech }}
          </span>
        </div>
      </PageHeader>

    <!-- Terminal -->
    <section
      v-reveal="{ delay: 200 }"
      class="mb-8"
      aria-labelledby="about-heading"
      :style="terminalParallaxStyle"
    >
      <h2 id="about-heading" class="sr-only">About</h2>
      <TerminalWindow
        title="about.sh"
        command="cat profile.txt"
        class="max-w-xl mx-auto"
      >
        <div class="space-y-1">
          <p><span class="text-muted-foreground">Name       </span> Joel Stephen</p>
          <p><span class="text-muted-foreground">Role       </span> Frontend Engineer @ AppliedAI</p>
          <p><span class="text-muted-foreground">Stack      </span> Vue · React · TypeScript · Python · FastAPI</p>
          <p><span class="text-muted-foreground">Experience </span> 5+ years · 4 companies</p>
          <p><span class="text-muted-foreground">Location   </span> Abu Dhabi, UAE</p>
        </div>
      </TerminalWindow>
    </section>

    <!-- CTAs -->
    <section v-reveal="{ delay: 350 }" aria-labelledby="connect-heading">
      <h2 id="connect-heading" class="sr-only">Connect</h2>
      <div class="flex flex-col sm:flex-row sm:flex-wrap sm:justify-center gap-3">
        <UiButton
          variant="primary"
          to="/project"
          class="w-full sm:w-auto justify-center"
        >
          <Icon name="FolderOpen" :size="18" />
          View Projects
        </UiButton>
        <button
          type="button"
          class="btn-secondary flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold w-full sm:w-auto"
          @click="toggleChat"
        >
          <Icon name="MessageCircle" :size="18" />
          AI Chat
        </button>
        <UiButton
          variant="secondary"
          to="/contact"
          class="w-full sm:w-auto justify-center"
        >
          Contact
        </UiButton>
        <UiButton
          variant="tertiary"
          href="https://github.com/joelstephen97"
          class="self-center sm:self-auto shrink-0"
        >
          <Icon name="Github" :size="18" />
          GitHub
        </UiButton>
      </div>
    </section>

    <!-- Featured Projects -->
    <section v-reveal="{ delay: 500 }" class="mt-8" aria-label="Featured projects">
      <p class="text-xs text-muted-foreground text-center mb-3 uppercase tracking-wide">Featured</p>
      <div class="flex flex-wrap justify-center gap-2">
        <NuxtLink
          v-for="fp in featuredProjects"
          :key="fp.slug"
          :to="fp.link"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-solid text-sm text-foreground hover:text-accent hover:border-accent/30 border border-transparent transition-colors"
        >
          <Icon :name="fp.icon" :size="14" />
          {{ fp.title }}
        </NuxtLink>
      </div>
    </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import Icon from "~/components/ui/Icon.vue";
import { useWindowScroll } from "@vueuse/core";

useSeo({
  title: "Joel Stephen | Software Engineer - Full-Stack Developer",
  description:
    "Full-stack engineer with 5+ years of experience. Vue, React, Python, TypeScript. Building beautiful, performant web experiences. Based in Abu Dhabi, UAE.",
});

const config = useRuntimeConfig();
const SITE_URL =
  (config.public as { siteUrl?: string }).siteUrl ??
  "https://joelstephen.vercel.app";
const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Joel Stephen",
  jobTitle: "Software Engineer",
  url: SITE_URL,
  sameAs: [
    "https://linkedin.com/in/joelthomasstephen",
    "https://github.com/joelstephen97",
  ],
  image: `${SITE_URL}/pwa-512x512.png`,
  worksFor: { "@type": "Organization", name: "AppliedAI" },
  knowsAbout: [
    "Vue.js",
    "React",
    "Python",
    "TypeScript",
    "FastAPI",
    "Machine Learning",
  ],
};
useHead({
  script: [
    { type: "application/ld+json", innerHTML: JSON.stringify(personSchema) },
  ],
});

const { toggleOpen: toggleChat } = useJoelAgent();

const techList = [
  "Vue",
  "React",
  "Python",
  "TypeScript",
  "FastAPI",
  "PostgreSQL",
  "Docker",
  "Kubernetes",
];

const featuredProjects = [
  { slug: "aim-trainer", title: "Aim Trainer", icon: "Target", link: "/project/aim-trainer" },
  { slug: "rainbow-6-randomizer", title: "R6 Siege Randomizer", icon: "Shuffle", link: "/project/rainbow-6-randomizer" },
  { slug: "markdown-previewer", title: "Markdown Preview", icon: "FileText", link: "/project/markdown-previewer" },
];

// Parallax on scroll
const { y: scrollY } = useWindowScroll();
const heroParallaxStyle = computed(() => ({
  transform: `translateY(${-(scrollY.value * 0.08)}px)`,
  willChange: "transform",
}));
const terminalParallaxStyle = computed(() => ({
  transform: `translateY(${-(scrollY.value * 0.04)}px)`,
  willChange: "transform",
}));
</script>
