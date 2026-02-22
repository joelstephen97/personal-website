<template>
  <div class="min-h-screen bg-background transition-colors duration-300">
    <!-- Tahoe-style ambient gradient orbs -->
    <div class="fixed inset-0 -z-10 pointer-events-none">
      <div
        class="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-accent/[0.04] to-transparent rounded-full blur-3xl"
      />
      <div
        class="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-accent/[0.02] to-transparent rounded-full blur-3xl"
      />
    </div>

    <AppHeader />
    <main class="pt-16 pb-24 min-h-screen">
      <div class="page-content">
        <Transition name="page" mode="out-in">
          <div
            v-if="projectSlug"
            :key="`project-${projectSlug}`"
            class="project-detail-content"
          >
            <slot />
          </div>
          <div v-else key="default">
            <slot />
          </div>
        </Transition>
      </div>
    </main>
    <AppFooter />
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
const deferMounted = ref(false);
onMounted(() => {
  if ("requestIdleCallback" in window) {
    requestIdleCallback(
      () => {
        deferMounted.value = true;
      },
      { timeout: 100 }
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
const projectSlug = computed(() => {
  const match = route.path.match(/\/project\/([^/]+)/);
  return match ? match[1] : null;
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
