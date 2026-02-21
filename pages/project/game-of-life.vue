<template>
  <div class="min-h-screen bg-[rgb(var(--bg))] px-6 py-12">
    <div class="max-w-4xl mx-auto">
      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center gap-3">
          <NuxtLink to="/project" class="w-8 h-8 rounded-lg bg-[rgb(var(--glass))] border border-[rgb(var(--border))] flex items-center justify-center hover:border-accent/50 transition-colors">
            <Icon name="ArrowLeft" :size="16" class="text-[rgb(var(--foreground-secondary))]" />
          </NuxtLink>
          <h1 class="text-3xl font-bold text-[rgb(var(--foreground))]">Game of Life</h1>
        </div>
        <DarkModeToggle />
      </div>

      <div class="glass-solid rounded-2xl p-6 mb-6">
        <div class="flex flex-wrap gap-4 items-end">
          <div>
            <label class="text-xs text-[rgb(var(--foreground-muted))] uppercase tracking-wide block mb-1">Preset</label>
            <select v-model="preset" @change="loadPreset">
              <option value="">Empty</option>
              <option value="glider">Glider</option>
              <option value="lwss">LWSS</option>
              <option value="pulsar">Pulsar</option>
              <option value="gosper">Gosper Glider Gun</option>
            </select>
          </div>
          <div>
            <label class="text-xs text-[rgb(var(--foreground-muted))] uppercase tracking-wide block mb-1">Speed: {{ fps }} FPS</label>
            <input v-model.number="fps" type="range" min="1" max="60" class="w-32" />
          </div>
          <button
            class="px-5 py-3 rounded-xl bg-gradient-to-r from-accent to-accent-hover text-white font-semibold shadow-lg shadow-accent/25 flex items-center gap-2"
            @click="toggle"
          >
            <Icon :name="playing ? 'Pause' : 'Play'" :size="18" />
            {{ playing ? "Pause" : "Play" }}
          </button>
          <button
            v-if="!playing"
            class="px-5 py-3 rounded-xl bg-[rgb(var(--glass))] border border-[rgb(var(--border))] text-[rgb(var(--foreground))] font-semibold flex items-center gap-2"
            @click="step"
          >
            <Icon name="SkipForward" :size="18" /> Step
          </button>
          <button
            class="px-5 py-3 rounded-xl bg-[rgb(var(--glass))] border border-[rgb(var(--border))] text-[rgb(var(--foreground))] font-semibold flex items-center gap-2"
            @click="randomize"
          >
            <Icon name="Shuffle" :size="18" /> Random
          </button>
          <button
            class="px-5 py-3 rounded-xl bg-[rgb(var(--glass))] border border-[rgb(var(--border))] text-[rgb(var(--foreground))] font-semibold flex items-center gap-2"
            @click="clear"
          >
            <Icon name="Trash2" :size="18" /> Clear
          </button>
          <div class="ml-auto text-sm text-[rgb(var(--foreground-secondary))]">
            Gen: <strong class="text-accent">{{ generation }}</strong>
            &middot; Alive: <strong class="text-accent">{{ currentAlive }}</strong>
          </div>
        </div>
      </div>

      <div class="glass-solid rounded-2xl p-4 flex flex-col items-center gap-4">
        <canvas
          ref="canvas"
          class="cursor-crosshair rounded-xl"
          :style="{ width: COLS * CELL + 'px', height: ROWS * CELL + 'px' }"
          @pointerdown.prevent="onCanvasClick"
          @pointermove="onCanvasDrag"
          @pointerup="isDragging = false"
          @pointerleave="isDragging = false"
        />
        <div v-if="popHistory.length > 1" class="w-full max-w-md">
          <p class="text-xs text-[rgb(var(--foreground-muted))] mb-1">Population History</p>
          <div class="flex items-end gap-[1px] h-12">
            <div
              v-for="(p, i) in popHistory"
              :key="i"
              class="flex-1 bg-accent/60 rounded-t transition-all"
              :style="{ height: maxPop > 0 ? `${(p / maxPop) * 100}%` : '0%' }"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import Icon from "~/components/ui/Icon.vue";

definePageMeta({ layout: false });

const ROWS = 50;
const COLS = 70;
const CELL = 10;

const canvas = ref<HTMLCanvasElement | null>(null);
const playing = ref(false);
const fps = ref(10);
const generation = ref(0);
const preset = ref("");
const isDragging = ref(false);
const currentAlive = ref(0);
const popHistory = ref<number[]>([]);
let animFrame: number | null = null;
let lastTick = 0;

let grid = createGrid();
let buffer = createGrid();

const maxPop = computed(() => Math.max(...popHistory.value, 1));

function createGrid() {
  return Array.from({ length: ROWS }, () => new Uint8Array(COLS));
}

function countAlive(): number {
  let count = 0;
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++)
      if (grid[r][c]) count++;
  return count;
}

function updateAlive() {
  currentAlive.value = countAlive();
  popHistory.value.push(currentAlive.value);
  if (popHistory.value.length > 100) popHistory.value.shift();
}

function draw() {
  const cvs = canvas.value;
  if (!cvs) return;
  const dpr = window.devicePixelRatio || 1;
  const w = COLS * CELL;
  const h = ROWS * CELL;
  cvs.width = w * dpr;
  cvs.height = h * dpr;
  const ctx = cvs.getContext("2d")!;
  ctx.scale(dpr, dpr);

  const isDark = document.documentElement.classList.contains("dark");
  ctx.fillStyle = isDark ? "#0a0a0a" : "#fafafa";
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = "#ef4444";
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++)
      if (grid[r][c]) ctx.fillRect(c * CELL + 1, r * CELL + 1, CELL - 2, CELL - 2);

  ctx.strokeStyle = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)";
  ctx.lineWidth = 0.5;
  for (let r = 0; r <= ROWS; r++) { ctx.beginPath(); ctx.moveTo(0, r * CELL); ctx.lineTo(w, r * CELL); ctx.stroke(); }
  for (let c = 0; c <= COLS; c++) { ctx.beginPath(); ctx.moveTo(c * CELL, 0); ctx.lineTo(c * CELL, h); ctx.stroke(); }
}

function step() {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      let n = 0;
      for (let dr = -1; dr <= 1; dr++)
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = (r + dr + ROWS) % ROWS;
          const nc = (c + dc + COLS) % COLS;
          n += grid[nr][nc];
        }
      buffer[r][c] = grid[r][c] ? (n === 2 || n === 3 ? 1 : 0) : (n === 3 ? 1 : 0);
    }
  }
  [grid, buffer] = [buffer, grid];
  generation.value++;
  updateAlive();
  draw();
}

function loop(ts: number) {
  if (!playing.value) return;
  const interval = 1000 / fps.value;
  if (ts - lastTick >= interval) { step(); lastTick = ts; }
  animFrame = requestAnimationFrame(loop);
}

function toggle() {
  playing.value = !playing.value;
  if (playing.value) { lastTick = performance.now(); animFrame = requestAnimationFrame(loop); }
}

function clear() {
  playing.value = false;
  generation.value = 0;
  popHistory.value = [];
  grid = createGrid();
  updateAlive();
  draw();
}

function randomize() {
  playing.value = false;
  generation.value = 0;
  popHistory.value = [];
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++)
      grid[r][c] = Math.random() < 0.25 ? 1 : 0;
  updateAlive();
  draw();
}

function cellFromEvent(e: PointerEvent): [number, number] | null {
  const rect = canvas.value!.getBoundingClientRect();
  const scaleX = (COLS * CELL) / rect.width;
  const scaleY = (ROWS * CELL) / rect.height;
  const c = Math.floor((e.clientX - rect.left) * scaleX / CELL);
  const r = Math.floor((e.clientY - rect.top) * scaleY / CELL);
  if (r >= 0 && r < ROWS && c >= 0 && c < COLS) return [r, c];
  return null;
}

function onCanvasClick(e: PointerEvent) {
  isDragging.value = true;
  const pos = cellFromEvent(e);
  if (pos) { grid[pos[0]][pos[1]] ^= 1; updateAlive(); draw(); }
}

function onCanvasDrag(e: PointerEvent) {
  if (!isDragging.value) return;
  const pos = cellFromEvent(e);
  if (pos) { grid[pos[0]][pos[1]] = 1; updateAlive(); draw(); }
}

const PRESETS: Record<string, [number, number][]> = {
  glider: [[0,1],[1,2],[2,0],[2,1],[2,2]],
  lwss: [[0,1],[0,4],[1,0],[2,0],[2,4],[3,0],[3,1],[3,2],[3,3]],
  pulsar: (() => {
    const cells: [number, number][] = [];
    const offsets = [[2,1],[3,1],[4,1],[2,6],[3,6],[4,6],[1,2],[1,3],[1,4],[6,2],[6,3],[6,4]];
    for (const [r, c] of offsets) cells.push([r, c], [r, 12 - c], [12 - r, c], [12 - r, 12 - c]);
    return [...new Set(cells.map(([r, c]) => `${r},${c}`))].map(s => s.split(",").map(Number) as [number, number]);
  })(),
  gosper: [
    [5,1],[5,2],[6,1],[6,2],[3,13],[3,14],[4,12],[4,16],[5,11],[5,17],[6,11],[6,15],[6,17],[6,18],
    [7,11],[7,17],[8,12],[8,16],[9,13],[9,14],[1,25],[2,23],[2,25],[3,21],[3,22],[4,21],[4,22],
    [5,21],[5,22],[6,23],[6,25],[7,25],[3,35],[3,36],[4,35],[4,36],
  ],
};

function loadPreset() {
  clear();
  const cells = PRESETS[preset.value];
  if (!cells) return;
  const offR = Math.floor(ROWS / 2) - 6;
  const offC = Math.floor(COLS / 2) - 6;
  for (const [r, c] of cells) {
    const nr = r + offR, nc = c + offC;
    if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) grid[nr][nc] = 1;
  }
  updateAlive();
  draw();
}

watch(playing, (v) => {
  if (!v && animFrame) { cancelAnimationFrame(animFrame); animFrame = null; }
});

onMounted(() => { updateAlive(); draw(); });
onUnmounted(() => { if (animFrame) cancelAnimationFrame(animFrame); });
</script>
