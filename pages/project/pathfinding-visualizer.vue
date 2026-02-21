<template>
  <div class="min-h-screen bg-[rgb(var(--bg))] px-6 py-12">
    <div class="max-w-5xl mx-auto">
      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center gap-3">
          <NuxtLink to="/project" class="w-8 h-8 rounded-lg bg-[rgb(var(--glass))] border border-[rgb(var(--border))] flex items-center justify-center hover:border-red-500/50 transition-colors">
            <Icon name="ArrowLeft" :size="16" class="text-[rgb(var(--foreground-secondary))]" />
          </NuxtLink>
          <h1 class="text-3xl font-bold text-[rgb(var(--foreground))]">Pathfinding Visualizer</h1>
        </div>
        <DarkModeToggle />
      </div>

      <div class="glass-solid rounded-2xl p-6 mb-6">
        <div class="flex flex-wrap gap-4 items-end">
          <div>
            <label class="text-xs text-[rgb(var(--foreground-muted))] uppercase tracking-wide block mb-1">Algorithm</label>
            <select v-model="algorithm" :disabled="running">
              <option value="astar">A*</option>
              <option value="dijkstra">Dijkstra</option>
              <option value="bfs">BFS</option>
              <option value="dfs">DFS</option>
            </select>
          </div>
          <div>
            <label class="text-xs text-[rgb(var(--foreground-muted))] uppercase tracking-wide block mb-1">Speed</label>
            <input v-model.number="speed" type="range" min="1" max="50" class="w-32" />
          </div>
          <label class="flex items-center gap-2 text-sm text-[rgb(var(--foreground-secondary))] cursor-pointer select-none">
            <input v-model="allowDiagonal" type="checkbox" :disabled="running" /> Diagonal
          </label>
          <button
            v-if="!running"
            class="px-5 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold shadow-lg shadow-red-500/25 flex items-center gap-2"
            @click="visualize"
          >
            <Icon name="Play" :size="18" /> Visualize
          </button>
          <button
            v-else
            class="px-5 py-3 rounded-xl bg-red-500/20 text-red-500 font-semibold border border-red-500/30 flex items-center gap-2"
            @click="cancelled = true"
          >
            <Icon name="Square" :size="18" /> Stop
          </button>
          <button
            class="px-5 py-3 rounded-xl bg-[rgb(var(--glass))] border border-[rgb(var(--border))] text-[rgb(var(--foreground))] font-semibold flex items-center gap-2 disabled:opacity-50"
            :disabled="running"
            @click="clearPath"
          >
            <Icon name="Eraser" :size="18" /> Clear Path
          </button>
          <button
            class="px-5 py-3 rounded-xl bg-[rgb(var(--glass))] border border-[rgb(var(--border))] text-[rgb(var(--foreground))] font-semibold flex items-center gap-2 disabled:opacity-50"
            :disabled="running"
            @click="clearBoard"
          >
            <Icon name="Trash2" :size="18" /> Clear All
          </button>
          <button
            class="px-5 py-3 rounded-xl bg-[rgb(var(--glass))] border border-[rgb(var(--border))] text-[rgb(var(--foreground))] font-semibold flex items-center gap-2 disabled:opacity-50"
            :disabled="running"
            @click="generateMaze"
          >
            <Icon name="LayoutGrid" :size="18" /> Maze
          </button>
          <div class="ml-auto text-sm text-[rgb(var(--foreground-secondary))]">
            Visited: <strong class="text-red-500">{{ visitedCount }}</strong>
            &middot; Path: <strong class="text-red-500">{{ pathLength }}</strong>
          </div>
        </div>
      </div>

      <div class="glass-solid rounded-2xl p-4 overflow-auto" ref="gridContainer">
        <div class="inline-block" @pointerleave="pointerDown = false">
          <div v-for="row in ROWS" :key="row" class="flex">
            <div
              v-for="col in COLS"
              :key="col"
              class="border border-[rgb(var(--border))] cursor-pointer transition-colors duration-100"
              :style="{ width: cellPx + 'px', height: cellPx + 'px' }"
              :class="cellClass(row - 1, col - 1)"
              @pointerdown.prevent="onPointerDown(row - 1, col - 1)"
              @pointerenter="onPointerEnter(row - 1, col - 1)"
              @pointerup="pointerDown = false"
            />
          </div>
        </div>
        <p class="text-xs text-[rgb(var(--foreground-muted))] mt-3">
          Click/drag to draw walls. Drag the green (start) or blue (end) nodes to reposition.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from "vue";
import Icon from "~/components/ui/Icon.vue";

definePageMeta({ layout: false });

const ROWS = 25;
const COLS = 50;
const algorithm = ref("astar");
const speed = ref(20);
const running = ref(false);
const visitedCount = ref(0);
const pathLength = ref(0);
const allowDiagonal = ref(false);
const cellPx = ref(24);
const gridContainer = ref<HTMLElement | null>(null);
let cancelled = false;

const start = reactive({ r: 12, c: 5 });
const end = reactive({ r: 12, c: 44 });

type CellState = "empty" | "wall" | "visited" | "path";
const grid = ref<CellState[][]>(createGrid());
const pointerDown = ref(false);
const dragging = ref<"start" | "end" | null>(null);

function createGrid(): CellState[][] {
  return Array.from({ length: ROWS }, () => Array(COLS).fill("empty"));
}

function cellClass(r: number, c: number) {
  if (r === start.r && c === start.c) return "bg-emerald-500";
  if (r === end.r && c === end.c) return "bg-blue-500";
  const s = grid.value[r][c];
  if (s === "wall") return "bg-[rgb(var(--foreground))]";
  if (s === "path") return "bg-red-500";
  if (s === "visited") return "bg-red-500/20";
  return "";
}

function onPointerDown(r: number, c: number) {
  pointerDown.value = true;
  if (r === start.r && c === start.c) { dragging.value = "start"; return; }
  if (r === end.r && c === end.c) { dragging.value = "end"; return; }
  dragging.value = null;
  toggleWall(r, c);
}

function onPointerEnter(r: number, c: number) {
  if (!pointerDown.value) return;
  if (dragging.value === "start") { start.r = r; start.c = c; return; }
  if (dragging.value === "end") { end.r = r; end.c = c; return; }
  grid.value[r][c] = "wall";
}

function toggleWall(r: number, c: number) {
  if ((r === start.r && c === start.c) || (r === end.r && c === end.c)) return;
  grid.value[r][c] = grid.value[r][c] === "wall" ? "empty" : "wall";
}

function clearPath() {
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++)
      if (grid.value[r][c] === "visited" || grid.value[r][c] === "path") grid.value[r][c] = "empty";
  visitedCount.value = 0;
  pathLength.value = 0;
}

function clearBoard() {
  grid.value = createGrid();
  visitedCount.value = 0;
  pathLength.value = 0;
}

function generateMaze() {
  clearBoard();
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++)
      grid.value[r][c] = "wall";

  function carve(r: number, c: number) {
    grid.value[r][c] = "empty";
    const dirs: [number, number][] = [[-2, 0], [2, 0], [0, -2], [0, 2]];
    dirs.sort(() => Math.random() - 0.5);
    for (const [dr, dc] of dirs) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && grid.value[nr][nc] === "wall") {
        grid.value[r + dr / 2][c + dc / 2] = "empty";
        carve(nr, nc);
      }
    }
  }
  const sr = start.r % 2 === 0 ? start.r + 1 : start.r;
  const sc = start.c % 2 === 0 ? start.c + 1 : start.c;
  carve(Math.min(sr, ROWS - 2), Math.min(sc, COLS - 2));
  grid.value[start.r][start.c] = "empty";
  grid.value[end.r][end.c] = "empty";
}

function delay() {
  return new Promise((r) => setTimeout(r, Math.max(1, 51 - speed.value)));
}

function neighbors(r: number, c: number): [number, number][] {
  const dirs: [number, number][] = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  if (allowDiagonal.value) dirs.push([-1, -1], [-1, 1], [1, -1], [1, 1]);
  return dirs
    .map(([dr, dc]) => [r + dr, c + dc] as [number, number])
    .filter(([nr, nc]) => nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && grid.value[nr][nc] !== "wall");
}

function heuristic(r: number, c: number) {
  if (allowDiagonal.value) return Math.max(Math.abs(r - end.r), Math.abs(c - end.c));
  return Math.abs(r - end.r) + Math.abs(c - end.c);
}

async function visualize() {
  clearPath();
  cancelled = false;
  running.value = true;

  const prev: Record<string, string | null> = {};
  const key = (r: number, c: number) => `${r},${c}`;
  const visited = new Set<string>();

  if (algorithm.value === "bfs" || algorithm.value === "dfs") {
    const list: [number, number][] = [[start.r, start.c]];
    visited.add(key(start.r, start.c));
    prev[key(start.r, start.c)] = null;
    let found = false;

    while (list.length && !cancelled && !found) {
      const [r, c] = algorithm.value === "bfs" ? list.shift()! : list.pop()!;
      if (r === end.r && c === end.c) { found = true; break; }
      for (const [nr, nc] of neighbors(r, c)) {
        const k = key(nr, nc);
        if (visited.has(k)) continue;
        visited.add(k);
        prev[k] = key(r, c);
        if (!(nr === end.r && nc === end.c)) { grid.value[nr][nc] = "visited"; visitedCount.value++; }
        await delay();
        if (nr === end.r && nc === end.c) { found = true; break; }
        list.push([nr, nc]);
      }
    }
  } else {
    const dist: Record<string, number> = { [key(start.r, start.c)]: 0 };
    const pq: { r: number; c: number; f: number }[] = [{ r: start.r, c: start.c, f: 0 }];
    prev[key(start.r, start.c)] = null;

    while (pq.length && !cancelled) {
      pq.sort((a, b) => a.f - b.f);
      const { r, c } = pq.shift()!;
      const k = key(r, c);
      if (visited.has(k)) continue;
      visited.add(k);
      if (!(r === start.r && c === start.c) && !(r === end.r && c === end.c)) {
        grid.value[r][c] = "visited";
        visitedCount.value++;
      }
      await delay();
      if (r === end.r && c === end.c) break;

      for (const [nr, nc] of neighbors(r, c)) {
        const nk = key(nr, nc);
        const cost = (Math.abs(nr - r) + Math.abs(nc - c)) > 1 ? 1.414 : 1;
        const nd = dist[k] + cost;
        if (nd < (dist[nk] ?? Infinity)) {
          dist[nk] = nd;
          prev[nk] = k;
          const f = algorithm.value === "astar" ? nd + heuristic(nr, nc) : nd;
          pq.push({ r: nr, c: nc, f });
        }
      }
    }
  }

  let cur = key(end.r, end.c);
  const path: string[] = [];
  while (cur && prev[cur] !== undefined) {
    path.push(cur);
    cur = prev[cur]!;
  }
  if (path.length && prev[key(start.r, start.c)] === null) {
    path.push(key(start.r, start.c));
    path.reverse();
    pathLength.value = path.length;
    for (const p of path) {
      if (cancelled) break;
      const [r, c] = p.split(",").map(Number);
      if ((r === start.r && c === start.c) || (r === end.r && c === end.c)) continue;
      grid.value[r][c] = "path";
      await delay();
    }
  }

  running.value = false;
}

function updateCellSize() {
  if (!gridContainer.value) return;
  const w = gridContainer.value.clientWidth - 32;
  cellPx.value = Math.max(8, Math.min(24, Math.floor(w / COLS)));
}

let ro: ResizeObserver | null = null;
onMounted(() => {
  updateCellSize();
  ro = new ResizeObserver(updateCellSize);
  if (gridContainer.value) ro.observe(gridContainer.value);
});
onUnmounted(() => { cancelled = true; ro?.disconnect(); });
</script>
