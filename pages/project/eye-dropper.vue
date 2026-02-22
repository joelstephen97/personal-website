<template>
  <div class="min-h-screen bg-[rgb(var(--bg))] px-6 py-12">
    <div class="max-w-3xl mx-auto">
      <div class="flex items-center gap-3 mb-8">
        <BackToProjects />
        <h1 class="text-3xl font-bold text-[rgb(var(--foreground))]">
          Eye Dropper
        </h1>
      </div>

      <p class="text-[rgb(var(--foreground-muted))] mb-8">
        Pick colors from anywhere on your screen—browser, desktop, or other apps. Uses the native EyeDropper API.
      </p>

      <div v-if="!isSupported" class="glass-solid rounded-2xl p-8 text-center">
        <p class="text-amber-600">
          EyeDropper API is not supported in this browser. Try Chrome, Edge, or Opera.
        </p>
      </div>

      <template v-else>
        <div class="glass-solid rounded-2xl p-6 mb-6">
          <button
            class="w-full py-6 rounded-xl bg-gradient-to-r from-accent to-accent-hover text-white font-semibold flex items-center justify-center gap-3 shadow-lg shadow-accent/25 hover:opacity-95 transition"
            :disabled="picking"
            @click="pickColor"
          >
            <Icon name="Pipette" :size="24" />
            {{ picking ? "Pick a color on screen..." : "Pick Color from Screen" }}
          </button>
        </div>

        <div v-if="sRGBHex" class="glass-solid rounded-2xl p-6 mb-6">
          <p class="text-xs text-[rgb(var(--foreground-muted))] uppercase tracking-wide mb-3">Current Color</p>
          <div class="flex flex-wrap items-center gap-4">
            <div
              class="w-24 h-24 rounded-xl border-2 border-[rgb(var(--border))] shadow-lg"
              :style="{ backgroundColor: sRGBHex }"
            />
            <div class="space-y-2">
              <div class="flex items-center gap-2">
                <input
                  :value="sRGBHex"
                  type="text"
                  class="px-3 py-2 rounded-lg bg-[rgb(var(--glass))] border border-[rgb(var(--border))] font-mono text-sm w-28"
                  readonly
                />
                <button
                  class="px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium flex items-center gap-1 hover:opacity-90"
                  @click="copyColor(sRGBHex)"
                >
                  <Icon name="Copy" :size="14" /> Copy
                </button>
              </div>
              <p class="text-xs text-[rgb(var(--foreground-muted))] font-mono">
                RGB {{ rgbString }}
              </p>
              <p class="text-xs text-[rgb(var(--foreground-muted))] font-mono">
                HSL {{ hslString }}
              </p>
            </div>
          </div>
        </div>

        <div v-if="history.length" class="glass-solid rounded-2xl p-6">
          <div class="flex items-center justify-between mb-4">
            <p class="text-sm font-semibold text-[rgb(var(--foreground))]">Color History</p>
            <button
              class="text-xs text-accent hover:opacity-80"
              @click="clearHistory"
            >
              Clear
            </button>
          </div>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="(color, i) in history"
              :key="`${color}-${i}`"
              class="w-10 h-10 rounded-lg border-2 border-[rgb(var(--border))] hover:scale-110 transition-transform"
              :style="{ backgroundColor: color }"
              :title="color"
              @click="selectFromHistory(color)"
            />
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
useSeo({
  title: "Eye Dropper | Joel Stephen - Portfolio",
  description: "Pick colors from anywhere on screen via the native EyeDropper API.",
  path: "/project/eye-dropper",
  breadcrumbTitle: "Eye Dropper",
});

import { ref, computed } from "vue";
import { useEyeDropper, useClipboard, useStorage } from "@vueuse/core";
import Icon from "~/components/ui/Icon.vue";

definePageMeta({ layout: "default" });

const HISTORY_KEY = "eye-dropper-history";
const MAX_HISTORY = 24;

const { isSupported, sRGBHex, open } = useEyeDropper({ initialValue: "" });
const { copy } = useClipboard({ copiedDuring: 2000 });
const history = useStorage<string[]>(HISTORY_KEY, []);
const picking = ref(false);

const rgbString = computed(() => {
  const h = sRGBHex.value;
  if (!h || !h.startsWith("#")) return "";
  const r = parseInt(h.slice(1, 3), 16);
  const g = parseInt(h.slice(3, 5), 16);
  const b = parseInt(h.slice(5, 7), 16);
  return `(${r}, ${g}, ${b})`;
});

const hslString = computed(() => {
  const h = sRGBHex.value;
  if (!h || !h.startsWith("#")) return "";
  const r = parseInt(h.slice(1, 3), 16) / 255;
  const g = parseInt(h.slice(3, 5), 16) / 255;
  const b = parseInt(h.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let hue = 0;
  let sat = 0;
  const light = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    sat = light > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) hue = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) hue = ((b - r) / d + 2) / 6;
    else hue = ((r - g) / d + 4) / 6;
  }
  return `(${Math.round(hue * 360)}°, ${Math.round(sat * 100)}%, ${Math.round(light * 100)}%)`;
});

async function pickColor() {
  picking.value = true;
  try {
    const result = await open();
    if (result?.sRGBHex) {
      addToHistory(result.sRGBHex);
    }
  } catch {
    // User cancelled
  }
  picking.value = false;
}

function addToHistory(color: string) {
  const next = [color, ...history.value.filter((c) => c !== color)].slice(0, MAX_HISTORY);
  history.value = next;
}

function selectFromHistory(color: string) {
  sRGBHex.value = color;
  copy(color);
}

function copyColor(color: string) {
  copy(color);
}

function clearHistory() {
  history.value = [];
}
</script>
