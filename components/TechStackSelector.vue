<template>
  <div class="pt-4 pb-4 flex flex-col space-y-4">
    <div
      class="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0"
    >
      <div
        v-for="stack in stacks"
        :key="stack.name"
        class="flex flex-col space-y-4"
      >
        <UButton
          color="black"
          class="text-md uppercase hover:italic"
          variant="solid"
          size="xl"
          @click="toggleStack(stack.name)"
        >
          {{ stack.name }}
        </UButton>
        <div
          v-if="selectedStack === stack.name"
          class="sm:hidden grid max-w-[700px] grid-cols-1 gap-4"
        >
          <div
            v-for="tech in stack.items"
            :key="tech.name"
            class="flex items-center space-x-2 cursor-pointer"
            @click="onTechClick?.(tech.name)"
          >
            <span class="text-xl font-bold">{{ tech.name }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Content for larger screens -->
    <div class="hidden sm:block">
      <div
        v-for="stack in stacks"
        :key="stack.name"
      >
        <div
          v-if="selectedStack === stack.name"
          class="grid max-w-[700px] grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div
            v-for="tech in stack.items"
            :key="tech.name"
            class="flex items-center space-x-2 cursor-pointer"
            @click="onTechClick?.(tech.name)"
          >
            <span class="text-xl font-bold">{{ tech.name }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface TechItem {
  name: string;
}

interface Stack {
  name: string;
  items: TechItem[];
}

const props = defineProps<{
  stacks: Stack[];
  onTechClick?: (techName: string) => void;
}>();

const selectedStack = ref<string | null>(null);

const toggleStack = (stackName: string) => {
  if (selectedStack.value === stackName) {
    selectedStack.value = null;
  } else {
    selectedStack.value = stackName;
  }
};
</script>

