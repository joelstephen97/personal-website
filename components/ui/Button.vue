<script setup lang="ts">
import { useMagneticButton } from "~/composables/useMagneticButton";

const props = withDefaults(
  defineProps<{
    variant?: "primary" | "secondary" | "tertiary";
    to?: string;
    href?: string;
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
    magnetic?: boolean;
  }>(),
  {
    variant: "primary",
    type: "button",
    to: undefined,
    href: undefined,
    magnetic: false,
  },
);

const baseClasses =
  "inline-flex items-center justify-center gap-2 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed";

const variantClasses = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  tertiary:
    "px-4 py-2 rounded-xl text-accent hover:bg-accent/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
};

const useMagnetic = computed(() => props.magnetic || props.variant === "primary");
const { buttonRef, magneticStyle, onMouseEnter, onMouseLeave } =
  useMagneticButton();
</script>

<template>
  <NuxtLink
    v-if="to"
    :ref="useMagnetic ? (el: any) => { buttonRef = el?.$el ?? el } : undefined"
    :to="to"
    :class="[baseClasses, variantClasses[variant], $attrs.class]"
    :style="useMagnetic ? magneticStyle : undefined"
    @mouseenter="useMagnetic ? onMouseEnter() : undefined"
    @mouseleave="useMagnetic ? onMouseLeave() : undefined"
  >
    <slot />
  </NuxtLink>
  <a
    v-else-if="href"
    :ref="useMagnetic ? (el: any) => { buttonRef = el } : undefined"
    :href="href"
    target="_blank"
    rel="noopener"
    :class="[baseClasses, variantClasses[variant], $attrs.class]"
    :style="useMagnetic ? magneticStyle : undefined"
    @mouseenter="useMagnetic ? onMouseEnter() : undefined"
    @mouseleave="useMagnetic ? onMouseLeave() : undefined"
  >
    <slot />
  </a>
  <button
    v-else
    :ref="useMagnetic ? (el: any) => { buttonRef = el } : undefined"
    :type="type"
    :disabled="disabled"
    :class="[baseClasses, variantClasses[variant], $attrs.class]"
    :style="useMagnetic ? magneticStyle : undefined"
    @mouseenter="useMagnetic ? onMouseEnter() : undefined"
    @mouseleave="useMagnetic ? onMouseLeave() : undefined"
  >
    <slot />
  </button>
</template>
