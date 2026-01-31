<template>
  <div class="min-h-screen bg-[rgb(var(--bg))]">
    <!-- Pre-game -->
    <div v-if="!playing" class="max-w-xl mx-auto px-6 py-20 text-center">
      <h1 class="text-4xl font-bold text-[rgb(var(--foreground))] mb-2">Aim Trainer</h1>
      <p class="text-[rgb(var(--foreground-secondary))] mb-8">Improve your precision and reaction time</p>

      <div class="glass-solid rounded-2xl p-6 mb-6">
        <div class="flex justify-center gap-8 mb-6">
          <div class="text-center">
            <p class="text-xs text-[rgb(var(--foreground-muted))] uppercase tracking-wide">Time</p>
            <p class="text-3xl font-bold text-red-500">{{ time }}s</p>
          </div>
          <div class="text-center">
            <p class="text-xs text-[rgb(var(--foreground-muted))] uppercase tracking-wide">Score</p>
            <p class="text-3xl font-bold text-red-500">{{ score }}</p>
          </div>
        </div>

        <div class="flex items-center justify-center gap-3 mb-6">
          <label class="text-sm text-[rgb(var(--foreground))]">Duration:</label>
          <input v-model.number="duration" type="number" class="w-20 px-3 py-2 rounded-lg bg-[rgb(var(--glass))] border border-[rgb(var(--border))] text-center text-[rgb(var(--foreground))]" />
          <span class="text-sm text-[rgb(var(--foreground-secondary))]">sec</span>
        </div>

        <div class="flex justify-center gap-3">
          <button @click="start" class="px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold shadow-lg shadow-red-500/25 flex items-center gap-2">
            <Icon name="Play" :size="18" /> Start
          </button>
          <button @click="reset" class="px-6 py-3 rounded-xl bg-[rgb(var(--glass))] border border-[rgb(var(--border))] text-[rgb(var(--foreground))] font-semibold flex items-center gap-2">
            <Icon name="RotateCcw" :size="18" /> Reset
          </button>
        </div>
      </div>

      <!-- History -->
      <div v-if="history.length" class="glass-solid rounded-2xl p-6">
        <h3 class="font-semibold text-[rgb(var(--foreground))] mb-4">Recent Runs</h3>
        <div class="flex justify-center gap-2">
          <div v-for="(h, i) in history" :key="i" class="flex flex-col items-center">
            <div class="w-8 h-24 bg-[rgb(var(--border))] rounded-t-lg relative overflow-hidden">
              <div class="absolute bottom-0 w-full bg-gradient-to-t from-red-500 to-red-600 rounded-t-lg" :style="{ height: `${Math.min(h * 3, 100)}%` }" />
            </div>
            <span class="text-xs text-[rgb(var(--foreground-muted))] mt-1">{{ h }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Game -->
    <div v-else ref="area" class="fixed inset-0 bg-[rgb(var(--bg))] cursor-crosshair" @click="miss">
      <div class="absolute top-0 inset-x-0 glass p-4 flex justify-between items-center">
        <div class="flex gap-6">
          <span class="flex items-center gap-2 text-[rgb(var(--foreground))]">
            <Icon name="Clock" :size="18" class="text-red-500" /> {{ time.toFixed(1) }}s
          </span>
          <span class="flex items-center gap-2 text-[rgb(var(--foreground))]">
            <Icon name="Target" :size="18" class="text-red-500" /> {{ score }}
          </span>
        </div>
        <button @click="end" class="px-4 py-2 rounded-lg bg-[rgb(var(--glass))] border border-[rgb(var(--border))] text-sm font-medium">Exit</button>
      </div>

      <div
        class="absolute w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-red-600 shadow-lg shadow-red-500/50 cursor-pointer hover:scale-110 transition-transform"
        :style="{ left: `${x}px`, top: `${y}px` }"
        @click.stop="hit"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from "vue";
import Icon from "~/components/ui/Icon.vue";

definePageMeta({ layout: false });

const playing = ref(false);
const score = ref(0);
const time = ref(30);
const duration = ref(30);
const x = ref(100);
const y = ref(200);
const history = ref<number[]>([]);
const area = ref<HTMLElement | null>(null);

let timer: ReturnType<typeof setInterval> | null = null;

function start() {
  score.value = 0;
  time.value = duration.value;
  playing.value = true;
  place();
  timer = setInterval(() => {
    time.value = Math.max(0, time.value - 0.1);
    if (time.value <= 0) end();
  }, 100);
}

function end() {
  if (timer) clearInterval(timer);
  playing.value = false;
  history.value.push(score.value);
  if (history.value.length > 5) history.value.shift();
}

function reset() {
  score.value = 0;
  time.value = duration.value;
}

function hit() {
  score.value += 2;
  place();
}

function miss() {
  score.value = Math.max(0, score.value - 1);
}

function place() {
  const w = window.innerWidth - 60;
  const h = window.innerHeight - 120;
  x.value = Math.random() * w;
  y.value = 80 + Math.random() * h;
}

onUnmounted(() => { if (timer) clearInterval(timer); });
</script>
