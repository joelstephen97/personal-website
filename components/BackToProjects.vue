<template>
  <a
    href="/project"
    class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-glass border border-border hover:border-accent/50 transition-colors text-foreground"
    aria-label="Back to projects"
    @click.prevent="handleBack"
  >
    <Icon name="ArrowLeft" :size="16" />
    <span class="text-sm text-muted hover:text-foreground transition-colors">Projects</span>
  </a>
</template>

<script setup lang="ts">
import Icon from "~/components/ui/Icon.vue";
const route = useRoute();
const { setActiveTransitionSlug } = useProjectTransition();

const slug = computed(() => {
  const match = route.path.match(/\/project\/([^/]+)/);
  return match ? match[1] : null;
});

async function handleBack() {
  if (slug.value) setActiveTransitionSlug(slug.value);
  await nextTick();
  await navigateTo("/project");
}
</script>
