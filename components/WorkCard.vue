<template>
  <article
    :ref="(el: any) => { cardRef = el as HTMLElement | null }"
    :style="tiltStyle"
    class="group glass-solid rounded-xl hover:border-accent/30 transition-colors relative p-4 sm:p-5"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <a
      :href="project.url"
      target="_blank"
      rel="noopener"
      class="block focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:rounded-xl pr-10"
    >
      <div class="flex items-start justify-between mb-2">
        <div
          class="w-11 h-11 rounded-xl bg-gradient-to-br from-accent to-accent-hover flex items-center justify-center shadow-lg shadow-accent/20"
        >
          <Icon :name="project.icon" :size="22" class="text-white" />
        </div>
        <Icon
          name="ArrowUpRight"
          :size="18"
          class="text-muted-foreground group-hover:text-accent transition-colors"
        />
      </div>
      <h3
        class="text-base font-semibold text-foreground group-hover:text-accent transition-colors mb-1"
      >
        {{ project.name }}
      </h3>
      <p class="text-sm text-accent font-medium mb-1.5">
        {{ project.company }}
        <span v-if="project.badge" class="ml-1.5 text-xs text-muted-foreground font-normal">· {{ project.badge }}</span>
      </p>
      <p class="text-sm text-muted leading-relaxed">
        {{ project.description }}
      </p>
      <div class="hidden sm:flex flex-wrap gap-1 mt-2">
        <span
          v-for="tech in project.tech"
          :key="tech"
          class="px-1.5 py-0.5 rounded text-xs bg-glass text-muted-foreground border border-border"
        >
          {{ tech }}
        </span>
      </div>
    </a>
  </article>
</template>

<script setup lang="ts">
import Icon from "~/components/ui/Icon.vue";
import { useCardTilt } from "~/composables/useCardTilt";

defineProps<{
  project: {
    name: string;
    company: string;
    url: string;
    icon: string;
    badge?: string;
    description: string;
    tech: string[];
  };
}>();

const { cardRef, tiltStyle, onMouseEnter, onMouseLeave } = useCardTilt();
</script>
