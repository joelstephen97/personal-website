"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

export interface GuillocheProps {
  className?: string;
  /** Center of the sunburst/ring pattern in canvas px; defaults to the element center. */
  focus?: [number, number];
}

const RAY_COUNT = 240;
const RAY_ALPHA = 0.045;
const RING_ALPHA = 0.075;
const RING_SPACING = 14;
const DPR_CAP = 2;
const RESIZE_DEBOUNCE_MS = 120;
const LEFT_FADE_FRACTION = 0.6;

/**
 * A decorative watch-dial guilloché pattern: a canvas sunburst of 240 rays
 * plus wavy concentric rings, faded out across the left 60% of the frame,
 * with a slow conic-gradient "sweep" highlight layered on top. Draws only
 * on the client (guarded against a `null` 2D context, e.g. under jsdom),
 * redraws on debounced resize and on `data-theme` change, and pauses the
 * sweep animation while off-screen. Entirely decorative and static aside
 * from the sweep, which itself is a CSS animation removed under reduced
 * motion (see `.sweep` in globals.css).
 */
export function Guilloche({ className, focus }: GuillocheProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sweepRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    function draw() {
      if (!canvas) return;
      const parent = canvas.parentElement;
      const width = parent?.clientWidth ?? canvas.clientWidth;
      const height = parent?.clientHeight ?? canvas.clientHeight;
      if (width <= 0 || height <= 0) return;

      const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      const stroke =
        getComputedStyle(document.documentElement).getPropertyValue("--text-primary").trim() ||
        "white";
      const cx = focus ? focus[0] : width / 2;
      const cy = focus ? focus[1] : height / 2;
      const maxRadius = Math.hypot(Math.max(cx, width - cx), Math.max(cy, height - cy));

      ctx.save();
      ctx.strokeStyle = stroke;
      ctx.globalAlpha = RAY_ALPHA;
      ctx.lineWidth = 1;
      for (let i = 0; i < RAY_COUNT; i++) {
        const theta = (i / RAY_COUNT) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(theta) * maxRadius, cy + Math.sin(theta) * maxRadius);
        ctx.stroke();
      }
      ctx.restore();

      ctx.save();
      ctx.strokeStyle = stroke;
      ctx.globalAlpha = RING_ALPHA;
      ctx.lineWidth = 1;
      for (let r = RING_SPACING; r < maxRadius; r += RING_SPACING) {
        ctx.beginPath();
        for (let deg = 0; deg <= 360; deg += 2) {
          const theta = (deg * Math.PI) / 180;
          const wobble = r + Math.sin(theta * 24 + r * 0.05) * 2.2;
          const x = cx + Math.cos(theta) * wobble;
          const y = cy + Math.sin(theta) * wobble;
          if (deg === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      ctx.restore();

      const fadeWidth = width * LEFT_FADE_FRACTION;
      const gradient = ctx.createLinearGradient(0, 0, fadeWidth, 0);
      gradient.addColorStop(0, "rgba(0,0,0,1)");
      gradient.addColorStop(1, "rgba(0,0,0,0)");
      ctx.save();
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, fadeWidth, height);
      ctx.restore();
    }

    draw();

    let resizeTimer: ReturnType<typeof setTimeout> | undefined;
    function onResize() {
      window.clearTimeout(resizeTimer);
      resizeTimer = setTimeout(draw, RESIZE_DEBOUNCE_MS);
    }
    window.addEventListener("resize", onResize);

    let themeObserver: MutationObserver | undefined;
    if ("MutationObserver" in window) {
      themeObserver = new MutationObserver(draw);
      themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-theme"],
      });
    }

    return () => {
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      themeObserver?.disconnect();
    };
  }, [focus]);

  useEffect(() => {
    const sweep = sweepRef.current;
    if (!sweep || !("IntersectionObserver" in window)) return;

    const io = new IntersectionObserver(([entry]) => {
      sweep.style.animationPlayState = entry?.isIntersecting ? "running" : "paused";
    });
    io.observe(sweep);
    return () => io.disconnect();
  }, []);

  return (
    <div className={cn("relative overflow-hidden", className)} aria-hidden="true">
      <canvas ref={canvasRef} className="absolute inset-0 size-full" />
      <div ref={sweepRef} className="sweep pointer-events-none absolute inset-0" />
    </div>
  );
}
