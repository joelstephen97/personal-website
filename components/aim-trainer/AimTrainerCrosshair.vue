<template>
  <div
    v-if="visible"
    class="pointer-events-none fixed z-[70]"
    :style="crosshairStyle"
  >
    <!-- Cross -->
    <template v-if="settings.style === 'cross' || settings.style === 'cross-dot'">
      <div
        class="absolute bg-current"
        :style="{
          left: '50%',
          top: '50%',
          width: `${settings.thickness}px`,
          height: `${settings.size}px`,
          marginLeft: `-${settings.thickness / 2}px`,
          marginTop: `-${settings.size / 2}px`,
          transform: `translateY(-${settings.gap}px)`,
          boxShadow: settings.outline ? `0 0 0 1px ${settings.outlineColor}` : undefined,
        }"
      />
      <div
        class="absolute bg-current"
        :style="{
          left: '50%',
          top: '50%',
          width: `${settings.thickness}px`,
          height: `${settings.size}px`,
          marginLeft: `-${settings.thickness / 2}px`,
          marginTop: `-${settings.size / 2}px`,
          transform: `translateY(${settings.gap}px)`,
          boxShadow: settings.outline ? `0 0 0 1px ${settings.outlineColor}` : undefined,
        }"
      />
      <div
        class="absolute bg-current"
        :style="{
          left: '50%',
          top: '50%',
          width: `${settings.size}px`,
          height: `${settings.thickness}px`,
          marginLeft: `-${settings.size / 2}px`,
          marginTop: `-${settings.thickness / 2}px`,
          transform: `translateX(-${settings.gap}px)`,
          boxShadow: settings.outline ? `0 0 0 1px ${settings.outlineColor}` : undefined,
        }"
      />
      <div
        class="absolute bg-current"
        :style="{
          left: '50%',
          top: '50%',
          width: `${settings.size}px`,
          height: `${settings.thickness}px`,
          marginLeft: `-${settings.size / 2}px`,
          marginTop: `-${settings.thickness / 2}px`,
          transform: `translateX(${settings.gap}px)`,
          boxShadow: settings.outline ? `0 0 0 1px ${settings.outlineColor}` : undefined,
        }"
      />
    </template>
    <!-- Dot -->
    <div
      v-if="settings.style === 'dot' || settings.style === 'cross-dot'"
      class="absolute rounded-full bg-current"
      :style="{
        left: '50%',
        top: '50%',
        width: `${settings.size / 2}px`,
        height: `${settings.size / 2}px`,
        marginLeft: `-${settings.size / 4}px`,
        marginTop: `-${settings.size / 4}px`,
        boxShadow: settings.outline ? `0 0 0 1px ${settings.outlineColor}` : undefined,
      }"
    />
    <!-- Circle -->
    <div
      v-if="settings.style === 'circle'"
      class="absolute rounded-full border-2 border-current"
      :style="{
        left: '50%',
        top: '50%',
        width: `${settings.size}px`,
        height: `${settings.size}px`,
        marginLeft: `-${settings.size / 2}px`,
        marginTop: `-${settings.size / 2}px`,
        borderWidth: `${settings.thickness}px`,
        boxShadow: settings.outline ? `0 0 0 1px ${settings.outlineColor}` : undefined,
      }"
    />
  </div>
</template>

<script setup lang="ts">
import type { CrosshairSettings } from "~/composables/useAimTrainerCrosshair";

const props = defineProps<{
  visible: boolean;
  x: number;
  y: number;
  settings: CrosshairSettings;
}>();

const crosshairStyle = computed(() => ({
  left: `${props.x}px`,
  top: `${props.y}px`,
  transform: "translate(-50%, -50%)",
  color: props.settings.color,
}));
</script>
