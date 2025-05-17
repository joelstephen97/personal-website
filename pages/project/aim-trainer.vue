<template>
  <div class="relative flex flex-col items-center w-full h-screen bg-white dark:bg-black overflow-hidden"
    ref="gameContainer">
    <header v-if="!gameRunning" class="text-center mb-4 pt-4">
      <h1 class="text-3xl font-bold text-black dark:text-white">Aim Trainer</h1>
      <p class="mt-2 text-lg text-black dark:text-white">
        Time Left: {{ timeLeft.toFixed(1) }}s | Score: {{ score }}
      </p>
    </header>

    <div v-if="!gameRunning" class="flex flex-col items-center space-y-4">
      <div class="flex space-x-4">
        <button @click="startGame" class="btn btn-green">Start</button>
        <button @click="resetGame" class="btn btn-red">Reset</button>
        <!-- <button @click="toggleFullscreen" class="btn btn-blue">Fullscreen</button> -->
      </div>
      <div class="flex items-center space-x-2">
        <label for="gameTime" class="text-gray-700 dark:text-gray-300">Set Time:</label>
        <input id="gameTime" type="number" v-model.number="gameDuration" class="input" />
      </div>
    </div>

    <div v-if="gameRunning" ref="playArea" :class="isFullscreen ? 'fixed inset-0' : 'relative w-[600px] h-[600px]'"
      class="bg-white dark:bg-black border-2 border-black dark:border-white overflow-hidden">
      <!-- Header with score -->
      <div class="absolute top-0 left-0 right-0 text-center py-2 bg-white/80 dark:bg-black/80 z-10">
        <p class="text-lg font-semibold text-black dark:text-white">
          Time Left: {{ timeLeft.toFixed(1) }}s | Score: {{ score }}
        </p>
      </div>

      <!-- Target -->
      <div class="absolute bg-red-500 border-2 border-red-900 rounded-full target"
        :style="{ width: `${targetSize}px`, height: `${targetSize}px`, top: `${y}px`, left: `${x}px` }"
        @click.stop="hitTarget"></div>

      <!-- Invisible overlay to detect misclicks -->
      <div class="absolute inset-0 z-0" @click="handleMisclick"></div>

      <!-- Exit button -->
      <button @click="exitGame" class="btn btn-red absolute top-4 right-4 z-10">Exit Run</button>
    </div>

    <div v-if="!gameRunning && previousScores.length > 0" class="mt-6 w-full max-w-md">
      <h2 class="text-lg font-semibold text-black dark:text-white text-center">Aim Progress</h2>
      <div class="mt-4 h-48">
        <div class="p-4 bg-gray-100 dark:bg-gray-800 rounded">
          <h3 class="text-center mb-2 text-black dark:text-white">Previous Scores</h3>
          <div class="flex justify-between">
            <div v-for="(run, i) in previousScores" :key="i" class="text-center">
              <div class="h-32 flex items-end justify-center">
                <div class="w-12 bg-green-500" :style="{ height: `${Math.min(run.score * 2, 100)}%` }"></div>
              </div>
              <p class="mt-1 text-sm text-black dark:text-white">Run {{ i + 1 }}</p>
              <p class="text-xs text-gray-600 dark:text-gray-400">{{ run.score.toFixed(1) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted, watch, onMounted, computed } from 'vue';

// Reactive game state with starting score of 5
const score = ref(5);  // Starting with 5 points
const timeLeft = ref(30.0);
const gameDuration = ref(30.0);
const gameRunning = ref(false);
const isFullscreen = ref(false);
const accuracy = ref(100); // Starting accuracy percentage
const hits = ref(0);
const misses = ref(0);
const previousScores = ref([
  // Default scores to show progress history
  { duration: 30, score: 15, accuracy: 90 },
  { duration: 30, score: 18, accuracy: 92 },
  { duration: 30, score: 22, accuracy: 95 }
]);

// Play area and target dimensions
const targetSize = 50;
const x = ref(0);
const y = ref(0);

let timerId = null;
const gameContainer = ref(null);
const playArea = ref(null);

// Load saved data from localStorage on mount
onMounted(() => {
  const savedDuration = localStorage.getItem('aim-trainer-duration');
  if (savedDuration) {
    gameDuration.value = parseFloat(savedDuration);
  }

  const savedScores = localStorage.getItem('aim-trainer-scores');
  if (savedScores) {
    try {
      const parsed = JSON.parse(savedScores);
      if (Array.isArray(parsed) && parsed.length > 0) {
        previousScores.value = parsed;
      }
    } catch (e) {
      console.error('Error parsing saved scores:', e);
    }
  }

  // Check fullscreen status
  document.addEventListener('fullscreenchange', updateFullscreenStatus);

  // Handle window resize to reposition target if needed
  window.addEventListener('resize', () => {
    if (gameRunning.value) {
      positionTarget();
    }
  });
});

// Handle resize cleanup
onUnmounted(() => {
  clearInterval(timerId);
  window.removeEventListener('resize', positionTarget);
  document.removeEventListener('fullscreenchange', updateFullscreenStatus);
});

// Update fullscreen status
const updateFullscreenStatus = () => {
  isFullscreen.value = !!document.fullscreenElement;
};

// Randomize target position
const positionTarget = () => {
  const area = playArea.value;
  let maxWidth, maxHeight;

  if (area) {
    const rect = area.getBoundingClientRect();
    maxWidth = rect.width - targetSize;
    maxHeight = rect.height - targetSize - 40; // Extra space for the header
  } else {
    if (isFullscreen.value) {
      maxWidth = window.innerWidth - targetSize;
      maxHeight = window.innerHeight - targetSize - 40;
    } else {
      maxWidth = 600 - targetSize;
      maxHeight = 600 - targetSize - 40;
    }
  }

  // Ensure we have positive values and add padding to keep targets away from edges
  maxWidth = Math.max(maxWidth - 20, 100);
  maxHeight = Math.max(maxHeight - 20, 100);

  // Set position with padding from edges
  x.value = 10 + Math.random() * maxWidth;
  y.value = 50 + Math.random() * maxHeight; // Start below the header
};

const startGame = () => {
  score.value = 5;  // Starting with 5 points
  hits.value = 0;
  misses.value = 0;
  accuracy.value = 100;
  timeLeft.value = gameDuration.value;
  gameRunning.value = true;
  positionTarget();
  clearInterval(timerId);
  timerId = setInterval(() => {
    timeLeft.value = Math.max(0, timeLeft.value - 0.1);
    if (timeLeft.value <= 0) endGame();
  }, 100);
};

const endGame = () => {
  clearInterval(timerId);
  gameRunning.value = false;
  saveRun();
};

const resetGame = () => {
  clearInterval(timerId);
  score.value = 5;  // Reset to 5 points
  hits.value = 0;
  misses.value = 0;
  accuracy.value = 100;
  timeLeft.value = gameDuration.value;
  gameRunning.value = false;
};

const exitGame = () => {
  clearInterval(timerId);
  gameRunning.value = false;
};

const hitTarget = (e) => {
  if (!gameRunning.value) return;
  score.value += 2; // Reward accuracy with extra point
  hits.value++;
  updateAccuracy();
  positionTarget();
  e.preventDefault(); // Prevent event bubbling to the misclick handler
};

const handleMisclick = () => {
  if (!gameRunning.value) return;
  score.value = Math.max(0, score.value - 1); // Penalty for missing, minimum score is 0
  misses.value++;
  updateAccuracy();
};

const updateAccuracy = () => {
  const total = hits.value + misses.value;
  if (total > 0) {
    accuracy.value = Math.round((hits.value / total) * 100);
  }
};

const saveRun = () => {
  const normalizedScore = (score.value / gameDuration.value) * 30; // Normalize to 30 seconds
  previousScores.value.push({
    duration: gameDuration.value,
    score: normalizedScore,
    accuracy: accuracy.value
  });
  if (previousScores.value.length > 5) previousScores.value.shift();
  localStorage.setItem('aim-trainer-scores', JSON.stringify(previousScores.value));
};

// Watch for changes to game duration and save to localStorage
watch(gameDuration, (newDuration) => {
  localStorage.setItem('aim-trainer-duration', newDuration.toString());
});

const toggleFullscreen = () => {
  if (!document.fullscreenElement && gameContainer.value) {
    gameContainer.value.requestFullscreen().catch(err => {
      console.error(`Error attempting to enable fullscreen: ${err.message}`);
    });
  } else if (document.fullscreenElement) {
    document.exitFullscreen();
  }
};
</script>

<style scoped>
.btn {
  @apply px-4 py-2 rounded-lg text-white transition;
}

.btn-green {
  @apply bg-green-500 hover:bg-green-600;
}

.btn-red {
  @apply bg-red-500 hover:bg-red-600;
}

.btn-blue {
  @apply bg-blue-500 hover:bg-blue-600;
}

.input {
  @apply w-16 p-1 border rounded dark:bg-gray-700 dark:text-white;
}

.target {
  cursor: crosshair;
  z-index: 5;
}
</style>