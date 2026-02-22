<template>
  <a
    href="/project"
    class="w-8 h-8 rounded-lg bg-[rgb(var(--glass))] border border-[rgb(var(--border))] flex items-center justify-center hover:border-accent/50 transition-colors text-foreground"
    aria-label="Back to projects"
    @click.prevent="handleBack"
  >
    <Icon name="ArrowLeft" :size="16" />
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
