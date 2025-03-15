<template>
  <div
    :style="{ backgroundImage: `url(${currentBackground})` }"
    class="relative flex flex-col items-center p-4 w-screen h-screen bg-cover bg-repeat bg-center transition-all duration-500"
  >
    <!-- Overlay Div -->
    <div
      :class="
        colorMode.value === 'dark'
          ? 'bg-black opacity-50'
          : 'bg-white opacity-50'
      "
      class="fixed inset-0"
      aria-hidden="true"
    />

    <!-- Content Container -->
    <div class="relative z-10 flex flex-col items-center w-full max-w-4xl">
      <!-- Header -->
      <div class="flex flex-row justify-between items-center w-full mb-8">
        <h1 class="text-2xl font-bold uppercase">
          Rainbow 6 Siege Operator Randomizer
        </h1>
        <UButton
          color="white"
          class="p-2 rounded-full drop-shadow-sm"
          @click="toggleColorMode"
        >
          <div class="flex justify-center items-center font-bold">
            <UIcon
              :name="
                colorMode.value === 'dark'
                  ? 'i-heroicons-sun'
                  : 'i-heroicons-moon'
              "
              class="w-6 h-6 mr-2"
              :class="colorMode.value === 'dark' ? 'text-white' : 'text-black'"
            />
            {{ colorMode.value === "dark" ? "Light" : "Dark" }}
          </div>
        </UButton>
      </div>

      <!-- Number of Players Selection -->
      <div class="flex flex-row justify-between items-center mb-8 w-full">
        <p class="text-lg font-semibold w-1/2">Select Number of Players:</p>
        <USelect
          v-model="numberOfPlayers"
          :options="stacking"
          option-attribute="name"
          class="w-full"
        />
      </div>

      <!-- Player Names Input Section -->
      <div class="flex flex-col mb-8 w-full">
        <p class="text-lg font-semibold mb-2">
          Enter Player Names for Random Characters:
        </p>
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4 w-full items-center">
          <input
            v-for="(name, index) in playerNames.slice(0, numberOfPlayers)"
            :key="index"
            v-model="playerNames[index]"
            class="border p-2 rounded w-full"
            :placeholder="'Player ' + (index + 1)"
          />
        </div>
      </div>

      <!-- Attackers Section -->
      <div class="flex flex-col items-center mb-8 w-full">
        <UButton
          icon="i-heroicons-arrow-path"
          color="black"
          class="mb-4 uppercase font-bold text-lg"
          @click="randomizeAttackers"
          >Randomize {{ numberOfPlayers }} Attackers</UButton
        >
        <div v-if="selectedAttackers.length" class="w-full">
          <p class="text-lg font-bold mb-2 uppercase">Selected Attackers:</p>
          <div
            class="p-2 flex flex-row flex-nowrap items-center justify-evenly gap-4 w-[fit] overflow-x-auto"
          >
            <div
              v-for="(assignment, index) in selectedAttackers"
              :key="assignment.operator.name"
              class="flex flex-col items-center p-2 rounded max-h-fit"
              :class="
                colorMode.value === 'dark'
                  ? 'bg-gray-900 shadow-[0_0_10px_white]'
                  : ' bg-slate-100 shadow-[0_0_10px_black]'
              "
            >
              <img
                :src="assignment.operator.image"
                :alt="assignment.operator.name"
                class="w-20 h-20 object-cover mb-2"
              />
              <p class="text-center font-bold mb-1 uppercase">
                {{ assignment.operator.name }}
              </p>
              <p
                class="text-center font-bold text-sm mb-1 text-ellipsis overflow-hidden w-28"
              >
                {{ assignment.name }}
              </p>
              <button
                class="text-blue-500 hover:underline text-md"
                @click="rerandomizeAttacker(index)"
              >
                Re-randomize
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Defenders Section -->
      <div class="flex flex-col items-center w-full">
        <UButton
          icon="i-heroicons-arrow-path"
          color="black"
          class="mb-4 uppercase font-bold text-lg"
          @click="randomizeDefenders"
          >Randomize {{ numberOfPlayers }} Defenders</UButton
        >
        <div v-if="selectedDefenders.length" class="w-full">
          <p class="text-lg font-bold mb-2 uppercase">Selected Defenders:</p>
          <div
            class="p-2 flex flex-row flex-nowrap items-center justify-evenly gap-4 w-[fit] overflow-x-auto"
          >
            <div
              v-for="(assignment, index) in selectedDefenders"
              :key="assignment.operator.name"
              class="flex flex-col items-center p-2 rounded"
              :class="
                colorMode.value === 'dark'
                  ? 'bg-gray-900 shadow-[0_0_10px_white]'
                  : ' bg-slate-100 shadow-[0_0_10px_black]'
              "
            >
              <img
                :src="assignment.operator.image"
                :alt="assignment.operator.name"
                class="w-20 h-20 object-cover mb-2"
              />
              <p class="text-center font-bold mb-1 uppercase">
                {{ assignment.operator.name }}
              </p>
              <p
                class="text-center font-bold text-sm mb-1 text-ellipsis overflow-hidden w-28"
              >
                {{ assignment.name }}
              </p>
              <button
                class="text-blue-500 hover:underline text-md"
                @click="rerandomizeDefender(index)"
              >
                Re-randomize
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from "vue";
import { useLocalStorage } from "@vueuse/core";

// SEO and Page Meta
useSeoMeta({
  title: "Rainbow Six Siege Operator Randomizer",
  description:
    "Randomly select operators for Rainbow Six Siege. Choose attackers or defenders with the option to re-randomize individual selections.",
  keywords: [
    "Rainbow Six Siege",
    "R6S",
    "operator randomizer",
    "attacker selector",
    "defender selector",
    "game tools",
    "Rainbow Six Siege operators",
    "R6S team composition",
    "random team generator",
    "Siege strategy",
    "random rainbow 6 siege",
  ],
});

definePageMeta({
  layout: false,
});

const stacking = [
  {
    name: "Solo Gamer",
    value: "1",
  },
  {
    name: "2 Stack",
    value: "2",
  },
  {
    name: "3 Stack",
    value: "3",
  },
  {
    name: "4 Stack",
    value: "4",
  },
  {
    name: "5 Stack",
    value: "5",
  },
];

const baseImageUrl = "https://r6operators.marcopixel.eu/icons/svg/";

const specialAttackers = {
  // Deimos: '@/assets/deimos.webp',
  // Striker: '@/assets/striker.webp',
};

const specialDefenders = {
  // Sentry: '@/assets/sentry.webp',
  // Skopós: '@/assets/skopos.webp',
};

const attackerNames = [
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
  "Deimos",
  "Striker",
];

const defenderNames = [
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
  "Tubarão",
  "Sentry",
  "Skopós",
];

function createOperators(names: string[], specials: Record<string, string>) {
  return names.map((name) => ({
    name,
    image:
      specials[name] ||
      `${baseImageUrl}${name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]/g, "")}.svg`,
  }));
}
const attackers = createOperators(attackerNames, specialAttackers);
const defenders = createOperators(defenderNames, specialDefenders);

const playerNames = useLocalStorage<string[]>("player-names", [
  "",
  "",
  "",
  "",
  "",
]);
const numberOfPlayers = useLocalStorage<number>("number-of-players", 5);

watch(numberOfPlayers, (newVal) => {
  while (playerNames.value.length < newVal) {
    playerNames.value.push("");
  }
  while (playerNames.value.length > newVal) {
    playerNames.value.pop();
  }
  selectedAttackers.value = [];
  selectedDefenders.value = [];
});

watch(
  playerNames,
  () => {
    selectedAttackers.value = [];
    selectedDefenders.value = [];
  },
  { deep: true },
);

interface Operator {
  name: string;
  image: string;
}

interface AssignedOperator {
  operator: Operator;
  name: string;
}

const selectedAttackers = ref<AssignedOperator[]>([]);
const selectedDefenders = ref<AssignedOperator[]>([]);

function getPlayerNames() {
  return playerNames.value
    .slice(0, numberOfPlayers.value)
    .map((name, index) => name.trim() || "Player " + (index + 1));
}

function randomizeOperators(
  operatorList: Operator[],
  selectedOperators: typeof selectedAttackers,
) {
  const names = getPlayerNames();
  const operators = getRandomOperators(operatorList, names.length);
  selectedOperators.value = operators.map((op, index) => ({
    operator: op,
    name: names[index],
  }));
}

function randomizeAttackers() {
  randomizeOperators(attackers, selectedAttackers);
}

function randomizeDefenders() {
  randomizeOperators(defenders, selectedDefenders);
}

// Function to Rerandomize a Specific Operator
function rerandomizeOperator(
  index: number,
  operatorList: Operator[],
  selectedOperators: typeof selectedAttackers,
) {
  const alreadySelected = selectedOperators.value.map((a) => a.operator.name);
  const availableOperators = operatorList.filter(
    (op) => !alreadySelected.includes(op.name),
  );
  if (!availableOperators.length) return;
  selectedOperators.value[index].operator =
    availableOperators[getSecureRandomInt(availableOperators.length)];
}

function rerandomizeAttacker(index: number) {
  rerandomizeOperator(index, attackers, selectedAttackers);
}

function rerandomizeDefender(index: number) {
  rerandomizeOperator(index, defenders, selectedDefenders);
}

// Function to Get a Secure Random Integer
function getSecureRandomInt(max: number) {
  const array = new Uint32Array(1);
  let rand;
  do {
    window.crypto.getRandomValues(array);
    rand = array[0];
  } while (rand >= 0xffffffff - (0xffffffff % max));
  return rand % max;
}

// Function to Shuffle and Get Random Operators
function getRandomOperators(operatorList: Operator[], count: number) {
  const operators = [...operatorList];
  for (let i = operators.length - 1; i > 0; i--) {
    const j = getSecureRandomInt(i + 1);
    [operators[i], operators[j]] = [operators[j], operators[i]];
  }
  return operators.slice(0, count);
}

// Color Mode Toggle
const colorMode = useColorMode();
const toggleColorMode = () => {
  colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
};

// --- Rotating Background Implementation ---
const backgrounds = [
  "https://wallpapercave.com/wp/wp1846902.jpg",
  "https://wallpapercave.com/wp/wp1846947.jpg",
  "https://wallpapercave.com/wp/wp1847065.jpg",
  "https://wallpapercave.com/wp/wp1847071.jpg",
  "https://wallpapercave.com/wp/wp1847070.jpg",
  "https://wallpapercave.com/wp/wp1847033.jpg",
  "https://wallpapercave.com/wp/wp2125791.jpg",
  "https://wallpapercave.com/wp/wp2125809.jpg",
  "https://wallpapercave.com/wp/wp2125895.jpg",
  "https://wallpapercave.com/wp/wp2125851.jpg",
  "https://wallpapercave.com/wp/wp2125877.jpg",
  "https://wallpapercave.com/wp/wp1980806.jpg",
  "https://wallpapercave.com/wp/wp1846984.jpg",
  "https://wallpapercave.com/wp/wp1980779.jpg",
];

const currentBackground = ref("");

function selectRandomBackground() {
  const randomIndex = getSecureRandomInt(backgrounds.length);
  currentBackground.value = backgrounds[randomIndex];
}

let backgroundInterval: number | undefined;

function startBackgroundRotation() {
  backgroundInterval = window.setInterval(() => {
    selectRandomBackground();
  }, 300000);
}

onMounted(() => {
  selectRandomBackground();
  startBackgroundRotation();
});

onBeforeUnmount(() => {
  if (backgroundInterval !== undefined) {
    clearInterval(backgroundInterval);
  }
});
</script>

<style scoped>
html,
body,
#app {
  height: 100%;
  margin: 0;
}
</style>
