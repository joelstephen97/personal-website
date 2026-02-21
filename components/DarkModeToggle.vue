<template>
  <button
    aria-label="Toggle dark mode"
    class="p-2 rounded-xl hover:bg-[rgb(var(--glass))] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--bg))]"
    @click="
      $colorMode.preference = $colorMode.value === 'dark' ? 'light' : 'dark'
    "
  >
    <Transition
      mode="out-in"
      enter-active-class="transition duration-200"
      enter-from-class="opacity-0 rotate-90 scale-75"
      leave-active-class="transition duration-150"
      leave-to-class="opacity-0 -rotate-90 scale-75"
    >
      <Icon
        v-if="$colorMode.value === 'dark'"
        name="Sun"
        :size="20"
        class="text-foreground"
      />
      <Icon v-else name="Moon" :size="20" class="text-muted" />
    </Transition>
  </button>
</template>

<script setup lang="ts">
import Icon from "~/components/ui/Icon.vue";
</script>
