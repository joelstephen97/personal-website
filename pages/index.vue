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
        subtitle="I build AI workflow surfaces that real users operate."
        subtitle-class="mb-4"
        animate
        :style="heroParallaxStyle"
      >
        <div class="flex flex-wrap items-center justify-center gap-2 mb-2">
          <a
            v-reveal="{ delay: 350 }"
            href="#open-to-work"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/30 hover:bg-accent/15 transition-colors group"
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
              Open · GCC · SEA · EEA
            </span>
          </a>
          <div
            v-reveal="{ delay: 400 }"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-solid"
            title="5+ years of professional experience"
          >
            <Icon name="Briefcase" :size="16" class="text-accent" />
            <span class="text-sm font-medium text-foreground">5+ yrs</span>
          </div>
        </div>
      </PageHeader>

      <!-- Terminal — single info surface -->
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
            <p>
              <span class="text-muted-foreground">Role </span> Frontend Engineer
              @ AppliedAI
            </p>
            <p>
              <span class="text-muted-foreground">Now </span> Opus — Process
              Discovery, Technical Canvas, CX
            </p>
            <p>
              <span class="text-muted-foreground">Stack </span> Vue · React ·
              TypeScript · Python · FastAPI
            </p>
            <p>
              <span class="text-muted-foreground">Location </span> Abu Dhabi,
              UAE
            </p>
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
        <div
          class="flex flex-col sm:flex-row sm:flex-wrap sm:justify-center gap-3"
        >
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
    "Frontend Engineer at AppliedAI shipping AI workflow surfaces — Process Discovery (Yjs/CRDT), Opus Technical Canvas (n8n fork), Opus-CX. 5+ yrs across Vue, React, TypeScript, Python, FastAPI. Open to Senior/Staff roles across the GCC (Gulf), Southeast Asia, and EEA (Europe). Based in Abu Dhabi, UAE.",
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
      {
        "@type": "Place",
        name: "Gulf Cooperation Council (GCC)",
        containsPlace: [
          { "@type": "Country", name: "United Arab Emirates" },
          { "@type": "Country", name: "Saudi Arabia" },
          { "@type": "Country", name: "Qatar" },
          { "@type": "Country", name: "Kuwait" },
          { "@type": "Country", name: "Bahrain" },
          { "@type": "Country", name: "Oman" },
        ],
      },
      {
        "@type": "Place",
        name: "Southeast Asia (SEA)",
        containsPlace: [
          { "@type": "Country", name: "Singapore" },
          { "@type": "Country", name: "Malaysia" },
          { "@type": "Country", name: "Thailand" },
          { "@type": "Country", name: "Vietnam" },
          { "@type": "Country", name: "Indonesia" },
          { "@type": "Country", name: "Philippines" },
        ],
      },
      {
        "@type": "Place",
        name: "European Economic Area (EEA)",
      },
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
