<template>
  <div class="min-h-screen bg-[rgb(var(--bg))] px-6 py-12">
    <div class="max-w-4xl mx-auto">
      <div class="flex items-center gap-3 mb-8">
        <BackToProjects />
        <h1 class="text-3xl font-bold text-[rgb(var(--foreground))]">
          Speech to Text
        </h1>
      </div>

      <p class="text-[rgb(var(--foreground-muted))] mb-8">
        Transcribe audio with Whisper AI—runs entirely in your browser. Upload a
        file or record from your microphone.
      </p>

      <div class="glass-solid rounded-2xl p-6 mb-6">
        <div class="flex flex-wrap gap-4 mb-6">
          <button
            class="px-5 py-3 rounded-xl bg-[rgb(var(--glass))] border border-[rgb(var(--border))] font-medium flex items-center gap-2 hover:border-accent/50 transition"
            :disabled="processing"
            @click="fileInput?.click()"
          >
            <Icon name="Upload" :size="18" /> Upload Audio
          </button>
          <input
            ref="fileInput"
            type="file"
            accept="audio/*"
            class="hidden"
            @change="onFileSelect"
          />
          <button
            class="px-5 py-3 rounded-xl font-medium flex items-center gap-2 transition"
            :class="
              recording
                ? 'bg-red-900 text-white'
                : 'bg-[rgb(var(--glass))] border border-[rgb(var(--border))] hover:border-accent/50'
            "
            :disabled="processing"
            @click="toggleRecord"
          >
            <Icon :name="recording ? 'Square' : 'Mic'" :size="18" />
            {{ recording ? "Stop" : "Record" }}
          </button>
        </div>

        <div v-if="audioUrl" class="mb-6">
          <p
            class="text-xs text-[rgb(var(--foreground-muted))] uppercase tracking-wide mb-2"
          >
            Audio
          </p>
          <audio :src="audioUrl" controls class="w-full rounded-lg" />
        </div>

        <div v-if="processing" class="flex items-center gap-3 py-8">
          <div
            class="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin"
          />
          <span class="text-accent text-sm">Transcribing...</span>
        </div>

        <div v-else-if="transcript" class="space-y-2">
          <div class="flex items-center justify-between">
            <p
              class="text-xs text-[rgb(var(--foreground-muted))] uppercase tracking-wide"
            >
              Transcript
            </p>
            <button
              class="text-sm text-accent font-medium flex items-center gap-1 hover:opacity-80"
              @click="copyTranscript"
            >
              <Icon name="Copy" :size="14" /> Copy
            </button>
          </div>
          <p
            class="text-[rgb(var(--foreground))] leading-relaxed whitespace-pre-wrap"
          >
            {{ transcript }}
          </p>
        </div>

        <div v-else-if="audioUrl && !processing" class="py-8 text-center">
          <button
            class="px-6 py-3 rounded-xl bg-gradient-to-r from-accent to-accent-hover text-white font-medium flex items-center gap-2 mx-auto shadow-lg shadow-accent/25"
            @click="transcribe"
          >
            <Icon name="Sparkles" :size="18" /> Transcribe
          </button>
        </div>

        <div v-if="loadError" class="mt-4 text-amber-600 text-sm">
          {{ loadError }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from "vue";
import { useClipboard } from "@vueuse/core";
import Icon from "~/components/ui/Icon.vue";

useSeo({
  title: "Speech to Text | Joel Stephen - Portfolio",
  description:
    "Transcribe audio with Whisper AI—runs entirely in your browser.",
  path: "/project/speech-to-text",
  breadcrumbTitle: "Speech to Text",
  projectSchema: {
    name: "Speech to Text",
    description:
      "Transcribe audio with Whisper AI—runs entirely in your browser.",
  },
});

definePageMeta({ layout: "project-detail" });

const fileInput = ref<HTMLInputElement | null>(null);
const audioUrl = ref<string | null>(null);
const transcript = ref("");
const processing = ref(false);
const recording = ref(false);
const { copy } = useClipboard({ copiedDuring: 2000 });

const whisper = useWhisperTranscriber();
const { loadError: pipelineError, initPipeline } = whisper;
const localError = ref("");
const loadError = computed(() => pipelineError.value || localError.value);
let mediaRecorder: MediaRecorder | null = null;
let recordedChunks: Blob[] = [];

function onFileSelect(e: Event) {
  const f = (e.target as HTMLInputElement).files?.[0];
  if (f?.type.startsWith("audio/")) {
    if (audioUrl.value) URL.revokeObjectURL(audioUrl.value);
    audioUrl.value = URL.createObjectURL(f);
    transcript.value = "";
  }
}

function toggleRecord() {
  if (recording.value) {
    stopRecording();
  } else {
    startRecording();
  }
}

async function startRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    recordedChunks = [];
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size) recordedChunks.push(e.data);
    };
    mediaRecorder.onstop = () => {
      stream.getTracks().forEach((t) => t.stop());
      if (recordedChunks.length) {
        const blob = new Blob(recordedChunks, { type: "audio/webm" });
        if (audioUrl.value) URL.revokeObjectURL(audioUrl.value);
        audioUrl.value = URL.createObjectURL(blob);
        transcript.value = "";
      }
    };
    mediaRecorder.start();
    recording.value = true;
  } catch {
    localError.value = "Microphone access denied";
  }
}

function stopRecording() {
  if (mediaRecorder?.state !== "inactive") {
    mediaRecorder?.stop();
  }
  recording.value = false;
}

async function transcribe() {
  if (!audioUrl.value) return;
  processing.value = true;
  transcript.value = "";
  localError.value = "";
  try {
    await initPipeline();
    const fn = whisper.transcriber;
    if (!fn) return;
    const result = await fn(audioUrl.value);
    transcript.value = result?.text?.trim() ?? "No speech detected";
  } catch (e) {
    localError.value = e instanceof Error ? e.message : "Transcription failed";
  }
  processing.value = false;
}

function copyTranscript() {
  if (transcript.value) copy(transcript.value);
}

onUnmounted(() => {
  if (audioUrl.value) URL.revokeObjectURL(audioUrl.value);
  stopRecording();
});
</script>
