<template>
  <div class="min-h-screen bg-[rgb(var(--bg))] px-6 py-12">
    <div class="max-w-5xl mx-auto">
      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center gap-3">
          <NuxtLink to="/project" class="w-8 h-8 rounded-lg bg-[rgb(var(--glass))] border border-[rgb(var(--border))] flex items-center justify-center hover:border-accent/50 transition-colors">
            <Icon name="ArrowLeft" :size="16" class="text-[rgb(var(--foreground-secondary))]" />
          </NuxtLink>
          <h1 class="text-3xl font-bold text-[rgb(var(--foreground))]">JSON Diff</h1>
        </div>
        <DarkModeToggle />
      </div>

      <div class="grid md:grid-cols-2 gap-6 mb-6">
        <div class="glass-solid rounded-2xl p-6">
          <div class="flex items-center justify-between mb-2">
            <label class="text-xs text-[rgb(var(--foreground-muted))] uppercase tracking-wide">Original</label>
            <button class="text-xs text-accent font-medium hover:opacity-80" @click="formatLeft">Format</button>
          </div>
          <textarea
            v-model="leftJson"
            rows="12"
            class="w-full px-4 py-3 rounded-xl bg-[rgb(var(--glass))] border border-[rgb(var(--border))] text-[rgb(var(--foreground))] font-mono text-sm resize-none"
            spellcheck="false"
            placeholder='{"key": "value"}'
          />
          <p v-if="leftError" class="text-accent text-xs mt-2">{{ leftError }}</p>
        </div>
        <div class="glass-solid rounded-2xl p-6">
          <div class="flex items-center justify-between mb-2">
            <label class="text-xs text-[rgb(var(--foreground-muted))] uppercase tracking-wide">Modified</label>
            <button class="text-xs text-accent font-medium hover:opacity-80" @click="formatRight">Format</button>
          </div>
          <textarea
            v-model="rightJson"
            rows="12"
            class="w-full px-4 py-3 rounded-xl bg-[rgb(var(--glass))] border border-[rgb(var(--border))] text-[rgb(var(--foreground))] font-mono text-sm resize-none"
            spellcheck="false"
            placeholder='{"key": "new_value"}'
          />
          <p v-if="rightError" class="text-accent text-xs mt-2">{{ rightError }}</p>
        </div>
      </div>

      <div class="flex flex-wrap gap-3 mb-6">
        <button
          class="px-5 py-3 rounded-xl bg-gradient-to-r from-accent to-accent-hover text-white font-semibold shadow-lg shadow-accent/25 flex items-center gap-2"
          @click="computeDiff"
        >
          <Icon name="GitCompareArrows" :size="18" /> Compare
        </button>
        <button
          class="px-5 py-3 rounded-xl bg-[rgb(var(--glass))] border border-[rgb(var(--border))] text-[rgb(var(--foreground))] font-semibold flex items-center gap-2"
          @click="swapSides"
        >
          <Icon name="ArrowLeftRight" :size="18" /> Swap
        </button>
        <button
          class="px-5 py-3 rounded-xl bg-[rgb(var(--glass))] border border-[rgb(var(--border))] text-[rgb(var(--foreground))] font-semibold flex items-center gap-2"
          @click="loadSample"
        >
          <Icon name="FileJson" :size="18" /> Sample
        </button>
        <button
          v-if="diffLines.length"
          class="px-5 py-3 rounded-xl bg-[rgb(var(--glass))] border border-[rgb(var(--border))] text-[rgb(var(--foreground))] font-semibold flex items-center gap-2"
          @click="copyDiff"
        >
          <Icon :name="copied ? 'Check' : 'Copy'" :size="18" /> {{ copied ? "Copied" : "Copy Diff" }}
        </button>
      </div>

      <div v-if="diffLines.length" class="glass-solid rounded-2xl p-6">
        <div class="flex items-center gap-4 mb-4 text-sm text-[rgb(var(--foreground-secondary))]">
          <span class="flex items-center gap-1.5">
            <span class="w-3 h-3 rounded bg-emerald-500/30" /> Added: <strong class="text-emerald-500">{{ stats.added }}</strong>
          </span>
          <span class="flex items-center gap-1.5">
            <span class="w-3 h-3 rounded bg-accent/30" /> Removed: <strong class="text-accent">{{ stats.removed }}</strong>
          </span>
          <span class="flex items-center gap-1.5">
            <span class="w-3 h-3 rounded bg-amber-500/30" /> Modified: <strong class="text-amber-500">{{ stats.modified }}</strong>
          </span>
        </div>
        <div class="font-mono text-sm space-y-0.5 max-h-96 overflow-auto">
          <div
            v-for="(line, i) in diffLines"
            :key="i"
            class="px-3 py-1 rounded"
            :class="{
              'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400': line.type === 'added',
              'bg-accent/10 text-accent-hover dark:text-accent': line.type === 'removed',
              'bg-amber-500/10 text-amber-600 dark:text-amber-400': line.type === 'modified',
              'text-[rgb(var(--foreground-secondary))]': line.type === 'unchanged',
            }"
          >
            <span class="select-none mr-2 opacity-50">{{ line.prefix }}</span>
            <span :style="{ paddingLeft: line.depth * 12 + 'px' }">{{ line.text }}</span>
          </div>
        </div>
      </div>

      <div v-else-if="compared" class="glass-solid rounded-2xl p-12 text-center">
        <Icon name="Check" :size="48" class="text-emerald-500 mx-auto mb-3" />
        <p class="text-[rgb(var(--foreground-secondary))]">Objects are identical</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Icon from "~/components/ui/Icon.vue";

definePageMeta({ layout: false });

const leftJson = ref("");
const rightJson = ref("");
const leftError = ref("");
const rightError = ref("");
const compared = ref(false);
const copied = ref(false);

interface DiffLine { type: "added" | "removed" | "modified" | "unchanged"; text: string; prefix: string; depth: number; }
const diffLines = ref<DiffLine[]>([]);
const stats = ref({ added: 0, removed: 0, modified: 0 });

function formatLeft() {
  try { leftJson.value = JSON.stringify(JSON.parse(leftJson.value), null, 2); leftError.value = ""; }
  catch { leftError.value = "Invalid JSON"; }
}
function formatRight() {
  try { rightJson.value = JSON.stringify(JSON.parse(rightJson.value), null, 2); rightError.value = ""; }
  catch { rightError.value = "Invalid JSON"; }
}

function swapSides() {
  const tmp = leftJson.value;
  leftJson.value = rightJson.value;
  rightJson.value = tmp;
}

function loadSample() {
  leftJson.value = JSON.stringify({
    name: "John Doe", age: 30, email: "john@example.com",
    address: { city: "New York", zip: "10001" },
    hobbies: ["reading", "gaming"], active: true,
  }, null, 2);
  rightJson.value = JSON.stringify({
    name: "John Doe", age: 31, email: "john.doe@example.com",
    address: { city: "San Francisco", zip: "94102", state: "CA" },
    hobbies: ["reading", "gaming", "cooking"], role: "admin",
  }, null, 2);
}

function computeDiff() {
  leftError.value = "";
  rightError.value = "";
  diffLines.value = [];
  stats.value = { added: 0, removed: 0, modified: 0 };
  compared.value = false;

  let left: any, right: any;
  try { left = JSON.parse(leftJson.value || "{}"); } catch { leftError.value = "Invalid JSON"; return; }
  try { right = JSON.parse(rightJson.value || "{}"); } catch { rightError.value = "Invalid JSON"; return; }

  compared.value = true;
  diff(left, right, "", 0);
}

function typeLabel(v: any): string {
  if (v === null) return "null";
  if (Array.isArray(v)) return "array";
  return typeof v;
}

function diff(a: any, b: any, path: string, depth: number) {
  const aIsObj = a !== null && typeof a === "object" && !Array.isArray(a);
  const bIsObj = b !== null && typeof b === "object" && !Array.isArray(b);
  const aIsArr = Array.isArray(a);
  const bIsArr = Array.isArray(b);

  if ((aIsObj && !bIsObj) || (aIsArr && !bIsArr) || (!aIsObj && bIsObj) || (!aIsArr && bIsArr)) {
    if (typeof a !== typeof b || aIsArr !== bIsArr) {
      diffLines.value.push({ type: "modified", text: `${path}: ${typeLabel(a)} → ${typeLabel(b)}`, prefix: "~", depth });
      stats.value.modified++;
      return;
    }
  }

  if (aIsObj && bIsObj) {
    const allKeys = new Set([...Object.keys(a), ...Object.keys(b)]);
    for (const key of [...allKeys].sort()) {
      const p = path ? `${path}.${key}` : key;
      if (!(key in a)) {
        diffLines.value.push({ type: "added", text: `${p}: ${JSON.stringify(b[key])}`, prefix: "+", depth });
        stats.value.added++;
      } else if (!(key in b)) {
        diffLines.value.push({ type: "removed", text: `${p}: ${JSON.stringify(a[key])}`, prefix: "-", depth });
        stats.value.removed++;
      } else {
        diff(a[key], b[key], p, depth + 1);
      }
    }
  } else if (aIsArr && bIsArr) {
    const maxLen = Math.max(a.length, b.length);
    for (let i = 0; i < maxLen; i++) {
      const p = `${path}[${i}]`;
      if (i >= a.length) {
        diffLines.value.push({ type: "added", text: `${p}: ${JSON.stringify(b[i])}`, prefix: "+", depth });
        stats.value.added++;
      } else if (i >= b.length) {
        diffLines.value.push({ type: "removed", text: `${p}: ${JSON.stringify(a[i])}`, prefix: "-", depth });
        stats.value.removed++;
      } else {
        diff(a[i], b[i], p, depth + 1);
      }
    }
  } else if (a !== b) {
    diffLines.value.push({ type: "modified", text: `${path}: ${JSON.stringify(a)} → ${JSON.stringify(b)}`, prefix: "~", depth });
    stats.value.modified++;
  } else {
    diffLines.value.push({ type: "unchanged", text: `${path}: ${JSON.stringify(a)}`, prefix: " ", depth });
  }
}

async function copyDiff() {
  const text = diffLines.value.map((l) => `${l.prefix} ${l.text}`).join("\n");
  await navigator.clipboard.writeText(text);
  copied.value = true;
  setTimeout(() => (copied.value = false), 2000);
}
</script>
