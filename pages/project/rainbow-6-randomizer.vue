<template>
  <div class="flex flex-col items-center p-4 w-full h-full">
    <div class="flex flex-row justify-between items-center w-full max-w-4xl mb-8">
      <h1 class="text-2xl font-bold uppercase">Rainbow 6 Siege Operator Randomizer</h1>
      <UButton @click="toggleColorMode" color="white" class="p-2 rounded-full drop-shadow-sm">
        <div class="flex justify-center items-center font-bold">
          <UIcon :name="colorMode.value === 'dark' ? 'i-heroicons-sun' : 'i-heroicons-moon'" class="w-6 h-6 mr-2" :class="colorMode.value === 'dark' ? 'text-white' : 'text-black'" />
          {{ colorMode.value === 'dark' ? 'Light' : 'Dark' }}
        </div>
      </UButton>
    </div>

    <!-- Number of Players Selection -->
    <div class="w-full max-w-4xl flex flex-row justify-between items-center mb-8">
      <p class="text-lg font-semibold w-1/2">Select Number of Players:</p>
      
      <USelect v-model="numberOfPlayers" :options="stacking" option-attribute="name" class="w-full">
        </USelect>
    </div>

    <!-- Player Names Input Section -->
    <div class="w-full max-w-4xl flex flex-col mb-8">
      <p class="text-lg font-semibold mb-2">Enter Player Names for Random Characters:</p>
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
    <div class="w-full max-w-4xl flex flex-col items-center mb-8">
      <UButton icon="i-heroicons-arrow-path" color="black" @click="randomizeAttackers" class="mb-4 uppercase font-bold text-lg">Randomize {{ numberOfPlayers }} Attackers</UButton>
      <div v-if="selectedAttackers.length" class="w-full">
        <p class="text-lg font-semibold mb-2">Selected Attackers:</p>
        <div :class="`grid grid-cols-1 md:grid-cols-${numberOfPlayers} gap-4`">
          <div
            class="flex flex-col items-center p-2 rounded"
            v-for="(assignment, index) in selectedAttackers"
            :key="assignment.operator.name"
          >
            <img :src="assignment.operator.image" :alt="assignment.operator.name" class="w-20 h-20 object-cover mb-2" />
            <p class="text-center font-medium mb-1">{{ assignment.operator.name }}</p>
            <p class="text-center text-sm mb-1">Assigned to: {{ assignment.name }}</p>
            <button @click="rerandomizeAttacker(index)" class="text-blue-500 hover:underline">Re-randomize</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Defenders Section -->
    <div class="w-full max-w-4xl flex flex-col items-center">
      <UButton icon="i-heroicons-arrow-path" color="black" @click="randomizeDefenders" class="mb-4 uppercase font-bold text-lg">Randomize {{ numberOfPlayers }} Defenders</UButton>
      <div v-if="selectedDefenders.length" class="w-full">
        <p class="text-lg font-semibold mb-2">Selected Defenders:</p>
        <div :class="`grid grid-cols-1 md:grid-cols-${numberOfPlayers} gap-4`">
          <div
            class="flex flex-col items-center p-2 rounded"
            v-for="(assignment, index) in selectedDefenders"
            :key="assignment.operator.name"
          >
            <img :src="assignment.operator.image" :alt="assignment.operator.name" class="w-20 h-20 object-cover mb-2" />
            <p class="text-center font-medium mb-1">{{ assignment.operator.name }}</p>
            <p class="text-center text-sm mb-1">Assigned to: {{ assignment.name }}</p>
            <button @click="rerandomizeDefender(index)" class="text-blue-500 hover:underline">Re-randomize</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useLocalStorage } from '@vueuse/core';

useSeoMeta({
  title: 'Rainbow Six Siege Operator Randomizer',
  description: 'Randomly select operators for Rainbow Six Siege. Choose attackers or defenders with the option to re-randomize individual selections.',
  keywords: [
    'Rainbow Six Siege',
    'R6S',
    'operator randomizer',
    'attacker selector',
    'defender selector',
    'game tools',
    'Rainbow Six Siege operators',
    'R6S team composition',
    'random team generator',
    'Siege strategy',
    'random rainbow 6 siege',
  ],
});

definePageMeta({
  layout: false,
});

const stacking = [{
  name: 'Solo Gamer',
  value: '1'
}, {
  name: '2 Stack',
  value: '2',
}, {
  name: '3 Stack',
  value: '3'
}, {
  name: '4 Stack',
  value: '4'
}, {
  name: '5 Stack',
  value: '5'
}]

const baseImageUrl = 'https://tiermaker.com/images/media/template_images/2024/17131851/tom-clancys-rainbow-six-siege-operator-icons-y9s1-17131851/';

const specialAttackers = {
  Deimos: '/_nuxt/assets/deimos.webp',
  Striker: '/_nuxt/assets/striker.webp',
};

const specialDefenders = {
  Sentry: '/_nuxt/assets/sentry.webp',
  Skopós: '/_nuxt/assets/skopos.webp',
};

const attackerNames = [
  'Sledge', 'Thatcher', 'Ash', 'Thermite', 'Twitch', 'Montagne', 'Glaz', 'Fuze', 'Blitz', 'IQ',
  'Buck', 'Blackbeard', 'Capitao', 'Hibana', 'Jackal', 'Ying', 'Zofia', 'Dokkaebi', 'Lion', 'Finka',
  'Maverick', 'Nomad', 'Gridlock', 'Nøkk', 'Amaru', 'Kali', 'Iana', 'Ace', 'Zero', 'Flores', 'Osa',
  'Sens', 'Grim', 'Brava', 'Ram', 'Deimos', 'Striker',
];

const defenderNames = [
  'Smoke', 'Mute', 'Castle', 'Pulse', 'Doc', 'Rook', 'Kapkan', 'Tachanka', 'Jäger', 'Bandit',
  'Frost', 'Valkyrie', 'Caveira', 'Echo', 'Mira', 'Lesion', 'Ela', 'Vigil', 'Maestro', 'Alibi',
  'Clash', 'Kaid', 'Mozzie', 'Warden', 'Goyo', 'Wamai', 'Oryx', 'Melusi', 'Aruni', 'Thunderbird',
  'Thorn', 'Azami', 'Solis', 'Fenrir', 'Tubarão', 'Sentry', 'Skopós',
];

function createOperators(names: string[], specials: Record<string, string>) {
  return names.map((name) => ({
    name,
    image:
      specials[name] ||
      `${baseImageUrl}${name
        .toLowerCase()
        .normalize('NFD') 
        .replace(/[\u0300-\u036f]/g, '') 
        .replace(/[^a-z0-9]/g, '')}.png`,
  }));
}
const attackers = createOperators(attackerNames, specialAttackers);
const defenders = createOperators(defenderNames, specialDefenders);

const playerNames = useLocalStorage<string[]>('player-names', ['', '', '', '', '']);

const numberOfPlayers = useLocalStorage<number>('number-of-players', 5);

watch(numberOfPlayers, (newVal) => {
  while (playerNames.value.length < newVal) {
    playerNames.value.push('');
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
  return playerNames.value.slice(0, numberOfPlayers.value).map((name, index) => name.trim() || 'Player ' + (index + 1));
}

function randomizeOperators(operatorList: Operator[], selectedOperators: typeof selectedAttackers) {
  const names = getPlayerNames();
  const operators = getRandomOperators(operatorList, names.length);
  selectedOperators.value = operators.map((op, index) => ({ operator: op, name: names[index] }));
}

function randomizeAttackers() {
  randomizeOperators(attackers, selectedAttackers);
}

function randomizeDefenders() {
  randomizeOperators(defenders, selectedDefenders);
}

function rerandomizeOperator(index: number, operatorList: Operator[], selectedOperators: typeof selectedAttackers) {
  const alreadySelected = selectedOperators.value.map((a) => a.operator.name);
  const availableOperators = operatorList.filter((op) => !alreadySelected.includes(op.name));
  if (!availableOperators.length) return;
  selectedOperators.value[index].operator = availableOperators[getSecureRandomInt(availableOperators.length)];
}

function rerandomizeAttacker(index: number) {
  rerandomizeOperator(index, attackers, selectedAttackers);
}

function rerandomizeDefender(index: number) {
  rerandomizeOperator(index, defenders, selectedDefenders);
}

function getSecureRandomInt(max: number) {
  const array = new Uint32Array(1);
  let rand;
  do {
    window.crypto.getRandomValues(array);
    rand = array[0];
  } while (rand >= (0xFFFFFFFF - (0xFFFFFFFF % max)));
  return rand % max;
}

function getRandomOperators(operatorList: Operator[], count: number) {
  const operators = [...operatorList];
  for (let i = operators.length - 1; i > 0; i--) {
    const j = getSecureRandomInt(i + 1);
    [operators[i], operators[j]] = [operators[j], operators[i]];
  }
  return operators.slice(0, count);
}

const colorMode = useColorMode();
const toggleColorMode = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark';
};
</script>
