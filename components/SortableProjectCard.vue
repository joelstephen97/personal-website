<template>
  <article
    ref="elementRef"
    :style="[
      activeTransitionSlug === project.slug && { viewTransitionName: 'project-detail' },
      isDragging && { opacity: 0.5, zIndex: 50 },
    ]"
    :class="[
      'group glass-solid rounded-xl hover:border-accent/30 transition-colors relative',
      expanded ? 'col-span-full p-5' : 'p-3.5 min-h-[72px]',
    ]"
  >
    <button
      type="button"
      ref="handleRef"
      class="absolute top-2 right-2 p-1 rounded-md text-muted hover:text-accent hover:bg-accent/10 cursor-grab active:cursor-grabbing touch-none z-10"
      aria-label="Drag to reorder"
    >
      <Icon name="GripVertical" :size="16" />
    </button>
    <button
      v-if="showStash"
      type="button"
      class="absolute top-2 right-10 p-1 rounded-md text-muted hover:text-accent hover:bg-accent/10 z-10"
      :aria-label="isStashed ? 'Unbookmark' : 'Bookmark'"
      :title="isStashed ? 'Unbookmark' : 'Bookmark'"
      @click.stop="toggleStash"
    >
      <Icon
        :name="isStashed ? 'BookmarkCheck' : 'Bookmark'"
        :size="16"
        :class="isStashed ? 'text-accent' : ''"
      />
    </button>
    <button
      type="button"
      :class="[
        'absolute top-2 p-1 rounded-md z-10 transition-colors',
        showStash ? 'right-16' : 'right-10',
        expanded ? 'text-accent bg-accent/10' : 'text-muted hover:text-accent hover:bg-accent/10',
      ]"
      :aria-label="expanded ? 'Collapse' : 'Expand'"
      @click.stop="onExpand?.()"
    >
      <Icon
        :name="expanded ? 'ChevronUp' : 'ChevronDown'"
        :size="16"
      />
    </button>

    <!-- Small view -->
    <a
      v-if="!expanded"
      :href="project.link"
      :class="[
        'block focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--bg))] focus-visible:rounded-xl',
        showStash ? 'pr-20' : 'pr-14',
      ]"
      @mouseenter="preloadRoute"
      @click.prevent="handleProjectClick"
    >
      <h3 class="text-lg font-semibold text-foreground group-hover:text-accent transition-colors line-clamp-2 break-words">
        {{ project.title }}
      </h3>
      <div
        class="mt-2 w-8 h-8 rounded-lg bg-[rgb(var(--glass))] border border-border flex items-center justify-center shrink-0 group-hover:border-accent/50 transition-colors"
      >
        <Icon
          :name="project.icon"
          :size="16"
          class="text-muted group-hover:text-accent transition-colors"
        />
      </div>
    </a>

    <!-- Large view -->
    <div v-else class="pr-12">
      <a
        :href="project.link"
        class="block focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--bg))] focus-visible:rounded-xl"
        @mouseenter="preloadRoute"
        @click.prevent="handleProjectClick"
      >
        <div
          class="w-9 h-9 rounded-lg bg-[rgb(var(--glass))] border border-border flex items-center justify-center mb-2 group-hover:border-accent/50 transition-colors"
        >
          <Icon
            :name="project.icon"
            :size="18"
            class="text-muted group-hover:text-accent transition-colors"
          />
        </div>
        <h3 class="text-base font-semibold text-foreground group-hover:text-accent transition-colors mb-1">
          {{ project.title }}
        </h3>
        <p class="text-sm text-muted mb-2 leading-relaxed">
          {{ project.description }}
        </p>
        <div class="flex flex-col gap-1.5">
          <span
            v-if="project.tech?.length"
            class="flex flex-wrap gap-1"
          >
            <span
              v-for="t in project.tech"
              :key="t"
              class="px-1.5 py-0.5 rounded text-xs bg-[rgb(var(--glass))] text-muted-foreground border border-border"
            >
              {{ t }}
            </span>
          </span>
          <span
            class="inline-flex items-center gap-0.5 text-xs font-medium text-accent shrink-0"
          >
            {{ project.cta }}
            <Icon
              name="ArrowRight"
              :size="14"
              class="group-hover:translate-x-0.5 transition-transform"
            />
          </span>
        </div>
      </a>
    </div>
  </article>
</template>

<script setup lang="ts">
import { useSortable } from "@dnd-kit/vue/sortable";
import Icon from "~/components/ui/Icon.vue";

const props = withDefaults(
  defineProps<{
    project: {
      id: number;
      slug: string;
      title: string;
      description: string;
      link: string;
      cta: string;
      icon: string;
      tech?: string[];
    };
    index: number;
    stashedIds?: number[];
    onStash?: (id: number) => void;
    onExpand?: () => void;
    expanded?: boolean;
    group?: string;
  }>(),
  { group: "grid", expanded: false }
);

const { activeTransitionSlug, setActiveTransitionSlug } = useProjectTransition();

function preloadRoute() {
  if (import.meta.client) preloadRouteComponents(props.project.link);
}

async function handleProjectClick() {
  if (typeof window !== "undefined") {
    sessionStorage.setItem("project-list-scroll", String(window.scrollY));
  }
  setActiveTransitionSlug(props.project.slug);
  await nextTick();
  await navigateTo(props.project.link);
}

const showStash = computed(() => !!props.onStash);
const isStashed = computed(
  () => Array.isArray(props.stashedIds) && props.stashedIds.includes(props.project.id)
);

function toggleStash() {
  props.onStash?.(props.project.id);
  if ("vibrate" in navigator) navigator.vibrate(30);
}

const elementRef = ref<HTMLElement | null>(null);
const handleRef = ref<HTMLElement | null>(null);
const { isDragging } = useSortable({
  id: computed(() => props.project.id),
  index: computed(() => props.index),
  group: computed(() => props.group),
  type: computed(() => props.group),
  acceptedTypes: computed(() => ["grid", "pinned"]),
  element: elementRef,
  handle: handleRef,
});
</script>
