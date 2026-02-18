<template>
  <div
    class="min-h-screen bg-cover bg-center transition-all duration-500"
    :style="{ backgroundImage: `url(${bg})` }"
  >
    <div
      class="min-h-screen backdrop-blur-md"
      :class="$colorMode.value === 'dark' ? 'bg-black/60' : 'bg-white/60'"
    >
      <div class="max-w-5xl mx-auto px-6 py-12">
        <!-- Header -->
        <div class="flex items-center justify-between mb-8">
          <h1 class="text-2xl font-bold text-[rgb(var(--foreground))]">
            R6 Siege Randomizer
          </h1>
          <DarkModeToggle />
        </div>

        <!-- Settings -->
        <div class="glass-solid rounded-2xl p-6 mb-6">
          <div class="flex flex-wrap items-center gap-4">
            <span class="text-[rgb(var(--foreground))] font-medium"
              >Players:</span
            >
            <select v-model.number="count" class="flex-1 max-w-xs">
              <option v-for="n in 5" :key="n" :value="n">
                {{ n }} {{ n === 1 ? "Player" : "Stack" }}
              </option>
            </select>
          </div>
        </div>

        <div class="glass-solid rounded-2xl p-6 mb-8">
          <p class="text-sm font-medium text-[rgb(var(--foreground))] mb-3">
            Player Names
          </p>
          <div class="grid grid-cols-2 md:grid-cols-5 gap-3">
            <input
              v-for="i in count"
              :key="i"
              v-model="names[i - 1]"
              :placeholder="`Player ${i}`"
              class="px-4 py-2.5 rounded-xl bg-[rgb(var(--glass))] border border-[rgb(var(--border))] text-[rgb(var(--foreground))] placeholder:text-[rgb(var(--foreground-muted))]"
            />
          </div>
        </div>

        <!-- Attackers -->
        <div class="mb-10">
          <div class="flex justify-center mb-6">
            <button
              class="px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold shadow-lg shadow-red-500/25 flex items-center gap-2"
              @click="randomize('atk')"
            >
              <Icon name="Shuffle" :size="18" /> Randomize Attackers
            </button>
          </div>
          <div
            v-if="attackers.length"
            class="flex flex-wrap justify-center gap-4"
          >
            <div
              v-for="(a, i) in attackers"
              :key="a.op"
              class="glass-solid rounded-xl p-4 text-center group hover:border-red-500/30 transition"
            >
              <img
                :src="opImg(a.op)"
                :alt="a.op"
                class="w-16 h-16 mx-auto mb-2 rounded-xl"
              />
              <p class="font-semibold text-[rgb(var(--foreground))] text-sm">
                {{ a.op }}
              </p>
              <p
                class="text-xs text-[rgb(var(--foreground-muted))] truncate w-24"
              >
                {{ a.name }}
              </p>
              <button
                class="mt-2 text-xs text-red-500 font-medium"
                @click="reroll('atk', i)"
              >
                Re-roll
              </button>
            </div>
          </div>
        </div>

        <!-- Defenders -->
        <div>
          <div class="flex justify-center mb-6">
            <button
              class="px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold shadow-lg shadow-red-500/25 flex items-center gap-2"
              @click="randomize('def')"
            >
              <Icon name="Shuffle" :size="18" /> Randomize Defenders
            </button>
          </div>
          <div
            v-if="defenders.length"
            class="flex flex-wrap justify-center gap-4"
          >
            <div
              v-for="(d, i) in defenders"
              :key="d.op"
              class="glass-solid rounded-xl p-4 text-center group hover:border-red-500/30 transition"
            >
              <img
                :src="opImg(d.op)"
                :alt="d.op"
                class="w-16 h-16 mx-auto mb-2 rounded-xl"
              />
              <p class="font-semibold text-[rgb(var(--foreground))] text-sm">
                {{ d.op }}
              </p>
              <p
                class="text-xs text-[rgb(var(--foreground-muted))] truncate w-24"
              >
                {{ d.name }}
              </p>
              <button
                class="mt-2 text-xs text-red-500 font-medium"
                @click="reroll('def', i)"
              >
                Re-roll
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useLocalStorage } from "@vueuse/core";
import Icon from "~/components/ui/Icon.vue";

definePageMeta({ layout: false });

const atkOps = [
  "Sledge",
  "Thatcher",
  "Ash",
  "Thermite",
  "Twitch",
  "Montagne",
  "Glaz",
  "Fuze",
  "Blitz",
  "IQ",
  "Buck",
  "Blackbeard",
  "Capitao",
  "Hibana",
  "Jackal",
  "Ying",
  "Zofia",
  "Dokkaebi",
  "Lion",
  "Finka",
  "Maverick",
  "Nomad",
  "Gridlock",
  "Nokk",
  "Amaru",
  "Kali",
  "Iana",
  "Ace",
  "Zero",
  "Flores",
  "Osa",
  "Sens",
  "Grim",
  "Brava",
  "Ram",
];
const defOps = [
  "Smoke",
  "Mute",
  "Castle",
  "Pulse",
  "Doc",
  "Rook",
  "Kapkan",
  "Tachanka",
  "Jäger",
  "Bandit",
  "Frost",
  "Valkyrie",
  "Caveira",
  "Echo",
  "Mira",
  "Lesion",
  "Ela",
  "Vigil",
  "Maestro",
  "Alibi",
  "Clash",
  "Kaid",
  "Mozzie",
  "Warden",
  "Goyo",
  "Wamai",
  "Oryx",
  "Melusi",
  "Aruni",
  "Thunderbird",
  "Thorn",
  "Azami",
  "Solis",
  "Fenrir",
];

const opImg = (n: string) =>
  `https://r6operators.marcopixel.eu/icons/svg/${n
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "")}.svg`;

const count = useLocalStorage("r6-count", 5);
const names = useLocalStorage<string[]>("r6-names", ["", "", "", "", ""]);
const attackers = ref<{ op: string; name: string }[]>([]);
const defenders = ref<{ op: string; name: string }[]>([]);

const bgs = [
  "https://wallpapercave.com/wp/wp1846902.jpg",
  "https://wallpapercave.com/wp/wp1846947.jpg",
  "https://wallpapercave.com/wp/wp1847065.jpg",
];
const bg = ref(bgs[0]);
onMounted(() => {
  bg.value = bgs[Math.floor(Math.random() * bgs.length)];
});

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

function randomize(type: "atk" | "def") {
  const ops = shuffle(type === "atk" ? atkOps : defOps).slice(0, count.value);
  const ns = getNames();
  const arr = ops.map((op, i) => ({ op, name: ns[i] }));
  if (type === "atk") attackers.value = arr;
  else defenders.value = arr;
}

function reroll(type: "atk" | "def", idx: number) {
  const list = type === "atk" ? attackers : defenders;
  const ops = type === "atk" ? atkOps : defOps;
  const used = list.value.map((x) => x.op);
  const avail = ops.filter((o) => !used.includes(o));
  if (avail.length)
    list.value[idx].op = avail[Math.floor(Math.random() * avail.length)];
}
</script>
