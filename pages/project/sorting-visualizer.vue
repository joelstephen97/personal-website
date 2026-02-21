<template>
  <div class="min-h-screen bg-[rgb(var(--bg))] px-6 py-12">
    <div class="max-w-4xl mx-auto">
      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center gap-3">
          <NuxtLink to="/project" class="w-8 h-8 rounded-lg bg-[rgb(var(--glass))] border border-[rgb(var(--border))] flex items-center justify-center hover:border-red-500/50 transition-colors">
            <Icon name="ArrowLeft" :size="16" class="text-[rgb(var(--foreground-secondary))]" />
          </NuxtLink>
          <h1 class="text-3xl font-bold text-[rgb(var(--foreground))]">Sorting Visualizer</h1>
        </div>
        <DarkModeToggle />
      </div>

      <div class="glass-solid rounded-2xl p-6 mb-6">
        <div class="flex flex-wrap gap-4 items-end mb-6">
          <div>
            <label class="text-xs text-[rgb(var(--foreground-muted))] uppercase tracking-wide block mb-1">Algorithm</label>
            <select v-model="algorithm" :disabled="running" class="w-44">
              <option v-for="a in algorithms" :key="a.key" :value="a.key">{{ a.label }}</option>
            </select>
          </div>
          <div>
            <label class="text-xs text-[rgb(var(--foreground-muted))] uppercase tracking-wide block mb-1">Size: {{ size }}</label>
            <input v-model.number="size" type="range" min="10" max="120" :disabled="running" class="w-32" />
          </div>
          <div>
            <label class="text-xs text-[rgb(var(--foreground-muted))] uppercase tracking-wide block mb-1">Speed</label>
            <input v-model.number="speed" type="range" min="1" max="100" class="w-32" />
          </div>
          <div class="flex gap-2">
            <button
              v-if="!running"
              class="px-5 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold shadow-lg shadow-red-500/25 flex items-center gap-2"
              @click="run"
            >
              <Icon name="Play" :size="18" /> Sort
            </button>
            <button
              v-else
              class="px-5 py-3 rounded-xl bg-red-500/20 text-red-500 font-semibold border border-red-500/30 flex items-center gap-2"
              @click="stop"
            >
              <Icon name="Square" :size="18" /> Stop
            </button>
            <button
              class="px-5 py-3 rounded-xl bg-[rgb(var(--glass))] border border-[rgb(var(--border))] text-[rgb(var(--foreground))] font-semibold flex items-center gap-2 disabled:opacity-50"
              :disabled="running"
              @click="shuffle"
            >
              <Icon name="Shuffle" :size="18" /> Shuffle
            </button>
          </div>
          <label class="flex items-center gap-2 text-sm text-[rgb(var(--foreground-secondary))] cursor-pointer select-none ml-auto">
            <input v-model="soundEnabled" type="checkbox" /> Sound
          </label>
        </div>

        <div class="flex items-center gap-4 text-sm text-[rgb(var(--foreground-secondary))] flex-wrap">
          <span>Comparisons: <strong class="text-red-500">{{ comparisons }}</strong></span>
          <span>Swaps: <strong class="text-red-500">{{ swaps }}</strong></span>
          <span>Complexity: <strong class="text-red-500">{{ algorithms.find(a => a.key === algorithm)?.complexity }}</strong></span>
          <span>Elapsed: <strong class="text-red-500">{{ elapsedDisplay }}</strong></span>
        </div>
      </div>

      <div class="glass-solid rounded-2xl p-6">
        <div class="flex items-end gap-[2px] h-72">
          <div
            v-for="(val, i) in arr"
            :key="i"
            class="flex-1 rounded-t transition-colors duration-75"
            :style="{ height: `${(val / maxVal) * 100}%` }"
            :class="barClass(i)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from "vue";
import Icon from "~/components/ui/Icon.vue";

definePageMeta({ layout: false });

const algorithms = [
  { key: "bubble", label: "Bubble Sort", complexity: "O(n²)" },
  { key: "selection", label: "Selection Sort", complexity: "O(n²)" },
  { key: "insertion", label: "Insertion Sort", complexity: "O(n²)" },
  { key: "merge", label: "Merge Sort", complexity: "O(n log n)" },
  { key: "quick", label: "Quick Sort", complexity: "O(n log n)" },
  { key: "heap", label: "Heap Sort", complexity: "O(n log n)" },
];

const algorithm = ref("merge");
const size = ref(50);
const speed = ref(50);
const running = ref(false);
const comparisons = ref(0);
const swaps = ref(0);
const arr = ref<number[]>([]);
const active = ref<Set<number>>(new Set());
const sorted = ref<Set<number>>(new Set());
const soundEnabled = ref(false);
const elapsed = ref(0);
let cancelled = false;
let startTime = 0;
let elapsedTimer: ReturnType<typeof setInterval> | null = null;

let audioCtx: AudioContext | null = null;

const maxVal = computed(() => Math.max(...arr.value, 1));

const elapsedDisplay = computed(() => {
  if (elapsed.value === 0 && !running.value) return "0.0s";
  return `${(elapsed.value / 1000).toFixed(1)}s`;
});

function barClass(i: number) {
  if (sorted.value.has(i)) return "bg-emerald-500";
  if (active.value.has(i)) return "bg-red-500";
  return "bg-[rgb(var(--foreground-muted))]";
}

function playTone(freq: number) {
  if (!soundEnabled.value) return;
  if (!audioCtx) audioCtx = new AudioContext();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.frequency.value = 200 + freq * 4;
  gain.gain.value = 0.03;
  osc.start();
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
  osc.stop(audioCtx.currentTime + 0.08);
}

function generateArray() {
  arr.value = Array.from({ length: size.value }, () => Math.floor(Math.random() * 200) + 5);
}

function shuffle() {
  comparisons.value = 0;
  swaps.value = 0;
  elapsed.value = 0;
  active.value = new Set();
  sorted.value = new Set();
  generateArray();
}

shuffle();

watch(size, () => { if (!running.value) shuffle(); });

function delay() {
  return new Promise((r) => setTimeout(r, Math.max(1, 101 - speed.value)));
}

async function swap(i: number, j: number) {
  [arr.value[i], arr.value[j]] = [arr.value[j], arr.value[i]];
  swaps.value++;
  active.value = new Set([i, j]);
  playTone(arr.value[i]);
  await delay();
}

async function compare(i: number, j: number): Promise<boolean> {
  comparisons.value++;
  active.value = new Set([i, j]);
  await delay();
  return arr.value[i] > arr.value[j];
}

async function bubbleSort() {
  const n = arr.value.length;
  for (let i = 0; i < n - 1 && !cancelled; i++) {
    for (let j = 0; j < n - i - 1 && !cancelled; j++) {
      if (await compare(j, j + 1)) await swap(j, j + 1);
    }
    sorted.value.add(n - i - 1);
  }
  if (!cancelled) sorted.value.add(0);
}

async function selectionSort() {
  const n = arr.value.length;
  for (let i = 0; i < n - 1 && !cancelled; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n && !cancelled; j++) {
      comparisons.value++;
      active.value = new Set([minIdx, j]);
      await delay();
      if (arr.value[j] < arr.value[minIdx]) minIdx = j;
    }
    if (minIdx !== i) await swap(i, minIdx);
    sorted.value.add(i);
  }
  if (!cancelled) sorted.value.add(arr.value.length - 1);
}

async function insertionSort() {
  const n = arr.value.length;
  for (let i = 1; i < n && !cancelled; i++) {
    let j = i;
    while (j > 0 && !cancelled) {
      if (await compare(j - 1, j)) { await swap(j - 1, j); j--; }
      else break;
    }
  }
  if (!cancelled) sorted.value = new Set(Array.from({ length: n }, (_, i) => i));
}

async function mergeSort() {
  async function merge(l: number, m: number, r: number) {
    const left = arr.value.slice(l, m + 1);
    const right = arr.value.slice(m + 1, r + 1);
    let i = 0, j = 0, k = l;
    while (i < left.length && j < right.length && !cancelled) {
      comparisons.value++;
      active.value = new Set([k]);
      playTone(arr.value[k]);
      await delay();
      if (left[i] <= right[j]) arr.value[k++] = left[i++];
      else { arr.value[k++] = right[j++]; swaps.value++; }
    }
    while (i < left.length && !cancelled) { arr.value[k++] = left[i++]; active.value = new Set([k - 1]); await delay(); }
    while (j < right.length && !cancelled) { arr.value[k++] = right[j++]; active.value = new Set([k - 1]); await delay(); }
  }
  async function sort(l: number, r: number) {
    if (l >= r || cancelled) return;
    const m = Math.floor((l + r) / 2);
    await sort(l, m);
    await sort(m + 1, r);
    await merge(l, m, r);
  }
  await sort(0, arr.value.length - 1);
  if (!cancelled) sorted.value = new Set(Array.from({ length: arr.value.length }, (_, i) => i));
}

async function quickSort() {
  async function partition(l: number, r: number): Promise<number> {
    const pivot = arr.value[r];
    let i = l - 1;
    for (let j = l; j < r && !cancelled; j++) {
      comparisons.value++;
      active.value = new Set([j, r]);
      await delay();
      if (arr.value[j] < pivot) { i++; await swap(i, j); }
    }
    await swap(i + 1, r);
    sorted.value.add(i + 1);
    return i + 1;
  }
  async function sort(l: number, r: number) {
    if (l >= r || cancelled) { if (l === r) sorted.value.add(l); return; }
    const p = await partition(l, r);
    await sort(l, p - 1);
    await sort(p + 1, r);
  }
  await sort(0, arr.value.length - 1);
}

async function heapSort() {
  const n = arr.value.length;
  async function heapify(size: number, root: number) {
    let largest = root;
    const left = 2 * root + 1;
    const right = 2 * root + 2;
    if (left < size) { if (await compare(left, largest)) largest = left; }
    if (right < size) { if (await compare(right, largest)) largest = right; }
    if (largest !== root && !cancelled) {
      await swap(root, largest);
      await heapify(size, largest);
    }
  }
  for (let i = Math.floor(n / 2) - 1; i >= 0 && !cancelled; i--) await heapify(n, i);
  for (let i = n - 1; i > 0 && !cancelled; i--) {
    await swap(0, i);
    sorted.value.add(i);
    await heapify(i, 0);
  }
  if (!cancelled) sorted.value.add(0);
}

function stop() {
  cancelled = true;
}

async function run() {
  cancelled = false;
  running.value = true;
  comparisons.value = 0;
  swaps.value = 0;
  elapsed.value = 0;
  sorted.value = new Set();
  startTime = performance.now();
  elapsedTimer = setInterval(() => { elapsed.value = performance.now() - startTime; }, 100);

  const sorters: Record<string, () => Promise<void>> = {
    bubble: bubbleSort, selection: selectionSort, insertion: insertionSort,
    merge: mergeSort, quick: quickSort, heap: heapSort,
  };
  await sorters[algorithm.value]();

  if (elapsedTimer) clearInterval(elapsedTimer);
  elapsed.value = performance.now() - startTime;
  active.value = new Set();
  running.value = false;
}

onUnmounted(() => {
  cancelled = true;
  if (elapsedTimer) clearInterval(elapsedTimer);
  if (audioCtx) audioCtx.close();
});
</script>
