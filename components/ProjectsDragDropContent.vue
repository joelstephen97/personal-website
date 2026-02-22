<template>
  <section
    ref="stashZoneRef"
    aria-labelledby="bookmarked-heading"
    :class="[
      'min-w-0 rounded-xl border-2 border-dashed transition-colors',
      isStashDropTarget
        ? 'border-accent bg-accent/5'
        : 'border-border bg-[rgb(var(--glass))]',
    ]"
  >
    <h3 id="bookmarked-heading" class="sr-only">Bookmarked projects</h3>
    <div class="flex items-center gap-2 p-3 pb-0">
      <div
        class="w-6 h-6 rounded-md bg-[rgb(var(--foreground-muted))] flex items-center justify-center shrink-0"
      >
        <Icon name="Bookmark" :size="14" class="text-white" />
      </div>
      <span class="text-lg font-semibold text-foreground">Bookmarked projects</span>
    </div>
    <div class="p-3">
      <p
        v-if="!stashedProjects.length"
        class="text-xs text-muted text-center py-3"
      >
        {{
          isStashDropTarget
            ? "Drop here to bookmark"
            : "Drag projects here or use the bookmark icon to save favorites"
        }}
      </p>
      <div
        v-else
        class="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        <SortableProjectCard
          v-for="(project, index) in stashedProjects"
          :key="project.id"
          :project="project"
          :index="index"
          :stashed-ids="stashedIds"
          :on-stash="onStash"
          :expanded="expandedProjectId === project.id"
          :on-expand="() => onExpandProject?.(project.id)"
          group="pinned"
        />
        <div
          v-if="isStashDropTarget"
          class="min-h-[120px] rounded-xl border-2 border-accent border-dashed flex items-center justify-center text-xs text-accent"
        >
          Drop to bookmark
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useDroppable } from "@dnd-kit/vue";
import Icon from "~/components/ui/Icon.vue";
import SortableProjectCard from "~/components/SortableProjectCard.vue";

const STASH_ZONE_ID = "stash-zone";

defineProps<{
  stashedProjects: { id: number; slug: string; title: string; description: string; link: string; cta: string; icon: string; tech?: string[] }[];
  stashedIds: number[];
  onStash: (id: number) => void;
  expandedProjectId?: number | null;
  onExpandProject?: (id: number) => void;
}>();

const stashZoneRef = ref<HTMLElement | null>(null);
const { isDropTarget: isStashDropTarget } = useDroppable({
  id: STASH_ZONE_ID,
  element: stashZoneRef,
});

</script>
