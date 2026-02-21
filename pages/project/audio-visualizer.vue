<template>
  <div class="min-h-screen bg-[rgb(var(--bg))] px-6 py-12">
    <div class="max-w-4xl mx-auto">
      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center gap-3">
          <NuxtLink to="/project" class="w-8 h-8 rounded-lg bg-[rgb(var(--glass))] border border-[rgb(var(--border))] flex items-center justify-center hover:border-accent/50 transition-colors">
            <Icon name="ArrowLeft" :size="16" class="text-[rgb(var(--foreground-secondary))]" />
          </NuxtLink>
          <h1 class="text-3xl font-bold text-[rgb(var(--foreground))]">Audio Visualizer</h1>
        </div>
        <DarkModeToggle />
      </div>

      <div class="glass-solid rounded-2xl p-6 mb-6">
        <div class="flex flex-wrap gap-4 items-end">
          <button
            class="px-5 py-3 rounded-xl bg-[rgb(var(--glass))] border border-[rgb(var(--border))] text-[rgb(var(--foreground))] font-semibold flex items-center gap-2 hover:border-accent/50 transition"
            @click="fileInput?.click()"
          >
            <Icon name="Upload" :size="18" /> Upload Audio
          </button>
          <input ref="fileInput" type="file" accept="audio/*" class="hidden" @change="onFileSelect" />

          <button
            class="px-5 py-3 rounded-xl font-semibold flex items-center gap-2 transition"
            :class="micActive
              ? 'bg-accent text-white shadow-lg shadow-accent/25'
              : 'bg-[rgb(var(--glass))] border border-[rgb(var(--border))] text-[rgb(var(--foreground))] hover:border-accent/50'"
            @click="toggleMic"
          >
            <Icon :name="micActive ? 'MicOff' : 'Mic'" :size="18" />
            {{ micActive ? "Stop Mic" : "Use Microphone" }}
          </button>

          <div v-if="audioSrc" class="flex gap-2">
            <button
              class="px-5 py-3 rounded-xl bg-gradient-to-r from-accent to-accent-hover text-white font-semibold shadow-lg shadow-accent/25 flex items-center gap-2"
              @click="togglePlay"
            >
              <Icon :name="isPlaying ? 'Pause' : 'Play'" :size="18" />
              {{ isPlaying ? "Pause" : "Play" }}
            </button>
          </div>

          <div>
            <label class="text-xs text-[rgb(var(--foreground-muted))] uppercase tracking-wide block mb-1">Mode</label>
            <select v-model="vizMode">
              <option value="bars">Frequency Bars</option>
              <option value="waveform">Waveform</option>
              <option value="circular">Circular</option>
            </select>
          </div>

          <button
            class="px-3 py-3 rounded-xl bg-[rgb(var(--glass))] border border-[rgb(var(--border))] text-[rgb(var(--foreground-secondary))] hover:border-accent/50 transition"
            title="Fullscreen"
            @click="toggleFullscreen"
          >
            <Icon :name="isFullscreen ? 'Minimize' : 'Maximize'" :size="18" />
          </button>
        </div>

        <p v-if="fileName" class="text-sm text-[rgb(var(--foreground-secondary))] mt-3">{{ fileName }}</p>

        <!-- Progress bar -->
        <div v-if="audioSrc && duration > 0" class="mt-4">
          <div
            class="h-1.5 rounded-full bg-[rgb(var(--border))] cursor-pointer relative"
            @click="seek"
          >
            <div class="h-full rounded-full bg-accent transition-all" :style="{ width: progressPct + '%' }" />
          </div>
          <div class="flex justify-between text-xs text-[rgb(var(--foreground-muted))] mt-1 font-mono">
            <span>{{ formatTime(currentTime) }}</span>
            <span>{{ formatTime(duration) }}</span>
          </div>
        </div>

        <!-- Controls -->
        <div class="flex flex-wrap gap-6 mt-4 items-end">
          <div class="flex-1 min-w-[120px]">
            <label class="text-xs text-[rgb(var(--foreground-muted))] uppercase tracking-wide block mb-1">Volume: {{ Math.round(gain * 100) }}%</label>
            <input v-model.number="gain" type="range" min="0" max="1" step="0.01" class="w-full" />
          </div>
          <div class="flex-1 min-w-[120px]">
            <label class="text-xs text-[rgb(var(--foreground-muted))] uppercase tracking-wide block mb-1">Smoothing: {{ smoothing.toFixed(2) }}</label>
            <input v-model.number="smoothing" type="range" min="0" max="0.99" step="0.01" class="w-full" />
          </div>
        </div>
      </div>

      <div ref="vizContainer" class="glass-solid rounded-2xl p-6">
        <canvas
          ref="canvas"
          class="w-full rounded-xl"
          style="height: 300px"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from "vue";
import Icon from "~/components/ui/Icon.vue";

definePageMeta({ layout: false });

const canvas = ref<HTMLCanvasElement | null>(null);
const vizContainer = ref<HTMLElement | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);
const vizMode = ref("bars");
const fileName = ref("");
const isPlaying = ref(false);
const micActive = ref(false);
const audioSrc = ref("");
const gain = ref(0.8);
const smoothing = ref(0.8);
const currentTime = ref(0);
const duration = ref(0);
const isFullscreen = ref(false);

let audioCtx: AudioContext | null = null;
let analyser: AnalyserNode | null = null;
let gainNode: GainNode | null = null;
let sourceNode: AudioNode | null = null;
let audioEl: HTMLAudioElement | null = null;
let micStream: MediaStream | null = null;
let animFrame: number | null = null;
let prevObjUrl: string | null = null;
let canvasW = 0;
let canvasH = 0;

const progressPct = ref(0);
let timeUpdateInterval: ReturnType<typeof setInterval> | null = null;

function formatTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

function initAudioContext() {
  if (!audioCtx) {
    audioCtx = new AudioContext();
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 512;
    analyser.smoothingTimeConstant = smoothing.value;
    gainNode = audioCtx.createGain();
    gainNode.gain.value = gain.value;
    gainNode.connect(audioCtx.destination);
  }
}

watch(gain, (v) => { if (gainNode) gainNode.gain.value = v; });
watch(smoothing, (v) => { if (analyser) analyser.smoothingTimeConstant = v; });

function onFileSelect(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  stopMic();
  fileName.value = file.name;
  if (prevObjUrl) URL.revokeObjectURL(prevObjUrl);
  prevObjUrl = URL.createObjectURL(file);
  audioSrc.value = prevObjUrl;
  setupAudioElement();
}

function setupAudioElement() {
  initAudioContext();
  if (audioEl) { audioEl.pause(); audioEl.remove(); }
  if (sourceNode) { sourceNode.disconnect(); sourceNode = null; }

  audioEl = new Audio(audioSrc.value);
  audioEl.crossOrigin = "anonymous";
  sourceNode = audioCtx!.createMediaElementSource(audioEl);
  sourceNode.connect(analyser!);
  analyser!.connect(gainNode!);

  audioEl.addEventListener("loadedmetadata", () => { duration.value = audioEl!.duration; });
  audioEl.addEventListener("ended", () => {
    isPlaying.value = false;
    stopTimeUpdate();
  });
}

function startTimeUpdate() {
  stopTimeUpdate();
  timeUpdateInterval = setInterval(() => {
    if (audioEl) {
      currentTime.value = audioEl.currentTime;
      progressPct.value = duration.value > 0 ? (audioEl.currentTime / duration.value) * 100 : 0;
    }
  }, 100);
}

function stopTimeUpdate() {
  if (timeUpdateInterval) { clearInterval(timeUpdateInterval); timeUpdateInterval = null; }
}

function togglePlay() {
  if (!audioEl || !audioCtx) return;
  if (audioCtx.state === "suspended") audioCtx.resume();
  if (isPlaying.value) {
    audioEl.pause();
    isPlaying.value = false;
    stopTimeUpdate();
  } else {
    audioEl.play();
    isPlaying.value = true;
    startTimeUpdate();
    startVisualization();
  }
}

function seek(e: MouseEvent) {
  if (!audioEl || !duration.value) return;
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
  const pct = (e.clientX - rect.left) / rect.width;
  audioEl.currentTime = pct * duration.value;
  currentTime.value = audioEl.currentTime;
  progressPct.value = pct * 100;
}

async function toggleMic() {
  if (micActive.value) { stopMic(); return; }
  initAudioContext();
  if (audioEl) { audioEl.pause(); isPlaying.value = false; stopTimeUpdate(); }
  if (sourceNode) { sourceNode.disconnect(); sourceNode = null; }

  try {
    micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    sourceNode = audioCtx!.createMediaStreamSource(micStream);
    sourceNode.connect(analyser!);
    analyser!.disconnect();
    analyser!.connect(gainNode!);
    micActive.value = true;
    startVisualization();
  } catch {
    micActive.value = false;
  }
}

function stopMic() {
  if (micStream) { micStream.getTracks().forEach((t) => t.stop()); micStream = null; }
  if (sourceNode) { sourceNode.disconnect(); sourceNode = null; }
  micActive.value = false;
  if (analyser && gainNode) {
    analyser.disconnect();
    analyser.connect(gainNode);
  }
}

function startVisualization() {
  if (animFrame) cancelAnimationFrame(animFrame);
  draw();
}

function updateCanvasSize() {
  if (!canvas.value) return;
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.value.getBoundingClientRect();
  canvasW = rect.width;
  canvasH = rect.height;
  canvas.value.width = canvasW * dpr;
  canvas.value.height = canvasH * dpr;
}

function draw() {
  if (!analyser || !canvas.value) return;
  updateCanvasSize();
  const dpr = window.devicePixelRatio || 1;
  const ctx = canvas.value.getContext("2d")!;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const w = canvasW;
  const h = canvasH;

  const isDark = document.documentElement.classList.contains("dark");
  ctx.fillStyle = isDark ? "#0a0a0a" : "#fafafa";
  ctx.fillRect(0, 0, w, h);

  const bufferLength = analyser.frequencyBinCount;

  if (vizMode.value === "bars") {
    const data = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(data);
    const barW = w / bufferLength * 2.5;
    const usableBars = Math.floor(w / barW);

    for (let i = 0; i < usableBars && i < bufferLength; i++) {
      const barH = (data[i] / 255) * h * 0.9;
      const x = i * barW;
      const gradient = ctx.createLinearGradient(0, h, 0, h - barH);
      gradient.addColorStop(0, "#ef4444");
      gradient.addColorStop(1, "#f97316");
      ctx.fillStyle = gradient;
      ctx.fillRect(x, h - barH, barW - 1, barH);
    }
  } else if (vizMode.value === "waveform") {
    const data = new Uint8Array(bufferLength);
    analyser.getByteTimeDomainData(data);

    ctx.lineWidth = 2;
    ctx.strokeStyle = "#ef4444";
    ctx.beginPath();
    const sliceW = w / bufferLength;
    for (let i = 0; i < bufferLength; i++) {
      const v = data[i] / 128.0;
      const y = (v * h) / 2;
      if (i === 0) ctx.moveTo(0, y); else ctx.lineTo(i * sliceW, y);
    }
    ctx.stroke();

    ctx.strokeStyle = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(0, h / 2);
    ctx.lineTo(w, h / 2);
    ctx.stroke();
    ctx.setLineDash([]);
  } else {
    const data = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(data);
    const cx = w / 2;
    const cy = h / 2;
    const radius = Math.min(cx, cy) * 0.5;

    ctx.beginPath();
    for (let i = 0; i < bufferLength; i++) {
      const angle = (i / bufferLength) * Math.PI * 2 - Math.PI / 2;
      const amp = (data[i] / 255) * radius * 0.8;
      const r = radius + amp;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.closePath();
    const grad = ctx.createRadialGradient(cx, cy, radius * 0.5, cx, cy, radius * 2);
    grad.addColorStop(0, "rgba(239, 68, 68, 0.3)");
    grad.addColorStop(1, "rgba(249, 115, 22, 0.05)");
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(239, 68, 68, 0.2)";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.save();
    ctx.shadowColor = "rgba(239, 68, 68, 0.5)";
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(cx, cy, 4, 0, Math.PI * 2);
    ctx.fillStyle = "#ef4444";
    ctx.fill();
    ctx.restore();
  }

  if (isPlaying.value || micActive.value) {
    animFrame = requestAnimationFrame(draw);
  }
}

function toggleFullscreen() {
  if (!vizContainer.value) return;
  if (document.fullscreenElement) {
    document.exitFullscreen();
    isFullscreen.value = false;
  } else {
    vizContainer.value.requestFullscreen();
    isFullscreen.value = true;
  }
}

watch(vizMode, () => { if (isPlaying.value || micActive.value) startVisualization(); });

onMounted(() => {
  document.addEventListener("fullscreenchange", () => { isFullscreen.value = !!document.fullscreenElement; });
});

onUnmounted(() => {
  if (animFrame) cancelAnimationFrame(animFrame);
  stopTimeUpdate();
  stopMic();
  if (audioEl) { audioEl.pause(); audioEl.remove(); }
  if (audioCtx) audioCtx.close();
  if (prevObjUrl) URL.revokeObjectURL(prevObjUrl);
});
</script>
