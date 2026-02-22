<template>
  <div class="min-h-screen bg-[rgb(var(--bg))] px-6 py-12">
    <div class="max-w-5xl mx-auto">
      <div class="flex items-center gap-3 mb-8">
        <BackToProjects />
        <h1 class="text-3xl font-bold text-[rgb(var(--foreground))]">
          Screen Capture & Annotation
        </h1>
      </div>

      <p class="text-[rgb(var(--foreground-muted))] mb-8">
        Capture your screen, window, or tab. Draw annotations and share via Web Share API or copy to clipboard.
      </p>

      <div class="glass-solid rounded-2xl p-6 mb-6">
        <div class="flex flex-wrap gap-4 mb-6">
          <button
            v-if="!stream"
            class="px-5 py-3 rounded-xl bg-gradient-to-r from-accent to-accent-hover text-white font-medium flex items-center gap-2 shadow-lg shadow-accent/25"
            :disabled="capturing"
            @click="startCapture"
          >
            <Icon name="Monitor" :size="18" />
            {{ capturing ? "Starting..." : "Capture Screen" }}
          </button>
          <template v-else>
            <button
              class="px-5 py-3 rounded-xl bg-[rgb(var(--glass))] border border-[rgb(var(--border))] font-medium flex items-center gap-2 hover:border-accent/50 transition"
              @click="stopCapture"
            >
              <Icon name="Square" :size="18" /> Stop
            </button>
            <button
              class="px-5 py-3 rounded-xl bg-[rgb(var(--glass))] border border-[rgb(var(--border))] font-medium flex items-center gap-2 hover:border-accent/50 transition"
              @click="captureFrame"
            >
              <Icon name="Camera" :size="18" /> Capture Frame
            </button>
          </template>
        </div>

        <div v-if="!displayMediaSupported" class="text-amber-600 text-sm">
          Screen capture is not supported in this browser. Try Chrome, Edge, or Firefox.
        </div>

        <div v-if="stream" class="space-y-4">
          <div class="flex flex-wrap gap-2 items-center">
            <span class="text-xs text-[rgb(var(--foreground-muted))] uppercase">Tools</span>
            <button
              v-for="t in tools"
              :key="t.id"
              class="px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              :class="tool === t.id
                ? 'bg-accent text-white'
                : 'bg-[rgb(var(--glass))] border border-[rgb(var(--border))] hover:border-accent/50'"
              @click="tool = t.id"
            >
              <Icon :name="t.icon" :size="14" class="inline mr-1" />
              {{ t.label }}
            </button>
            <input v-model="strokeColor" type="color" class="w-8 h-8 rounded cursor-pointer border-0" title="Stroke color" />
            <button
              class="px-3 py-2 rounded-lg text-sm bg-[rgb(var(--glass))] border border-[rgb(var(--border))] hover:border-accent/50"
              @click="undo"
            >
              <Icon name="Undo2" :size="14" /> Undo
            </button>
          </div>

          <div
            ref="canvasContainer"
            class="relative rounded-xl overflow-hidden bg-black"
          >
            <video
              ref="videoRef"
              autoplay
              muted
              playsinline
              class="w-full max-h-[60vh] object-contain"
            />
            <canvas
              ref="canvasRef"
              class="absolute inset-0 w-full h-full cursor-crosshair"
              :style="{ cursor: tool === 'arrow' ? 'crosshair' : tool === 'rect' ? 'crosshair' : 'crosshair' }"
              @pointerdown="onPointerDown"
              @pointermove="onPointerMove"
              @pointerup="onPointerUp"
              @pointerleave="onPointerUp"
            />
          </div>
        </div>

        <div v-if="capturedImage" class="mt-6 space-y-4">
          <p class="text-sm font-medium text-[rgb(var(--foreground))]">Captured with annotations</p>
          <img
            :src="capturedImage"
            width="800"
            height="600"
            loading="lazy"
            alt="Captured"
            class="max-w-full rounded-xl border border-[rgb(var(--border))]"
          />
          <div class="flex gap-3">
            <button
              class="px-5 py-3 rounded-xl bg-gradient-to-r from-accent to-accent-hover text-white font-medium flex items-center gap-2"
              @click="shareImage"
            >
              <Icon name="Share2" :size="18" /> Share
            </button>
            <button
              class="px-5 py-3 rounded-xl bg-[rgb(var(--glass))] border border-[rgb(var(--border))] font-medium flex items-center gap-2 hover:border-accent/50"
              @click="copyToClipboard"
            >
              <Icon name="Copy" :size="18" /> Copy
            </button>
            <button
              class="px-5 py-3 rounded-xl bg-[rgb(var(--glass))] border border-[rgb(var(--border))] font-medium flex items-center gap-2 hover:border-accent/50"
              @click="downloadImage"
            >
              <Icon name="Download" :size="18" /> Download
            </button>
          </div>
          <p v-if="shareStatus" class="text-sm" :class="shareStatus === 'success' ? 'text-emerald-500' : 'text-amber-600'">
            {{ shareStatus === 'success' ? 'Shared successfully' : shareStatus }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useSeo({
  title: "Screen Capture & Annotation | Joel Stephen - Portfolio",
  description: "Capture screen, draw annotations, share via Web Share API.",
  path: "/project/screen-capture",
  breadcrumbTitle: "Screen Capture & Annotation",
  projectSchema: {
    name: "Screen Capture & Annotation",
    description: "Capture screen, draw annotations, share via Web Share API.",
  },
});

import { ref, computed, onUnmounted, watch } from "vue";
import { useShare, useClipboard } from "@vueuse/core";
import Icon from "~/components/ui/Icon.vue";

definePageMeta({ layout: "project-detail" });

const videoRef = ref<HTMLVideoElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);
const canvasContainer = ref<HTMLElement | null>(null);
const stream = ref<MediaStream | null>(null);
const capturing = ref(false);
const capturedImage = ref<string | null>(null);
const shareStatus = ref("");
const strokeColor = ref("#007AFF");
const tool = ref<"draw" | "arrow" | "rect">("draw");

const tools = [
  { id: "draw" as const, label: "Draw", icon: "Pencil" },
  { id: "arrow" as const, label: "Arrow", icon: "ArrowRight" },
  { id: "rect" as const, label: "Rect", icon: "Square" },
];

const displayMediaSupported = computed(() =>
  typeof navigator !== "undefined" && !!navigator.mediaDevices?.getDisplayMedia
);

const { share, isSupported: shareSupported } = useShare();
const { copy } = useClipboard();

interface Point { x: number; y: number; }
interface Stroke { tool: string; color: string; points: Point[]; }
const strokes = ref<Stroke[]>([]);
const currentStroke = ref<Stroke | null>(null);
const isDrawing = ref(false);
const startPoint = ref<Point | null>(null);

function getCanvasCoords(e: PointerEvent): Point {
  const c = canvasRef.value;
  if (!c) return { x: 0, y: 0 };
  const rect = c.getBoundingClientRect();
  const scaleX = c.width / rect.width;
  const scaleY = c.height / rect.height;
  return {
    x: (e.clientX - rect.left) * scaleX,
    y: (e.clientY - rect.top) * scaleY,
  };
}

function redraw() {
  const c = canvasRef.value;
  const v = videoRef.value;
  if (!c || !v) return;
  const ctx = c.getContext("2d");
  if (!ctx) return;
  ctx.clearRect(0, 0, c.width, c.height);
  ctx.drawImage(v, 0, 0, c.width, c.height);
  strokes.value.forEach((s) => {
    ctx.strokeStyle = s.color;
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    if (s.tool === "draw" && s.points.length > 1) {
      ctx.beginPath();
      ctx.moveTo(s.points[0].x, s.points[0].y);
      s.points.slice(1).forEach((p) => ctx.lineTo(p.x, p.y));
      ctx.stroke();
    } else if (s.tool === "arrow" && s.points.length === 2) {
      drawArrow(ctx, s.points[0], s.points[1]);
    } else if (s.tool === "rect" && s.points.length === 2) {
      const [a, b] = s.points;
      ctx.strokeRect(
        Math.min(a.x, b.x),
        Math.min(a.y, b.y),
        Math.abs(b.x - a.x),
        Math.abs(b.y - a.y)
      );
    }
  });
  if (currentStroke.value) {
    ctx.strokeStyle = currentStroke.value.color;
    ctx.lineWidth = 4;
    if (currentStroke.value.tool === "draw" && currentStroke.value.points.length > 1) {
      ctx.beginPath();
      ctx.moveTo(currentStroke.value.points[0].x, currentStroke.value.points[0].y);
      currentStroke.value.points.slice(1).forEach((p) => ctx.lineTo(p.x, p.y));
      ctx.stroke();
    } else if (currentStroke.value.tool === "arrow" && currentStroke.value.points.length === 2) {
      drawArrow(ctx, currentStroke.value.points[0], currentStroke.value.points[1]);
    } else if (currentStroke.value.tool === "rect" && currentStroke.value.points.length === 2) {
      const [a, b] = currentStroke.value.points;
      ctx.strokeRect(
        Math.min(a.x, b.x),
        Math.min(a.y, b.y),
        Math.abs(b.x - a.x),
        Math.abs(b.y - a.y)
      );
    }
  }
}

function drawArrow(ctx: CanvasRenderingContext2D, from: Point, to: Point) {
  const headLen = 15;
  const angle = Math.atan2(to.y - from.y, to.x - from.x);
  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(to.x, to.y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(to.x, to.y);
  ctx.lineTo(to.x - headLen * Math.cos(angle - Math.PI / 6), to.y - headLen * Math.sin(angle - Math.PI / 6));
  ctx.lineTo(to.x - headLen * Math.cos(angle + Math.PI / 6), to.y - headLen * Math.sin(angle + Math.PI / 6));
  ctx.closePath();
  ctx.fillStyle = ctx.strokeStyle;
  ctx.fill();
  ctx.stroke();
}

function onPointerDown(e: PointerEvent) {
  if (!canvasRef.value || !videoRef.value) return;
  isDrawing.value = true;
  const pt = getCanvasCoords(e);
  startPoint.value = pt;
  currentStroke.value = {
    tool: tool.value,
    color: strokeColor.value,
    points: [pt],
  };
}

function onPointerMove(e: PointerEvent) {
  if (!isDrawing.value || !currentStroke.value) return;
  const pt = getCanvasCoords(e);
  if (tool.value === "draw") {
    currentStroke.value.points.push(pt);
  } else if (tool.value === "arrow" || tool.value === "rect") {
    currentStroke.value.points = [startPoint.value!, pt];
  }
  redraw();
}

function onPointerUp() {
  if (currentStroke.value && currentStroke.value.points.length > 0) {
    strokes.value.push({ ...currentStroke.value });
  }
  currentStroke.value = null;
  startPoint.value = null;
  isDrawing.value = false;
}

function undo() {
  if (strokes.value.length) {
    strokes.value.pop();
    redraw();
  }
}

async function startCapture() {
  if (!displayMediaSupported.value) return;
  capturing.value = true;
  try {
    const mediaStream = await navigator.mediaDevices.getDisplayMedia({
      video: { displaySurface: "browser" },
      audio: false,
    });
    stream.value = mediaStream;
    await nextTick();
    if (videoRef.value) {
      videoRef.value.srcObject = mediaStream;
      videoRef.value.onloadedmetadata = () => {
        videoRef.value?.play();
        resizeCanvas();
      };
    }
    mediaStream.getVideoTracks()[0].onended = () => stopCapture();
  } catch {
    // User cancelled
  }
  capturing.value = false;
}

function resizeCanvas() {
  const v = videoRef.value;
  const c = canvasRef.value;
  const cont = canvasContainer.value;
  if (!v || !c || !cont) return;
  const rect = cont.getBoundingClientRect();
  c.width = v.videoWidth;
  c.height = v.videoHeight;
  c.style.width = "100%";
  c.style.height = "auto";
  c.style.maxHeight = "60vh";
  redraw();
}

watch(stream, (s) => {
  if (s && videoRef.value) {
    videoRef.value.onloadeddata = resizeCanvas;
  }
});

function stopCapture() {
  stream.value?.getTracks().forEach((t) => t.stop());
  stream.value = null;
  strokes.value = [];
  capturedImage.value = null;
  shareStatus.value = "";
}

function captureFrame() {
  const c = canvasRef.value;
  const v = videoRef.value;
  if (!c || !v) return;
  redraw();
  capturedImage.value = c.toDataURL("image/png");
}

async function shareImage() {
  if (!capturedImage.value) return;
  try {
    const res = await fetch(capturedImage.value);
    const blob = await res.blob();
    const file = new File([blob], "screenshot.png", { type: "image/png" });
    if (shareSupported.value) {
      await share({
        title: "Screenshot",
        files: [file],
      });
      shareStatus.value = "success";
    } else {
      await copy(capturedImage.value);
      shareStatus.value = "Share not supported; image copied to clipboard";
    }
  } catch (e) {
    shareStatus.value = e instanceof Error ? e.message : "Share failed";
  }
}

async function copyToClipboard() {
  if (!capturedImage.value) return;
  try {
    const res = await fetch(capturedImage.value);
    const blob = await res.blob();
    await navigator.clipboard.write([
      new ClipboardItem({ "image/png": blob }),
    ]);
    shareStatus.value = "Copied to clipboard";
  } catch {
    shareStatus.value = "Copy failed";
  }
}

function downloadImage() {
  if (!capturedImage.value) return;
  const a = document.createElement("a");
  a.href = capturedImage.value;
  a.download = `screenshot-${Date.now()}.png`;
  a.click();
}

onUnmounted(() => stopCapture());
</script>
