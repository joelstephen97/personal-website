<template>
  <header class="text-center mb-8" :aria-labelledby="id">
    <p
      v-if="eyebrow"
      v-reveal="{ delay: 0 }"
      class="text-xs font-medium text-accent tracking-wide uppercase mb-2"
    >
      {{ eyebrow }}
    </p>
    <h1 v-if="animate" :id="id" class="text-h2 font-bold text-foreground mb-1">
      <span
        v-for="(char, i) in titleChars"
        :key="i"
        :class="char === ' ' ? '' : 'char-reveal'"
        :style="char !== ' ' ? ({ '--i': charIndex(i) } as any) : undefined"
      >{{ char === ' ' ? '\u00A0' : char }}</span>
    </h1>
    <h1 v-else :id="id" v-reveal="{ delay: 50 }" class="text-h2 font-bold text-foreground mb-1">
      {{ title }}
    </h1>
    <p
      v-if="subtitle"
      v-reveal="{ delay: animate ? 300 : 100 }"
      class="text-base text-muted max-w-md mx-auto"
      :class="subtitleClass"
    >
      {{ subtitle }}
    </p>
    <slot />
  </header>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    id: string;
    title: string;
    eyebrow?: string;
    subtitle?: string;
    subtitleClass?: string;
    animate?: boolean;
  }>(),
  { subtitleClass: "", animate: false },
);

const titleChars = computed(() => props.title.split(""));

function charIndex(i: number): string {
  let count = 0;
  for (let j = 0; j < i; j++) {
    if (props.title[j] !== " ") count++;
  }
  return String(count);
}
</script>
