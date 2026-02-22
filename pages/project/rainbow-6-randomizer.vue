<template>
  <div
    class="min-h-screen bg-cover bg-center transition-all duration-500"
    :style="{ backgroundImage: `url(${bg})` }"
  >
    <div
      class="min-h-screen backdrop-blur-md"
      :class="$colorMode.value === 'dark' ? 'bg-black/60' : 'bg-white/60'"
    >
      <div class="max-w-5xl mx-auto px-4 py-6 sm:px-6 sm:py-8">
        <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div class="flex items-center gap-2">
            <BackToProjects />
            <h1 class="text-xl sm:text-2xl font-bold text-[rgb(var(--foreground))]">
              R6 Siege Randomizer
            </h1>
          </div>
          <div class="flex items-center gap-2">
            <label class="flex items-center gap-1.5 text-xs text-[rgb(var(--foreground-secondary))] cursor-pointer select-none">
              <input v-model="soundEnabled" type="checkbox" class="rounded" /> Sound
            </label>
            <button
              class="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-[rgb(var(--glass))] border border-[rgb(var(--border))] text-[rgb(var(--foreground))] hover:border-accent/50 transition flex items-center gap-1.5"
              @click="copyShareLink"
            >
              <Icon :name="shareCopied ? 'Check' : 'Share2'" :size="14" />
              {{ shareCopied ? "Copied" : "Share" }}
            </button>
          </div>
        </div>

        <!-- Compact Settings -->
        <div class="glass-solid rounded-xl p-4 mb-4">
          <div class="flex flex-wrap items-center gap-4">
            <div class="flex items-center gap-2">
              <label class="text-sm font-medium text-[rgb(var(--foreground))]">Players</label>
              <select v-model.number="count" class="px-3 py-1.5 rounded-lg text-sm bg-[rgb(var(--glass))] border border-[rgb(var(--border))]">
                <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
              </select>
            </div>
            <div class="flex-1 min-w-0 grid grid-cols-2 sm:grid-cols-5 gap-2">
              <input
                v-for="i in count"
                :key="i"
                v-model="names[i - 1]"
                :placeholder="`P${i}`"
                class="px-2 py-1.5 rounded-lg text-sm bg-[rgb(var(--glass))] border border-[rgb(var(--border))] placeholder:text-[rgb(var(--foreground-muted))]"
              />
            </div>
          </div>
        </div>

        <!-- Operator Toggles (collapsed by default) -->
        <details class="glass-solid rounded-xl p-3 mb-4">
          <summary class="text-xs font-semibold text-[rgb(var(--foreground))] cursor-pointer select-none flex items-center gap-1.5">
            <Icon name="Settings" :size="14" /> Operator Toggles
          </summary>
          <div class="grid sm:grid-cols-2 gap-4 mt-3 pt-3 border-t border-[rgb(var(--border))]">
            <div>
              <p class="text-[10px] text-[rgb(var(--foreground-muted))] uppercase mb-1.5">Attackers</p>
              <div class="flex flex-wrap gap-1">
                <button
                  v-for="op in atkOps"
                  :key="op"
                  class="px-1.5 py-0.5 rounded text-[10px] font-medium transition-colors"
                  :class="enabledAtk.has(op) ? 'bg-accent/20 text-accent border border-accent/50' : 'bg-[rgb(var(--glass))] border border-[rgb(var(--border))] text-[rgb(var(--foreground-muted))] opacity-60'"
                  @click="toggleOp('atk', op)"
                >
                  {{ op }}
                </button>
              </div>
            </div>
            <div>
              <p class="text-[10px] text-[rgb(var(--foreground-muted))] uppercase mb-1.5">Defenders</p>
              <div class="flex flex-wrap gap-1">
                <button
                  v-for="op in defOps"
                  :key="op"
                  class="px-1.5 py-0.5 rounded text-[10px] font-medium transition-colors"
                  :class="enabledDef.has(op) ? 'bg-accent/20 text-accent border border-accent/50' : 'bg-[rgb(var(--glass))] border border-[rgb(var(--border))] text-[rgb(var(--foreground-muted))] opacity-60'"
                  @click="toggleOp('def', op)"
                >
                  {{ op }}
                </button>
              </div>
            </div>
          </div>
        </details>

        <!-- History (compact, collapsible) -->
        <details v-if="pickHistory.length" class="glass-solid rounded-xl p-2 mb-4">
          <summary class="text-[10px] text-[rgb(var(--foreground-muted))] uppercase cursor-pointer px-2 py-1">Last Picks</summary>
          <div class="flex flex-wrap gap-1 px-2 pb-2 pt-0">
            <span
              v-for="(p, i) in pickHistory"
              :key="i"
              class="px-1.5 py-0.5 rounded text-[10px] bg-[rgb(var(--glass))] border border-[rgb(var(--border))] text-[rgb(var(--foreground-secondary))]"
            >
              {{ p }}
            </span>
          </div>
        </details>

        <!-- Attackers + Defenders side-by-side -->
        <div class="grid lg:grid-cols-2 gap-6">
          <div class="glass-solid rounded-xl p-4">
            <div class="flex flex-col items-center gap-3">
              <button
                class="w-full py-2.5 rounded-xl bg-gradient-to-r from-accent to-accent-hover text-white font-semibold text-sm shadow-lg shadow-accent/25 flex items-center justify-center gap-2"
                @click="randomize('atk')"
              >
                <Icon name="Shuffle" :size="16" /> Randomize Attackers
              </button>
              <div v-if="attackers.length" class="flex flex-wrap justify-center gap-2">
                <div
                  v-for="(a, i) in attackers"
                  :key="`${a.op}-${i}`"
                  class="glass-solid rounded-lg p-2 text-center group hover:border-accent/30 transition min-w-[72px]"
                >
                  <NuxtImg
                    :src="opImg(a.op)"
                    :alt="a.op"
                    width="48"
                    height="48"
                    loading="lazy"
                    class="w-12 h-12 mx-auto mb-1 rounded-lg"
                  />
                  <p class="font-semibold text-[rgb(var(--foreground))] text-xs truncate">{{ a.op }}</p>
                  <p class="text-[10px] text-[rgb(var(--foreground-muted))] truncate">{{ a.name }}</p>
                  <button class="mt-1 text-[10px] text-accent font-medium" @click="reroll('atk', i)">Re-roll</button>
                </div>
              </div>
            </div>
          </div>
          <div class="glass-solid rounded-xl p-4">
            <div class="flex flex-col items-center gap-3">
              <button
                class="w-full py-2.5 rounded-xl bg-gradient-to-r from-accent to-accent-hover text-white font-semibold text-sm shadow-lg shadow-accent/25 flex items-center justify-center gap-2"
                @click="randomize('def')"
              >
                <Icon name="Shuffle" :size="16" /> Randomize Defenders
              </button>
              <div v-if="defenders.length" class="flex flex-wrap justify-center gap-2">
                <div
                  v-for="(d, i) in defenders"
                  :key="`${d.op}-${i}`"
                  class="glass-solid rounded-lg p-2 text-center group hover:border-accent/30 transition min-w-[72px]"
                >
                  <NuxtImg
                    :src="opImg(d.op)"
                    :alt="d.op"
                    width="48"
                    height="48"
                    loading="lazy"
                    class="w-12 h-12 mx-auto mb-1 rounded-lg"
                  />
                  <p class="font-semibold text-[rgb(var(--foreground))] text-xs truncate">{{ d.op }}</p>
                  <p class="text-[10px] text-[rgb(var(--foreground-muted))] truncate">{{ d.name }}</p>
                  <button class="mt-1 text-[10px] text-accent font-medium" @click="reroll('def', i)">Re-roll</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useSeo({
  title: "R6 Siege Randomizer | Joel Stephen - Portfolio",
  description: "Random operator selection for Rainbow Six Siege matches. Pick attackers and defenders.",
  path: "/project/rainbow-6-randomizer",
  breadcrumbTitle: "R6 Siege Randomizer",
});

import { ref, computed, onMounted } from "vue";
import { useStorage } from "@vueuse/core";
import { useClipboard } from "@vueuse/core";
import Icon from "~/components/ui/Icon.vue";

definePageMeta({ layout: "default" });

const atkOps = [
  "Sledge", "Thatcher", "Ash", "Thermite", "Twitch", "Montagne", "Glaz", "Fuze",
  "Blitz", "IQ", "Buck", "Blackbeard", "Capitao", "Hibana", "Jackal", "Ying",
  "Zofia", "Dokkaebi", "Lion", "Finka", "Maverick", "Nomad", "Gridlock", "Nokk",
  "Amaru", "Kali", "Iana", "Ace", "Zero", "Flores", "Osa", "Sens", "Grim",
  "Brava", "Ram",
];
const defOps = [
  "Smoke", "Mute", "Castle", "Pulse", "Doc", "Rook", "Kapkan", "Tachanka",
  "Jäger", "Bandit", "Frost", "Valkyrie", "Caveira", "Echo", "Mira", "Lesion",
  "Ela", "Vigil", "Maestro", "Alibi", "Clash", "Kaid", "Mozzie", "Warden",
  "Goyo", "Wamai", "Oryx", "Melusi", "Aruni", "Thunderbird", "Thorn", "Azami",
  "Solis", "Fenrir", "Tubarao",
];

const opImg = (n: string) =>
  `https://r6operators.marcopixel.eu/icons/svg/${n
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "")}.svg`;

const count = useStorage("r6-count", 5);
const names = useStorage<string[]>("r6-names", ["", "", "", "", ""]);
const soundEnabled = useStorage("r6-sound", false);
const enabledAtkRaw = useStorage<string[]>("r6-enabled-atk", atkOps);
const enabledDefRaw = useStorage<string[]>("r6-enabled-def", defOps);
const pickHistory = useStorage<string[]>("r6-history", []);

const enabledAtk = computed(() => new Set(enabledAtkRaw.value));
const enabledDef = computed(() => new Set(enabledDefRaw.value));

const attackers = ref<{ op: string; name: string }[]>([]);
const defenders = ref<{ op: string; name: string }[]>([]);

const { copy: copyToClipboard, copied: shareCopied } = useClipboard({ copiedDuring: 2000 });

const bgs = [
  "https://wallpapercave.com/wp/wp1846902.jpg",
  "https://wallpapercave.com/wp/wp1846947.jpg",
  "https://wallpapercave.com/wp/wp1847065.jpg",
];
const bg = ref(bgs[0]);

onMounted(() => {
  bg.value = bgs[Math.floor(Math.random() * bgs.length)];
  applyShareState();
});

function applyShareState() {
  if (import.meta.client) {
    const params = new URLSearchParams(location.search);
    const countParam = params.get("c");
    const namesParam = params.get("n");
    const disabledAtkParam = params.get("da");
    const disabledDefParam = params.get("dd");
    if (countParam) count.value = Math.min(5, Math.max(1, Number(countParam)));
    if (namesParam) {
      try {
        const arr = JSON.parse(decodeURIComponent(namesParam)) as string[];
        names.value = [...arr.slice(0, count.value), ...Array(5).fill("")].slice(0, 5);
      } catch {
        const arr = namesParam.split("|").map((s) => decodeURIComponent(s)).slice(0, count.value);
        names.value = [...arr, ...Array(5).fill("")].slice(0, 5);
      }
    }
    if (disabledAtkParam) {
      const disabled = disabledAtkParam.split(",").filter(Boolean);
      enabledAtkRaw.value = disabled.length ? atkOps.filter((o) => !disabled.includes(o)) : atkOps;
    }
    if (disabledDefParam) {
      const disabled = disabledDefParam.split(",").filter(Boolean);
      enabledDefRaw.value = disabled.length ? defOps.filter((o) => !disabled.includes(o)) : defOps;
    }
    const atkParam = params.get("atk");
    const defParam = params.get("def");
    if (atkParam) {
      try {
        const arr = JSON.parse(atkParam) as { op: string; name: string }[];
        attackers.value = arr.filter((a) => atkOps.includes(a.op));
      } catch { /* ignore */ }
    }
    if (defParam) {
      try {
        const arr = JSON.parse(defParam) as { op: string; name: string }[];
        defenders.value = arr.filter((d) => defOps.includes(d.op));
      } catch { /* ignore */ }
    }
  }
}

function toggleOp(type: "atk" | "def", op: string) {
  const arr = type === "atk" ? [...enabledAtkRaw.value] : [...enabledDefRaw.value];
  const idx = arr.indexOf(op);
  if (idx >= 0) arr.splice(idx, 1);
  else arr.push(op);
  if (type === "atk") enabledAtkRaw.value = arr.length ? arr : atkOps;
  else enabledDefRaw.value = arr.length ? arr : defOps;
}

function playShuffleSound() {
  if (!soundEnabled.value || typeof window === "undefined") return;
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 400;
    gain.gain.value = 0.1;
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
    osc.stop(ctx.currentTime + 0.1);
  } catch { /* ignore */ }
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getNames() {
  return names.value
    .slice(0, count.value)
    .map((n, i) => n.trim() || `Player ${i + 1}`);
}

function addToHistory(type: "atk" | "def", ops: { op: string; name: string }[]) {
  const entries = ops.map((o) => `${o.name}: ${o.op}`).join(" · ");
  const next = [`${type === "atk" ? "ATK" : "DEF"}: ${entries}`, ...pickHistory.value].slice(0, 10);
  pickHistory.value = next;
}

function randomize(type: "atk" | "def") {
  const pool = type === "atk"
    ? atkOps.filter((o) => enabledAtk.value.has(o))
    : defOps.filter((o) => enabledDef.value.has(o));
  if (pool.length < count.value) return;
  const ops = shuffle(pool).slice(0, count.value);
  const ns = getNames();
  const arr = ops.map((op, i) => ({ op, name: ns[i] }));
  if (type === "atk") attackers.value = arr;
  else defenders.value = arr;
  addToHistory(type, arr);
  playShuffleSound();
}

function reroll(type: "atk" | "def", idx: number) {
  const list = type === "atk" ? attackers : defenders;
  const pool = type === "atk"
    ? atkOps.filter((o) => enabledAtk.value.has(o))
    : defOps.filter((o) => enabledDef.value.has(o));
  const used = list.value.map((x) => x.op);
  const avail = pool.filter((o) => !used.includes(o));
  if (avail.length) {
    list.value[idx].op = avail[Math.floor(Math.random() * avail.length)];
    playShuffleSound();
  }
}

function copyShareLink() {
  if (typeof window === "undefined") return;
  const base = window.location.origin + window.location.pathname;
  const params = new URLSearchParams();
  params.set("c", String(count.value));
  const namesEncoded = encodeURIComponent(JSON.stringify(names.value.slice(0, count.value)));
  params.set("n", namesEncoded);
  const disabledAtk = atkOps.filter((o) => !enabledAtk.value.has(o));
  const disabledDef = defOps.filter((o) => !enabledDef.value.has(o));
  if (disabledAtk.length) params.set("da", disabledAtk.join(","));
  if (disabledDef.length) params.set("dd", disabledDef.join(","));
  if (attackers.value.length) params.set("atk", JSON.stringify(attackers.value));
  if (defenders.value.length) params.set("def", JSON.stringify(defenders.value));
  const url = `${base}?${params.toString()}`;
  copyToClipboard(url);
}
</script>
