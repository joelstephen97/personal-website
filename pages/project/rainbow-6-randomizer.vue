<template>
    <div class="flex flex-col items-center p-4 w-full h-full">
      <h1 class="text-center text-2xl font-bold mb-4">Rainbow 6 Siege Operator Randomizer</h1>
  
      <!-- Attackers Section -->
      <div class="w-full max-w-4xl flex flex-col items-center mb-8">
        <UButton @click="randomizeAttackers" class="mb-4">Randomize 4 Attackers</UButton>
        <div v-if="selectedAttackers.length" class="w-full">
          <p class="text-lg font-semibold mb-2">Selected Attackers:</p>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div
              class="flex flex-col items-center p-2 rounded"
              v-for="(attacker, index) in selectedAttackers"
              :key="attacker.name"
            >
              <img :src="attacker.image" :alt="attacker.name" class="w-20 h-20 object-cover mb-2" />
              <p class="text-center font-medium mb-1">{{ attacker.name }}</p>
              <button
                @click="rerandomizeAttacker(index)"
                class="text-blue-500 hover:underline"
              >
                Re-randomize
              </button>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Defenders Section -->
      <div class="w-full max-w-4xl flex flex-col items-center">
        <UButton @click="randomizeDefenders" class="mb-4">Randomize 4 Defenders</UButton>
        <div v-if="selectedDefenders.length" class="w-full">
          <p class="text-lg font-semibold mb-2">Selected Defenders:</p>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div
              class="flex flex-col items-center p-2 rounded"
              v-for="(defender, index) in selectedDefenders"
              :key="defender.name"
            >
              <img :src="defender.image" :alt="defender.name" class="w-20 h-20 object-cover mb-2" />
              <p class="text-center font-medium mb-1">{{ defender.name }}</p>
              <button
                @click="rerandomizeDefender(index)"
                class="text-blue-500 hover:underline"
              >
                Re-randomize
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  
  <script setup lang="ts">
  import { ref } from 'vue';
  
  definePageMeta({
    layout: false,
  });
  
  const attackers = [
    { name: 'Sledge', image: 'https://tiermaker.com/images/media/template_images/2024/17131851/tom-clancys-rainbow-six-siege-operator-icons-y9s1-17131851/sledge.png' },
    { name: 'Thatcher', image: 'https://tiermaker.com/images/media/template_images/2024/17131851/tom-clancys-rainbow-six-siege-operator-icons-y9s1-17131851/thatcher.png' },
    { name: 'Ash', image: 'https://tiermaker.com/images/media/template_images/2024/17131851/tom-clancys-rainbow-six-siege-operator-icons-y9s1-17131851/ash.png' },
    { name: 'Thermite', image: 'https://tiermaker.com/images/media/template_images/2024/17131851/tom-clancys-rainbow-six-siege-operator-icons-y9s1-17131851/thermite.png' },
    { name: 'Twitch', image: 'https://tiermaker.com/images/media/template_images/2024/17131851/tom-clancys-rainbow-six-siege-operator-icons-y9s1-17131851/twitch.png' },
    { name: 'Montagne', image: 'https://tiermaker.com/images/media/template_images/2024/17131851/tom-clancys-rainbow-six-siege-operator-icons-y9s1-17131851/montagne.png' },
    { name: 'Glaz', image: 'https://tiermaker.com/images/media/template_images/2024/17131851/tom-clancys-rainbow-six-siege-operator-icons-y9s1-17131851/glaz.png' },
    { name: 'Fuze', image: 'https://tiermaker.com/images/media/template_images/2024/17131851/tom-clancys-rainbow-six-siege-operator-icons-y9s1-17131851/fuze.png' },
    { name: 'Blitz', image: 'https://tiermaker.com/images/media/template_images/2024/17131851/tom-clancys-rainbow-six-siege-operator-icons-y9s1-17131851/blitz.png' },
    { name: 'IQ', image: 'https://tiermaker.com/images/media/template_images/2024/17131851/tom-clancys-rainbow-six-siege-operator-icons-y9s1-17131851/iq.png' },
    { name: 'Buck', image: 'https://tiermaker.com/images/media/template_images/2024/17131851/tom-clancys-rainbow-six-siege-operator-icons-y9s1-17131851/sledge.png' },
    { name: 'Blackbeard', image: 'https://tiermaker.com/images/media/template_images/2024/17131851/tom-clancys-rainbow-six-siege-operator-icons-y9s1-17131851/buck.png' },
    { name: 'Capitao', image: 'https://tiermaker.com/images/media/template_images/2024/17131851/tom-clancys-rainbow-six-siege-operator-icons-y9s1-17131851/blackbeard.png' },
    { name: 'Hibana', image: 'https://tiermaker.com/images/media/template_images/2024/17131851/tom-clancys-rainbow-six-siege-operator-icons-y9s1-17131851/hibana.png' },
    { name: 'Jackal', image: 'https://tiermaker.com/images/media/template_images/2024/17131851/tom-clancys-rainbow-six-siege-operator-icons-y9s1-17131851/jackal.png' },
    { name: 'Ying', image: 'https://tiermaker.com/images/media/template_images/2024/17131851/tom-clancys-rainbow-six-siege-operator-icons-y9s1-17131851/ying.png' },
    { name: 'Zofia', image: 'https://tiermaker.com/images/media/template_images/2024/17131851/tom-clancys-rainbow-six-siege-operator-icons-y9s1-17131851/zofia.png' },
    { name: 'Dokkaebi', image: 'https://tiermaker.com/images/media/template_images/2024/17131851/tom-clancys-rainbow-six-siege-operator-icons-y9s1-17131851/dokkaebi.png' },
    { name: 'Lion', image: 'https://tiermaker.com/images/media/template_images/2024/17131851/tom-clancys-rainbow-six-siege-operator-icons-y9s1-17131851/lion.png' },
    { name: 'Finka', image: 'https://tiermaker.com/images/media/template_images/2024/17131851/tom-clancys-rainbow-six-siege-operator-icons-y9s1-17131851/finka.png' },
    { name: 'Maverick', image: 'https://tiermaker.com/images/media/template_images/2024/17131851/tom-clancys-rainbow-six-siege-operator-icons-y9s1-17131851/maverick.png' },
    { name: 'Nomad', image: 'https://tiermaker.com/images/media/template_images/2024/17131851/tom-clancys-rainbow-six-siege-operator-icons-y9s1-17131851/nomad.png' },
    { name: 'Gridlock', image: 'https://tiermaker.com/images/media/template_images/2024/17131851/tom-clancys-rainbow-six-siege-operator-icons-y9s1-17131851/gridlock.png' },
    { name: 'Nøkk', image: 'https://tiermaker.com/images/media/template_images/2024/17131851/tom-clancys-rainbow-six-siege-operator-icons-y9s1-17131851/nokk.png' },
    { name: 'Amaru', image: 'https://tiermaker.com/images/media/template_images/2024/17131851/tom-clancys-rainbow-six-siege-operator-icons-y9s1-17131851/amaru.png' },
    { name: 'Kali', image: 'https://tiermaker.com/images/media/template_images/2024/17131851/tom-clancys-rainbow-six-siege-operator-icons-y9s1-17131851/kali.png' },
    { name: 'Iana', image: 'https://tiermaker.com/images/media/template_images/2024/17131851/tom-clancys-rainbow-six-siege-operator-icons-y9s1-17131851/iana.png' },
    { name: 'Ace', image: 'https://tiermaker.com/images/media/template_images/2024/17131851/tom-clancys-rainbow-six-siege-operator-icons-y9s1-17131851/ace.png' },
    { name: 'Zero', image: 'https://tiermaker.com/images/media/template_images/2024/17131851/tom-clancys-rainbow-six-siege-operator-icons-y9s1-17131851/zero.png' },
    { name: 'Flores', image: 'https://tiermaker.com/images/media/template_images/2024/17131851/tom-clancys-rainbow-six-siege-operator-icons-y9s1-17131851/flores.png' },
    { name: 'Osa', image: 'https://tiermaker.com/images/media/template_images/2024/17131851/tom-clancys-rainbow-six-siege-operator-icons-y9s1-17131851/osa.png' },
    { name: 'Sens', image: 'https://tiermaker.com/images/media/template_images/2024/17131851/tom-clancys-rainbow-six-siege-operator-icons-y9s1-17131851/sens.png' },
    { name: 'Grim', image: 'https://tiermaker.com/images/media/template_images/2024/17131851/tom-clancys-rainbow-six-siege-operator-icons-y9s1-17131851/grim.png' },
    { name: 'Brava', image: 'https://tiermaker.com/images/media/template_images/2024/17131851/tom-clancys-rainbow-six-siege-operator-icons-y9s1-17131851/brava.png' },
    { name: 'Ram', image: 'https://tiermaker.com/images/media/template_images/2024/17131851/tom-clancys-rainbow-six-siege-operator-icons-y9s1-17131851/ram.png' },
    { name: 'Deimos', image: 'https://tiermaker.com/images/media/template_images/2024/17131851/tom-clancys-rainbow-six-siege-operator-icons-y9s1-17131851/deimos.png' },
    { name: 'Striker', image: 'https://tiermaker.com/images/media/template_images/2024/17131851/tom-clancys-rainbow-six-siege-operator-icons-y9s1-17131851/striker.png' },
  ];
  
  const defenders = [
    { name: 'Smoke', image: 'https://tiermaker.com/images/media/template_images/2024/17131851/tom-clancys-rainbow-six-siege-operator-icons-y9s1-17131851/smoke.png' },
    { name: 'Mute', image: 'https://tiermaker.com/images/media/template_images/2024/17131851/tom-clancys-rainbow-six-siege-operator-icons-y9s1-17131851/mute.png' },
    { name: 'Castle', image: 'https://tiermaker.com/images/media/template_images/2024/17131851/tom-clancys-rainbow-six-siege-operator-icons-y9s1-17131851/castle.png' },
    { name: 'Pulse', image: 'https://tiermaker.com/images/media/template_images/2024/17131851/tom-clancys-rainbow-six-siege-operator-icons-y9s1-17131851/pulse.png' },
    { name: 'Doc', image: 'https://tiermaker.com/images/media/template_images/2024/17131851/tom-clancys-rainbow-six-siege-operator-icons-y9s1-17131851/doc.png' },
    { name: 'Rook', image: 'https://tiermaker.com/images/media/template_images/2024/17131851/tom-clancys-rainbow-six-siege-operator-icons-y9s1-17131851/rook.png' },
    { name: 'Kapkan', image: 'https://tiermaker.com/images/media/template_images/2024/17131851/tom-clancys-rainbow-six-siege-operator-icons-y9s1-17131851/kapkan.png' },
    { name: 'Tachanka', image: 'https://tiermaker.com/images/media/template_images/2024/17131851/tom-clancys-rainbow-six-siege-operator-icons-y9s1-17131851/tachanka.png' },
    { name: 'Jäger', image: 'https://tiermaker.com/images/media/template_images/2024/17131851/tom-clancys-rainbow-six-siege-operator-icons-y9s1-17131851/jager.png' },
    { name: 'Bandit', image: 'https://tiermaker.com/images/media/template_images/2024/17131851/tom-clancys-rainbow-six-siege-operator-icons-y9s1-17131851/bandit.png' },
    { name: 'Frost', image: 'https://tiermaker.com/images/media/template_images/2024/17131851/tom-clancys-rainbow-six-siege-operator-icons-y9s1-17131851/frost.png' },
    { name: 'Valkyrie', image: 'https://tiermaker.com/images/media/template_images/2024/17131851/tom-clancys-rainbow-six-siege-operator-icons-y9s1-17131851/valkyrie.png' },
    { name: 'Caveira', image: 'https://tiermaker.com/images/media/template_images/2024/17131851/tom-clancys-rainbow-six-siege-operator-icons-y9s1-17131851/caveira.png' },
    { name: 'Echo', image: 'https://tiermaker.com/images/media/template_images/2024/17131851/tom-clancys-rainbow-six-siege-operator-icons-y9s1-17131851/echo.png' },
    { name: 'Mira', image: 'https://tiermaker.com/images/media/template_images/2024/17131851/tom-clancys-rainbow-six-siege-operator-icons-y9s1-17131851/mira.png' },
    { name: 'Lesion', image: 'https://tiermaker.com/images/media/template_images/2024/17131851/tom-clancys-rainbow-six-siege-operator-icons-y9s1-17131851/lesion.png' },
    { name: 'Ela', image: 'https://tiermaker.com/images/media/template_images/2024/17131851/tom-clancys-rainbow-six-siege-operator-icons-y9s1-17131851/ela.png' },
    { name: 'Vigil', image: 'https://tiermaker.com/images/media/template_images/2024/17131851/tom-clancys-rainbow-six-siege-operator-icons-y9s1-17131851/vigil.png' },
    { name: 'Maestro', image: 'https://tiermaker.com/images/media/template_images/2024/17131851/tom-clancys-rainbow-six-siege-operator-icons-y9s1-17131851/maestro.png' },
    { name: 'Alibi', image: 'https://tiermaker.com/images/media/template_images/2024/17131851/tom-clancys-rainbow-six-siege-operator-icons-y9s1-17131851/alibi.png' },
    { name: 'Clash', image: 'https://tiermaker.com/images/media/template_images/2024/17131851/tom-clancys-rainbow-six-siege-operator-icons-y9s1-17131851/clash.png' },
    { name: 'Kaid', image: 'https://tiermaker.com/images/media/template_images/2024/17131851/tom-clancys-rainbow-six-siege-operator-icons-y9s1-17131851/kaid.png' },
    { name: 'Mozzie', image: 'https://tiermaker.com/images/media/template_images/2024/17131851/tom-clancys-rainbow-six-siege-operator-icons-y9s1-17131851/mozzie.png' },
    { name: 'Warden', image: 'https://tiermaker.com/images/media/template_images/2024/17131851/tom-clancys-rainbow-six-siege-operator-icons-y9s1-17131851/warden.png' },
    { name: 'Goyo', image: 'https://tiermaker.com/images/media/template_images/2024/17131851/tom-clancys-rainbow-six-siege-operator-icons-y9s1-17131851/goyo.png' },
    { name: 'Wamai', image: 'https://tiermaker.com/images/media/template_images/2024/17131851/tom-clancys-rainbow-six-siege-operator-icons-y9s1-17131851/wamai.png' },
    { name: 'Oryx', image: 'https://tiermaker.com/images/media/template_images/2024/17131851/tom-clancys-rainbow-six-siege-operator-icons-y9s1-17131851/oryx.png' },
    { name: 'Melusi', image: 'https://tiermaker.com/images/media/template_images/2024/17131851/tom-clancys-rainbow-six-siege-operator-icons-y9s1-17131851/melusi.png' },
    { name: 'Aruni', image: 'https://tiermaker.com/images/media/template_images/2024/17131851/tom-clancys-rainbow-six-siege-operator-icons-y9s1-17131851/aruni.png' },
    { name: 'Thunderbird', image: 'https://tiermaker.com/images/media/template_images/2024/17131851/tom-clancys-rainbow-six-siege-operator-icons-y9s1-17131851/thunderbird.png' },
    { name: 'Thorn', image: 'https://tiermaker.com/images/media/template_images/2024/17131851/tom-clancys-rainbow-six-siege-operator-icons-y9s1-17131851/thorn.png' },
    { name: 'Azami', image: 'https://tiermaker.com/images/media/template_images/2024/17131851/tom-clancys-rainbow-six-siege-operator-icons-y9s1-17131851/azami.png' },
    { name: 'Solis', image: 'https://tiermaker.com/images/media/template_images/2024/17131851/tom-clancys-rainbow-six-siege-operator-icons-y9s1-17131851/solis.png' },
    { name: 'Fenrir', image: 'https://tiermaker.com/images/media/template_images/2024/17131851/tom-clancys-rainbow-six-siege-operator-icons-y9s1-17131851/fenrir.png' },
    { name: 'Tubarão', image: 'https://tiermaker.com/images/media/template_images/2024/17131851/tom-clancys-rainbow-six-siege-operator-icons-y9s1-17131851/tubarao.png' },
    { name: 'Sentry', image: 'https://tiermaker.com/images/media/template_images/2024/17131851/tom-clancys-rainbow-six-siege-operator-icons-y9s1-17131851/sentry.png' },
    { name: 'Skopós', image: 'https://tiermaker.com/images/media/template_images/2024/17131851/tom-clancys-rainbow-six-siege-operator-icons-y9s1-17131851/skopos.png' },
  ];
  
  const selectedAttackers = ref([]);
  const selectedDefenders = ref([]);
  
  function randomizeAttackers() {
    selectedAttackers.value = getRandomOperators(attackers, 4);
  }
  
  function randomizeDefenders() {
    selectedDefenders.value = getRandomOperators(defenders, 4);
  }
  
  function getRandomOperators(operatorList, count) {
    const operatorsCopy = [...operatorList];
    const selected = [];
    for (let i = 0; i < count; i++) {
      if (operatorsCopy.length === 0) break;
      const randomIndex = Math.floor(Math.random() * operatorsCopy.length);
      selected.push(operatorsCopy.splice(randomIndex, 1)[0]);
    }
    return selected;
  }
  
  function rerandomizeAttacker(index) {
    const alreadySelectedNames = selectedAttackers.value.map(op => op.name);
    const availableOperators = attackers.filter(op => !alreadySelectedNames.includes(op.name));
    if (availableOperators.length === 0) return;
    const randomIndex = Math.floor(Math.random() * availableOperators.length);
    selectedAttackers.value[index] = availableOperators[randomIndex];
  }
  
  function rerandomizeDefender(index) {
    const alreadySelectedNames = selectedDefenders.value.map(op => op.name);
    const availableOperators = defenders.filter(op => !alreadySelectedNames.includes(op.name));
    if (availableOperators.length === 0) return;
    const randomIndex = Math.floor(Math.random() * availableOperators.length);
    selectedDefenders.value[index] = availableOperators[randomIndex];
  }
  </script>
  
  