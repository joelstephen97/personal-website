import { ref } from "vue";
import { useMotionValue, useSpring } from "motion-v";
import { SPRING } from "~/constants/motion";

export function useCardTilt(options?: { maxTilt?: number }) {
  const maxTilt = options?.maxTilt ?? 5;
  const cardRef = ref<HTMLElement | null>(null);

  // Raw target rotations, spring-smoothed for a premium settle.
  const rotateXRaw = useMotionValue(0);
  const rotateYRaw = useMotionValue(0);
  const rotateX = useSpring(rotateXRaw, SPRING.soft);
  const rotateY = useSpring(rotateYRaw, SPRING.soft);

  const reduce =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function onMouseMove(e: MouseEvent) {
    if (reduce) return;
    const el = cardRef.value;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const xPercent = (e.clientX - rect.left) / rect.width;
    const yPercent = (e.clientY - rect.top) / rect.height;
    rotateYRaw.set((xPercent - 0.5) * maxTilt * 2);
    rotateXRaw.set((0.5 - yPercent) * maxTilt * 2);
  }

  function onMouseLeave() {
    rotateXRaw.set(0);
    rotateYRaw.set(0);
  }

  // Bind on a <Motion> element: :style="tiltStyle"
  const tiltStyle = {
    rotateX,
    rotateY,
    transformPerspective: 800,
  };

  return { cardRef, tiltStyle, onMouseMove, onMouseLeave };
}
