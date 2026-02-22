<template>
  <div class="min-h-screen bg-[rgb(var(--bg))] px-6 py-12">
    <div class="max-w-5xl mx-auto">
      <div class="flex items-center gap-3 mb-8">
        <BackToProjects />
        <h1 class="text-3xl font-bold text-[rgb(var(--foreground))]">Pathfinding Visualizer</h1>
      </div>

      <div class="glass-solid rounded-2xl p-6 mb-6">
        <div class="flex flex-wrap gap-4 items-end">
          <div>
            <label class="text-xs text-[rgb(var(--foreground-muted))] uppercase tracking-wide block mb-1">Algorithm</label>
            <select v-model="algorithm" :disabled="running">
              <option value="astar">A*</option>
              <option value="dijkstra">Dijkstra</option>
              <option value="greedy">Greedy Best-First</option>
              <option value="bfs">BFS</option>
              <option value="dfs">DFS</option>
            </select>
          </div>
          <div>
            <label class="text-xs text-[rgb(var(--foreground-muted))] uppercase tracking-wide block mb-1">Heuristic</label>
            <select v-model="heuristicType" :disabled="running">
              <option value="manhattan">Manhattan</option>
              <option value="euclidean">Euclidean</option>
              <option value="chebyshev">Chebyshev</option>
            </select>
          </div>
          <div>
            <label class="text-xs text-[rgb(var(--foreground-muted))] uppercase tracking-wide block mb-1">Maze</label>
            <select v-model="mazeType" :disabled="running">
              <option value="backtrack">Recursive Backtrack</option>
              <option value="division">Recursive Division</option>
              <option value="prim">Prim's</option>
            </select>
          </div>
          <div>
            <label class="text-xs text-[rgb(var(--foreground-muted))] uppercase tracking-wide block mb-1">Grid</label>
            <select v-model="gridSize" :disabled="running" @change="onGridSizeChange">
              <option value="small">20×40</option>
              <option value="medium">25×50</option>
              <option value="large">30×60</option>
            </select>
          </div>
          <div>
            <label class="text-xs text-[rgb(var(--foreground-muted))] uppercase tracking-wide block mb-1">Draw</label>
            <select v-model="drawMode" :disabled="running">
              <option value="wall">Wall</option>
              <option value="weight">Weight (×2)</option>
              <option value="erase">Erase</option>
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
            class="px-5 py-3 rounded-xl bg-gradient-to-r from-accent to-accent-hover text-white font-semibold shadow-lg shadow-accent/25 flex items-center gap-2"
            @click="visualize"
          >
            <Icon name="Play" :size="18" /> Visualize
          </button>
          <button
            v-else
            class="px-5 py-3 rounded-xl bg-accent/20 text-accent font-semibold border border-accent/30 flex items-center gap-2"
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
            Visited: <strong class="text-accent">{{ visitedCount }}</strong>
            &middot; Path: <strong class="text-accent">{{ pathLength }}</strong>
            <span v-if="pathCost > 0">&middot; Cost: <strong class="text-accent">{{ pathCost.toFixed(1) }}</strong></span>
          </div>
        </div>
      </div>

      <div class="glass-solid rounded-2xl p-4 overflow-auto" ref="gridContainer">
        <div class="inline-block" @pointerleave="pointerDown = false">
          <div v-for="row in rows" :key="row" class="flex">
            <div
              v-for="col in cols"
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
          Click/drag to draw. Green=start, Blue=end. Draw mode: Wall, Weight (cost 2), or Erase.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useSeo({
  title: "Pathfinding Visualizer | Joel Stephen - Portfolio",
  description: "A*, Dijkstra, and BFS on an interactive grid with walls.",
  path: "/project/pathfinding-visualizer",
  breadcrumbTitle: "Pathfinding Visualizer",
});

import { ref, reactive, computed, onMounted, onUnmounted } from "vue";
import { useResizeObserver } from "@vueuse/core";
import Icon from "~/components/ui/Icon.vue";

definePageMeta({ layout: "default" });

const gridSizes = { small: [20, 40], medium: [25, 50], large: [30, 60] } as const;
const rows = ref(25);
const cols = ref(50);
const gridSize = ref<keyof typeof gridSizes>("medium");

const algorithm = ref("astar");
const heuristicType = ref<"manhattan" | "euclidean" | "chebyshev">("manhattan");
const mazeType = ref<"backtrack" | "division" | "prim">("backtrack");
const drawMode = ref<"wall" | "weight" | "erase">("wall");
const speed = ref(20);
const running = ref(false);
const visitedCount = ref(0);
const pathLength = ref(0);
const pathCost = ref(0);
const allowDiagonal = ref(false);
const cellPx = ref(24);
const gridContainer = ref<HTMLElement | null>(null);
let cancelled = false;

const start = reactive({ r: 12, c: 5 });
const end = reactive({ r: 12, c: 44 });

type CellState = "empty" | "wall" | "visited" | "path";
const grid = ref<CellState[][]>([]);
const weights = ref<number[][]>([]);
const pointerDown = ref(false);
const dragging = ref<"start" | "end" | null>(null);

function createGrid(): CellState[][] {
  return Array.from({ length: rows.value }, () => Array(cols.value).fill("empty"));
}

function createWeights(): number[][] {
  return Array.from({ length: rows.value }, () => Array(cols.value).fill(1));
}

function onGridSizeChange() {
  const [r, c] = gridSizes[gridSize.value];
  rows.value = r;
  cols.value = c;
  start.r = Math.floor(r / 2);
  start.c = Math.floor(c / 10);
  end.r = Math.floor(r / 2);
  end.c = c - Math.floor(c / 10);
  grid.value = createGrid();
  weights.value = createWeights();
}

function cellClass(r: number, c: number) {
  if (r === start.r && c === start.c) return "bg-emerald-500";
  if (r === end.r && c === end.c) return "bg-blue-500";
  const s = grid.value[r]?.[c];
  if (s === "wall") return "bg-[rgb(var(--foreground))]";
  if (s === "path") return "bg-accent";
  if (s === "visited") return "bg-accent/20";
  const w = weights.value[r]?.[c];
  if (w > 1) return "bg-amber-500/40";
  return "";
}

function onPointerDown(r: number, c: number) {
  pointerDown.value = true;
  if (r === start.r && c === start.c) { dragging.value = "start"; return; }
  if (r === end.r && c === end.c) { dragging.value = "end"; return; }
  dragging.value = null;
  applyDraw(r, c);
}

function onPointerEnter(r: number, c: number) {
  if (!pointerDown.value) return;
  if (dragging.value === "start") { start.r = r; start.c = c; return; }
  if (dragging.value === "end") { end.r = r; end.c = c; return; }
  applyDraw(r, c);
}

function applyDraw(r: number, c: number) {
  if ((r === start.r && c === start.c) || (r === end.r && c === end.c)) return;
  if (drawMode.value === "wall") {
    grid.value[r][c] = grid.value[r][c] === "wall" ? "empty" : "wall";
    weights.value[r][c] = 1;
  } else if (drawMode.value === "weight") {
    if (grid.value[r][c] !== "wall") weights.value[r][c] = weights.value[r][c] === 2 ? 1 : 2;
  } else {
    grid.value[r][c] = "empty";
    weights.value[r][c] = 1;
  }
}

function clearPath() {
  for (let r = 0; r < rows.value; r++)
    for (let c = 0; c < cols.value; c++)
      if (grid.value[r][c] === "visited" || grid.value[r][c] === "path") grid.value[r][c] = "empty";
  visitedCount.value = 0;
  pathLength.value = 0;
  pathCost.value = 0;
}

function clearBoard() {
  grid.value = createGrid();
  weights.value = createWeights();
  visitedCount.value = 0;
  pathLength.value = 0;
  pathCost.value = 0;
}

function getCellCost(r: number, c: number, nr: number, nc: number): number {
  const base = (Math.abs(nr - r) + Math.abs(nc - c)) > 1 ? 1.414 : 1;
  return base * (weights.value[nr]?.[nc] ?? 1);
}

function generateMaze() {
  clearBoard();
  const R = rows.value;
  const C = cols.value;

  if (mazeType.value === "backtrack") {
    for (let r = 0; r < R; r++)
      for (let c = 0; c < C; c++) grid.value[r][c] = "wall";
    function carve(r: number, c: number) {
      grid.value[r][c] = "empty";
      const dirs: [number, number][] = [[-2, 0], [2, 0], [0, -2], [0, 2]];
      dirs.sort(() => Math.random() - 0.5);
      for (const [dr, dc] of dirs) {
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < R && nc >= 0 && nc < C && grid.value[nr][nc] === "wall") {
          grid.value[r + dr / 2][c + dc / 2] = "empty";
          carve(nr, nc);
        }
      }
    }
    carve(Math.min(start.r % 2 ? start.r : start.r + 1, R - 2), Math.min(start.c % 2 ? start.c : start.c + 1, C - 2));
  } else if (mazeType.value === "division") {
    for (let r = 0; r < R; r++)
      for (let c = 0; c < C; c++) grid.value[r][c] = "empty";
    function divide(minR: number, minC: number, maxR: number, maxC: number) {
      const h = maxR - minR + 1, w = maxC - minC + 1;
      if (h < 3 || w < 3) return;
      const isHoriz = h > w;
      if (isHoriz) {
        const wallR = minR + 1 + Math.floor(Math.random() * (h - 2));
        const holeC = minC + Math.floor(Math.random() * w);
        for (let c = minC; c <= maxC; c++)
          if (c !== holeC) grid.value[wallR][c] = "wall";
        divide(minR, minC, wallR - 1, maxC);
        divide(wallR + 1, minC, maxR, maxC);
      } else {
        const wallC = minC + 1 + Math.floor(Math.random() * (w - 2));
        const holeR = minR + Math.floor(Math.random() * h);
        for (let r = minR; r <= maxR; r++)
          if (r !== holeR) grid.value[r][wallC] = "wall";
        divide(minR, minC, maxR, wallC - 1);
        divide(minR, wallC + 1, maxR, maxC);
      }
    }
    divide(0, 0, R - 1, C - 1);
  } else {
    for (let r = 0; r < R; r++)
      for (let c = 0; c < C; c++) grid.value[r][c] = "wall";
    const frontiers: [number, number][] = [];
    const sr = start.r % 2 ? start.r : Math.min(start.r + 1, R - 2);
    const sc = start.c % 2 ? start.c : Math.min(start.c + 1, C - 2);
    grid.value[sr][sc] = "empty";
    for (const [dr, dc] of [[-2, 0], [2, 0], [0, -2], [0, 2]]) {
      const nr = sr + dr, nc = sc + dc;
      if (nr >= 0 && nr < R && nc >= 0 && nc < C) frontiers.push([nr, nc]);
    }
    while (frontiers.length) {
      const idx = Math.floor(Math.random() * frontiers.length);
      const [r, c] = frontiers.splice(idx, 1)[0];
      if (grid.value[r][c] === "empty") continue;
      const neighbors: [number, number][] = [];
      for (const [dr, dc] of [[-2, 0], [2, 0], [0, -2], [0, 2]]) {
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < R && nc >= 0 && nc < C && grid.value[nr][nc] === "empty")
          neighbors.push([(r + nr) / 2, (c + nc) / 2]);
      }
      if (neighbors.length) {
        const [mr, mc] = neighbors[Math.floor(Math.random() * neighbors.length)];
        grid.value[r][c] = "empty";
        grid.value[mr][mc] = "empty";
        for (const [dr, dc] of [[-2, 0], [2, 0], [0, -2], [0, 2]]) {
          const nr = r + dr, nc = c + dc;
          if (nr >= 0 && nr < R && nc >= 0 && nc < C && grid.value[nr][nc] === "wall")
            frontiers.push([nr, nc]);
        }
      }
    }
  }
  grid.value[start.r][start.c] = "empty";
  grid.value[end.r][end.c] = "empty";
}

function delay() {
  return new Promise((r) => setTimeout(r, Math.max(1, 51 - speed.value)));
}

function heuristic(r: number, c: number): number {
  const dr = Math.abs(r - end.r);
  const dc = Math.abs(c - end.c);
  if (heuristicType.value === "manhattan") return dr + dc;
  if (heuristicType.value === "euclidean") return Math.sqrt(dr * dr + dc * dc);
  return Math.max(dr, dc);
}

function neighbors(r: number, c: number): [number, number][] {
  const dirs: [number, number][] = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  if (allowDiagonal.value) dirs.push([-1, -1], [-1, 1], [1, -1], [1, 1]);
  return dirs
    .map(([dr, dc]) => [r + dr, c + dc] as [number, number])
    .filter(([nr, nc]) => nr >= 0 && nr < rows.value && nc >= 0 && nc < cols.value && grid.value[nr][nc] !== "wall");
}

async function visualize() {
  clearPath();
  cancelled = false;
  running.value = true;
  pathCost.value = 0;

  const prev: Record<string, string | null> = {};
  const dist: Record<string, number> = {};
  const key = (r: number, c: number) => `${r},${c}`;
  const visited = new Set<string>();
  dist[key(start.r, start.c)] = 0;
  prev[key(start.r, start.c)] = null;

  if (algorithm.value === "bfs" || algorithm.value === "dfs") {
    const list: [number, number][] = [[start.r, start.c]];
    visited.add(key(start.r, start.c));
    let found = false;
    while (list.length && !cancelled && !found) {
      const [r, c] = algorithm.value === "bfs" ? list.shift()! : list.pop()!;
      if (r === end.r && c === end.c) { found = true; break; }
      for (const [nr, nc] of neighbors(r, c)) {
        const k = key(nr, nc);
        if (visited.has(k)) continue;
        visited.add(k);
        prev[k] = key(r, c);
        dist[k] = (dist[key(r, c)] ?? 0) + getCellCost(r, c, nr, nc);
        if (!(nr === end.r && nc === end.c)) { grid.value[nr][nc] = "visited"; visitedCount.value++; }
        await delay();
        if (nr === end.r && nc === end.c) { found = true; break; }
        list.push([nr, nc]);
      }
    }
  } else {
    const pq: { r: number; c: number; f: number }[] = [];
    const startKey = key(start.r, start.c);
    const h0 = algorithm.value === "greedy" ? heuristic(start.r, start.c) : 0;
    pq.push({ r: start.r, c: start.c, f: h0 });

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

      const d = dist[k] ?? 0;
      for (const [nr, nc] of neighbors(r, c)) {
        const nk = key(nr, nc);
        const cost = getCellCost(r, c, nr, nc);
        const nd = d + cost;
        if (nd < (dist[nk] ?? Infinity)) {
          dist[nk] = nd;
          prev[nk] = k;
          const h = heuristic(nr, nc);
          const f = algorithm.value === "greedy" ? h : nd + (algorithm.value === "astar" ? h : 0);
          pq.push({ r: nr, c: nc, f });
        }
      }
    }
  }

  let cur = key(end.r, end.c);
  const path: string[] = [];
  let cost = 0;
  while (cur && prev[cur] !== undefined) {
    path.push(cur);
    const [r, c] = cur.split(",").map(Number);
    const prevKey = prev[cur];
    if (prevKey) {
      const [pr, pc] = prevKey.split(",").map(Number);
      cost += getCellCost(pr, pc, r, c);
    }
    cur = prev[cur]!;
  }
  pathCost.value = cost;

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
  cellPx.value = Math.max(8, Math.min(24, Math.floor(w / cols.value)));
}

useResizeObserver(gridContainer, updateCellSize);
onMounted(() => {
  grid.value = createGrid();
  weights.value = createWeights();
  updateCellSize();
});
onUnmounted(() => { cancelled = true; });
</script>
