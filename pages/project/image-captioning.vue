<template>
  <div class="min-h-screen bg-[rgb(var(--bg))] px-6 py-12">
    <div class="max-w-4xl mx-auto">
      <div class="flex items-center gap-3 mb-8">
        <BackToProjects />
        <h1 class="text-3xl font-bold text-[rgb(var(--foreground))]">
          Image Captioning
        </h1>
      </div>

      <p class="text-[rgb(var(--foreground-muted))] mb-8">
        AI-powered image descriptions run entirely in your browser. No server, no uploads—privacy-first.
      </p>

      <div class="glass-solid rounded-2xl p-6 mb-8">
        <div
          ref="dropZoneRef"
          class="border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors"
          :class="isOverDropZone ? 'border-accent bg-accent/5' : 'border-[rgb(var(--border))] hover:border-accent/50'"
          @click="fileInput?.click()"
        >
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            class="hidden"
            @change="onFileSelect"
          />
          <Icon name="Image" :size="48" class="text-[rgb(var(--foreground-muted))] mx-auto mb-4" />
          <p class="text-[rgb(var(--foreground))] font-medium mb-1">
            {{ imageSrc ? "Drop another image or click to replace" : "Drop an image or click to select" }}
          </p>
          <p class="text-sm text-[rgb(var(--foreground-muted))]">
            JPG, PNG, WebP supported
          </p>
        </div>

        <div v-if="imageSrc" class="mt-6 grid md:grid-cols-2 gap-6">
          <div class="glass-solid rounded-xl p-4">
            <p class="text-xs text-[rgb(var(--foreground-muted))] uppercase tracking-wide mb-2">Image</p>
            <img
              :src="imageSrc"
              width="400"
              height="256"
              alt="Uploaded"
              class="w-full rounded-lg object-contain max-h-64 bg-[rgb(var(--glass))]"
            />
          </div>
          <div class="glass-solid rounded-xl p-4">
            <p class="text-xs text-[rgb(var(--foreground-muted))] uppercase tracking-wide mb-2">Caption</p>
            <div v-if="processing" class="flex items-center gap-3 py-8">
              <div class="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
              <span class="text-accent text-sm">Generating caption...</span>
            </div>
            <div v-else-if="caption" class="space-y-2">
              <p class="text-[rgb(var(--foreground))] leading-relaxed">{{ caption }}</p>
              <button
                class="text-sm text-accent font-medium flex items-center gap-1 hover:opacity-80"
                @click="copyCaption"
              >
                <Icon name="Copy" :size="14" /> Copy
              </button>
            </div>
            <p v-else class="text-[rgb(var(--foreground-muted))] py-8">Caption will appear here</p>
          </div>
        </div>

        <div v-if="imageSrc && !processing" class="mt-6 flex gap-3">
          <button
            class="px-5 py-3 rounded-xl bg-gradient-to-r from-accent to-accent-hover text-white font-medium flex items-center gap-2 shadow-lg shadow-accent/25"
            @click="generateCaption"
          >
            <Icon name="Sparkles" :size="18" /> Generate Caption
          </button>
          <button
            class="px-5 py-3 rounded-xl bg-[rgb(var(--glass))] border border-[rgb(var(--border))] font-medium flex items-center gap-2 hover:border-accent/50 transition"
            @click="clear"
          >
            <Icon name="Trash2" :size="18" /> Clear
          </button>
        </div>
      </div>

      <div v-if="loadError" class="glass-solid rounded-2xl p-6 border border-red-900/30">
        <p class="text-red-900 text-sm">{{ loadError }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useSeo({
  title: "Image Captioning | Joel Stephen - Portfolio",
  description: "AI-powered image descriptions run entirely in the browser.",
  path: "/project/image-captioning",
  breadcrumbTitle: "Image Captioning",
  projectSchema: {
    name: "Image Captioning",
    description: "AI-powered image descriptions run entirely in the browser.",
  },
});

import { ref, onMounted, onUnmounted } from "vue";
import { useDropZone, useClipboard } from "@vueuse/core";
import Icon from "~/components/ui/Icon.vue";

definePageMeta({ layout: "default" });

const dropZoneRef = ref<HTMLElement | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);
const imageSrc = ref<string | null>(null);
const caption = ref("");
const processing = ref(false);
const loadError = ref("");
const { copy } = useClipboard({ copiedDuring: 2000 });

let pipelineFn: ((img: string | HTMLImageElement) => Promise<{ generated_text: string }[]>) | null = null;
let currentFile: File | null = null;

const { isOverDropZone } = useDropZone(dropZoneRef, {
  onDrop: (files) => {
    if (files[0]?.type.startsWith("image/")) loadImage(files[0]);
  },
});

async function initPipeline() {
  if (pipelineFn) return;
  try {
    const { pipeline } = await import("@huggingface/transformers");
    const captioner = await pipeline("image-to-text", "Xenova/vit-gpt2-image-captioning");
    pipelineFn = captioner;
  } catch (e) {
    loadError.value = e instanceof Error ? e.message : "Failed to load AI model";
  }
}

function loadImage(file: File) {
  if (imageSrc.value) URL.revokeObjectURL(imageSrc.value);
  imageSrc.value = URL.createObjectURL(file);
  caption.value = "";
  currentFile = file;
}

function onFileSelect(e: Event) {
  const f = (e.target as HTMLInputElement).files?.[0];
  if (f?.type.startsWith("image/")) loadImage(f);
}

async function generateCaption() {
  if (!imageSrc.value || !pipelineFn) return;
  processing.value = true;
  caption.value = "";
  try {
    await initPipeline();
    if (!pipelineFn) return;
    const result = await pipelineFn(imageSrc.value);
    caption.value = result[0]?.generated_text ?? "No caption generated";
  } catch (e) {
    caption.value = "";
    loadError.value = e instanceof Error ? e.message : "Caption generation failed";
  }
  processing.value = false;
}

function copyCaption() {
  if (caption.value) copy(caption.value);
}

function clear() {
  if (imageSrc.value) URL.revokeObjectURL(imageSrc.value);
  imageSrc.value = null;
  caption.value = "";
  currentFile = null;
  if (fileInput.value) fileInput.value.value = "";
}

onMounted(() => {
  initPipeline();
});

onUnmounted(() => {
  if (imageSrc.value) URL.revokeObjectURL(imageSrc.value);
});
</script>
