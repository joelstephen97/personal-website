import { useMouseInElement } from "@vueuse/core";
import { computed, ref, type Ref } from "vue";

export function useMagneticButton(options?: { strength?: number }) {
  const strength = options?.strength ?? 0.3;
  const buttonRef = ref<HTMLElement | null>(null);
  const isNear = ref(false);

  const { elementX, elementY, elementWidth, elementHeight, isOutside } =
    useMouseInElement(buttonRef as Ref<HTMLElement>);

  const magneticStyle = computed(() => {
    if (isOutside.value || !isNear.value) {
      return {
        transform: "translate(0, 0) scale(1)",
        transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
      };
    }

    const centerX = elementWidth.value / 2;
    const centerY = elementHeight.value / 2;
    const offsetX = (elementX.value - centerX) * strength;
    const offsetY = (elementY.value - centerY) * strength;

    return {
      transform: `translate(${offsetX.toFixed(1)}px, ${offsetY.toFixed(1)}px) scale(1.03)`,
      transition: "transform 0.15s ease-out",
    };
  });

  function onMouseEnter() {
    isNear.value = true;
  }

  function onMouseLeave() {
    isNear.value = false;
  }

  return { buttonRef, magneticStyle, onMouseEnter, onMouseLeave };
}
