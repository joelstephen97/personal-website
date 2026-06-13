<template>
  <div class="min-h-screen bg-background transition-colors duration-300">
    <!-- Tahoe-style ambient gradient orbs (animated drift) -->
    <div
      class="fixed inset-0 -z-10 pointer-events-none transition-colors duration-700"
    >
      <Motion
        as="div"
        :class="[
          'absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-3xl transition-colors duration-700',
          orbGradient1,
        ]"
        :animate="{ x: [0, 40, -30, 0], y: [0, -25, 20, 0] }"
        :transition="{ duration: 30, repeat: Infinity, ease: 'easeInOut' }"
      />
      <Motion
        as="div"
        :class="[
          'absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-3xl transition-colors duration-700',
          orbGradient2,
        ]"
        :animate="{ x: [0, -35, 25, 0], y: [0, 15, -20, 0] }"
        :transition="{ duration: 25, repeat: Infinity, ease: 'easeInOut' }"
      />
      <Motion
        as="div"
        class="absolute top-1/3 left-1/4 w-[350px] h-[350px] bg-gradient-to-br from-blue-500/[0.02] to-transparent rounded-full blur-3xl"
        :animate="{ x: [0, -30, 40, 0], y: [0, 20, -25, 0] }"
        :transition="{ duration: 35, repeat: Infinity, ease: 'easeInOut' }"
      />
    </div>

    <ScrollProgress />
    <AppHeader />
    <main class="pt-16 pb-8 min-h-screen">
      <div class="page-content">
        <AnimatePresence mode="wait">
          <Motion
            :key="route.path"
            as="div"
            :variants="pageVariants"
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <slot />
          </Motion>
        </AnimatePresence>
      </div>
    </main>
    <AppFooter />
    <!-- Scroll to top -->
    <Transition
      enter-active-class="transition duration-200"
      enter-from-class="opacity-0 translate-y-2"
      leave-active-class="transition duration-200"
      leave-to-class="opacity-0 translate-y-2"
    >
      <button
        v-if="showScrollTop"
        type="button"
        class="fixed bottom-6 right-6 z-50 w-10 h-10 rounded-full glass-solid border border-border flex items-center justify-center text-muted hover:text-accent hover:border-accent/50 transition-colors shadow-lg"
        aria-label="Scroll to top"
        @click="scrollToTop"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="m18 15-6-6-6 6" />
        </svg>
      </button>
    </Transition>
    <ClientOnly>
      <CursorGlow />
      <template #fallback />
    </ClientOnly>
    <ClientOnly>
      <LazyJoelAgentChat v-if="deferMounted" />
      <template #fallback />
    </ClientOnly>
    <ClientOnly>
      <LazyPwaInstallPrompt v-if="deferMounted" />
      <template #fallback />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { useWindowScroll } from "@vueuse/core";
import { pageVariants } from "~/constants/motion";

const { y: scrollY } = useWindowScroll();
const showScrollTop = computed(() => scrollY.value > 400);
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

const deferMounted = ref(false);
onMounted(() => {
  if ("requestIdleCallback" in window) {
    requestIdleCallback(
      () => {
        deferMounted.value = true;
      },
      { timeout: 100 },
    );
  } else {
    setTimeout(() => {
      deferMounted.value = true;
    }, 100);
  }
});
const config = useRuntimeConfig();
const SITE_URL =
  (config.public as { siteUrl?: string }).siteUrl ??
  "https://joelstephen.vercel.app";

const route = useRoute();

const orbGradient1 = computed(() => {
  if (route.path.startsWith("/experience"))
    return "bg-gradient-to-br from-blue-500/[0.04] to-transparent";
  if (route.path.startsWith("/project"))
    return "bg-gradient-to-br from-purple-500/[0.04] to-transparent";
  if (route.path.startsWith("/contact"))
    return "bg-gradient-to-br from-emerald-500/[0.04] to-transparent";
  return "bg-gradient-to-br from-accent/[0.04] to-transparent";
});
const orbGradient2 = computed(() => {
  if (route.path.startsWith("/experience"))
    return "bg-gradient-to-tr from-blue-500/[0.02] to-transparent";
  if (route.path.startsWith("/project"))
    return "bg-gradient-to-tr from-purple-500/[0.02] to-transparent";
  if (route.path.startsWith("/contact"))
    return "bg-gradient-to-tr from-emerald-500/[0.02] to-transparent";
  return "bg-gradient-to-tr from-accent/[0.02] to-transparent";
});

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Joel Stephen | Software Engineer",
  url: SITE_URL,
  description:
    "Full-stack engineer with 5+ years of experience. Building beautiful, performant web experiences with modern technologies.",
  author: {
    "@type": "Person",
    name: "Joel Stephen",
    jobTitle: "Software Engineer",
    url: SITE_URL,
    sameAs: [
      "https://linkedin.com/in/joelthomasstephen",
      "https://github.com/joelstephen97",
    ],
    image: `${SITE_URL}/pwa-512x512.png`,
  },
};

useHead({
  script: [
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify(websiteSchema),
    },
  ],
});
</script>
