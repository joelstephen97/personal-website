<template>
  <div ref="containerRef" class="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
    <canvas ref="canvasRef" class="w-full h-full" />
  </div>
</template>

<script setup lang="ts">
import { useMouseInElement, useRafFn, useMediaQuery } from "@vueuse/core";

const containerRef = ref<HTMLElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);

const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
const { elementX, elementY, isOutside } = useMouseInElement(containerRef);

interface Dot {
  x: number;
  y: number;
  baseOpacity: number;
}

const dots = ref<Dot[]>([]);
const SPACING = 40;
const DOT_RADIUS = 1.2;
const INFLUENCE_RADIUS = 120;
const MAX_OPACITY = 0.15;
const LINE_OPACITY = 0.06;
const LINE_DISTANCE = 80;

function initDots(width: number, height: number) {
  const result: Dot[] = [];
  const cols = Math.floor(width / SPACING);
  const rows = Math.floor(height / SPACING);
  const offsetX = (width - cols * SPACING) / 2;
  const offsetY = (height - rows * SPACING) / 2;

  for (let row = 0; row <= rows; row++) {
    for (let col = 0; col <= cols; col++) {
      result.push({
        x: offsetX + col * SPACING,
        y: offsetY + row * SPACING,
        baseOpacity: 0.03 + Math.random() * 0.04,
      });
    }
  }
  return result;
}

let prevWidth = 0;
let prevHeight = 0;

useRafFn(() => {
  const canvas = canvasRef.value;
  const container = containerRef.value;
  if (!canvas || !container || reducedMotion.value) return;

  const rect = container.getBoundingClientRect();
  const width = rect.width;
  const height = rect.height;

  if (width !== prevWidth || height !== prevHeight) {
    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    dots.value = initDots(width, height);
    prevWidth = width;
    prevHeight = height;
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  ctx.clearRect(0, 0, width, height);

  const style = getComputedStyle(document.documentElement);
  const accentRaw = style.getPropertyValue("--accent").trim();
  const mouseX = isOutside.value ? -9999 : elementX.value;
  const mouseY = isOutside.value ? -9999 : elementY.value;

  // Draw connections near cursor
  if (!isOutside.value) {
    const nearDots = dots.value.filter((d) => {
      const dx = d.x - mouseX;
      const dy = d.y - mouseY;
      return Math.sqrt(dx * dx + dy * dy) < INFLUENCE_RADIUS;
    });

    ctx.strokeStyle = `rgb(${accentRaw} / ${LINE_OPACITY})`;
    ctx.lineWidth = 0.5;
    for (let i = 0; i < nearDots.length; i++) {
      for (let j = i + 1; j < nearDots.length; j++) {
        const dx = nearDots[i].x - nearDots[j].x;
        const dy = nearDots[i].y - nearDots[j].y;
        if (Math.sqrt(dx * dx + dy * dy) < LINE_DISTANCE) {
          ctx.beginPath();
          ctx.moveTo(nearDots[i].x, nearDots[i].y);
          ctx.lineTo(nearDots[j].x, nearDots[j].y);
          ctx.stroke();
        }
      }
    }
  }

  // Draw dots
  for (const dot of dots.value) {
    const dx = dot.x - mouseX;
    const dy = dot.y - mouseY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const proximity = Math.max(0, 1 - dist / INFLUENCE_RADIUS);
    const opacity = dot.baseOpacity + proximity * (MAX_OPACITY - dot.baseOpacity);

    ctx.beginPath();
    ctx.arc(dot.x, dot.y, DOT_RADIUS + proximity * 1.2, 0, Math.PI * 2);
    ctx.fillStyle = `rgb(${accentRaw} / ${opacity})`;
    ctx.fill();
  }
}, { fpsLimit: 30 });
</script>
