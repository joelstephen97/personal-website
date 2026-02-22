<template>
  <div class="min-h-screen bg-[rgb(var(--bg))] px-6 py-12">
    <div class="max-w-4xl mx-auto">
      <div class="flex items-center gap-3 mb-8">
        <BackToProjects />
        <h1 class="text-3xl font-bold text-[rgb(var(--foreground))]">
          Background Remover
        </h1>
      </div>

      <div class="flex flex-wrap gap-4 mb-8">
        <button
          class="px-5 py-3 rounded-xl bg-[rgb(var(--glass))] border border-[rgb(var(--border))] font-medium flex items-center gap-2 hover:border-accent/50 transition"
          @click="fileInput?.click()"
        >
          <Icon name="Upload" :size="18" /> Select Image
        </button>
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          class="hidden"
          @change="load"
        />
        <button
          v-if="result"
          class="px-5 py-3 rounded-xl bg-gradient-to-r from-accent to-accent-hover text-white font-medium flex items-center gap-2 shadow-lg shadow-accent/25"
          @click="download"
        >
          <Icon name="Download" :size="18" /> Download
        </button>
      </div>

      <!-- Before/After Slider -->
      <div v-if="original && result && !processing" class="glass-solid rounded-2xl p-6 mb-8">
        <p class="text-sm font-medium text-[rgb(var(--foreground-muted))] mb-4">
          Before / After
        </p>
        <div
          ref="sliderContainer"
          class="relative h-72 rounded-xl overflow-hidden cursor-col-resize select-none"
          @pointerdown="sliderDragStart"
        >
          <img
            :src="result"
            width="576"
            height="288"
            class="absolute inset-0 w-full h-full object-contain bg-[rgb(var(--glass))]"
            alt="Result"
          />
          <img
            :src="original"
            width="576"
            height="288"
            class="absolute inset-0 w-full h-full object-contain"
            :style="{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }"
            alt="Original"
          />
          <div
            class="absolute top-0 bottom-0 w-1 bg-white shadow-lg"
            :style="{ left: sliderPos + '%' }"
          >
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-8 rounded bg-white shadow flex items-center justify-center">
              <Icon name="GripVertical" :size="12" class="text-[rgb(var(--foreground))]" />
            </div>
          </div>
          <div class="absolute bottom-2 left-2 px-2 py-1 rounded bg-black/50 text-white text-xs">
            Drag to compare
          </div>
        </div>
      </div>

      <!-- Preview (when no result yet) -->
      <div v-else class="grid md:grid-cols-2 gap-6 mb-8">
        <div class="glass-solid rounded-2xl p-6 text-center">
          <p class="text-sm font-medium text-[rgb(var(--foreground-muted))] mb-4">Original</p>
          <img
            v-if="original"
            :src="original"
            width="400"
            height="256"
            loading="lazy"
            class="max-h-64 mx-auto rounded-xl"
            alt="Original"
          />
          <p v-else class="text-[rgb(var(--foreground-muted))] py-12">No image</p>
        </div>
        <div class="glass-solid rounded-2xl p-6 text-center">
          <p class="text-sm font-medium text-[rgb(var(--foreground-muted))] mb-4">Result</p>
          <div v-if="processing" class="py-12 flex flex-col items-center gap-3">
            <div class="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            <span class="text-accent text-sm">Processing...</span>
          </div>
          <img
            v-else-if="result"
            :src="result"
            width="400"
            height="256"
            loading="lazy"
            class="max-h-64 mx-auto rounded-xl"
            alt="Result"
          />
          <p v-else class="text-[rgb(var(--foreground-muted))] py-12">No result</p>
        </div>
      </div>

      <div class="glass-solid rounded-2xl p-6 space-y-6">
        <h3 class="font-semibold text-[rgb(var(--foreground))]">Options</h3>
        <div>
          <div class="flex justify-between text-sm mb-2">
            <span class="text-[rgb(var(--foreground))]">Tolerance</span>
            <span class="text-accent font-medium">{{ tolerance }}</span>
          </div>
          <input v-model.number="tolerance" type="range" min="0" max="100" class="w-full" />
        </div>
        <div>
          <div class="flex justify-between text-sm mb-2">
            <span class="text-[rgb(var(--foreground))]">Edge Feather</span>
            <span class="text-accent font-medium">{{ feather }}px</span>
          </div>
          <input v-model.number="feather" type="range" min="0" max="20" class="w-full" />
        </div>

        <div>
          <label class="text-sm font-medium text-[rgb(var(--foreground))] block mb-2">Replace Background</label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="opt in replaceBgOptions"
              :key="opt.value"
              class="px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              :class="replaceBg === opt.value
                ? 'bg-accent text-white'
                : 'bg-[rgb(var(--glass))] border border-[rgb(var(--border))] text-[rgb(var(--foreground-secondary))] hover:border-accent/50'"
              @click="replaceBg = opt.value"
            >
              {{ opt.label }}
            </button>
          </div>
          <div v-if="replaceBg === 'color'" class="mt-2 flex items-center gap-2">
            <input v-model="replaceColor" type="color" class="w-10 h-10 rounded cursor-pointer border-0" />
            <input v-model="replaceColor" type="text" class="px-3 py-2 rounded-lg bg-[rgb(var(--glass))] border border-[rgb(var(--border))] font-mono text-sm w-24" />
          </div>
          <input
            v-if="replaceBg === 'image'"
            ref="bgImageInput"
            type="file"
            accept="image/*"
            class="hidden"
            @change="onBgImageSelect"
          />
          <button
            v-if="replaceBg === 'image'"
            class="mt-2 px-3 py-2 rounded-lg text-sm bg-[rgb(var(--glass))] border border-[rgb(var(--border))] hover:border-accent/50"
            @click="bgImageInput?.click()"
          >
            {{ bgImageSrc ? "Change" : "Upload" }} background image
          </button>
        </div>

        <div>
          <label class="text-sm font-medium text-[rgb(var(--foreground))] block mb-2">Export Format</label>
          <div class="flex gap-2">
            <button
              v-for="fmt in formatOptions"
              :key="fmt.value"
              class="px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              :class="exportFormat === fmt.value
                ? 'bg-accent text-white'
                : 'bg-[rgb(var(--glass))] border border-[rgb(var(--border))] text-[rgb(var(--foreground-secondary))] hover:border-accent/50'"
              @click="exportFormat = fmt.value"
            >
              {{ fmt.label }}
            </button>
          </div>
        </div>

        <button
          v-if="original"
          :disabled="processing"
          class="w-full py-3 rounded-xl bg-gradient-to-r from-accent to-accent-hover text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
          @click="process"
        >
          <Icon name="Sparkles" :size="18" />
          {{ processing ? "Processing..." : "Remove Background" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useSeo({
  title: "Background Remover | Joel Stephen - Portfolio",
  description: "AI-powered tool to remove image backgrounds instantly. Browser-based, no uploads.",
  path: "/project/bg-remover",
  breadcrumbTitle: "Background Remover",
});

import { ref, onUnmounted } from "vue";
import Icon from "~/components/ui/Icon.vue";

definePageMeta({ layout: "default" });

let bodyPixModule: Awaited<typeof import("@tensorflow-models/body-pix")> | null = null;

async function initBodyPix() {
  if (bodyPixModule) return bodyPixModule;
  const [tf, bodyPix] = await Promise.all([
    import("@tensorflow/tfjs-core"),
    import("@tensorflow-models/body-pix"),
    import("@tensorflow/tfjs-backend-webgl"),
  ]);
  await tf.default.setBackend("webgl");
  bodyPixModule = bodyPix;
  return bodyPix;
}

const fileInput = ref<HTMLInputElement | null>(null);
const bgImageInput = ref<HTMLInputElement | null>(null);
const sliderContainer = ref<HTMLElement | null>(null);

const original = ref<string | null>(null);
const result = ref<string | null>(null);
const processing = ref(false);
const tolerance = ref(30);
const feather = ref(2);
const sliderPos = ref(50);
const replaceBg = ref<"transparent" | "color" | "white" | "image">("transparent");
const replaceColor = ref("#ffffff");
const bgImageSrc = ref<string | null>(null);
const exportFormat = ref<"png" | "webp" | "jpeg">("png");

const replaceBgOptions = [
  { value: "transparent", label: "Transparent" },
  { value: "white", label: "White" },
  { value: "color", label: "Custom" },
  { value: "image", label: "Image" },
];

const formatOptions = [
  { value: "png", label: "PNG" },
  { value: "webp", label: "WebP" },
  { value: "jpeg", label: "JPEG" },
];

function load(e: Event) {
  const f = (e.target as HTMLInputElement).files?.[0];
  if (f) {
    result.value = null;
    if (original.value) URL.revokeObjectURL(original.value);
    original.value = URL.createObjectURL(f);
  }
}

function onBgImageSelect(e: Event) {
  const f = (e.target as HTMLInputElement).files?.[0];
  if (f) {
    if (bgImageSrc.value) URL.revokeObjectURL(bgImageSrc.value);
    bgImageSrc.value = URL.createObjectURL(f);
  }
}

function sliderDragStart(e: PointerEvent) {
  e.preventDefault();
  const move = (ev: PointerEvent) => {
    if (!sliderContainer.value) return;
    const rect = sliderContainer.value.getBoundingClientRect();
    const pct = Math.max(0, Math.min(100, ((ev.clientX - rect.left) / rect.width) * 100));
    sliderPos.value = pct;
  };
  const up = () => {
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerup", up);
  };
  window.addEventListener("pointermove", move);
  window.addEventListener("pointerup", up);
  move(e);
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

  const bodyPix = await initBodyPix();
  const net = await bodyPix.load();
  const seg = await net.segmentPerson(img, {
    segmentationThreshold: tolerance.value / 100,
  });
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
  seg.data.forEach((v, i) => {
    data.data[i * 4 + 3] = v > tolerance.value / 100 ? 255 : 0;
  });

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (feather.value) ctx.filter = `blur(${feather.value}px)`;
  ctx.putImageData(data, 0, 0);

  const needsOpaqueBg = exportFormat.value === "jpeg" || replaceBg.value !== "transparent";
  if (needsOpaqueBg) {
    const bgCanvas = document.createElement("canvas");
    bgCanvas.width = canvas.width;
    bgCanvas.height = canvas.height;
    const bgCtx = bgCanvas.getContext("2d")!;

    if (replaceBg.value === "white" || replaceBg.value === "color" || exportFormat.value === "jpeg") {
      const fillColor = replaceBg.value === "color" ? replaceColor.value : "#ffffff";
      bgCtx.fillStyle = fillColor;
      bgCtx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);
    } else if (replaceBg.value === "image" && bgImageSrc.value) {
      const bgImg = new Image();
      bgImg.src = bgImageSrc.value;
      await bgImg.decode();
      bgCtx.drawImage(bgImg, 0, 0, bgCanvas.width, bgCanvas.height);
    }

    bgCtx.drawImage(canvas, 0, 0);
    const outCtx = canvas.getContext("2d")!;
    outCtx.clearRect(0, 0, canvas.width, canvas.height);
    outCtx.drawImage(bgCanvas, 0, 0);
  }

  const mime = exportFormat.value === "png" ? "image/png"
    : exportFormat.value === "webp" ? "image/webp"
    : "image/jpeg";
  const quality = exportFormat.value === "jpeg" ? 0.92 : undefined;

  canvas.toBlob(
    (b) => {
      if (b) result.value = URL.createObjectURL(b);
      processing.value = false;
    },
    mime,
    quality
  );
}

function download() {
  if (!result.value) return;
  const ext = exportFormat.value === "png" ? "png" : exportFormat.value === "webp" ? "webp" : "jpg";
  const a = document.createElement("a");
  a.href = result.value;
  a.download = `result.${ext}`;
  a.click();
}

onUnmounted(() => {
  if (original.value) URL.revokeObjectURL(original.value);
  if (result.value) URL.revokeObjectURL(result.value);
  if (bgImageSrc.value) URL.revokeObjectURL(bgImageSrc.value);
});
</script>
