<template>
  <div class="min-h-screen bg-[rgb(var(--bg))] px-6 py-12">
    <div class="max-w-3xl mx-auto">
      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center gap-3">
          <NuxtLink to="/project" class="w-8 h-8 rounded-lg bg-[rgb(var(--glass))] border border-[rgb(var(--border))] flex items-center justify-center hover:border-red-500/50 transition-colors">
            <Icon name="ArrowLeft" :size="16" class="text-[rgb(var(--foreground-secondary))]" />
          </NuxtLink>
          <h1 class="text-3xl font-bold text-[rgb(var(--foreground))]">Hash Generator</h1>
        </div>
        <DarkModeToggle />
      </div>

      <div class="glass-solid rounded-2xl p-6 mb-6">
        <div class="flex flex-wrap gap-6 mb-6 items-center">
          <div class="flex gap-4">
            <label class="flex items-center gap-2 text-sm text-[rgb(var(--foreground))] cursor-pointer">
              <input v-model="mode" type="radio" value="text" /> Text
            </label>
            <label class="flex items-center gap-2 text-sm text-[rgb(var(--foreground))] cursor-pointer">
              <input v-model="mode" type="radio" value="file" /> File
            </label>
          </div>
          <label class="flex items-center gap-2 text-sm text-[rgb(var(--foreground-secondary))] cursor-pointer select-none ml-auto">
            <input v-model="uppercase" type="checkbox" /> Uppercase
          </label>
        </div>

        <div v-if="mode === 'text'">
          <textarea
            v-model="text"
            rows="4"
            class="w-full px-4 py-3 rounded-xl bg-[rgb(var(--glass))] border border-[rgb(var(--border))] text-[rgb(var(--foreground))] font-mono text-sm resize-none"
            placeholder="Enter text to hash..."
            spellcheck="false"
          />
        </div>
        <div v-else>
          <div
            class="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors"
            :class="dragActive ? 'border-red-500 bg-red-500/5' : 'border-[rgb(var(--border))] hover:border-red-500/50'"
            @click="fileInput?.click()"
            @dragover.prevent="dragActive = true"
            @dragenter.prevent="dragActive = true"
            @dragleave.prevent="dragActive = false"
            @drop.prevent="onDrop"
          >
            <Icon name="Upload" :size="32" class="text-[rgb(var(--foreground-muted))] mx-auto mb-2" />
            <p class="text-sm text-[rgb(var(--foreground-secondary))]">
              {{ fileName || "Drop a file or click to select" }}
            </p>
            <p v-if="fileSize" class="text-xs text-[rgb(var(--foreground-muted))] mt-1">{{ fileSize }}</p>
          </div>
          <input ref="fileInput" type="file" class="hidden" @change="onFileSelect" />
        </div>

        <div class="mt-6">
          <label class="text-xs text-[rgb(var(--foreground-muted))] uppercase tracking-wide block mb-2">Algorithm</label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="algo in algorithmOptions"
              :key="algo"
              class="px-4 py-2 rounded-xl text-sm font-medium transition-colors"
              :class="selected === algo
                ? 'bg-red-500 text-white'
                : 'bg-[rgb(var(--glass))] border border-[rgb(var(--border))] text-[rgb(var(--foreground-secondary))] hover:border-red-500/50'"
              @click="selected = algo"
            >
              {{ algo }}
            </button>
          </div>
        </div>
      </div>

      <div v-if="hashing" class="glass-solid rounded-2xl p-8 text-center mb-6">
        <div class="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p class="text-sm text-red-500">Hashing...</p>
      </div>

      <div v-else-if="selected === 'All' && allHashes.length" class="glass-solid rounded-2xl p-6 mb-6 space-y-4">
        <div v-for="h in allHashes" :key="h.algo">
          <div class="flex items-center justify-between mb-1">
            <label class="text-xs text-[rgb(var(--foreground-muted))] uppercase tracking-wide">{{ h.algo }}</label>
            <button class="text-xs text-red-500 font-medium flex items-center gap-1 hover:opacity-80" @click="copyText(h.hash)">
              <Icon name="Copy" :size="12" /> Copy
            </button>
          </div>
          <p class="font-mono text-xs text-[rgb(var(--foreground))] break-all leading-relaxed bg-[rgb(var(--glass))] rounded-lg px-3 py-2 border border-[rgb(var(--border))]">
            {{ formatHash(h.hash) }}
          </p>
        </div>
      </div>

      <div v-else-if="hash" class="glass-solid rounded-2xl p-6 mb-6">
        <div class="flex items-center justify-between mb-2">
          <label class="text-xs text-[rgb(var(--foreground-muted))] uppercase tracking-wide">{{ selected }} Hash</label>
          <button
            class="text-xs text-red-500 font-medium flex items-center gap-1 hover:opacity-80"
            @click="copyText(hash)"
          >
            <Icon :name="copied ? 'Check' : 'Copy'" :size="14" />
            {{ copied ? "Copied" : "Copy" }}
          </button>
        </div>
        <p class="font-mono text-sm text-[rgb(var(--foreground))] break-all leading-relaxed bg-[rgb(var(--glass))] rounded-xl px-4 py-3 border border-[rgb(var(--border))]">
          {{ formatHash(hash) }}
        </p>
      </div>

      <div class="glass-solid rounded-2xl p-6">
        <label class="text-xs text-[rgb(var(--foreground-muted))] uppercase tracking-wide block mb-2">Compare Hash</label>
        <input
          v-model="compareHash"
          type="text"
          class="w-full px-4 py-3 rounded-xl bg-[rgb(var(--glass))] border border-[rgb(var(--border))] text-[rgb(var(--foreground))] font-mono text-sm"
          placeholder="Paste a hash to compare..."
          spellcheck="false"
        />
        <div v-if="compareHash && (hash || allHashes.length)" class="mt-3 flex items-center gap-2">
          <Icon
            :name="isMatch ? 'CheckCircle' : 'XCircle'"
            :size="20"
            :class="isMatch ? 'text-emerald-500' : 'text-red-500'"
          />
          <span class="text-sm" :class="isMatch ? 'text-emerald-500' : 'text-red-500'">
            {{ isMatch ? "Hashes match" : "Hashes do not match" }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import Icon from "~/components/ui/Icon.vue";

definePageMeta({ layout: false });

const algorithms = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"];
const algorithmOptions = ["All", ...algorithms];
const selected = ref("SHA-256");
const mode = ref<"text" | "file">("text");
const text = ref("");
const hash = ref("");
const hashing = ref(false);
const copied = ref(false);
const compareHash = ref("");
const fileName = ref("");
const fileSize = ref("");
const uppercase = ref(false);
const dragActive = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);
let fileBuffer: ArrayBuffer | null = null;

interface HashResult { algo: string; hash: string; }
const allHashes = ref<HashResult[]>([]);

function formatHash(h: string): string {
  return uppercase.value ? h.toUpperCase() : h.toLowerCase();
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

const isMatch = computed(() => {
  if (!compareHash.value) return false;
  const c = compareHash.value.trim().toLowerCase();
  if (hash.value && hash.value.toLowerCase() === c) return true;
  return allHashes.value.some((h) => h.hash.toLowerCase() === c);
});

async function digestData(algo: string, data: ArrayBuffer): Promise<string> {
  const hashBuffer = await crypto.subtle.digest(algo, data);
  return Array.from(new Uint8Array(hashBuffer)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function computeHash() {
  hashing.value = true;
  hash.value = "";
  allHashes.value = [];

  try {
    let data: ArrayBuffer;
    if (mode.value === "text") {
      data = new TextEncoder().encode(text.value).buffer as ArrayBuffer;
    } else {
      if (!fileBuffer) { hashing.value = false; return; }
      data = fileBuffer;
    }

    if (selected.value === "All") {
      const results = await Promise.all(algorithms.map(async (algo) => ({
        algo,
        hash: await digestData(algo, data),
      })));
      allHashes.value = results;
    } else {
      hash.value = await digestData(selected.value, data);
    }
  } catch {
    hash.value = "Error computing hash";
  }
  hashing.value = false;
}

watch([text, selected, mode], () => {
  if (mode.value === "text" && text.value) computeHash();
  else if (mode.value === "text" && !text.value) { hash.value = ""; allHashes.value = []; }
});

watch(selected, () => {
  if (mode.value === "file" && fileBuffer) computeHash();
});

function onFileSelect(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (file) loadFile(file);
}

function onDrop(e: DragEvent) {
  dragActive.value = false;
  const file = e.dataTransfer?.files?.[0];
  if (file) loadFile(file);
}

function loadFile(file: File) {
  fileName.value = file.name;
  fileSize.value = formatSize(file.size);
  const reader = new FileReader();
  reader.onload = () => { fileBuffer = reader.result as ArrayBuffer; computeHash(); };
  reader.readAsArrayBuffer(file);
}

async function copyText(t: string) {
  await navigator.clipboard.writeText(formatHash(t));
  copied.value = true;
  setTimeout(() => (copied.value = false), 2000);
}
</script>
