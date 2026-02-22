<template>
  <div class="min-h-screen bg-[rgb(var(--bg))] px-6 py-12">
    <div class="max-w-4xl mx-auto">
      <div class="flex items-center gap-3 mb-8">
        <BackToProjects />
        <h1 class="text-3xl font-bold text-[rgb(var(--foreground))]">Sorting Visualizer</h1>
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
            <label class="text-xs text-[rgb(var(--foreground-muted))] uppercase tracking-wide block mb-1">Preset</label>
            <select v-model="preset" :disabled="running" class="w-36">
              <option v-for="p in presets" :key="p.key" :value="p.key">{{ p.label }}</option>
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
              class="px-5 py-3 rounded-xl bg-gradient-to-r from-accent to-accent-hover text-white font-semibold shadow-lg shadow-accent/25 flex items-center gap-2"
              @click="run"
            >
              <Icon name="Play" :size="18" /> Sort
            </button>
            <button
              v-else
              class="px-5 py-3 rounded-xl bg-accent/20 text-accent font-semibold border border-accent/30 flex items-center gap-2"
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
          <span>Comparisons: <strong class="text-accent">{{ comparisons }}</strong></span>
          <span>Swaps: <strong class="text-accent">{{ swaps }}</strong></span>
          <span>Complexity: <strong class="text-accent">{{ algorithms.find(a => a.key === algorithm)?.complexity }}</strong></span>
          <span>Elapsed: <strong class="text-accent">{{ elapsedDisplay }}</strong></span>
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
useSeo({
  title: "Sorting Visualizer | Joel Stephen - Portfolio",
  description: "Watch bubble, merge, quick, and heap sort race in real-time.",
  path: "/project/sorting-visualizer",
  breadcrumbTitle: "Sorting Visualizer",
});

import { ref, computed, watch, onUnmounted } from "vue";
import { useIntervalFn } from "@vueuse/core";
import Icon from "~/components/ui/Icon.vue";

definePageMeta({ layout: "default" });

const algorithms = [
  { key: "bubble", label: "Bubble Sort", complexity: "O(n²)" },
  { key: "selection", label: "Selection Sort", complexity: "O(n²)" },
  { key: "insertion", label: "Insertion Sort", complexity: "O(n²)" },
  { key: "shell", label: "Shell Sort", complexity: "O(n^1.3)" },
  { key: "cocktail", label: "Cocktail Sort", complexity: "O(n²)" },
  { key: "merge", label: "Merge Sort", complexity: "O(n log n)" },
  { key: "quick", label: "Quick Sort", complexity: "O(n log n)" },
  { key: "heap", label: "Heap Sort", complexity: "O(n log n)" },
  { key: "counting", label: "Counting Sort", complexity: "O(n+k)" },
  { key: "radix", label: "Radix Sort", complexity: "O(nk)" },
];

const presets = [
  { key: "random", label: "Random" },
  { key: "nearly", label: "Nearly Sorted" },
  { key: "reverse", label: "Reverse Sorted" },
  { key: "few", label: "Few Unique" },
];

const algorithm = ref("merge");
const preset = ref("random");
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

const { pause: pauseElapsedTimer, resume: resumeElapsedTimer } = useIntervalFn(
  () => { elapsed.value = performance.now() - startTime; },
  100,
  { immediate: false }
);

let audioCtx: AudioContext | null = null;

const maxVal = computed(() => Math.max(...arr.value, 1));

const elapsedDisplay = computed(() => {
  if (elapsed.value === 0 && !running.value) return "0.0s";
  return `${(elapsed.value / 1000).toFixed(1)}s`;
});

function barClass(i: number) {
  if (sorted.value.has(i)) return "bg-emerald-500";
  if (active.value.has(i)) return "bg-accent";
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
  const n = size.value;
  if (preset.value === "random") {
    arr.value = Array.from({ length: n }, () => Math.floor(Math.random() * 200) + 5);
  } else if (preset.value === "nearly") {
    arr.value = Array.from({ length: n }, (_, i) => i * 3 + Math.floor(Math.random() * 5));
    for (let i = 0; i < n / 10; i++) {
      const a = Math.floor(Math.random() * n);
      const b = Math.floor(Math.random() * n);
      [arr.value[a], arr.value[b]] = [arr.value[b], arr.value[a]];
    }
  } else if (preset.value === "reverse") {
    arr.value = Array.from({ length: n }, (_, i) => (n - i) * 3 + Math.floor(Math.random() * 3));
  } else {
    const vals = [10, 50, 100, 150, 200];
    arr.value = Array.from({ length: n }, () => vals[Math.floor(Math.random() * vals.length)]);
  }
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

watch([size, preset], () => { if (!running.value) shuffle(); });

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

async function shellSort() {
  const n = arr.value.length;
  for (let gap = Math.floor(n / 2); gap > 0 && !cancelled; gap = Math.floor(gap / 2)) {
    for (let i = gap; i < n && !cancelled; i++) {
      let j = i;
      while (j >= gap && !cancelled) {
        if (await compare(j - gap, j)) { await swap(j - gap, j); j -= gap; }
        else break;
      }
    }
  }
  if (!cancelled) sorted.value = new Set(Array.from({ length: n }, (_, i) => i));
}

async function cocktailSort() {
  const n = arr.value.length;
  let start = 0, end = n - 1;
  while (start < end && !cancelled) {
    for (let i = start; i < end && !cancelled; i++) {
      if (await compare(i, i + 1)) await swap(i, i + 1);
    }
    sorted.value.add(end);
    end--;
    for (let i = end; i > start && !cancelled; i--) {
      if (await compare(i - 1, i)) await swap(i - 1, i);
    }
    sorted.value.add(start);
    start++;
  }
  if (!cancelled && start === end) sorted.value.add(start);
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
  async function heapify(sz: number, root: number) {
    let largest = root;
    const left = 2 * root + 1;
    const right = 2 * root + 2;
    if (left < sz) { if (await compare(left, largest)) largest = left; }
    if (right < sz) { if (await compare(right, largest)) largest = right; }
    if (largest !== root && !cancelled) {
      await swap(root, largest);
      await heapify(sz, largest);
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

async function countingSort() {
  const n = arr.value.length;
  const max = Math.max(...arr.value);
  const count = new Array(max + 1).fill(0);
  for (let i = 0; i < n && !cancelled; i++) {
    count[arr.value[i]]++;
    active.value = new Set([i]);
    await delay();
  }
  let idx = 0;
  for (let v = 0; v <= max && !cancelled; v++) {
    for (let c = 0; c < count[v]; c++) {
      arr.value[idx] = v;
      swaps.value++;
      active.value = new Set([idx]);
      sorted.value.add(idx);
      await delay();
      idx++;
    }
  }
}

async function radixSort() {
  const n = arr.value.length;
  const maxVal = Math.max(...arr.value);
  let exp = 1;
  while (Math.floor(maxVal / exp) > 0 && !cancelled) {
    const output = [...arr.value];
    const count = new Array(10).fill(0);
    for (let i = 0; i < n; i++) count[Math.floor(arr.value[i] / exp) % 10]++;
    for (let i = 1; i < 10; i++) count[i] += count[i - 1];
    for (let i = n - 1; i >= 0; i--) {
      const d = Math.floor(arr.value[i] / exp) % 10;
      output[count[d] - 1] = arr.value[i];
      count[d]--;
    }
    for (let i = 0; i < n && !cancelled; i++) {
      arr.value[i] = output[i];
      active.value = new Set([i]);
      await delay();
    }
    exp *= 10;
  }
  if (!cancelled) sorted.value = new Set(Array.from({ length: n }, (_, i) => i));
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
  resumeElapsedTimer();

  const sorters: Record<string, () => Promise<void>> = {
    bubble: bubbleSort, selection: selectionSort, insertion: insertionSort,
    shell: shellSort, cocktail: cocktailSort, merge: mergeSort, quick: quickSort,
    heap: heapSort, counting: countingSort, radix: radixSort,
  };
  const fn = sorters[algorithm.value];
  if (fn) await fn();

  pauseElapsedTimer();
  elapsed.value = performance.now() - startTime;
  active.value = new Set();
  running.value = false;
}

onUnmounted(() => {
  cancelled = true;
  pauseElapsedTimer();
  if (audioCtx) audioCtx.close();
});
</script>
