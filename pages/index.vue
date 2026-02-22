<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 py-8">
    <!-- Header -->
    <header class="text-center mb-8" aria-labelledby="hero-heading">
      <p class="text-xs font-medium text-accent tracking-wide uppercase mb-2">
        Software Engineer
      </p>
      <h1
        id="hero-heading"
        class="text-h2 font-bold text-foreground mb-1"
      >
        Joel Stephen
      </h1>
      <p class="text-sm text-muted max-w-md mx-auto mb-4">
        Modern web. Clean code. Strong UX.
      </p>
      <div
        class="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-solid mb-2"
        title="5+ years of professional experience"
      >
        <Icon name="Briefcase" :size="18" class="text-accent" />
        <span class="text-sm font-medium text-foreground">5+ yrs</span>
      </div>
      <p class="text-sm text-muted">
        {{ technologies }}
      </p>
    </header>

    <!-- Terminal -->
    <section class="mb-8" aria-label="About">
      <TerminalWindow
        title="about.sh"
        command="cat profile.txt"
        class="max-w-xl mx-auto"
      >
        5+ years full-stack. Vue, React, Python. Clean code, strong UX.
      </TerminalWindow>
    </section>

    <!-- CTAs -->
    <div class="flex flex-wrap justify-center gap-3">
      <button
        type="button"
        class="btn-primary flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold"
        @click="toggleChat"
      >
        <Icon name="MessageCircle" :size="18" />
        AI Chat — Ask about Joel
      </button>
      <UiButton variant="primary" to="/contact">
        Contact
      </UiButton>
      <UiButton
        variant="tertiary"
        href="https://github.com/joelstephen97"
        aria-label="View source on GitHub"
      >
        <Icon name="Github" :size="18" />
      </UiButton>
    </div>
  </div>
</template>

<script setup lang="ts">
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
    { type: "application/ld+json", children: JSON.stringify(personSchema) },
  ],
});

const { toggleOpen: toggleChat } = useJoelAgent();

const technologies =
  "Vue, React, Python, TypeScript, FastAPI, PostgreSQL, Docker, Kubernetes";
</script>
