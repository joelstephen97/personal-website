<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    variant?: "primary" | "secondary" | "tertiary";
    to?: string;
    href?: string;
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
  }>(),
  {
    variant: "primary",
    type: "button",
  },
);

const baseClasses =
  "inline-flex items-center justify-center gap-2 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed";

const variantClasses = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  tertiary:
    "px-4 py-2 rounded-xl text-accent hover:bg-accent-muted transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--bg))]",
};
</script>

<template>
  <NuxtLink
    v-if="to"
    :to="to"
    :class="[baseClasses, variantClasses[variant], $attrs.class]"
  >
    <slot />
  </NuxtLink>
  <a
    v-else-if="href"
    :href="href"
    target="_blank"
    rel="noopener"
    :class="[baseClasses, variantClasses[variant], $attrs.class]"
  >
    <slot />
  </a>
  <button
    v-else
    :type="type"
    :disabled="disabled"
    :class="[baseClasses, variantClasses[variant], $attrs.class]"
  >
    <slot />
  </button>
</template>
