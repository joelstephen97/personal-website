<template>
  <div class="min-h-screen bg-[rgb(var(--bg))] px-6 py-12">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-3xl font-bold text-[rgb(var(--foreground))]">Background Remover</h1>
        <DarkModeToggle />
      </div>

      <!-- Controls -->
      <div class="flex flex-wrap gap-4 mb-8">
        <button @click="$refs.file.click()" class="px-5 py-3 rounded-xl bg-[rgb(var(--glass))] border border-[rgb(var(--border))] font-medium flex items-center gap-2 hover:border-red-500/50 transition">
          <Icon name="Upload" :size="18" /> Select Image
        </button>
        <input ref="file" type="file" accept="image/*" class="hidden" @change="load" />
        <button v-if="result" @click="download" class="px-5 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-medium flex items-center gap-2 shadow-lg shadow-red-500/25">
          <Icon name="Download" :size="18" /> Download
        </button>
      </div>

      <!-- Preview -->
      <div class="grid md:grid-cols-2 gap-6 mb-8">
        <div class="glass-solid rounded-2xl p-6 text-center">
          <p class="text-sm font-medium text-[rgb(var(--foreground-muted))] mb-4">Original</p>
          <img v-if="original" :src="original" class="max-h-64 mx-auto rounded-xl" />
          <p v-else class="text-[rgb(var(--foreground-muted))] py-12">No image</p>
        </div>
        <div class="glass-solid rounded-2xl p-6 text-center">
          <p class="text-sm font-medium text-[rgb(var(--foreground-muted))] mb-4">Result</p>
          <div v-if="processing" class="py-12 flex flex-col items-center gap-3">
            <div class="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
            <span class="text-red-500 text-sm">Processing...</span>
          </div>
          <img v-else-if="result" :src="result" class="max-h-64 mx-auto rounded-xl" />
          <p v-else class="text-[rgb(var(--foreground-muted))] py-12">No result</p>
        </div>
      </div>

      <!-- Options -->
      <div class="glass-solid rounded-2xl p-6 space-y-6">
        <h3 class="font-semibold text-[rgb(var(--foreground))]">Options</h3>
        <div>
          <div class="flex justify-between text-sm mb-2">
            <span class="text-[rgb(var(--foreground))]">Tolerance</span>
            <span class="text-red-500 font-medium">{{ tolerance }}</span>
          </div>
          <input v-model.number="tolerance" type="range" min="0" max="100" class="w-full" />
        </div>
        <div>
          <div class="flex justify-between text-sm mb-2">
            <span class="text-[rgb(var(--foreground))]">Edge Feather</span>
            <span class="text-red-500 font-medium">{{ feather }}px</span>
          </div>
          <input v-model.number="feather" type="range" min="0" max="20" class="w-full" />
        </div>
        <button v-if="original" @click="process" :disabled="processing" class="w-full py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50">
          <Icon name="Sparkles" :size="18" />
          {{ processing ? 'Processing...' : 'Remove Background' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import Icon from "~/components/ui/Icon.vue";
import * as tf from "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-backend-webgl";
import * as bodyPix from "@tensorflow-models/body-pix";

definePageMeta({ layout: false });

onMounted(() => tf.setBackend("webgl"));

const original = ref<string | null>(null);
const result = ref<string | null>(null);
const processing = ref(false);
const tolerance = ref(30);
const feather = ref(2);

function load(e: Event) {
  const f = (e.target as HTMLInputElement).files?.[0];
  if (f) {
    result.value = null;
    original.value = URL.createObjectURL(f);
  }
}

async function process() {
  if (!original.value) return;
  processing.value = true;

  const img = new Image();
  img.src = original.value;
  await img.decode();

  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0);

  const net = await bodyPix.load();
  const seg = await net.segmentPerson(img, { segmentationThreshold: tolerance.value / 100 });
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
  seg.data.forEach((v, i) => { data.data[i * 4 + 3] = v > tolerance.value / 100 ? 255 : 0; });

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (feather.value) ctx.filter = `blur(${feather.value}px)`;
  ctx.putImageData(data, 0, 0);

  canvas.toBlob(b => {
    if (b) result.value = URL.createObjectURL(b);
    processing.value = false;
  }, "image/png");
}

function download() {
  if (!result.value) return;
  const a = document.createElement("a");
  a.href = result.value;
  a.download = "result.png";
  a.click();
}

onUnmounted(() => {
  if (original.value) URL.revokeObjectURL(original.value);
  if (result.value) URL.revokeObjectURL(result.value);
});
</script>
