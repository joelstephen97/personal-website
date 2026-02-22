<template>
  <div class="space-y-4">
    <button
      type="button"
      class="w-full flex items-center justify-between gap-3 text-left"
      @click="expanded = !expanded"
    >
      <p class="text-xs text-[rgb(var(--foreground-muted))] uppercase tracking-wide">
        Crosshair
      </p>
      <div class="flex items-center gap-2">
        <AimTrainerCrosshairPreview
          :key="`${settings.size}-${settings.thickness}-${settings.gap}-${settings.style}`"
          :settings="settings"
        />
        <Icon
          :name="expanded ? 'ChevronUp' : 'ChevronDown'"
          :size="18"
          class="text-[rgb(var(--foreground-muted))]"
        />
      </div>
    </button>
    <Transition name="expand">
      <div v-show="expanded" class="grid grid-cols-2 gap-3 overflow-hidden">
      <div>
        <label class="text-xs text-[rgb(var(--foreground-muted))] block mb-1">Style</label>
        <select
          v-model="settings.style"
          class="w-full px-3 py-2 rounded-lg bg-[rgb(var(--glass))] border border-[rgb(var(--border))] text-sm text-[rgb(var(--foreground))]"
        >
          <option value="cross">Cross</option>
          <option value="dot">Dot</option>
          <option value="circle">Circle</option>
          <option value="cross-dot">Cross + Dot</option>
        </select>
      </div>
      <div>
        <label class="text-xs text-[rgb(var(--foreground-muted))] block mb-1">Size</label>
        <input
          v-model.number="settings.size"
          type="range"
          min="8"
          max="32"
          class="w-full"
        />
        <span class="text-xs text-[rgb(var(--foreground-muted))]">{{ settings.size }}px</span>
      </div>
      <div>
        <label class="text-xs text-[rgb(var(--foreground-muted))] block mb-1">Thickness</label>
        <input
          v-model.number="settings.thickness"
          type="range"
          min="1"
          max="4"
          class="w-full"
        />
        <span class="text-xs text-[rgb(var(--foreground-muted))]">{{ settings.thickness }}px</span>
      </div>
      <div>
        <label class="text-xs text-[rgb(var(--foreground-muted))] block mb-1">Gap</label>
        <input
          v-model.number="settings.gap"
          type="range"
          min="0"
          max="8"
          class="w-full"
        />
        <span class="text-xs text-[rgb(var(--foreground-muted))]">{{ settings.gap }}px</span>
      </div>
      <div>
        <label class="text-xs text-[rgb(var(--foreground-muted))] block mb-1">Color</label>
        <input
          v-model="settings.color"
          type="color"
          class="w-full h-9 rounded cursor-pointer"
        />
      </div>
      <div class="flex items-center gap-2 pt-6">
        <input
          v-model="settings.outline"
          type="checkbox"
          id="crosshair-outline"
          class="rounded"
        />
        <label for="crosshair-outline" class="text-sm text-[rgb(var(--foreground))]">Outline</label>
      </div>
    </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import Icon from "~/components/ui/Icon.vue";
import { useAimTrainerCrosshair } from "~/composables/useAimTrainerCrosshair";
import AimTrainerCrosshairPreview from "./AimTrainerCrosshairPreview.vue";

const { settings } = useAimTrainerCrosshair();
const expanded = ref(false);
</script>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition: all 0.2s ease;
}
.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
  overflow: hidden;
}
.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-height: 500px;
}
</style>
