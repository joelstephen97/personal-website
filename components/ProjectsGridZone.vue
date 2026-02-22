<template>
  <div
    ref="gridZoneRef"
    class="min-h-[160px] project-grid grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-visible"
    :class="[
      isGridDropTarget && 'ring-2 ring-accent/30 ring-dashed rounded-2xl -m-1 p-1',
    ]"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { useDroppable } from "@dnd-kit/vue";

const gridZoneRef = ref<HTMLElement | null>(null);
const { isDropTarget: isGridDropTarget } = useDroppable({
  id: "grid-zone",
  element: gridZoneRef,
  acceptedTypes: ["pinned"],
});
</script>
