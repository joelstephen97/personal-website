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
        eyebrow="Frontend Engineer · AppliedAI"
        subtitle="Building AI workflow surfaces — Process Discovery (Yjs/CRDT multiplayer canvas), Opus Technical Canvas (n8n fork), Opus-CX. 5+ years across 4 companies. Based in Abu Dhabi."
        subtitle-class="mb-4"
        animate
        :style="heroParallaxStyle"
      >
        <a
          v-reveal="{ delay: 350 }"
          href="#open-to-work"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/30 mb-3 hover:bg-accent/15 transition-colors group"
          title="Open to new opportunities"
        >
          <span class="relative inline-flex h-2 w-2" aria-hidden="true">
            <span
              class="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"
            />
            <span
              class="relative inline-flex h-2 w-2 rounded-full bg-accent"
            />
          </span>
          <span
            class="text-xs sm:text-sm font-medium text-accent group-hover:text-accent-hover"
          >
            Open to Senior / Staff roles · SG · MY · TH · VN · Remote
          </span>
        </a>
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
    <section
      id="open-to-work"
      v-reveal="{ delay: 350 }"
      aria-labelledby="connect-heading"
    >
      <h2 id="connect-heading" class="sr-only">Connect</h2>
      <div class="flex flex-col sm:flex-row sm:flex-wrap sm:justify-center gap-3">
        <UiButton
          variant="primary"
          href="/joel-stephen-resume.pdf"
          class="w-full sm:w-auto justify-center"
        >
          <Icon name="Download" :size="18" />
          Download Resume
        </UiButton>
        <UiButton
          variant="secondary"
          to="/project"
          class="w-full sm:w-auto justify-center"
        >
          <Icon name="FolderOpen" :size="18" />
          View Projects
        </UiButton>
        <UiButton
          variant="secondary"
          to="/contact"
          class="w-full sm:w-auto justify-center"
        >
          <Icon name="Mail" :size="18" />
          Contact
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
  title:
    "Joel Stephen | Frontend Engineer · AI Workflows · Vue · React · Python",
  description:
    "Frontend Engineer at AppliedAI shipping AI workflow surfaces — Process Discovery (Yjs/CRDT), Opus Technical Canvas (n8n fork), Opus-CX. 5+ yrs across Vue, React, TypeScript, Python, FastAPI. Open to Senior/Staff roles in Singapore, Malaysia, Thailand, Vietnam. Based in Abu Dhabi, UAE.",
});

const config = useRuntimeConfig();
const SITE_URL =
  (config.public as { siteUrl?: string }).siteUrl ??
  "https://joelstephen.vercel.app";
const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Joel Stephen",
  alternateName: "Joel Thomas Stephen",
  jobTitle: "Frontend Engineer",
  description:
    "Frontend Engineer at AppliedAI building AI workflow surfaces. 5+ years across Vue, React, TypeScript, Python, FastAPI, with production experience on real-time collaborative canvases (Yjs/CRDT), node-graph editors (n8n fork), and applied ML (YOLO v5, OpenCV, Anthropic + OpenAI APIs).",
  url: SITE_URL,
  email: "mailto:joel.stephen.work@gmail.com",
  telephone: "+971-56-809-8085",
  image: `${SITE_URL}/headshot.png`,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Abu Dhabi",
    addressCountry: "AE",
  },
  worksFor: {
    "@type": "Organization",
    name: "AppliedAI",
    url: "https://applied.ai",
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "BITS Pilani, Dubai Campus",
    url: "https://www.bits-pilani.ac.in/dubai/",
  },
  knowsLanguage: ["English", "Hindi", "Malayalam"],
  knowsAbout: [
    "Frontend Engineering",
    "AI Workflow Platforms",
    "Real-time Collaboration",
    "Yjs CRDT",
    "WebSocket",
    "Server-Sent Events",
    "Vue.js",
    "React",
    "TypeScript",
    "Nuxt.js",
    "Python",
    "FastAPI",
    "GraphQL",
    "Anthropic API",
    "OpenAI API",
    "RAG Pipelines",
    "Agentic Workflows",
    "YOLO v5",
    "OpenCV",
    "TensorFlow",
    "PostgreSQL",
    "DynamoDB",
  ],
  sameAs: [
    "https://linkedin.com/in/joelthomasstephen",
    "https://github.com/joelstephen97",
  ],
  seeks: {
    "@type": "Demand",
    name: "Senior / Staff Frontend, Full-Stack, Forward Deployed, or Applied AI Engineer roles",
    areaServed: [
      { "@type": "Country", name: "Singapore" },
      { "@type": "Country", name: "Malaysia" },
      { "@type": "Country", name: "Thailand" },
      { "@type": "Country", name: "Vietnam" },
    ],
  },
};
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Joel Stephen",
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/project?search={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};
useHead({
  script: [
    { type: "application/ld+json", innerHTML: JSON.stringify(personSchema) },
    { type: "application/ld+json", innerHTML: JSON.stringify(websiteSchema) },
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
  "Yjs",
  "Anthropic",
];

const featuredProjects = [
  {
    slug: "bg-remover",
    title: "Background Remover (in-browser ML)",
    icon: "ImageMinus",
    link: "/project/bg-remover",
  },
  {
    slug: "image-captioning",
    title: "Image Captioning (transformers.js)",
    icon: "ScanText",
    link: "/project/image-captioning",
  },
  {
    slug: "pathfinding-visualizer",
    title: "Pathfinding Visualizer",
    icon: "Route",
    link: "/project/pathfinding-visualizer",
  },
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
