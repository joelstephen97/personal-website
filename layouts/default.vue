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
            :style="{ viewTransitionName: 'project-detail' }"
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
    <JoelAgentChat />
    <PwaInstallPrompt />
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const projectSlug = computed(() => {
  const match = route.path.match(/\/project\/([^/]+)/);
  return match ? match[1] : null;
});
</script>
