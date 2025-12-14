<!-- eslint-disable vue/html-self-closing -->
<template>
  <div
    class="relative flex flex-col items-center p-4 w-screen h-screen bg-cover bg-center transition-all duration-500"
  >
    <!-- Overlay -->
    <div
      :class="`fixed inset-0 ${colorMode.value === 'dark' ? 'bg-black opacity-50' : 'bg-white opacity-50'}`"
      aria-hidden="true"
    />

    <!-- Content -->
    <div
      class="relative z-10 flex flex-col items-center w-full max-w-4xl space-y-8"
    >
      <!-- Header -->
      <header class="flex w-full justify-between items-center">
        <h1 class="text-2xl font-bold uppercase">Basic Background Remover</h1>
        <DarkModeToggle />
      </header>

      <!-- File Upload & Controls -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center w-full">
        <UButton
          color="green"
          icon="i-heroicons-arrow-up-tray"
          @click="triggerFileInput"
        >
          Select Image
        </UButton>
        <input
          ref="fileInput"
          type="file"
          accept="image/png, image/jpeg"
          class="hidden"
          @change="onFileSelected"
        />
        <UButton
          v-if="processedImageUrl"
          color="blue"
          icon="i-heroicons-arrow-down-tray"
          @click="downloadImage"
        >
          Download Result
        </UButton>
      </div>

      <!-- Image Previews -->
      <div class="flex flex-col sm:flex-row gap-6 justify-evenly w-full">
        <div class="flex-1 text-center">
          <h2 class="font-semibold mb-2">Original Image</h2>
          <div class="border rounded-lg p-2 bg-white dark:bg-gray-800">
            <img
              v-if="originalImageUrl"
              :src="originalImageUrl"
              alt="Original"
              class="mx-auto max-h-64"
            />
            <p v-else class="text-gray-500">No image selected.</p>
          </div>
        </div>
        <div class="flex-1 text-center">
          <h2 class="font-semibold mb-2">Processed Image</h2>
          <div class="border rounded-lg p-2 bg-white dark:bg-gray-800">
            <div v-if="isProcessing" class="py-16">Processing...</div>
            <img
              v-else-if="processedImageUrl"
              :src="processedImageUrl"
              alt="Result"
              class="mx-auto max-h-64"
            />
            <p v-else class="text-gray-500">No result yet.</p>
          </div>
        </div>
      </div>

      <!-- Advanced Options -->
      <div
        class="w-full p-4 border rounded-lg space-y-4 bg-white dark:bg-gray-900"
      >
        <h3 class="font-bold">Advanced Options</h3>
        <div class="space-y-2">
          <label class="flex items-center justify-between">
            <span>Tolerance (0–100):</span>
            <span>{{ tolerance }}</span>
          </label>
          <input
            v-model.number="tolerance"
            type="range"
            min="0"
            max="100"
            class="w-full"
          />
        </div>
        <div class="space-y-2">
          <label class="flex items-center justify-between">
            <span>Edge Feather (px):</span>
            <span>{{ feather }}</span>
          </label>
          <input
            v-model.number="feather"
            type="range"
            min="0"
            max="20"
            class="w-full"
          />
        </div>
        <UButton
          v-if="originalImageUrl"
          color="primary"
          icon="i-heroicons-magic-wand-square"
          :loading="isProcessing"
          @click="processImage"
        >
          Remove Background
        </UButton>
      </div>

      <!-- How It Works -->
      <section class="w-full p-6 rounded-lg bg-yellow-100 dark:bg-yellow-900">
        <h2 class="text-xl font-bold mb-2">How It Works</h2>
        <ol class="list-decimal pl-5 space-y-1">
          <li>Select or drag an image (PNG/JPEG).</li>
          <li>Adjust the Tolerance and Edge Feather sliders.</li>
          <li>Click “Remove Background” to start processing.</li>
          <li>Download the transparent PNG.</li>
        </ol>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted, onMounted } from "vue";
import { useColorMode } from "#imports";

const colorMode = useColorMode();
import * as tf from "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-backend-webgl";
import * as bodyPix from "@tensorflow-models/body-pix";

// Ensure WebGL backend
onMounted(() => {
  tf.setBackend("webgl");
});

definePageMeta({
  layout: false,
});

// State
const fileInput = ref<HTMLInputElement | null>(null);
const originalImageUrl = ref<string | null>(null);
const processedImageUrl = ref<string | null>(null);
const isProcessing = ref(false);
const tolerance = ref(30);
const feather = ref(2);


// Handlers
const triggerFileInput = () => fileInput.value?.click();
function onFileSelected(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  processedImageUrl.value = null;
  originalImageUrl.value = URL.createObjectURL(file);
}

async function processImage() {
  if (!originalImageUrl.value) return;
  isProcessing.value = true;

  // Load and decode image
  const img = new Image();
  img.src = originalImageUrl.value;
  await img.decode();

  // Canvas setup
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0);

  // Run segmentation
  const net = await bodyPix.load();
  const seg = await net.segmentPerson(img, {
    segmentationThreshold: tolerance.value / 100,
  });

  // Apply mask
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  seg.data.forEach((v, i) => {
    imgData.data[i * 4 + 3] = v > tolerance.value / 100 ? 255 : 0;
  });

  // Feather edges
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.filter = feather.value > 0 ? `blur(${feather.value}px)` : "none";
  ctx.putImageData(imgData, 0, 0);

  // Export
  canvas.toBlob((blob) => {
    if (blob) processedImageUrl.value = URL.createObjectURL(blob);
    isProcessing.value = false;
  }, "image/png");
}

function downloadImage() {
  if (!processedImageUrl.value) return;
  const a = document.createElement("a");
  a.href = processedImageUrl.value;
  a.download = "transparent.png";
  a.click();
}

onUnmounted(() => {
  if (originalImageUrl.value) URL.revokeObjectURL(originalImageUrl.value);
  if (processedImageUrl.value) URL.revokeObjectURL(processedImageUrl.value);
});
</script>

<style scoped>
/* Optional: constrain image max width */
img {
  max-width: 100%;
  height: auto;
}
</style>
