<template>
  <div
    class="relative max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex items-center min-h-[calc(100vh-9rem)]"
  >
    <HeroGradientMesh />
    <NeuralDots />

    <!-- Floating glass decorative elements -->
    <div
      class="absolute top-8 -left-8 w-20 h-20 rounded-2xl glass opacity-30 dark:opacity-50 animate-float hidden sm:block"
      aria-hidden="true"
    />
    <div
      class="absolute bottom-12 -right-6 w-14 h-14 rounded-full glass opacity-25 dark:opacity-40 animate-float-slow hidden sm:block"
      style="animation-delay: -3s"
      aria-hidden="true"
    />

    <div
      class="grid lg:grid-cols-[1fr_1.05fr] gap-10 lg:gap-12 items-center w-full"
    >
      <!-- LEFT: identity + CTAs -->
      <div class="text-center lg:text-left">
        <p
          v-reveal="{ delay: 0 }"
          class="text-xs font-medium text-accent tracking-wide uppercase mb-2"
        >
          Frontend Engineer · AppliedAI
        </p>
        <h1
          id="hero-heading"
          class="text-h2 font-bold text-foreground mb-2"
          :style="heroParallaxStyle"
        >
          <span
            v-for="(char, i) in titleChars"
            :key="i"
            :class="char === ' ' ? '' : 'char-reveal'"
            :style="char !== ' ' ? ({ '--i': charIndex(i) } as any) : undefined"
            >{{ char === " " ? "\u00A0" : char }}</span
          >
        </h1>
        <p
          v-reveal="{ delay: 300 }"
          class="text-base text-muted max-w-md mx-auto lg:mx-0 mb-4"
        >
          I build AI workflow surfaces that real users operate.
        </p>

        <div
          class="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-5"
        >
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

        <div
          id="open-to-work"
          v-reveal="{ delay: 450 }"
          class="flex flex-wrap items-center justify-center lg:justify-start gap-2"
        >
          <UiButton
            variant="primary"
            href="/joel-stephen-resume.pdf"
            class="justify-center"
          >
            <Icon name="Download" :size="16" />
            Resume
          </UiButton>
          <UiButton variant="secondary" to="/work" class="justify-center">
            <Icon name="Briefcase" :size="16" />
            Case studies
          </UiButton>
          <UiButton variant="secondary" to="/contact" class="justify-center">
            <Icon name="Mail" :size="16" />
            Contact
          </UiButton>
          <button
            type="button"
            class="btn-secondary flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
            @click="toggleChat"
          >
            <Icon name="MessageCircle" :size="16" />
            AI Chat
          </button>
          <a
            href="https://github.com/joelstephen97"
            target="_blank"
            rel="noopener"
            class="inline-flex items-center justify-center w-10 h-10 rounded-full glass-solid hover:border-accent/30 text-muted hover:text-accent transition-colors"
            aria-label="GitHub"
          >
            <Icon name="Github" :size="18" />
          </a>
        </div>
      </div>

      <!-- RIGHT: terminal (single info surface) -->
      <div :style="terminalParallaxStyle">
        <TerminalWindow
          title="about.sh"
          command="cat profile.txt"
          class="mx-auto lg:ml-0 max-w-xl"
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
              <span class="text-muted-foreground">Real-time </span> Yjs / CRDT ·
              WebSocket · SSE
            </p>
            <p>
              <span class="text-muted-foreground">AI </span> Anthropic · OpenAI
              · RAG · agentic workflows
            </p>
            <p>
              <span class="text-muted-foreground">Location </span> Abu Dhabi,
              UAE
            </p>
          </div>
        </TerminalWindow>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Icon from "~/components/ui/Icon.vue";
import { useWindowScroll } from "@vueuse/core";

// Per-character reveal for the H1 (matches PageHeader animation)
const heroTitle = "Joel Stephen";
const titleChars = computed(() => heroTitle.split(""));
function charIndex(i: number): string {
  let count = 0;
  for (let j = 0; j < i; j++) {
    if (heroTitle[j] !== " ") count++;
  }
  return String(count);
}

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
