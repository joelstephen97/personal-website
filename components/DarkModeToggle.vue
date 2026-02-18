<template>
  <button
    class="p-2 rounded-xl hover:bg-[rgb(var(--glass))] transition-colors"
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
        class="text-amber-400"
      />
      <Icon v-else name="Moon" :size="20" class="text-slate-500" />
    </Transition>
  </button>
</template>

<script setup lang="ts">
import Icon from "~/components/ui/Icon.vue";
</script>
