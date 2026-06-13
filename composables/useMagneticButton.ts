import { reactive, ref, onUnmounted } from "vue";
import { useMotionValue, useSpring } from "motion-v";
import { SPRING } from "~/constants/motion";

export function useMagneticButton(options?: { strength?: number }) {
  const strength = options?.strength ?? 0.3;
  const buttonRef = ref<HTMLElement | null>(null);

  const xRaw = useMotionValue(0);
  const yRaw = useMotionValue(0);
  const x = useSpring(xRaw, SPRING.magnetic);
  const y = useSpring(yRaw, SPRING.magnetic);

  // Colors/shadow transition via CSS; transform is owned by the spring (excluded
  // from CSS transitions so the two systems don't fight).
  const magneticStyle = reactive({
    transform: "translate3d(0px, 0px, 0)",
    transition:
      "color 0.2s ease, background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease",
  });

  function sync() {
    magneticStyle.transform = `translate3d(${x.get().toFixed(2)}px, ${y.get().toFixed(2)}px, 0)`;
  }
  const stopX = x.on("change", sync);
  const stopY = y.on("change", sync);
  onUnmounted(() => {
    stopX();
    stopY();
  });

  const reduce =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function onMouseMove(e: MouseEvent) {
    if (reduce) return;
    const el = buttonRef.value;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    xRaw.set((e.clientX - (rect.left + rect.width / 2)) * strength);
    yRaw.set((e.clientY - (rect.top + rect.height / 2)) * strength);
  }

  function onMouseLeave() {
    xRaw.set(0);
    yRaw.set(0);
  }

  return { buttonRef, magneticStyle, onMouseMove, onMouseLeave };
}
